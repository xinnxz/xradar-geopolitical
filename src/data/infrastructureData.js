// ============================================================================
// INFRASTRUCTURE & GEO DATA — Extracted from WorldMonitor Intelligence Platform
// Sumber: config/geo.ts, config/pipelines.ts, config/ports.ts
// ============================================================================

/**
 * ☢️ NUCLEAR FACILITIES — Situs nuklir penting dunia
 * Digunakan sebagai layer di peta untuk monitoring ancaman nuklir
 */
export const NUCLEAR_FACILITIES = [
  // ── Weapons / Military ──
  { id: 'nuc_pantex', name: 'Pantex Plant', lat: 35.32, lon: -101.57, type: 'weapons', country: 'USA', desc: 'US nuclear weapons assembly/disassembly' },
  { id: 'nuc_los_alamos', name: 'Los Alamos National Lab', lat: 35.88, lon: -106.30, type: 'weapons', country: 'USA', desc: 'Nuclear weapons research' },
  { id: 'nuc_sandia', name: 'Sandia National Lab', lat: 35.05, lon: -106.54, type: 'weapons', country: 'USA', desc: 'Nuclear weapons engineering' },
  { id: 'nuc_sarov', name: 'Sarov (Arzamas-16)', lat: 54.94, lon: 43.32, type: 'weapons', country: 'Russia', desc: 'Russia nuclear weapons design' },
  { id: 'nuc_mayak', name: 'Mayak Production Assoc.', lat: 55.71, lon: 60.81, type: 'weapons', country: 'Russia', desc: 'Plutonium production' },
  { id: 'nuc_dimona', name: 'Negev Nuclear Research Center', lat: 31.00, lon: 35.14, type: 'weapons', country: 'Israel', desc: 'Undeclared nuclear program' },
  { id: 'nuc_kahuta', name: 'Khan Research Laboratories', lat: 33.60, lon: 73.41, type: 'weapons', country: 'Pakistan', desc: 'Uranium enrichment' },
  { id: 'nuc_yongbyon', name: 'Yongbyon Nuclear Complex', lat: 39.80, lon: 125.75, type: 'weapons', country: 'North Korea', desc: 'Plutonium/HEU production' },
  { id: 'nuc_natanz', name: 'Natanz Enrichment Facility', lat: 33.72, lon: 51.73, type: 'enrichment', country: 'Iran', desc: 'Uranium enrichment (IAEA monitored)' },
  { id: 'nuc_fordow', name: 'Fordow Fuel Enrichment', lat: 34.88, lon: 51.58, type: 'enrichment', country: 'Iran', desc: 'Underground enrichment facility' },
  { id: 'nuc_mianyang', name: 'China Academy of Engineering Physics', lat: 31.47, lon: 104.74, type: 'weapons', country: 'China', desc: 'Nuclear weapons research' },
  { id: 'nuc_lop_nur', name: 'Lop Nur Test Site', lat: 41.55, lon: 88.73, type: 'testing', country: 'China', desc: 'Nuclear weapons test site' },

  // ── Power Plants (Geopolitically relevant) ──
  { id: 'nuc_zaporizhzhia', name: 'Zaporizhzhia NPP', lat: 47.51, lon: 34.58, type: 'power', country: 'Ukraine', desc: 'Largest in Europe, war zone' },
  { id: 'nuc_bushehr', name: 'Bushehr Nuclear Power Plant', lat: 28.83, lon: 50.89, type: 'power', country: 'Iran', desc: 'Russia-built reactor' },
  { id: 'nuc_barakah', name: 'Barakah Nuclear Power Plant', lat: 23.96, lon: 52.26, type: 'power', country: 'UAE', desc: 'Arab world\'s first NPP' },
  { id: 'nuc_kudankulam', name: 'Kudankulam Nuclear Power Plant', lat: 8.17, lon: 77.71, type: 'power', country: 'India', desc: 'India-Russia collaboration' },
  { id: 'nuc_hinkley', name: 'Hinkley Point C', lat: 51.21, lon: -3.13, type: 'power', country: 'UK', desc: 'UK new nuclear build' },
];

/**
 * 🛢️ OIL & GAS PIPELINES — Jalur pipa energi strategis
 * Format: polyline coordinates [[lat,lon], [lat,lon], ...]
 */
