// ========================================
// Vercel Serverless Function: Stocks/Indices Proxy
// Route: /api/stocks
// Uses Finnhub API (free tier: 60 req/min)
// Returns major global indices + VIX
// ========================================

// Server-side cache
let cache = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached(key) {
  const entry = cache[key];
  if (entry && Date.now() - entry.time < CACHE_TTL) return entry.data;
  return null;
}

function setMemoCache(key, data) {
  cache[key] = { data, time: Date.now() };
}

const delay = (ms) => new Promise(r => setTimeout(r, ms));

// Instruments to fetch — ETFs that track major indices
const INSTRUMENTS = [
  { symbol: 'SPY',  name: 'S&P 500',       icon: '📈', sector: 'US' },
  { symbol: 'QQQ',  name: 'NASDAQ 100',     icon: '💻', sector: 'US' },
  { symbol: 'DIA',  name: 'Dow Jones',      icon: '🏭', sector: 'US' },
  { symbol: 'IWM',  name: 'Russell 2000',   icon: '📊', sector: 'US' },
  { symbol: 'EFA',  name: 'MSCI EAFE',      icon: '🌍', sector: 'International' },
  { symbol: 'EEM',  name: 'Emerging Markets', icon: '🌏', sector: 'Emerging' },
  { symbol: 'GLD',  name: 'Gold ETF',       icon: '🥇', sector: 'Commodity' },
  { symbol: 'SLV',  name: 'Silver ETF',     icon: '🥈', sector: 'Commodity' },
  { symbol: 'USO',  name: 'Oil ETF',        icon: '🛢️', sector: 'Commodity' },
  { symbol: 'TLT',  name: 'US Treasury 20Y', icon: '🏛️', sector: 'Bond' },
  { symbol: 'VXX',  name: 'VIX Volatility', icon: '⚡', sector: 'Volatility' },
  { symbol: 'UUP',  name: 'US Dollar Index', icon: '💵', sector: 'Currency' },
];

// Key rotation
const exhaustedKeys = new Map();
const EXHAUSTED_TTL = 60 * 60 * 1000;

function getAllFinnhubKeys() {
  const keys = [];
  if (process.env.FINNHUB_KEY) keys.push(process.env.FINNHUB_KEY);
  for (let i = 2; i <= 10; i++) {
    const key = process.env[`FINNHUB_KEY_${i}`];
    if (key) keys.push(key);
  }
  return keys;
}

function getAvailableKey() {
  const allKeys = getAllFinnhubKeys();
  const now = Date.now();
  for (const key of allKeys) {
    const exhaustedAt = exhaustedKeys.get(key);
    if (exhaustedAt && now - exhaustedAt > EXHAUSTED_TTL) exhaustedKeys.delete(key);
    if (!exhaustedKeys.has(key)) return key;
  }
  return null;
}

async function fetchQuote(symbol, apiKey) {
  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;
  const res = await fetch(url);

  if (res.status === 429 || res.status === 403) {
    exhaustedKeys.set(apiKey, Date.now());
    throw new Error(`Rate limit: ${res.status}`);
  }

  if (!res.ok) throw new Error(`Finnhub error: ${res.status}`);
  return res.json();
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const allKeys = getAllFinnhubKeys();
  if (allKeys.length === 0) {
    return res.status(500).json({
      error: 'FINNHUB_KEY not configured',
      hint: 'Add FINNHUB_KEY to Vercel env vars (free at finnhub.io)',
    });
  }

  try {
    const cacheKey = 'stocks_all';
    const cached = getCached(cacheKey);
    if (cached) {
      return res.status(200).json({ data: cached, cached: true, source: 'finnhub' });
    }

    const results = [];

    for (let i = 0; i < INSTRUMENTS.length; i++) {
      const inst = INSTRUMENTS[i];
      const apiKey = getAvailableKey();
      if (!apiKey) {
        console.error('All Finnhub keys exhausted');
        break;
      }

      try {
        const quote = await fetchQuote(inst.symbol, apiKey);
        
        // Finnhub quote: c=current, d=change, dp=percent change, h=high, l=low, o=open, pc=prev close
        if (quote && quote.c && quote.c > 0) {
          results.push({
            symbol: inst.symbol,
            name: inst.name,
            icon: inst.icon,
            sector: inst.sector,
            price: quote.c,
            change: quote.d || 0,
            changePercent: quote.dp || 0,
            high: quote.h || 0,
            low: quote.l || 0,
            open: quote.o || 0,
            prevClose: quote.pc || 0,
          });
        }
      } catch (e) {
        console.error(`✗ ${inst.symbol}: ${e.message}`);
      }

      // Small delay between calls
      if (i < INSTRUMENTS.length - 1) await delay(200);
    }

    if (results.length > 0) {
      setMemoCache(cacheKey, results);
    }

    return res.status(200).json({
      data: results,
      total: results.length,
      cached: false,
      source: 'finnhub',
    });
  } catch (error) {
    console.error('Stocks proxy error:', error);
    return res.status(500).json({ error: error.message });
  }
}
