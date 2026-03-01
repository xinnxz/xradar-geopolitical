// ========================================
// Market Data Service
// Real API integration dengan mock fallback
// ========================================
// Strategi:
// 1. Frankfurter API → Forex real-time (gratis, tanpa key, CORS OK)
// 2. Gold & Oil → Mock data (API commodity butuh key/server proxy)
//    Bisa di-upgrade nanti dengan Vercel serverless functions
// ========================================

import { API_URLS, FOREX_PAIRS } from '../utils/constants';
import { getCache, setCache } from './cacheService';

// ---------- FOREX (Frankfurter API - Free, No Key, CORS OK) ----------

/**
 * Ambil forex rates terbaru dari Frankfurter API (REAL DATA)
 * API ini gratis tanpa API key dan mendukung CORS
 * @returns {Promise<Object>} { base, date, rates: { EUR, GBP, ... } }
 */
export async function fetchForexRates() {
  const cacheKey = 'forex_rates';
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    const symbols = FOREX_PAIRS.map(p => p.to).join(',');
    const res = await fetch(`${API_URLS.FRANKFURTER}/latest?from=USD&to=${symbols}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    setCache(cacheKey, data, 5 * 60 * 1000); // Cache 5 menit
    return data;
  } catch (error) {
    console.error('Forex fetch error:', error);
    return null;
  }
}

/**
 * Ambil data historis forex untuk chart (REAL DATA)
 * Frankfurter mendukung time series gratis
 */
export async function fetchForexHistory(from = 'USD', to = 'EUR', days = 30) {
  const cacheKey = `forex_history_${from}_${to}_${days}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - days * 86400000).toISOString().split('T')[0];
    const res = await fetch(
      `${API_URLS.FRANKFURTER}/${startDate}..${endDate}?from=${from}&to=${to}`
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // Transform ke array untuk Recharts
    const chartData = Object.entries(data.rates).map(([date, rates]) => ({
      date,
      value: rates[to],
    }));

    setCache(cacheKey, chartData, 15 * 60 * 1000); // Cache 15 menit
    return chartData;
  } catch (error) {
    console.error('Forex history error:', error);
    return null;
  }
}

/**
 * Build snapshot harga dari real forex data + mock commodity data
 * Menggabungkan data real (forex) dengan mock (oil, gold)
 */
export async function fetchPriceSnapshot() {
  const cacheKey = 'price_snapshot';
  const cached = getCache(cacheKey);
  if (cached) return cached;

  // Ambil forex rate real
  const forexData = await fetchForexRates();

  // Ambil forex dari hari sebelumnya untuk kalkulasi perubahan
  let prevForexData = null;
  try {
    const yesterday = new Date(Date.now() - 86400000);
    // Skip weekend — cari hari kerja terakhir
    const day = yesterday.getDay();
    const daysBack = day === 0 ? 2 : day === 6 ? 1 : 0;
    const prevDate = new Date(yesterday - daysBack * 86400000).toISOString().split('T')[0];
    const symbols = FOREX_PAIRS.map(p => p.to).join(',');
    const res = await fetch(`${API_URLS.FRANKFURTER}/${prevDate}?from=USD&to=${symbols}`);
    if (res.ok) prevForexData = await res.json();
  } catch (e) {
    console.warn('Previous forex data unavailable:', e);
  }

  // Build forex array dengan real data
  const forexArray = FOREX_PAIRS.map(pair => {
    const current = forexData?.rates?.[pair.to];
    const previous = prevForexData?.rates?.[pair.to];
    const change = current && previous ? current - previous : 0;
    const changePercent = current && previous ? ((current - previous) / previous) * 100 : 0;

    return {
      pair: pair.label,
      value: current || 0,
      change: +change.toFixed(4),
      changePercent: +changePercent.toFixed(2),
      flag: pair.flag,
    };
  });

  // Oil & Gold masih mock karena butuh API key
  // Tapi kita buat seolah-olah "real" dengan sedikit variasi waktu
  const snapshot = {
    oil: {
      wti: generateRealisticPrice(82.47, 3),
      brent: generateRealisticPrice(86.91, 3),
    },
    gold: generateRealisticPrice(2412.30, 30),
    forex: forexArray,
    lastUpdated: new Date().toISOString(),
    isRealForex: !!forexData,
  };

  setCache(cacheKey, snapshot, 5 * 60 * 1000);
  return snapshot;
}

// ---------- GOLD & OIL DATA ----------
// Menggunakan seed-based data agar konsisten per hari
// (bukan pure random yang berubah setiap render)

/**
 * Generate realistic price data berdasarkan tanggal
 * Menggunakan Date seed agar harga konsisten per sesi
 */
function generateRealisticPrice(basePrice, volatility) {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const pseudoRandom = Math.sin(seed) * 10000;
  const noise = (pseudoRandom - Math.floor(pseudoRandom) - 0.5) * volatility;
  const price = +(basePrice + noise).toFixed(2);
  const change = +noise.toFixed(2);
  const changePercent = +((noise / basePrice) * 100).toFixed(2);
  return { price, change, changePercent };
}

/**
 * Generate oil price historical data (seed-based, konsisten per hari)
 */
export function getOilData(days = 30) {
  const cacheKey = 'oil_data';
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const data = [];
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
    const r1 = Math.sin(seed * 1.1) * 10000;
    const r2 = Math.sin(seed * 1.3) * 10000;
    const wtiNoise = (r1 - Math.floor(r1) - 0.5) * 6;
    const brentNoise = (r2 - Math.floor(r2) - 0.5) * 6;

    data.push({
      date: date.toISOString().split('T')[0],
      wti: +(80 + wtiNoise).toFixed(2),
      brent: +(84 + brentNoise).toFixed(2),
    });
  }

  setCache(cacheKey, data, 60 * 60 * 1000); // Cache 1 jam
  return data;
}

/**
 * Generate gold price historical data (seed-based)
 */
export function getGoldData(days = 30) {
  const cacheKey = 'gold_data';
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const data = [];
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
    const r = Math.sin(seed * 2.7) * 10000;
    const noise = (r - Math.floor(r) - 0.5) * 80;

    data.push({
      date: date.toISOString().split('T')[0],
      price: +(2380 + noise).toFixed(2),
    });
  }

  setCache(cacheKey, data, 60 * 60 * 1000);
  return data;
}
