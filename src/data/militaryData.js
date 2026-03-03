// ============================================================================
// MILITARY DATA — Extracted from WorldMonitor Intelligence Platform
// Sumber: config/military.ts, config/bases-expanded.ts, config/geo.ts
// ============================================================================

/**
 * 🔰 MILITARY CALLSIGN PATTERNS
 * Digunakan untuk identifikasi pesawat militer dari data ADS-B
 * Pattern berupa regex prefix yang di-match dengan callsign pesawat
 */
export const MILITARY_CALLSIGNS = {
  // ─── US Air Force ───
  usaf: [
    { pattern: 'RCH', type: 'transport', desc: 'REACH - AMC transport' },
    { pattern: 'REACH', type: 'transport', desc: 'REACH - AMC transport' },
    { pattern: 'DUKE', type: 'transport', desc: 'DUKE - VIP transport' },
    { pattern: 'SAM', type: 'vip', desc: 'Special Air Mission' },
    { pattern: 'AF1', type: 'vip', desc: 'Air Force One' },
    { pattern: 'AF2', type: 'vip', desc: 'Air Force Two' },
    { pattern: 'EXEC', type: 'vip', desc: 'Executive transport' },
    { pattern: 'GOLD', type: 'special_ops', desc: 'Special operations' },
    { pattern: 'KING', type: 'tanker', desc: 'KC-135/KC-46 tanker' },
    { pattern: 'SHELL', type: 'tanker', desc: 'Tanker operations' },
    { pattern: 'TEAL', type: 'tanker', desc: 'Tanker operations' },
    { pattern: 'BOLT', type: 'fighter', desc: 'Fighter ops' },
    { pattern: 'VIPER', type: 'fighter', desc: 'F-16 operations' },
    { pattern: 'RAPTOR', type: 'fighter', desc: 'F-22 operations' },
    { pattern: 'BONE', type: 'bomber', desc: 'B-1B operations' },
    { pattern: 'DEATH', type: 'bomber', desc: 'B-2 operations' },
    { pattern: 'DOOM', type: 'bomber', desc: 'B-52 operations' },
    { pattern: 'SNTRY', type: 'awacs', desc: 'E-3 AWACS' },
    { pattern: 'DRAGN', type: 'recon', desc: 'U-2 operations' },
    { pattern: 'COBRA', type: 'recon', desc: 'RC-135 SIGINT' },
    { pattern: 'RIVET', type: 'recon', desc: 'RC-135 variants' },
    { pattern: 'OLIVE', type: 'recon', desc: 'RC-135 operations' },
    { pattern: 'JAKE', type: 'recon', desc: 'E-8 JSTARS' },
    { pattern: 'NCHO', type: 'special_ops', desc: 'MC-130 Specops' },
    { pattern: 'SHADOW', type: 'special_ops', desc: 'Special operations' },
    { pattern: 'EVAC', type: 'transport', desc: 'Aeromedical evacuation' },
    { pattern: 'MOOSE', type: 'transport', desc: 'C-17 operations' },
    { pattern: 'HERKY', type: 'transport', desc: 'C-130 operations' },
    { pattern: 'FORTE', type: 'drone', desc: 'RQ-4 Global Hawk' },
    { pattern: 'HAWK', type: 'drone', desc: 'Global Hawk drone' },
    { pattern: 'REAPER', type: 'drone', desc: 'MQ-9 Reaper' },
  ],
  // ─── US Navy ───
  usn: [
    { pattern: 'NAVY', type: null, desc: 'US Navy aircraft' },
    { pattern: 'CNV', type: 'transport', desc: 'Navy transport' },
    { pattern: 'VRC', type: 'transport', desc: 'Carrier onboard delivery' },
    { pattern: 'TRIDENT', type: 'patrol', desc: 'P-8 maritime patrol' },
    { pattern: 'RED', type: 'patrol', desc: 'P-8/P-3 operations' },
    { pattern: 'BRONCO', type: 'fighter', desc: 'F/A-18 operations' },
  ],
  // ─── NATO & Allied ───
  nato: [
    { pattern: 'NATO', type: 'awacs', desc: 'NATO AWACS', country: 'NATO' },
    { pattern: 'RRR', type: null, desc: 'RAF aircraft', country: 'UK' },
    { pattern: 'ASCOT', type: 'transport', desc: 'RAF transport', country: 'UK' },
    { pattern: 'TARTAN', type: 'tanker', desc: 'RAF tanker', country: 'UK' },
    { pattern: 'FAF', type: null, desc: 'French Air Force', country: 'France' },
    { pattern: 'CTM', type: 'transport', desc: 'French AF transport', country: 'France' },
    { pattern: 'GAF', type: null, desc: 'German Air Force', country: 'Germany' },
    { pattern: 'IAF', type: null, desc: 'Israeli Air Force', country: 'Israel' },
    { pattern: 'THK', type: null, desc: 'Turkish Air Force', country: 'Turkey' },
    { pattern: 'RSAF', type: null, desc: 'Royal Saudi Air Force', country: 'Saudi Arabia' },
    { pattern: 'ROKAF', type: null, desc: 'Korea Air Force', country: 'South Korea' },
    { pattern: 'RAAF', type: null, desc: 'Royal Australian Air Force', country: 'Australia' },
    { pattern: 'CANFORCE', type: 'transport', desc: 'Canadian Forces', country: 'Canada' },
    { pattern: 'JASDF', type: null, desc: 'Japan Self-Defense Force', country: 'Japan' },
  ],
  // ─── Adversary (Russia/China) ───
  adversary: [
    { pattern: 'RF', type: null, desc: 'Russian Federation', country: 'Russia' },
    { pattern: 'RFF', type: null, desc: 'Russian AF', country: 'Russia' },
    { pattern: 'CCA', type: null, desc: 'PLA Air Force', country: 'China' },
    { pattern: 'CHH', type: null, desc: 'PLA Navy Air', country: 'China' },
  ],
};

