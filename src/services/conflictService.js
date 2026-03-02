// ========================================
// Conflict Data Service
// Real API: ACLED (via Vercel serverless proxy)
// Fallback: Mock data when no proxy available
// ========================================

import { getCache, setCache } from './cacheService';

/**
 * Menentukan apakah app berjalan di Vercel (ada /api route)
 * atau lokal (pakai mock data)
 */
function getProxyUrl() {
  // Jika di Vercel, gunakan /api/acled
  // Jika di localhost dev, langsung fallback ke mock
  return window.location.hostname !== 'localhost' ? '/api/acled' : null;
}

/**
 * Fetch conflict events dari ACLED API (via proxy)
 */
export async function fetchConflictEvents(days = 90) {
  const cacheKey = `conflict_events_${days}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const proxyUrl = getProxyUrl();

  if (proxyUrl) {
    try {
      const res = await fetch(`${proxyUrl}?limit=200&days=${days}`);
      if (!res.ok) throw new Error(`Proxy error: ${res.status}`);
      const data = await res.json();

      if (data?.data?.length > 0) {
        const events = data.data.map((e, i) => ({
          id: e.event_id_cnty || `acled-${i}`,
          type: mapACLEDEventType(e.event_type),
          title: e.notes || `${e.event_type} in ${e.admin1 || e.country}`,
          country: e.country,
          location: e.admin1 || e.location,
          lat: parseFloat(e.latitude),
          lng: parseFloat(e.longitude),
          date: e.event_date,
          fatalities: parseInt(e.fatalities) || 0,
          source: e.source || 'ACLED',
          eventType: e.event_type,
          subEventType: e.sub_event_type,
          actor1: e.actor1,
          actor2: e.actor2,
        }));

        // Filter out events with invalid coordinates
        const validEvents = events.filter(e => !isNaN(e.lat) && !isNaN(e.lng));
        setCache(cacheKey, validEvents, 30 * 60 * 1000); // Cache 30 menit
        return validEvents;
      }
    } catch (error) {
      console.error('ACLED fetch error:', error);
    }
  }

  // Fallback ke mock data
  return getMockConflictEvents();
}

/**
 * Map ACLED event type ke simplified type
 */
function mapACLEDEventType(type) {
  const map = {
    'Battles': 'battle',
    'Explosions/Remote violence': 'explosion',
    'Violence against civilians': 'violence',
    'Protests': 'protest',
    'Riots': 'riot',
    'Strategic developments': 'strategic',
  };
  return map[type] || 'other';
}

/**
 * Build conflict zones dari event data (real atau mock)
 */
export function buildConflictZones(events) {
  if (!events?.length) return getConflictZones();

  // Group events by country/region
  const countryGroups = {};
  events.forEach(e => {
    if (!countryGroups[e.country]) {
      countryGroups[e.country] = { events: [], lats: [], lngs: [], fatalities: 0 };
    }
    countryGroups[e.country].events.push(e);
    countryGroups[e.country].lats.push(e.lat);
    countryGroups[e.country].lngs.push(e.lng);
    countryGroups[e.country].fatalities += e.fatalities;
  });

  // Build zone bounding boxes
  return Object.entries(countryGroups)
    .filter(([, g]) => g.events.length >= 3) // Minimal 3 events untuk jadi zone
    .map(([country, group], i) => {
      const minLat = Math.min(...group.lats) - 0.5;
      const maxLat = Math.max(...group.lats) + 0.5;
      const minLng = Math.min(...group.lngs) - 0.5;
      const maxLng = Math.max(...group.lngs) + 0.5;

      const severity = group.fatalities > 100 ? 'critical'
        : group.fatalities > 20 ? 'high'
        : group.events.length > 10 ? 'moderate' : 'low';

      const colors = { critical: '#ef4444', high: '#f97316', moderate: '#f59e0b', low: '#3b82f6' };

      return {
        id: `zone-${i}`,
        name: `${country} Conflict Zone`,
        country,
        bounds: [[minLat, minLng], [maxLat, maxLng]],
        color: colors[severity],
        severity,
        eventCount: group.events.length,
        fatalities: group.fatalities,
      };
    });
}

// ========================================
// NO MOCK DATA — real ACLED data only
// ========================================

export function getMockConflictEvents() {
  return [];
}

export function getConflictZones() {
  return [
    { id: 'z1', name: 'Ukraine Conflict Zone', country: 'Ukraine',
      bounds: [[46, 32], [52, 40]], color: '#ef4444', severity: 'critical', eventCount: 45, fatalities: 320 },
    { id: 'z2', name: 'Gaza Conflict Zone', country: 'Palestine',
      bounds: [[31, 34], [32, 35]], color: '#ef4444', severity: 'critical', eventCount: 38, fatalities: 280 },
    { id: 'z3', name: 'Sudan Civil War', country: 'Sudan',
      bounds: [[10, 22], [20, 36]], color: '#f97316', severity: 'high', eventCount: 25, fatalities: 150 },
    { id: 'z4', name: 'Myanmar Conflict', country: 'Myanmar',
      bounds: [[10, 92], [28, 101]], color: '#f59e0b', severity: 'moderate', eventCount: 15, fatalities: 45 },
    { id: 'z5', name: 'DR Congo Eastern Front', country: 'DR Congo',
      bounds: [[-5, 25], [5, 31]], color: '#f97316', severity: 'high', eventCount: 22, fatalities: 90 },
    { id: 'z6', name: 'Somalia Instability', country: 'Somalia',
      bounds: [[-2, 40], [12, 52]], color: '#f59e0b', severity: 'moderate', eventCount: 12, fatalities: 35 },
    { id: 'z7', name: 'Syria/Iraq Border Zone', country: 'Syria',
      bounds: [[33, 35], [37, 45]], color: '#f59e0b', severity: 'moderate', eventCount: 10, fatalities: 25 },
  ];
}

// Flight restriction zones (static)
export function getFlightRestrictions() {
  return [
    { id: 'fr1', label: 'Ukraine NOTAM', bounds: [[44, 22], [52, 40]], color: '#ef4444' },
    { id: 'fr2', label: 'Iraq Restriction', bounds: [[29, 38], [37, 49]], color: '#f97316' },
    { id: 'fr3', label: 'Iran Caution Area', bounds: [[25, 44], [40, 63]], color: '#f59e0b' },
    { id: 'fr4', label: 'Libya NTL', bounds: [[19, 9], [34, 26]], color: '#f97316' },
  ];
}
