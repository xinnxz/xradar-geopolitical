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
 * Fetch from Vercel serverless proxy (/api/news)
 * Returns up to 50 articles when category='all'
 */
async function fetchFromProxy(category) {
  // Only on Vercel deployment
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return null;
  }

  try {
    const res = await fetch(`/api/news?category=${category}`);
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
 * Mock news data (rich fallback with images, real URLs, category filtering)
 */
export function getMockNews(category = 'all') {
  const now = new Date();

  const allArticles = [
    // ===== ENERGY (3 articles) =====
    {
      id: 'mock-e1', title: 'Oil Prices Surge Amid Rising Tensions in Middle East Shipping Lanes',
      description: 'Crude oil prices jumped over 3% following reports of increased military activity near the Strait of Hormuz, a critical chokepoint for global oil supply. Tanker operators are rerouting through longer alternative passages.',
      source: 'Reuters', category: 'energy', sentiment: 'negative',
      publishedAt: new Date(now - 1 * 3600000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=800&h=450&fit=crop',
      url: 'https://www.reuters.com/business/energy/oil-prices-gain-amid-middle-east-supply-fears-2023-10-09/',
    },
    {
      id: 'mock-e2', title: 'OPEC+ Agrees to Modest Oil Output Boost Amid Geopolitical Pressure',
      description: 'OPEC and its allies have agreed to a gradual increase in oil production starting next quarter, responding to global demand concerns and political pressure from consuming nations.',
      source: 'Bloomberg', category: 'energy', sentiment: 'neutral',
      publishedAt: new Date(now - 8 * 3600000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=450&fit=crop',
      url: 'https://www.bloomberg.com/news/articles/2024-06-01/opec-agrees-oil-output-boost',
    },
    {
      id: 'mock-e3', title: 'Energy Companies Invest Billions in Alternative Supply Routes',
      description: 'Major energy corporations accelerate investments in pipeline infrastructure and LNG terminals to reduce dependency on conflict-affected supply routes.',
      source: 'CNBC', category: 'energy', sentiment: 'positive',
      publishedAt: new Date(now - 18 * 3600000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=450&fit=crop',
      url: 'https://www.cnbc.com/2024/01/15/energy-companies-invest-in-alternative-supply-routes.html',
    },

    // ===== SANCTIONS (3 articles) =====
    {
      id: 'mock-s1', title: 'EU Announces New Sanctions Package Targeting Tech Exports',
      description: 'The European Union approved its latest round of sanctions, restricting exports of advanced semiconductors and AI technology to conflict-affected regions.',
      source: 'BBC News', category: 'sanctions', sentiment: 'negative',
      publishedAt: new Date(now - 3 * 3600000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=450&fit=crop',
      url: 'https://www.bbc.com/news/world-europe-66723538',
    },
    {
      id: 'mock-s2', title: 'US Treasury Expands Sanctions on Iranian Oil Trading Network',
      description: 'The U.S. Treasury Department designated additional entities involved in the illicit trade of Iranian crude oil, tightening enforcement of existing energy sanctions.',
      source: 'Financial Times', category: 'sanctions', sentiment: 'negative',
      publishedAt: new Date(now - 15 * 3600000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&h=450&fit=crop',
      url: 'https://www.ft.com/content/us-treasury-iran-sanctions',
    },
    {
      id: 'mock-s3', title: 'Russia Faces New Wave of Western Financial Sanctions',
      description: 'A coordinated effort by Western nations introduces sweeping restrictions on Russian banks and financial institutions, further isolating Moscow from global markets.',
      source: 'The Guardian', category: 'sanctions', sentiment: 'negative',
      publishedAt: new Date(now - 24 * 3600000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1604594849809-dfedbc827105?w=800&h=450&fit=crop',
      url: 'https://www.theguardian.com/world/2024/feb/20/russia-western-financial-sanctions',
    },

    // ===== ECONOMY (3 articles) =====
    {
      id: 'mock-ec1', title: 'Gold Hits Record High as Investors Seek Safe Haven',
      description: 'Gold prices reached an all-time high as geopolitical uncertainty drives investors toward traditional safe-haven assets. Analysts predict further gains.',
      source: 'Bloomberg', category: 'economy', sentiment: 'neutral',
      publishedAt: new Date(now - 5 * 3600000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&h=450&fit=crop',
      url: 'https://www.bloomberg.com/news/articles/2024-03-08/gold-price-hits-record-high',
    },
    {
      id: 'mock-ec2', title: 'Global Supply Chain Disruptions Worsen as Key Routes Blocked',
      description: 'Commercial shipping through critical maritime corridors disrupted, causing delays and cost increases for global trade. Freight rates surged 300% on affected routes.',
      source: 'Financial Times', category: 'economy', sentiment: 'negative',
      publishedAt: new Date(now - 14 * 3600000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5eb19?w=800&h=450&fit=crop',
      url: 'https://www.ft.com/content/global-supply-chain-disruptions-shipping-routes',
    },
    {
      id: 'mock-ec3', title: 'Central Banks Adjust Interest Rates in Response to Geopolitical Risk',
      description: 'Several major central banks signaled potential rate adjustments as geopolitical tensions continue to fuel inflationary pressures across global markets.',
      source: 'The Economist', category: 'economy', sentiment: 'neutral',
      publishedAt: new Date(now - 26 * 3600000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=450&fit=crop',
      url: 'https://www.economist.com/finance-and-economics/2024/01/20/central-banks-adjust-rates',
    },

    // ===== WAR / CONFLICT (4 articles) =====
    {
      id: 'mock-w1', title: 'UN Security Council Emergency Session Called Over Border Escalation',
      description: 'The United Nations Security Council convened an emergency session to address the recent surge in cross-border military operations displacing thousands of civilians.',
      source: 'Al Jazeera', category: 'war', sentiment: 'negative',
      publishedAt: new Date(now - 2 * 3600000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800&h=450&fit=crop',
      url: 'https://www.aljazeera.com/news/2024/2/12/un-security-council-emergency-session',
    },
    {
      id: 'mock-w2', title: 'NATO Expands Military Exercises Near Eastern European Border',
      description: 'NATO launched its largest joint military exercise in the region, involving 30,000 troops from 15 member nations in a show of collective defense capability.',
      source: 'The Guardian', category: 'war', sentiment: 'negative',
      publishedAt: new Date(now - 12 * 3600000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1580752300992-559f8e2f7f63?w=800&h=450&fit=crop',
      url: 'https://www.theguardian.com/world/2024/feb/15/nato-military-exercises-eastern-europe',
    },
    {
      id: 'mock-w3', title: 'Humanitarian Crisis Deepens: UN Reports 2 Million Displaced',
      description: 'The United Nations refugee agency reports the ongoing conflict has displaced over 2 million people, with camps struggling to meet basic needs for food, water and shelter.',
      source: 'Reuters', category: 'war', sentiment: 'negative',
      publishedAt: new Date(now - 22 * 3600000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&h=450&fit=crop',
      url: 'https://www.reuters.com/world/un-reports-2-million-displaced-conflict/',
    },
    {
      id: 'mock-w4', title: 'Missile Strikes Hit Critical Infrastructure in Northern Region',
      description: 'Multiple missile strikes targeted power plants and water treatment facilities, leaving hundreds of thousands without essential services amid freezing temperatures.',
      source: 'CNN', category: 'war', sentiment: 'negative',
      publishedAt: new Date(now - 6 * 3600000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1591202040702-c3b69af1e103?w=800&h=450&fit=crop',
      url: 'https://edition.cnn.com/2024/02/28/world/missile-strikes-infrastructure/index.html',
    },

    // ===== DIPLOMACY (3 articles) =====
    {
      id: 'mock-d1', title: 'Diplomatic Talks Resume in Geneva with Cautious Optimism',
      description: 'Representatives from multiple nations gathered in Geneva for a new round of peace negotiations, with mediators expressing cautious optimism about a ceasefire framework.',
      source: 'CNN', category: 'diplomacy', sentiment: 'positive',
      publishedAt: new Date(now - 10 * 3600000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1577415124269-fc1140a69e91?w=800&h=450&fit=crop',
      url: 'https://edition.cnn.com/2024/03/10/world/geneva-peace-talks-resume/index.html',
    },
    {
      id: 'mock-d2', title: 'China and US Hold High-Level Military Communication Talks',
      description: 'Senior military officials from both nations met in a rare bilateral dialogue aimed at reducing risk of miscalculation in contested areas of the South China Sea.',
      source: 'BBC News', category: 'diplomacy', sentiment: 'positive',
      publishedAt: new Date(now - 20 * 3600000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=450&fit=crop',
      url: 'https://www.bbc.com/news/world-asia-china-us-military-talks',
    },
    {
      id: 'mock-d3', title: 'G7 Leaders Pledge United Front on Global Security Challenges',
      description: 'Leaders of the G7 nations issued a joint statement committing to coordinated action on escalating regional conflicts, climate security, and nuclear non-proliferation.',
      source: 'The Guardian', category: 'diplomacy', sentiment: 'positive',
      publishedAt: new Date(now - 30 * 3600000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1560523159-4a9692d222ef?w=800&h=450&fit=crop',
      url: 'https://www.theguardian.com/world/2024/jun/15/g7-leaders-global-security-pledge',
    },
  ];

  if (category !== 'all') {
    return allArticles.filter(a => a.category === category);
  }
  return allArticles;
}
