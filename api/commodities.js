// ========================================
// Vercel Serverless Function: Commodities Proxy
// Route: /api/commodities
// Fetches gold + oil prices from Alpha Vantage (server-side)
// ========================================

// Server-side cache (persists between warm invocations)
let cache = {};
const CACHE_TTL = 60 * 60 * 1000; // 1 hour cache (hemat kuota: 25 req/day)

function getCached(key) {
  const entry = cache[key];
  if (entry && Date.now() - entry.time < CACHE_TTL) return entry.data;
  return null;
}

function setMemoCache(key, data) {
  cache[key] = { data, time: Date.now() };
}

/**
 * Gold price via GOLD_SILVER_SPOT endpoint
 * Response format: { nominal: "XAUUSD", timestamp: "...", price: "5278.73" }
 */
async function fetchGoldPrice(apiKey) {
  const cached = getCached('gold');
  if (cached) return cached;

  const url = `https://www.alphavantage.co/query?function=GOLD_SILVER_SPOT&symbol=GOLD&apikey=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Gold API error: ${res.status}`);
  const data = await res.json();

  if (data['Error Message'] || data['Note'] || data['Information']) {
    throw new Error(data['Error Message'] || data['Note'] || data['Information']);
  }

  const price = parseFloat(data.price);
  if (isNaN(price)) throw new Error('Invalid gold price data');

  const result = {
    price,
    change: 0, // Spot doesn't give previous close
    changePercent: 0,
    date: data.timestamp,
    unit: 'USD/oz',
  };

  setMemoCache('gold', result);
  return result;
}

/**
 * Oil price via WTI or BRENT endpoint
 * Response format: { name, interval, unit, data: [{date, value}, ...] }
 * Data is sorted newest first
 */
async function fetchOilPrice(type, apiKey) {
  const cached = getCached(type);
  if (cached) return cached;

  const fn = type === 'wti' ? 'WTI' : 'BRENT';
  const url = `https://www.alphavantage.co/query?function=${fn}&interval=daily&apikey=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Oil ${type} API error: ${res.status}`);
  const data = await res.json();

  if (data['Error Message'] || data['Note'] || data['Information']) {
    throw new Error(data['Error Message'] || data['Note'] || data['Information']);
  }

  const points = data?.data;
  if (!points?.length) throw new Error(`No ${type} data points`);

  // Find latest valid data point (skip dots ".")
  let latest = null, previous = null;
  for (const point of points) {
    if (point.value !== '.' && !isNaN(parseFloat(point.value))) {
      if (!latest) latest = point;
      else if (!previous) { previous = point; break; }
    }
  }

  if (!latest) throw new Error(`No valid ${type} price data`);

  const price = parseFloat(latest.value);
  const prevPrice = previous ? parseFloat(previous.value) : price;
  const change = +(price - prevPrice).toFixed(2);
  const changePercent = prevPrice ? +((change / prevPrice) * 100).toFixed(2) : 0;

  const result = {
    price,
    change,
    changePercent,
    date: latest.date,
    unit: data.unit || 'USD/barrel',
  };

  setMemoCache(type, result);
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

    // Fetch gold
    if (type === 'all' || type === 'gold') {
      try {
        result.gold = await fetchGoldPrice(apiKey);
      } catch (e) {
        result.gold = null;
        result.goldError = e.message;
      }
    }

    // Fetch WTI Crude Oil
    if (type === 'all' || type === 'wti') {
      try {
        result.wti = await fetchOilPrice('wti', apiKey);
      } catch (e) {
        result.wti = null;
        result.wtiError = e.message;
      }
    }

    // Fetch Brent Crude Oil
    if (type === 'all' || type === 'brent') {
      try {
        result.brent = await fetchOilPrice('brent', apiKey);
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