export const PIPELINES = [
  {
    id: 'nordstream', name: 'Nord Stream (damaged)', type: 'gas',
    status: 'sabotaged', country: 'Russia→Germany',
    color: '#ef4444',
    coords: [[59.93, 30.32], [59.50, 27.00], [58.00, 20.00], [55.50, 14.00], [54.12, 13.10]],
    desc: 'Sabotaged Oct 2022. Was main Russia→EU gas route'
  },
  {
    id: 'turkstream', name: 'TurkStream', type: 'gas',
    status: 'active', country: 'Russia→Turkey',
    color: '#f59e0b',
    coords: [[44.62, 37.78], [43.00, 34.00], [42.00, 32.00], [41.20, 28.97]],
    desc: 'Active gas pipeline via Black Sea'
  },
  {
    id: 'druzhba', name: 'Druzhba Oil Pipeline', type: 'oil',
    status: 'restricted', country: 'Russia→EU',
    color: '#6b7280',
    coords: [[55.75, 37.62], [53.90, 27.57], [52.23, 21.01], [51.76, 19.45], [50.07, 14.44], [48.15, 16.37]],
    desc: 'Longest oil pipeline in world. EU sanctions restricted'
  },
  {
    id: 'east_med', name: 'EastMed Pipeline (proposed)', type: 'gas',
    status: 'proposed', country: 'Israel→Greece→Italy',
    color: '#3b82f6',
    coords: [[32.08, 34.78], [34.50, 33.00], [35.00, 28.00], [37.00, 22.00], [39.00, 16.00], [40.84, 14.25]],
    desc: 'Proposed 1,900km subsea gas pipeline'
  },
  {
    id: 'transarabia', name: 'IPSA Pipeline', type: 'oil',
    status: 'inactive', country: 'Iraq→Saudi Arabia',
    color: '#9ca3af',
    coords: [[30.50, 47.78], [28.50, 45.00], [25.50, 42.00], [21.49, 39.18]],
    desc: 'Strategic Iraq-Saudi oil corridor (inactive)'
  },
  {
    id: 'baku_ceyhan', name: 'BTC Pipeline', type: 'oil',
    status: 'active', country: 'Azerbaijan→Turkey',
    color: '#10b981',
    coords: [[40.41, 49.87], [41.69, 44.80], [39.92, 41.28], [37.00, 36.00], [36.88, 35.15]],
    desc: 'Baku–Tbilisi–Ceyhan. Avoids Russia'
  },
  {
    id: 'tanap', name: 'TANAP', type: 'gas',
    status: 'active', country: 'Azerbaijan→Turkey→EU',
    color: '#06b6d4',
    coords: [[40.41, 49.87], [41.69, 44.80], [39.92, 41.28], [38.00, 35.00], [40.67, 26.56]],
    desc: 'Trans Anatolian Natural Gas Pipeline'
  },
];

/**
 * 🌐 UNDERSEA CABLES — Kabel bawah laut internet/telekomunikasi
 * Infrastruktur kritis yang sering jadi target sabotase
 */
export const UNDERSEA_CABLES = [
  {
    id: 'seamewe5', name: 'SEA-ME-WE 5', status: 'active',
    color: '#3b82f6',
    coords: [[1.35, 103.82], [6.00, 80.00], [12.50, 43.50], [30.00, 32.50], [35.00, 18.00], [43.30, 5.37], [48.86, 2.35]],
    desc: 'Singapore→France, 20,000km. Critical Asia-Europe link'
  },
  {
    id: 'aae1', name: 'AAE-1', status: 'active',
    color: '#06b6d4',
    coords: [[35.68, 139.69], [22.30, 114.17], [1.35, 103.82], [13.09, 80.27], [25.00, 55.00], [30.00, 32.50], [36.80, 10.17], [43.30, 5.37]],
    desc: 'Japan→France via Asia & Middle East'
  },
  {
    id: 'peace_cable', name: 'PEACE Cable', status: 'active',
    color: '#f59e0b',
    coords: [[31.23, 121.47], [22.30, 114.17], [1.35, 103.82], [24.45, 54.65], [30.00, 32.50], [36.80, 10.17], [43.30, 5.37]],
    desc: 'China-backed cable. Pakistan→Egypt→France'
  },
  {
    id: 'marea', name: 'MAREA', status: 'active',
    color: '#8b5cf6',
    coords: [[39.46, -0.38], [38.00, -20.00], [36.00, -40.00], [38.00, -60.00], [39.35, -74.42]],
    desc: 'Spain→Virginia. Microsoft/Facebook/Telxius. 6,600km'
  },
  {
    id: 'arctic_connect', name: 'Arctic Connect (planned)', status: 'planned',
    color: '#9ca3af',
    coords: [[60.17, 24.94], [68.00, 33.00], [70.00, 60.00], [72.00, 120.00], [65.00, 150.00], [43.07, 131.90]],
    desc: 'Finland→Japan via Arctic. Would be fastest Asia-EU route'
  },
];

