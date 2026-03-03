import { useMemo, useState, useCallback, useEffect } from 'react';
import {
    MapContainer, TileLayer, Rectangle, CircleMarker, Popup,
    Tooltip as MapTooltip, Polyline, Marker, Circle
} from 'react-leaflet';
import {
    Layers, Crosshair, Plane, MapPin, RefreshCw, Wifi,
    Shield, Anchor, Globe, Skull,
    ChevronDown, ChevronRight, Eye, EyeOff
} from 'lucide-react';
import { fetchConflictEvents, buildConflictZones, getConflictZones } from '../../services/conflictService';
import { MAP_CONFIG, REFRESH_INTERVALS } from '../../utils/constants';
import { useAutoRefresh } from '../../hooks/useAutoRefresh';
import { MILITARY_BASES } from '../../data/militaryData';
import { EXPANDED_BASES } from '../../data/expandedBases';
import { PORTS } from '../../data/portsData';
import { fetchEarthquakes } from '../../services/earthquakeService';
import { fetchWildfires } from '../../services/wildfireService';
import {
    NUCLEAR_FACILITIES, PIPELINES, UNDERSEA_CABLES, CONFLICT_ZONES,
    CHOKEPOINTS, FLIGHT_RESTRICTIONS
} from '../../data/infrastructureData';
import {
    SPACEPORTS, AI_DATACENTERS, MILITARY_FLIGHT_ROUTES,
    INTEL_HOTSPOTS, ACTIVE_VOLCANOES
} from '../../data/extendedGeoData';
import {
    RECENT_STRIKES, AIR_DEFENSE_SYSTEMS, FRONTLINES,
    NAVAL_BLOCKADES, REFUGEE_FLOWS, DRONE_ZONES,
    HUMANITARIAN_CORRIDORS, CYBER_ATTACKS, DEPLOYED_WEAPONS
} from '../../data/warEventsData';
import {
    getBaseIcon, getNuclearIcon, getChokepointIcon,
    getSpaceportIcon, getDatacenterIcon, getIntelHotspotIcon,
    getVolcanoIcon, getEventIcon,
    getStrikeIcon, getAirDefenseIcon, getDroneZoneIcon,
    getWeaponIcon, getCyberIcon, getPortIcon,
    getEarthquakeIcon, getWildfireIcon
} from './mapIcons';
import DefconBadge from './DefconBadge';
import AlertBanner from './AlertBanner';
import 'leaflet/dist/leaflet.css';
import './ConflictMap.css';

// ─── Popup Components ───────────────────────────────────────────────

function EventPopup({ event }) {
    return (
        <div className="map-popup">
            <h4 className="map-popup__title">{event.location || event.country}</h4>
            <div className="map-popup__badges">
                <span className="badge badge-red">{event.eventType || event.type}</span>
                {event.fatalities > 0 && (
                    <span className="badge badge-red">☠️ {event.fatalities} fatalities</span>
                )}
            </div>
            <p className="map-popup__desc">{event.title}</p>
            {event.actor1 && <p className="map-popup__actor">Actor: {event.actor1}</p>}
            <span className="map-popup__date">{event.date} • {event.source}</span>
        </div>
    );
}

function BasePopup({ base }) {
    const typeEmoji = { air: '🛩️', navy: '⚓', army: '🪖', combined: '🏴', intel: '📡', space: '🚀' };
    const statusColor = base.status === 'controversial' ? 'gold' : base.status === 'planned' ? 'purple' : 'green';
    return (
        <div className="map-popup">
            <h4 className="map-popup__title">{typeEmoji[base.type] || '🏴'} {base.name}</h4>
            <div className="map-popup__badges">
                <span className={`badge badge-${base.operator === 'Russia' ? 'red' : base.operator === 'China' ? 'gold' : base.operator === 'Iran' ? 'red' : 'blue'}`}>
                    {base.operator}
                </span>
                <span className="badge badge-gray">{base.type.toUpperCase()}</span>
                <span className="badge badge-gray">{base.country}</span>
                {base.status && <span className={`badge badge-${statusColor}`}>{base.status.toUpperCase()}</span>}
            </div>
            <p className="map-popup__desc">{base.desc}</p>
        </div>
    );
}

function NuclearPopup({ site }) {
    return (
        <div className="map-popup">
            <h4 className="map-popup__title">☢️ {site.name}</h4>
            <div className="map-popup__badges">
                <span className={`badge ${site.type === 'weapons' || site.type === 'enrichment' ? 'badge-red' : 'badge-gold'}`}>
                    {site.type.toUpperCase()}
                </span>
                <span className="badge badge-gray">{site.country}</span>
            </div>
            <p className="map-popup__desc">{site.desc}</p>
        </div>
    );
}

function ChokepointPopup({ cp }) {
    return (
        <div className="map-popup">
            <h4 className="map-popup__title">🚢 {cp.name}</h4>
            <div className="map-popup__badges">
                <span className={`badge badge-${cp.risk === 'critical' ? 'red' : cp.risk === 'high' ? 'gold' : 'blue'}`}>
                    {cp.risk.toUpperCase()}
                </span>
            </div>
            <p className="map-popup__desc">{cp.desc}</p>
            <span className="map-popup__date">Traffic: {cp.traffic}</span>
        </div>
    );
}

