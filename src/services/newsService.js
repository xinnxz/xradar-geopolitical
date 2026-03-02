// ========================================
// News Data Service
// Priority: Vercel proxy → client GNews → mock fallback
// ========================================
// The Vercel proxy (/api/news) fetches up to 50 articles
// from ALL categories in parallel, deduplicates, and caches.
// If proxy unavailable, falls back to client-side GNews API.
// If no API key at all, uses mock data.
// ========================================

import { API_URLS, API_KEYS } from '../utils/constants';
import { getCache, setCache } from './cacheService';

/**
 * Fetch news — tries Vercel proxy first (50 articles),
 * then falls back to client-side GNews, then mock data
 */
export async function fetchNews(category = 'all') {
  const cacheKey = `news_${category}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  // 1. Try Vercel proxy first (best: 50 articles, server-side cached)
  const proxyResult = await fetchFromProxy(category);
  if (proxyResult && proxyResult.length > 0) {
    setCache(cacheKey, proxyResult, 10 * 60 * 1000);
    return proxyResult;
  }

  // 2. Fallback: client-side GNews API
  if (API_KEYS.GNEWS) {
    const clientResult = await fetchFromGNewsClient(category);
    if (clientResult && clientResult.length > 0) {
      setCache(cacheKey, clientResult, 10 * 60 * 1000);
      return clientResult;
    }
  }

  // 3. Last resort: mock data
  console.info('Using mock news data. Set VITE_GNEWS_KEY for live news.');
  return getMockNews(category);
}

/**
 * Fetch a specific page of news from the proxy
 * Used for infinite scroll — each page fetches NEW articles from GNews
 */
export async function fetchNewsPage(category = 'all', page = 1) {
  // Only on Vercel
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return { articles: [], hasMore: false };
  }

  try {
    const res = await fetch(`/api/news?category=${category}&page=${page}`);
    if (!res.ok) return { articles: [], hasMore: false };
    const data = await res.json();
    if (data.error || data.mock) return { articles: [], hasMore: false };
    return {
      articles: data.articles || [],
      hasMore: data.hasMore || false,
    };
  } catch (e) {
    console.info('News page fetch failed');
    return { articles: [], hasMore: false };
  }
}

/**
 * Fetch from Vercel serverless proxy (/api/news)
 * Returns up to 50 articles when category='all'
 */
async function fetchFromProxy(category) {
  // Only on Vercel deployment
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return null;
  }

  try {
    const res = await fetch(`/api/news?category=${category}&page=1`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.error || data.mock) return null;
    return data.articles || [];
  } catch (e) {
    console.info('News proxy unavailable');
    return null;
  }
}


/**
 * Fetch directly from GNews API (client-side, max 10 per request)
 */
async function fetchFromGNewsClient(category) {
  try {
    const queries = {
      all: 'geopolitical OR conflict OR sanctions OR war',
      war: 'war OR military OR conflict OR troops',
      economy: 'economy OR market OR trade OR GDP',
      sanctions: 'sanctions OR embargo OR trade ban',
      energy: 'oil price OR energy crisis OR OPEC OR gas',
      diplomacy: 'diplomacy OR peace talks OR negotiations OR summit',
    };

    const q = encodeURIComponent(queries[category] || queries.all);
    const url = `${API_URLS.GNEWS}/search?q=${q}&lang=en&max=10&sortby=publishedAt&apikey=${API_KEYS.GNEWS}`;

    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 403) console.error('GNews API: Invalid key or quota exceeded');
      return null;
    }

    const data = await res.json();
    return (data.articles || []).map((article, i) => ({
      id: `gnews-${category}-${i}`,
      title: article.title,
      description: article.description || article.content?.substring(0, 200) || '',
      source: article.source?.name || 'Unknown',
      category: category === 'all' ? detectCategory(article.title) : category,
      sentiment: detectSentiment(article.title + ' ' + (article.description || '')),
      publishedAt: article.publishedAt,
      imageUrl: article.image,
      url: article.url,
    }));
  } catch (error) {
    console.error('Client GNews fetch error:', error);
    return null;
  }
}

/**
 * Deteksi kategori berdasarkan judul
 */
function detectCategory(title) {
  const lower = title.toLowerCase();
  if (/war|military|attack|troops|missile|bomb|battle|strike|killed/.test(lower)) return 'war';
  if (/sanction|embargo|ban|restrict/.test(lower)) return 'sanctions';
  if (/oil|gas|energy|opec|fuel|pipeline|crude/.test(lower)) return 'energy';
  if (/economy|market|gdp|trade|stock|inflation|currency/.test(lower)) return 'economy';
  if (/peace|diplomacy|negotiat|talk|summit|treaty/.test(lower)) return 'diplomacy';
  return 'war';
}

/**
 * Deteksi sentiment berdasarkan kata kunci
 */
function detectSentiment(text) {
  const lower = text.toLowerCase();
  const negativeWords = ['attack', 'war', 'killed', 'dead', 'bomb', 'crisis', 'threat',
    'collapse', 'sanctions', 'destroyed', 'casualties', 'escalat', 'tension', 'struck',
    'missile', 'invasion', 'flee', 'displaced', 'suffer'];
  const positiveWords = ['peace', 'ceasefire', 'agreement', 'recover', 'growth', 'deal',
    'cooperation', 'aid', 'relief', 'rebuild', 'progress', 'optimism', 'success'];

  let negScore = negativeWords.filter(w => lower.includes(w)).length;
  let posScore = positiveWords.filter(w => lower.includes(w)).length;

  if (negScore > posScore) return 'negative';
  if (posScore > negScore) return 'positive';
  return 'neutral';
}

/**
/**
 * No mock data — return empty array
 * News will only show real articles from GNews API
 */
export function getMockNews(category = 'all') {
  return [];
}