/**
 * ✈️ MILITARY AIRCRAFT TYPES (ICAO designators)
 * Mapping kode pesawat → jenis & nama lengkap
 */
export const MILITARY_AIRCRAFT_TYPES = {
  // ── Fighters ──
  F15:  { type: 'fighter', name: 'F-15 Eagle', icon: '🔴' },
  F16:  { type: 'fighter', name: 'F-16 Fighting Falcon', icon: '🔴' },
  F18:  { type: 'fighter', name: 'F/A-18 Hornet', icon: '🔴' },
  F22:  { type: 'fighter', name: 'F-22 Raptor', icon: '🔴' },
  F35:  { type: 'fighter', name: 'F-35 Lightning II', icon: '🔴' },
  SU27: { type: 'fighter', name: 'Su-27 Flanker', icon: '🔴' },
  SU30: { type: 'fighter', name: 'Su-30 Flanker', icon: '🔴' },
  SU35: { type: 'fighter', name: 'Su-35 Flanker-E', icon: '🔴' },
  MIG29:{ type: 'fighter', name: 'MiG-29 Fulcrum', icon: '🔴' },
  MIG31:{ type: 'fighter', name: 'MiG-31 Foxhound', icon: '🔴' },
  EUFI: { type: 'fighter', name: 'Eurofighter Typhoon', icon: '🔴' },
  RFAL: { type: 'fighter', name: 'Dassault Rafale', icon: '🔴' },
  J10:  { type: 'fighter', name: 'J-10 Vigorous Dragon', icon: '🔴' },
  J20:  { type: 'fighter', name: 'J-20 Mighty Dragon', icon: '🔴' },

  // ── Bombers ──
  B52:  { type: 'bomber', name: 'B-52 Stratofortress', icon: '💥' },
  B1B:  { type: 'bomber', name: 'B-1B Lancer', icon: '💥' },
  B2:   { type: 'bomber', name: 'B-2 Spirit', icon: '💥' },
  TU95: { type: 'bomber', name: 'Tu-95 Bear', icon: '💥' },
  TU160:{ type: 'bomber', name: 'Tu-160 Blackjack', icon: '💥' },
  TU22: { type: 'bomber', name: 'Tu-22M Backfire', icon: '💥' },
  H6:   { type: 'bomber', name: 'H-6 Badger', icon: '💥' },

  // ── Transports ──
  C130: { type: 'transport', name: 'C-130 Hercules', icon: '📦' },
  C17:  { type: 'transport', name: 'C-17 Globemaster III', icon: '📦' },
  C5:   { type: 'transport', name: 'C-5 Galaxy', icon: '📦' },
  VC25: { type: 'vip', name: 'VC-25 Air Force One', icon: '⭐' },
  A400: { type: 'transport', name: 'A400M Atlas', icon: '📦' },
  IL76: { type: 'transport', name: 'Il-76 Candid', icon: '📦' },
  AN124:{ type: 'transport', name: 'An-124 Ruslan', icon: '📦' },
  Y20:  { type: 'transport', name: 'Y-20 Kunpeng', icon: '📦' },

  // ── Tankers ──
  KC135:{ type: 'tanker', name: 'KC-135 Stratotanker', icon: '⛽' },
  KC46: { type: 'tanker', name: 'KC-46 Pegasus', icon: '⛽' },
  KC10: { type: 'tanker', name: 'KC-10 Extender', icon: '⛽' },
  A330: { type: 'tanker', name: 'A330 MRTT', icon: '⛽' },

  // ── AWACS/AEW ──
  E3:   { type: 'awacs', name: 'E-3 Sentry AWACS', icon: '📡' },
  E7:   { type: 'awacs', name: 'E-7 Wedgetail', icon: '📡' },
  E2:   { type: 'awacs', name: 'E-2 Hawkeye', icon: '📡' },
  A50:  { type: 'awacs', name: 'A-50 Mainstay', icon: '📡' },

  // ── Reconnaissance ──
  RC135:{ type: 'recon', name: 'RC-135 Rivet Joint', icon: '🔍' },
  U2:   { type: 'recon', name: 'U-2 Dragon Lady', icon: '🔍' },
  E8:   { type: 'recon', name: 'E-8 JSTARS', icon: '🔍' },

  // ── Patrol ──
  P8:   { type: 'patrol', name: 'P-8 Poseidon', icon: '🌊' },
  P3:   { type: 'patrol', name: 'P-3 Orion', icon: '🌊' },

  // ── Drones/UAV ──
  RQ4:  { type: 'drone', name: 'RQ-4 Global Hawk', icon: '🤖' },
  MQ9:  { type: 'drone', name: 'MQ-9 Reaper', icon: '🤖' },
  MQ4C: { type: 'drone', name: 'MQ-4C Triton', icon: '🤖' },

  // ── Special Ops ──
  MC130:{ type: 'special_ops', name: 'MC-130 Combat Talon', icon: '🗡️' },
  AC130:{ type: 'special_ops', name: 'AC-130 Gunship', icon: '🗡️' },
  CV22: { type: 'special_ops', name: 'CV-22 Osprey', icon: '🗡️' },

  // ── Helicopters ──
  H60:  { type: 'helicopter', name: 'UH-60 Black Hawk', icon: '🚁' },
  CH47: { type: 'helicopter', name: 'CH-47 Chinook', icon: '🚁' },
  AH64: { type: 'helicopter', name: 'AH-64 Apache', icon: '🚁' },
  MI8:  { type: 'helicopter', name: 'Mi-8 Hip', icon: '🚁' },
  MI24: { type: 'helicopter', name: 'Mi-24 Hind', icon: '🚁' },
  MI28: { type: 'helicopter', name: 'Mi-28 Havoc', icon: '🚁' },
  KA52: { type: 'helicopter', name: 'Ka-52 Alligator', icon: '🚁' },
};

