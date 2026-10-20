import { useState, useEffect, useRef, useCallback } from "react";

/* ════════════════════════════════════════════════════════════
   STYLES
════════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Outfit:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
.pai{
  --bg:#080b14;--s1:#0e1320;--s2:#141b2d;--s3:#1c253d;
  --bd:#1e2d45;--bd2:#2a3d5a;
  --tx:#dde4f0;--tx2:#6a7d99;--tx3:#3a4d66;
  --green:#00d18c;--gd:rgba(0,209,140,.13);
  --red:#ff4560;--rd:rgba(255,69,96,.13);
  --amber:#f5a623;--ad:rgba(245,166,35,.13);
  --blue:#4f90f0;--bdblu:rgba(79,144,240,.15);
  --purple:#b377f0;--pd:rgba(179,119,240,.13);
  --mono:'IBM Plex Mono',monospace;
  --sans:'Outfit',sans-serif;
  font-family:var(--sans);background:var(--bg);color:var(--tx);
  min-height:680px;font-size:13px;line-height:1.5;
  -webkit-font-smoothing:antialiased;
}
.pai *{box-sizing:border-box}
.pai ::-webkit-scrollbar{width:4px;height:4px}
.pai ::-webkit-scrollbar-track{background:var(--s1)}
.pai ::-webkit-scrollbar-thumb{background:var(--bd2);border-radius:2px}

.badge{display:inline-flex;align-items:center;font-family:var(--mono);font-weight:600;
  letter-spacing:.5px;border-radius:4px;padding:2px 8px;font-size:10px;white-space:nowrap}
.b-buy{background:var(--gd);color:var(--green);border:1px solid rgba(0,209,140,.3)}
.b-sell{background:var(--rd);color:var(--red);border:1px solid rgba(255,69,96,.3)}
.b-hold{background:var(--ad);color:var(--amber);border:1px solid rgba(245,166,35,.3)}

.urg-h{border-radius:4px;padding:2px 8px;font-size:10px;font-weight:700;font-family:var(--mono);background:rgba(255,69,96,.18);color:#ff4560;border:1px solid rgba(255,69,96,.4)}
.urg-m{border-radius:4px;padding:2px 8px;font-size:10px;font-weight:700;font-family:var(--mono);background:rgba(245,166,35,.18);color:#f5a623;border:1px solid rgba(245,166,35,.4)}
.urg-l{border-radius:4px;padding:2px 8px;font-size:10px;font-weight:700;font-family:var(--mono);background:rgba(79,144,240,.15);color:#4f90f0;border:1px solid rgba(79,144,240,.35)}

.pai button{font-family:var(--sans);cursor:pointer;border:1px solid var(--bd2);
  background:var(--s2);color:var(--tx2);border-radius:6px;
  font-size:12px;padding:5px 11px;transition:all .15s;white-space:nowrap;line-height:1.4}
.pai button:hover:not(:disabled){background:var(--s3);color:var(--tx);border-color:var(--bdblu)}
.pai button:disabled{opacity:.4;cursor:not-allowed}
.pai button.pri{background:var(--blue);color:#fff;border-color:transparent;font-weight:500}
.pai button.pri:hover:not(:disabled){background:#6aa3f5}
.pai button.ghost{background:transparent;border-color:transparent}
.pai button.ghost:hover:not(:disabled){background:var(--s2)}

.pai input{font-family:var(--sans);background:var(--s2);border:1px solid var(--bd);
  color:var(--tx);border-radius:6px;padding:7px 10px;font-size:13px;
  outline:none;transition:border .15s;width:100%}
.pai input:focus{border-color:var(--blue)}
.pai input::placeholder{color:var(--tx3)}

.hdr{padding:11px 18px;border-bottom:1px solid var(--bd);background:var(--s1);
  display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px}
.pbar{padding:7px 18px;background:var(--s1);border-bottom:1px solid var(--bd);
  display:flex;align-items:center;gap:10px;flex-wrap:wrap;min-height:40px}
.tabs{display:flex;border-bottom:1px solid var(--bd);padding:0 18px;background:var(--s1);gap:2px;overflow-x:auto}
.foot{padding:5px 18px;border-top:1px solid var(--bd);font-size:10px;color:var(--tx3);
  background:var(--s1);display:flex;gap:14px;flex-wrap:wrap}

.spill{display:flex;flex-direction:column;align-items:flex-end}
.slbl{font-size:9px;text-transform:uppercase;letter-spacing:.8px;color:var(--tx3)}
.sval{font-family:var(--mono);font-size:14px;font-weight:600;line-height:1.2}

.ptrack{width:130px;height:4px;background:var(--bd);border-radius:2px;flex-shrink:0;overflow:hidden}
.pfill{height:100%;border-radius:2px;background:var(--blue);transition:width .3s ease}

.ldot{display:inline-block;width:7px;height:7px;border-radius:50%;
  background:var(--green);flex-shrink:0;animation:pdot 2s ease-in-out infinite}
@keyframes pdot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.7)}}

.chips{display:flex;gap:5px;align-items:center;margin-left:auto;flex-wrap:wrap}
.chip{font-size:11px;font-family:var(--mono);padding:2px 9px;border-radius:20px;font-weight:600}
.c-b{background:var(--gd);color:var(--green)}
.c-s{background:var(--rd);color:var(--red)}
.c-h{background:var(--ad);color:var(--amber)}

.tbtn{padding:9px 15px;font-size:13px;font-weight:400;color:var(--tx2);
  border:none;background:transparent;border-bottom:2px solid transparent;
  cursor:pointer;transition:color .15s;border-radius:0;position:relative;top:1px;flex-shrink:0}
.tbtn:hover:not(:disabled){color:var(--tx);background:transparent;border-color:transparent}
.tbtn.on{color:var(--tx);font-weight:600;border-bottom-color:var(--blue)}
.tbadge{margin-left:5px;background:var(--rd);color:var(--red);
  font-size:10px;padding:1px 5px;border-radius:10px;font-family:var(--mono)}

.playout{display:flex;height:540px}
.tpane{flex:1;display:flex;flex-direction:column;min-width:0;border-right:1px solid var(--bd);overflow:hidden}
.fbar{padding:7px 10px;border-bottom:1px solid var(--bd);background:var(--s1);
  display:flex;gap:6px;align-items:center;flex-wrap:wrap;flex-shrink:0}
.fbar input{max-width:168px}

.rb{border-radius:20px!important;font-size:11px!important;font-weight:500;padding:3px 10px!important}
.rb.a.on{background:var(--s3)!important;color:var(--tx)!important;border-color:var(--bd2)!important}
.rb.b.on{background:var(--gd)!important;color:var(--green)!important;border-color:rgba(0,209,140,.3)!important}
.rb.h.on{background:var(--ad)!important;color:var(--amber)!important;border-color:rgba(245,166,35,.3)!important}
.rb.s.on{background:var(--rd)!important;color:var(--red)!important;border-color:rgba(255,69,96,.3)!important}

.stbl{width:100%;border-collapse:collapse}
.stbl thead{position:sticky;top:0;z-index:2}
.stbl th{padding:6px 9px;font-size:10px;font-weight:600;text-transform:uppercase;
  letter-spacing:.6px;color:var(--tx3);background:var(--s2);
  border-bottom:1px solid var(--bd);white-space:nowrap;cursor:pointer;user-select:none}
.stbl th:hover{color:var(--tx2)}
.stbl td{padding:6px 9px;border-bottom:1px solid var(--bd);vertical-align:middle}
.stbl tbody tr{cursor:pointer;transition:background .08s}
.stbl tbody tr:hover td{background:var(--s3)!important}
.stbl tbody tr.sel td{background:var(--bdblu)!important}

.tn{font-weight:600;font-size:12px;max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tt{font-family:var(--mono);font-size:10px;color:var(--blue)}
.ts{font-size:10px;color:var(--tx2)}

.drawer{flex-shrink:0;overflow:hidden;transition:width .25s cubic-bezier(.4,0,.2,1);
  background:var(--s1);border-left:1px solid var(--bd);width:0}
.drawer.open{width:340px}
.di{width:340px;padding:14px;overflow-y:auto;height:100%}
.dname{font-size:14px;font-weight:600;margin-bottom:5px}
.dmeta{display:flex;gap:7px;align-items:center;flex-wrap:wrap;margin-bottom:6px}
.sgrid{display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-bottom:12px}
.sc{background:var(--s2);border:1px solid var(--bd);border-radius:6px;padding:6px 9px}
.scl{font-size:9px;text-transform:uppercase;letter-spacing:.5px;color:var(--tx3)}
.scv{font-family:var(--mono);font-size:13px;font-weight:600;margin-top:1px}
.abox{border-top:1px solid var(--bd);padding-top:11px}

.alp{display:flex;flex-direction:column;height:540px}
.altb{padding:9px 16px;border-bottom:1px solid var(--bd);background:var(--s1);
  display:flex;gap:10px;align-items:center;flex-wrap:wrap;flex-shrink:0}
.alscroll{overflow-y:auto;flex:1}
.acard{border-bottom:1px solid var(--bd);padding:13px 16px}
.acard:hover{background:var(--s2)}
.actop{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:7px;gap:10px}
.acname{font-weight:700;font-size:13px}
.actk{font-family:var(--mono);font-size:10px;color:var(--blue);margin-top:1px}
.acbadges{display:flex;gap:5px;align-items:center;flex-shrink:0;flex-wrap:wrap}
.acstats{display:flex;gap:14px;margin-bottom:8px;flex-wrap:wrap}
.ast{display:flex;flex-direction:column;gap:1px}
.astl{color:var(--tx3);font-size:9px;text-transform:uppercase;letter-spacing:.4px}
.astv{font-family:var(--mono);font-weight:600;font-size:12px}
.anbox{background:var(--s2);border:1px solid var(--bd);border-radius:6px;padding:9px 11px;margin-top:8px}
.anhl{font-size:12px;font-weight:600;color:var(--tx);margin-bottom:3px}
.anreason{font-size:11px;color:var(--tx2);margin-bottom:5px;line-height:1.55}
.anact{font-size:11px;font-weight:700}
.ansrc{font-size:10px;color:var(--tx3);margin-top:4px}

/* QUARTERLY RESULTS — new in v8 */
.qrp{display:flex;flex-direction:column;height:540px}
.qrtb{padding:9px 16px;border-bottom:1px solid var(--bd);background:var(--s1);
  display:flex;gap:10px;align-items:center;flex-wrap:wrap;flex-shrink:0}
