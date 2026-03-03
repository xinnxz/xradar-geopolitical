// ============================================================================
// WAR EVENTS DATA — Serangan, pertahanan, frontline, blokade, pengungsi
// Data simulasi berdasarkan event nyata 2024-2026 untuk visualisasi
// ============================================================================

/**
 * 💣 RECENT STRIKES & ATTACKS — Serangan terbaru dunia
 * Format: origin → target trajectory line + impact circle
 * Setiap entry punya garis trajectory dari lokasi peluncuran ke target
 */
export const RECENT_STRIKES = [
  // ── Israel-Iran Conflict ──
  {
    id: 'strike_il_ir_isfahan', name: 'Israel Strike on Isfahan',
    origin: { lat: 31.77, lon: 35.23, label: 'Israel (Nevatim AB)' },
    target: { lat: 32.65, lon: 51.68, label: 'Isfahan, Iran' },
    type: 'airstrike', severity: 'critical',
    date: '2024-04-19', weapon: 'F-35I / Stand-off munitions',
    desc: 'Retaliatory strike near Natanz nuclear facility',
    color: '#3b82f6',
  },
  {
    id: 'strike_ir_il_apr', name: 'Iran Missile Barrage on Israel',
    origin: { lat: 32.43, lon: 53.69, label: 'Iran (multiple sites)' },
    target: { lat: 31.77, lon: 35.23, label: 'Israel' },
    type: 'missile', severity: 'critical',
    date: '2024-04-13', weapon: '300+ drones, cruise & ballistic missiles',
    desc: 'Operation True Promise — first direct Iran attack on Israel',
    color: '#ef4444',
  },
  {
    id: 'strike_ir_il_oct', name: 'Iran Ballistic Missile Strike',
    origin: { lat: 35.69, lon: 51.39, label: 'Iran (IRGC)' },
    target: { lat: 32.19, lon: 34.87, label: 'Tel Aviv / Nevatim' },
    type: 'ballistic_missile', severity: 'critical',
    date: '2024-10-01', weapon: '180+ ballistic missiles',
    desc: 'Operation True Promise II — largest ballistic missile attack',
    color: '#ef4444',
  },

  // ── Ukraine-Russia ──
  {
    id: 'strike_ua_crimea', name: 'Ukraine ATACMS on Crimea',
    origin: { lat: 47.84, lon: 35.14, label: 'Zaporizhzhia Front' },
    target: { lat: 44.95, lon: 34.10, label: 'Crimea (Sevastopol)' },
    type: 'missile', severity: 'high',
    date: '2024-06-23', weapon: 'ATACMS cluster munition',
    desc: 'Strike on Sevastopol beach area, targeting radar/C2',
    color: '#3b82f6',
  },
  {
    id: 'strike_ru_kyiv', name: 'Russia Massive Missile Strike on Kyiv',
    origin: { lat: 54.94, lon: 43.32, label: 'Saratov/Engels area' },
    target: { lat: 50.45, lon: 30.52, label: 'Kyiv' },
    type: 'cruise_missile', severity: 'critical',
    date: '2024-12-25', weapon: 'Kh-101/Kalibr/Kinzhal mix',
    desc: 'Christmas attack — 70+ missiles on energy infrastructure',
    color: '#ef4444',
  },
  {
    id: 'strike_ua_kursk', name: 'Ukraine Incursion into Kursk',
    origin: { lat: 51.27, lon: 34.54, label: 'Sumy Oblast' },
    target: { lat: 51.73, lon: 36.19, label: 'Kursk Oblast, Russia' },
    type: 'ground_offensive', severity: 'high',
    date: '2024-08-06', weapon: 'Ground forces + armor',
    desc: 'Surprise cross-border offensive into Russian territory',
    color: '#f59e0b',
  },

  // ── Houthi Red Sea Attacks ──
  {
    id: 'strike_houthi_ship', name: 'Houthi Anti-Ship Attacks',
    origin: { lat: 15.35, lon: 44.21, label: 'Yemen (Al Hudaydah)' },
    target: { lat: 13.50, lon: 42.50, label: 'Red Sea Shipping Lane' },
    type: 'anti_ship_missile', severity: 'high',
    date: '2024-01-11', weapon: 'Drone boats + anti-ship missiles',
    desc: 'Ongoing attacks on commercial shipping in Red Sea',
    color: '#f97316',
  },
  {
    id: 'strike_us_houthi', name: 'US-UK Strikes on Yemen',
    origin: { lat: 26.23, lon: 50.55, label: 'US 5th Fleet (Bahrain)' },
    target: { lat: 14.80, lon: 42.95, label: 'Yemen (Houthi targets)' },
    type: 'airstrike', severity: 'high',
    date: '2024-01-12', weapon: 'Tomahawk + F/A-18 JDAM',
    desc: 'Operation Prosperity Guardian retaliation strikes',
    color: '#3b82f6',
  },

  // ── Gaza ──
  {
    id: 'strike_hamas_oct7', name: 'Hamas Oct 7 Attack',
    origin: { lat: 31.35, lon: 34.35, label: 'Gaza Strip' },
    target: { lat: 31.38, lon: 34.40, label: 'Southern Israel' },
    type: 'ground_attack', severity: 'critical',
    date: '2023-10-07', weapon: '3000+ rockets + ground infiltration',
    desc: 'Al-Aqsa Flood — deadliest attack on Israel in history',
    color: '#ef4444',
  },
  {
    id: 'strike_idf_gaza', name: 'IDF Gaza Campaign',
    origin: { lat: 31.77, lon: 35.23, label: 'Israel' },
    target: { lat: 31.42, lon: 34.36, label: 'Gaza City / Rafah' },
    type: 'air_campaign', severity: 'critical',
    date: '2023-10-27', weapon: 'Air + ground offensive',
    desc: 'Operation Swords of Iron — ongoing IDF campaign in Gaza',
    color: '#3b82f6',
  },
];

