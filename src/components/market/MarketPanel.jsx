import { useMemo, useCallback } from 'react';
import { TrendingUp, TrendingDown, Minus, Droplets, Gem, RefreshCw, Wifi } from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { fetchPriceSnapshot, getOilData, getGoldData, fetchForexHistory } from '../../services/marketService';
import { formatCurrency, formatPercent, getChangeColor } from '../../utils/formatters';
import { CHART_COLORS, REFRESH_INTERVALS } from '../../utils/constants';
import { useAutoRefresh } from '../../hooks/useAutoRefresh';
import './MarketPanel.css';

function ChangeIcon({ value }) {
    if (value > 0) return <TrendingUp size={14} />;
    if (value < 0) return <TrendingDown size={14} />;
    return <Minus size={14} />;
}

function PriceCard({ label, icon: Icon, price, change, changePercent, color, loading }) {
    if (loading) {
        return (
            <div className="price-card card">
                <div className="price-card__header"><div className="skeleton" style={{ width: 120, height: 18 }} /></div>
                <div className="skeleton" style={{ width: 160, height: 32, marginBottom: 8 }} />
                <div className="skeleton" style={{ width: 100, height: 16 }} />
            </div>
        );
    }
    return (
        <div className="price-card card">
            <div className="price-card__header">
                <div className="price-card__icon" style={{ background: `${color}20`, color }}>
                    <Icon size={18} />
                </div>
                <span className="price-card__label">{label}</span>
            </div>
            <div className="price-card__value">{formatCurrency(price)}</div>
            <div className="price-card__change" style={{ color: getChangeColor(changePercent) }}>
                <ChangeIcon value={changePercent} />
                <span>{formatCurrency(Math.abs(change))}</span>
                <span>({formatPercent(changePercent)})</span>
            </div>
        </div>
    );
}

function ForexRow({ pair, value, change, changePercent, flag }) {
    return (
        <div className="forex-row">
            <div className="forex-row__pair">
                <span className="forex-row__flag">{flag}</span>
                <span className="forex-row__name">{pair}</span>
            </div>
            <div className="forex-row__value">
                {value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
            </div>
            <div className="forex-row__change" style={{ color: getChangeColor(changePercent) }}>
                <ChangeIcon value={changePercent} />
                <span>{formatPercent(changePercent)}</span>
            </div>
        </div>
    );
}

function ChartTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="chart-tooltip">
            <p className="chart-tooltip__date">{label}</p>
            {payload.map((p, i) => (
                <p key={i} className="chart-tooltip__value" style={{ color: p.color }}>
                    {p.name}: {formatCurrency(p.value)}
                </p>
            ))}
        </div>
    );
}

export default function MarketPanel() {
    // Fetch real data via auto-refresh hook
    const fetchSnapshot = useCallback(() => fetchPriceSnapshot(), []);
    const { data: snapshot, loading, lastUpdated, refresh } = useAutoRefresh(
        fetchSnapshot, REFRESH_INTERVALS.FOREX
    );

    const oilData = useMemo(() => getOilData(), []);
    const goldData = useMemo(() => getGoldData(), []);

    return (
        <div className="market-panel fade-in">
            {/* Status bar */}
            <div className="market-panel__status">
                <div className="market-panel__status-left">
                    {snapshot?.isRealForex && (
                        <span className="badge badge-green"><Wifi size={10} /> Forex: Live Data</span>
                    )}
                    {!snapshot?.isRealForex && !loading && (
                        <span className="badge badge-gold">Forex: Offline</span>
                    )}
                    <span className="badge badge-blue">Commodities: Simulated</span>
                </div>
                <button className="market-panel__refresh" onClick={refresh} title="Refresh data">
                    <RefreshCw size={14} className={loading ? 'spinning' : ''} />
                    {lastUpdated && (
                        <span>Updated {lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    )}
                </button>
            </div>

            {/* Price Cards */}
            <div className="market-panel__cards">
                <PriceCard
                    label="WTI Crude" icon={Droplets} loading={loading}
                    price={snapshot?.oil?.wti?.price} change={snapshot?.oil?.wti?.change}
                    changePercent={snapshot?.oil?.wti?.changePercent} color={CHART_COLORS.blue}
                />
                <PriceCard
                    label="Brent Crude" icon={Droplets} loading={loading}
                    price={snapshot?.oil?.brent?.price} change={snapshot?.oil?.brent?.change}
                    changePercent={snapshot?.oil?.brent?.changePercent} color={CHART_COLORS.cyan}
                />
                <PriceCard
                    label="Gold (XAU)" icon={Gem} loading={loading}
                    price={snapshot?.gold?.price} change={snapshot?.gold?.change}
                    changePercent={snapshot?.gold?.changePercent} color={CHART_COLORS.gold}
                />
            </div>

            {/* Charts */}
            <div className="market-panel__charts">
                <div className="chart-container card">
                    <h3 className="chart-container__title">
                        <Droplets size={16} style={{ color: CHART_COLORS.blue }} />
                        Oil Prices — 30 Day Trend
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={oilData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="gradWti" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={CHART_COLORS.blue} stopOpacity={0.3} />
                                    <stop offset="100%" stopColor={CHART_COLORS.blue} stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gradBrent" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={CHART_COLORS.cyan} stopOpacity={0.3} />
                                    <stop offset="100%" stopColor={CHART_COLORS.cyan} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={6} />
                            <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10 }} />
                            <Tooltip content={<ChartTooltip />} />
                            <Area type="monotone" dataKey="wti" name="WTI" stroke={CHART_COLORS.blue} fill="url(#gradWti)" strokeWidth={2} />
                            <Area type="monotone" dataKey="brent" name="Brent" stroke={CHART_COLORS.cyan} fill="url(#gradBrent)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-container card">
                    <h3 className="chart-container__title">
                        <Gem size={16} style={{ color: CHART_COLORS.gold }} />
                        Gold Price (XAU/USD) — 30 Day Trend
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={goldData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="gradGold" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={CHART_COLORS.gold} stopOpacity={0.3} />
                                    <stop offset="100%" stopColor={CHART_COLORS.gold} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={6} />
                            <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10 }} />
                            <Tooltip content={<ChartTooltip />} />
                            <Area type="monotone" dataKey="price" name="Gold" stroke={CHART_COLORS.gold} fill="url(#gradGold)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Forex Table - REAL DATA */}
            <div className="forex-table card">
                <h3 className="chart-container__title" style={{ marginBottom: '12px' }}>
                    💱 Foreign Exchange Rates (vs USD)
                    {snapshot?.isRealForex && <span className="badge badge-green" style={{ marginLeft: 8, fontSize: '0.65rem' }}>LIVE</span>}
                </h3>
                {loading ? (
                    <div style={{ padding: '16px' }}>
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="skeleton" style={{ height: 36, marginBottom: 8, borderRadius: 8 }} />
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="forex-table__header">
                            <span>Pair</span>
                            <span>Rate</span>
                            <span>Change</span>
                        </div>
                        {snapshot?.forex?.map((fx, i) => (
                            <ForexRow key={i} {...fx} />
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}
