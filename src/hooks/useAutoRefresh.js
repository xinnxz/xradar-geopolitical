// ========================================
// Custom Hook: useAutoRefresh
// Auto-refresh data pada interval tertentu
// ========================================

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook untuk fetch data dan auto-refresh pada interval
 *
 * @param {Function} fetchFn - Async function untuk fetch data
 * @param {number} interval - Interval refresh dalam ms (default 5 menit)
 * @param {Array} deps - Dependencies array (re-fetch saat berubah)
 * @returns {Object} { data, loading, error, lastUpdated, refresh }
 *
 * Penjelasan:
 * - `data` = data yang sudah di-fetch
 * - `loading` = true saat sedang fetch (termasuk initial load)
 * - `error` = error message jika fetch gagal
 * - `lastUpdated` = timestamp kapan data terakhir di-update  
 * - `refresh` = function untuk manual refresh
 */
export function useAutoRefresh(fetchFn, interval = 5 * 60 * 1000, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const intervalRef = useRef(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      setError(null);

      const result = await fetchFn();

      // Cek apakah component masih mounted sebelum setState
      if (mountedRef.current) {
        setData(result);
        setLastUpdated(new Date());
        setLoading(false);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err.message || 'Failed to fetch data');
        setLoading(false);
      }
    }
  }, [fetchFn]);

  // Initial fetch + setup interval
  useEffect(() => {
    mountedRef.current = true;
    fetchData(true);

    // Set up auto-refresh interval
    if (interval > 0) {
      intervalRef.current = setInterval(() => fetchData(false), interval);
    }

    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [...deps, interval]);

  // Manual refresh function
  const refresh = useCallback(() => fetchData(true), [fetchData]);

  return { data, loading, error, lastUpdated, refresh };
}