.qrscroll{overflow-y:auto;flex:1}
.qcard{border-bottom:1px solid var(--bd);padding:14px 16px}
.qcard:hover{background:var(--s2)}
.qctop{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:9px;gap:10px}
.qcname{font-weight:700;font-size:13px}
.qctk{font-family:var(--mono);font-size:10px;color:var(--blue);margin-top:1px}
.qctag{display:inline-block;padding:2px 8px;border-radius:4px;background:var(--pd);color:var(--purple);
  font-size:10px;font-family:var(--mono);font-weight:600;border:1px solid rgba(179,119,240,.3)}
.qmetrics{display:grid;grid-template-columns:repeat(auto-fit,minmax(125px,1fr));gap:7px;margin-bottom:10px}
.qmcell{background:var(--s2);border:1px solid var(--bd);border-radius:6px;padding:7px 10px}
.qml{font-size:9px;text-transform:uppercase;letter-spacing:.5px;color:var(--tx3);margin-bottom:2px}
.qmv{font-family:var(--mono);font-size:13px;font-weight:600;line-height:1.2}
.qmsub{font-family:var(--mono);font-size:10px;font-weight:600;margin-top:2px}
.qhl{background:var(--s2);border-left:3px solid var(--purple);border-radius:0 4px 4px 0;
  padding:7px 11px;font-size:11px;color:var(--tx);line-height:1.55;margin-top:8px}
.qsrc{font-size:10px;color:var(--tx3);margin-top:6px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:4px}
.qfilter-bar{display:flex;gap:6px;flex-wrap:wrap}

.secp{padding:14px 16px;overflow-y:auto;max-height:540px}
.srow{display:grid;grid-template-columns:150px 50px 88px 88px 72px 72px 1fr 46px;
  gap:0;border-bottom:1px solid var(--bd);padding:7px 3px;align-items:center;font-size:12px}
.srow:hover{background:var(--s2)}
.shdr{color:var(--tx3);font-size:10px;text-transform:uppercase;letter-spacing:.5px;
  font-weight:600;border-bottom:1px solid var(--bd2);padding-bottom:5px;margin-bottom:3px}
.btrack{height:6px;background:var(--s3);border-radius:3px;overflow:hidden}
.bfill{height:100%;border-radius:3px;transition:width .4s ease}
.wtag{font-size:9px;background:var(--rd);color:var(--red);padding:1px 5px;border-radius:3px;font-weight:600}

.chatp{display:flex;flex-direction:column;height:540px}
.cq{padding:7px 11px;border-bottom:1px solid var(--bd);background:var(--s1);display:flex;gap:5px;flex-wrap:wrap;flex-shrink:0}
.qchip{font-size:11px;padding:3px 8px;border-radius:20px;color:var(--tx2)}
.cmsgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:12px}
.msg{display:flex;gap:9px}
.msg.u{flex-direction:row-reverse}
.mav{width:27px;height:27px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;
  justify-content:center;font-size:10px;font-weight:700;font-family:var(--mono);border:1px solid var(--bd)}