/**
 * 🚢 KNOWN NAVAL VESSELS — Database kapal perang dunia
 * Berisi kapal induk, destroyer, kapal selam dari seluruh dunia
 */
export const KNOWN_NAVAL_VESSELS = [
  // ── US Aircraft Carriers (11 aktif) ──
  { name: 'USS Gerald R. Ford', hull: 'CVN-78', country: 'USA', type: 'carrier', icon: '⚓' },
  { name: 'USS George H.W. Bush', hull: 'CVN-77', country: 'USA', type: 'carrier', icon: '⚓' },
  { name: 'USS Ronald Reagan', hull: 'CVN-76', country: 'USA', type: 'carrier', icon: '⚓' },
  { name: 'USS Harry S. Truman', hull: 'CVN-75', country: 'USA', type: 'carrier', icon: '⚓' },
  { name: 'USS John C. Stennis', hull: 'CVN-74', country: 'USA', type: 'carrier', icon: '⚓' },
  { name: 'USS George Washington', hull: 'CVN-73', country: 'USA', type: 'carrier', icon: '⚓' },
  { name: 'USS Abraham Lincoln', hull: 'CVN-72', country: 'USA', type: 'carrier', icon: '⚓' },
  { name: 'USS Theodore Roosevelt', hull: 'CVN-71', country: 'USA', type: 'carrier', icon: '⚓' },
  { name: 'USS Carl Vinson', hull: 'CVN-70', country: 'USA', type: 'carrier', icon: '⚓' },
  { name: 'USS Dwight D. Eisenhower', hull: 'CVN-69', country: 'USA', type: 'carrier', icon: '⚓' },
  { name: 'USS Nimitz', hull: 'CVN-68', country: 'USA', type: 'carrier', icon: '⚓' },
  // ── UK Carriers ──
  { name: 'HMS Queen Elizabeth', hull: 'R08', country: 'UK', type: 'carrier', icon: '⚓' },
  { name: 'HMS Prince of Wales', hull: 'R09', country: 'UK', type: 'carrier', icon: '⚓' },
  // ── Chinese Carriers ──
  { name: 'Liaoning', hull: '16', country: 'China', type: 'carrier', icon: '⚓' },
  { name: 'Shandong', hull: '17', country: 'China', type: 'carrier', icon: '⚓' },
  { name: 'Fujian', hull: '18', country: 'China', type: 'carrier', icon: '⚓' },
  // ── Russian Carrier ──
  { name: 'Admiral Kuznetsov', hull: null, country: 'Russia', type: 'carrier', icon: '⚓' },
  // ── Notable Destroyers ──
  { name: 'USS Zumwalt', hull: 'DDG-1000', country: 'USA', type: 'destroyer', icon: '🛳️' },
  { name: 'HMS Defender', hull: 'D36', country: 'UK', type: 'destroyer', icon: '🛳️' },
  { name: 'HMS Duncan', hull: 'D37', country: 'UK', type: 'destroyer', icon: '🛳️' },
  // ── Intel/Research Vessels ──
  { name: 'USNS Victorious', hull: 'T-AGOS-19', country: 'USA', type: 'research', icon: '🔬' },
  { name: 'USNS Impeccable', hull: 'T-AGOS-23', country: 'USA', type: 'research', icon: '🔬' },
  { name: 'Yuan Wang', hull: null, country: 'China', type: 'research', icon: '🔬' },
];

