import { useMemo, useState } from 'react';
import { MapContainer, TileLayer, Rectangle, CircleMarker, Popup, Tooltip as MapTooltip } from 'react-leaflet';
import { Layers, Eye, EyeOff, Crosshair, Plane, MapPin } from 'lucide-react';
import { getMockConflictEvents, getConflictZones, getFlightRestrictions } from '../../services/conflictService';
import { MAP_CONFIG } from '../../utils/constants';
import 'leaflet/dist/leaflet.css';
import './ConflictMap.css';

function EventPopup({ event }) {
    const typeColors = {
        Battle: 'var(--accent-red)',
        Shelling: 'var(--accent-orange)',
        Airstrike: 'var(--accent-red)',
        'Drone Attack': 'var(--accent-orange)',
        Explosion: 'var(--accent-red)',
        Protest: 'var(--accent-gold)',
        Riot: 'var(--accent-gold)',
    };

    return (
        <div className="map-popup">
            <h4 className="map-popup__title">{event.city}, {event.country}</h4>
            <div className="map-popup__badges">
                <span className="badge badge-red">{event.type}</span>
                {event.fatalities > 0 && (
                    <span className="badge badge-red">☠️ {event.fatalities} fatalities</span>
                )}
            </div>
            <p className="map-popup__desc">{event.description}</p>
            <span className="map-popup__date">{event.date}</span>
        </div>
    );
}

export default function ConflictMap() {
    const [showConflict, setShowConflict] = useState(true);
    const [showFlights, setShowFlights] = useState(true);
    const [showEvents, setShowEvents] = useState(true);

    const events = useMemo(() => getMockConflictEvents(), []);
    const zones = useMemo(() => getConflictZones(), []);
    const flights = useMemo(() => getFlightRestrictions(), []);

    const eventTypeColor = (type) => {
        const c = {
            Battle: '#ef4444', Shelling: '#f97316', Airstrike: '#ef4444',
            'Drone Attack': '#f97316', Explosion: '#ef4444', Protest: '#f59e0b', Riot: '#f59e0b',
        };
        return c[type] || '#3b82f6';
    };

    return (
        <div className="conflict-map fade-in">
            {/* Controls */}
            <div className="map-controls">
                <h3 className="map-controls__title">
                    <Layers size={16} /> Map Layers
                </h3>
                <label className="map-control">
                    <input type="checkbox" checked={showConflict} onChange={() => setShowConflict(!showConflict)} />
                    <Crosshair size={14} style={{ color: 'var(--accent-red)' }} />
                    <span>Conflict Zones</span>
                </label>
                <label className="map-control">
                    <input type="checkbox" checked={showFlights} onChange={() => setShowFlights(!showFlights)} />
                    <Plane size={14} style={{ color: 'var(--accent-orange)' }} />
                    <span>Flight Restrictions</span>
                </label>
                <label className="map-control">
                    <input type="checkbox" checked={showEvents} onChange={() => setShowEvents(!showEvents)} />
                    <MapPin size={14} style={{ color: 'var(--accent-gold)' }} />
                    <span>Events ({events.length})</span>
                </label>
            </div>

            {/* Legend */}
            <div className="map-legend">
                <div className="map-legend__item">
                    <span className="map-legend__color" style={{ background: '#ef4444' }} /> Battle / Airstrike
                </div>
                <div className="map-legend__item">
                    <span className="map-legend__color" style={{ background: '#f97316' }} /> Shelling / Drone
                </div>
                <div className="map-legend__item">
                    <span className="map-legend__color" style={{ background: '#f59e0b' }} /> Protest / Riot
                </div>
                <div className="map-legend__item">
                    <span className="map-legend__color" style={{ background: '#ef444430', border: '2px solid #ef4444' }} /> Closed Airspace
                </div>
                <div className="map-legend__item">
                    <span className="map-legend__color" style={{ background: '#f59e0b20', border: '2px solid #f59e0b' }} /> Warning Zone
                </div>
            </div>

            {/* Map */}
            <div className="map-wrapper card">
                <MapContainer
                    center={MAP_CONFIG.center}
                    zoom={MAP_CONFIG.zoom}
                    minZoom={MAP_CONFIG.minZoom}
                    maxZoom={MAP_CONFIG.maxZoom}
                    style={{ height: '100%', width: '100%', borderRadius: 'var(--radius-lg)' }}
                    scrollWheelZoom={true}
                >
                    <TileLayer url={MAP_CONFIG.tileUrl} attribution={MAP_CONFIG.attribution} />

                    {/* Conflict Zone Overlays */}
                    {showConflict && zones.map(zone => (
                        <Rectangle
                            key={zone.id}
                            bounds={zone.bounds}
                            pathOptions={{ color: zone.color, fillColor: zone.color, fillOpacity: 0.3, weight: 2 }}
                        >
                            <MapTooltip>{zone.name} ({zone.intensity})</MapTooltip>
                        </Rectangle>
                    ))}

                    {/* Flight Restriction Overlays */}
                    {showFlights && flights.map(zone => (
                        <Rectangle
                            key={zone.id}
                            bounds={zone.bounds}
                            pathOptions={{
                                color: zone.borderColor,
                                fillColor: zone.color,
                                fillOpacity: 0.15,
                                weight: 1,
                                dashArray: '8 4',
                            }}
                        >
                            <MapTooltip>✈️ {zone.name} — {zone.type}</MapTooltip>
                        </Rectangle>
                    ))}

                    {/* Event Markers */}
                    {showEvents && events.map(event => (
                        <CircleMarker
                            key={event.id}
                            center={[event.lat, event.lng]}
                            radius={event.fatalities > 10 ? 10 : event.fatalities > 0 ? 7 : 5}
                            pathOptions={{
                                color: eventTypeColor(event.type),
                                fillColor: eventTypeColor(event.type),
                                fillOpacity: 0.7,
                                weight: 2,
                            }}
                        >
                            <Popup><EventPopup event={event} /></Popup>
                        </CircleMarker>
                    ))}
                </MapContainer>
            </div>

            {/* Stats bar */}
            <div className="map-stats">
                <div className="map-stat-item">
                    <span className="map-stat-item__value">{events.length}</span>
                    <span className="map-stat-item__label">Active Events</span>
                </div>
                <div className="map-stat-item">
                    <span className="map-stat-item__value" style={{ color: 'var(--accent-red)' }}>
                        {events.filter(e => e.fatalities > 0).reduce((sum, e) => sum + e.fatalities, 0)}
                    </span>
                    <span className="map-stat-item__label">Total Fatalities</span>
                </div>
                <div className="map-stat-item">
                    <span className="map-stat-item__value" style={{ color: 'var(--accent-orange)' }}>
                        {new Set(events.map(e => e.country)).size}
                    </span>
                    <span className="map-stat-item__label">Countries Affected</span>
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