/**
 * 🛡️ AIR DEFENSE SYSTEMS — Sistem pertahanan udara
 * Ditampilkan sebagai circles/bubbles di peta menunjukkan jangkauan
 */
export const AIR_DEFENSE_SYSTEMS = [
  // ── Israel ──
  { id: 'ad_iron_dome', name: 'Iron Dome', lat: 32.08, lon: 34.78, range: 70, type: 'short', country: 'Israel', operator: 'IDF', color: '#3b82f6', desc: 'Short-range rocket interceptor. 90%+ success rate' },
  { id: 'ad_davids_sling', name: "David's Sling", lat: 32.08, lon: 34.78, range: 300, type: 'medium', country: 'Israel', operator: 'IDF', color: '#06b6d4', desc: 'Medium-range interceptor for cruise missiles & rockets' },
  { id: 'ad_arrow3', name: 'Arrow 3', lat: 31.86, lon: 34.72, range: 2400, type: 'exo', country: 'Israel', operator: 'IDF', color: '#8b5cf6', desc: 'Exo-atmospheric interceptor for ballistic missiles' },

  // ── Russia ──
  { id: 'ad_s400_moscow', name: 'S-400 Triumf (Moscow)', lat: 55.75, lon: 37.62, range: 400, type: 'long', country: 'Russia', operator: 'VKS', color: '#ef4444', desc: 'Russia\'s premiere SAM system. Anti-air + anti-ballistic' },
  { id: 'ad_s400_crimea', name: 'S-400 (Crimea)', lat: 44.62, lon: 33.53, range: 400, type: 'long', country: 'Russia', operator: 'VKS', color: '#ef4444', desc: 'A2/AD bubble over Crimea & Black Sea' },
  { id: 'ad_s400_kalinin', name: 'S-400 (Kaliningrad)', lat: 54.72, lon: 20.50, range: 400, type: 'long', country: 'Russia', operator: 'VKS', color: '#ef4444', desc: 'A2/AD coverage over Baltic' },
  { id: 'ad_s400_syria', name: 'S-400 (Syria)', lat: 35.41, lon: 35.95, range: 400, type: 'long', country: 'Russia', operator: 'VKS', color: '#ef4444', desc: 'Deployed at Khmeimim Air Base' },
  { id: 'ad_s300_iran', name: 'S-300PMU2 (Iran)', lat: 32.65, lon: 51.68, range: 200, type: 'long', country: 'Iran', operator: 'IRIAF', color: '#f97316', desc: 'Russian-supplied, protecting nuclear sites' },

  // ── US/NATO ──
  { id: 'ad_patriot_pol', name: 'Patriot (Poland)', lat: 51.40, lon: 21.15, range: 160, type: 'medium', country: 'Poland', operator: 'US Army', color: '#3b82f6', desc: 'NATO forward defense against Russian threat' },
  { id: 'ad_thaad_guam', name: 'THAAD (Guam)', lat: 13.45, lon: 144.79, range: 200, type: 'terminal', country: 'USA', operator: 'US Army', color: '#3b82f6', desc: 'Terminal High Altitude defense' },
  { id: 'ad_thaad_uae', name: 'THAAD (UAE)', lat: 24.42, lon: 54.65, range: 200, type: 'terminal', country: 'UAE', operator: 'US Army', color: '#3b82f6', desc: 'Deployed to protect from Iranian missiles' },
  { id: 'ad_thaad_israel', name: 'THAAD (Israel)', lat: 31.28, lon: 34.72, range: 200, type: 'terminal', country: 'Israel', operator: 'US Army', color: '#3b82f6', desc: 'Deployed Oct 2024 during Iran tensions' },
  { id: 'ad_aegis_rota', name: 'Aegis Ashore (Spain)', lat: 36.63, lon: -6.35, range: 500, type: 'long', country: 'Spain', operator: 'US Navy', color: '#3b82f6', desc: 'Aegis BMD from land' },
  { id: 'ad_aegis_romania', name: 'Aegis Ashore (Romania)', lat: 44.08, lon: 24.29, range: 500, type: 'long', country: 'Romania', operator: 'US Navy', color: '#3b82f6', desc: 'MK-41 VLS with SM-3 interceptors' },

  // ── China ──
  { id: 'ad_hq9_scs', name: 'HQ-9 (South China Sea)', lat: 16.84, lon: 112.34, range: 200, type: 'long', country: 'China', operator: 'PLA', color: '#f59e0b', desc: 'Deployed on artificial islands in SCS' },
  { id: 'ad_hq9_beijing', name: 'HQ-9 (Beijing)', lat: 39.90, lon: 116.40, range: 200, type: 'long', country: 'China', operator: 'PLA', color: '#f59e0b', desc: 'Capital air defense screen' },
];

