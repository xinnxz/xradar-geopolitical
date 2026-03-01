// ========================================
// Formatting Utilities
// ========================================

/**
 * Format angka sebagai currency
 * @param {number} value - Nilai angka
 * @param {string} currency - Kode mata uang (default: USD)
 * @param {number} decimals - Jumlah desimal
 */
export function formatCurrency(value, currency = 'USD', decimals = 2) {
  if (value == null || isNaN(value)) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format angka besar (1K, 1M, 1B, dst.)
 */
export function formatCompact(value) {
  if (value == null || isNaN(value)) return '—';
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * Format persentase perubahan
 * @param {number} value - Nilai persentase
 */
export function formatPercent(value) {
  if (value == null || isNaN(value)) return '—';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

/**
 * Format tanggal relatif (e.g., "2 hours ago")
 */
export function formatTimeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Format tanggal lengkap
 */
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format waktu
 */
export function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/**
 * Format angka dengan separator ribuan
 */
export function formatNumber(value, decimals = 2) {
  if (value == null || isNaN(value)) return '—';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Tentukan warna berdasarkan value (positive = green, negative = red)
 */
export function getChangeColor(value) {
  if (value > 0) return 'var(--accent-green)';
  if (value < 0) return 'var(--accent-red)';
  return 'var(--text-muted)';
}

/**
 * Tentukan class badge berdasarkan sentiment
 */
export function getSentimentBadge(sentiment) {
  switch (sentiment?.toLowerCase()) {
    case 'positive': return 'badge-green';
    case 'negative': return 'badge-red';
    case 'neutral':
    default: return 'badge-blue';
  }
}
