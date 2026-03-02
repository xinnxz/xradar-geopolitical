// ========================================
// Constants & Configuration
// ========================================

// API Base URLs
export const API_URLS = {
  FRANKFURTER: 'https://api.frankfurter.dev/v1',
  API_NINJAS: 'https://api.api-ninjas.com/v1',
  GNEWS: 'https://gnews.io/api/v4',
  ACLED: 'https://acleddata.com/api',
};

// API Keys — VITE_ prefix agar Vite expose ke client
export const API_KEYS = {
  GNEWS: import.meta.env.VITE_GNEWS_KEY || '',
  API_NINJAS: import.meta.env.VITE_API_NINJAS_KEY || '',
};

// ========================================
// FOREX — 30 pasangan mata uang (SEMUA dari Frankfurter)
// ========================================
export const FOREX_PAIRS = [
  // Major & Geopolitically relevant
  { from: 'USD', to: 'EUR', label: 'USD/EUR', flag: '🇪🇺', region: 'Europe' },
  { from: 'USD', to: 'GBP', label: 'USD/GBP', flag: '🇬🇧', region: 'Europe' },
  { from: 'USD', to: 'JPY', label: 'USD/JPY', flag: '🇯🇵', region: 'Asia' },
  { from: 'USD', to: 'CHF', label: 'USD/CHF', flag: '🇨🇭', region: 'Europe' },
  { from: 'USD', to: 'CNY', label: 'USD/CNY', flag: '🇨🇳', region: 'Asia' },
  { from: 'USD', to: 'CAD', label: 'USD/CAD', flag: '🇨🇦', region: 'Americas' },
  { from: 'USD', to: 'AUD', label: 'USD/AUD', flag: '🇦🇺', region: 'Oceania' },
  // Emerging Markets & Conflict-affected
  { from: 'USD', to: 'TRY', label: 'USD/TRY', flag: '🇹🇷', region: 'Middle East' },
  { from: 'USD', to: 'ZAR', label: 'USD/ZAR', flag: '🇿🇦', region: 'Africa' },
  { from: 'USD', to: 'BRL', label: 'USD/BRL', flag: '🇧🇷', region: 'Americas' },
  { from: 'USD', to: 'INR', label: 'USD/INR', flag: '🇮🇳', region: 'Asia' },
  { from: 'USD', to: 'IDR', label: 'USD/IDR', flag: '🇮🇩', region: 'Asia' },
  { from: 'USD', to: 'MXN', label: 'USD/MXN', flag: '🇲🇽', region: 'Americas' },
  { from: 'USD', to: 'KRW', label: 'USD/KRW', flag: '🇰🇷', region: 'Asia' },
  { from: 'USD', to: 'ILS', label: 'USD/ILS', flag: '🇮🇱', region: 'Middle East' },
  // Nordics & Eastern Europe
  { from: 'USD', to: 'SEK', label: 'USD/SEK', flag: '🇸🇪', region: 'Europe' },
  { from: 'USD', to: 'NOK', label: 'USD/NOK', flag: '🇳🇴', region: 'Europe' },
  { from: 'USD', to: 'DKK', label: 'USD/DKK', flag: '🇩🇰', region: 'Europe' },
  { from: 'USD', to: 'PLN', label: 'USD/PLN', flag: '🇵🇱', region: 'Europe' },
  { from: 'USD', to: 'CZK', label: 'USD/CZK', flag: '🇨🇿', region: 'Europe' },
  { from: 'USD', to: 'HUF', label: 'USD/HUF', flag: '🇭🇺', region: 'Europe' },
  { from: 'USD', to: 'RON', label: 'USD/RON', flag: '🇷🇴', region: 'Europe' },
  // Asia-Pacific
  { from: 'USD', to: 'SGD', label: 'USD/SGD', flag: '🇸🇬', region: 'Asia' },
  { from: 'USD', to: 'HKD', label: 'USD/HKD', flag: '🇭🇰', region: 'Asia' },
  { from: 'USD', to: 'NZD', label: 'USD/NZD', flag: '🇳🇿', region: 'Oceania' },
  { from: 'USD', to: 'MYR', label: 'USD/MYR', flag: '🇲🇾', region: 'Asia' },
  { from: 'USD', to: 'PHP', label: 'USD/PHP', flag: '🇵🇭', region: 'Asia' },
  { from: 'USD', to: 'THB', label: 'USD/THB', flag: '🇹🇭', region: 'Asia' },
  // Others
  { from: 'USD', to: 'ISK', label: 'USD/ISK', flag: '🇮🇸', region: 'Europe' },
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

// Forex region filter options
export const FOREX_REGIONS = ['All', 'Europe', 'Asia', 'Americas', 'Middle East', 'Africa', 'Oceania'];

// Map config
export const MAP_CONFIG = {
  center: [30, 45],
  zoom: 3,
  minZoom: 2,
  maxZoom: 10,
  tileUrl: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
};

// Refresh intervals (milliseconds)
export const REFRESH_INTERVALS = {
  FOREX: 5 * 60 * 1000,
  COMMODITIES: 15 * 60 * 1000,
  NEWS: 10 * 60 * 1000,
  RISK: 30 * 60 * 1000,
};

// Sidebar navigation items
export const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
  { id: 'markets', label: 'Markets', icon: 'TrendingUp' },
  { id: 'news', label: 'News Feed', icon: 'Newspaper' },
  { id: 'map', label: 'Conflict Map', icon: 'Map' },
  { id: 'risk', label: 'Risk Index', icon: 'ShieldAlert' },
  { id: 'about', label: 'About', icon: 'Info' },
];

// ========================================
// External Links — Professional TradingView & Source URLs
// ========================================
export const EXTERNAL_LINKS = {
  // Commodity TradingView charts
  GOLD: 'https://www.tradingview.com/symbols/XAUUSD/',
  WTI: 'https://www.tradingview.com/symbols/USOIL/',
  BRENT: 'https://www.tradingview.com/symbols/UKOIL/',

  // Forex — TradingView symbol URL builder
  forexPair: (from, to) => `https://www.tradingview.com/symbols/${from}${to}/`,

  // Conflict data
  ACLED_COUNTRY: (country) => `https://acleddata.com/dashboard/#/dashboard/${encodeURIComponent(country)}`,
  ACLED_HOME: 'https://acleddata.com/',

  // News sources
  GNEWS: 'https://gnews.io/',

  // Data providers  
  FRANKFURTER: 'https://www.frankfurter.app/',
  ALPHA_VANTAGE: 'https://www.alphavantage.co/',
};

