// ========================================
// Global Data Hook — shared across all components
// Computes live risk score from real data
// ========================================

import { useState, useEffect, useCallback, useMemo, createContext, useContext } from 'react';
import { fetchPriceSnapshot } from '../services/marketService';
import { fetchNews } from '../services/newsService';
import { fetchConflictEvents, buildConflictZones } from '../services/conflictService';
import { calculateRiskScore, generateRiskHistory } from '../utils/riskCalculator';
import { REFRESH_INTERVALS } from '../utils/constants';

const GlobalDataContext = createContext(null);

export function GlobalDataProvider({ children }) {
    const [snapshot, setSnapshot] = useState(null);
    const [news, setNews] = useState([]);
    const [conflicts, setConflicts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchAll = useCallback(async () => {
        try {
            const [snap, newsData, conflictData] = await Promise.all([
                fetchPriceSnapshot(),
                fetchNews('all'),
                fetchConflictEvents(90),
            ]);
            setSnapshot(snap);
            setNews(newsData || []);
            setConflicts(conflictData || []);
            setLastUpdated(new Date());
        } catch (e) {
            console.error('Global data fetch error:', e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAll();
        const interval = setInterval(fetchAll, REFRESH_INTERVALS.RISK);
        return () => clearInterval(interval);
    }, [fetchAll]);

    // Compute live risk from real data
    const risk = useMemo(() => {
        const negCount = news.filter(n => n.sentiment === 'negative').length;
        const negPercent = news.length > 0 ? (negCount / news.length) * 100 : 50;

        return calculateRiskScore({
            conflictEvents: conflicts.length,
            oilChange: snapshot?.oil?.wti?.changePercent || 0,
            goldChange: snapshot?.gold?.changePercent || 0,
            negativeNewsPercent: negPercent,
            breakingNewsCount: news.length,
        });
    }, [snapshot, news, conflicts]);

    // Conflict zones from real data
    const zones = useMemo(() => {
        return conflicts.length > 0 ? buildConflictZones(conflicts) : [];
    }, [conflicts]);

    // Seed-based risk history (consistent per day, not random)
    const riskHistory = useMemo(() => generateRiskHistory(30, risk.score), [risk.score]);

    const value = useMemo(() => ({
        snapshot,
        news,
        conflicts,
        zones,
        risk,
        riskHistory,
        loading,
        lastUpdated,
        refresh: fetchAll,
    }), [snapshot, news, conflicts, zones, risk, riskHistory, loading, lastUpdated, fetchAll]);

    return (
        <GlobalDataContext.Provider value={value}>
            {children}
        </GlobalDataContext.Provider>
    );
}

export function useGlobalData() {
    const ctx = useContext(GlobalDataContext);
    if (!ctx) throw new Error('useGlobalData must be inside GlobalDataProvider');
    return ctx;
}
