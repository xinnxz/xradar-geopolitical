// ========================================
// usePageMeta — Dynamic SEO per route
// Updates document title, meta description,
// and OG tags on each page navigation
// ========================================

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE = 'GlobalWar.live';
const BASE_URL = 'https://globalwar.live';
const OG_IMAGE = `${BASE_URL}/og-image.png`;

/**
 * SEO metadata per route
 * "Global War" keyword FIRST in title and description
 * Google weighs the beginning of title/description most heavily
 */
const PAGE_META = {
  '/': {
    title: `Global War Live — Real-time Geopolitical Risk & Market Dashboard`,
    description: 'Global War monitoring dashboard. Track armed conflicts, geopolitical risk, crypto, stocks, forex, commodities in real-time. Free live intelligence platform.',
    keywords: 'global war, global war live, war tracker, geopolitical risk, live dashboard, conflict map, market intelligence, global conflicts, war monitoring',
  },
  '/markets': {
    title: `Global War Markets — Live Crypto, Stocks, Forex & Commodities`,
    description: 'Global War impact on markets. Track 50+ instruments: Bitcoin, S&P 500, gold, oil, 29 forex pairs — all affected by global conflicts and geopolitical events.',
    keywords: 'global war markets, war impact stocks, conflict commodities, crypto war, forex geopolitics, gold price war',
  },
  '/news': {
    title: `Global War News — Live Geopolitical Conflict Updates`,
    description: 'Global War news feed. Breaking coverage of armed conflicts, sanctions, military operations, and their impact on global markets. Updated in real-time.',
    keywords: 'global war news, war updates, conflict news, geopolitical news, military news, war breaking news',
  },
  '/map': {
    title: `Global War Map — Live Armed Conflicts Worldwide`,
    description: 'Global War interactive conflict map. Visualize active armed conflicts, battles, riots, and violence events worldwide with ACLED data.',
    keywords: 'global war map, conflict map, war map, armed conflicts map, battle map, violence tracker, ACLED',
  },
  '/risk': {
    title: `Global War Risk Index — Live Geopolitical Risk Score`,
    description: 'Global War risk assessment. Live geopolitical risk score calculated from conflict events, commodity prices, and news sentiment analysis.',
    keywords: 'global war risk, geopolitical risk index, war risk score, conflict risk, global risk assessment',
  },
  '/about': {
    title: `About Global War Live — Free Geopolitical Intelligence Platform`,
    description: 'Global War Live: free real-time geopolitical intelligence and market monitoring. Track conflicts, their economic impact, and financial markets.',
    keywords: 'about global war, globalwar live, geopolitical intelligence, free war dashboard, conflict tracker',
  },
};

const DEFAULT_META = PAGE_META['/'];

/**
 * Hook: updates <title>, <meta> description/keywords, and OG tags
 * Runs on every route change
 */
export function usePageMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = PAGE_META[pathname] || DEFAULT_META;
    const url = `${BASE_URL}${pathname === '/' ? '' : pathname}`;

    // Title
    document.title = meta.title;

    // Standard meta
    setMeta('description', meta.description);
    setMeta('keywords', meta.keywords);

    // Open Graph
    setMeta('og:title', meta.title, 'property');
    setMeta('og:description', meta.description, 'property');
    setMeta('og:url', url, 'property');
    setMeta('og:image', OG_IMAGE, 'property');

    // Twitter
    setMeta('twitter:title', meta.title, 'property');
    setMeta('twitter:description', meta.description, 'property');
    setMeta('twitter:url', url, 'property');

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', url);
    }
  }, [pathname]);
}

/**
 * Helper: create or update a <meta> tag
 */
function setMeta(name, content, attr = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}