/**
 * 🔥 CONFLICT ZONES — Area konflik aktif dunia
 * Lebih detail dari data ACLED, berisi meta intel
 */
export const CONFLICT_ZONES = [
  {
    id: 'cz_ukraine', name: 'Ukraine-Russia War',
    bounds: [[44, 22], [52, 40]], color: '#ef4444', severity: 'critical',
    startYear: 2022, parties: ['Ukraine', 'Russia'],
    desc: 'Full-scale conventional war. Active frontline Donbas-Zaporizhzhia',
  },
  {
    id: 'cz_gaza', name: 'Gaza Conflict',
    bounds: [[31.1, 34.1], [31.7, 34.7]], color: '#ef4444', severity: 'critical',
    startYear: 2023, parties: ['Israel', 'Hamas'],
    desc: 'Israel-Hamas war since Oct 7 2023',
  },
  {
    id: 'cz_sudan', name: 'Sudan Civil War',
    bounds: [[8, 22], [22, 38]], color: '#f97316', severity: 'high',
    startYear: 2023, parties: ['SAF', 'RSF'],
    desc: 'Army vs RSF paramilitary. Humanitarian crisis',
  },
  {
    id: 'cz_myanmar', name: 'Myanmar Civil War',
    bounds: [[9, 92], [28, 101]], color: '#f59e0b', severity: 'high',
    startYear: 2021, parties: ['Military Junta', 'Resistance (NUG/EAOs)'],
    desc: 'Post-coup resistance. Multiple ethnic armed organizations',
  },
  {
    id: 'cz_drc', name: 'DR Congo Eastern Front',
    bounds: [[-5, 25], [5, 31]], color: '#f97316', severity: 'high',
    startYear: 2022, parties: ['DRC Army', 'M23/Rwanda-backed'],
    desc: 'M23 resurgence. Rwanda involvement',
  },
  {
    id: 'cz_somalia', name: 'Somalia Insurgency',
    bounds: [[-2, 40], [12, 52]], color: '#f59e0b', severity: 'moderate',
    startYear: 2006, parties: ['Somali govt + AU', 'Al-Shabaab'],
    desc: 'Al-Shabaab ongoing insurgency',
  },
  {
    id: 'cz_syria', name: 'Syria Fragmentation',
    bounds: [[32, 35], [37, 42]], color: '#f59e0b', severity: 'moderate',
    startYear: 2011, parties: ['Multiple factions'],
    desc: 'Post-Assad fragmentation. Turkey/SDF/HTS',
  },
  {
    id: 'cz_yemen', name: 'Yemen Civil War',
    bounds: [[12, 42], [19, 54]], color: '#f97316', severity: 'high',
    startYear: 2014, parties: ['Houthi', 'Saudi-UAE coalition', 'Yemen govt'],
    desc: 'Houthi Red Sea attacks disrupting shipping',
  },
  {
    id: 'cz_sahel', name: 'Sahel Insurgency',
    bounds: [[10, -5], [25, 16]], color: '#f59e0b', severity: 'moderate',
    startYear: 2012, parties: ['JNIM', 'ISGS', 'Mali/Burkina/Niger juntas'],
    desc: 'Islamist insurgency across Mali, Burkina Faso, Niger',
  },
  {
    id: 'cz_ethiopia', name: 'Ethiopia Instability',
    bounds: [[3, 33], [15, 48]], color: '#f59e0b', severity: 'moderate',
    startYear: 2020, parties: ['Ethiopian govt', 'Various ethnic militias'],
    desc: 'Post-Tigray ceasefire instability. Amhara/Oromo tensions',
  },
];

