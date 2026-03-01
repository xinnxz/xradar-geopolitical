// ========================================
// Conflict / Map Data Service
// Mock data zona konflik dan event geopolitik
// ========================================

/**
 * Get mock conflict events (simulate ACLED data)
 * Data berisi lokasi, tipe, dan intensitas konflik
 */
export function getMockConflictEvents() {
  return [
    // Middle East
    { id: 1, lat: 33.3, lng: 44.4, city: 'Baghdad', country: 'Iraq', type: 'Battle', fatalities: 12, date: '2026-02-28', description: 'Armed clashes between militia factions in northern districts' },
    { id: 2, lat: 36.2, lng: 37.1, city: 'Aleppo', country: 'Syria', type: 'Shelling', fatalities: 8, date: '2026-02-27', description: 'Artillery exchanges in contested areas' },
    { id: 3, lat: 15.35, lng: 44.21, city: "Sana'a", country: 'Yemen', type: 'Airstrike', fatalities: 15, date: '2026-02-28', description: 'Coalition airstrikes targeting military installations' },
    { id: 4, lat: 31.77, lng: 35.23, city: 'Jerusalem', country: 'Israel/Palestine', type: 'Protest', fatalities: 0, date: '2026-03-01', description: 'Mass protests in Old City' },
    { id: 5, lat: 32.08, lng: 34.78, city: 'Tel Aviv', country: 'Israel', type: 'Protest', fatalities: 0, date: '2026-03-01', description: 'Anti-war demonstrations in city center' },

    // Eastern Europe
    { id: 6, lat: 48.46, lng: 35.04, city: 'Dnipro', country: 'Ukraine', type: 'Shelling', fatalities: 5, date: '2026-03-01', description: 'Missile strike on infrastructure' },
    { id: 7, lat: 47.1, lng: 37.6, city: 'Mariupol', country: 'Ukraine', type: 'Battle', fatalities: 20, date: '2026-02-28', description: 'Ongoing frontline clashes' },
    { id: 8, lat: 50.45, lng: 30.52, city: 'Kyiv', country: 'Ukraine', type: 'Drone Attack', fatalities: 3, date: '2026-03-01', description: 'Drone strikes on city outskirts' },
    { id: 9, lat: 49.83, lng: 36.25, city: 'Kharkiv', country: 'Ukraine', type: 'Shelling', fatalities: 7, date: '2026-02-27', description: 'Missile attack on residential area' },

    // Africa
    { id: 10, lat: 15.5, lng: 32.56, city: 'Khartoum', country: 'Sudan', type: 'Battle', fatalities: 30, date: '2026-02-26', description: 'Intense urban fighting between RSF and SAF' },
    { id: 11, lat: 4.05, lng: 9.7, city: 'Douala', country: 'Cameroon', type: 'Protest', fatalities: 2, date: '2026-02-25', description: 'Civil unrest and police response' },
    { id: 12, lat: 8.98, lng: -13.23, city: 'Freetown', country: 'Sierra Leone', type: 'Riot', fatalities: 1, date: '2026-02-24', description: 'Economic protests escalate' },

    // Asia
    { id: 13, lat: 21.03, lng: 96.08, city: 'Mandalay', country: 'Myanmar', type: 'Battle', fatalities: 10, date: '2026-02-28', description: 'Resistance forces engage military junta' },
    { id: 14, lat: 34.52, lng: 69.17, city: 'Kabul', country: 'Afghanistan', type: 'Explosion', fatalities: 6, date: '2026-02-27', description: 'IED explosion near government building' },
  ];
}

/**
 * Get conflict zones as GeoJSON-like polygons
 * Simplified rectangles for zones of active conflict
 */
export function getConflictZones() {
  return [
    {
      id: 'ukraine',
      name: 'Eastern Ukraine Conflict Zone',
      color: '#ef444480',
      intensity: 'high',
      bounds: [[46.5, 33.0], [50.5, 40.0]],
    },
    {
      id: 'syria',
      name: 'Syrian Civil War Zone',
      color: '#ef444460',
      intensity: 'high',
      bounds: [[33.0, 35.5], [37.0, 42.5]],
    },
    {
      id: 'yemen',
      name: 'Yemen Conflict Zone',
      color: '#f9731680',
      intensity: 'moderate',
      bounds: [[12.5, 42.5], [18.0, 54.0]],
    },
    {
      id: 'sudan',
      name: 'Sudan Crisis Zone',
      color: '#f9731660',
      intensity: 'high',
      bounds: [[10.0, 25.0], [20.0, 37.0]],
    },
    {
      id: 'myanmar',
      name: 'Myanmar Civil Conflict',
      color: '#f59e0b50',
      intensity: 'moderate',
      bounds: [[16.0, 94.0], [24.0, 100.0]],
    },
  ];
}

/**
 * Get flight restriction zones (simplified mock)
 */
export function getFlightRestrictions() {
  return [
    {
      id: 'ukr_east',
      name: 'Eastern Ukraine Airspace Closure',
      type: 'CLOSED',
      color: '#ef444430',
      borderColor: '#ef4444',
      bounds: [[46.0, 32.0], [51.0, 41.0]],
    },
    {
      id: 'syria_all',
      name: 'Syrian Airspace Restriction',
      type: 'RESTRICTED',
      color: '#f5720830',
      borderColor: '#f97316',
      bounds: [[32.5, 35.0], [37.5, 42.5]],
    },
    {
      id: 'yemen_all',
      name: 'Yemen Airspace Warning',
      type: 'WARNING',
      color: '#f59e0b20',
      borderColor: '#f59e0b',
      bounds: [[12.0, 42.0], [18.5, 54.5]],
    },
    {
      id: 'red_sea',
      name: 'Red Sea / Bab al-Mandab',
      type: 'WARNING',
      color: '#f59e0b20',
      borderColor: '#f59e0b',
      bounds: [[11.5, 40.5], [15.5, 44.5]],
    },
  ];
}

/**
 * Get country info data for popups
 */
export function getCountryInfo() {
  return {
    Ukraine: { population: '44M', gdp: '$200B', status: 'Active Conflict', sanctions: 'Sanctioned (Russia)', refugees: '6.5M' },
    Syria: { population: '22M', gdp: '$12B', status: 'Civil War', sanctions: 'Multiple', refugees: '5.6M' },
    Yemen: { population: '33M', gdp: '$22B', status: 'Civil War', sanctions: 'Partial', refugees: '4.5M' },
    Sudan: { population: '47M', gdp: '$35B', status: 'Civil War', sanctions: 'Multiple', refugees: '1.5M' },
    Myanmar: { population: '55M', gdp: '$65B', status: 'Military Coup', sanctions: 'Targeted', refugees: '1.2M' },
    Iraq: { population: '42M', gdp: '$270B', status: 'Post-Conflict', sanctions: 'Limited', refugees: '250K' },
    Afghanistan: { population: '40M', gdp: '$14B', status: 'Taliban Rule', sanctions: 'Comprehensive', refugees: '2.6M' },
  };
}
