// ========================================
// Market Data Service
// Real API integration:
// - Frankfurter → Forex (30 mata uang, gratis, unlimited)
// - API Ninjas → Gold + Oil (50k req/bulan)
// ========================================

import { API_URLS, API_KEYS, FOREX_PAIRS } from '../utils/constants';
import { getCache, setCache } from './cacheService';

// ---------- FOREX (Frankfurter API - REAL, Free, Unlimited) ----------

/**
 * Fetch semua forex rates dari Frankfurter (30 mata uang)
 */
export async function fetchForexRates() {
  const cacheKey = 'forex_rates_all';
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    const symbols = FOREX_PAIRS.map(p => p.to).join(',');
    const res = await fetch(`${API_URLS.FRANKFURTER}/latest?from=USD&to=${symbols}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    setCache(cacheKey, data, 5 * 60 * 1000);
    return data;
  } catch (error) {
    console.error('Forex fetch error:', error);
    return null;
  }
}

/**
 * Fetch previous day forex for change calculation
 */
async function fetchPreviousForex() {
  const cacheKey = 'forex_prev';
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    const d = new Date(Date.now() - 86400000);
    const day = d.getDay();
    const daysBack = day === 0 ? 2 : day === 6 ? 1 : 0;
    const prevDate = new Date(d - daysBack * 86400000).toISOString().split('T')[0];
    const symbols = FOREX_PAIRS.map(p => p.to).join(',');
    const res = await fetch(`${API_URLS.FRANKFURTER}/${prevDate}?from=USD&to=${symbols}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    setCache(cacheKey, data, 60 * 60 * 1000);
    return data;
  } catch (e) {
    return null;
  }
}

/**
 * Ambil data historis forex untuk chart
 */
export async function fetchForexHistory(from = 'USD', to = 'EUR', days = 30) {
  const cacheKey = `forex_history_${from}_${to}_${days}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - days * 86400000).toISOString().split('T')[0];
    const res = await fetch(`${API_URLS.FRANKFURTER}/${startDate}..${endDate}?from=${from}&to=${to}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const chartData = Object.entries(data.rates).map(([date, rates]) => ({
      date,
      value: rates[to],
    }));
    setCache(cacheKey, chartData, 15 * 60 * 1000);
    return chartData;
  } catch (error) {
    console.error('Forex history error:', error);
    return null;
  }
}

// ---------- GOLD + OIL (Alpha Vantage via Vercel proxy) ----------

/**
 * Fetch commodity prices dari Vercel proxy /api/commodities
 * Proxy uses Alpha Vantage (25 req/day free, 1h cache server-side)
 * Di localhost: fallback ke simulated data
 */
async function fetchCommoditiesFromProxy() {
  const cacheKey = 'commodities_proxy_v2'; // Bumped: old cache lacked history
  const cached = getCache(cacheKey);
  if (cached) return cached;

  // Only use proxy on Vercel (not localhost)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return null;
  }

  try {
    const res = await fetch('/api/commodities?type=all');
    if (!res.ok) throw new Error(`Proxy error: ${res.status}`);
    const data = await res.json();
    setCache(cacheKey, data, 30 * 60 * 1000); // Cache 30 min di client
    return data;
  } catch (error) {
    console.info('Commodities proxy unavailable, using fallback');
    return null;
  }
}

/**
 * Fetch gold price — dari proxy atau fallback
 */
export async function fetchGoldPrice() {
  const cacheKey = 'gold_price';
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const proxy = await fetchCommoditiesFromProxy();
  if (proxy?.gold) {
    const result = {
      price: proxy.gold.price,
      change: 0,
      changePercent: 0,
      date: proxy.gold.date,
      history: proxy.gold.history || [],
      isReal: true,
    };

    // Calculate change from history
    if (result.history.length >= 2) {
      const last = result.history[result.history.length - 1]?.value || result.price;
      const prev = result.history[result.history.length - 2]?.value || last;
      result.change = +(last - prev).toFixed(2);
      result.changePercent = prev ? +((result.change / prev) * 100).toFixed(2) : 0;
    }

    setCache(cacheKey, result, 30 * 60 * 1000);
    return result;
  }

  return getFallbackGold();
}

function getFallbackGold() {
  const seed = new Date().toISOString().split('T')[0];
  const hash = Array.from(seed).reduce((a, c) => a + c.charCodeAt(0), 0);
  const noise = (Math.sin(hash * 2.7) * 100) - 50;
  return { price: +(5200 + noise).toFixed(2), change: +noise.toFixed(2), changePercent: +((noise / 5200) * 100).toFixed(2), history: [], isReal: false };
}

/**
 * Fetch oil price (WTI + Brent) — dari proxy atau fallback
 */
export async function fetchOilPrice() {
  const cacheKey = 'oil_price';
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const proxy = await fetchCommoditiesFromProxy();
  if (proxy?.wti || proxy?.brent) {
    const fallback = getFallbackOil();
    const result = {
      wti: proxy.wti ? { ...proxy.wti, history: proxy.wtiHistory || [] } : fallback.wti,
      brent: proxy.brent ? { ...proxy.brent, history: proxy.brentHistory || [] } : fallback.brent,
      isReal: !!(proxy.wti || proxy.brent),
    };
    setCache(cacheKey, result, 30 * 60 * 1000);
    return result;
  }

  return getFallbackOil();
}

