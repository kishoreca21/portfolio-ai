import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import * as ymod from 'yahoo-finance2'
import { ScreenerScraperPro } from 'screener-scraper-pro'

/* ═══════════════════════════════════════════════════════════════
   Portfolio AI v13 — Free Edition
   Endpoints:
     /quote?symbol=...      → Yahoo current price
     /financials?symbol=... → Screener.in quarterly results (real numbers)
     /news?ticker=...       → Yahoo news headlines
     /groq/*                → Groq Chat Completions (free Llama 3.3 70B)
   ═══════════════════════════════════════════════════════════════ */

function makeYahooClient() {
  if (typeof ymod.YahooFinance === 'function') return new ymod.YahooFinance()
  if (typeof ymod.default === 'function') return new ymod.default()
  if (typeof ymod.default?.YahooFinance === 'function') return new ymod.default.YahooFinance()
  return ymod.default || ymod
}
const yahooFinance = makeYahooClient()

/* ── In-memory caches ── */
const quoteCache = new Map(); const QUOTE_TTL = 20 * 1000          // 20s
const finCache   = new Map(); const FIN_TTL   = 24 * 60 * 60 * 1000 // 24h (screener updates daily)
const newsCache  = new Map(); const NEWS_TTL  = 30 * 60 * 1000      // 30 min

function sendJson(res, status, obj) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(obj))
}

/* Indian fiscal-quarter from a header like "Dec 2025" or "Mar 2026" */
function parseQuarterHeader(header) {
  if (!header) return 'Latest Quarter'
  const m = header.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[^\d]*(\d{4})/i)
  if (!m) return header
  const monthName = m[1].toLowerCase()
  const year = parseInt(m[2], 10)
  const monthMap = { jan:1,feb:2,mar:3,apr:4,may:5,jun:6,jul:7,aug:8,sep:9,oct:10,nov:11,dec:12 }
  const mo = monthMap[monthName]
  let q, fy
  if (mo === 6)       { q = 'Q1'; fy = year + 1 }
  else if (mo === 9)  { q = 'Q2'; fy = year + 1 }
  else if (mo === 12) { q = 'Q3'; fy = year + 1 }
  else if (mo === 3)  { q = 'Q4'; fy = year }
  else                { return header }
  return `${q} FY${String(fy).slice(-2)}`
}

