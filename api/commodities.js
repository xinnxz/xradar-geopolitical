// ========================================
// Vercel Serverless Function: Commodities Proxy
// Route: /api/commodities
// Fetches gold + oil prices from Alpha Vantage (server-side)
// Now includes historical data for charts!
// ========================================

// Server-side cache
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

/**
 * Parse valid data points, skip dots "."
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
 * Gold spot price
 */
async function fetchGoldSpot(apiKey) {
  const cached = getCached('gold_spot');
  if (cached) return cached;

  const url = `https://www.alphavantage.co/query?function=GOLD_SILVER_SPOT&symbol=GOLD&apikey=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Gold API error: ${res.status}`);
  const data = await res.json();
  if (data['Error Message'] || data['Note'] || data['Information']) {
    throw new Error(data['Error Message'] || data['Note'] || data['Information']);
  }

  const price = parseFloat(data.price);
  if (isNaN(price)) throw new Error('Invalid gold price');

  const result = { price, date: data.timestamp, unit: 'USD/oz' };
  setMemoCache('gold_spot', result);
  return result;
}

/**
 * Gold historical daily prices
 */
async function fetchGoldHistory(apiKey) {
  const cached = getCached('gold_history');
  if (cached) return cached;

  const url = `https://www.alphavantage.co/query?function=GOLD_SILVER_HISTORY&symbol=GOLD&interval=daily&apikey=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Gold history error: ${res.status}`);
  const data = await res.json();
  if (data['Error Message'] || data['Note'] || data['Information']) {
    throw new Error(data['Error Message'] || data['Note'] || data['Information']);
  }

  const points = (data?.data || []).slice(0, 90);
  const history = points
    .filter(p => p.price && !isNaN(parseFloat(p.price)))
    .map(p => ({ date: p.date, value: parseFloat(p.price) }))
    .reverse(); // Oldest first

  setMemoCache('gold_history', history);
  return history;
}

/**
 * Oil price (WTI or BRENT) — spot + history
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
    spot: {
      price,
      change,
      changePercent,
      date: latest.date,
      unit: data.unit || 'USD/barrel',
    },
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

    if (type === 'all' || type === 'gold') {
      try {
        const [spot, history] = await Promise.all([
          fetchGoldSpot(apiKey),
          fetchGoldHistory(apiKey),
        ]);
        result.gold = { ...spot, history };
      } catch (e) {
        result.gold = null;
        result.goldError = e.message;
      }
    }

    if (type === 'all' || type === 'wti') {
      try {
        const data = await fetchOilData('wti', apiKey);
        result.wti = data.spot;
        result.wtiHistory = data.history;
      } catch (e) {
        result.wti = null;
        result.wtiError = e.message;
      }
    }

    if (type === 'all' || type === 'brent') {
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