/**
 * 📏 ACTIVE FRONTLINES — Garis depan pertempuran aktif
 * Polyline dengan warna berdasarkan intensitas
 */
export const FRONTLINES = [
  {
    id: 'front_ukraine_east', name: 'Ukraine Eastern Front',
    intensity: 'critical',
    color: '#ef4444',
    coords: [
      [51.40, 34.00], [50.80, 34.50], [50.10, 35.70],
      [49.20, 36.20], [48.80, 36.80], [48.50, 37.50],
      [48.10, 37.80], [47.80, 37.20], [47.50, 36.50],
      [47.10, 35.80], [46.80, 35.20], [46.50, 34.80],
    ],
    desc: 'Active 1000km+ contact line. Heaviest fighting around Pokrovsk-Chasiv Yar',
    parties: ['Ukraine (AFU)', 'Russia (RU forces)'],
    since: 'Feb 2022',
  },
  {
    id: 'front_gaza', name: 'Gaza Strip Perimeter',
    intensity: 'critical',
    color: '#ef4444',
    coords: [
      [31.59, 34.22], [31.53, 34.48], [31.22, 34.48],
      [31.22, 34.22], [31.59, 34.22],
    ],
    desc: 'IDF operations throughout Gaza. Rafah crossing contested',
    parties: ['IDF', 'Hamas / PIJ'],
    since: 'Oct 2023',
  },
  {
    id: 'front_sudan', name: 'Sudan — Khartoum Axis',
    intensity: 'high',
    color: '#f97316',
    coords: [
      [15.63, 32.53], [15.55, 32.40], [15.50, 32.60],
      [15.40, 32.55], [15.30, 32.45],
    ],
    desc: 'SAF vs RSF fighting in Greater Khartoum',
    parties: ['Sudan Armed Forces', 'Rapid Support Forces'],
    since: 'Apr 2023',
  },
  {
    id: 'front_myanmar', name: 'Myanmar — Operation 1027',
    intensity: 'high',
    color: '#f97316',
    coords: [
      [23.80, 97.00], [23.50, 97.50], [23.00, 98.00],
      [22.50, 98.20], [22.00, 97.80], [21.50, 97.50],
    ],
    desc: 'Resistance forces with major territorial gains since late 2023',
    parties: ['Tatmadaw (Junta)', 'Three Brotherhood Alliance + NUG'],
    since: 'Oct 2023',
  },
];

