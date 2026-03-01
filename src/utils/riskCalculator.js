// ========================================
// Geopolitical Risk Score Calculator
// ========================================
// Formula:
// Risk = (0.3 × Conflict) + (0.3 × Volatility) + (0.2 × Sentiment) + (0.2 × EventCount)
// Semua faktor dinormalisasi ke skala 0-100.

import { RISK_LEVELS } from './constants';

/**
 * Hitung skor risiko geopolitik dari berbagai faktor
 * @param {Object} factors
 * @param {number} factors.conflictEvents - Jumlah konflik event dalam 7 hari
 * @param {number} factors.oilChange - % perubahan harga minyak
 * @param {number} factors.goldChange - % perubahan harga emas
 * @param {number} factors.negativeNewsPercent - % berita negatif (0-100)
 * @param {number} factors.breakingNewsCount - Jumlah breaking news
 * @returns {Object} { score, level, label, color, factors }
 */
export function calculateRiskScore({
  conflictEvents = 0,
  oilChange = 0,
  goldChange = 0,
  negativeNewsPercent = 0,
  breakingNewsCount = 0,
}) {
  // Normalisasi conflict intensity (0-100)
  // Asumsi: 200+ konflik dalam 7 hari = skor 100
  const conflictScore = Math.min(100, (conflictEvents / 200) * 100);

  // Normalisasi market volatility (0-100)
  // Gabungan volatilitas minyak + emas
  // Asumsi: perubahan >10% = skor 100
  const oilVolatility = Math.min(100, (Math.abs(oilChange) / 10) * 100);
  const goldVolatility = Math.min(100, (Math.abs(goldChange) / 10) * 100);
  const marketVolatility = (oilVolatility + goldVolatility) / 2;

  // Normalisasi sentiment (sudah 0-100)
  const sentimentScore = Math.min(100, negativeNewsPercent);

  // Normalisasi event count (0-100)
  // Asumsi: 50+ breaking news = skor 100
  const eventScore = Math.min(100, (breakingNewsCount / 50) * 100);

  // Hitung weighted average
  const score = Math.round(
    0.3 * conflictScore +
    0.3 * marketVolatility +
    0.2 * sentimentScore +
    0.2 * eventScore
  );

  // Tentukan level risiko
  const level = getRiskLevel(score);

  return {
    score,
    level: level.label,
    color: level.color,
    factors: {
      conflict: Math.round(conflictScore),
      volatility: Math.round(marketVolatility),
      sentiment: Math.round(sentimentScore),
      events: Math.round(eventScore),
    },
  };
}

/**
 * Tentukan level risiko berdasarkan skor
 */
function getRiskLevel(score) {
  if (score <= 25) return RISK_LEVELS.LOW;
  if (score <= 50) return RISK_LEVELS.MODERATE;
  if (score <= 75) return RISK_LEVELS.HIGH;
  return RISK_LEVELS.CRITICAL;
}

/**
 * Generate data historis risk score (mock)
 */
export function generateRiskHistory(days = 30) {
  const data = [];
  const now = new Date();
  let baseScore = 45;

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Random walk dengan trend naik
    baseScore += (Math.random() - 0.45) * 8;
    baseScore = Math.max(10, Math.min(95, baseScore));

    data.push({
      date: date.toISOString().split('T')[0],
      score: Math.round(baseScore),
    });
  }

  return data;
}
