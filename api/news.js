// ========================================
// Vercel Serverless Function: News Proxy
// Route: /api/news
// Features:
// - Multi-key rotation (GNEWS_KEY, GNEWS_KEY_2, GNEWS_KEY_3...)
// - Auto-switch on 403/429 (quota exceeded)
// - Sequential calls with delays (anti rate-limit)
// - Pagination support (page param)
// - Never caches empty results
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

// ========================================
// API KEY ROTATION
// Supports: GNEWS_KEY, GNEWS_KEY_2, GNEWS_KEY_3, ...
// When a key gets 403/429, it's marked exhausted for 1 hour
// ========================================
const exhaustedKeys = new Map(); // key -> exhausted timestamp
const EXHAUSTED_COOLDOWN = 60 * 60 * 1000; // 1 hour

/**
 * Collect all available GNews API keys from env vars
 * Looks for: GNEWS_KEY, VITE_GNEWS_KEY, GNEWS_KEY_2, GNEWS_KEY_3, etc.
 */
function getAllApiKeys() {
  const keys = [];

  // Primary keys
  if (process.env.GNEWS_KEY) keys.push(process.env.GNEWS_KEY);
  else if (process.env.VITE_GNEWS_KEY) keys.push(process.env.VITE_GNEWS_KEY);

  // Additional keys: GNEWS_KEY_2, GNEWS_KEY_3, ..., GNEWS_KEY_30
  for (let i = 2; i <= 30; i++) {
    const key = process.env[`GNEWS_KEY_${i}`];
    if (key) keys.push(key);
  }

  return keys;
}

/**
 * Get the next available (non-exhausted) API key
 * Returns { key, index } or null if all exhausted
 */
function getAvailableKey() {
  const allKeys = getAllApiKeys();
  const now = Date.now();

  for (let i = 0; i < allKeys.length; i++) {
    const key = allKeys[i];
    const exhaustedAt = exhaustedKeys.get(key);

    // If key was exhausted but cooldown passed, remove it
    if (exhaustedAt && now - exhaustedAt > EXHAUSTED_COOLDOWN) {
      exhaustedKeys.delete(key);
    }

    // If key is not exhausted, use it
    if (!exhaustedKeys.has(key)) {
      return { key, index: i + 1, total: allKeys.length };
    }
  }

  return null; // All keys exhausted
}

/**
 * Mark a key as exhausted (403/429 received)
 */
function markKeyExhausted(key) {
  exhaustedKeys.set(key, Date.now());
  console.log(`🔑 Key ...${key.slice(-4)} exhausted, switching to next`);
}

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

/**
 * Fetch articles from GNews with key rotation
 * If 403/429 → marks key exhausted and retries with next key
 */
async function fetchGNewsArticles(query, max = 10, page = 1) {
  const maxRetries = getAllApiKeys().length;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const keyInfo = getAvailableKey();
    if (!keyInfo) {
      throw new Error('All API keys exhausted. Try again in ~1 hour.');
    }

    const q = encodeURIComponent(query);
    const url = `https://gnews.io/api/v4/search?q=${q}&lang=en&max=${max}&page=${page}&sortby=publishedAt&apikey=${keyInfo.key}`;

    try {
      const res = await fetch(url);

      if (res.status === 403 || res.status === 429) {
        // Quota exceeded → mark this key and try next
        markKeyExhausted(keyInfo.key);
        continue; // Try next key
      }

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        console.error(`GNews error ${res.status}: ${text.substring(0, 200)}`);
        throw new Error(`GNews API ${res.status}`);
      }

      const data = await res.json();
      if (data.errors) {
        // API key error → mark and try next
        markKeyExhausted(keyInfo.key);
        continue;
      }

      console.log(`✓ Using key #${keyInfo.index}/${keyInfo.total} (...${keyInfo.key.slice(-4)})`);
      return data.articles || [];
    } catch (e) {
      if (e.message.includes('403') || e.message.includes('429')) {
        markKeyExhausted(keyInfo.key);
        continue;
      }
      throw e;
    }
  }

  throw new Error('All API keys exhausted after rotation');
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

  // Check if ANY key is available
  const allKeys = getAllApiKeys();
  if (allKeys.length === 0) {
    return res.status(500).json({
      error: 'No GNEWS_KEY configured',
      hint: 'Add GNEWS_KEY to Vercel env vars. For rotation, also add GNEWS_KEY_2, GNEWS_KEY_3, etc.',
      mock: true,
    });
  }

  try {
    const { category = 'all', page = '1' } = req.query;
    const pageNum = parseInt(page) || 1;
    const cacheKey = `news_${category}_p${pageNum}_v3`;

    // Check cache first
    const cached = getCached(cacheKey);
    if (cached && cached.length > 0) {
      return res.status(200).json({
        articles: cached,
        total: cached.length,
        page: pageNum,
        cached: true,
        source: 'gnews',
        keysAvailable: allKeys.length,
        keysExhausted: exhaustedKeys.size,
      });
    }

    let articles = [];

    if (category === 'all') {
      const categories = ['war', 'economy', 'energy', 'sanctions', 'diplomacy'];

      for (let i = 0; i < categories.length; i++) {
        const cat = categories[i];
        try {
          const raw = await fetchGNewsArticles(CATEGORY_QUERIES[cat], 10, pageNum);
          const transformed = raw.map((a, idx) => transformArticle(a, cat, idx + (pageNum - 1) * 10));
          articles.push(...transformed);
          console.log(`✓ ${cat}: ${raw.length} articles`);
        } catch (e) {
          console.error(`✗ ${cat}: ${e.message}`);
        }

        if (i < categories.length - 1) await delay(1200);
      }

      articles = deduplicateArticles(articles);
      articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    } else {
      const query = CATEGORY_QUERIES[category] || CATEGORY_QUERIES.all;
      const raw = await fetchGNewsArticles(query, 10, pageNum);
      articles = raw.map((a, i) => transformArticle(a, category, i + (pageNum - 1) * 10));
    }

    // Only cache non-empty results
    if (articles.length > 0) {
      setMemoCache(cacheKey, articles);
    }

    return res.status(200).json({
      articles,
      total: articles.length,
      page: pageNum,
      hasMore: articles.length > 0,
      cached: false,
      source: 'gnews',
      keysAvailable: allKeys.length,
      keysExhausted: exhaustedKeys.size,
    });
  } catch (error) {
    console.error('News proxy error:', error);
    return res.status(500).json({ error: error.message });
  }
}
