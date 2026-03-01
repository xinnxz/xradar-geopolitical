import { useMemo, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Rectangle, CircleMarker, Popup, Tooltip as MapTooltip } from 'react-leaflet';
import { Layers, Crosshair, Plane, MapPin, RefreshCw, Wifi } from 'lucide-react';
import { fetchConflictEvents, buildConflictZones, getConflictZones, getFlightRestrictions } from '../../services/conflictService';
import { MAP_CONFIG, REFRESH_INTERVALS } from '../../utils/constants';
import { useAutoRefresh } from '../../hooks/useAutoRefresh';
import 'leaflet/dist/leaflet.css';
import './ConflictMap.css';

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

export default function ConflictMap() {
    const [showConflict, setShowConflict] = useState(true);
    const [showFlights, setShowFlights] = useState(true);
    const [showEvents, setShowEvents] = useState(true);

    // Fetch real data with auto-refresh
    const fetchFn = useCallback(() => fetchConflictEvents(90), []);
    const { data: events, loading, lastUpdated, refresh } = useAutoRefresh(
        fetchFn, REFRESH_INTERVALS.RISK
    );

    const eventList = events || [];
    const zones = useMemo(() => {
        return eventList.length > 0 ? buildConflictZones(eventList) : getConflictZones();
    }, [eventList]);
    const flights = useMemo(() => getFlightRestrictions(), []);

    const isLive = eventList.length > 0 && eventList[0]?.source !== 'Mock';

    const eventTypeColor = (type) => {
        const c = {
            battle: '#ef4444', explosion: '#f97316', violence: '#ef4444',
            protest: '#f59e0b', riot: '#f59e0b', strategic: '#3b82f6',
        };
        return c[type] || '#3b82f6';
    };

    return (
        <div className="conflict-map fade-in">
            {/* Status bar */}
            <div className="market-panel__status">
                <div className="market-panel__status-left">
                    {isLive ? (
                        <span className="badge badge-green"><Wifi size={10} /> ACLED: Live Data</span>
                    ) : (
                        <span className="badge badge-gold">Conflict: Mock Data (deploy for ACLED live)</span>
                    )}
                    <span className="badge badge-blue">{eventList.length} events</span>
                </div>
                <button className="market-panel__refresh" onClick={refresh}>
                    <RefreshCw size={14} className={loading ? 'spinning' : ''} />
                    {lastUpdated && (
                        <span>Updated {lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    )}
                </button>
            </div>

            {/* Controls */}
            <div className="map-controls">
                <h3 className="map-controls__title"><Layers size={16} /> Map Layers</h3>
                <label className="map-control">
                    <input type="checkbox" checked={showConflict} onChange={() => setShowConflict(!showConflict)} />
                    <Crosshair size={14} style={{ color: 'var(--accent-red)' }} />
                    <span>Conflict Zones ({zones.length})</span>
                </label>
                <label className="map-control">
                    <input type="checkbox" checked={showFlights} onChange={() => setShowFlights(!showFlights)} />
                    <Plane size={14} style={{ color: 'var(--accent-orange)' }} />
                    <span>Flight Restrictions</span>
                </label>
                <label className="map-control">
                    <input type="checkbox" checked={showEvents} onChange={() => setShowEvents(!showEvents)} />
                    <MapPin size={14} style={{ color: 'var(--accent-gold)' }} />
                    <span>Events ({eventList.length})</span>
                </label>
            </div>

            {/* Legend */}
            <div className="map-legend">
                <div className="map-legend__item">
                    <span className="map-legend__color" style={{ background: '#ef4444' }} /> Battle / Violence
                </div>
                <div className="map-legend__item">
                    <span className="map-legend__color" style={{ background: '#f97316' }} /> Explosion / Remote
                </div>
                <div className="map-legend__item">
                    <span className="map-legend__color" style={{ background: '#f59e0b' }} /> Protest / Riot
                </div>
                <div className="map-legend__item">
                    <span className="map-legend__color" style={{ background: '#3b82f6' }} /> Strategic
                </div>
                <div className="map-legend__item">
                    <span className="map-legend__color" style={{ background: '#ef444430', border: '2px solid #ef4444' }} /> Closed Airspace
                </div>
            </div>

            {/* Map */}
            <div className="map-wrapper card">
                <MapContainer
                    center={MAP_CONFIG.center} zoom={MAP_CONFIG.zoom}
                    minZoom={MAP_CONFIG.minZoom} maxZoom={MAP_CONFIG.maxZoom}
                    style={{ height: '100%', width: '100%', borderRadius: 'var(--radius-lg)' }}
                    scrollWheelZoom={true}
                >
                    <TileLayer url={MAP_CONFIG.tileUrl} attribution={MAP_CONFIG.attribution} />

                    {showConflict && zones.map(zone => (
                        <Rectangle key={zone.id} bounds={zone.bounds}
                            pathOptions={{ color: zone.color, fillColor: zone.color, fillOpacity: 0.2, weight: 2 }}>
                            <MapTooltip>
                                {zone.name} — {zone.eventCount} events, {zone.fatalities} fatalities
                            </MapTooltip>
                        </Rectangle>
                    ))}

                    {showFlights && flights.map(zone => (
                        <Rectangle key={zone.id} bounds={zone.bounds}
                            pathOptions={{ color: zone.color, fillColor: zone.color, fillOpacity: 0.1, weight: 1, dashArray: '8 4' }}>
                            <MapTooltip>✈️ {zone.label}</MapTooltip>
                        </Rectangle>
                    ))}

                    {showEvents && eventList.map(event => (
                        <CircleMarker key={event.id} center={[event.lat, event.lng]}
                            radius={event.fatalities > 10 ? 10 : event.fatalities > 0 ? 7 : 5}
                            pathOptions={{ color: eventTypeColor(event.type), fillColor: eventTypeColor(event.type), fillOpacity: 0.7, weight: 2 }}>
                            <Popup><EventPopup event={event} /></Popup>
                        </CircleMarker>
                    ))}
                </MapContainer>
            </div>

            {/* Stats bar */}
            <div className="map-stats">
                <div className="map-stat-item">
                    <span className="map-stat-item__value">{eventList.length}</span>
                    <span className="map-stat-item__label">Active Events</span>
                </div>
                <div className="map-stat-item">
                    <span className="map-stat-item__value" style={{ color: 'var(--accent-red)' }}>
                        {eventList.reduce((sum, e) => sum + (e.fatalities || 0), 0)}
                    </span>
                    <span className="map-stat-item__label">Total Fatalities</span>
                </div>
                <div className="map-stat-item">
                    <span className="map-stat-item__value" style={{ color: 'var(--accent-orange)' }}>
                        {new Set(eventList.map(e => e.country)).size}
                    </span>
                    <span className="map-stat-item__label">Countries</span>
                </div>
                <div className="map-stat-item">
                    <span className="map-stat-item__value" style={{ color: 'var(--accent-gold)' }}>
                        {flights.length}
                    </span>
                    <span className="map-stat-item__label">Airspace Restrictions</span>
                </div>
            </div>
        </div>
    );
}
