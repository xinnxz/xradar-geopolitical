import { useMemo, useCallback } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { MapContainer, TileLayer, Rectangle, CircleMarker } from 'react-leaflet';
import {
    Droplets, Gem, TrendingUp, TrendingDown, Minus,
    ShieldAlert, Newspaper, MapPin, Clock, Wifi
} from 'lucide-react';
import { fetchPriceSnapshot, getOilData, getGoldData } from '../../services/marketService';
import { fetchNews } from '../../services/newsService';
import { getMockConflictEvents, getConflictZones } from '../../services/conflictService';
import { calculateRiskScore, generateRiskHistory } from '../../utils/riskCalculator';
import { formatCurrency, formatPercent, getChangeColor, formatTimeAgo } from '../../utils/formatters';
import { CHART_COLORS, MAP_CONFIG, REFRESH_INTERVALS } from '../../utils/constants';
import { useAutoRefresh } from '../../hooks/useAutoRefresh';
import 'leaflet/dist/leaflet.css';
import './Overview.css';

function ChangeIcon({ value }) {
    if (value > 0) return <TrendingUp size={14} />;
    if (value < 0) return <TrendingDown size={14} />;
    return <Minus size={14} />;
}

function MiniPriceCard({ label, icon: Icon, price, changePercent, color, loading }) {
    if (loading) {
        return (
            <div className="mini-card card">
                <div className="skeleton" style={{ width: '100%', height: 60, borderRadius: 8 }} />
            </div>
        );
    }
    return (
        <div className="mini-card card">
            <div className="mini-card__top">
                <div className="mini-card__icon" style={{ background: `${color}20`, color }}>
                    <Icon size={16} />
                </div>
                <span className="mini-card__change" style={{ color: getChangeColor(changePercent) }}>
                    <ChangeIcon value={changePercent} />
                    {formatPercent(changePercent)}
                </span>
            </div>
            <div className="mini-card__value">{formatCurrency(price)}</div>
            <div className="mini-card__label">{label}</div>
        </div>
    );
}