/**
 * 🚢 NAVAL EXCLUSION ZONES — Zona laut yang di-blokade/dibatasi
 */
export const NAVAL_BLOCKADES = [
  {
    id: 'block_red_sea', name: 'Red Sea Danger Zone',
    bounds: [[11, 40], [16, 46]],
    color: '#ef4444', severity: 'active',
    desc: 'Houthi anti-ship missile & drone attacks. Major shipping rerouted via Cape of Good Hope',
    enforcedBy: 'Ansar Allah (Houthis)',
    impact: '20% reduction in Suez Canal traffic',
  },
  {
    id: 'block_ukraine_coast', name: 'Ukraine Black Sea Zone',
    bounds: [[43.5, 30], [46.5, 38]],
    color: '#f97316', severity: 'restricted',
    desc: 'Mined waters + Russian naval blockade (partially broken by Ukraine)',
    enforcedBy: 'Russia + Ukraine mines',
    impact: 'Grain corridor partially restored',
  },
  {
    id: 'block_taiwan_exercise', name: 'Taiwan Strait Exercise Zone',
    bounds: [[22, 117], [26, 122]],
    color: '#f59e0b', severity: 'intermittent',
    desc: 'PLA live-fire exercise zones activated during Taiwan tensions',
    enforcedBy: 'PLA Navy',
    impact: 'Periodic shipping disruptions',
  },
];

/**
 * 👥 REFUGEE / DISPLACEMENT FLOWS — Arus pengungsi
 * Arrow lines dari conflict zone ke negara tujuan
 */