function getFallbackOil() {
  const seed = new Date().toISOString().split('T')[0];
  const hash = Array.from(seed).reduce((a, c) => a + c.charCodeAt(0), 0);
  const n1 = Math.sin(hash * 1.1) * 3;
  const n2 = Math.sin(hash * 1.3) * 3;
  return {
    wti: { price: +(67 + n1).toFixed(2), change: +n1.toFixed(2), changePercent: +((n1 / 67) * 100).toFixed(2), history: [] },
    brent: { price: +(72 + n2).toFixed(2), change: +n2.toFixed(2), changePercent: +((n2 / 72) * 100).toFixed(2), history: [] },
    isReal: false,
  };
}

// ---------- COMBINED SNAPSHOT ----------

/**
 * Build complete price snapshot (forex real + commodities real)
 */
export async function fetchPriceSnapshot() {
  const cacheKey = 'price_snapshot_v3'; // Bumped: now includes history data
  const cached = getCache(cacheKey);
  if (cached) return cached;

  // Parallel fetch semua data
  const [forexData, prevForex, goldData, oilData] = await Promise.all([
    fetchForexRates(),
    fetchPreviousForex(),
    fetchGoldPrice(),
    fetchOilPrice(),
  ]);

  // Build forex array
  const forexArray = FOREX_PAIRS.map(pair => {
    const current = forexData?.rates?.[pair.to];
    const previous = prevForex?.rates?.[pair.to];
    const change = current && previous ? current - previous : 0;
    const changePercent = current && previous ? ((current - previous) / previous) * 100 : 0;
    return {
      pair: pair.label,
      value: current || 0,
      change: +change.toFixed(4),
      changePercent: +changePercent.toFixed(2),
      flag: pair.flag,
      region: pair.region,
    };
  });

  const snapshot = {
    oil: oilData || getFallbackOil(),
    gold: goldData || getFallbackGold(),
    forex: forexArray,
    lastUpdated: new Date().toISOString(),
    isRealForex: !!forexData,
    isRealGold: goldData?.isReal || false,
    isRealOil: oilData?.isReal || false,
  };

  setCache(cacheKey, snapshot, 5 * 60 * 1000);
  return snapshot;
}

// ---------- CHART DATA (seed-based, konsisten per hari) ----------

export function getOilData(days = 30) {
  const cacheKey = 'oil_chart';
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const data = [];
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now); date.setDate(date.getDate() - i);
    const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
    const r1 = Math.sin(seed * 1.1) * 10000;
    const r2 = Math.sin(seed * 1.3) * 10000;
    data.push({
      date: date.toISOString().split('T')[0],
      wti: +(67 + (r1 - Math.floor(r1) - 0.5) * 6).toFixed(2),
      brent: +(72 + (r2 - Math.floor(r2) - 0.5) * 6).toFixed(2),
    });
  }
  setCache(cacheKey, data, 60 * 60 * 1000);
  return data;
}

export function getGoldData(days = 30) {
  const cacheKey = 'gold_chart';
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const data = [];
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now); date.setDate(date.getDate() - i);
    const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
    const r = Math.sin(seed * 2.7) * 10000;
    data.push({
      date: date.toISOString().split('T')[0],
      price: +(5200 + (r - Math.floor(r) - 0.5) * 200).toFixed(2),
    });
  }
  setCache(cacheKey, data, 60 * 60 * 1000);
  return data;
}

// ---------- CRYPTO (CoinGecko via Vercel proxy) ----------

/**
 * Fetch crypto prices from /api/crypto (CoinGecko)
 * Returns top 15 coins with prices, changes, sparklines
 */
export async function fetchCryptoPrices() {
  const cacheKey = 'crypto_prices';
  const cached = getCache(cacheKey);
  if (cached) return cached;

  // Only on Vercel
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return [];
  }

  try {
    const res = await fetch('/api/crypto');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.error) throw new Error(json.error);
    const data = json.data || [];
    if (data.length > 0) setCache(cacheKey, data, 5 * 60 * 1000);
    return data;
  } catch (e) {
    console.error('Crypto fetch error:', e);
    return [];
  }
}

// ---------- STOCKS/INDICES (Finnhub via Vercel proxy) ----------

/**
 * Fetch stock indices from /api/stocks (Finnhub)
 * Returns SPY, QQQ, DIA, VIX, etc.
 */
export async function fetchStockIndices() {
  const cacheKey = 'stock_indices';
  const cached = getCache(cacheKey);
  if (cached) return cached;

  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return [];
  }

  try {
    const res = await fetch('/api/stocks');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.error) throw new Error(json.error);
    const data = json.data || [];
    if (data.length > 0) setCache(cacheKey, data, 5 * 60 * 1000);
    return data;
  } catch (e) {
    console.error('Stocks fetch error:', e);
    return [];
  }
}
