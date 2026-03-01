// ========================================
// News Data Service
// Mock news data untuk development
// ========================================

/**
 * Get mock news data
 * Nanti bisa diganti dengan NewsData.io API
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
      url: '#',
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
      url: '#',
    },
    {
      id: 3,
      title: 'Gold Hits Record High as Investors Seek Safe Haven',
      description: 'Gold prices reached an all-time high of $2,450 per ounce as geopolitical uncertainty drives investors toward traditional safe-haven assets.',
      source: 'Bloomberg',
      category: 'economy',
      sentiment: 'neutral',
      publishedAt: new Date(now - 5 * 3600000).toISOString(),
      imageUrl: null,
      url: '#',
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
      url: '#',
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
      url: '#',
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
      url: '#',
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
      url: '#',
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
      url: '#',
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
      url: '#',
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
      url: '#',
    },
  ];
}