.mav.ai{background:var(--s2);color:var(--blue);border-color:rgba(79,144,240,.3)}
.mav.user{background:var(--bdblu);color:var(--blue)}
.mbub{max-width:82%;padding:9px 13px;border-radius:10px;border:1px solid;font-size:13px;line-height:1.7}
.mbub.ai{background:var(--s2);border-color:var(--bd);border-top-left-radius:2px}
.mbub.user{background:var(--bdblu);border-color:rgba(79,144,240,.22);border-top-right-radius:2px}
.tdots{display:flex;gap:4px;align-items:center;padding:4px 0}
.dot{width:6px;height:6px;border-radius:50%;background:var(--tx3);animation:blink 1.2s ease-in-out infinite}
.dot:nth-child(2){animation-delay:.2s}.dot:nth-child(3){animation-delay:.4s}
@keyframes blink{0%,80%,100%{opacity:.25;transform:scale(.85)}40%{opacity:1;transform:scale(1)}}
.cinrow{padding:9px 13px;border-top:1px solid var(--bd);background:var(--s1);display:flex;gap:8px;flex-shrink:0}
.cinrow input{flex:1}
.sbtn{font-weight:600;padding:7px 16px;background:var(--blue)!important;
  color:#fff!important;border-color:transparent!important;font-size:13px}
.sbtn:hover:not(:disabled){background:#6aa3f5!important}

.empty{padding:40px;text-align:center;color:var(--tx2);font-size:12px;line-height:1.9}
@keyframes spin{to{transform:rotate(360deg)}}
.spin{display:inline-block;width:11px;height:11px;border:2px solid var(--bd);
  border-top-color:var(--blue);border-radius:50%;animation:spin .6s linear infinite;vertical-align:middle}
@keyframes fi{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:none}}
.stbl tbody tr{animation:fi .1s ease both}
.fadein{animation:fi .2s ease both}

.flash-up{animation:flashup 1s ease}
.flash-down{animation:flashdn 1s ease}
@keyframes flashup{0%{background:rgba(0,209,140,.3)!important}100%{background:transparent}}
@keyframes flashdn{0%{background:rgba(255,69,96,.3)!important}100%{background:transparent}}
`;

/* ════════════════════════════════════════════════════════════
   PORTFOLIO DATA — DEMO PORTFOLIO (illustrative quantities and prices,
   not a real investor's holdings). Replace with your own statement.
   Format: [name, NSE ticker, sector, qty, avgBuy, lastLTP, baseRec]
════════════════════════════════════════════════════════════ */
const RAW = [
  ["RELIANCE INDUSTRIES","RELIANCE","Conglomerate",20,1250.00,1300.00,"HOLD"],
  ["HDFC BANK","HDFCBANK","Private Bank",25,1600.00,1700.00,"BUY"],
  ["INFOSYS","INFY","IT Services",30,1500.00,1450.00,"HOLD"],
  ["ITC","ITC","FMCG",100,420.00,410.00,"HOLD"],
  ["LARSEN & TOUBRO","LT","Infra/EPC",8,3400.00,3600.00,"BUY"],
  ["SUN PHARMA","SUNPHARMA","Pharma",15,1650.00,1700.00,"BUY"],
  ["TATA POWER","TATAPOWER","Power Gen",120,380.00,370.00,"HOLD"],
  ["ASIAN PAINTS","ASIANPAINT","Paints",10,2600.00,2400.00,"SELL"],
  ["BHARTI AIRTEL","BHARTIARTL","Telecom",20,1700.00,1850.00,"BUY"],
  ["NIFTYBEES ETF","NIFTYBEES","Index ETF",200,250.00,265.00,"HOLD"],
];

const BASE_PORT = RAW.map(([name,ticker,sector,qty,avgBuy,lastLTP,baseRec])=>({
  name, ticker, sector, qty, avgBuy, lastLTP, baseRec,
  invested: avgBuy > 0 ? qty * avgBuy : 0,
}));
const TOTAL_INVESTED = BASE_PORT.reduce((s,p)=>s+p.invested, 0);

/* ════════════════════════════════════════════════════════════
   CORE UTILITIES — pure functions, fully unit-tested
════════════════════════════════════════════════════════════ */

/* Robust JSON extractor that respects strings (handles braces inside string values) */
function extractJSON(raw) {
  if (!raw || typeof raw !== "string") return null;
  let start = -1, depth = 0, inString = false, escape = false;
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (escape) { escape = false; continue; }
    if (ch === "\\") { escape = true; continue; }
    if (ch === '"' && !escape) { inString = !inString; continue; }
    if (inString) continue;
    if (ch === "{") { if (!depth) start = i; depth++; }
    else if (ch === "}") {
      depth--;
      if (!depth && start !== -1) {
        try { return JSON.parse(raw.slice(start, i + 1)); }
        catch { start = -1; depth = 0; }
      }
    }
  }
  return null;
}

function normalizeTickerKey(k) {
  return String(k).replace(/\.(NS|BO)$/i, "").toUpperCase().trim();
}

function validatePriceData(v) {
  if (!v || typeof v !== "object") return null;
  const price = Number(v.price);
  if (!isFinite(price) || price <= 0) return null;
  return {
    price,
    change:    isFinite(Number(v.change))    ? Number(v.change)    : 0,
    changePct: isFinite(Number(v.changePct)) ? Number(v.changePct) : 0,
  };
}

function validateNewsData(v) {
  if (!v || typeof v !== "object") return null;
  return {
    headline: String(v.headline || "No headline").slice(0, 200),
    signal:   ["BUY","SELL","HOLD"].includes(v.signal)  ? v.signal  : "HOLD",
    urgency:  ["HIGH","MEDIUM","LOW"].includes(v.urgency) ? v.urgency : "LOW",
    reason:   String(v.reason || "").slice(0, 300),
    action:   String(v.action || "Monitor closely").slice(0, 200),
    source:   String(v.source || ""),
  };
}

function validateQuarterData(v) {
  if (!v || typeof v !== "object") return null;
  return {
    quarter:        String(v.quarter || "Q4 FY26").slice(0, 30),
    revenue:        String(v.revenue || "—").slice(0, 50),
    profit:         String(v.profit || "—").slice(0, 50),
    revenueChange:  String(v.revenueChange || "—").slice(0, 30),
    profitChange:   String(v.profitChange || "—").slice(0, 30),
    margin:         String(v.margin || "—").slice(0, 30),
    highlight:      String(v.highlight || "").slice(0, 200),
    nextResultDate: String(v.nextResultDate || "TBA").slice(0, 30),
    source:         String(v.source || "").slice(0, 50),
  };
}

function extractSignal(text) {
  if (!text) return null;
  const pats = [
    /\bSIGNAL\s*:\s*\*{0,2}(BUY|SELL|HOLD)\*{0,2}/i,
    /\bRECOMMENDATION\s*:\s*\*{0,2}(BUY|SELL|HOLD)\*{0,2}/i,
    /\bACTION\s*:\s*\*{0,2}(BUY|SELL|HOLD)\*{0,2}/i,
    /\*\*(BUY|SELL|HOLD)\*\*\s*[-\u2013\u2014(]/,
    /URGENT\s*:\s*(SELL)/i,
  ];
  for (const p of pats) {
    const m = text.match(p);
    if (m) return (m[2] || m[1]).toUpperCase();
  }
  const tail = text.slice(-600);
  const b  = (tail.match(/\bBUY\b/gi)  || []).length;
  const sl = (tail.match(/\bSELL\b/gi) || []).length;
  const h  = (tail.match(/\bHOLD\b/gi) || []).length;
  const mx = Math.max(b, sl, h);
  if (!mx) return null;
  return sl === mx ? "SELL" : b === mx ? "BUY" : "HOLD";
}

/* ════════════════════════════════════════════════════════════
   STORAGE
════════════════════════════════════════════════════════════ */
const NS = "pai8";
async function storageSave(key, val) {
  try { await window.storage.set(`${NS}_${key}`, JSON.stringify(val)); } catch {}
}
async function storageLoad(key) {
  try {
    const r = await window.storage.get(`${NS}_${key}`);
    return r ? JSON.parse(r.value) : null;
  } catch { return null; }
}

/* ════════════════════════════════════════════════════════════
   ANTHROPIC API CALL
════════════════════════════════════════════════════════════ */
async function aiCall(messages, sys) {
  /* Uses Groq (free, no credit card) — OpenAI-compatible Chat Completions API.
     Get a free key at console.groq.com → put in .env as GROQ_API_KEY. */
  const openAIMessages = [];
  if (sys) openAIMessages.push({ role: "system", content: sys });
  for (const m of messages) {
    openAIMessages.push({
      role: m.role === "assistant" ? "assistant" : "user",
      content: typeof m.content === "string" ? m.content : JSON.stringify(m.content),
    });
  }

  const res = await fetch("/groq/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1500,
      temperature: 0.4,
      messages: openAIMessages,
    }),
  });

  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    const msg = e?.error?.message || e?.error || `HTTP ${res.status}`;
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  }
  const d = await res.json();
  const text = d?.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("Empty Groq response");
  return text;
}

/* ════════════════════════════════════════════════════════════
   BATCH FETCHERS
════════════════════════════════════════════════════════════ */

/* ──────────────────────────────────────────────────────────
   FREE LIVE PRICES via yahoo-finance2 (no API key needed)
   The library runs as Vite middleware (see vite.config.js).
   It handles cookies/crumbs internally so we get a clean
   /quote?symbol=RELIANCE.NS endpoint.
   Tries .NS (NSE) first, then .BO (BSE) as fallback.
   ────────────────────────────────────────────────────────── */

/* Special ticker overrides — portfolio ticker → Yahoo symbol root */
const YAHOO_TICKER_OVERRIDES = {
  MM: "M%26M",   // Mahindra & Mahindra trades as M&M on NSE
};

async function fetchYahooQuote(ticker) {
  const root = YAHOO_TICKER_OVERRIDES[ticker] || ticker;
  const errors = [];
  for (const suffix of [".NS", ".BO"]) {
    const symbol = `${root}${suffix}`;
    try {
      const url = `/quote?symbol=${encodeURIComponent(symbol)}`;
      const res = await fetch(url);
      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        errors.push(`${symbol}: HTTP ${res.status} ${errText.slice(0, 80)}`);
        continue;
      }
      const data = await res.json();
      if (data.error) {
        errors.push(`${symbol}: ${data.error}`);
        continue;
      }
      const price = data.regularMarketPrice;
      if (typeof price !== "number") {
        errors.push(`${symbol}: no regularMarketPrice in response`);
        continue;
      }
      const prevClose = data.regularMarketPreviousClose ?? data.previousClose ?? price;
      const change = data.regularMarketChange ?? (price - prevClose);
      const changePct = data.regularMarketChangePercent ?? (prevClose > 0 ? ((price - prevClose) / prevClose) * 100 : 0);
      return { price, change, changePct };
    } catch (e) {
      errors.push(`${symbol}: ${e.message}`);
    }
  }
  /* Surface errors in console so user can debug */
  if (errors.length) console.warn(`[yahoo] ${ticker}:`, errors.join(" | "));
  return null;
}

async function fetchPriceBatch(stocks) {
  const result = {};
  await Promise.all(stocks.map(async (s) => {
    const data = await fetchYahooQuote(s.ticker);
    if (data) {
      const validated = validatePriceData(data);
      if (validated) {
        result[normalizeTickerKey(s.ticker)] = { ...validated, fetchedAt: Date.now() };
      }
    }
  }));
  return result;
}

async function fetchAllPrices(onProgress) {
  /* Skip MURAE — penny stock often unavailable on Yahoo */
  const fetchable = BASE_PORT.filter(s => s.ticker !== "MURAE");
  const BATCH = 10;   // smaller batch — yahoo-finance2 has internal rate limiting
  const allPrices = {};
  let attempts = 0, successes = 0;

  for (let i = 0; i < fetchable.length; i += BATCH) {
    const batch = fetchable.slice(i, i + BATCH);
    attempts += batch.length;
    try {
      const res = await fetchPriceBatch(batch);
      Object.assign(allPrices, res);
      successes += Object.keys(res).length;
    } catch (e) {
      console.warn(`Price batch ${i}-${i+BATCH} failed:`, e.message);
    }
    onProgress(Math.min(i + BATCH, fetchable.length), fetchable.length);
  }
  return { prices: allPrices, attempts, successes };
}

/* NEW v13: Fetch alert news using REAL Yahoo headlines + Groq for sentiment.
   Two-step: (1) Pull last 5 headlines per stock from Yahoo /news endpoint,
   (2) Send headlines to Groq to classify BUY/SELL/HOLD with reason. */
async function fetchNewsBatch(stocks) {
  const result = {};
  const now = Date.now();

  /* Step 1: parallel fetch headlines from Yahoo */
  const headlinesByTicker = {};
  await Promise.all(stocks.map(async (s) => {
    const root = YAHOO_TICKER_OVERRIDES[s.ticker] || s.ticker;
    for (const suffix of [".NS", ".BO"]) {
      try {
        const url = `/news?ticker=${encodeURIComponent(root + suffix)}`;
        const res = await fetch(url);
        if (!res.ok) continue;
        const j = await res.json();
        if (j.news && j.news.length) {
          headlinesByTicker[s.ticker] = { stock: s, news: j.news };
          break;
        }
      } catch (e) { /* try next */ }
    }
  }));

  /* Step 2: For each stock with headlines, ask Groq for a signal in JSON */
  await Promise.all(Object.entries(headlinesByTicker).map(async ([ticker, { stock, news }]) => {
    const headlines = news.slice(0, 4).map((n, i) => `${i+1}. ${n.title} (${n.publisher})`).join("\n");
    const pnlStr = stock.pct !== null ? `${stock.pct >= 0 ? "+" : ""}${stock.pct.toFixed(1)}%` : "bonus";

    const prompt =
`Stock: ${stock.name} (NSE:${stock.ticker})
LTP: rs.${stock.price.toFixed(2)} | P&L: ${pnlStr}

Recent headlines:
${headlines}

Based ONLY on the headlines above, classify this stock and return ONLY valid JSON (no markdown, no fences):
{"headline":"most important headline (max 100 chars)","signal":"BUY"|"SELL"|"HOLD","urgency":"HIGH"|"MEDIUM"|"LOW","reason":"one sentence","action":"specific action","source":"primary publisher"}`;

    try {
      const raw = await aiCall(
        [{ role: "user", content: prompt }],
        "You are a senior Indian equity analyst. Classify based ONLY on the headlines provided. Return ONLY the JSON object."
      );
      const parsed = extractJSON(raw);
      if (parsed) {
        const validated = validateNewsData(parsed);
        if (validated) {
          result[normalizeTickerKey(ticker)] = { ...validated, _ts: now };
        }
      }
    } catch (e) {
      console.warn(`[news] ${ticker}: ${e.message}`);
    }
  }));

  return result;
}

/* NEW v12: Fetch quarterly results — REAL DATA from Yahoo's earnings module.
   No LLM, no hallucination — actual reported revenue and EPS numbers.
   Yahoo returns up to 4 most recent quarters in financialsChart.quarterly. */
async function fetchQuarterBatch(stocks) {
  const result = {};
  const now = Date.now();

  await Promise.all(stocks.map(async (s) => {
    const root = YAHOO_TICKER_OVERRIDES[s.ticker] || s.ticker;
    let data = null;

    for (const suffix of [".NS", ".BO"]) {
      try {
        const symbol = `${root}${suffix}`;
        const url = `/financials?symbol=${encodeURIComponent(symbol)}`;
        const res = await fetch(url);
        if (!res.ok) continue;
        const j = await res.json();
        if (j.error) continue;
        if (j.quarter || j.revenue || j.profit) { data = j; break; }
      } catch (e) { /* try next suffix */ }
    }

    if (data) {
      result[normalizeTickerKey(s.ticker)] = { ...data, _ts: now };
    }
  }));

  return result;
}

/* ════════════════════════════════════════════════════════════
   PORTFOLIO ENRICHMENT
════════════════════════════════════════════════════════════ */
function enrichPortfolio(livePrices, analyses) {
  return BASE_PORT.map(s => {
    const live = livePrices[s.ticker] || null;
    const price = live ? live.price : s.lastLTP;
    const current = s.qty * price;
    const pnl = s.invested > 0 ? current - s.invested : current;
    const pct = s.invested > 0 ? (pnl / s.invested) * 100 : null;
    const ai = analyses[s.ticker] || null;
    const aiSignal = ai?.signal || null;
    return {
      ...s, price, current, pnl, pct,
      signal:       aiSignal || s.baseRec,
      aiSignal,
      analysedAt:   ai?.timestamp || null,
      analysisText: ai?.text || null,
      isLive:       !!live,
      dayChange:    live ? live.change    : 0,
      dayChangePct: live ? live.changePct : 0,
      priceUpdatedAt: live ? live.fetchedAt : null,
    };
  });
}

function buildSectors(enriched) {
  const map = {};
  const tot = enriched.reduce((a,s) => a + s.current, 0);
  for (const s of enriched) {
    if (!map[s.sector]) map[s.sector] = { invested:0, current:0, count:0, sells:0, buys:0 };
    map[s.sector].invested += s.invested;
    map[s.sector].current  += s.current;
    map[s.sector].count++;
    if (s.signal === "SELL") map[s.sector].sells++;
    if (s.signal === "BUY")  map[s.sector].buys++;
  }
  return Object.entries(map).map(([name, d]) => ({
    name, ...d,
    pnl:    d.current - d.invested,
    pct:    d.invested > 0 ? ((d.current - d.invested) / d.invested) * 100 : 0,
    weight: tot > 0 ? (d.current / tot) * 100 : 0,
  })).sort((a,b) => b.current - a.current);
}

function getAlerts(enriched) {
  return enriched
    .filter(s => s.signal === "SELL" || (s.pct !== null && s.pct < -25))
    .sort((a,b) => Math.abs(b.pnl) - Math.abs(a.pnl));
}

function buildCtx(enriched) {
  const inv = enriched.reduce((s,p) => s + p.invested, 0);
  const cur = enriched.reduce((s,p) => s + p.current, 0);
  const pnl = cur - inv;
  const sectors = buildSectors(enriched);
  const top = [...enriched].sort((a,b) => b.current - a.current).slice(0, 15);
  const bad = enriched.filter(s => s.signal === "SELL" && s.pnl < -5000);
  const good = enriched.filter(s => s.pct !== null && s.pct > 30);
  const km = new Map([...top, ...bad, ...good].map(s => [s.ticker, s]));
  return (
    `Portfolio ${new Date().toLocaleDateString("en-IN")}: ` +
    `rs.${(inv/1e5).toFixed(2)}L invested, rs.${(cur/1e5).toFixed(2)}L current, ` +
    `${inv > 0 ? ((pnl/inv)*100).toFixed(1) : 0}% P&L, ` +
    `${enriched.filter(s => s.isLive).length}/${enriched.length} live prices\n` +
    `Sectors: ${sectors.map(x => `${x.name}:${x.weight.toFixed(1)}%(${x.pct.toFixed(1)}%P&L${x.sells ? `,${x.sells}SELL` : ""})`).join(" | ")}\n` +
    `Key: ${[...km.values()].map(s => `${s.ticker} ${s.qty}sh avg rs.${s.avgBuy > 0 ? s.avgBuy.toFixed(0) : "BONUS"} ltp rs.${s.price.toFixed(0)} ${s.isLive ? "LIVE" : "STALE"} ${s.pct !== null ? (s.pct >= 0 ? "+" : "") + s.pct.toFixed(1) + "%" : "BONUS"} ${s.signal}${s.aiSignal ? "(AI)" : ""}`).join(" | ")}\n` +
    `All: ${enriched.map(s => s.ticker).join(",")}`
  );
}

/* ════════════════════════════════════════════════════════════
   FORMAT HELPERS
════════════════════════════════════════════════════════════ */
const inr = (n, d=0) => "rs." + Math.abs(n).toLocaleString("en-IN",{minimumFractionDigits:d, maximumFractionDigits:d});
const pf  = (n, d=1) => (n >= 0 ? "+" : "") + n.toFixed(d) + "%";
const ago = ts => {
  if (!ts) return "never";
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return h < 24 ? `${h}h ago` : `${Math.floor(h/24)}d ago`;
};
const pc = n => n >= 0 ? "var(--green)" : "var(--red)";

/* ════════════════════════════════════════════════════════════
   PURE PRESENTATIONAL COMPONENTS — defined OUTSIDE App
   (defining them inside App would re-create on every render
   and break React reconciliation)
════════════════════════════════════════════════════════════ */
function Badge({ v }) {
  const c = v === "BUY" ? "b-buy" : v === "SELL" ? "b-sell" : "b-hold";
  return <span className={`badge ${c}`}>{v || "—"}</span>;
}

function UrgBadge({ v }) {
  if (!v) return null;
  return <span className={v === "HIGH" ? "urg-h" : v === "MEDIUM" ? "urg-m" : "urg-l"}>{v}</span>;
}

function MD({ text }) {
  const html = (text || "")
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>")
    .replace(/\*(.+?)\*/g,"<em>$1</em>")
    .replace(/^#{1,3} (.+)$/gm,"<strong>$1</strong>")
    .replace(/^[-\u2022] (.+)$/gm,"&nbsp;\u2022 $1")
    .replace(/\n/g,"<br/>");
  return <div style={{lineHeight:1.75, fontSize:13}} dangerouslySetInnerHTML={{__html:html}}/>;
}

function SortTH({ sk, thisKey, asc, onSort, children, align, minW }) {
  return (
    <th
      style={{textAlign: align || "left", minWidth: minW || 0, cursor:"pointer", userSelect:"none", whiteSpace:"nowrap"}}
      onClick={() => onSort(thisKey)}>
      {children}
      {sk === thisKey && <span style={{marginLeft:3, opacity:0.6}}>{asc ? "\u2191" : "\u2193"}</span>}
    </th>
  );
}

const PROMPTS = [
  "Today's market update — Nifty & global cues",
  "Which stocks should I SELL urgently?",
  "BEL and HAL — latest news",
  "SBI and ICICI Bank — add more?",
  "Adani group — any news today?",
  "Defence sector outlook",
  "Biggest losers — exit or hold?",
  "Renewable energy stocks update",
];

/* ════════════════════════════════════════════════════════════
   MAIN APP
════════════════════════════════════════════════════════════ */
export default function App() {
  /* Live prices */
  const [livePrices, setLivePrices]   = useState({});
  const [priceStatus, setPriceStatus] = useState("idle"); // idle | loading | done | error
  const [pricePct, setPricePct]       = useState(0);
  const [priceErr, setPriceErr]       = useState("");
  const [pricedAt, setPricedAt]       = useState(null);
  const [lastFetchStats, setLastFetchStats] = useState(null);

  /* NEW v9: Live mode + price-change tracking */
  const [liveMode, setLiveMode]       = useState(false);  // poll every 30s when on
  const [priceFlash, setPriceFlash]   = useState({});     // { TICKER: "up" | "dn" }
  const prevPricesRef                 = useRef({});

  /* AI per-stock analyses */
  const [analyses, setAnalyses]   = useState({});
  const [analysing, setAnalysing] = useState("");

  /* Alerts (news-driven) */
  const [alertNews, setAlertNews]       = useState({});
  const [alertLoading, setAlertLoading] = useState(false);
  const [alertPending, setAlertPending] = useState([]);
  const [alertAt, setAlertAt]           = useState(null);

  /* NEW: Quarterly results */
  const [quarterly, setQuarterly]           = useState({});
  const [quarterLoading, setQuarterLoading] = useState(false);
  const [quarterPending, setQuarterPending] = useState([]);
  const [quarterAt, setQuarterAt]           = useState(null);

  /* UI */
  const [tab, setTab]               = useState("portfolio");
  const [selTicker, setSelTicker]   = useState("");
  const [fText, setFText]           = useState("");
  const [fRec, setFRec]             = useState("ALL");
  const [sk, setSk]                 = useState("current");
  const [sasc, setSasc]             = useState(false);

  /* Quarterly tab filter */
  const [qFilter, setQFilter] = useState("ALL"); // ALL | TOP | LOSS | LATEST

  /* Chat */
  const [msgs, setMsgs] = useState([{
    role: "assistant",
    content:
      "**Portfolio AI v12 — Free Edition.**\n\n" +
      "**What works:**\n" +
      "- **Live prices** via Yahoo Finance (free, no API key, NSE+BSE)\n" +
      "- **Quarterly results** — real reported revenue/EPS straight from Yahoo\n" +
      "- **AI Chat & per-stock analysis** powered by Groq (free Llama 3.3, no card)\n" +
      "- **News alerts** with BUY/SELL/HOLD signals from Yahoo headlines\n" +
      "- All data persists across sessions (4h/6h/24h cache)\n\n" +
      "**Get started:** Click **Refresh Live Prices** above, then explore the tabs.",
  }]);
  const [chatIn, setChatIn]     = useState("");
  const [chatLoad, setChatLoad] = useState(false);

  const endRef = useRef(null);
  const inputRef = useRef(null);

  /* Derived */
  const enriched   = enrichPortfolio(livePrices, analyses);
  const totCur     = enriched.reduce((s,p) => s + p.current, 0);
  const totPnl     = totCur - TOTAL_INVESTED;
  const sectors    = buildSectors(enriched);
  const alertCands = getAlerts(enriched);
  const liveN      = Object.keys(livePrices).length;
  const buyN       = enriched.filter(s => s.signal === "BUY").length;
  const holdN      = enriched.filter(s => s.signal === "HOLD").length;
  const sellN      = enriched.filter(s => s.signal === "SELL").length;

  /* ── Load persisted on mount ── */
  useEffect(() => {
    (async () => {
      const sp = await storageLoad("prices");
      if (sp?.data && sp?.at && Date.now() - sp.at < 4*3600000) {
        setLivePrices(sp.data);
        setPriceStatus("done");
        setPricedAt(sp.at);
      }
      const sa = await storageLoad("analyses");
      if (sa && typeof sa === "object") {
        const fresh = Object.fromEntries(
          Object.entries(sa).filter(([,v]) => v?.timestamp && Date.now() - v.timestamp < 24*3600000)
        );
        setAnalyses(fresh);
      }
      const sn = await storageLoad("alertNews");
      if (sn && typeof sn === "object") {
        const fresh = Object.fromEntries(
          Object.entries(sn).filter(([,v]) => v?._ts && Date.now() - v._ts < 6*3600000)
        );
        if (Object.keys(fresh).length > 0) {
          setAlertNews(fresh);
          const ts = Object.values(fresh).map(v => v._ts).filter(Boolean);
          if (ts.length) setAlertAt(Math.max(...ts));
        }
      }
      const sq = await storageLoad("quarterly");
      if (sq && typeof sq === "object") {
        const fresh = Object.fromEntries(
          Object.entries(sq).filter(([,v]) => v?._ts && Date.now() - v._ts < 24*3600000)
        );
        if (Object.keys(fresh).length > 0) {
          setQuarterly(fresh);
          const ts = Object.values(fresh).map(v => v._ts).filter(Boolean);
          if (ts.length) setQuarterAt(Math.max(...ts));
        }
      }
    })();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, chatLoad]);

  const handleSort = useCallback((key) => {
    setSk(prev => {
      if (prev === key) { setSasc(a => !a); return prev; }
      setSasc(false); return key;
    });
  }, []);

  /* ── Fetch live prices — IMPROVED:
       - Always processes, even if status is "done" (re-fetch on click)
       - Detects price changes vs previous fetch and flashes cells
       - Stops on first batch failure with clear error
       - Updates progress bar correctly
       - Reports stats at end (X/Y stocks updated)
     ── */
  const fetchPrices = useCallback(async (silent = false) => {
    if (priceStatus === "loading") return;
    if (!silent) {
      setPriceStatus("loading");
      setPricePct(0);
      setPriceErr("");
      setLastFetchStats(null);
    }

    try {
      const { prices, attempts, successes } =
        await fetchAllPrices((done, total) => {
          if (!silent) setPricePct(Math.round((done/total)*100));
        });

      if (successes === 0) {
        throw new Error("No prices retrieved. Check the browser console (F12) for [yahoo] error logs from individual tickers, and verify the Vite dev server is running with the yahoo-finance2 middleware.");
      }

      /* Detect changes vs previous snapshot and flash */
      const flashes = {};
      const prev = prevPricesRef.current;
      for (const [tk, v] of Object.entries(prices)) {
        const old = prev[tk];
        if (old && typeof old.price === "number" && Math.abs(v.price - old.price) > 0.0001) {
          flashes[tk] = v.price > old.price ? "up" : "dn";
        }
      }
      prevPricesRef.current = prices;

      const now = Date.now();
      setLivePrices(prices);
      setPriceStatus("done");
      setPricedAt(now);
      setLastFetchStats({ attempts, successes });
      await storageSave("prices", { data: prices, at: now });

      if (Object.keys(flashes).length > 0) {
        setPriceFlash(flashes);
        /* Clear flash after animation finishes (1.2s) */
        setTimeout(() => setPriceFlash({}), 1200);
      }
    } catch (e) {
      setPriceStatus("error");
      setPriceErr(e.message);
      /* If a silent (polled) fetch fails, turn off live mode so user sees error */
      if (silent) setLiveMode(false);
    }
  }, [priceStatus]);

  /* ── Live mode: poll every 30s while toggle is on ── */
  useEffect(() => {
    if (!liveMode) return;
    const id = setInterval(() => { fetchPrices(true); }, 30000);
    return () => clearInterval(id);
  }, [liveMode, fetchPrices]);

  /* ── Analyse single stock ── */
  const analyseStock = useCallback(async (stock) => {
    if (analysing) return;
    setAnalysing(stock.ticker);
    setSelTicker(stock.ticker);
    const today = new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
    const pnlStr = stock.pct !== null ? pf(stock.pct) : "bonus";

    const prompt =
      `Indian stock: ${stock.name} (NSE:${stock.ticker})\n` +
      `My position: ${stock.qty} shares avg buy ${stock.avgBuy > 0 ? inr(stock.avgBuy, 2) : "BONUS"}\n` +
      `LTP ${inr(stock.price, 2)} ${stock.isLive ? "(live)" : "(Mar-3 fallback)"}\n` +
      `Day move: ${stock.dayChangePct?.toFixed(2)}% | P&L: ${pnlStr}\n` +
      `Sector: ${stock.sector || "Unknown"}\n\n` +
      `Based on this data and your background knowledge of Indian equities, provide:\n\n` +
      `1. POSITION ASSESSMENT — is this position healthy / concerning?\n` +
      `2. SIGNAL: BUY / SELL / HOLD (state confidence as Low/Medium/High)\n` +
      `3. SUGGESTED TARGET rs.___ | STOP-LOSS rs.___ | HORIZON ___\n` +
      `4. TOP 2 RISKS for this name and sector\n` +
      `5. SPECIFIC ACTION for ${stock.qty} shares\n\n` +
      `Note: You don't have live news access. Base analysis on portfolio context, sector dynamics, and your training knowledge. Mention if the user should verify with current news.`;

    try {
      const text = await aiCall(
        [{ role: "user", content: prompt }],
        `You are a senior Indian equity analyst. Be direct, structured, actionable. Format with bold headers.`
      );
      const entry = { text, signal: extractSignal(text), timestamp: Date.now() };
      setAnalyses(prev => {
        const u = { ...prev, [stock.ticker]: entry };
        storageSave("analyses", u);
        return u;
      });
    } catch (e) {
      setAnalyses(prev => ({
        ...prev,
        [stock.ticker]: { text: `**Error:** ${e.message}`, signal: null, timestamp: Date.now() }
      }));
    }
    setAnalysing("");
  }, [analysing]);

  /* ── Fetch alert news ── */
  const fetchAlertNews = useCallback(async () => {
    if (alertLoading) return;
    setAlertLoading(true);
    const cands = getAlerts(enrichPortfolio(livePrices, analyses));
    setAlertPending(cands.map(s => s.ticker));
    const BATCH = 5;
    for (let i = 0; i < cands.length; i += BATCH) {
      const batch = cands.slice(i, i + BATCH);
      let res = {};
      try { res = await fetchNewsBatch(batch); }
      catch (e) { console.warn("alert batch failed:", e.message); }
      if (Object.keys(res).length) {
        setAlertNews(prev => {
          const u = { ...prev, ...res };
          storageSave("alertNews", u);
          return u;
        });
        /* NEW v13: feed news signals into `analyses` so the top-right
           BUY/HOLD/SELL counters and the portfolio table update too.
           Without this, the alert news lived in its own silo. */
        setAnalyses(prev => {
          const u = { ...prev };
          for (const [ticker, news] of Object.entries(res)) {
            if (news.signal && ["BUY", "SELL", "HOLD"].includes(news.signal)) {
              u[ticker] = {
                text: `**News-driven signal:** ${news.headline}\n\n_${news.reason}_\n\n**Action:** ${news.action}\n_Source: ${news.source}_`,
                signal: news.signal,
                timestamp: Date.now(),
              };
            }
          }
          storageSave("analyses", u);
          return u;
        });
      }
      const done = batch.map(s => s.ticker);
      setAlertPending(prev => prev.filter(t => !done.includes(t)));
    }
    setAlertAt(Date.now());
    setAlertLoading(false);
  }, [alertLoading, livePrices, analyses]);

  /* ── NEW: Fetch quarterly results ── */
  const fetchQuarterly = useCallback(async (subset) => {
    if (quarterLoading) return;
    setQuarterLoading(true);

    /* Decide which stocks to fetch:
       - subset == "all"   → all 100
       - subset == "top"   → top 25 by current value
       - subset == "loss"  → all stocks with P&L < -10k (urgent ones)
       - default           → top 50 by current value (sensible default) */
    let target;
    if (subset === "all") {
      target = enriched;
    } else if (subset === "top") {
      target = [...enriched].sort((a,b) => b.current - a.current).slice(0, 25);
    } else if (subset === "loss") {
      target = enriched.filter(s => s.pnl < -10000).sort((a,b) => a.pnl - b.pnl);
    } else {
      target = [...enriched].sort((a,b) => b.current - a.current).slice(0, 50);
    }

    setQuarterPending(target.map(s => s.ticker));

    const BATCH = 6;
    for (let i = 0; i < target.length; i += BATCH) {
      const batch = target.slice(i, i + BATCH);
      let res = {};
      try { res = await fetchQuarterBatch(batch); }
      catch (e) { console.warn("quarter batch failed:", e.message); }
      if (Object.keys(res).length) {
        setQuarterly(prev => {
          const u = { ...prev, ...res };
          storageSave("quarterly", u);
          return u;
        });
      }
      const done = batch.map(s => s.ticker);
      setQuarterPending(prev => prev.filter(t => !done.includes(t)));
    }
    setQuarterAt(Date.now());
    setQuarterLoading(false);
  }, [quarterLoading, enriched]);

  /* ── Chat ── */
  const sendChat = useCallback(async (override) => {
    const msg = (override || chatIn).trim();
    if (!msg || chatLoad) return;
    setChatIn("");
    setChatLoad(true);

    const today = new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
    const sys = `You are a senior Indian equity analyst. Today is ${today}. Be direct and actionable. You don't have live web access — use the portfolio context below and your training knowledge. Recommend the user verify time-sensitive claims.\n\n${buildCtx(enriched)}`;

    setMsgs(prev => {
      const hist = prev
        .filter((m,i) => !(i === 0 && m.role === "assistant"))
        .slice(-14);
      const fu = hist.findIndex(m => m.role === "user");
      const clean = fu > 0 ? hist.slice(fu) : hist;
      const apiMsgs = [
        ...clean.map(m => ({ role: m.role, content: m.content })),
        { role: "user", content: msg },
      ];

      (async () => {
        try {
          const text = await aiCall(apiMsgs, sys);
          setMsgs(p => [...p, { role: "assistant", content: text }]);
        } catch (e) {
          setMsgs(p => [...p, { role: "assistant", content: `**Error:** ${e.message}` }]);
        }
        setChatLoad(false);
      })();

      return [...prev, { role: "user", content: msg }];
    });
  }, [chatIn, chatLoad, enriched]);

  /* ── Filtered/sorted portfolio rows ── */
  const displayed = enriched.filter(s => {
    const t = fText.toLowerCase();
    return (s.name.toLowerCase().includes(t) || s.ticker.toLowerCase().includes(t) || s.sector.toLowerCase().includes(t))
        && (fRec === "ALL" || s.signal === fRec);
  }).sort((a,b) => {
    const av = a[sk] ?? 0, bv = b[sk] ?? 0;
    const c = typeof av === "string" ? av.localeCompare(bv) : av - bv;
    return sasc ? c : -c;
  });

  const selSt = selTicker ? enriched.find(s => s.ticker === selTicker) || null : null;
  const thP = { sk, asc: sasc, onSort: handleSort };

  /* ── Quarterly tab data filter ── */
  let qDisplayed;
  if (qFilter === "TOP") {
    qDisplayed = [...enriched].sort((a,b) => b.current - a.current).slice(0, 25);
  } else if (qFilter === "LOSS") {
    qDisplayed = enriched.filter(s => s.pnl < -10000).sort((a,b) => a.pnl - b.pnl);
  } else if (qFilter === "LATEST") {
    qDisplayed = enriched.filter(s => quarterly[s.ticker]).sort((a,b) =>
      (quarterly[b.ticker]?._ts || 0) - (quarterly[a.ticker]?._ts || 0));
  } else {
    qDisplayed = [...enriched].sort((a,b) => b.current - a.current);
  }

  return (
    <div className="pai">
      <style>{CSS}</style>

      {/* HEADER */}
      <div className="hdr">
        <div style={{display:"flex", alignItems:"center", gap:14}}>
          <span style={{fontFamily:"var(--mono)", fontSize:15, fontWeight:600, letterSpacing:"-.5px"}}>
            PORT<span style={{color:"var(--blue)"}}>AI</span>
          </span>
          <div style={{width:1, height:22, background:"var(--bd)"}}/>
          <div style={{fontSize:11, color:"var(--tx2)", lineHeight:1.4}}>
            Kishore Kunal<br/>
            <span style={{color:"var(--tx3)", fontSize:10}}>{BASE_PORT.length} stocks NSE/BSE</span>
          </div>
        </div>
        <div style={{display:"flex", gap:18, alignItems:"center", flexWrap:"wrap"}}>
          <div className="spill"><span className="slbl">Invested</span><span className="sval">{inr(TOTAL_INVESTED)}</span></div>
          <div className="spill"><span className="slbl">Current</span><span className="sval" style={{fontSize:16}}>{inr(totCur)}</span></div>
          <div className="spill">
            <span className="slbl">P&L</span>
            <span className="sval" style={{color:pc(totPnl), fontSize:15}}>
              {totPnl >= 0 ? "+" : "-"}{inr(Math.abs(totPnl))}
              <span style={{fontSize:12, marginLeft:6, opacity:.8}}>({pf((totPnl/TOTAL_INVESTED)*100)})</span>
            </span>
          </div>
        </div>
      </div>

      {/* PRICE BAR */}
      <div className="pbar">
        <button
          className={priceStatus === "loading" ? "" : "pri"}
          style={{fontSize:12, padding:"5px 12px"}}
          onClick={() => fetchPrices(false)}
          disabled={priceStatus === "loading"}>
          {priceStatus === "loading" ? `Fetching ${pricePct}%` : "Refresh Live Prices"}
        </button>
        <button
          onClick={() => setLiveMode(m => !m)}
          style={{
            fontSize:11, padding:"4px 10px",
            background: liveMode ? "var(--gd)" : "var(--s2)",
            color: liveMode ? "var(--green)" : "var(--tx2)",
            borderColor: liveMode ? "rgba(0,209,140,.3)" : "var(--bd2)",
            fontWeight: 600,
          }}
          title="Auto-refresh prices every 30 seconds">
          {liveMode ? "● LIVE 30s" : "○ Go Live"}
        </button>
        {priceStatus === "loading" && (
          <div className="ptrack">
            <div className="pfill" style={{width: pricePct + "%"}}/>
          </div>
        )}
        {priceStatus === "done" && (
          <span style={{fontSize:11, display:"flex", alignItems:"center", gap:5}}>
            <span className="ldot"/>
            <span style={{color:"var(--green)", fontWeight:500}}>
              {liveN} prices live
              {lastFetchStats && lastFetchStats.successes < lastFetchStats.attempts &&
                <span style={{color:"var(--amber)", marginLeft:4}}>
                  ({lastFetchStats.successes}/{lastFetchStats.attempts})
                </span>}
            </span>
            <span style={{color:"var(--tx2)"}}>{ago(pricedAt)} cached 4h</span>
          </span>
        )}
        {priceStatus === "error" && (
          <span style={{fontSize:11, color:"var(--red)"}}>Error: {priceErr}</span>
        )}
        {priceStatus === "idle" && (
          <span style={{fontSize:11, color:"var(--tx3)"}}>Mar-3 statement prices click to fetch live</span>
        )}
        <div className="chips">
          <span className="chip c-b">{buyN} BUY</span>
          <span className="chip c-h">{holdN} HOLD</span>
          <span className="chip c-s">{sellN} SELL</span>
          {Object.keys(analyses).length > 0 && (
            <span style={{fontSize:10, color:"var(--tx3)", marginLeft:3}}>
              {Object.keys(analyses).length} AI-analysed
            </span>
          )}
        </div>
      </div>

      {/* TABS */}
      <div className="tabs">
        {[
          ["portfolio","Portfolio"],
          ["quarterly", null],
          ["alerts", null],
          ["sectors","Sectors"],
          ["chat","AI Chat"],
        ].map(([id, lbl]) => (
          <button key={id} className={`tbtn${tab === id ? " on" : ""}`} onClick={() => setTab(id)}>
            {id === "alerts"
              ? <>Alerts{alertCands.length > 0 && <span className="tbadge">{alertCands.length}</span>}</>
              : id === "quarterly"
                ? <>Quarterly{Object.keys(quarterly).length > 0 && <span className="tbadge" style={{background:"var(--pd)", color:"var(--purple)"}}>{Object.keys(quarterly).length}</span>}</>
                : lbl}
          </button>
        ))}
      </div>

      {/* ════ PORTFOLIO TAB ════ */}
      {tab === "portfolio" && (
        <div className="playout">
          <div className="tpane">
            <div className="fbar">
              <input
                style={{maxWidth:165}}
                placeholder="Name / ticker / sector"
                value={fText}
                onChange={e => setFText(e.target.value)}/>
              {[["ALL","a"],["BUY","b"],["HOLD","h"],["SELL","s"]].map(([r, cls]) => (
                <button key={r} className={`rb ${cls}${fRec === r ? " on" : ""}`} onClick={() => setFRec(r)}>
                  {r === "ALL" ? `All (${BASE_PORT.length})` : `${r} (${enriched.filter(s => s.signal === r).length})`}
                </button>
              ))}
              <span style={{marginLeft:"auto", fontSize:10, color:"var(--tx3)"}}>{displayed.length} shown</span>
            </div>
            <div style={{overflowY:"auto", flex:1}}>
              <table className="stbl">
                <thead><tr>
                  <SortTH {...thP} thisKey="name" minW={150}>Stock</SortTH>
                  <SortTH {...thP} thisKey="sector">Sector</SortTH>
                  <SortTH {...thP} thisKey="price" align="right">LTP</SortTH>
                  <SortTH {...thP} thisKey="dayChangePct" align="right">Day %</SortTH>
                  <SortTH {...thP} thisKey="pnl" align="right">P&L</SortTH>
                  <SortTH {...thP} thisKey="pct" align="right">Return</SortTH>
                  <SortTH {...thP} thisKey="signal">Signal</SortTH>
                  <th/>
                </tr></thead>
                <tbody>
                  {displayed.map((s, i) => (
                    <tr
                      key={s.ticker}
                      className={selTicker === s.ticker ? "sel" : ""}
                      style={{background: i % 2 ? "var(--s2)" : "transparent"}}
                      onClick={() => { setSelTicker(s.ticker); if (!analyses[s.ticker]) analyseStock(s); }}>
                      <td>
                        <div className="tn">
                          {s.name}
                          {!s.isLive && <span title="Mar-3 price" style={{color:"var(--tx3)", fontSize:8, marginLeft:3}}>*</span>}
                          {s.aiSignal && <span title="AI-updated" style={{color:"var(--blue)", fontSize:8, marginLeft:2}}>+</span>}
                        </div>
                        <div className="tt">{s.ticker}</div>
                      </td>
                      <td><span className="ts">{s.sector}</span></td>
                      <td style={{
                        textAlign:"right", fontFamily:"var(--mono)", fontSize:12, fontWeight:600,
                        color: s.isLive ? "var(--green)" : "var(--tx2)",
                        animation: priceFlash[s.ticker] === "up" ? "flashup 1.2s ease-out" :
                                   priceFlash[s.ticker] === "dn" ? "flashdn 1.2s ease-out" : "none",
                      }}>
                        {inr(s.price, 2)}
                      </td>
                      <td style={{textAlign:"right", fontFamily:"var(--mono)", fontSize:11,
                        color: s.dayChangePct >= 0 ? "var(--green)" : "var(--red)"}}>
                        {s.isLive ? pf(s.dayChangePct, 2) : "-"}
                      </td>
                      <td style={{textAlign:"right", fontFamily:"var(--mono)", fontSize:12, fontWeight:700, color:pc(s.pnl)}}>
                        {s.pnl >= 0 ? "+" : "-"}{inr(Math.abs(s.pnl))}
                      </td>
                      <td style={{textAlign:"right", fontFamily:"var(--mono)", fontSize:12, fontWeight:700, color:pc(s.pct ?? 0)}}>
                        {s.pct !== null ? pf(s.pct) : "BONUS"}
                      </td>
                      <td><Badge v={s.signal}/></td>
                      <td>
                        <button
                          style={{fontSize:10, padding:"2px 7px"}}
                          disabled={analysing === s.ticker}
                          onClick={e => { e.stopPropagation(); analyseStock(s); }}>
                          {analysing === s.ticker
                            ? <span className="spin"/>
                            : analyses[s.ticker] ? "Re" : "Analyse"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Drawer */}
          <div className={`drawer${selSt ? " open" : ""}`}>
            {selSt && (
              <div className="di">
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10}}>
                  <div>
                    <div className="dname">{selSt.name}</div>
                    <div className="dmeta">
                      <span style={{fontFamily:"var(--mono)", fontSize:11, color:"var(--blue)"}}>{selSt.ticker}</span>
                      <Badge v={selSt.signal}/>
                      {selSt.aiSignal && selSt.aiSignal !== selSt.baseRec && (
                        <span style={{fontSize:10, color:"var(--amber)"}}>updated from {selSt.baseRec}</span>
                      )}
                    </div>
                    {selSt.analysedAt && (
                      <div style={{fontSize:10, color:"var(--tx3)", marginTop:3}}>
                        Analysed {ago(selSt.analysedAt)}
                      </div>
                    )}
                  </div>
                  <button className="ghost" style={{padding:"2px 6px", fontSize:14, lineHeight:1}} onClick={() => setSelTicker("")}>x</button>
                </div>

                <div className="sgrid">
                  {[
                    ["Shares", selSt.qty.toLocaleString("en-IN"), null],
                    ["Avg Buy", selSt.avgBuy > 0 ? inr(selSt.avgBuy, 2) : "BONUS", null],
                    ["LTP", inr(selSt.price, 2) + (selSt.isLive ? " LIVE" : " *"), selSt.isLive ? "var(--green)" : null],
                    ["Day Chg", selSt.isLive ? pf(selSt.dayChangePct, 2) : "-", selSt.isLive ? pc(selSt.dayChangePct) : null],
                    ["Invested", inr(selSt.invested), null],
                    ["Value", inr(selSt.current), null],
                    ["P&L rs.", (selSt.pnl >= 0 ? "+" : "-") + inr(Math.abs(selSt.pnl)), pc(selSt.pnl)],
                    ["Return", selSt.pct !== null ? pf(selSt.pct) : "BONUS", pc(selSt.pct ?? 0)],
                  ].map(([label, value, color]) => (
                    <div key={label} className="sc">
                      <div className="scl">{label}</div>
                      <div className="scv" style={color ? {color} : {}}>{value}</div>
                    </div>
                  ))}
                </div>

                {/* Show quarterly data inline if available */}
                {quarterly[selSt.ticker] && (
                  <div className="qhl" style={{marginBottom:10}}>
                    <strong style={{color:"var(--purple)"}}>{quarterly[selSt.ticker].quarter}:</strong>{" "}
                    Rev {quarterly[selSt.ticker].revenue} ({quarterly[selSt.ticker].revenueChange}),{" "}
                    Profit {quarterly[selSt.ticker].profit} ({quarterly[selSt.ticker].profitChange})
                  </div>
                )}

                <div className="abox">
                  {analysing === selSt.ticker ? (
                    <div style={{fontSize:12, color:"var(--tx2)", display:"flex", alignItems:"center", gap:7}}>
                      <span className="spin"/><span>Searching news for {selSt.ticker}</span>
                    </div>
                  ) : selSt.analysisText ? (
                    <>
                      <MD text={selSt.analysisText}/>
                      <div style={{display:"flex", gap:6, marginTop:12}}>
                        <button style={{flex:1, fontSize:11}} onClick={() => analyseStock(selSt)}>Re-analyse</button>
                        <button style={{flex:1, fontSize:11}} onClick={() => {
                          setTab("chat");
                          setTimeout(() => {
                            setChatIn(`Follow-up on ${selSt.name} (${selSt.ticker}): I hold ${selSt.qty}sh at avg rs.${selSt.avgBuy}. Final recommendation?`);
                            inputRef.current?.focus();
                          }, 100);
                        }}>Ask AI</button>
                      </div>
                    </>
                  ) : (
                    <button style={{width:"100%", padding:8, fontSize:12}} onClick={() => analyseStock(selSt)}>
                      Fetch news &amp; AI signal
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════ NEW: QUARTERLY RESULTS TAB ════ */}
      {tab === "quarterly" && (
        <div className="qrp">
          <div className="qrtb">
            <div style={{flex:1}}>
              <div style={{fontSize:13, fontWeight:600, marginBottom:2}}>
                Quarterly Results <span style={{fontSize:10, fontWeight:400, color:"var(--tx3)"}}>(Q3/Q4 FY26)</span>
              </div>
              <div style={{fontSize:11, color:"var(--tx2)"}}>
                {quarterAt
                  ? `Last fetched ${ago(quarterAt)} cached 24h ${Object.keys(quarterly).length} stocks loaded`
                  : "Fetches latest reported quarterly results revenue, profit, YoY change"}
              </div>
            </div>
            <div className="qfilter-bar">
              {[["ALL","All"],["TOP","Top 25"],["LOSS","Loss-makers"],["LATEST","Fetched"]].map(([k, l]) => (
                <button
                  key={k}
                  style={{fontSize:11, padding:"3px 9px", borderRadius:20,
                    background: qFilter === k ? "var(--s3)" : "transparent",
                    color: qFilter === k ? "var(--tx)" : "var(--tx2)"}}
                  onClick={() => setQFilter(k)}>
                  {l}
                </button>
              ))}
            </div>
            <button
              className={quarterLoading ? "" : "pri"}
              style={{fontSize:12, padding:"6px 14px"}}
              disabled={quarterLoading}
              onClick={() => fetchQuarterly(qFilter === "TOP" ? "top" : qFilter === "LOSS" ? "loss" : qFilter === "ALL" ? "all" : "default")}>
              {quarterLoading
                ? <><span className="spin" style={{marginRight:6}}/>Fetching {quarterPending.length} pending</>
                : "Fetch Latest Quarterly Results"}
            </button>
            {Object.keys(quarterly).length > 0 && (
              <button
                style={{fontSize:11}}
                onClick={() => { setQuarterly({}); storageSave("quarterly", {}); setQuarterAt(null); }}>
                Clear
              </button>
            )}
          </div>

          <div className="qrscroll">
            {qDisplayed.length === 0 ? (
              <div className="empty">
                No stocks match this filter.<br/>
                Try a different filter above.
              </div>
            ) : qDisplayed.map((s, i) => {
              const q       = quarterly[s.ticker] || null;
              const pending = quarterPending.includes(s.ticker);

              return (
                <div key={s.ticker} className="qcard fadein">
                  <div className="qctop">
                    <div>
                      <div className="qcname">{i + 1}. {s.name}</div>
                      <div className="qctk">{s.ticker} {s.sector}</div>
                    </div>
                    <div className="acbadges">
                      {q && <span className="qctag">{q.quarter}</span>}
                      <Badge v={s.signal}/>
                      <span style={{fontFamily:"var(--mono)", fontSize:11,
                        color: pc(s.pct ?? 0), fontWeight:600}}>
                        {s.pct !== null ? pf(s.pct) : "BONUS"}
                      </span>
                    </div>
                  </div>

                  {pending ? (
                    <div style={{fontSize:11, color:"var(--tx2)", display:"flex", alignItems:"center", gap:6, marginTop:7}}>
                      <span className="spin"/><span>Fetching {s.ticker} latest quarterly data</span>
                    </div>
                  ) : q ? (
                    <>
                      <div className="qmetrics">
                        <div className="qmcell">
                          <div className="qml">Revenue</div>
                          <div className="qmv">{q.revenue}</div>
                          <div className="qmsub" style={{color: q.revenueChange.includes("+") ? "var(--green)" : q.revenueChange.includes("-") ? "var(--red)" : "var(--tx2)"}}>
                            {q.revenueChange}
                          </div>
                        </div>
                        <div className="qmcell">
                          <div className="qml">Net Profit</div>
                          <div className="qmv">{q.profit}</div>
                          <div className="qmsub" style={{color: q.profitChange.includes("+") ? "var(--green)" : q.profitChange.includes("-") ? "var(--red)" : "var(--tx2)"}}>
                            {q.profitChange}
                          </div>
                        </div>
                        <div className="qmcell">
                          <div className="qml">Margin</div>
                          <div className="qmv">{q.margin}</div>
                          <div className="qmsub" style={{color:"var(--tx3)"}}>quarterly</div>
                        </div>
                        <div className="qmcell">
                          <div className="qml">Next Result</div>
                          <div className="qmv" style={{fontSize:11}}>{q.nextResultDate}</div>
                          <div className="qmsub" style={{color:"var(--tx3)"}}>expected</div>
                        </div>
                      </div>
                      {q.highlight && (
                        <div className="qhl">
                          <strong>Key takeaway:</strong> {q.highlight}
                        </div>
                      )}
                      <div className="qsrc">
                        <span>Source: {q.source || "—"}</span>
                        <span>Fetched {ago(q._ts)}</span>
                      </div>
                    </>
                  ) : (
                    <div style={{fontSize:11, color:"var(--tx3)", marginTop:6, fontStyle:"italic"}}>
                      Click <strong>Fetch Latest Quarterly Results</strong> above to load data for this stock.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ════ ALERTS TAB ════ */}
      {tab === "alerts" && (
        <div className="alp">
          <div className="altb">
            <div style={{flex:1}}>
              <div style={{fontSize:13, fontWeight:600, marginBottom:2}}>{alertCands.length} Alert Candidates</div>
              <div style={{fontSize:11, color:"var(--tx2)"}}>
                {alertAt
                  ? `News-driven signals fetched ${ago(alertAt)} cached 6h`
                  : "Click below to fetch today's news + AI signal for each stock"}
              </div>
            </div>
            <button
              className={alertLoading ? "" : "pri"}
              style={{fontSize:12, padding:"6px 14px"}}
              onClick={fetchAlertNews}
              disabled={alertLoading}>
              {alertLoading
                ? <><span className="spin" style={{marginRight:6}}/>Scanning news</>
                : "Load News & Signals"}
            </button>
            {Object.keys(alertNews).length > 0 && (
              <button style={{fontSize:11}} onClick={() => { setAlertNews({}); storageSave("alertNews", {}); setAlertAt(null); }}>
                Clear
              </button>
            )}
          </div>
          <div className="alscroll">
            {alertCands.length === 0 ? (
              <div className="empty">No alert candidates.<br/>Analyse stocks to update signals with AI.</div>
            ) : alertCands.map((s, i) => {
              const news = alertNews[s.ticker] || null;
              const pending = alertPending.includes(s.ticker);
              const dispSig = news?.signal || s.signal;

              return (
                <div key={s.ticker} className="acard fadein">
                  <div className="actop">
                    <div>
                      <div className="acname">
                        {i + 1}. {s.name}
                        {s.aiSignal && <span style={{color:"var(--blue)", fontSize:8, marginLeft:3}}>+</span>}
                      </div>
                      <div className="actk">{s.ticker} {s.sector}</div>
                    </div>
                    <div className="acbadges">
                      {news?.urgency && <UrgBadge v={news.urgency}/>}
                      <Badge v={dispSig}/>
                      {!news && !pending && <span style={{fontSize:10, color:"var(--tx3)"}}>static</span>}
                    </div>
                  </div>

                  <div className="acstats">
                    {[
                      ["LTP",     s.isLive ? inr(s.price, 2) : `${inr(s.price, 2)} *`, null],
                      ["Day",     s.isLive ? pf(s.dayChangePct, 2) : "-",              s.isLive ? pc(s.dayChangePct) : null],
                      ["Invested",inr(s.invested),                                      null],
                      ["P&L",    (s.pnl >= 0 ? "+" : "-") + inr(Math.abs(s.pnl)),     pc(s.pnl)],
                      ["Return", s.pct !== null ? pf(s.pct) : "BONUS",                pc(s.pct ?? 0)],
                    ].map(([lbl, val, col]) => (
                      <div key={lbl} className="ast">
                        <span className="astl">{lbl}</span>
                        <span className="astv" style={col ? {color:col} : {}}>{val}</span>
                      </div>
                    ))}
                  </div>

                  {pending ? (
                    <div style={{fontSize:11, color:"var(--tx2)", display:"flex", alignItems:"center", gap:6, marginTop:7}}>
                      <span className="spin"/><span>Fetching news for {s.ticker}</span>
                    </div>
                  ) : news ? (
                    <div className="anbox">
                      <div className="anhl">{news.headline}</div>
                      <div className="anreason">{news.reason}</div>
                      <div className="anact" style={{
                        color: dispSig === "SELL" ? "var(--red)" :
                               dispSig === "BUY"  ? "var(--green)" :
                               "var(--amber)"}}>
                        Action: {news.action}
                      </div>
                      {news.source && <div className="ansrc">Source: {news.source}</div>}
                    </div>
                  ) : (
                    <div style={{fontSize:10, color:"var(--tx3)", marginTop:6, fontStyle:"italic"}}>
                      Click Load News &amp; Signals above
                    </div>
                  )}

                  <div style={{display:"flex", gap:6, marginTop:9}}>
                    <button style={{fontSize:11, padding:"3px 9px"}} onClick={() => { setTab("portfolio"); analyseStock(s); }}>
                      Full Analyse
                    </button>
                    <button style={{fontSize:11, padding:"3px 9px"}} onClick={() => {
                      setTab("chat");
                      setTimeout(() => {
                        setChatIn(`Urgent: ${s.name} (${s.ticker}) ${s.qty}sh at avg rs.${s.avgBuy}. Based on today's news, should I exit?`);
                        inputRef.current?.focus();
                      }, 100);
                    }}>Ask AI</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ════ SECTORS TAB ════ */}
      {tab === "sectors" && (
        <div className="secp">
          <p style={{fontSize:11, color:"var(--tx2)", marginBottom:10}}>Warning &gt;20% sector weight = concentration risk</p>
          <div className="srow shdr">
            <div>Sector</div>
            <div style={{textAlign:"center"}}>Stks</div>
            <div style={{textAlign:"right"}}>Invested</div>
            <div style={{textAlign:"right"}}>Current</div>
            <div style={{textAlign:"right"}}>P&L</div>
            <div style={{textAlign:"right"}}>Return</div>
            <div>Weight</div>
            <div style={{textAlign:"center"}}>SELLs</div>
          </div>
          {sectors.map((sec, i) => {
            const bc = sec.weight > 20 ? "var(--red)" : sec.pct >= 0 ? "var(--green)" : "var(--amber)";
            return (
              <div key={sec.name} className="srow" style={{background: i % 2 ? "var(--s2)" : "transparent", borderRadius:4}}>
                <div style={{fontWeight:600, fontSize:12, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", paddingRight:8}}>{sec.name}</div>
                <div style={{textAlign:"center", color:"var(--tx2)", fontSize:11}}>{sec.count}</div>
                <div style={{textAlign:"right", fontFamily:"var(--mono)", fontSize:11, color:"var(--tx2)"}}>{inr(sec.invested)}</div>
                <div style={{textAlign:"right", fontFamily:"var(--mono)", fontSize:11, fontWeight:500}}>{inr(sec.current)}</div>
                <div style={{textAlign:"right", fontFamily:"var(--mono)", fontSize:11, fontWeight:700, color:pc(sec.pnl)}}>
                  {sec.pnl >= 0 ? "+" : "-"}{inr(Math.abs(sec.pnl))}
                </div>
                <div style={{textAlign:"right", fontFamily:"var(--mono)", fontSize:11, fontWeight:700, color:pc(sec.pct)}}>
                  {pf(sec.pct)}
                </div>
                <div style={{display:"flex", alignItems:"center", gap:7, paddingRight:3}}>
                  <div className="btrack" style={{flex:1}}>
                    <div className="bfill" style={{width: Math.min(100, sec.weight*3.5) + "%", background:bc}}/>
                  </div>
                  <span style={{fontFamily:"var(--mono)", fontSize:10, fontWeight:700,
                    color: sec.weight > 20 ? "var(--red)" : "var(--tx2)", minWidth:34, textAlign:"right"}}>
                    {sec.weight.toFixed(1)}%{sec.weight > 20 ? " !" : ""}
                  </span>
                </div>
                <div style={{textAlign:"center", fontSize:11}}>
                  {sec.sells > 0 ? <span className="wtag">{sec.sells}!</span> : <span style={{color:"var(--tx3)"}}>-</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ════ CHAT TAB ════ */}
      {tab === "chat" && (
        <div className="chatp">
          <div className="cq">
            {PROMPTS.map(q => (
              <button key={q} className="qchip" onClick={() => sendChat(q)}>{q}</button>
            ))}
          </div>
          <div className="cmsgs">
            {msgs.map((m, i) => (
              <div key={i} className={`msg${m.role === "user" ? " u" : ""}`}>
                <div className={`mav ${m.role === "user" ? "user" : "ai"}`}>
                  {m.role === "user" ? "KK" : "AI"}
                </div>
                <div className={`mbub ${m.role === "user" ? "user" : "ai"}`}>
                  {m.role === "user"
                    ? <span style={{color:"var(--blue)"}}>{m.content}</span>
                    : <MD text={m.content}/>}
                </div>
              </div>
            ))}
            {chatLoad && (
              <div className="msg">
                <div className="mav ai">AI</div>
                <div className="mbub ai">
                  <div style={{fontSize:11, color:"var(--tx2)", marginBottom:5}}>Searching the web</div>
                  <div className="tdots"><div className="dot"/><div className="dot"/><div className="dot"/></div>
                </div>
              </div>
            )}
            <div ref={endRef}/>
          </div>
          <div className="cinrow">
            <input
              ref={inputRef}
              value={chatIn}
              onChange={e => setChatIn(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChat(); } }}
              placeholder="Ask about any stock, sector, or market update (Enter to send)"
              disabled={chatLoad}/>
            <button className="sbtn" onClick={() => sendChat()} disabled={chatLoad || !chatIn.trim()}>
              {chatLoad ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}

      <div className="foot">
        <span>* = Mar-3 price LIVE = real-time + = AI-updated signal</span>
        <span>Prices via Claude web search server-side cached 4h</span>
        <span>Alert news 6h Quarterly results 24h Analyses 24h</span>
      </div>
    </div>
  );
}
