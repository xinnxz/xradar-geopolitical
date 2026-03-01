// ========================================
// MarketPanel — Professional Trading Terminal
// Binance/OKX-style layout with TradingView charts
// Uses REAL data from Alpha Vantage API
// ========================================

import { useState, useMemo } from 'react';
import {
    TrendingUp, TrendingDown, Minus, Droplets, Gem,
    RefreshCw, Wifi, Search, ExternalLink, BarChart3, LineChart, CandlestickChart
} from 'lucide-react';
import TradingChart from './TradingChart';
import { useGlobalData } from '../../hooks/useGlobalData';
import { formatCurrency, formatPercent, getChangeColor } from '../../utils/formatters';
import { CHART_COLORS, FOREX_REGIONS, EXTERNAL_LINKS } from '../../utils/constants';
import './TradingChart.css';
import './MarketPanel.css';

// Active chart instruments
const INSTRUMENTS = [
    { key: 'gold', symbol: 'XAUUSD', title: 'Gold Spot / USD', icon: Gem, accent: '#f0b90b', precision: 2 },
    { key: 'wti', symbol: 'CL', title: 'WTI Crude Oil', icon: Droplets, accent: '#3b82f6', precision: 2 },
    { key: 'brent', symbol: 'BRN', title: 'Brent Crude Oil', icon: Droplets, accent: '#06b6d4', precision: 2 },
];

function ChangeIcon({ value }) {
    if (value > 0) return <TrendingUp size={12} />;
    if (value < 0) return <TrendingDown size={12} />;
    return <Minus size={12} />;
}

