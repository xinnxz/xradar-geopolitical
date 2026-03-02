// ========================================
// Vercel Serverless Function: Crypto Proxy
// Route: /api/crypto
// Uses CoinGecko API (FREE, no key needed!)
// Returns top crypto prices + sparklines
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

// Crypto IDs for CoinGecko
const CRYPTO_IDS = [
  'bitcoin', 'ethereum', 'tether', 'binancecoin', 'solana',
  'ripple', 'cardano', 'dogecoin', 'polkadot', 'avalanche-2',
  'chainlink', 'polygon', 'litecoin', 'uniswap', 'stellar',
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const cacheKey = 'crypto_markets';
    const cached = getCached(cacheKey);
    if (cached) {
      return res.status(200).json({ data: cached, cached: true, source: 'coingecko' });
    }

    const ids = CRYPTO_IDS.join(',');
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=15&page=1&sparkline=true&price_change_percentage=1h,24h,7d`;

    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform to our format
    const coins = data.map(coin => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      image: coin.image,
      price: coin.current_price,
      change24h: coin.price_change_percentage_24h || 0,
      change7d: coin.price_change_percentage_7d_in_currency || 0,
      change1h: coin.price_change_percentage_1h_in_currency || 0,
      marketCap: coin.market_cap,
      volume24h: coin.total_volume,
      high24h: coin.high_24h,
      low24h: coin.low_24h,
      sparkline: coin.sparkline_in_7d?.price || [],
      rank: coin.market_cap_rank,
    }));

    if (coins.length > 0) {
      setMemoCache(cacheKey, coins);
    }

    return res.status(200).json({
      data: coins,
      total: coins.length,
      cached: false,
      source: 'coingecko',
    });
  } catch (error) {
    console.error('Crypto proxy error:', error);
    return res.status(500).json({ error: error.message });
  }
}
