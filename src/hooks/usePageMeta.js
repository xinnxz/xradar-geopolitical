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
 * Google shows ~60 chars for title and ~155 chars for description
 */
const PAGE_META = {
  '/': {
    title: `${SITE} — Real-time Geopolitical & Market Intelligence`,
    description: 'Live dashboard tracking global conflicts, crypto, stocks, forex, commodities, and geopolitical risk assessment in real-time.',
    keywords: 'geopolitical risk, live dashboard, market intelligence, war tracker',
  },
  '/markets': {
    title: `Markets — Crypto, Stocks, Forex, Commodities | ${SITE}`,
    description: 'Track 50+ instruments: Bitcoin, Ethereum, S&P 500, gold, oil, 29 forex pairs — all in one TradingView-style dashboard.',
    keywords: 'crypto prices, stock market, forex rates, gold price, oil price, trading dashboard',
  },
  '/news': {
    title: `Geopolitical News — Live Feed | ${SITE}`,
    description: 'Breaking geopolitical news affecting global markets. War, sanctions, diplomacy — updated in real-time with infinite scroll.',
    keywords: 'geopolitical news, war news, global conflict news, market news',
  },
  '/map': {
    title: `Conflict Map — Live Armed Conflicts | ${SITE}`,
    description: 'Interactive map of active armed conflicts worldwide. Data from ACLED covering battles, riots, protests, and violence.',
    keywords: 'conflict map, war map, armed conflicts, ACLED data, violence tracker',
  },
  '/risk': {
    title: `Risk Index — Geopolitical Risk Score | ${SITE}`,
    description: 'Live geopolitical risk score calculated from conflict events, commodity prices, and news sentiment analysis.',
    keywords: 'geopolitical risk index, risk score, market risk, conflict risk assessment',
  },
  '/about': {
    title: `About — Where the World Watches Risk | ${SITE}`,
    description: 'GlobalWar.live provides free, real-time geopolitical intelligence and market monitoring. No account needed, no paywall.',
    keywords: 'about globalwar, geopolitical intelligence platform, free trading dashboard',
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
