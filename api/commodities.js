// ========================================
// Vercel Serverless Function: Commodities Proxy
// Route: /api/commodities
// Fetches gold + oil prices from Alpha Vantage (server-side)
// ========================================

let cache = {};
const CACHE_TTL = 60 * 60 * 1000; // 1 hour cache (hemat kuota: 25 req/day)

function getCached(key) {
  const entry = cache[key];
  if (entry && Date.now() - entry.time < CACHE_TTL) return entry.data;
  return null;
}

async function fetchAlphaVantage(fn) {
  const apiKey = process.env.ALPHA_VANTAGE_KEY;
  if (!apiKey) throw new Error('ALPHA_VANTAGE_KEY not configured');

  const url = `https://www.alphavantage.co/query?function=${fn}&interval=daily&apikey=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Alpha Vantage error: ${res.status}`);
  const data = await res.json();

  if (data['Error Message'] || data['Note']) {
    throw new Error(data['Error Message'] || data['Note']);
  }

  return data;
}

function parseAlphaVantageData(data) {
  // Alpha Vantage commodity response: { name, interval, unit, data: [{date, value}, ...] }
  const points = data?.data;
  if (!points?.length) return null;

  // Get latest and previous values
  const latest = points[0];
  const previous = points[1];

  const price = parseFloat(latest.value);
  const prevPrice = previous ? parseFloat(previous.value) : price;
  const change = +(price - prevPrice).toFixed(2);
  const changePercent = prevPrice ? +((change / prevPrice) * 100).toFixed(2) : 0;

  return {
    price,
    change,
    changePercent,
    date: latest.date,
    unit: data.unit || 'USD',
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { type = 'all' } = req.query;

    const result = {};

    // Gold
    if (type === 'all' || type === 'gold') {
      const goldCached = getCached('gold');
      if (goldCached) {
        result.gold = goldCached;
      } else {
        try {
          const goldData = await fetchAlphaVantage('GOLD');
          result.gold = parseAlphaVantageData(goldData);
          if (result.gold) cache.gold = { data: result.gold, time: Date.now() };
        } catch (e) {
          result.gold = null;
          result.goldError = e.message;
        }
      }
    }

    // WTI Crude Oil
    if (type === 'all' || type === 'wti') {
      const wtiCached = getCached('wti');
      if (wtiCached) {
        result.wti = wtiCached;
      } else {
        try {
          const wtiData = await fetchAlphaVantage('WTI');
          result.wti = parseAlphaVantageData(wtiData);
          if (result.wti) cache.wti = { data: result.wti, time: Date.now() };
        } catch (e) {
          result.wti = null;
          result.wtiError = e.message;
        }
      }
    }

    // Brent Crude Oil
    if (type === 'all' || type === 'brent') {
      const brentCached = getCached('brent');
      if (brentCached) {
        result.brent = brentCached;
      } else {
        try {
          const brentData = await fetchAlphaVantage('BRENT');
          result.brent = parseAlphaVantageData(brentData);
          if (result.brent) cache.brent = { data: result.brent, time: Date.now() };
        } catch (e) {
          result.brent = null;
          result.brentError = e.message;
        }
      }
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
