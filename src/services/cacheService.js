// ========================================
// Cache Service
// Gunakan LocalStorage untuk cache API responses
// ========================================

const CACHE_PREFIX = 'xradar_';

/**
 * Simpan data ke cache dengan TTL (Time To Live)
 * @param {string} key - Kunci cache
 * @param {*} data - Data yang di-cache
 * @param {number} ttlMs - TTL dalam milidetik
 */
export function setCache(key, data, ttlMs = 5 * 60 * 1000) {
  try {
    const cacheEntry = {
      data,
      expiry: Date.now() + ttlMs,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cacheEntry));
  } catch (e) {
    console.warn('Cache write failed:', e);
  }
}

/**
 * Ambil data dari cache (return null jika expired/tidak ada)
 * @param {string} key - Kunci cache
 * @returns {*|null} Data dari cache atau null
 */
export function getCache(key) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;

    const entry = JSON.parse(raw);
    if (Date.now() > entry.expiry) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return entry.data;
  } catch (e) {
    return null;
  }
}

/**
 * Hapus cache tertentu
 */
export function clearCache(key) {
  localStorage.removeItem(CACHE_PREFIX + key);
}

/**
 * Hapus semua cache XRadar
 */
export function clearAllCache() {
  Object.keys(localStorage)
    .filter(k => k.startsWith(CACHE_PREFIX))
    .forEach(k => localStorage.removeItem(k));
}
