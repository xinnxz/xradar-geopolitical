import { useMemo } from 'react';
import {
    AreaChart, Area, ResponsiveContainer
} from 'recharts';
import { MapContainer, TileLayer, Rectangle, CircleMarker } from 'react-leaflet';
import {
    Droplets, Gem, TrendingUp, TrendingDown, Minus,
    ShieldAlert, Newspaper, MapPin, Clock, Wifi, ExternalLink
} from 'lucide-react';
import TradingChart from '../market/TradingChart';
import { formatCurrency, formatPercent, getChangeColor, formatTimeAgo } from '../../utils/formatters';
import { CHART_COLORS, MAP_CONFIG, EXTERNAL_LINKS } from '../../utils/constants';
import { useGlobalData } from '../../hooks/useGlobalData';
import '../market/TradingChart.css';
import 'leaflet/dist/leaflet.css';
import './Overview.css';

function ChangeIcon({ value }) {
    if (value > 0) return <TrendingUp size={14} />;
    if (value < 0) return <TrendingDown size={14} />;
    return <Minus size={14} />;
}

function MiniPriceCard({ label, icon: Icon, price, changePercent, color, loading, href }) {
    if (loading) {
        return (
            <div className="mini-card card">
                <div className="skeleton" style={{ width: '100%', height: 60, borderRadius: 8 }} />
            </div>
        );
    }
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="mini-card card mini-card--clickable" title={`View ${label} on TradingView`}>
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
            <div className="mini-card__label">{label} <ExternalLink size={10} style={{ opacity: 0.4 }} /></div>
        </a>
    );
}

export default function Overview() {
    // Use centralized real data from context
    const { snapshot, news: allNews, conflicts, zones, risk, riskHistory, loading } = useGlobalData();

    const priceLoading = loading && !snapshot;
    const newsLoading = loading && allNews.length === 0;
    const news = allNews.slice(0, 5);

    // Extract real historical data for TradingView charts
    const oilHistory = useMemo(() => {
        const history = snapshot?.oil?.wti?.history || [];
        return history.map(p => ({ time: p.date, value: p.value, close: p.value }));
    }, [snapshot]);

    const goldHistory = useMemo(() => {
        const history = snapshot?.gold?.history || [];
        return history.map(p => ({ time: p.date, value: p.value, close: p.value }));
    }, [snapshot]);

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
                    {snapshot?.isRealGold && <span className="badge badge-green"><Wifi size={10} /> Live Gold</span>}
                    {snapshot?.isRealOil && <span className="badge badge-green"><Wifi size={10} /> Live Oil</span>}
                    {conflicts.length > 0 && conflicts[0]?.source !== 'Mock' && <span className="badge badge-green"><Wifi size={10} /> Live ACLED</span>}
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
                    price={snapshot?.oil?.wti?.price} changePercent={snapshot?.oil?.wti?.changePercent}
                    color={CHART_COLORS.blue} href={EXTERNAL_LINKS.WTI} />
                <MiniPriceCard label="Brent Crude" icon={Droplets} loading={priceLoading}
                    price={snapshot?.oil?.brent?.price} changePercent={snapshot?.oil?.brent?.changePercent}
                    color={CHART_COLORS.cyan} href={EXTERNAL_LINKS.BRENT} />
                <MiniPriceCard label="Gold XAU" icon={Gem} loading={priceLoading}
                    price={snapshot?.gold?.price} changePercent={snapshot?.gold?.changePercent}
                    color={CHART_COLORS.gold} href={EXTERNAL_LINKS.GOLD} />
                <MiniPriceCard label="USD/EUR" icon={TrendingUp} loading={priceLoading}
                    price={snapshot?.forex?.[0]?.value} changePercent={snapshot?.forex?.[0]?.changePercent}
                    color={CHART_COLORS.red} href={EXTERNAL_LINKS.forexPair('USD', 'EUR')} />
            </div>

            {/* Main Grid */}
            <div className="overview__grid">
                {/* Oil Chart — TradingView mini */}
                <div className="overview__chart card">
                    <a href={EXTERNAL_LINKS.WTI} target="_blank" rel="noopener noreferrer" className="section-title section-title--link">
                        <Droplets size={14} style={{ color: CHART_COLORS.blue }} /> Oil Price (WTI) — Real Data
                        <ExternalLink size={10} className="chart-link-icon" />
                    </a>
                    <div style={{ height: 200 }}>
                        {oilHistory.length > 0 ? (
                            <TradingChart
                                key="overview-oil"
                                data={oilHistory}
                                symbol="CL"
                                chartType="area"
                                height={200}
                                accentColor="#3b82f6"
                                precision={2}
                            />
                        ) : (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5e6571', fontSize: '0.8rem' }}>
                                {loading ? 'Loading chart...' : 'Chart data loading — refresh in a moment'}
                            </div>
                        )}
                    </div>
                </div>

                {/* Gold Chart — TradingView mini */}
                <div className="overview__chart card">
                    <a href={EXTERNAL_LINKS.GOLD} target="_blank" rel="noopener noreferrer" className="section-title section-title--link">
                        <Gem size={14} style={{ color: CHART_COLORS.gold }} /> Gold Price (XAU) — Real Data
                        <ExternalLink size={10} className="chart-link-icon" />
                    </a>
                    <div style={{ height: 200 }}>
                        {goldHistory.length > 0 ? (
                            <TradingChart
                                key="overview-gold"
                                data={goldHistory}
                                symbol="XAUUSD"
                                chartType="area"
                                height={200}
                                accentColor="#f0b90b"
                                precision={2}
                            />
                        ) : (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5e6571', fontSize: '0.8rem' }}>
                                {loading ? 'Loading chart...' : 'Chart data loading — refresh in a moment'}
                            </div>
                        )}
                    </div>
                </div>

                {/* Mini Map — now uses REAL ACLED data */}
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
                            {conflicts.slice(0, 50).map(e => (
                                <CircleMarker key={e.id} center={[e.lat, e.lng]} radius={4}
                                    pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.8 }} />
                            ))}
                        </MapContainer>
                    </div>
                    <div className="overview__map-stat">
                        <span>{conflicts.length} active events</span>
                        <span>•</span>
                        <span>{new Set(conflicts.map(e => e.country)).size} countries</span>
                    </div>
                </div>

                {/* Latest News — from global context */}
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
                                <a key={article.id} href={article.url} target="_blank" rel="noopener noreferrer"
                                    className="overview__news-item overview__news-item--clickable">
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
                                    <ExternalLink size={12} className="overview__news-link" />
                                </a>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
