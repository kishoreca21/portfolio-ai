# PortfolioAI — an AI co-pilot for an Indian stock portfolio

A React + Vite app I built to review a long-term NSE portfolio in one place: live prices, real quarterly results, news-driven alerts, and an AI analyst you can chat with. It runs entirely on free data sources and a free LLM tier.

> Ships with a **demo portfolio** (`src/PortfolioAI_v13.jsx` → `RAW`). Replace it with your own holdings. Not investment advice.

## What it does

| Tab | What you get |
|---|---|
| **Portfolio** | Sortable table of holdings with live price, P&L, sector and a BUY / HOLD / SELL view; one-click AI analysis per stock |
| **Quarterly** | Real quarterly results pulled from Screener.in, mapped to Indian fiscal quarters |
| **Alerts** | Pulls latest Yahoo Finance headlines per holding, asks the LLM for a signal + urgency in strict JSON, and surfaces what needs attention |
| **Sectors** | Exposure by sector, so concentration risk is obvious |
| **Chat** | Ask the AI analyst anything about the portfolio, with ready-made prompts |

## How it's wired

```
React UI ──► Vite dev-server middleware (vite.config.js)
               ├─ /quote       → Yahoo Finance (yahoo-finance2)      cache 20s
               ├─ /financials  → Screener.in (screener-scraper-pro)  cache 24h
               ├─ /news        → Yahoo Finance news                   cache 30m
               └─ /groq/*      → Groq Chat Completions (Llama 3.3 70B), key injected server-side
```

The API key never reaches the browser: the Vite proxy adds the `Authorization` header from `.env`.

## Run it

```bash
npm install
cp .env.example .env        # add a free key from console.groq.com
npm run dev
```

## Journey

Iterated from v8 to v13: fixing Yahoo ticker mismatches (`.NS` / `.BO` fallbacks and overrides), moving from estimated to real quarterly numbers, caching to stay inside free-tier limits, and forcing JSON output from the LLM so alerts are machine-readable.
