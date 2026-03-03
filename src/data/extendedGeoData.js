// ============================================================================
// EXTENDED GEO DATA — Spaceports, Datacenters, Flight Routes, Intel Hotspots
// Extracted from WorldMonitor config/ai-datacenters.ts, config/geo.ts
// ============================================================================

/**
 * 🚀 SPACEPORTS — Fasilitas peluncuran roket dunia
 */
export const SPACEPORTS = [
  { id: 'sp_kennedy', name: 'Kennedy Space Center', lat: 28.57, lon: -80.65, country: 'USA', operator: 'NASA/SpaceX', desc: 'Primary US crewed launch site' },
  { id: 'sp_vandenberg', name: 'Vandenberg SFB', lat: 34.63, lon: -120.57, country: 'USA', operator: 'SpaceX/USSF', desc: 'Polar orbit launches' },
  { id: 'sp_cape', name: 'Cape Canaveral SFS', lat: 28.49, lon: -80.58, country: 'USA', operator: 'ULA/SpaceX', desc: 'Atlas V, Delta IV, Falcon 9' },
  { id: 'sp_baikonur', name: 'Baikonur Cosmodrome', lat: 45.96, lon: 63.31, country: 'Kazakhstan', operator: 'Roscosmos', desc: 'World\'s first spaceport. Soyuz launches' },
  { id: 'sp_vostochny', name: 'Vostochny Cosmodrome', lat: 51.88, lon: 128.33, country: 'Russia', operator: 'Roscosmos', desc: 'Russia\'s new primary spaceport' },
  { id: 'sp_jiuquan', name: 'Jiuquan Launch Center', lat: 40.96, lon: 100.29, country: 'China', operator: 'CNSA', desc: 'China\'s first launch site. Shenzhou crewed' },
  { id: 'sp_wenchang', name: 'Wenchang Space Launch', lat: 19.61, lon: 110.95, country: 'China', operator: 'CNSA', desc: 'Long March 5, Tianwen missions' },
  { id: 'sp_xichang', name: 'Xichang Satellite Center', lat: 28.25, lon: 102.02, country: 'China', operator: 'CNSA', desc: 'Beidou navigation, GEO satellites' },
  { id: 'sp_kourou', name: 'Guiana Space Centre', lat: 5.24, lon: -52.77, country: 'French Guiana', operator: 'ESA/Arianespace', desc: 'Ariane 5/6, Vega launches' },
  { id: 'sp_tanegashima', name: 'Tanegashima Space Center', lat: 30.37, lon: 130.97, country: 'Japan', operator: 'JAXA', desc: 'H-IIA/H3 rocket launches' },
  { id: 'sp_sriharikota', name: 'Satish Dhawan Space Centre', lat: 13.72, lon: 80.23, country: 'India', operator: 'ISRO', desc: 'PSLV/GSLV, Chandrayaan missions' },
  { id: 'sp_plesetsk', name: 'Plesetsk Cosmodrome', lat: 62.93, lon: 40.58, country: 'Russia', operator: 'Russian MOD', desc: 'Military launches, ICBM tests' },
  { id: 'sp_semnan', name: 'Semnan Launch Site', lat: 35.23, lon: 53.92, country: 'Iran', operator: 'ISA', desc: 'Safir/Simorgh rockets. Dual-use concern' },
  { id: 'sp_sohae', name: 'Sohae Satellite Station', lat: 39.66, lon: 124.71, country: 'North Korea', operator: 'NADA', desc: 'Unha-3 launches. ICBM test site' },
  { id: 'sp_starbase', name: 'SpaceX Starbase', lat: 25.99, lon: -97.16, country: 'USA', operator: 'SpaceX', desc: 'Starship/Super Heavy development & launch' },
];

/**
 * 🖥️ AI DATACENTERS — Pusat data AI global
 * Subset dari WorldMonitor ai-datacenters.ts (90KB)
 */