export const REFUGEE_FLOWS = [
  {
    id: 'ref_ukraine', name: 'Ukraine Refugees → EU',
    origin: { lat: 50.45, lon: 30.52 },
    destinations: [
      { lat: 52.23, lon: 21.01, country: 'Poland', count: '1.6M' },
      { lat: 50.07, lon: 14.44, country: 'Czechia', count: '380K' },
      { lat: 48.15, lon: 16.37, country: 'Austria', count: '95K' },
      { lat: 52.52, lon: 13.40, country: 'Germany', count: '1.1M' },
    ],
    total: '6.5M+', color: '#3b82f6',
    desc: 'Largest displacement crisis in Europe since WWII',
  },
  {
    id: 'ref_gaza', name: 'Gaza Internal Displacement',
    origin: { lat: 31.50, lon: 34.45 },
    destinations: [
      { lat: 31.25, lon: 34.30, country: 'Rafah Area', count: '1.4M' },
    ],
    total: '1.9M (85% of population)', color: '#ef4444',
    desc: 'Internally displaced within Gaza. Limited exit via Rafah',
  },
  {
    id: 'ref_sudan', name: 'Sudan Refugees',
    origin: { lat: 15.60, lon: 32.53 },
    destinations: [
      { lat: 13.51, lon: 33.33, country: 'Chad', count: '600K' },
      { lat: 3.87, lon: 31.58, country: 'South Sudan', count: '500K' },
      { lat: 0.35, lon: 32.62, country: 'Uganda', count: '60K' },
    ],
    total: '8.6M displaced', color: '#f97316',
    desc: 'Massive humanitarian crisis with famine warnings',
  },
  {
    id: 'ref_myanmar', name: 'Myanmar Refugees',
    origin: { lat: 19.76, lon: 96.07 },
    destinations: [
      { lat: 21.91, lon: 95.96, country: 'Thailand border', count: '90K' },
      { lat: 21.43, lon: 92.00, country: 'Bangladesh (Rohingya)', count: '960K' },
      { lat: 25.04, lon: 98.50, country: 'China border', count: '20K' },
    ],
    total: '2.7M displaced', color: '#f59e0b',
    desc: 'Post-coup conflict + Rohingya crisis',
  },
];

/**
 * 🤖 DRONE COMBAT ZONES — Area operasi drone tempur
 */
export const DRONE_ZONES = [
  { id: 'dz_ukraine', name: 'Ukraine FPV Drone Warfare', center: [48.5, 37.0], radius: 200, color: '#8b5cf6', severity: 'extreme', desc: 'Heaviest drone combat in history. 100,000+ drones/month deployed by both sides. FPV kamikaze drones dominate' },
  { id: 'dz_houthi', name: 'Houthi Drone Operations', center: [14.0, 43.0], radius: 400, color: '#f97316', severity: 'high', desc: 'Samad-3 & Waid drones targeting shipping and Saudi infrastructure' },
  { id: 'dz_sahel', name: 'Sahel TB2/Akinci Ops', center: [17.0, 4.0], radius: 300, color: '#f59e0b', severity: 'moderate', desc: 'Turkish Bayraktar TB2 used by Niger, Mali against insurgents' },
  { id: 'dz_gaza', name: 'IDF UAS Overwatch Gaza', center: [31.4, 34.4], radius: 30, color: '#3b82f6', severity: 'extreme', desc: 'Hermes 450/900, Harop loitering munitions. 24/7 ISR coverage' },
  { id: 'dz_somalia', name: 'US Reaper Somalia', center: [6.0, 46.0], radius: 400, color: '#06b6d4', severity: 'moderate', desc: 'MQ-9 Reaper strikes against Al-Shabaab from Camp Lemonnier' },
];

/**
 * 🟢 HUMANITARIAN CORRIDORS — Jalur bantuan kemanusiaan
 */
export const HUMANITARIAN_CORRIDORS = [
  {
    id: 'hc_gaza_aid', name: 'Gaza Aid Route',
    coords: [[30.05, 31.23], [30.85, 33.75], [31.25, 34.25]],
    status: 'restricted', color: '#10b981',
    desc: 'Egypt → Rafah crossing. Severely restricted since May 2024',
    org: 'UNRWA / WFP',
  },
  {
    id: 'hc_ukraine_grain', name: 'Ukraine Black Sea Grain Corridor',
    coords: [[46.48, 30.73], [44.00, 30.50], [42.50, 29.00], [41.00, 28.95]],
    status: 'active', color: '#10b981',
    desc: 'Alternative grain export route established after Russia left grain deal',
    org: 'Ukraine Maritime Corridor',
  },
  {
    id: 'hc_sudan_port', name: 'Sudan Aid Corridor (Port Sudan)',
    coords: [[19.62, 37.22], [17.00, 34.00], [15.60, 32.53]],
    status: 'contested', color: '#f59e0b',
    desc: 'Main humanitarian supply route to Khartoum. Under threat from RSF',
    org: 'WFP / ICRC',
  },
];