/**
 * 🗺️ MILITARY HOTSPOT REGIONS — Area prioritas intelligence monitoring
 * Digunakan untuk filter peta berdasarkan theater militer
 */
export const MILITARY_HOTSPOTS = [
  { name: 'INDO-PACIFIC', lat: 28.0, lon: 125.0, radius: 18, priority: 'high', desc: 'Taiwan + SCS + Korea + Japan Sea' },
  { name: 'CENTCOM', lat: 28.0, lon: 42.0, radius: 15, priority: 'high', desc: 'Persian Gulf + Aden + Med' },
  { name: 'EUCOM', lat: 52.0, lon: 28.0, radius: 15, priority: 'medium', desc: 'Black Sea + Baltic' },
  { name: 'ARCTIC', lat: 75.0, lon: 0.0, radius: 10, priority: 'low', desc: 'Arctic monitoring zone' },
];

/**
 * ⚓ USNI REGION COORDINATES — Mapping nama region → lat/lon
 * Untuk plotting posisi kapal perang berdasarkan laporan USNI Fleet Tracker
 */
export const USNI_REGION_COORDS = {
  'Philippine Sea': { lat: 18.0, lon: 130.0 },
  'South China Sea': { lat: 14.0, lon: 115.0 },
  'East China Sea': { lat: 28.0, lon: 125.0 },
  'Sea of Japan': { lat: 40.0, lon: 135.0 },
  'Arabian Sea': { lat: 18.0, lon: 63.0 },
  'Red Sea': { lat: 20.0, lon: 38.0 },
  'Mediterranean Sea': { lat: 35.0, lon: 18.0 },
  'Eastern Mediterranean': { lat: 34.5, lon: 33.0 },
  'Persian Gulf': { lat: 26.5, lon: 52.0 },
  'Gulf of Aden': { lat: 12.0, lon: 47.0 },
  'Caribbean Sea': { lat: 15.0, lon: -73.0 },
  'North Atlantic': { lat: 45.0, lon: -30.0 },
  'Pacific Ocean': { lat: 20.0, lon: -150.0 },
  'Indian Ocean': { lat: -5.0, lon: 75.0 },
  'Baltic Sea': { lat: 58.0, lon: 20.0 },
  'Black Sea': { lat: 43.5, lon: 34.0 },
  'Taiwan Strait': { lat: 24.5, lon: 119.5 },
  'Strait of Hormuz': { lat: 26.5, lon: 56.5 },
  'Suez Canal': { lat: 30.0, lon: 32.5 },
  'Bab el-Mandeb Strait': { lat: 12.5, lon: 43.5 },
};

