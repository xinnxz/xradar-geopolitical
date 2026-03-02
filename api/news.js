// ========================================
// Vercel Serverless Function: News Proxy
// Route: /api/news
// Fetches news from GNews API server-side
// Sequential calls with delays to avoid rate limit
// ========================================

// Server-side cache
let cache = {};
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

function getCached(key) {
  const entry = cache[key];
  if (entry && Date.now() - entry.time < CACHE_TTL) return entry.data;
  return null;
}

function setMemoCache(key, data) {
  cache[key] = { data, time: Date.now() };
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Category search queries
const CATEGORY_QUERIES = {
  all: 'geopolitical OR conflict OR sanctions OR war OR military',
  war: 'war OR military conflict OR troops OR missile OR attack',
  economy: 'economy OR market crash OR trade war OR GDP OR inflation',
  sanctions: 'sanctions OR embargo OR trade ban OR restrictions',
  energy: 'oil price OR energy crisis OR OPEC OR gas pipeline OR crude',
  diplomacy: 'diplomacy OR peace talks OR negotiations OR summit OR treaty',
};

function detectCategory(title) {
  const lower = (title || '').toLowerCase();
  if (/war|military|attack|troops|missile|bomb|battle|strike|killed|casualties/.test(lower)) return 'war';
  if (/sanction|embargo|ban|restrict/.test(lower)) return 'sanctions';
  if (/oil|gas|energy|opec|fuel|pipeline|crude|lng/.test(lower)) return 'energy';
  if (/economy|market|gdp|trade|stock|inflation|currency|bank/.test(lower)) return 'economy';
  if (/peace|diplomacy|negotiat|talk|summit|treaty|ceasefire/.test(lower)) return 'diplomacy';
  return 'war';
}

function detectSentiment(text) {
  const lower = (text || '').toLowerCase();
  const neg = ['attack', 'war', 'killed', 'dead', 'bomb', 'crisis', 'threat',
    'collapse', 'sanctions', 'destroyed', 'casualties', 'escalat', 'tension',
    'missile', 'invasion', 'flee', 'displaced', 'suffer', 'struck'].filter(w => lower.includes(w)).length;
  const pos = ['peace', 'ceasefire', 'agreement', 'recover', 'growth', 'deal',
    'cooperation', 'aid', 'relief', 'rebuild', 'progress', 'optimism', 'success'].filter(w => lower.includes(w)).length;
  if (neg > pos) return 'negative';
  if (pos > neg) return 'positive';
  return 'neutral';
}

async function fetchGNewsArticles(query, apiKey, max = 10) {
  const q = encodeURIComponent(query);
  const url = `https://gnews.io/api/v4/search?q=${q}&lang=en&max=${max}&sortby=publishedAt&apikey=${apiKey}`;
  
  const res = await fetch(url);
  
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error(`GNews error ${res.status}: ${text.substring(0, 200)}`);
    throw new Error(`GNews API ${res.status}`);
  }
  
  const data = await res.json();
  
  if (data.errors) {
    console.error('GNews errors:', JSON.stringify(data.errors));
    throw new Error(JSON.stringify(data.errors));
  }
  
  return data.articles || [];
}

function transformArticle(article, category, index) {
  return {
    id: `gnews-${category}-${index}-${Date.now()}`,
    title: article.title || '',
    description: article.description || article.content?.substring(0, 300) || '',
    source: article.source?.name || 'Unknown',
    category: category === 'all' ? detectCategory(article.title) : category,
    sentiment: detectSentiment((article.title || '') + ' ' + (article.description || '')),
    publishedAt: article.publishedAt || new Date().toISOString(),
    imageUrl: article.image || null,
    url: article.url || '#',
  };
}

function deduplicateArticles(articles) {
  const seen = new Set();
  return articles.filter(article => {
    const key = (article.title || '').substring(0, 50).toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // Check BOTH possible env var names
  const apiKey = process.env.GNEWS_KEY || process.env.VITE_GNEWS_KEY;
  if (!apiKey) {
    return res.status(500).json({ 
      error: 'GNEWS_KEY not configured',
      hint: 'Add GNEWS_KEY (or VITE_GNEWS_KEY) to Vercel Environment Variables',
      mock: true,
    });
  }

  try {
    const { category = 'all' } = req.query;
    const cacheKey = `news_${category}_v2`; // v2 to bust old empty cache

    // Check cache first (only if non-empty data was cached)
    const cached = getCached(cacheKey);
    if (cached && cached.length > 0) {
      return res.status(200).json({
        articles: cached,
        total: cached.length,
        cached: true,
        source: 'gnews',
      });
    }

    let articles = [];

    if (category === 'all') {
      // Fetch categories SEQUENTIALLY with delays to avoid rate limit
      // GNews free tier: max 1 req/sec, 100 req/day
      const categories = ['war', 'economy', 'energy', 'sanctions', 'diplomacy'];
      
      for (let i = 0; i < categories.length; i++) {
        const cat = categories[i];
        try {
          const raw = await fetchGNewsArticles(CATEGORY_QUERIES[cat], apiKey, 10);
          const transformed = raw.map((a, idx) => transformArticle(a, cat, idx));
          articles.push(...transformed);
          console.log(`✓ ${cat}: ${raw.length} articles`);
        } catch (e) {
          console.error(`✗ ${cat}: ${e.message}`);
        }
        
        // Wait 1.2s between each call to avoid rate limit
        if (i < categories.length - 1) {
          await delay(1200);
        }
      }

      articles = deduplicateArticles(articles);
      articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    } else {
      const query = CATEGORY_QUERIES[category] || CATEGORY_QUERIES.all;
      const raw = await fetchGNewsArticles(query, apiKey, 10);
      articles = raw.map((a, i) => transformArticle(a, category, i));
    }

    // ONLY cache if we got actual results — never cache empty
    if (articles.length > 0) {
      setMemoCache(cacheKey, articles);
    }

    return res.status(200).json({
      articles,
      total: articles.length,
      cached: false,
      source: 'gnews',
      keyUsed: apiKey ? 'yes' : 'no',
    });
  } catch (error) {
    console.error('News proxy error:', error);
    return res.status(500).json({ error: error.message });
  }
}