/* Take a screener-scraper-pro `quarters` block and shape it for the UI */
function shapeQuartersBlock(quarters) {
  if (!quarters?.headers?.length || !quarters?.data) return null
  const headers = quarters.headers              // e.g. ["Mar 2024", "Jun 2024", ...]
  const lastIdx = headers.length - 1
  const prevYearIdx = lastIdx - 4               // same quarter, prior year

  /* screener.in row keys vary; check all common variants */
  const sales   = quarters.data['Sales']     || quarters.data['Sales +']     || quarters.data['Revenue'] || quarters.data['Revenue +']
  const np      = quarters.data['Net Profit'] || quarters.data['Net Profit +'] || quarters.data['Profit'] || quarters.data['Profit +']
  const opm     = quarters.data['OPM %']      || quarters.data['Operating Profit Margin %']

  if (!sales || !np) return null

  const fmt = (v) => (typeof v === 'string' ? v.trim() : (v == null ? '—' : String(v)))
  const num = (v) => {
    if (v == null) return null
    const cleaned = String(v).replace(/,/g, '').replace(/[^\d.\-]/g, '')
    const n = parseFloat(cleaned)
    return isNaN(n) ? null : n
  }

  const latestSales = num(sales[lastIdx])
  const prevSales   = prevYearIdx >= 0 ? num(sales[prevYearIdx]) : null
  const latestNP    = num(np[lastIdx])
  const prevNP      = prevYearIdx >= 0 ? num(np[prevYearIdx]) : null

  const revPct = (latestSales != null && prevSales != null && prevSales !== 0)
    ? ((latestSales - prevSales) / Math.abs(prevSales) * 100) : null
  const npPct = (latestNP != null && prevNP != null && prevNP !== 0)
    ? ((latestNP - prevNP) / Math.abs(prevNP) * 100) : null

  let highlight = ''
  if (npPct != null && revPct != null) {
    if (npPct > 20 && revPct > 15) highlight = `Strong quarter — profit up ${npPct.toFixed(0)}%, sales up ${revPct.toFixed(0)}% YoY`
    else if (npPct < -20)          highlight = `Weak quarter — profit down ${Math.abs(npPct).toFixed(0)}% YoY`
    else if (revPct > 20 && npPct < 5) highlight = `Top-line growth ${revPct.toFixed(0)}% but margin pressure`
    else                           highlight = `Sales ${revPct >= 0 ? '+' : ''}${revPct.toFixed(0)}%, profit ${npPct >= 0 ? '+' : ''}${npPct.toFixed(0)}% YoY`
  }

  return {
    quarter:        parseQuarterHeader(headers[lastIdx]),
    revenue:        `rs.${fmt(sales[lastIdx])} Cr`,
    profit:         `rs.${fmt(np[lastIdx])} Cr`,
    revenueChange:  revPct != null ? `${revPct >= 0 ? '+' : ''}${revPct.toFixed(1)}% YoY` : '—',
    profitChange:   npPct  != null ? `${npPct  >= 0 ? '+' : ''}${npPct.toFixed(1)}% YoY` : '—',
    margin:         opm ? `${fmt(opm[lastIdx])}%` : '—',
    highlight,
    nextResultDate: 'Within ~45 days of period end',
    source:         'Screener.in',
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),

      /* ── /quote — Yahoo live price ── */
      {
        name: 'yahoo-quote-mw',
        configureServer(server) {
          server.middlewares.use('/quote', async (req, res) => {
            const url = new URL(req.url, 'http://localhost')
            const symbol = url.searchParams.get('symbol')
            if (!symbol) return sendJson(res, 400, { error: 'symbol required' })
            const cached = quoteCache.get(symbol)
            if (cached && Date.now() - cached.t < QUOTE_TTL) return sendJson(res, 200, cached.data)
            try {
              const data = await yahooFinance.quote(symbol)
              quoteCache.set(symbol, { data, t: Date.now() })
              sendJson(res, 200, data)
            } catch (e) {
              sendJson(res, 500, { error: e.message || String(e) })
            }
          })
        },
      },

      /* ── /financials — Screener.in quarterly results ── */
      {
        name: 'screener-financials-mw',
        configureServer(server) {
          server.middlewares.use('/financials', async (req, res) => {
            const url = new URL(req.url, 'http://localhost')
            const symbol = url.searchParams.get('symbol')   // e.g. RELIANCE.NS
            if (!symbol) return sendJson(res, 400, { error: 'symbol required' })

            /* Strip exchange suffix — screener uses bare ticker */
            const base = symbol.replace(/\.(NS|BO)$/i, '')
            const cacheKey = base

            const cached = finCache.get(cacheKey)
            if (cached && Date.now() - cached.t < FIN_TTL) return sendJson(res, 200, cached.data)

            try {
              const screenerUrl = `https://www.screener.in/company/${encodeURIComponent(base)}/consolidated/`
              const data = await ScreenerScraperPro(screenerUrl)
              const shaped = shapeQuartersBlock(data?.quarters)
              if (!shaped) {
                /* try standalone view as fallback */
                const altUrl = `https://www.screener.in/company/${encodeURIComponent(base)}/`
                const alt = await ScreenerScraperPro(altUrl)
                const altShaped = shapeQuartersBlock(alt?.quarters)
                if (!altShaped) return sendJson(res, 200, {})
                finCache.set(cacheKey, { data: altShaped, t: Date.now() })
                return sendJson(res, 200, altShaped)
              }
              finCache.set(cacheKey, { data: shaped, t: Date.now() })
              sendJson(res, 200, shaped)
            } catch (e) {
              sendJson(res, 500, { error: e.message || String(e) })
            }
          })
        },
      },

      /* ── /news?ticker=X — Yahoo headlines ── */
      {
        name: 'yahoo-news-mw',
        configureServer(server) {
          server.middlewares.use('/news', async (req, res) => {
            const url = new URL(req.url, 'http://localhost')
            const ticker = url.searchParams.get('ticker')
            if (!ticker) return sendJson(res, 400, { error: 'ticker required' })
            const cached = newsCache.get(ticker)
            if (cached && Date.now() - cached.t < NEWS_TTL) return sendJson(res, 200, cached.data)
            try {
              const search = await yahooFinance.search(ticker, { newsCount: 5, quotesCount: 0 })
              const news = (search?.news || []).slice(0, 5).map(n => ({
                title: n.title || '',
                publisher: n.publisher || '',
                link: n.link || '',
                publishedAt: n.providerPublishTime
                  ? new Date(n.providerPublishTime * 1000).toISOString() : null,
              }))
              const out = { news }
              newsCache.set(ticker, { data: out, t: Date.now() })
              sendJson(res, 200, out)
            } catch (e) {
              sendJson(res, 500, { error: e.message || String(e), news: [] })
            }
          })
        },
      },
    ],

    server: {
      proxy: {
        /* Groq chat completions — frontend hits /groq/chat/completions */
        '/groq': {
          target: 'https://api.groq.com/openai/v1',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/groq/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (env.GROQ_API_KEY) {
                proxyReq.setHeader('Authorization', `Bearer ${env.GROQ_API_KEY}`)
              }
            })
          },
        },
      },
    },
  }
})