export const AI_DATACENTERS = [
  // ── US Hyperscalers ──
  { id: 'dc_ashburn', name: 'Ashburn Data Center Alley', lat: 39.04, lon: -77.49, country: 'USA', operator: 'Multiple', capacity: '2000+ MW', desc: '70% of world internet traffic' },
  { id: 'dc_the_dalles', name: 'Google The Dalles', lat: 45.60, lon: -121.18, country: 'USA', operator: 'Google', capacity: '400 MW', desc: 'Major Google Cloud campus' },
  { id: 'dc_quincy', name: 'Microsoft Quincy', lat: 47.23, lon: -119.85, country: 'USA', operator: 'Microsoft', capacity: '500 MW', desc: 'Azure cloud, Bing AI' },
  { id: 'dc_mesa', name: 'Apple Mesa', lat: 33.43, lon: -111.85, country: 'USA', operator: 'Apple', capacity: '300 MW', desc: 'Apple Intelligence, Siri' },
  { id: 'dc_council_bluffs', name: 'Google Council Bluffs', lat: 41.26, lon: -95.86, country: 'USA', operator: 'Google', capacity: '400 MW', desc: 'Gemini AI training cluster' },
  // ── Asia ──
  { id: 'dc_singapore', name: 'Equinix Singapore', lat: 1.32, lon: 103.82, country: 'Singapore', operator: 'Equinix', capacity: '200 MW', desc: 'Southeast Asia hub' },
  { id: 'dc_tokyo', name: 'NTT Tokyo', lat: 35.68, lon: 139.76, country: 'Japan', operator: 'NTT', capacity: '150 MW', desc: 'Japan\'s largest datacenter cluster' },
  { id: 'dc_guiyang', name: 'Huawei Guiyang', lat: 26.65, lon: 106.63, country: 'China', operator: 'Huawei', capacity: '500 MW', desc: 'China cloud computing hub' },
  { id: 'dc_mumbai', name: 'Navi Mumbai DC', lat: 19.03, lon: 73.03, country: 'India', operator: 'Multiple', capacity: '200 MW', desc: 'India\'s growing AI hub' },
  // ── Europe ──
  { id: 'dc_amsterdam', name: 'Amsterdam Data Hub', lat: 52.30, lon: 4.94, country: 'Netherlands', operator: 'Multiple', capacity: '300 MW', desc: 'AMS-IX, Europe\'s largest internet exchange' },
  { id: 'dc_frankfurt', name: 'Frankfurt DE-CIX', lat: 50.12, lon: 8.68, country: 'Germany', operator: 'Multiple', capacity: '400 MW', desc: 'World\'s largest internet exchange by throughput' },
  { id: 'dc_dublin', name: 'Dublin Data Campus', lat: 53.35, lon: -6.26, country: 'Ireland', operator: 'AWS/Microsoft/Google', capacity: '300 MW', desc: 'Europe cloud hub (tax benefits)' },
  { id: 'dc_lulea', name: 'Facebook Luleå', lat: 65.58, lon: 22.15, country: 'Sweden', operator: 'Meta', capacity: '120 MW', desc: 'Arctic cooling, LLaMA training' },
  // ── Middle East ──
  { id: 'dc_jeddah', name: 'Oracle Jeddah', lat: 21.49, lon: 39.19, country: 'Saudi Arabia', operator: 'Oracle/SAP', capacity: '100 MW', desc: 'NEOM digital backbone' },
  { id: 'dc_dubai', name: 'Khazna Dubai', lat: 25.20, lon: 55.27, country: 'UAE', operator: 'Khazna', capacity: '100 MW', desc: 'UAE AI strategy hub' },
];

/**
 * ✈️ SIMULATED FLIGHT ROUTES — Jalur penerbangan militer aktif
 * Polyline routes yang menunjukkan corridor penerbangan militer
 */
export const MILITARY_FLIGHT_ROUTES = [
  {
    id: 'route_nato_patrol', name: 'NATO Baltic Air Patrol',
    type: 'patrol', operator: 'NATO',
    color: '#6366f1', dashArray: '12 6',
    coords: [[57.0, 21.0], [58.5, 23.0], [59.5, 25.0], [58.0, 27.0], [56.5, 24.0], [57.0, 21.0]],
    desc: 'Baltic Air Policing rotation (24/7)',
    aircraft: 'F-16/Typhoon/Gripen',
  },
  {
    id: 'route_black_sea', name: 'Black Sea Surveillance',
    type: 'recon', operator: 'USAF/RAF',
    color: '#06b6d4', dashArray: '8 4',
    coords: [[41.0, 28.0], [42.0, 31.0], [43.5, 34.0], [44.0, 37.0], [43.0, 39.5]],
    desc: 'RC-135/RQ-4 surveillance corridor near Crimea',
    aircraft: 'RC-135 Rivet Joint / RQ-4 Global Hawk',
  },
  {
    id: 'route_scs_patrol', name: 'South China Sea Freedom of Navigation',
    type: 'patrol', operator: 'US Navy/USAF',
    color: '#3b82f6', dashArray: '10 5',
    coords: [[20.0, 116.0], [16.0, 113.0], [12.0, 112.0], [9.5, 113.0], [7.0, 116.0], [10.0, 118.0]],
    desc: 'FONOP patrol near Spratly/Paracel Islands',
    aircraft: 'P-8 Poseidon / B-52H',
  },
  {
    id: 'route_taiwan_strait', name: 'Taiwan Strait Monitoring',
    type: 'recon', operator: 'USAF',
    color: '#f59e0b', dashArray: '6 3',
    coords: [[26.0, 120.0], [24.5, 119.5], [23.0, 119.0], [22.0, 118.5]],
    desc: 'Regular ISR flights through/near Taiwan Strait',
    aircraft: 'RC-135 / EP-3 Aries',
  },
  {
    id: 'route_bomber_gulf', name: 'B-52 Strait of Hormuz Patrol',
    type: 'bomber', operator: 'USAF',
    color: '#ef4444', dashArray: '15 5',
    coords: [[25.0, 51.0], [25.5, 54.0], [26.5, 56.5], [25.0, 58.0], [23.0, 59.5]],
    desc: 'B-52H presence patrols near Iran',
    aircraft: 'B-52H Stratofortress',
  },
  {
    id: 'route_tanker_ops', name: 'Mediterranean Tanker Track',
    type: 'tanker', operator: 'USAF',
    color: '#8b5cf6', dashArray: '10 4',
    coords: [[35.0, 15.0], [35.5, 20.0], [34.5, 25.0], [34.0, 30.0], [35.0, 33.0]],
    desc: 'KC-135/KC-46 refueling orbits',
    aircraft: 'KC-135 Stratotanker',
  },
  {
    id: 'route_russian_bomber', name: 'Russian Long-Range Aviation Patrol',
    type: 'bomber', operator: 'Russia VKS',
    color: '#ef4444', dashArray: '20 8',
    coords: [[69.0, 33.0], [72.0, 15.0], [70.0, -5.0], [65.0, -15.0], [60.0, -10.0], [55.0, -5.0]],
    desc: 'Tu-95 Bear probing NATO air defenses',
    aircraft: 'Tu-95MS Bear-H',
  },
  {
    id: 'route_pla_adiz', name: 'PLA ADIZ Incursions',
    type: 'fighter', operator: 'PLAAF',
    color: '#f97316', dashArray: '8 4',
    coords: [[25.0, 120.5], [24.0, 121.0], [23.0, 122.0], [22.5, 121.5], [23.5, 120.0]],
    desc: 'Regular PLA sorties into Taiwan ADIZ',
    aircraft: 'J-16 / Su-30MKK / H-6',
  },
];

