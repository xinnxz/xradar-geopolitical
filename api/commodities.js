// ========================================
// Vercel Serverless Function: Commodities Proxy
// Route: /api/commodities
// Fetches gold + oil prices from Alpha Vantage (server-side)
// Now includes historical data for charts!
// ========================================

// Server-side cache (persists within warm instance)
let cache = {};
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

function getCached(key) {
  const entry = cache[key];
  if (entry && Date.now() - entry.time < CACHE_TTL) return entry.data;
  return null;
}

function setMemoCache(key, data) {
  cache[key] = { data, time: Date.now() };
}

/** Small delay to avoid Alpha Vantage 5 req/min burst limit */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Parse valid data points from Alpha Vantage commodities API
 * Skips dots "." which indicate no data for that day
 */
function parseDataPoints(points, limit = 90) {
  if (!points?.length) return [];
  const valid = [];
  for (const p of points) {
    if (p.value !== '.' && !isNaN(parseFloat(p.value))) {
      valid.push({
        date: p.date,
        value: parseFloat(p.value),
      });
    }
    if (valid.length >= limit) break;
  }
  return valid.reverse(); // Oldest first for charts
}

/**
 * Gold: uses GOLD_SILVER_HISTORY (returns both spot and history in one call!)
 * This reduces API calls from 2 → 1 for gold
 */
async function fetchGoldAll(apiKey) {
  const cached = getCached('gold_all');
  if (cached) return cached;

  const url = `https://www.alphavantage.co/query?function=GOLD_SILVER_HISTORY&symbol=GOLD&interval=daily&apikey=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Gold API error: ${res.status}`);
  const data = await res.json();
  if (data['Error Message'] || data['Note'] || data['Information']) {
    throw new Error(data['Error Message'] || data['Note'] || data['Information']);
  }

  const raw = (data?.data || []);
  // Spot = latest valid point
  const latest = raw.find(p => p.price && !isNaN(parseFloat(p.price)));
  const prev = raw.filter(p => p.price && !isNaN(parseFloat(p.price)))[1];

  if (!latest) throw new Error('No valid gold price');

  const price = parseFloat(latest.price);
  const prevPrice = prev ? parseFloat(prev.price) : price;
  const change = +(price - prevPrice).toFixed(2);
  const changePercent = prevPrice ? +((change / prevPrice) * 100).toFixed(2) : 0;

  // History: last 90 valid daily prices
  const history = raw
    .filter(p => p.price && !isNaN(parseFloat(p.price)))
    .slice(0, 90)
    .map(p => ({ date: p.date, value: parseFloat(p.price) }))
    .reverse();

  const result = {
    spot: { price, change, changePercent, date: latest.date, unit: 'USD/oz' },
    history,
  };

  setMemoCache('gold_all', result);
  return result;
}

/**
 * Oil price (WTI or BRENT) — spot + history from one API call
 */
async function fetchOilData(type, apiKey) {
  const cached = getCached(`oil_${type}`);
  if (cached) return cached;

  const fn = type === 'wti' ? 'WTI' : 'BRENT';
  const url = `https://www.alphavantage.co/query?function=${fn}&interval=daily&apikey=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Oil ${type} error: ${res.status}`);
  const data = await res.json();
  if (data['Error Message'] || data['Note'] || data['Information']) {
    throw new Error(data['Error Message'] || data['Note'] || data['Information']);
  }

  const points = data?.data;
  if (!points?.length) throw new Error(`No ${type} data`);

  // Find latest + previous for spot
  let latest = null, previous = null;
  for (const p of points) {
    if (p.value !== '.' && !isNaN(parseFloat(p.value))) {
      if (!latest) latest = p;
      else if (!previous) { previous = p; break; }
    }
  }

  if (!latest) throw new Error(`No valid ${type} data`);

  const price = parseFloat(latest.value);
  const prevPrice = previous ? parseFloat(previous.value) : price;
  const change = +(price - prevPrice).toFixed(2);
  const changePercent = prevPrice ? +((change / prevPrice) * 100).toFixed(2) : 0;

  // Historical 90 days for chart
  const history = parseDataPoints(points, 90);

  const result = {
    spot: { price, change, changePercent, date: latest.date, unit: data.unit || 'USD/barrel' },
    history,
  };

  setMemoCache(`oil_${type}`, result);
  return result;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const apiKey = process.env.ALPHA_VANTAGE_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ALPHA_VANTAGE_KEY not configured' });
  }

  try {
    const { type = 'all' } = req.query;
    const result = {};

    // Sequential calls with delays to avoid 5 req/min burst limit
    // Gold: 1 API call (was 2, now combined into GOLD_SILVER_HISTORY)
    if (type === 'all' || type === 'gold') {
      try {
        const gold = await fetchGoldAll(apiKey);
        result.gold = { ...gold.spot, history: gold.history };
      } catch (e) {
        result.gold = null;
        result.goldError = e.message;
      }
    }

    // WTI: 1 API call (delay 1.5s from gold to avoid burst)
    if (type === 'all' || type === 'wti') {
      if (type === 'all') await delay(1500);
      try {
        const data = await fetchOilData('wti', apiKey);
        result.wti = data.spot;
        result.wtiHistory = data.history;
      } catch (e) {
        result.wti = null;
        result.wtiError = e.message;
      }
    }

    // BRENT: 1 API call (delay 1.5s from WTI)
    if (type === 'all' || type === 'brent') {
      if (type === 'all') await delay(1500);
      try {
        const data = await fetchOilData('brent', apiKey);
        result.brent = data.spot;
        result.brentHistory = data.history;
      } catch (e) {
        result.brent = null;
        result.brentError = e.message;
      }
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
