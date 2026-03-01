// ========================================
// Constants & Configuration
// ========================================

// API Base URLs
export const API_URLS = {
  FRANKFURTER: 'https://api.frankfurter.dev/v1',
  GNEWS: 'https://gnews.io/api/v4',
};

// API Keys — set di .env file (VITE_ prefix agar Vite expose ke client)
export const API_KEYS = {
  GNEWS: import.meta.env.VITE_GNEWS_KEY || '',
};

// Forex pairs yang ditampilkan di dashboard
export const FOREX_PAIRS = [
  { from: 'USD', to: 'RUB', label: 'USD/RUB', flag: '🇷🇺' },
  { from: 'USD', to: 'CNY', label: 'USD/CNY', flag: '🇨🇳' },
  { from: 'USD', to: 'EUR', label: 'USD/EUR', flag: '🇪🇺' },
  { from: 'USD', to: 'GBP', label: 'USD/GBP', flag: '🇬🇧' },
  { from: 'USD', to: 'JPY', label: 'USD/JPY', flag: '🇯🇵' },
  { from: 'USD', to: 'IDR', label: 'USD/IDR', flag: '🇮🇩' },
];

// Warna chart
export const CHART_COLORS = {
  blue: '#3b82f6',
  cyan: '#06b6d4',
  green: '#10b981',
  red: '#ef4444',
  gold: '#f59e0b',
  purple: '#8b5cf6',
  orange: '#f97316',
};

// Level risiko geopolitik
export const RISK_LEVELS = {
  LOW: { label: 'Low', color: '#10b981', range: [0, 25] },
  MODERATE: { label: 'Moderate', color: '#f59e0b', range: [26, 50] },
  HIGH: { label: 'High', color: '#f97316', range: [51, 75] },
  CRITICAL: { label: 'Critical', color: '#ef4444', range: [76, 100] },
};

// Kategori berita
export const NEWS_CATEGORIES = [
  { id: 'all', label: 'All News', icon: 'globe' },
  { id: 'war', label: 'Conflict', icon: 'swords' },
  { id: 'economy', label: 'Economy', icon: 'trending-up' },
  { id: 'sanctions', label: 'Sanctions', icon: 'ban' },
  { id: 'energy', label: 'Energy', icon: 'zap' },
  { id: 'diplomacy', label: 'Diplomacy', icon: 'handshake' },
];

// Map config
export const MAP_CONFIG = {
  center: [30, 45], // Middle East centered
  zoom: 3,
  minZoom: 2,
  maxZoom: 10,
  tileUrl: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
};

// Refresh intervals (milliseconds)
export const REFRESH_INTERVALS = {
  FOREX: 5 * 60 * 1000,      // 5 minutes
  COMMODITIES: 15 * 60 * 1000, // 15 minutes
  NEWS: 10 * 60 * 1000,       // 10 minutes
  RISK: 30 * 60 * 1000,       // 30 minutes
};

// Sidebar navigation items
export const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
  { id: 'markets', label: 'Markets', icon: 'TrendingUp' },
  { id: 'news', label: 'News Feed', icon: 'Newspaper' },
  { id: 'map', label: 'Conflict Map', icon: 'Map' },
  { id: 'risk', label: 'Risk Index', icon: 'ShieldAlert' },
];