function GenericPopup({ icon, title, badges = [], desc, footer }) {
    return (
        <div className="map-popup">
            <h4 className="map-popup__title">{icon} {title}</h4>
            {badges.length > 0 && (
                <div className="map-popup__badges">
                    {badges.map((b, i) => <span key={i} className={`badge badge-${b.color || 'gray'}`}>{b.text}</span>)}
                </div>
            )}
            {desc && <p className="map-popup__desc">{desc}</p>}
            {footer && <span className="map-popup__date">{footer}</span>}
        </div>
    );
}

// ─── Layer Control Components ───────────────────────────────────────

function LayerGroup({ title, icon, children, defaultOpen = false }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="layer-group">
            <button className="layer-group__title" onClick={() => setOpen(!open)}>
                {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                {icon}
                <span>{title}</span>
            </button>
            {open && <div className="layer-group__items">{children}</div>}
        </div>
    );
}

function LayerToggle({ label, icon, count, checked, onChange }) {
    return (
        <label className="map-control">
            <input type="checkbox" checked={checked} onChange={onChange} />
            {typeof icon === 'string' ? (
                <span style={{ fontSize: 14 }}>{icon}</span>
            ) : (
                icon
            )}
            <span>{label}{count !== undefined ? ` (${count})` : ''}</span>
            {checked ? <Eye size={12} className="layer-eye" /> : <EyeOff size={12} className="layer-eye off" />}
        </label>
    );
}

// ─── Legend ─────────────────────────────────────────────────────

function LegendItem({ svg, color, label }) {
    return (
        <div className="map-legend__item">
            <span
                className="map-legend__icon"
                style={{ color, width: 14, height: 14, display: 'inline-flex' }}
                dangerouslySetInnerHTML={{ __html: svg }}
            />
            <span>{label}</span>
        </div>
    );
}

const LEG = {
    dot: '<svg viewBox="0 0 12 12" width="12" height="12"><circle cx="6" cy="6" r="5" fill="currentColor"/></svg>',
    base: '<svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>',
    nuclear: '<svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><circle cx="12" cy="12" r="10"/></svg>',
    ship: '<svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.65 2.62.99 4 .99h2v-2h-2z"/></svg>',
    line: '<svg viewBox="0 0 20 6" width="16" height="6"><line x1="0" y1="3" x2="20" y2="3" stroke="currentColor" stroke-width="3"/></svg>',
    dash: '<svg viewBox="0 0 20 6" width="16" height="6"><line x1="0" y1="3" x2="20" y2="3" stroke="currentColor" stroke-width="2" stroke-dasharray="4 3"/></svg>',
    arrow: '<svg viewBox="0 0 20 8" width="16" height="8"><line x1="0" y1="4" x2="16" y2="4" stroke="currentColor" stroke-width="2"/><polygon points="16,0 20,4 16,8" fill="currentColor"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>',
    rocket: '<svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M9.19 6.35c-2.04 2.29-3.44 5.58-3.57 5.89L2 10.69l4.05-4.05c.47-.47 1.15-.68 1.81-.55l1.33.26z"/></svg>',
    server: '<svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2z"/></svg>',
    circle: '<svg viewBox="0 0 16 16" width="12" height="12"><circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="4 2"/></svg>',
};

// ─── Main Component ─────────────────────────────────────────────────

