// ========================================
// MarketPanel — Full Trading Terminal
// TradingView-style with 4 tabs:
// Crypto | Stocks | Forex | Commodities
// ========================================

import { useState, useCallback, useEffect } from 'react';
import {
    TrendingUp, TrendingDown, Minus, Droplets, Gem,
    RefreshCw, Wifi, Search, BarChart3, LineChart,
    CandlestickChart, Bitcoin, DollarSign, Building2, Fuel,
    WifiOff
} from 'lucide-react';
import TradingChart from './TradingChart';
import { useGlobalData } from '../../hooks/useGlobalData';
import { useAutoRefresh } from '../../hooks/useAutoRefresh';
import {
    fetchCryptoPrices, fetchStockIndices,
    fetchForexRates, fetchForexHistory
} from '../../services/marketService';
import { formatCurrency, formatPercent, getChangeColor } from '../../utils/formatters';
import { CHART_COLORS, FOREX_PAIRS, FOREX_REGIONS } from '../../utils/constants';
import './TradingChart.css';
import './MarketPanel.css';

// Market tabs
const MARKET_TABS = [
    { id: 'crypto', label: 'Crypto', icon: Bitcoin, color: '#f7931a' },
    { id: 'stocks', label: 'Stocks & Indices', icon: Building2, color: '#3b82f6' },
    { id: 'forex', label: 'Forex', icon: DollarSign, color: '#0ecb81' },
    { id: 'commodities', label: 'Commodities', icon: Fuel, color: '#f0b90b' },
];

// Commodity instruments for chart
const COMMODITY_INSTRUMENTS = [
    { key: 'gold', symbol: 'XAUUSD', title: 'Gold / USD', icon: Gem, accent: '#f0b90b', precision: 2 },
    { key: 'wti', symbol: 'CL', title: 'WTI Crude Oil', icon: Droplets, accent: '#3b82f6', precision: 2 },
    { key: 'brent', symbol: 'BRN', title: 'Brent Crude Oil', icon: Droplets, accent: '#06b6d4', precision: 2 },
];

function ChangeIcon({ value }) {
    if (value > 0) return <TrendingUp size={12} />;
    if (value < 0) return <TrendingDown size={12} />;
    return <Minus size={12} />;
}

function formatNum(n, precision = 2) {
    if (n == null) return '—';
    if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
    if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
    if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
    return `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: precision, maximumFractionDigits: precision })}`;
}