/**
 * 🏴 MILITARY BASES — Database pangkalan militer dunia
 * Extracted dari WorldMonitor bases-expanded.ts (200+ entries)
 * NOTE: Data ini adalah subset utama. WorldMonitor punya 200+ base.
 */
export const MILITARY_BASES = [
  // ═══ US BASES — Indo-Pacific ═══
  { id: 'yokosuka', name: 'Yokosuka Naval Base', lat: 35.29, lon: 139.67, type: 'navy', operator: 'USA', country: 'Japan', desc: '7th Fleet HQ, home of USS Ronald Reagan' },
  { id: 'kadena', name: 'Kadena Air Base', lat: 26.35, lon: 127.77, type: 'air', operator: 'USA', country: 'Japan', desc: 'Largest US air base in Pacific' },
  { id: 'ramstein', name: 'Ramstein Air Base', lat: 49.44, lon: 7.60, type: 'air', operator: 'USA', country: 'Germany', desc: 'USAFE HQ, NATO airlift hub' },
  { id: 'diego_garcia', name: 'Diego Garcia', lat: -7.32, lon: 72.42, type: 'navy', operator: 'USA', country: 'BIOT', desc: 'Strategic Indian Ocean base' },
  { id: 'guam', name: 'Naval Base Guam', lat: 13.45, lon: 144.79, type: 'navy', operator: 'USA', country: 'Guam', desc: 'Western Pacific forward base' },
  { id: 'andersen', name: 'Andersen Air Force Base', lat: 13.58, lon: 144.93, type: 'air', operator: 'USA', country: 'Guam', desc: 'B-52/B-2 bomber base' },
  { id: 'pearl_harbor', name: 'Pearl Harbor', lat: 21.35, lon: -157.95, type: 'navy', operator: 'USA', country: 'USA', desc: 'Pacific Fleet HQ' },
  { id: 'camp_humphreys', name: 'Camp Humphreys', lat: 36.96, lon: 127.03, type: 'army', operator: 'USA', country: 'South Korea', desc: 'Largest overseas US base' },
  { id: 'osan', name: 'Osan Air Base', lat: 37.09, lon: 127.03, type: 'air', operator: 'USA', country: 'South Korea', desc: '7th Air Force, A-10/F-16' },

  // ═══ US BASES — Middle East / CENTCOM ═══
  { id: 'al_udeid', name: 'Al Udeid Air Base', lat: 25.12, lon: 51.31, type: 'air', operator: 'USA', country: 'Qatar', desc: 'CENTCOM Forward HQ' },
  { id: 'bahrain_nsa', name: 'NSA Bahrain', lat: 26.23, lon: 50.55, type: 'navy', operator: 'USA', country: 'Bahrain', desc: '5th Fleet HQ' },
  { id: 'djibouti', name: 'Camp Lemonnier', lat: 11.55, lon: 43.15, type: 'combined', operator: 'USA', country: 'Djibouti', desc: 'Africa operations base' },
  { id: 'incirlik', name: 'Incirlik Air Base', lat: 37.00, lon: 35.43, type: 'air', operator: 'USA', country: 'Turkey', desc: 'NATO forward base, nuclear weapons' },

  // ═══ US BASES — Europe / EUCOM ═══
  { id: 'norfolk', name: 'Naval Station Norfolk', lat: 36.95, lon: -76.30, type: 'navy', operator: 'USA', country: 'USA', desc: 'World\'s largest naval station' },
  { id: 'rota', name: 'Naval Station Rota', lat: 36.63, lon: -6.35, type: 'navy', operator: 'USA', country: 'Spain', desc: 'Aegis destroyer base' },
  { id: 'naples', name: 'NSA Naples', lat: 40.84, lon: 14.25, type: 'navy', operator: 'USA', country: 'Italy', desc: '6th Fleet HQ' },
  { id: 'souda_bay', name: 'Souda Bay', lat: 35.49, lon: 24.08, type: 'navy', operator: 'USA', country: 'Greece', desc: 'NATO naval support' },
  { id: 'aviano', name: 'Aviano Air Base', lat: 46.03, lon: 12.60, type: 'air', operator: 'USA', country: 'Italy', desc: '31st Fighter Wing, F-16' },
  { id: 'lakenheath', name: 'RAF Lakenheath', lat: 52.41, lon: 0.56, type: 'air', operator: 'USA', country: 'UK', desc: 'F-35A, F-15E Strike Eagles' },
  { id: 'mildenhall', name: 'RAF Mildenhall', lat: 52.36, lon: 0.49, type: 'air', operator: 'USA', country: 'UK', desc: 'KC-135 tankers, special ops' },
  { id: 'spangdahlem', name: 'Spangdahlem Air Base', lat: 49.97, lon: 6.69, type: 'air', operator: 'USA', country: 'Germany', desc: '52nd Fighter Wing' },
  { id: 'grafenwoehr', name: 'Grafenwoehr Training Area', lat: 49.69, lon: 11.94, type: 'army', operator: 'USA', country: 'Germany', desc: 'Largest US Army training in Europe' },

  // ═══ US BASES — Americas ═══
  { id: 'san_diego', name: 'Naval Base San Diego', lat: 32.68, lon: -117.15, type: 'navy', operator: 'USA', country: 'USA', desc: 'Pacific Fleet ships' },
  { id: 'eglin', name: 'Eglin Air Force Base', lat: 30.48, lon: -86.53, type: 'air', operator: 'USA', country: 'USA', desc: 'Weapons testing, F-35' },
  { id: 'nellis', name: 'Nellis Air Force Base', lat: 36.24, lon: -115.03, type: 'air', operator: 'USA', country: 'USA', desc: 'Red Flag exercises' },
  { id: 'fort_bragg', name: 'Fort Liberty (Bragg)', lat: 35.14, lon: -79.00, type: 'army', operator: 'USA', country: 'USA', desc: 'Airborne + Special Ops HQ' },

  // ═══ NATO BASES ═══
  { id: 'faslane', name: 'HMNB Clyde (Faslane)', lat: 56.07, lon: -4.82, type: 'navy', operator: 'UK', country: 'UK', desc: 'Trident submarine base' },
  { id: 'portsmouth', name: 'HMNB Portsmouth', lat: 50.80, lon: -1.11, type: 'navy', operator: 'UK', country: 'UK', desc: 'HMS Queen Elizabeth home port' },
  { id: 'coningsby', name: 'RAF Coningsby', lat: 53.09, lon: -0.17, type: 'air', operator: 'UK', country: 'UK', desc: 'Typhoon QRA North' },
  { id: 'lossiemouth', name: 'RAF Lossiemouth', lat: 57.72, lon: -3.34, type: 'air', operator: 'UK', country: 'UK', desc: 'Typhoon/P-8 Poseidon' },
  { id: 'istres', name: 'BA 125 Istres', lat: 43.52, lon: 4.92, type: 'air', operator: 'France', country: 'France', desc: 'Rafale nuclear strike' },
  { id: 'toulon', name: 'Toulon Naval Base', lat: 43.12, lon: 5.93, type: 'navy', operator: 'France', country: 'France', desc: 'Charles de Gaulle home port' },
  { id: 'norvenich', name: 'Fliegerhorst Nörvenich', lat: 50.83, lon: 6.66, type: 'air', operator: 'Germany', country: 'Germany', desc: 'Eurofighter Typhoon' },
  { id: 'keflavik', name: 'Keflavik Air Base', lat: 63.98, lon: -22.61, type: 'air', operator: 'NATO', country: 'Iceland', desc: 'NATO North Atlantic patrol' },

  // ═══ RUSSIAN BASES ═══
  { id: 'kaliningrad', name: 'Kaliningrad Oblast', lat: 54.72, lon: 20.50, type: 'combined', operator: 'Russia', country: 'Russia', desc: 'Baltic Fleet HQ, Iskander missiles' },
  { id: 'sevastopol', name: 'Sevastopol Naval Base', lat: 44.62, lon: 33.53, type: 'navy', operator: 'Russia', country: 'Russia', desc: 'Black Sea Fleet HQ' },
  { id: 'tartus', name: 'Tartus Naval Facility', lat: 34.89, lon: 35.89, type: 'navy', operator: 'Russia', country: 'Syria', desc: 'Only Russian Mediterranean base' },
  { id: 'hmeimim', name: 'Khmeimim Air Base', lat: 35.41, lon: 35.95, type: 'air', operator: 'Russia', country: 'Syria', desc: 'Su-35/Su-34 forward operations' },
  { id: 'vladivostok', name: 'Vladivostok', lat: 43.12, lon: 131.87, type: 'navy', operator: 'Russia', country: 'Russia', desc: 'Pacific Fleet HQ' },
  { id: 'murmansk', name: 'Severomorsk', lat: 69.07, lon: 33.42, type: 'navy', operator: 'Russia', country: 'Russia', desc: 'Northern Fleet HQ, submarine base' },
  { id: 'engels', name: 'Engels Air Base', lat: 51.48, lon: 46.20, type: 'air', operator: 'Russia', country: 'Russia', desc: 'Tu-160/Tu-95 strategic bombers' },

  // ═══ CHINESE BASES ═══
  { id: 'hainan', name: 'Yulin Naval Base', lat: 18.22, lon: 109.55, type: 'navy', operator: 'China', country: 'China', desc: 'SSBN submarine base, South Sea Fleet' },
  { id: 'woody_island', name: 'Woody Island', lat: 16.84, lon: 112.34, type: 'combined', operator: 'China', country: 'China', desc: 'Paracel Islands military outpost' },
  { id: 'fiery_cross', name: 'Fiery Cross Reef', lat: 9.55, lon: 112.89, type: 'combined', operator: 'China', country: 'China', desc: 'Artificial island with runway/SAMs' },
  { id: 'mischief_reef', name: 'Mischief Reef', lat: 9.90, lon: 115.53, type: 'combined', operator: 'China', country: 'China', desc: 'Artificial island base, Spratly' },
  { id: 'djibouti_pla', name: 'PLA Support Base Djibouti', lat: 11.59, lon: 43.06, type: 'navy', operator: 'China', country: 'Djibouti', desc: 'China\'s first overseas base' },
  { id: 'zhanjiang', name: 'Zhanjiang Naval Base', lat: 21.27, lon: 110.40, type: 'navy', operator: 'China', country: 'China', desc: 'South Sea Fleet HQ' },
  { id: 'qingdao', name: 'Qingdao Naval Base', lat: 36.07, lon: 120.38, type: 'navy', operator: 'China', country: 'China', desc: 'North Sea Fleet HQ' },

  // ═══ OTHER NOTABLE BASES ═══
  { id: 'changi', name: 'Changi Naval Base', lat: 1.32, lon: 103.98, type: 'navy', operator: 'Singapore', country: 'Singapore', desc: 'Strategic Malacca Strait base' },
  { id: 'port_blair', name: 'INS Jarawa', lat: 11.66, lon: 92.73, type: 'navy', operator: 'India', country: 'India', desc: 'Andaman & Nicobar Command' },
  { id: 'visakhapatnam', name: 'INS Circars', lat: 17.69, lon: 83.30, type: 'navy', operator: 'India', country: 'India', desc: 'Eastern Naval Command' },
  { id: 'king_abdulaziz', name: 'King Abdulaziz Naval Base', lat: 21.44, lon: 39.14, type: 'navy', operator: 'Saudi Arabia', country: 'Saudi Arabia', desc: 'Royal Saudi Navy Western Fleet' },
  { id: 'bandar_abbas', name: 'Bandar Abbas', lat: 27.18, lon: 56.28, type: 'navy', operator: 'Iran', country: 'Iran', desc: 'IRGCN main base, Strait of Hormuz' },
];