/**
 * 🚢 STRATEGIC CHOKEPOINTS — Selat & jalur laut strategis
 * Titik bottleneck perdagangan global
 */
export const CHOKEPOINTS = [
  { id: 'hormuz', name: 'Strait of Hormuz', lat: 26.5, lon: 56.5, traffic: '21M bbl/day oil', risk: 'high', desc: 'Iran can threaten closure. 20% global oil' },
  { id: 'bab_el_mandeb', name: 'Bab el-Mandeb', lat: 12.5, lon: 43.5, traffic: '6.2M bbl/day', risk: 'critical', desc: 'Houthi attacks disrupting shipping since 2023' },
  { id: 'suez', name: 'Suez Canal', lat: 30.0, lon: 32.5, traffic: '12% global trade', risk: 'high', desc: 'Houthi crisis forcing rerouting via Cape of Good Hope' },
  { id: 'malacca', name: 'Strait of Malacca', lat: 2.5, lon: 101.5, traffic: '16M bbl/day oil', risk: 'moderate', desc: 'China 80% oil imports pass through' },
  { id: 'taiwan_strait', name: 'Taiwan Strait', lat: 24.5, lon: 119.5, traffic: '50% container ships', risk: 'high', desc: 'US-China flashpoint. 88% of largest container ships transit' },
  { id: 'gibraltar', name: 'Strait of Gibraltar', lat: 35.9, lon: -5.6, traffic: 'Med entry', risk: 'low', desc: 'Only entry to Mediterranean from Atlantic' },
  { id: 'danish_straits', name: 'Danish Straits', lat: 55.7, lon: 11.0, traffic: 'Baltic entry', risk: 'moderate', desc: 'Only exit from Baltic Sea. NATO strategic choke' },
  { id: 'bosphorus', name: 'Bosphorus Strait', lat: 41.1, lon: 29.0, traffic: '3M bbl/day', risk: 'moderate', desc: 'Turkey controls Black Sea access' },
  { id: 'panama', name: 'Panama Canal', lat: 9.1, lon: -79.7, traffic: '6% global trade', risk: 'moderate', desc: 'Drought reducing capacity since 2023' },
];

/**
 * ⚠️ FLIGHT RESTRICTION ZONES — NOTAMs dan airspace closures
 * Zona penerbangan terlarang/terbatas
 */
export const FLIGHT_RESTRICTIONS = [
  { id: 'notam_ukraine', name: 'Ukraine NOTAM', bounds: [[44, 22], [52, 40]], color: '#ef4444', severity: 'closed', desc: 'Airspace closed since Feb 2022' },
  { id: 'notam_iraq', name: 'Iraq Restriction', bounds: [[29, 38], [37, 49]], color: '#f97316', severity: 'restricted', desc: 'Caution advised, military ops' },
  { id: 'notam_iran', name: 'Iran Caution Area', bounds: [[25, 44], [40, 63]], color: '#f59e0b', severity: 'caution', desc: 'ICAO caution area' },
  { id: 'notam_libya', name: 'Libya NTL', bounds: [[19, 9], [34, 26]], color: '#f97316', severity: 'restricted', desc: 'No-fly zone fragments' },
  { id: 'notam_somalia', name: 'Somalia Restriction', bounds: [[-2, 40], [12, 52]], color: '#f97316', severity: 'restricted', desc: 'Security restricted' },
  { id: 'notam_yemen', name: 'Yemen Restriction', bounds: [[12, 42], [19, 54]], color: '#ef4444', severity: 'closed', desc: 'Airspace closed, active conflict' },
  { id: 'notam_syria', name: 'Syria Restriction', bounds: [[32, 35], [37, 42]], color: '#ef4444', severity: 'closed', desc: 'Airspace highly restricted' },
  { id: 'notam_nkorea', name: 'North Korea', bounds: [[37.5, 124], [43, 131]], color: '#ef4444', severity: 'closed', desc: 'Permanently closed airspace' },
];
