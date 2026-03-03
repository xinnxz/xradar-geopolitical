// ============================================================================
// USGS EARTHQUAKE SERVICE — Real-time seismic data from USGS GeoJSON Feed
// API: https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
// Free, no API key required, updates every 5 minutes
// ============================================================================
//
// PENJELASAN:
// - USGS menyediakan feed GeoJSON gratis untuk semua gempa bumi global
// - Kita ambil gempa M2.5+ dalam 24 jam terakhir (biasanya 50-200 events)
// - Data sudah include magnitude, kedalaman, lokasi, dan timestamp
// - Response di-cache 10 menit untuk hemat bandwidth
// ============================================================================

import { getCache, setCache } from './cacheService';

const CACHE_KEY = 'usgs_earthquakes';
const CACHE_TTL = 10 * 60 * 1000; // 10 menit

// Feed URLs dari USGS — sorted by period dan magnitude threshold
const USGS_FEEDS = {
  // M2.5+ dalam 24 jam — balanced antara jumlah data dan relevansi
  day_2_5: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson',
  // M4.5+ dalam 7 hari — gempa signifikan saja
  week_4_5: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson',
  // Signifikan dalam 30 hari — gempa major
  month_sig: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson',
};

/**
 * Klasifikasi magnitude gempa → severity level
 * Menggunakan skala Richter standar:
 *   < 3.0 = minor (biasanya tidak terasa)
 *   3.0-4.9 = light (terasa di sekitar epigenter)
 *   5.0-5.9 = moderate (bisa merusak bangunan lemah)
 *   6.0-6.9 = strong (merusak di area luas)
 *   7.0+ = major/great (bencana besar)
 */
function classifyMagnitude(mag) {
  if (mag >= 7.0) return { level: 'major', color: '#dc2626', label: 'MAJOR' };
  if (mag >= 6.0) return { level: 'strong', color: '#ef4444', label: 'STRONG' };
  if (mag >= 5.0) return { level: 'moderate', color: '#f97316', label: 'MODERATE' };
  if (mag >= 4.0) return { level: 'light', color: '#f59e0b', label: 'LIGHT' };
  return { level: 'minor', color: '#10b981', label: 'MINOR' };
}

/**
 * Parse USGS GeoJSON feature → format yang kita pakai di map
 * @param {Object} feature - USGS GeoJSON feature
 * @returns {Object} Parsed earthquake data
 */
function parseFeature(feature) {
  const { properties, geometry } = feature;
  const [lon, lat, depth] = geometry.coordinates;
  const mag = properties.mag;
  const classification = classifyMagnitude(mag);
  
  return {
    id: feature.id,
    lat,
    lon,
    magnitude: mag,
    depth: depth, // km
    place: properties.place || 'Unknown location',
    time: new Date(properties.time),
    updated: new Date(properties.updated),
    url: properties.url, // Link ke detail USGS
    felt: properties.felt, // Jumlah report "terasa"
    tsunami: properties.tsunami === 1,
    alert: properties.alert, // green/yellow/orange/red
    ...classification,
  };
}

/**
 * Fetch gempa bumi dari USGS API
 * @param {'day_2_5'|'week_4_5'|'month_sig'} feed - Feed yang dipakai
 * @returns {Promise<Array>} Array of earthquake objects
 * 
 * CARA KERJA:
 * 1. Cek cache dulu (hemat API calls)
 * 2. Kalau expired/kosong, fetch dari USGS
 * 3. Parse GeoJSON features → format sederhana
 * 4. Sort by magnitude (terbesar dulu)
 * 5. Simpan ke cache
 */
export async function fetchEarthquakes(feed = 'day_2_5') {
  // Step 1: Check cache
  const cached = getCache(CACHE_KEY);
  if (cached) return cached;

  try {
    // Step 2: Fetch dari USGS
    const url = USGS_FEEDS[feed] || USGS_FEEDS.day_2_5;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`USGS API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Step 3: Parse semua features
    const earthquakes = data.features.map(parseFeature);
    
    // Step 4: Sort by magnitude (terbesar dulu)
    earthquakes.sort((a, b) => b.magnitude - a.magnitude);
    
    // Step 5: Cache hasilnya
    setCache(CACHE_KEY, earthquakes, CACHE_TTL);
    
    return earthquakes;
  } catch (error) {
    console.error('Failed to fetch USGS earthquake data:', error);
    // Return mock data jika API gagal
    return getMockEarthquakes();
  }
}

/**
 * Mock earthquake data — dipakai kalau API error
 * Berdasarkan gempa-gempa bersejarah yang memang pernah terjadi
 */
function getMockEarthquakes() {
  return [
    { id: 'mock_1', lat: 37.77, lon: 141.56, magnitude: 6.8, depth: 50, place: '60km E of Namie, Japan', time: new Date(), level: 'strong', color: '#ef4444', label: 'STRONG', tsunami: false, felt: 245 },
    { id: 'mock_2', lat: -4.52, lon: 129.19, magnitude: 5.6, depth: 30, place: 'Banda Sea, Indonesia', time: new Date(), level: 'moderate', color: '#f97316', label: 'MODERATE', tsunami: false, felt: 12 },
    { id: 'mock_3', lat: 38.32, lon: 38.47, magnitude: 5.1, depth: 10, place: 'Eastern Turkey', time: new Date(), level: 'moderate', color: '#f97316', label: 'MODERATE', tsunami: false, felt: 89 },
    { id: 'mock_4', lat: -22.34, lon: -68.31, magnitude: 4.8, depth: 120, place: 'Antofagasta, Chile', time: new Date(), level: 'light', color: '#f59e0b', label: 'LIGHT', tsunami: false, felt: 5 },
    { id: 'mock_5', lat: 36.84, lon: -121.56, magnitude: 4.2, depth: 8, place: '12km S of Hollister, CA', time: new Date(), level: 'light', color: '#f59e0b', label: 'LIGHT', tsunami: false, felt: 150 },
    { id: 'mock_6', lat: -6.59, lon: 105.60, magnitude: 5.4, depth: 15, place: 'Sunda Strait, Indonesia', time: new Date(), level: 'moderate', color: '#f97316', label: 'MODERATE', tsunami: true, felt: 34 },
    { id: 'mock_7', lat: 28.20, lon: 84.73, magnitude: 4.5, depth: 10, place: 'Central Nepal', time: new Date(), level: 'light', color: '#f59e0b', label: 'LIGHT', tsunami: false, felt: 67 },
    { id: 'mock_8', lat: 19.42, lon: -155.29, magnitude: 3.8, depth: 5, place: 'Hawaii Island', time: new Date(), level: 'minor', color: '#10b981', label: 'MINOR', tsunami: false, felt: 23 },
  ];
}
