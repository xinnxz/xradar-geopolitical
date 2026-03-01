// ========================================
// Market Data Service
// Menangani API calls untuk harga minyak, emas, dan forex
// ========================================

import { API_URLS, FOREX_PAIRS } from '../utils/constants';
import { getCache, setCache } from './cacheService';

// ---------- FOREX (Frankfurter API - Free, No Key) ----------

/**
 * Ambil forex rates terbaru dari Frankfurter API
 * @returns {Promise<Object>} { base, date, rates: { RUB, CNY, EUR, ... } }
 */
export async function fetchForexRates() {
  const cacheKey = 'forex_rates';
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    const symbols = FOREX_PAIRS.map(p => p.to).join(',');
    const res = await fetch(`${API_URLS.FRANKFURTER}/latest?from=USD&to=${symbols}`);
    const data = await res.json();

    setCache(cacheKey, data, 5 * 60 * 1000); // Cache 5 menit
    return data;
  } catch (error) {
    console.error('Forex fetch error:', error);
    return null;
  }
}

/**
 * Ambil data historis forex untuk chart
 */
export async function fetchForexHistory(from = 'USD', to = 'EUR', days = 30) {
  const cacheKey = `forex_history_${from}_${to}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - days * 86400000).toISOString().split('T')[0];
    const res = await fetch(
      `${API_URLS.FRANKFURTER}/${startDate}..${endDate}?from=${from}&to=${to}`
    );
    const data = await res.json();

    // Transform ke array untuk Recharts
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

// ---------- MOCK DATA (untuk development) ----------

/**
 * Generate mock oil price data
 */
export function getMockOilData() {
  const data = [];
  const now = new Date();
  let price = 78.5;

  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    price += (Math.random() - 0.48) * 3;
    price = Math.max(65, Math.min(95, price));

    data.push({
      date: date.toISOString().split('T')[0],
      wti: +(price).toFixed(2),
      brent: +(price + 3.5 + Math.random() * 2).toFixed(2),
    });
  }
  return data;
}

/**
 * Generate mock gold price data
 */
export function getMockGoldData() {
  const data = [];
  const now = new Date();
  let price = 2340;

  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    price += (Math.random() - 0.45) * 30;
    price = Math.max(2100, Math.min(2600, price));

    data.push({
      date: date.toISOString().split('T')[0],
      price: +price.toFixed(2),
    });
  }
  return data;
}

/**
 * Get current mock prices snapshot
 */
export function getMockPriceSnapshot() {
  return {
    oil: {
      wti: { price: 82.47, change: -1.23, changePercent: -1.47 },
      brent: { price: 86.91, change: -0.89, changePercent: -1.01 },
    },
    gold: {
      price: 2412.30, change: 18.50, changePercent: 0.77,
    },
    forex: [
      { pair: 'USD/RUB', value: 92.45, change: 1.23, changePercent: 1.35, flag: '🇷🇺' },
      { pair: 'USD/CNY', value: 7.24, change: 0.02, changePercent: 0.28, flag: '🇨🇳' },
      { pair: 'USD/EUR', value: 0.92, change: -0.004, changePercent: -0.43, flag: '🇪🇺' },
      { pair: 'USD/GBP', value: 0.79, change: -0.003, changePercent: -0.38, flag: '🇬🇧' },
      { pair: 'USD/JPY', value: 154.82, change: 0.67, changePercent: 0.43, flag: '🇯🇵' },
      { pair: 'USD/IDR', value: 15847, change: 35, changePercent: 0.22, flag: '🇮🇩' },
    ],
  };
}
