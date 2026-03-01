// ========================================
// TradingChart — Professional Candlestick Chart
// Uses TradingView lightweight-charts v5
// Binance/OKX-style dark theme
// ========================================

import { useEffect, useRef, useState, useCallback } from 'react';
import {
    createChart,
    ColorType,
    CrosshairMode,
    CandlestickSeries,
    AreaSeries,
    LineSeries,
    HistogramSeries,
} from 'lightweight-charts';

/**
 * Professional candlestick chart with volume overlay
 *
 * @param {Object} props
 * @param {Array} props.data - [{time: 'YYYY-MM-DD', open, high, low, close, volume?}]
 * @param {string} props.symbol - e.g. 'XAUUSD'
 * @param {string} props.title - e.g. 'Gold Spot'
 * @param {'candlestick'|'area'|'line'} props.chartType - default 'candlestick'
 * @param {number} props.height - chart height in px
 * @param {string} props.accentColor - e.g. '#f0b90b'
 */
export default function TradingChart({
    data = [],
    symbol = '',
    title = '',
    chartType = 'candlestick',
    height = 400,
    accentColor = '#f0b90b',
    precision = 2,
}) {
    const containerRef = useRef(null);
    const chartRef = useRef(null);
    const seriesRef = useRef(null);
    const volumeRef = useRef(null);
    const [crosshairData, setCrosshairData] = useState(null);

    const initChart = useCallback(() => {
        if (!containerRef.current || data.length === 0) return;

        // Destroy previous chart
        if (chartRef.current) {
            chartRef.current.remove();
            chartRef.current = null;
        }

        const chart = createChart(containerRef.current, {
            width: containerRef.current.clientWidth,
            height,
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: '#848e9c',
                fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
                fontSize: 11,
            },
            grid: {
                vertLines: { color: 'rgba(42, 46, 57, 0.6)', style: 1 },
                horzLines: { color: 'rgba(42, 46, 57, 0.6)', style: 1 },
            },
            crosshair: {
                mode: CrosshairMode.Normal,
                vertLine: {
                    color: 'rgba(224, 227, 235, 0.15)',
                    width: 1,
                    style: 3,
                    labelBackgroundColor: '#1e222d',
                },
                horzLine: {
                    color: 'rgba(224, 227, 235, 0.15)',
                    width: 1,
                    style: 3,
                    labelBackgroundColor: '#1e222d',
                },
            },
            rightPriceScale: {
                borderColor: 'rgba(42, 46, 57, 0.8)',
                scaleMargins: { top: 0.05, bottom: 0.2 },
                textColor: '#848e9c',
            },
            timeScale: {
                borderColor: 'rgba(42, 46, 57, 0.8)',
                timeVisible: false,
                secondsVisible: false,
                fixLeftEdge: true,
                fixRightEdge: true,
            },
            handleScroll: { vertTouchDrag: false },
            handleScale: { axisPressedMouseMove: false },
        });

        chartRef.current = chart;

        // Main series — v5 API: chart.addSeries(SeriesType, options)
        let mainSeries;
        const priceFormat = { type: 'price', precision, minMove: Math.pow(10, -precision) };

        if (chartType === 'candlestick') {
            mainSeries = chart.addSeries(CandlestickSeries, {
                upColor: '#0ecb81',
                downColor: '#f6465d',
                borderUpColor: '#0ecb81',
                borderDownColor: '#f6465d',
                wickUpColor: '#0ecb81',
                wickDownColor: '#f6465d',
                priceFormat,
            });
        } else if (chartType === 'area') {
            mainSeries = chart.addSeries(AreaSeries, {
                topColor: `${accentColor}40`,
                bottomColor: `${accentColor}05`,
                lineColor: accentColor,
                lineWidth: 2,
                priceFormat,
                crosshairMarkerVisible: true,
                crosshairMarkerRadius: 4,
                crosshairMarkerBorderColor: accentColor,
                crosshairMarkerBackgroundColor: '#131722',
            });
        } else {
            mainSeries = chart.addSeries(LineSeries, {
                color: accentColor,
                lineWidth: 2,
                priceFormat,
                crosshairMarkerVisible: true,
                crosshairMarkerRadius: 4,
            });
        }

        seriesRef.current = mainSeries;

        // Set data
        if (chartType === 'candlestick') {
            mainSeries.setData(data.map(d => ({
                time: d.time,
                open: d.open,
                high: d.high,
                low: d.low,
                close: d.close,
            })));
        } else {
            mainSeries.setData(data.map(d => ({
                time: d.time,
                value: d.close ?? d.value ?? d.price,
            })));
        }

        // Volume histogram (if data has volume)
        const hasVolume = data.some(d => d.volume != null);
        if (hasVolume) {
            const volumeSeries = chart.addSeries(HistogramSeries, {
                color: '#26a69a',
                priceFormat: { type: 'volume' },
                priceScaleId: 'volume',
            });

            chart.priceScale('volume').applyOptions({
                scaleMargins: { top: 0.85, bottom: 0 },
                drawTicks: false,
                borderVisible: false,
            });

            volumeSeries.setData(data.map(d => ({
                time: d.time,
                value: d.volume || 0,
                color: (d.close ?? 0) >= (d.open ?? 0)
                    ? 'rgba(14, 203, 129, 0.25)'
                    : 'rgba(246, 70, 93, 0.25)',
            })));

            volumeRef.current = volumeSeries;
        }

        // Crosshair move handler
        chart.subscribeCrosshairMove((param) => {
            if (!param.time || !param.seriesData?.size) {
                setCrosshairData(null);
                return;
            }
            const seriesData = param.seriesData.get(mainSeries);
            if (seriesData) {
                setCrosshairData({
                    time: param.time,
                    ...seriesData,
                });
            }
        });

        // Fit content
        chart.timeScale().fitContent();

        // Resize observer
        const resizeObserver = new ResizeObserver(entries => {
            const { width } = entries[0].contentRect;
            chart.applyOptions({ width });
        });
        resizeObserver.observe(containerRef.current);

        return () => {
            resizeObserver.disconnect();
            chart.remove();
        };
    }, [data, chartType, height, accentColor, precision]);

    useEffect(() => {
        const cleanup = initChart();
        return cleanup;
    }, [initChart]);

    // Current/last data point
    const lastPoint = data[data.length - 1];
    const prevPoint = data[data.length - 2];
    const displayData = crosshairData || lastPoint;
    const isUp = displayData
        ? (displayData.close ?? displayData.value ?? 0) >= (displayData.open ?? prevPoint?.close ?? 0)
        : true;

    return (
        <div className="tv-chart">
            {/* OHLC Header — Binance style */}
            <div className="tv-chart__header">
                <div className="tv-chart__symbol">
                    <span className="tv-chart__symbol-name">{symbol}</span>
                    {title && <span className="tv-chart__symbol-title">{title}</span>}
                </div>
                {displayData && (
                    <div className="tv-chart__ohlc">
                        {chartType === 'candlestick' && displayData.open != null ? (
                            <>
                                <span className="tv-chart__ohlc-item">
                                    <span className="tv-chart__ohlc-label">O</span>
                                    <span className={`tv-chart__ohlc-value ${isUp ? 'up' : 'down'}`}>
                                        {displayData.open?.toFixed(precision)}
                                    </span>
                                </span>
                                <span className="tv-chart__ohlc-item">
                                    <span className="tv-chart__ohlc-label">H</span>
                                    <span className={`tv-chart__ohlc-value ${isUp ? 'up' : 'down'}`}>
                                        {displayData.high?.toFixed(precision)}
                                    </span>
                                </span>
                                <span className="tv-chart__ohlc-item">
                                    <span className="tv-chart__ohlc-label">L</span>
                                    <span className={`tv-chart__ohlc-value ${isUp ? 'up' : 'down'}`}>
                                        {displayData.low?.toFixed(precision)}
                                    </span>
                                </span>
                                <span className="tv-chart__ohlc-item">
                                    <span className="tv-chart__ohlc-label">C</span>
                                    <span className={`tv-chart__ohlc-value ${isUp ? 'up' : 'down'}`}>
                                        {displayData.close?.toFixed(precision)}
                                    </span>
                                </span>
                            </>
                        ) : (
                            <span className="tv-chart__ohlc-item">
                                <span className={`tv-chart__ohlc-value ${isUp ? 'up' : 'down'}`} style={{ fontSize: '1rem', fontWeight: 700 }}>
                                    {(displayData.close ?? displayData.value ?? 0).toFixed(precision)}
                                </span>
                            </span>
                        )}
                        {displayData.volume != null && (
                            <span className="tv-chart__ohlc-item">
                                <span className="tv-chart__ohlc-label">Vol</span>
                                <span className="tv-chart__ohlc-value" style={{ color: '#848e9c' }}>
                                    {(displayData.volume / 1000).toFixed(1)}K
                                </span>
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Chart container */}
            <div ref={containerRef} className="tv-chart__canvas" />
        </div>
    );
}