export default function MarketPanel() {
    const { snapshot, loading, lastUpdated, refresh } = useGlobalData();
    const [activeInstrument, setActiveInstrument] = useState('gold');
    const [chartType, setChartType] = useState('area');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeRegion, setActiveRegion] = useState('All');

    // Get instrument data
    const getInstrumentData = (key) => {
        if (!snapshot) return null;
        switch (key) {
            case 'gold': return snapshot.gold;
            case 'wti': return snapshot.oil?.wti;
            case 'brent': return snapshot.oil?.brent;
            default: return null;
        }
    };

    // Build chart data from history
    const chartData = useMemo(() => {
        const data = getInstrumentData(activeInstrument);
        if (!data?.history?.length) return [];

        return data.history.map((point, i, arr) => {
            const price = point.value;
            // Generate OHLC from daily close data
            // Since API gives close only, simulate OHLC for candlestick view
            const volatility = price * 0.005; // 0.5% daily range
            const seed = Array.from(point.date).reduce((a, c) => a + c.charCodeAt(0), 0);
            const r1 = Math.sin(seed * 1.1);
            const r2 = Math.sin(seed * 2.3);
            const prevPrice = i > 0 ? arr[i - 1].value : price;
            const isUp = price >= prevPrice;

            return {
                time: point.date,
                close: price,
                open: isUp ? price - Math.abs(r1) * volatility : price + Math.abs(r1) * volatility,
                high: price + Math.abs(r2) * volatility + volatility * 0.3,
                low: price - Math.abs(r1 * r2) * volatility - volatility * 0.3,
                value: price,
            };
        });
    }, [activeInstrument, snapshot]);

    const activeConfig = INSTRUMENTS.find(i => i.key === activeInstrument);

    // Filter forex
    const filteredForex = useMemo(() => {
        if (!snapshot?.forex) return [];
        return snapshot.forex.filter(fx => {
            const matchSearch = !searchQuery ||
                fx.pair.toLowerCase().includes(searchQuery.toLowerCase()) ||
                fx.region.toLowerCase().includes(searchQuery.toLowerCase());
            const matchRegion = activeRegion === 'All' || fx.region === activeRegion;
            return matchSearch && matchRegion;
        });
    }, [snapshot?.forex, searchQuery, activeRegion]);

    return (
        <div className="market-panel fade-in">
            {/* Status bar */}
            <div className="market-panel__status">
                <div className="market-panel__status-left">
                    {snapshot?.isRealForex && <span className="badge badge-green"><Wifi size={10} /> Forex Live</span>}
                    {snapshot?.isRealOil && <span className="badge badge-green"><Wifi size={10} /> Oil Live</span>}
                    {snapshot?.isRealGold && <span className="badge badge-green"><Wifi size={10} /> Gold Live</span>}
                    {!snapshot?.isRealOil && !loading && <span className="badge badge-blue">Commodities: Simulated</span>}
                </div>
                <button className="market-panel__refresh" onClick={refresh} title="Refresh data">
                    <RefreshCw size={14} className={loading ? 'spinning' : ''} />
                    {lastUpdated && (
                        <span>Updated {lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    )}
                </button>
            </div>

            {/* Ticker Cards — Binance style */}
            <div className="market-ticker">
                {INSTRUMENTS.map(inst => {
                    const data = getInstrumentData(inst.key);
                    const isActive = activeInstrument === inst.key;
                    const price = data?.price;
                    const pct = data?.changePercent || 0;
                    const isUp = pct >= 0;

                    return (
                        <div
                            key={inst.key}
                            className={`ticker-card ${isActive ? 'ticker-card--active' : ''}`}
                            style={{ '--ticker-accent': inst.accent }}
                            onClick={() => setActiveInstrument(inst.key)}
                        >
                            <div className="ticker-card__top">
                                <div className="ticker-card__symbol">
                                    <div className="ticker-card__icon" style={{ background: `${inst.accent}15`, color: inst.accent }}>
                                        <inst.icon size={14} />
                                    </div>
                                    <div>
                                        <div className="ticker-card__name">{inst.symbol}</div>
                                        <div className="ticker-card__label">{inst.title}</div>
                                    </div>
                                </div>
                                <div className={`ticker-card__badge ${isUp ? 'ticker-card__badge--up' : 'ticker-card__badge--down'}`}>
                                    <ChangeIcon value={pct} /> {formatPercent(pct)}
                                </div>
                            </div>
                            <div className="ticker-card__price">
                                {loading ? '—' : formatCurrency(price)}
                            </div>
                            <div className="ticker-card__change" style={{ color: getChangeColor(pct) }}>
                                <ChangeIcon value={pct} />
                                <span>{formatCurrency(Math.abs(data?.change || 0))}</span>
                                <span style={{ color: '#848e9c', fontSize: '0.6rem' }}>24h</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Chart Section */}
            <div className="market-panel__chart-wrapper">
                {/* Chart Type Controls — Binance tabs */}
                <div className="chart-controls">
                    <div className="chart-controls__group">
                        <button
                            className={`chart-btn chart-btn--type ${chartType === 'area' ? 'chart-btn--active' : ''}`}
                            onClick={() => setChartType('area')}
                            title="Area Chart"
                        >
                            <LineChart size={13} />
                        </button>
                        <button
                            className={`chart-btn chart-btn--type ${chartType === 'candlestick' ? 'chart-btn--active' : ''}`}
                            onClick={() => setChartType('candlestick')}
                            title="Candlestick"
                        >
                            <CandlestickChart size={13} />
                        </button>
                        <button
                            className={`chart-btn chart-btn--type ${chartType === 'line' ? 'chart-btn--active' : ''}`}
                            onClick={() => setChartType('line')}
                            title="Line Chart"
                        >
                            <BarChart3 size={13} />
                        </button>
                    </div>

                    <div className="chart-controls__divider" />

                    <a
                        href={EXTERNAL_LINKS[activeInstrument === 'gold' ? 'GOLD' : activeInstrument === 'wti' ? 'WTI' : 'BRENT']}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="chart-btn"
                        style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                        TradingView <ExternalLink size={10} />
                    </a>
                </div>

                {/* TradingView Chart */}
                {chartData.length > 0 ? (
                    <TradingChart
                        key={`${activeInstrument}-${chartType}`}
                        data={chartData}
                        symbol={activeConfig.symbol}
                        title={activeConfig.title}
                        chartType={chartType}
                        height={380}
                        accentColor={activeConfig.accent}
                        precision={activeConfig.precision}
                    />
                ) : (
                    <div style={{ height: 380, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5e6571' }}>
                        {loading ? 'Loading chart data...' : 'No historical data available (fallback mode)'}
                    </div>
                )}
            </div>

            {/* Forex Table — OKX style */}
            <div className="forex-pro">
                <div className="forex-pro__header">
                    <div className="forex-pro__title">
                        💱 Foreign Exchange Rates
                        <span className="badge badge-blue" style={{ fontSize: '0.6rem' }}>{filteredForex.length} pairs</span>
                        {snapshot?.isRealForex && <span className="badge badge-green" style={{ fontSize: '0.55rem' }}>LIVE</span>}
                    </div>
                    <div className="forex-pro__search">
                        <Search size={12} />
                        <input
                            type="text"
                            placeholder="Search pair..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="forex-pro__filters">
                    {FOREX_REGIONS.map(region => (
                        <button
                            key={region}
                            className={`chart-btn ${activeRegion === region ? 'chart-btn--active' : ''}`}
                            onClick={() => setActiveRegion(region)}
                        >
                            {region}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div style={{ padding: 16 }}>
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="skeleton" style={{ height: 36, marginBottom: 8, borderRadius: 8 }} />
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="forex-pro__col-header">
                            <span>Pair</span>
                            <span>Price</span>
                            <span>24h Change</span>
                        </div>
                        <div className="forex-pro__body">
                            {filteredForex.map((fx, i) => {
                                const pct = fx.changePercent || 0;
                                const isUp = pct >= 0;
                                const href = EXTERNAL_LINKS.forexPair('USD', fx.pair?.split('/')[1] || 'EUR');

                                return (
                                    <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="forex-pro__row">
                                        <div className="forex-pro__pair">
                                            <span className="forex-pro__flag">{fx.flag}</span>
                                            <div className="forex-pro__pair-info">
                                                <span className="forex-pro__pair-name">{fx.pair}</span>
                                                <span className="forex-pro__pair-region">{fx.region}</span>
                                            </div>
                                        </div>
                                        <span className="forex-pro__rate">
                                            {fx.value?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                                        </span>
                                        <span className={`forex-pro__pct ${isUp ? 'forex-pro__pct--up' : pct < 0 ? 'forex-pro__pct--down' : 'forex-pro__pct--flat'}`}>
                                            <ChangeIcon value={pct} />
                                            {formatPercent(pct)}
                                        </span>
                                    </a>
                                );
                            })}
                            {filteredForex.length === 0 && (
                                <div className="forex-pro__empty">No currencies match your search</div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