/**
 * 🎨 LAYER STYLING — Warna dan ikon per tipe layer
 * Digunakan di map marker dan legend
 */
export const LAYER_COLORS = {
  // Tipe base militer
  base_air: '#3b82f6',     // Biru — pangkalan udara
  base_navy: '#06b6d4',    // Cyan — pangkalan angkatan laut
  base_army: '#10b981',    // Hijau — pangkalan darat
  base_combined: '#8b5cf6',// Ungu — pangkalan gabungan

  // Operator/negara
  usa: '#3b82f6',
  uk: '#06b6d4',
  nato: '#6366f1',
  russia: '#ef4444',
  china: '#f59e0b',
  iran: '#f97316',
  other: '#6b7280',

  // Tipe aircraft
  fighter: '#ef4444',
  bomber: '#dc2626',
  transport: '#3b82f6',
  tanker: '#f59e0b',
  awacs: '#8b5cf6',
  recon: '#06b6d4',
  drone: '#10b981',
  patrol: '#0ea5e9',
  helicopter: '#f97316',
  special_ops: '#dc2626',
  vip: '#eab308',

  // Infrastructure
  pipeline_oil: '#1f2937',
  pipeline_gas: '#3b82f6',
  cable: '#06b6d4',
  nuclear: '#f59e0b',
  conflict_zone: '#ef4444',
};

/**
 * 🎯 AIRCRAFT TYPE ICONS — untuk marker di peta
 */
export const AIRCRAFT_ICONS = {
  fighter: '✈️',
  bomber: '💥',
  transport: '📦',
  tanker: '⛽',
  awacs: '📡',
  recon: '🔍',
  drone: '🤖',
  patrol: '🌊',
  helicopter: '🚁',
  special_ops: '🗡️',
  vip: '⭐',
};

/**
 * 🏗️ BASE TYPE ICONS — untuk marker pangkalan
 */
export const BASE_ICONS = {
  air: '🛩️',
  navy: '⚓',
  army: '🪖',
  combined: '🏴',
};
