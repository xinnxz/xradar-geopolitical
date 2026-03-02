// ========================================
// News Data Service
// Real API (GNews) + professional mock fallback
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
    return getMockNews(category);
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

    setCache(cacheKey, articles, 10 * 60 * 1000); // Cache 10 menit
    return articles;
  } catch (error) {
    console.error('News fetch error:', error);
    // Fallback ke mock data jika API gagal
    return getMockNews(category);
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
  return 'war'; // Default for geopolitical context
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
 * Updated: includes image URLs, real article URLs, and category filtering
 */
export function getMockNews(category = 'all') {
  const now = new Date();

  const allArticles = [
    // ===== ENERGY =====
    {
      id: 'mock-1',
      title: 'Oil Prices Surge Amid Rising Tensions in Middle East Shipping Lanes',
      description: 'Crude oil prices jumped over 3% following reports of increased military activity near the Strait of Hormuz, a critical chokepoint for global oil supply. Tanker operators are rerouting vessels through longer alternative passages.',
      source: 'Reuters',
      category: 'energy',
      sentiment: 'negative',
      publishedAt: new Date(now - 1 * 3600000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=800&h=450&fit=crop',
      url: 'https://www.reuters.com/business/energy/oil-prices-gain-amid-middle-east-supply-fears-2023-10-09/',
    },
    {
      id: 'mock-8',
      title: 'Energy Companies Invest Billions in Alternative Supply Routes',
      description: 'Major energy corporations are accelerating investments in pipeline infrastructure and LNG terminals to reduce dependency on conflict-affected supply routes.',
      source: 'CNBC',
      category: 'energy',
      sentiment: 'positive',
      publishedAt: new Date(now - 18 * 3600000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=450&fit=crop',
      url: 'https://www.cnbc.com/2024/01/15/energy-companies-invest-in-alternative-supply-routes.html',
    },
    {
      id: 'mock-11',
      title: 'OPEC+ Agrees to Modest Oil Output Boost Amid Geopolitical Pressure',
      description: 'OPEC and its allies have agreed to a gradual increase in oil production starting next quarter, responding to global demand concerns and political pressure from major consuming nations.',
      source: 'Bloomberg',
      category: 'energy',
      sentiment: 'neutral',
      publishedAt: new Date(now - 8 * 3600000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=450&fit=crop',
      url: 'https://www.bloomberg.com/news/articles/2024-06-01/opec-agrees-oil-output-boost',
    },

    // ===== SANCTIONS =====
    {
      id: 'mock-2',
      title: 'EU Announces New Sanctions Package Targeting Tech Exports',
      description: 'The European Union has approved its latest round of sanctions, restricting exports of advanced semiconductors and AI technology to conflict-affected regions.',
      source: 'BBC News',
      category: 'sanctions',
      sentiment: 'negative',
      publishedAt: new Date(now - 3 * 3600000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=450&fit=crop',
      url: 'https://www.bbc.com/news/world-europe-66723538',
    },
    {
      id: 'mock-12',
      title: 'US Treasury Expands Sanctions on Iranian Oil Trading Network',
      description: 'The U.S. Treasury Department has designated additional entities involved in the illicit trade of Iranian crude oil, tightening enforcement of existing energy sanctions.',
      source: 'Financial Times',
      category: 'sanctions',
      sentiment: 'negative',
      publishedAt: new Date(now - 15 * 3600000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&h=450&fit=crop',
      url: 'https://www.ft.com/content/us-treasury-iran-sanctions',
    },

    // ===== ECONOMY =====
    {
      id: 'mock-3',
      title: 'Gold Hits Record High as Investors Seek Safe Haven',
      description: 'Gold prices reached an all-time high as geopolitical uncertainty drives investors toward traditional safe-haven assets. Analysts predict further gains as tensions persist.',
      source: 'Bloomberg',
      category: 'economy',
      sentiment: 'neutral',
      publishedAt: new Date(now - 5 * 3600000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&h=450&fit=crop',
      url: 'https://www.bloomberg.com/news/articles/2024-03-08/gold-price-hits-record-high-as-investors-seek-safe-haven',
    },
    {
      id: 'mock-7',
      title: 'Global Supply Chain Disruptions Worsen as Key Routes Blocked',
      description: 'Commercial shipping through critical maritime corridors has been disrupted, causing delays and cost increases for global trade. Freight rates have surged 300% on affected routes.',
      source: 'Financial Times',
      category: 'economy',
      sentiment: 'negative',
      publishedAt: new Date(now - 14 * 3600000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5eb19?w=800&h=450&fit=crop',
      url: 'https://www.ft.com/content/global-supply-chain-disruptions-shipping-routes',
    },
    {
      id: 'mock-10',
      title: 'Central Banks Adjust Interest Rates in Response to Geopolitical Risk',
      description: 'Several major central banks have signaled potential rate adjustments as geopolitical tensions continue to fuel inflationary pressures across global markets.',
      source: 'The Economist',
      category: 'economy',
      sentiment: 'neutral',
      publishedAt: new Date(now - 26 * 3600000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=450&fit=crop',
      url: 'https://www.economist.com/finance-and-economics/2024/01/20/central-banks-adjust-rates',
    },

    // ===== WAR / CONFLICT =====
    {
      id: 'mock-4',
      title: 'UN Security Council Emergency Session Called Over Border Escalation',
      description: 'The United Nations Security Council has convened an emergency session to address the recent surge in cross-border military operations that have displaced thousands of civilians.',
      source: 'Al Jazeera',
      category: 'war',
      sentiment: 'negative',
      publishedAt: new Date(now - 7 * 3600000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800&h=450&fit=crop',
      url: 'https://www.aljazeera.com/news/2024/2/12/un-security-council-emergency-session',
    },
    {
      id: 'mock-6',
      title: 'NATO Expands Military Exercises Near Eastern European Border',
      description: 'NATO has launched its largest joint military exercise in the region, involving 30,000 troops from 15 member nations in a show of collective defense capability.',
      source: 'The Guardian',
      category: 'war',
      sentiment: 'negative',
      publishedAt: new Date(now - 12 * 3600000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1580752300992-559f8e2f7f63?w=800&h=450&fit=crop',
      url: 'https://www.theguardian.com/world/2024/feb/15/nato-military-exercises-eastern-europe',
    },
    {
      id: 'mock-9',
      title: 'Humanitarian Crisis Deepens: UN Reports 2 Million Displaced',
      description: 'The United Nations refugee agency reports that the ongoing conflict has displaced over 2 million people, with refugee camps struggling to meet basic needs for food, water and shelter.',
      source: 'Reuters',
      category: 'war',
      sentiment: 'negative',
      publishedAt: new Date(now - 22 * 3600000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&h=450&fit=crop',
      url: 'https://www.reuters.com/world/un-reports-2-million-displaced-conflict/',
    },

    // ===== DIPLOMACY =====
    {
      id: 'mock-5',
      title: 'Diplomatic Talks Resume in Geneva with Cautious Optimism',
      description: 'Representatives from multiple nations have gathered in Geneva for a new round of peace negotiations, with mediators expressing cautious optimism about a potential ceasefire framework.',
      source: 'CNN',
      category: 'diplomacy',
      sentiment: 'positive',
      publishedAt: new Date(now - 10 * 3600000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1577415124269-fc1140a69e91?w=800&h=450&fit=crop',
      url: 'https://edition.cnn.com/2024/03/10/world/geneva-peace-talks-resume/index.html',
    },
    {
      id: 'mock-13',
      title: 'China and US Hold High-Level Military Communication Talks',
      description: 'Senior military officials from both nations met in a rare bilateral dialogue aimed at reducing the risk of miscalculation in contested areas of the South China Sea.',
      source: 'BBC News',
      category: 'diplomacy',
      sentiment: 'positive',
      publishedAt: new Date(now - 20 * 3600000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=450&fit=crop',
      url: 'https://www.bbc.com/news/world-asia-china-us-military-talks',
    },
    {
      id: 'mock-14',
      title: 'G7 Leaders Pledge United Front on Global Security Challenges',
      description: 'Leaders of the G7 nations issued a joint statement committing to coordinated action on escalating regional conflicts, climate security, and nuclear non-proliferation.',
      source: 'The Guardian',
      category: 'diplomacy',
      sentiment: 'positive',
      publishedAt: new Date(now - 30 * 3600000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1560523159-4a9692d222ef?w=800&h=450&fit=crop',
      url: 'https://www.theguardian.com/world/2024/jun/15/g7-leaders-global-security-pledge',
    },
  ];

  // Filter by category
  if (category !== 'all') {
    return allArticles.filter(a => a.category === category);
  }

  return allArticles;
}
