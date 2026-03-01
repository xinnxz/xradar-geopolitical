// ========================================
// News Data Service
// Real API (GNews) + mock fallback
// ========================================
// GNews API: gratis 100 req/day, butuh API key
// Jika key tidak ada, fallback ke mock data
// ========================================

import { API_URLS, API_KEYS } from '../utils/constants';
import { getCache, setCache } from './cacheService';

/**
 * Fetch berita geopolitik dari GNews API (REAL DATA)
 * Memerlukan VITE_GNEWS_KEY di .env
 * Fallback ke mock jika key tidak tersedia
 */
export async function fetchNews(category = 'all') {
  if (!API_KEYS.GNEWS) {
    console.info('GNews API key not set, using mock data. Set VITE_GNEWS_KEY in .env');
    return getMockNews();
  }

  const cacheKey = `news_${category}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    // Build query berdasarkan kategori
    const queries = {
      all: 'geopolitical OR conflict OR sanctions OR war',
      war: 'war OR military OR conflict OR troops',
      economy: 'economy OR market OR trade OR GDP',
      sanctions: 'sanctions OR embargo OR trade ban',
      energy: 'oil price OR energy crisis OR OPEC OR gas',
      diplomacy: 'diplomacy OR peace talks OR negotiations OR summit',
    };

    const q = encodeURIComponent(queries[category] || queries.all);
    const url = `${API_URLS.GNEWS}/search?q=${q}&lang=en&max=10&apikey=${API_KEYS.GNEWS}`;

    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 403) console.error('GNews API: Invalid key or quota exceeded');
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();

    // Transform GNews format ke format kita
    const articles = (data.articles || []).map((article, i) => ({
      id: i + 1,
      title: article.title,
      description: article.description || article.content?.substring(0, 200) || '',
      source: article.source?.name || 'Unknown',
      category: category === 'all' ? detectCategory(article.title) : category,
      sentiment: detectSentiment(article.title + ' ' + (article.description || '')),
      publishedAt: article.publishedAt,
      imageUrl: article.image,
      url: article.url,
    }));

    setCache(cacheKey, articles, 10 * 60 * 1000); // Cache 10 menit
    return articles;
  } catch (error) {
    console.error('News fetch error:', error);
    // Fallback ke mock data jika API gagal
    return getMockNews();
  }
}

/**
 * Deteksi kategori berdasarkan judul (simplified NLP)
 */
function detectCategory(title) {
  const lower = title.toLowerCase();
  if (/war|military|attack|troops|missile|bomb|battle|strike/.test(lower)) return 'war';
  if (/sanction|embargo|ban|restrict/.test(lower)) return 'sanctions';
  if (/oil|gas|energy|opec|fuel|pipeline/.test(lower)) return 'energy';
  if (/economy|market|gdp|trade|stock|inflation|currency/.test(lower)) return 'economy';
  if (/peace|diplomacy|negotiat|talk|summit|treaty/.test(lower)) return 'diplomacy';
  return 'war'; // default for geopolitical
}

/**
 * Deteksi sentiment berdasarkan kata kunci (simplified)
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
 * Mock news data (fallback jika API key tidak tersedia)
 */
export function getMockNews() {
  const now = new Date();
  return [
    {
      id: 1,
      title: 'Oil Prices Surge Amid Rising Tensions in Middle East Shipping Lanes',
      description: 'Crude oil prices jumped over 3% following reports of increased military activity near the Strait of Hormuz, a critical chokepoint for global oil supply.',
      source: 'Reuters',
      category: 'energy',
      sentiment: 'negative',
      publishedAt: new Date(now - 1 * 3600000).toISOString(),
      imageUrl: null,
      url: 'https://www.reuters.com/business/energy/',
    },
    {
      id: 2,
      title: 'EU Announces New Sanctions Package Targeting Tech Exports',
      description: 'The European Union has approved its latest round of sanctions, restricting exports of advanced semiconductors and AI technology to conflict-affected regions.',
      source: 'BBC News',
      category: 'sanctions',
      sentiment: 'negative',
      publishedAt: new Date(now - 3 * 3600000).toISOString(),
      imageUrl: null,
      url: 'https://www.bbc.com/news/world',
    },
    {
      id: 3,
      title: 'Gold Hits Record High as Investors Seek Safe Haven',
      description: 'Gold prices reached an all-time high as geopolitical uncertainty drives investors toward traditional safe-haven assets.',
      source: 'Bloomberg',
      category: 'economy',
      sentiment: 'neutral',
      publishedAt: new Date(now - 5 * 3600000).toISOString(),
      imageUrl: null,
      url: 'https://www.bloomberg.com/markets/commodities',
    },
    {
      id: 4,
      title: 'UN Security Council Emergency Session Called Over Border Escalation',
      description: 'The United Nations Security Council has convened an emergency session to address the recent surge in cross-border military operations.',
      source: 'Al Jazeera',
      category: 'war',
      sentiment: 'negative',
      publishedAt: new Date(now - 7 * 3600000).toISOString(),
      imageUrl: null,
      url: 'https://www.aljazeera.com/news',
    },
    {
      id: 5,
      title: 'Diplomatic Talks Resume in Geneva with Cautious Optimism',
      description: 'Representatives from multiple nations have gathered in Geneva for a new round of peace negotiations, with mediators expressing cautious optimism about a potential ceasefire framework.',
      source: 'CNN',
      category: 'diplomacy',
      sentiment: 'positive',
      publishedAt: new Date(now - 10 * 3600000).toISOString(),
      imageUrl: null,
      url: 'https://edition.cnn.com/world',
    },
    {
      id: 6,
      title: 'NATO Expands Military Exercises Near Eastern European Border',
      description: 'NATO has launched its largest joint military exercise in the region, involving 30,000 troops from 15 member nations in a show of collective defense.',
      source: 'The Guardian',
      category: 'war',
      sentiment: 'negative',
      publishedAt: new Date(now - 12 * 3600000).toISOString(),
      imageUrl: null,
      url: 'https://www.theguardian.com/world',
    },
    {
      id: 7,
      title: 'Global Supply Chain Disruptions Worsen as Key Routes Blocked',
      description: 'Commercial shipping through critical maritime corridors has been disrupted, causing delays and cost increases for global trade.',
      source: 'Financial Times',
      category: 'economy',
      sentiment: 'negative',
      publishedAt: new Date(now - 14 * 3600000).toISOString(),
      imageUrl: null,
      url: 'https://www.ft.com/global-economy',
    },
    {
      id: 8,
      title: 'Energy Companies Invest Billions in Alternative Supply Routes',
      description: 'Major energy corporations are accelerating investments in pipeline infrastructure and LNG terminals to reduce dependency on conflict-affected supply routes.',
      source: 'CNBC',
      category: 'energy',
      sentiment: 'positive',
      publishedAt: new Date(now - 18 * 3600000).toISOString(),
      imageUrl: null,
      url: 'https://www.cnbc.com/energy/',
    },
    {
      id: 9,
      title: 'Humanitarian Crisis Deepens: UN Reports 2 Million Displaced',
      description: 'The United Nations refugee agency reports that the ongoing conflict has displaced over 2 million people, with refugee camps struggling to meet basic needs.',
      source: 'Reuters',
      category: 'war',
      sentiment: 'negative',
      publishedAt: new Date(now - 22 * 3600000).toISOString(),
      imageUrl: null,
      url: 'https://www.reuters.com/world/',
    },
    {
      id: 10,
      title: 'Central Banks Adjust Interest Rates in Response to Geopolitical Risk',
      description: 'Several major central banks have signaled potential rate adjustments as geopolitical tensions continue to fuel inflationary pressures across global markets.',
      source: 'The Economist',
      category: 'economy',
      sentiment: 'neutral',
      publishedAt: new Date(now - 26 * 3600000).toISOString(),
      imageUrl: null,
      url: 'https://www.economist.com/finance-and-economics',
    },
  ];
}