/**
 * 🔴 INTEL HOTSPOTS — Area aktivitas intelijen tinggi
 * Dari WorldMonitor config/geo.ts
 */
export const INTEL_HOTSPOTS = [
  { id: 'ih_crimea', name: 'Crimea Peninsula', lat: 44.95, lon: 34.10, severity: 'critical', desc: 'Occupied territory. Naval HQ attacks' },
  { id: 'ih_kaliningrad', name: 'Kaliningrad Exclave', lat: 54.71, lon: 20.51, severity: 'high', desc: 'Russian nuclear-capable enclave in NATO territory' },
  { id: 'ih_natanz', name: 'Natanz Complex', lat: 33.72, lon: 51.73, severity: 'high', desc: 'Iran uranium enrichment. Stuxnet target' },
  { id: 'ih_taiwan', name: 'Taiwan Strait', lat: 24.50, lon: 119.50, severity: 'critical', desc: 'US-China flashpoint. Daily PLA incursions' },
  { id: 'ih_hormuz', name: 'Strait of Hormuz', lat: 26.50, lon: 56.50, severity: 'high', desc: '20% global oil. Iran seizure threats' },
  { id: 'ih_rafah', name: 'Rafah Crossing', lat: 31.27, lon: 34.24, severity: 'critical', desc: 'Gaza-Egypt border. Humanitarian corridor' },
  { id: 'ih_zapnpp', name: 'Zaporizhzhia NPP', lat: 47.51, lon: 34.58, severity: 'critical', desc: 'Nuclear plant in active war zone' },
  { id: 'ih_bab', name: 'Bab el-Mandeb', lat: 12.50, lon: 43.50, severity: 'critical', desc: 'Houthi anti-ship attacks. Global shipping disrupted' },
  { id: 'ih_dmz', name: 'Korean DMZ', lat: 37.95, lon: 126.68, severity: 'high', desc: 'World\'s most fortified border' },
  { id: 'ih_arunachal', name: 'LAC India-China', lat: 28.00, lon: 92.00, severity: 'elevated', desc: 'India-China border standoff' },
  { id: 'ih_svalbard', name: 'Svalbard Cables', lat: 78.22, lon: 15.63, severity: 'elevated', desc: 'Undersea cable junction. Suspected sabotage' },
];

/**
 * 🌋 ACTIVE VOLCANOES — Gunung berapi aktif berbahaya
 */
export const ACTIVE_VOLCANOES = [
  { id: 'vol_etna', name: 'Mt. Etna', lat: 37.75, lon: 14.99, country: 'Italy', status: 'erupting', desc: 'Europe\'s most active volcano' },
  { id: 'vol_kilauea', name: 'Kīlauea', lat: 19.42, lon: -155.29, country: 'USA', status: 'active', desc: 'Hawaii shield volcano' },
  { id: 'vol_sakurajima', name: 'Sakurajima', lat: 31.58, lon: 130.66, country: 'Japan', status: 'erupting', desc: 'One of the most active in Japan' },
  { id: 'vol_popocatepetl', name: 'Popocatépetl', lat: 19.02, lon: -98.63, country: 'Mexico', status: 'active', desc: 'Near Mexico City (25M people)' },
  { id: 'vol_semeru', name: 'Mt. Semeru', lat: -8.11, lon: 112.92, country: 'Indonesia', status: 'erupting', desc: 'Java\'s highest volcano' },
  { id: 'vol_ruang', name: 'Mt. Ruang', lat: 2.30, lon: 125.37, country: 'Indonesia', status: 'active', desc: 'Recent major eruption 2024' },
];
