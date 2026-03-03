import L from 'leaflet';

// ============================================================================
// PROFESSIONAL MAP ICONS — Custom SVG Leaflet markers
// Setiap entity type punya icon unik yang mudah diidentifikasi
// ============================================================================

/**
 * Creates a Leaflet divIcon with an SVG icon inside a styled container
 * @param {string} svg - SVG content string
 * @param {string} color - Background/border color
 * @param {number} size - Icon size in pixels
 * @param {string} className - Additional CSS class
 */
function createIcon(svg, color, size = 28, className = '') {
  return L.divIcon({
    className: `xr-marker ${className}`,
    html: `<div class="xr-marker__inner" style="--marker-color:${color}; --marker-size:${size}px">${svg}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

// ═══════════════════════════════════════════════════════════════════
// SVG ICONS — Inline SVG untuk setiap tipe entity
// ═══════════════════════════════════════════════════════════════════

const SVG = {
  // ── Military Bases ──
  base_air: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>`,
  base_navy: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.65 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.9-6.68c.11-.37.05-.76-.17-1.08L20 9h-3V6c0-1.1-.9-2-2-2H9C7.9 4 7 4.9 7 6v3H4l-1.78 2.24c-.22.32-.28.71-.17 1.08L3.95 19zM9 6h6v3H9V6z"/></svg>`,
  base_army: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>`,
  base_combined: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/></svg>`,

  // ── Nuclear ──
  nuclear: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.22.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`,

  // ── Infrastructure ──
  chokepoint: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4z"/></svg>`,

  // ── Events/Attacks ──
  explosion: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 15h2v2h-2v-2zm0-8h2v6h-2V7zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/></svg>`,
  battle: `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>`,

  // ── Intel ──
  intel_hotspot: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,

  // ── Spaceport ──
  spaceport: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9.19 6.35c-2.04 2.29-3.44 5.58-3.57 5.89L2 10.69l4.05-4.05c.47-.47 1.15-.68 1.81-.55l1.33.26zM11.17 17c0 .67-.32 1.25-.82 1.62l-1.72 3.38-1.25-5.25-2.93-2.93L9.7 12.1c.37-.5.95-.82 1.62-.82L11 12c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1v.72c0 .67-.32 1.25-.82 1.62zM17.65 14.81c2.29-2.04 5.58-3.44 5.89-3.57L22 14.05c-.47.47-1.15.68-1.81.55l-1.33-.26-.06.06c-1.38 1.27-3.14 2.2-5.04 2.73l.55-1.18 3.34-1.14zM17.65 6.35C17.26 5.96 17 5.55 17 5c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2c-.55 0-1.08-.22-1.46-.59l.11-.06z"/></svg>`,

  // ── Datacenter ──
  datacenter: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z"/></svg>`,

  // ── Volcano ──
  volcano: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 12l-4.5 9h15L15 12h-2l1.5 3H12l-1-2h-1l-1 2H7.5L9 12z M13 2l-1 4h-2L9 2h4z M10 7l1 3h2l1-3h-4z"/></svg>`,

  // ── Flight route arrow ──
  flight_arrow: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>`,
};

// ═══════════════════════════════════════════════════════════════════
// EXPORTED ICON FACTORIES
// ═══════════════════════════════════════════════════════════════════

const OPERATOR_COLORS = {
  usa: '#3b82f6', uk: '#06b6d4', nato: '#6366f1', france: '#3b82f6',
  germany: '#3b82f6', russia: '#ef4444', china: '#f59e0b', iran: '#f97316',
  india: '#10b981', singapore: '#06b6d4', 'saudi arabia': '#f59e0b',
  'north korea': '#ef4444', 'south korea': '#3b82f6', japan: '#3b82f6',
};

export function getBaseIcon(base) {
  const svgKey = `base_${base.type}` in SVG ? `base_${base.type}` : 'base_combined';
  const color = OPERATOR_COLORS[base.operator?.toLowerCase()] || '#6b7280';
  return createIcon(SVG[svgKey], color, 26, `xr-base xr-base--${base.type}`);
}

export function getNuclearIcon(site) {
  const color = (site.type === 'weapons' || site.type === 'enrichment') ? '#ef4444' : '#f59e0b';
  return createIcon(SVG.nuclear, color, 28, 'xr-nuclear');
}

export function getChokepointIcon(cp) {
  const colors = { critical: '#ef4444', high: '#f97316', moderate: '#06b6d4', low: '#10b981' };
  return createIcon(SVG.chokepoint, colors[cp.risk] || '#06b6d4', 30, 'xr-chokepoint');
}

export function getSpaceportIcon() {
  return createIcon(SVG.spaceport, '#8b5cf6', 28, 'xr-spaceport');
}

export function getDatacenterIcon() {
  return createIcon(SVG.datacenter, '#10b981', 24, 'xr-datacenter');
}

export function getIntelHotspotIcon(hs) {
  const colors = { critical: '#ef4444', high: '#f97316', elevated: '#f59e0b' };
  return createIcon(SVG.intel_hotspot, colors[hs.severity] || '#f59e0b', 30, `xr-intel xr-intel--${hs.severity}`);
}

export function getVolcanoIcon() {
  return createIcon(SVG.volcano, '#ef4444', 26, 'xr-volcano');
}

export function getEventIcon(type) {
  const svgKey = type === 'battle' || type === 'violence' ? 'battle' : 'explosion';
  const colors = {
    battle: '#ef4444', explosion: '#f97316', violence: '#ef4444',
    protest: '#f59e0b', riot: '#f59e0b', strategic: '#3b82f6',
  };
  return createIcon(SVG[svgKey], colors[type] || '#3b82f6', 20, 'xr-event');
}

// ── War-specific icons ──

const WAR_SVG = {
  missile: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 2.18L16.91 2.96L19.65 6L18.16 7.54L15.42 4.5L14.11 4.78L16.2 10.41L14.66 12L3 16L8 21L12 9.34L13.59 7.8L19.22 9.89L19.5 8.58L16.46 5.84L18 4.35L21.04 7.09L21.82 3.16L20.84 2.18Z"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>`,
  drone: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 9l-2-1V6c0-1.1-.9-2-2-2h-4l-1-2h-2L10 4H6c-1.1 0-2 .9-2 2v2L2 9v2l2-1v4c0 1.1.9 2 2 2h4l1 2h2l1-2h4c1.1 0 2-.9 2-2v-4l2 1V9z"/></svg>`,
  target: `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="3"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/><path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/></svg>`,
  refugee: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c1.38 0 2.49-1.12 2.49-2.5S17.88 7 16.5 7C15.12 7 14 8.12 14 9.5s1.12 2.5 2.5 2.5zM9 11c1.66 0 2.99-1.34 2.99-3S10.66 5 9 5C7.34 5 6 6.34 6 8s1.34 3 3 3zm7.5 3c-1.83 0-5.5.92-5.5 2.75V19h11v-2.25c0-1.83-3.67-2.75-5.5-2.75zM9 13c-2.33 0-7 1.17-7 3.5V19h7v-2.25c0-.85.33-2.34 2.37-3.47C10.5 13.1 9.66 13 9 13z"/></svg>`,
  cyber: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 8H4V6h16v2zm-2-6H6v2h12V2zm4 10v8c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-8c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2zm-6 4c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2z"/></svg>`,
  weapon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h10v2h2V3c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v4h2V5zm8.41 11.59L20 12l-4.59-4.59L14 8.83 17.17 12 14 15.17l1.41 1.42zM10 15.17L6.83 12 10 8.83 8.59 7.41 4 12l4.59 4.59L10 15.17zM17 19H7v-2H5v4c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-4h-2v2z"/></svg>`,
};

export function getStrikeIcon(strike) {
  const color = strike.color || '#ef4444';
  return createIcon(WAR_SVG.target, color, 32, 'xr-strike');
}

export function getAirDefenseIcon(ad) {
  return createIcon(WAR_SVG.shield, ad.color || '#3b82f6', 24, 'xr-airdef');
}

export function getDroneZoneIcon() {
  return createIcon(WAR_SVG.drone, '#8b5cf6', 26, 'xr-drone');
}

export function getWeaponIcon(wp) {
  const colors = { hypersonic: '#ef4444', ICBM: '#dc2626', SLBM: '#8b5cf6', cruise: '#3b82f6', ballistic: '#f97316', anti_ship_ballistic: '#f59e0b' };
  return createIcon(WAR_SVG.weapon, colors[wp.type] || '#ef4444', 24, 'xr-weapon');
}

export function getCyberIcon() {
  return createIcon(WAR_SVG.cyber, '#a855f7', 22, 'xr-cyber');
}
