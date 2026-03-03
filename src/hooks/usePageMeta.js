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
    title: `Global War — Live War Intelligence & Conflict Monitoring Dashboard`,
    description: 'Real-time OSINT war monitoring dashboard. 22 intelligence layers: missile strike trajectories, air defense systems, active frontlines, drone zones, refugee flows, military bases, nuclear sites — powered by public conflict data.',
    keywords: 'global war, global war live, war tracker, OSINT, conflict map, war intelligence, geopolitical risk, missile strikes, air defense, frontlines, war monitoring, live war map',
  },
  '/markets': {
    title: `Global War Markets — War Impact on Crypto, Stocks, Forex & Commodities`,
    description: 'Track how global conflicts impact financial markets in real-time. 50+ instruments: Bitcoin, S&P 500, gold, oil, 29 forex pairs — correlated with live war events and geopolitical risk.',
    keywords: 'global war markets, war impact stocks, conflict commodities, crypto war, forex geopolitics, gold price war, oil conflict',
  },
  '/news': {
    title: `Global War News — Live Conflict Intelligence & Military Updates`,
    description: 'Real-time conflict intelligence feed. Breaking coverage of armed conflicts, military operations, sanctions, airstrikes, and their global impact. AI-powered analysis.',
    keywords: 'global war news, war updates, conflict intelligence, military news, war breaking news, geopolitical news',
  },
  '/map': {
    title: `Global War Map — 22-Layer War Intelligence Visualization`,
    description: 'Interactive OSINT conflict map with 22 layers: missile strike trajectories, air defense coverage (Iron Dome, S-400, THAAD), active frontlines, drone zones, naval blockades, refugee flows, military bases worldwide.',
    keywords: 'global war map, conflict map, war map, OSINT map, missile strikes map, air defense map, frontlines map, military intelligence map',
  },
  '/risk': {
    title: `Global War Risk Index — Multi-Source Intelligence Risk Score`,
    description: 'Live geopolitical risk score calculated from ACLED conflict data, commodity disruptions, cyber threat indicators, and AI-powered news sentiment analysis. Updated every 5 minutes.',
    keywords: 'global war risk, geopolitical risk index, war risk score, conflict risk, global risk assessment, threat level',
  },
  '/about': {
    title: `About Global War — Free OSINT War Intelligence Platform`,
    description: 'Global War: free open-source war intelligence platform. 22 monitoring layers, real-time conflict data from ACLED, strike trajectory visualization, air defense coverage mapping, and market impact analysis.',
    keywords: 'about global war, globalwar live, OSINT platform, free war dashboard, conflict tracker, war intelligence',
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