function formatPrice(price) {
    if (price == null) return '—';
    if (price >= 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (price >= 1) return price.toFixed(2);
    if (price >= 0.01) return price.toFixed(4);
    return price.toFixed(6);
}

// ========================================
// CRYPTO TAB
// ========================================
function CryptoTab({ searchQuery }) {
    const fetchFn = useCallback(() => fetchCryptoPrices(), []);
    const { data: coins, loading, lastUpdated, refresh } = useAutoRefresh(fetchFn, 5 * 60 * 1000, []);

    const filtered = (coins || []).filter(c =>
        !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading && !coins?.length) {
        return <div className="mp-loading"><RefreshCw size={18} className="spinning" /> Loading crypto data...</div>;
    }

    if (!coins?.length) {
        return <div className="mp-empty"><WifiOff size={24} /><span>Crypto data unavailable</span></div>;
    }

    return (
        <div className="mp-tab-content fade-in">
            <div className="mp-tab-header">
                <span className="mp-tab-count">{filtered.length} assets</span>
                <button className="market-panel__refresh" onClick={refresh}>
                    <RefreshCw size={12} className={loading ? 'spinning' : ''} />
                    {lastUpdated && <span>{lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>}
                </button>
            </div>

            <div className="mp-table">
                <div className="mp-table__head">
                    <span className="mp-th mp-th--rank">#</span>
                    <span className="mp-th mp-th--name">Name</span>
                    <span className="mp-th mp-th--price">Price</span>
                    <span className="mp-th mp-th--change">1h %</span>
                    <span className="mp-th mp-th--change">24h %</span>
                    <span className="mp-th mp-th--change">7d %</span>
                    <span className="mp-th mp-th--mcap">Market Cap</span>
                    <span className="mp-th mp-th--sparkline">7D Chart</span>
                </div>

                {filtered.map(coin => (
                    <div key={coin.id} className="mp-table__row">
                        <span className="mp-td mp-td--rank">{coin.rank}</span>
                        <span className="mp-td mp-td--name">
                            <img src={coin.image} alt="" className="mp-coin-icon" />
                            <span className="mp-coin-name">{coin.name}</span>
                            <span className="mp-coin-symbol">{coin.symbol}</span>
                        </span>
                        <span className="mp-td mp-td--price">${formatPrice(coin.price)}</span>
                        <span className={`mp-td mp-td--change ${coin.change1h >= 0 ? 'mp-green' : 'mp-red'}`}>
                            <ChangeIcon value={coin.change1h} /> {Math.abs(coin.change1h || 0).toFixed(2)}%
                        </span>
                        <span className={`mp-td mp-td--change ${coin.change24h >= 0 ? 'mp-green' : 'mp-red'}`}>
                            <ChangeIcon value={coin.change24h} /> {Math.abs(coin.change24h || 0).toFixed(2)}%
                        </span>
                        <span className={`mp-td mp-td--change ${coin.change7d >= 0 ? 'mp-green' : 'mp-red'}`}>
                            <ChangeIcon value={coin.change7d} /> {Math.abs(coin.change7d || 0).toFixed(2)}%
                        </span>
                        <span className="mp-td mp-td--mcap">{formatNum(coin.marketCap, 0)}</span>
                        <span className="mp-td mp-td--sparkline">
                            {coin.sparkline?.length > 0 && (
                                <MiniSparkline data={coin.sparkline} color={coin.change7d >= 0 ? '#0ecb81' : '#f6465d'} />
                            )}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Mini sparkline SVG
function MiniSparkline({ data, color = '#0ecb81', width = 80, height = 28 }) {
    if (!data || data.length < 2) return null;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const step = width / (data.length - 1);
    const points = data.map((v, i) => `${i * step},${height - ((v - min) / range) * height}`).join(' ');
    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="mp-sparkline-svg">
            <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" />
        </svg>
    );
}

// ========================================
// STOCKS TAB
// ========================================
function StocksTab({ searchQuery }) {
    const fetchFn = useCallback(() => fetchStockIndices(), []);
    const { data: stocks, loading, lastUpdated, refresh } = useAutoRefresh(fetchFn, 5 * 60 * 1000, []);

    const filtered = (stocks || []).filter(s =>
        !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading && !stocks?.length) {
        return <div className="mp-loading"><RefreshCw size={18} className="spinning" /> Loading stock data...</div>;
    }

    if (!stocks?.length) {
        return (
            <div className="mp-empty">
                <WifiOff size={24} />
                <span>Stock data unavailable</span>
                <span className="mp-empty__hint">Add FINNHUB_KEY to Vercel env vars (free at finnhub.io)</span>
            </div>
        );
    }

    return (
        <div className="mp-tab-content fade-in">
            <div className="mp-tab-header">
                <span className="mp-tab-count">{filtered.length} instruments</span>
                <button className="market-panel__refresh" onClick={refresh}>
                    <RefreshCw size={12} className={loading ? 'spinning' : ''} />
                    {lastUpdated && <span>{lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>}
                </button>
            </div>

            <div className="mp-stocks-grid">
                {filtered.map(stock => (
                    <div key={stock.symbol} className="mp-stock-card">
                        <div className="mp-stock-card__header">
                            <span className="mp-stock-card__icon">{stock.icon}</span>
                            <div>
                                <span className="mp-stock-card__symbol">{stock.symbol}</span>
                                <span className="mp-stock-card__name">{stock.name}</span>
                            </div>
                            <span className="mp-stock-card__sector">{stock.sector}</span>
                        </div>
                        <div className="mp-stock-card__price">${formatPrice(stock.price)}</div>
                        <div className={`mp-stock-card__change ${stock.changePercent >= 0 ? 'mp-green' : 'mp-red'}`}>
                            <ChangeIcon value={stock.changePercent} />
                            <span>${Math.abs(stock.change).toFixed(2)}</span>
                            <span>({Math.abs(stock.changePercent).toFixed(2)}%)</span>
                        </div>
                        <div className="mp-stock-card__range">
                            <span>L: ${formatPrice(stock.low)}</span>
                            <span>H: ${formatPrice(stock.high)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ========================================
// FOREX TAB (existing, refactored)
// ========================================
function ForexTab({ searchQuery }) {
    const { snapshot, loading, lastUpdated, refresh } = useGlobalData();
    const [activeRegion, setActiveRegion] = useState('All');

    // snapshot.forex is already a flat array: [{pair, value, change, changePercent, flag, region}, ...]
    const pairs = snapshot?.forex || [];

    const filtered = pairs.filter(p => {
        const matchRegion = activeRegion === 'All' || p.region === activeRegion;
        const matchSearch = !searchQuery || p.pair.toLowerCase().includes(searchQuery.toLowerCase());
        return matchRegion && matchSearch;
    });

    return (
        <div className="mp-tab-content fade-in">
            <div className="mp-tab-header">
                <div className="mp-region-tabs">
                    {FOREX_REGIONS.map(r => (
                        <button key={r} className={`mp-region-tab ${activeRegion === r ? 'mp-region-tab--active' : ''}`}
                            onClick={() => setActiveRegion(r)}>
                            {r}
                        </button>
                    ))}
                </div>
                <span className="mp-tab-count">{filtered.length} pairs</span>
            </div>

            <div className="mp-table">
                <div className="mp-table__head">
                    <span className="mp-th mp-th--name">Pair</span>
                    <span className="mp-th mp-th--price">Rate</span>
                    <span className="mp-th mp-th--change">Change %</span>
                    <span className="mp-th mp-th--region">Region</span>
                </div>
                {filtered.map(p => (
                    <div key={p.pair} className="mp-table__row">
                        <span className="mp-td mp-td--name">
                            <span className="mp-forex-flag">{p.flag}</span>
                            <span className="mp-coin-name">{p.pair}</span>
                        </span>
                        <span className="mp-td mp-td--price">{p.value?.toFixed(4)}</span>
                        <span className={`mp-td mp-td--change ${p.changePercent >= 0 ? 'mp-green' : 'mp-red'}`}>
                            <ChangeIcon value={p.changePercent} /> {Math.abs(p.changePercent || 0).toFixed(2)}%
                        </span>
                        <span className="mp-td mp-td--region">{p.region}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ========================================
// COMMODITIES TAB (existing, refactored)
// ========================================
function CommoditiesTab() {
    const { snapshot, loading, lastUpdated, refresh } = useGlobalData();
    const [activeInstrument, setActiveInstrument] = useState('gold');
    const [chartType, setChartType] = useState('area');

    const getInstrumentData = (key) => {
        if (!snapshot) return null;
        switch (key) {
            case 'gold': return snapshot.gold;
            case 'wti': return snapshot.oil?.wti;
            case 'brent': return snapshot.oil?.brent;
            default: return null;
        }
    };

    const getChartData = () => {
        if (!snapshot) return [];
        const active = activeInstrument;
        if (active === 'gold' && snapshot.gold?.history) {
            return snapshot.gold.history.map(h => ({
                time: h.date,
                value: h.value,
                open: h.value * 0.999, high: h.value * 1.002,
                low: h.value * 0.998, close: h.value,
            }));
        }
        if (active === 'wti' && snapshot.oil?.wtiHistory) {
            return snapshot.oil.wtiHistory.map(h => ({
                time: h.date,
                value: h.value,
                open: h.value * 0.998, high: h.value * 1.003,
                low: h.value * 0.997, close: h.value,
            }));
        }
        if (active === 'brent' && snapshot.oil?.brentHistory) {
            return snapshot.oil.brentHistory.map(h => ({
                time: h.date,
                value: h.value,
                open: h.value * 0.998, high: h.value * 1.003,
                low: h.value * 0.997, close: h.value,
            }));
        }
        return [];
    };

    const activeData = getInstrumentData(activeInstrument);
    const activeMeta = COMMODITY_INSTRUMENTS.find(i => i.key === activeInstrument);

    return (
        <div className="mp-tab-content fade-in">
            {/* Commodity ticker cards */}
            <div className="mp-ticker-row">
                {COMMODITY_INSTRUMENTS.map(inst => {
                    const d = getInstrumentData(inst.key);
                    return (
                        <button key={inst.key}
                            className={`mp-ticker-card ${activeInstrument === inst.key ? 'mp-ticker-card--active' : ''}`}
                            onClick={() => setActiveInstrument(inst.key)}
                            style={{ '--accent': inst.accent }}>
                            <div className="mp-ticker-card__top">
                                <inst.icon size={14} />
                                <span className="mp-ticker-card__symbol">{inst.symbol}</span>
                            </div>
                            <div className="mp-ticker-card__price">
                                {d ? `$${formatPrice(d.price)}` : '—'}
                            </div>
                            {d && (
                                <div className={`mp-ticker-card__change ${d.changePercent >= 0 ? 'mp-green' : 'mp-red'}`}>
                                    <ChangeIcon value={d.changePercent} />
                                    <span>{Math.abs(d.changePercent || 0).toFixed(2)}%</span>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Chart type toggle */}
            <div className="mp-chart-controls">
                <span className="mp-chart-title">
                    {activeMeta?.title || 'Chart'}
                    {activeData && (
                        <span className={getChangeColor(activeData.changePercent)}>
                            {' '}{activeData.change >= 0 ? '+' : ''}{activeData.change?.toFixed(2)} ({activeData.changePercent?.toFixed(2)}%)
                        </span>
                    )}
                </span>
                <div className="mp-chart-toggles">
                    {[
                        { type: 'area', icon: BarChart3 },
                        { type: 'candlestick', icon: CandlestickChart },
                        { type: 'line', icon: LineChart },
                    ].map(({ type, icon: Icon }) => (
                        <button key={type}
                            className={`mp-chart-toggle ${chartType === type ? 'mp-chart-toggle--active' : ''}`}
                            onClick={() => setChartType(type)}>
                            <Icon size={14} />
                        </button>
                    ))}
                </div>
            </div>

            {/* TradingView chart */}
            <div className="mp-chart-container">
                <TradingChart
                    data={getChartData()}
                    chartType={chartType}
                    color={activeMeta?.accent || CHART_COLORS.ACCENT}
                    height={350}
                />
            </div>
        </div>
    );
}

// ========================================
// MAIN MARKET PANEL
// ========================================
export default function MarketPanel() {
    const [activeTab, setActiveTab] = useState('crypto');
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="mp fade-in">
            {/* Header */}
            <div className="mp-header">
                <div className="mp-header__left">
                    <BarChart3 size={18} style={{ color: 'var(--accent-blue)' }} />
                    <h2 className="mp-header__title">Markets</h2>
                    <span className="badge badge-green"><Wifi size={10} /> Live</span>
                </div>
                <div className="mp-header__right">
                    <div className="mp-search">
                        <Search size={13} />
                        <input type="text" placeholder="Search markets..."
                            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                            className="mp-search__input" />
                    </div>
                </div>
            </div>

            {/* Market category tabs */}
            <div className="mp-market-tabs">
                {MARKET_TABS.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button key={tab.id}
                            className={`mp-market-tab ${activeTab === tab.id ? 'mp-market-tab--active' : ''}`}
                            onClick={() => { setActiveTab(tab.id); setSearchQuery(''); }}
                            style={{ '--tab-color': tab.color }}>
                            <Icon size={14} />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Tab content */}
            {activeTab === 'crypto' && <CryptoTab searchQuery={searchQuery} />}
            {activeTab === 'stocks' && <StocksTab searchQuery={searchQuery} />}
            {activeTab === 'forex' && <ForexTab searchQuery={searchQuery} />}
            {activeTab === 'commodities' && <CommoditiesTab />}
        </div>
    );
}