export default function Overview() {
    // Real data hooks
    const fetchSnapshot = useCallback(() => fetchPriceSnapshot(), []);
    const fetchNewsFn = useCallback(() => fetchNews('all'), []);

    const { data: snapshot, loading: priceLoading } = useAutoRefresh(fetchSnapshot, REFRESH_INTERVALS.FOREX);
    const { data: newsData, loading: newsLoading } = useAutoRefresh(fetchNewsFn, REFRESH_INTERVALS.NEWS);

    const news = (newsData || []).slice(0, 5);
    const oilData = useMemo(() => getOilData(), []);
    const goldData = useMemo(() => getGoldData(), []);
    const events = useMemo(() => getMockConflictEvents(), []);
    const zones = useMemo(() => getConflictZones(), []);
    const riskHistory = useMemo(() => generateRiskHistory(14), []);

    // Calculate risk from actual data
    const risk = useMemo(() => {
        const negCount = news.filter(n => n.sentiment === 'negative').length;
        const negPercent = news.length > 0 ? (negCount / news.length) * 100 : 50;
        return calculateRiskScore({
            conflictEvents: events.length * 6,
            oilChange: snapshot?.oil?.wti?.changePercent || -1.5,
            goldChange: snapshot?.gold?.changePercent || 0.8,
            negativeNewsPercent: negPercent,
            breakingNewsCount: news.length,
        });
    }, [snapshot, news, events]);

    return (
        <div className="overview fade-in">
            {/* Risk Banner */}
            <div className="overview__risk-banner" style={{ borderColor: `${risk.color}50` }}>
                <div className="risk-banner__left">
                    <ShieldAlert size={20} style={{ color: risk.color }} />
                    <div>
                        <div className="risk-banner__title">Global Risk Level</div>
                        <div className="risk-banner__level" style={{ color: risk.color }}>
                            {risk.level} — {risk.score}/100
                        </div>
                    </div>
                </div>
                <div className="risk-banner__badges">
                    {snapshot?.isRealForex && <span className="badge badge-green"><Wifi size={10} /> Live Forex</span>}
                </div>
                <div className="risk-banner__chart">
                    <ResponsiveContainer width="100%" height={50}>
                        <AreaChart data={riskHistory.slice(-14)}>
                            <Area type="monotone" dataKey="score" stroke={risk.color} fill={`${risk.color}20`} strokeWidth={1.5} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Price Cards Row */}
            <div className="overview__prices">
                <MiniPriceCard label="WTI Crude" icon={Droplets} loading={priceLoading}
                    price={snapshot?.oil?.wti?.price} changePercent={snapshot?.oil?.wti?.changePercent} color={CHART_COLORS.blue} />
                <MiniPriceCard label="Brent Crude" icon={Droplets} loading={priceLoading}
                    price={snapshot?.oil?.brent?.price} changePercent={snapshot?.oil?.brent?.changePercent} color={CHART_COLORS.cyan} />
                <MiniPriceCard label="Gold XAU" icon={Gem} loading={priceLoading}
                    price={snapshot?.gold?.price} changePercent={snapshot?.gold?.changePercent} color={CHART_COLORS.gold} />
                <MiniPriceCard label="USD/RUB" icon={TrendingUp} loading={priceLoading}
                    price={snapshot?.forex?.[0]?.value} changePercent={snapshot?.forex?.[0]?.changePercent} color={CHART_COLORS.red} />
            </div>

            {/* Main Grid */}
            <div className="overview__grid">
                {/* Oil Chart */}
                <div className="overview__chart card">
                    <h3 className="section-title">
                        <Droplets size={14} style={{ color: CHART_COLORS.blue }} /> Oil Price Trend
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={oilData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="gradWtiOv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={CHART_COLORS.blue} stopOpacity={0.3} />
                                    <stop offset="100%" stopColor={CHART_COLORS.blue} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={{ fontSize: 9 }} interval={6} />
                            <YAxis domain={['auto', 'auto']} tick={{ fontSize: 9 }} />
                            <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }} />
                            <Area type="monotone" dataKey="wti" stroke={CHART_COLORS.blue} fill="url(#gradWtiOv)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Gold Chart */}
                <div className="overview__chart card">
                    <h3 className="section-title">
                        <Gem size={14} style={{ color: CHART_COLORS.gold }} /> Gold Price Trend
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={goldData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="gradGoldOv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={CHART_COLORS.gold} stopOpacity={0.3} />
                                    <stop offset="100%" stopColor={CHART_COLORS.gold} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={{ fontSize: 9 }} interval={6} />
                            <YAxis domain={['auto', 'auto']} tick={{ fontSize: 9 }} />
                            <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }} />
                            <Area type="monotone" dataKey="price" stroke={CHART_COLORS.gold} fill="url(#gradGoldOv)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Mini Map */}
                <div className="overview__map card">
                    <h3 className="section-title">
                        <MapPin size={14} style={{ color: CHART_COLORS.red }} /> Active Conflict Zones
                    </h3>
                    <div className="overview__map-container">
                        <MapContainer center={MAP_CONFIG.center} zoom={2} minZoom={2} maxZoom={6}
                            style={{ height: '100%', width: '100%', borderRadius: '8px' }}
                            scrollWheelZoom={false} dragging={false} zoomControl={false}>
                            <TileLayer url={MAP_CONFIG.tileUrl} />
                            {zones.map(z => (
                                <Rectangle key={z.id} bounds={z.bounds}
                                    pathOptions={{ color: z.color, fillColor: z.color, fillOpacity: 0.3, weight: 1 }} />
                            ))}
                            {events.map(e => (
                                <CircleMarker key={e.id} center={[e.lat, e.lng]} radius={4}
                                    pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.8 }} />
                            ))}
                        </MapContainer>
                    </div>
                    <div className="overview__map-stat">
                        <span>{events.length} active events</span>
                        <span>•</span>
                        <span>{new Set(events.map(e => e.country)).size} countries</span>
                    </div>
                </div>

                {/* Latest News */}
                <div className="overview__news card">
                    <h3 className="section-title">
                        <Newspaper size={14} style={{ color: CHART_COLORS.blue }} /> Latest Headlines
                    </h3>
                    <div className="overview__news-list">
                        {newsLoading ? (
                            [1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="overview__news-item">
                                    <div className="skeleton" style={{ width: 4, height: 40, borderRadius: 4 }} />
                                    <div style={{ flex: 1 }}>
                                        <div className="skeleton" style={{ width: '90%', height: 14, marginBottom: 6 }} />
                                        <div className="skeleton" style={{ width: '50%', height: 10 }} />
                                    </div>
                                </div>
                            ))
                        ) : (
                            news.map(article => (
                                <div key={article.id} className="overview__news-item">
                                    <div className="overview__news-badge" data-sentiment={article.sentiment} />
                                    <div className="overview__news-content">
                                        <h4 className="overview__news-title">{article.title}</h4>
                                        <div className="overview__news-meta">
                                            <span className="overview__news-source">{article.source}</span>
                                            <span className="overview__news-time">
                                                <Clock size={10} /> {formatTimeAgo(article.publishedAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