export default function ConflictMap() {
    // Default layer state
    const DEFAULT_LAYERS = {
        // War & Combat
        strikes: true,
        frontlines: true,
        airDefense: true,
        droneZones: false,
        weapons: false,
        navalBlockades: true,
        cyberAttacks: false,
        // Humanitarian
        refugees: true,
        humanitarian: true,
        // Conflict & Events
        events: true,
        conflictZones: true,
        notams: false,
        intelHotspots: true,
        // Military
        militaryBases: true,
        nuclear: true,
        flightRoutes: true,
        // Infrastructure
        pipelines: true,
        cables: true,
        chokepoints: true,
        ports: false,
        // Science & Hazards
        earthquakes: true,
        wildfires: false,
        spaceports: false,
        datacenters: false,
        volcanoes: false,
    };

    // localStorage persistence for layer state
    const [layers, setLayers] = useState(() => {
        try {
            const saved = localStorage.getItem('gw-map-layers');
            return saved ? { ...DEFAULT_LAYERS, ...JSON.parse(saved) } : DEFAULT_LAYERS;
        } catch { return DEFAULT_LAYERS; }
    });

    const toggleLayer = (key) => setLayers(prev => {
        const next = { ...prev, [key]: !prev[key] };
        try { localStorage.setItem('gw-map-layers', JSON.stringify(next)); } catch { }
        return next;
    });

    const fetchFn = useCallback(() => fetchConflictEvents(90), []);
    const { data: events, loading, lastUpdated, refresh } = useAutoRefresh(fetchFn, REFRESH_INTERVALS.RISK);

    const eventList = events || [];
    const zones = useMemo(() => eventList.length > 0 ? buildConflictZones(eventList) : getConflictZones(), [eventList]);
    const isLive = eventList.length > 0 && eventList[0]?.source !== 'Mock';

    // Merge original 53 curated bases + 157 expanded WorldMonitor bases
    const allBases = useMemo(() => {
        const existingIds = new Set(MILITARY_BASES.map(b => b.id));
        const newBases = EXPANDED_BASES.filter(b => !existingIds.has(b.id));
        return [...MILITARY_BASES, ...newBases];
    }, []);

    const activeLayerCount = Object.values(layers).filter(Boolean).length;

    // Fetch earthquake and wildfire data
    const [earthquakes, setEarthquakes] = useState([]);
    const [wildfires, setWildfires] = useState([]);

    useEffect(() => {
        fetchEarthquakes().then(setEarthquakes).catch(() => { });
        fetchWildfires().then(setWildfires).catch(() => { });
    }, []);

    return (
        <div className="conflict-map fade-in">
            <AlertBanner />

            {/* Status bar */}
            <div className="market-panel__status">
                <div className="market-panel__status-left">
                    {isLive ? (
                        <span className="badge badge-green"><Wifi size={10} /> ACLED Live</span>
                    ) : (
                        <span className="badge badge-gold">Mock Data</span>
                    )}
                    <span className="badge badge-blue">{eventList.length} events</span>
                    <span className="badge badge-purple">{activeLayerCount} layers</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <DefconBadge events={eventList} conflictCount={CONFLICT_ZONES.length} />
                    <button className="market-panel__refresh" onClick={refresh}>
                        <RefreshCw size={14} className={loading ? 'spinning' : ''} />
                        {lastUpdated && (
                            <span>Updated {lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                        )}
                    </button>
                </div>
            </div>

            {/* ════════════════ LAYER CONTROLS ════════════════ */}
            <div className="map-controls">
                <h3 className="map-controls__title"><Layers size={16} /> Intelligence Layers</h3>

                {/* ── WAR & COMBAT ── */}
                <LayerGroup title="War & Combat" icon={<Skull size={14} style={{ color: '#ef4444' }} />} defaultOpen={true}>
                    <LayerToggle label="Strike Trajectories" icon="💣" count={RECENT_STRIKES.length} checked={layers.strikes} onChange={() => toggleLayer('strikes')} />
                    <LayerToggle label="Active Frontlines" icon="⚔️" count={FRONTLINES.length} checked={layers.frontlines} onChange={() => toggleLayer('frontlines')} />
                    <LayerToggle label="Air Defense Systems" icon="🛡️" count={AIR_DEFENSE_SYSTEMS.length} checked={layers.airDefense} onChange={() => toggleLayer('airDefense')} />
                    <LayerToggle label="Naval Blockades" icon="🚫" count={NAVAL_BLOCKADES.length} checked={layers.navalBlockades} onChange={() => toggleLayer('navalBlockades')} />
                    <LayerToggle label="Drone Zones" icon="🤖" count={DRONE_ZONES.length} checked={layers.droneZones} onChange={() => toggleLayer('droneZones')} />
                    <LayerToggle label="Weapon Systems" icon="🚀" count={DEPLOYED_WEAPONS.length} checked={layers.weapons} onChange={() => toggleLayer('weapons')} />
                    <LayerToggle label="Cyber Attacks" icon="💻" count={CYBER_ATTACKS.length} checked={layers.cyberAttacks} onChange={() => toggleLayer('cyberAttacks')} />
                </LayerGroup>

                {/* ── HUMANITARIAN ── */}
                <LayerGroup title="Humanitarian" icon="🏥" defaultOpen={true}>
                    <LayerToggle label="Refugee Flows" icon="👥" count={REFUGEE_FLOWS.length} checked={layers.refugees} onChange={() => toggleLayer('refugees')} />
                    <LayerToggle label="Aid Corridors" icon="🟢" count={HUMANITARIAN_CORRIDORS.length} checked={layers.humanitarian} onChange={() => toggleLayer('humanitarian')} />
                </LayerGroup>

                {/* ── CONFLICT & EVENTS ── */}
                <LayerGroup title="Conflict & Events" icon={<Crosshair size={14} style={{ color: '#ef4444' }} />} defaultOpen={true}>
                    <LayerToggle label="ACLED Events" icon="💥" count={eventList.length} checked={layers.events} onChange={() => toggleLayer('events')} />
                    <LayerToggle label="Conflict Zones" icon="🔥" count={CONFLICT_ZONES.length} checked={layers.conflictZones} onChange={() => toggleLayer('conflictZones')} />
                    <LayerToggle label="Intel Hotspots" icon="📍" count={INTEL_HOTSPOTS.length} checked={layers.intelHotspots} onChange={() => toggleLayer('intelHotspots')} />
                    <LayerToggle label="NOTAMs" icon="✈️" count={FLIGHT_RESTRICTIONS.length} checked={layers.notams} onChange={() => toggleLayer('notams')} />
                </LayerGroup>

                {/* ── MILITARY ── */}
                <LayerGroup title="Military" icon={<Shield size={14} style={{ color: '#3b82f6' }} />}>
                    <LayerToggle label="Military Bases" icon="🏴" count={allBases.length} checked={layers.militaryBases} onChange={() => toggleLayer('militaryBases')} />
                    <LayerToggle label="Nuclear Sites" icon="☢️" count={NUCLEAR_FACILITIES.length} checked={layers.nuclear} onChange={() => toggleLayer('nuclear')} />
                    <LayerToggle label="Flight Routes" icon="✈️" count={MILITARY_FLIGHT_ROUTES.length} checked={layers.flightRoutes} onChange={() => toggleLayer('flightRoutes')} />
                </LayerGroup>

                {/* ── INFRASTRUCTURE ── */}
                <LayerGroup title="Infrastructure" icon={<Globe size={14} style={{ color: '#06b6d4' }} />}>
                    <LayerToggle label="Pipelines" icon="🛢️" count={PIPELINES.length} checked={layers.pipelines} onChange={() => toggleLayer('pipelines')} />
                    <LayerToggle label="Undersea Cables" icon="🌐" count={UNDERSEA_CABLES.length} checked={layers.cables} onChange={() => toggleLayer('cables')} />
                    <LayerToggle label="Chokepoints" icon={<Anchor size={14} style={{ color: '#06b6d4' }} />} count={CHOKEPOINTS.length} checked={layers.chokepoints} onChange={() => toggleLayer('chokepoints')} />
                    <LayerToggle label="World Ports" icon="🚢" count={PORTS.length} checked={layers.ports} onChange={() => toggleLayer('ports')} />
                </LayerGroup>

                {/* ── SCIENCE & TECH ── */}
                <LayerGroup title="Science & Tech" icon="🔬">
                    <LayerToggle label="Spaceports" icon="🚀" count={SPACEPORTS.length} checked={layers.spaceports} onChange={() => toggleLayer('spaceports')} />
                    <LayerToggle label="AI Datacenters" icon="🖥️" count={AI_DATACENTERS.length} checked={layers.datacenters} onChange={() => toggleLayer('datacenters')} />
                    <LayerToggle label="Volcanoes" icon="🌋" count={ACTIVE_VOLCANOES.length} checked={layers.volcanoes} onChange={() => toggleLayer('volcanoes')} />
                </LayerGroup>

                {/* ── NATURAL HAZARDS ── */}
                <LayerGroup title="Natural Hazards" icon="⚠️">
                    <LayerToggle label="Earthquakes (USGS)" icon="🌍" count={earthquakes.length} checked={layers.earthquakes} onChange={() => toggleLayer('earthquakes')} />
                    <LayerToggle label="Wildfires (NASA)" icon="🔥" count={wildfires.length} checked={layers.wildfires} onChange={() => toggleLayer('wildfires')} />
                </LayerGroup>
            </div>

            {/* Dynamic Legend */}
            <div className="map-legend">
                {layers.strikes && <>
                    <LegendItem svg={LEG.arrow} color="#ef4444" label="Strike" />
                    <LegendItem svg={LEG.arrow} color="#3b82f6" label="Counter-Strike" />
                </>}
                {layers.frontlines && <LegendItem svg={LEG.line} color="#ef4444" label="Frontline" />}
                {layers.airDefense && <>
                    <LegendItem svg={LEG.circle} color="#3b82f6" label="NATO/US AD" />
                    <LegendItem svg={LEG.circle} color="#ef4444" label="Russia AD" />
                </>}
                {layers.refugees && <LegendItem svg={LEG.arrow} color="#f59e0b" label="Refugee Flow" />}
                {layers.humanitarian && <LegendItem svg={LEG.dash} color="#10b981" label="Aid Route" />}
                {layers.events && <>
                    <LegendItem svg={LEG.dot} color="#ef4444" label="Battle" />
                    <LegendItem svg={LEG.dot} color="#f97316" label="Explosion" />
                    <LegendItem svg={LEG.dot} color="#f59e0b" label="Protest" />
                </>}
                {layers.militaryBases && <>
                    <LegendItem svg={LEG.base} color="#3b82f6" label="US/NATO" />
                    <LegendItem svg={LEG.base} color="#ef4444" label="Russia" />
                    <LegendItem svg={LEG.base} color="#f59e0b" label="China" />
                </>}
                {layers.nuclear && <LegendItem svg={LEG.nuclear} color="#f59e0b" label="Nuclear" />}
                {layers.intelHotspots && <LegendItem svg={LEG.pin} color="#ef4444" label="Hotspot" />}
                {layers.chokepoints && <LegendItem svg={LEG.ship} color="#06b6d4" label="Chokepoint" />}
                {layers.navalBlockades && <LegendItem svg={LEG.dot} color="#ef4444" label="Blockade" />}
                {layers.flightRoutes && <LegendItem svg={LEG.dash} color="#6366f1" label="Patrol" />}
                {layers.spaceports && <LegendItem svg={LEG.rocket} color="#8b5cf6" label="Spaceport" />}
                {layers.datacenters && <LegendItem svg={LEG.server} color="#10b981" label="DC" />}
            </div>

            {/* ═════════════════ THE MAP ═════════════════ */}
            <div className="map-wrapper card">
                <MapContainer
                    center={MAP_CONFIG.center} zoom={MAP_CONFIG.zoom}
                    minZoom={MAP_CONFIG.minZoom} maxZoom={MAP_CONFIG.maxZoom}
                    style={{ height: '100%', width: '100%', borderRadius: 'var(--radius-lg)' }}
                    scrollWheelZoom={true}
                >
                    <TileLayer url={MAP_CONFIG.tileUrl} attribution={MAP_CONFIG.attribution} />

                    {/* ══════ WAR LAYERS ══════ */}

                    {/* ── Strike Trajectories (arrows from origin → target) ── */}
                    {layers.strikes && RECENT_STRIKES.map(strike => (
                        <Polyline key={strike.id}
                            positions={[[strike.origin.lat, strike.origin.lon], [strike.target.lat, strike.target.lon]]}
                            pathOptions={{
                                color: strike.color, weight: 3, opacity: 0.8,
                                dashArray: strike.type === 'missile' || strike.type === 'ballistic_missile' ? '12 6' : '6 3'
                            }}>
                            <Popup>
                                <GenericPopup icon="💣" title={strike.name}
                                    badges={[
                                        { text: strike.type.toUpperCase().replace('_', ' '), color: 'red' },
                                        { text: strike.severity.toUpperCase(), color: strike.severity === 'critical' ? 'red' : 'gold' },
                                    ]}
                                    desc={`${strike.desc}\n\nWeapon: ${strike.weapon}`}
                                    footer={`${strike.origin.label} → ${strike.target.label} • ${strike.date}`} />
                            </Popup>
                            <MapTooltip sticky>
                                💣 {strike.name}<br />
                                {strike.origin.label} → {strike.target.label}
                            </MapTooltip>
                        </Polyline>
                    ))}
                    {/* Strike target markers */}
                    {layers.strikes && RECENT_STRIKES.map(strike => (
                        <Marker key={`${strike.id}_tgt`}
                            position={[strike.target.lat, strike.target.lon]}
                            icon={getStrikeIcon(strike)}>
                            <MapTooltip>🎯 {strike.target.label}</MapTooltip>
                        </Marker>
                    ))}

                    {/* ── Active Frontlines ── */}
                    {layers.frontlines && FRONTLINES.map(front => (
                        <Polyline key={front.id} positions={front.coords}
                            pathOptions={{ color: front.color, weight: 4, opacity: 0.9 }}>
                            <Popup>
                                <GenericPopup icon="⚔️" title={front.name}
                                    badges={[{ text: front.intensity.toUpperCase(), color: front.intensity === 'critical' ? 'red' : 'gold' }]}
                                    desc={front.desc}
                                    footer={`${front.parties.join(' vs ')} • Since ${front.since}`} />
                            </Popup>
                            <MapTooltip sticky>⚔️ {front.name} — {front.intensity.toUpperCase()}</MapTooltip>
                        </Polyline>
                    ))}

                    {/* ── Air Defense Systems (range circles) ── */}
                    {layers.airDefense && AIR_DEFENSE_SYSTEMS.map(ad => (
                        <Circle key={ad.id}
                            center={[ad.lat, ad.lon]}
                            radius={ad.range * 1000}
                            pathOptions={{
                                color: ad.color, fillColor: ad.color,
                                fillOpacity: 0.06, weight: 1.5, dashArray: '6 4'
                            }}>
                            <Popup>
                                <GenericPopup icon="🛡️" title={ad.name}
                                    badges={[
                                        { text: ad.type.toUpperCase(), color: ad.country === 'Russia' || ad.country === 'Iran' ? 'red' : 'blue' },
                                        { text: `${ad.range}km`, color: 'purple' },
                                        { text: ad.operator, color: 'gray' },
                                    ]}
                                    desc={ad.desc}
                                    footer={ad.country} />
                            </Popup>
                            <MapTooltip>🛡️ {ad.name} — {ad.range}km range</MapTooltip>
                        </Circle>
                    ))}
                    {/* Air defense center markers */}
                    {layers.airDefense && AIR_DEFENSE_SYSTEMS.map(ad => (
                        <Marker key={`${ad.id}_mk`}
                            position={[ad.lat, ad.lon]}
                            icon={getAirDefenseIcon(ad)}>
                            <MapTooltip>🛡️ {ad.name}</MapTooltip>
                        </Marker>
                    ))}

                    {/* ── Naval Blockades ── */}
                    {layers.navalBlockades && NAVAL_BLOCKADES.map(block => (
                        <Rectangle key={block.id} bounds={block.bounds}
                            pathOptions={{
                                color: block.color, fillColor: block.color,
                                fillOpacity: 0.15, weight: 2, dashArray: '10 5'
                            }}>
                            <Popup>
                                <GenericPopup icon="🚫" title={block.name}
                                    badges={[{ text: block.severity.toUpperCase(), color: block.severity === 'active' ? 'red' : 'gold' }]}
                                    desc={block.desc}
                                    footer={`Enforced by: ${block.enforcedBy} • Impact: ${block.impact}`} />
                            </Popup>
                            <MapTooltip sticky>🚫 {block.name} — {block.severity.toUpperCase()}</MapTooltip>
                        </Rectangle>
                    ))}

                    {/* ── Drone Combat Zones ── */}
                    {layers.droneZones && DRONE_ZONES.map(dz => (
                        <Circle key={dz.id}
                            center={dz.center}
                            radius={dz.radius * 1000}
                            pathOptions={{
                                color: dz.color, fillColor: dz.color,
                                fillOpacity: 0.08, weight: 1.5, dashArray: '4 4'
                            }}>
                            <Popup>
                                <GenericPopup icon="🤖" title={dz.name}
                                    badges={[{ text: dz.severity.toUpperCase(), color: dz.severity === 'extreme' ? 'red' : 'gold' }]}
                                    desc={dz.desc} />
                            </Popup>
                            <MapTooltip>🤖 {dz.name}</MapTooltip>
                        </Circle>
                    ))}

                    {/* ── Refugee Flows (arrows) ── */}
                    {layers.refugees && REFUGEE_FLOWS.map(flow => (
                        flow.destinations.map((dest, i) => (
                            <Polyline key={`${flow.id}_${i}`}
                                positions={[[flow.origin.lat, flow.origin.lon], [dest.lat, dest.lon]]}
                                pathOptions={{ color: flow.color, weight: 2, opacity: 0.6, dashArray: '6 4' }}>
                                <MapTooltip sticky>
                                    👥 {flow.name}<br />
                                    → {dest.country}: {dest.count}
                                </MapTooltip>
                            </Polyline>
                        ))
                    ))}
                    {/* Refugee origin markers */}
                    {layers.refugees && REFUGEE_FLOWS.map(flow => (
                        <CircleMarker key={`${flow.id}_orig`}
                            center={[flow.origin.lat, flow.origin.lon]}
                            radius={10}
                            pathOptions={{ color: flow.color, fillColor: flow.color, fillOpacity: 0.6, weight: 2 }}>
                            <Popup>
                                <GenericPopup icon="👥" title={flow.name}
                                    badges={[{ text: flow.total, color: 'red' }]}
                                    desc={flow.desc} />
                            </Popup>
                        </CircleMarker>
                    ))}

                    {/* ── Humanitarian Corridors ── */}
                    {layers.humanitarian && HUMANITARIAN_CORRIDORS.map(hc => (
                        <Polyline key={hc.id} positions={hc.coords}
                            pathOptions={{
                                color: hc.color, weight: 3, opacity: 0.7,
                                dashArray: hc.status === 'restricted' ? '5 8' : hc.status === 'contested' ? '3 6' : '8 3'
                            }}>
                            <Popup>
                                <GenericPopup icon="🟢" title={hc.name}
                                    badges={[
                                        { text: hc.status.toUpperCase(), color: hc.status === 'active' ? 'green' : hc.status === 'restricted' ? 'red' : 'gold' },
                                        { text: hc.org, color: 'blue' },
                                    ]}
                                    desc={hc.desc} />
                            </Popup>
                            <MapTooltip sticky>🏥 {hc.name} — {hc.status}</MapTooltip>
                        </Polyline>
                    ))}

                    {/* ── Cyber Attacks (dotted lines) ── */}
                    {layers.cyberAttacks && CYBER_ATTACKS.map(ca => (
                        <Polyline key={ca.id}
                            positions={[[ca.origin.lat, ca.origin.lon], [ca.target.lat, ca.target.lon]]}
                            pathOptions={{ color: ca.color, weight: 1.5, opacity: 0.5, dashArray: '3 6' }}>
                            <MapTooltip sticky>
                                💻 {ca.name}<br />
                                Type: {ca.type} • {ca.severity.toUpperCase()}
                            </MapTooltip>
                        </Polyline>
                    ))}

                    {/* ── Deployed Weapons ── */}
                    {layers.weapons && DEPLOYED_WEAPONS.map(wp => (
                        <Marker key={wp.id} position={[wp.lat, wp.lon]} icon={getWeaponIcon(wp)}>
                            <Popup>
                                <GenericPopup icon="🚀" title={wp.name}
                                    badges={[
                                        { text: wp.type.toUpperCase(), color: 'red' },
                                        { text: `${wp.range}km`, color: 'purple' },
                                        { text: wp.country, color: 'gray' },
                                    ]}
                                    desc={wp.desc} />
                            </Popup>
                            <MapTooltip>🚀 {wp.name} — {wp.type}</MapTooltip>
                        </Marker>
                    ))}

                    {/* ══════ EXISTING LAYERS ══════ */}

                    {/* ── Conflict Zones ── */}
                    {layers.conflictZones && CONFLICT_ZONES.map(zone => (
                        <Rectangle key={zone.id} bounds={zone.bounds}
                            pathOptions={{ color: zone.color, fillColor: zone.color, fillOpacity: 0.12, weight: 2 }}>
                            <MapTooltip sticky>
                                <strong>🔥 {zone.name}</strong><br />
                                {zone.severity.toUpperCase()} • Since {zone.startYear}<br />
                                {zone.parties.join(' vs ')}
                            </MapTooltip>
                        </Rectangle>
                    ))}

                    {/* ── ACLED Events ── */}
                    {layers.events && eventList.map(event => (
                        <Marker key={event.id} position={[event.lat, event.lng]}
                            icon={getEventIcon(event.type)}>
                            <Popup><EventPopup event={event} /></Popup>
                        </Marker>
                    ))}

                    {/* ── NOTAMs ── */}
                    {layers.notams && FLIGHT_RESTRICTIONS.map(zone => (
                        <Rectangle key={zone.id} bounds={zone.bounds}
                            pathOptions={{ color: zone.color, fillColor: zone.color, fillOpacity: 0.06, weight: 1, dashArray: '8 4' }}>
                            <MapTooltip>✈️ {zone.name} — {zone.severity.toUpperCase()}</MapTooltip>
                        </Rectangle>
                    ))}

                    {/* ── Military Bases ── */}
                    {layers.militaryBases && allBases.map(base => (
                        <Marker key={base.id} position={[base.lat, base.lon]} icon={getBaseIcon(base)}>
                            <Popup><BasePopup base={base} /></Popup>
                            <MapTooltip>{base.name}</MapTooltip>
                        </Marker>
                    ))}

                    {/* ── Nuclear Sites ── */}
                    {layers.nuclear && NUCLEAR_FACILITIES.map(site => (
                        <Marker key={site.id} position={[site.lat, site.lon]} icon={getNuclearIcon(site)}>
                            <Popup><NuclearPopup site={site} /></Popup>
                            <MapTooltip>☢️ {site.name}</MapTooltip>
                        </Marker>
                    ))}

                    {/* ── Intel Hotspots ── */}
                    {layers.intelHotspots && INTEL_HOTSPOTS.map(hs => (
                        <Marker key={hs.id} position={[hs.lat, hs.lon]} icon={getIntelHotspotIcon(hs)}>
                            <Popup>
                                <GenericPopup icon="📍" title={hs.name}
                                    badges={[{ text: hs.severity.toUpperCase(), color: hs.severity === 'critical' ? 'red' : 'gold' }]}
                                    desc={hs.desc} />
                            </Popup>
                            <MapTooltip>📍 {hs.name} — {hs.severity}</MapTooltip>
                        </Marker>
                    ))}

                    {/* ── Pipelines ── */}
                    {layers.pipelines && PIPELINES.map(pipe => (
                        <Polyline key={pipe.id} positions={pipe.coords}
                            pathOptions={{
                                color: pipe.color, weight: 3, opacity: 0.8,
                                dashArray: pipe.status === 'proposed' ? '10 5' : pipe.status === 'sabotaged' ? '3 6' : undefined
                            }}>
                            <MapTooltip sticky>🛢️ {pipe.name} — {pipe.status.toUpperCase()}</MapTooltip>
                        </Polyline>
                    ))}

                    {/* ── Undersea Cables ── */}
                    {layers.cables && UNDERSEA_CABLES.map(cable => (
                        <Polyline key={cable.id} positions={cable.coords}
                            pathOptions={{ color: cable.color, weight: 2, opacity: 0.6, dashArray: cable.status === 'planned' ? '5 3' : undefined }}>
                            <MapTooltip sticky>🌐 {cable.name}</MapTooltip>
                        </Polyline>
                    ))}

                    {/* ── Chokepoints ── */}
                    {layers.chokepoints && CHOKEPOINTS.map(cp => (
                        <Marker key={cp.id} position={[cp.lat, cp.lon]} icon={getChokepointIcon(cp)}>
                            <Popup><ChokepointPopup cp={cp} /></Popup>
                            <MapTooltip>⚓ {cp.name}</MapTooltip>
                        </Marker>
                    ))}

                    {/* ── World Ports ── */}
                    {layers.ports && PORTS.map(port => (
                        <Marker key={`port_${port.id}`} position={[port.lat, port.lon]} icon={getPortIcon(port)}>
                            <Popup>
                                <GenericPopup icon={port.type === 'oil' ? '🛢️' : port.type === 'lng' ? '⛽' : port.type === 'naval' ? '⚓' : '🚢'}
                                    title={port.name}
                                    badges={[
                                        { text: port.type.toUpperCase(), color: port.type === 'oil' ? 'red' : port.type === 'naval' ? 'purple' : 'blue' },
                                        { text: port.country, color: 'gray' },
                                        ...(port.rank ? [{ text: `#${port.rank} World`, color: 'gold' }] : []),
                                    ]}
                                    desc={port.note} />
                            </Popup>
                            <MapTooltip>🚢 {port.name}{port.rank ? ` (#${port.rank})` : ''}</MapTooltip>
                        </Marker>
                    ))}

                    {/* ── Flight Routes ── */}
                    {layers.flightRoutes && MILITARY_FLIGHT_ROUTES.map(route => (
                        <Polyline key={route.id} positions={route.coords}
                            pathOptions={{ color: route.color, weight: 2.5, opacity: 0.7, dashArray: route.dashArray }}>
                            <MapTooltip sticky>
                                ✈️ {route.name}<br />
                                {route.aircraft} • {route.operator}
                            </MapTooltip>
                        </Polyline>
                    ))}

                    {/* ── Spaceports ── */}
                    {layers.spaceports && SPACEPORTS.map(sp => (
                        <Marker key={sp.id} position={[sp.lat, sp.lon]} icon={getSpaceportIcon()}>
                            <Popup>
                                <GenericPopup icon="🚀" title={sp.name}
                                    badges={[{ text: sp.operator, color: 'purple' }, { text: sp.country, color: 'gray' }]}
                                    desc={sp.desc} />
                            </Popup>
                            <MapTooltip>🚀 {sp.name}</MapTooltip>
                        </Marker>
                    ))}

                    {/* ── AI Datacenters ── */}
                    {layers.datacenters && AI_DATACENTERS.map(dc => (
                        <Marker key={dc.id} position={[dc.lat, dc.lon]} icon={getDatacenterIcon()}>
                            <Popup>
                                <GenericPopup icon="🖥️" title={dc.name}
                                    badges={[{ text: dc.operator, color: 'green' }, { text: dc.capacity, color: 'blue' }]}
                                    desc={dc.desc} footer={dc.country} />
                            </Popup>
                            <MapTooltip>🖥️ {dc.name}</MapTooltip>
                        </Marker>
                    ))}

                    {/* ── Volcanoes ── */}
                    {layers.volcanoes && ACTIVE_VOLCANOES.map(vol => (
                        <Marker key={vol.id} position={[vol.lat, vol.lon]} icon={getVolcanoIcon()}>
                            <Popup>
                                <GenericPopup icon="🌋" title={vol.name}
                                    badges={[{ text: vol.status.toUpperCase(), color: vol.status === 'erupting' ? 'red' : 'gold' }, { text: vol.country, color: 'gray' }]}
                                    desc={vol.desc} />
                            </Popup>
                            <MapTooltip>🌋 {vol.name}</MapTooltip>
                        </Marker>
                    ))}

                    {/* ── Earthquakes (USGS) ── */}
                    {layers.earthquakes && earthquakes.map(eq => (
                        <CircleMarker key={eq.id}
                            center={[eq.lat, eq.lon]}
                            radius={Math.max(eq.magnitude * 2.5, 4)}
                            pathOptions={{
                                color: eq.color, fillColor: eq.color,
                                fillOpacity: 0.5, weight: 1.5
                            }}>
                            <Popup>
                                <GenericPopup icon="🌍" title={eq.place}
                                    badges={[
                                        { text: `M${eq.magnitude}`, color: eq.level === 'major' || eq.level === 'strong' ? 'red' : 'gold' },
                                        { text: eq.label, color: eq.level === 'major' ? 'red' : eq.level === 'strong' ? 'red' : 'gold' },
                                        { text: `${eq.depth}km deep`, color: 'blue' },
                                        ...(eq.tsunami ? [{ text: '🌊 TSUNAMI', color: 'red' }] : []),
                                    ]}
                                    desc={eq.felt ? `Felt by ${eq.felt} people` : undefined}
                                    footer={eq.time ? new Date(eq.time).toLocaleString() : ''} />
                            </Popup>
                            <MapTooltip>🌍 M{eq.magnitude} — {eq.place}</MapTooltip>
                        </CircleMarker>
                    ))}

                    {/* ── Wildfires (NASA FIRMS) ── */}
                    {layers.wildfires && wildfires.map(fire => (
                        <CircleMarker key={fire.id}
                            center={[fire.lat, fire.lon]}
                            radius={fire.level === 'extreme' ? 10 : fire.level === 'high' ? 7 : 5}
                            pathOptions={{
                                color: fire.color, fillColor: fire.color,
                                fillOpacity: 0.6, weight: 1
                            }}>
                            <Popup>
                                <GenericPopup icon="🔥" title={`Fire Hotspot — ${fire.region}`}
                                    badges={[
                                        { text: fire.label, color: fire.level === 'extreme' ? 'red' : fire.level === 'high' ? 'red' : 'gold' },
                                        { text: fire.country, color: 'gray' },
                                        { text: `FRP: ${fire.frp} MW`, color: 'purple' },
                                        { text: fire.satellite, color: 'blue' },
                                    ]}
                                    desc={`Brightness: ${fire.brightness}K. Confidence: ${fire.confidence}%`} />
                            </Popup>
                            <MapTooltip>🔥 {fire.region} — {fire.label} ({fire.country})</MapTooltip>
                        </CircleMarker>
                    ))}

                </MapContainer>
            </div>

            {/* Stats bar */}
            <div className="map-stats">
                <div className="map-stat-item"><span className="map-stat-item__value" style={{ color: '#ef4444' }}>{RECENT_STRIKES.length}</span><span className="map-stat-item__label">Strikes</span></div>
                <div className="map-stat-item"><span className="map-stat-item__value" style={{ color: '#f97316' }}>{FRONTLINES.length}</span><span className="map-stat-item__label">Frontlines</span></div>
                <div className="map-stat-item"><span className="map-stat-item__value" style={{ color: '#3b82f6' }}>{allBases.length}</span><span className="map-stat-item__label">Bases</span></div>
                <div className="map-stat-item"><span className="map-stat-item__value" style={{ color: '#8b5cf6' }}>{PORTS.length}</span><span className="map-stat-item__label">Ports</span></div>
                <div className="map-stat-item"><span className="map-stat-item__value" style={{ color: '#f59e0b' }}>{earthquakes.length}</span><span className="map-stat-item__label">Quakes</span></div>
                <div className="map-stat-item"><span className="map-stat-item__value" style={{ color: '#ef4444' }}>{wildfires.length}</span><span className="map-stat-item__label">Fires</span></div>
                <div className="map-stat-item"><span className="map-stat-item__value" style={{ color: '#06b6d4' }}>{NUCLEAR_FACILITIES.length}</span><span className="map-stat-item__label">Nuclear</span></div>
                <div className="map-stat-item"><span className="map-stat-item__value" style={{ color: '#a855f7' }}>{DRONE_ZONES.length}</span><span className="map-stat-item__label">Drones</span></div>
            </div>
        </div>
    );
}