/**
 * ⚡ CYBER CONFLICT INDICATORS — Serangan siber negara
 */
export const CYBER_ATTACKS = [
  { id: 'cyber_ru_ua', origin: { lat: 55.75, lon: 37.62 }, target: { lat: 50.45, lon: 30.52 }, name: 'Russia → Ukraine Cyber Ops', type: 'infrastructure', severity: 'critical', desc: 'Continuous attacks on power grid, banking, government', color: '#ef4444' },
  { id: 'cyber_cn_tw', origin: { lat: 39.90, lon: 116.40 }, target: { lat: 25.03, lon: 121.57 }, name: 'PRC → Taiwan Cyber Ops', type: 'espionage', severity: 'high', desc: 'APT groups targeting military, semiconductor industry', color: '#f59e0b' },
  { id: 'cyber_ir_il', origin: { lat: 35.69, lon: 51.39 }, target: { lat: 32.08, lon: 34.78 }, name: 'Iran → Israel Cyber Ops', type: 'infrastructure', severity: 'high', desc: 'Attacks on water systems, financial sector', color: '#f97316' },
  { id: 'cyber_nk_global', origin: { lat: 39.02, lon: 125.73 }, target: { lat: 37.57, lon: 126.98 }, name: 'DPRK → Global Crypto Theft', type: 'financial', severity: 'high', desc: 'Lazarus Group: $1.5B+ stolen in crypto heists', color: '#ef4444' },
];

/**
 * 🏭 WEAPONS SYSTEMS DEPLOYED — Senjata-senjata penting yang deployed
 */
export const DEPLOYED_WEAPONS = [
  { id: 'wp_kinzhal', name: 'Kinzhal (Kh-47M2)', lat: 68.15, lon: 33.33, country: 'Russia', type: 'hypersonic', range: 2000, desc: 'Air-launched hypersonic missile. Mach 10+' },
  { id: 'wp_zircon', name: 'Zircon (3M22)', lat: 69.07, lon: 33.42, country: 'Russia', type: 'hypersonic', range: 1000, desc: 'Ship-launched hypersonic anti-ship missile' },
  { id: 'wp_atacms', name: 'ATACMS (Ukraine)', lat: 48.50, lon: 35.14, country: 'Ukraine', type: 'ballistic', range: 300, desc: 'US-supplied. Used against Crimea targets' },
  { id: 'wp_storm_shadow', name: 'Storm Shadow/SCALP', lat: 49.00, lon: 36.00, country: 'Ukraine', type: 'cruise', range: 250, desc: 'UK/France supplied. Used against high-value targets' },
  { id: 'wp_df21d', name: 'DF-21D "Carrier Killer"', lat: 26.60, lon: 100.00, country: 'China', type: 'anti_ship_ballistic', range: 1500, desc: 'Anti-ship ballistic missile. Targets US carriers' },
  { id: 'wp_df41', name: 'DF-41 ICBM', lat: 40.96, lon: 100.29, country: 'China', type: 'ICBM', range: 14000, desc: 'MIRV-capable. 10+ warheads. China\'s newest ICBM' },
  { id: 'wp_sarmat', name: 'RS-28 Sarmat', lat: 56.16, lon: 54.73, country: 'Russia', type: 'ICBM', range: 18000, desc: 'Satan II — heaviest ICBM. 10-15 MIRV warheads' },
  { id: 'wp_trident', name: 'Trident II D5 (UK SSBN)', lat: 56.07, lon: -4.82, country: 'UK', type: 'SLBM', range: 12000, desc: 'Vanguard-class submarine. UK nuclear deterrent' },
];
