import { useState, useEffect, useRef } from 'react';
import { Shield, ChevronDown, AlertTriangle, Activity } from 'lucide-react';
import './DefconBadge.css';

/**
 * 🔰 DEFCON BADGE — Indikator level risiko geopolitik global
 * Terinspirasi dari WorldMonitor PizzIntIndicator.ts
 *
 * Level 1 (CRITICAL): Merah berkedip — perang nuklir imminent
 * Level 2 (SEVERE):   Merah — eskalasi mayor aktif
 * Level 3 (ELEVATED): Oranye — ketegangan tinggi
 * Level 4 (GUARDED):  Kuning — aktivitas abnormal
 * Level 5 (NORMAL):   Hijau — stabil
 */

const DEFCON_LEVELS = [
    {
        level: 1, label: 'CRITICAL', sublabel: 'Maximum Readiness',
        color: '#ef4444', glow: 'rgba(239, 68, 68, 0.4)',
        desc: 'Nuclear war imminent or active WMD deployment detected',
        pulse: true,
    },
    {
        level: 2, label: 'SEVERE', sublabel: 'Armed Forces Ready',
        color: '#f97316', glow: 'rgba(249, 115, 22, 0.3)',
        desc: 'Major military escalation or large-scale conflict expansion',
        pulse: true,
    },
    {
        level: 3, label: 'ELEVATED', sublabel: 'Increase Readiness',
        color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.25)',
        desc: 'Significant tensions, troop buildups, or proxy conflicts',
        pulse: false,
    },
    {
        level: 4, label: 'GUARDED', sublabel: 'Above Normal',
        color: '#06b6d4', glow: 'rgba(6, 182, 212, 0.2)',
        desc: 'Elevated diplomatic tensions, sanctions, or cyber incidents',
        pulse: false,
    },
    {
        level: 5, label: 'NORMAL', sublabel: 'Lowest Readiness',
        color: '#10b981', glow: 'rgba(16, 185, 129, 0.2)',
        desc: 'Baseline global stability. Normal diplomatic activity',
        pulse: false,
    },
];

/**
 * Menghitung DEFCON level berdasarkan data yang tersedia
 * Ini versi sederhana — nanti bisa di-enhance dengan AI scoring
 */
function calculateDefconLevel(events = [], conflictCount = 0) {
    const totalFatalities = events.reduce((sum, e) => sum + (e.fatalities || 0), 0);
    const battleCount = events.filter(e => e.type === 'battle' || e.type === 'explosion').length;

    // Scoring sederhana berdasarkan jumlah event dan fatalities
    if (totalFatalities > 500 || battleCount > 50) return 2;   // SEVERE
    if (totalFatalities > 100 || battleCount > 20) return 3;   // ELEVATED
    if (conflictCount > 5 || battleCount > 5) return 4;        // GUARDED
    return 5;                                                    // NORMAL

    // Level 1 (CRITICAL) hanya di-set manual atau dari intel khusus
}

export default function DefconBadge({ events = [], conflictCount = 0 }) {
    const [expanded, setExpanded] = useState(false);
    const [currentLevel, setCurrentLevel] = useState(5);
    const badgeRef = useRef(null);

    useEffect(() => {
        const level = calculateDefconLevel(events, conflictCount);
        setCurrentLevel(level);
    }, [events, conflictCount]);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(e) {
            if (badgeRef.current && !badgeRef.current.contains(e.target)) {
                setExpanded(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const defcon = DEFCON_LEVELS.find(d => d.level === currentLevel) || DEFCON_LEVELS[4];

    return (
        <div className="defcon-badge" ref={badgeRef}>
            {/* Main Badge Button */}
            <button
                className={`defcon-badge__trigger ${defcon.pulse ? 'pulse' : ''}`}
                style={{
                    '--defcon-color': defcon.color,
                    '--defcon-glow': defcon.glow,
                }}
                onClick={() => setExpanded(!expanded)}
                title={`DEFCON ${defcon.level} — ${defcon.label}`}
            >
                <Shield size={16} />
                <span className="defcon-badge__level">DEFCON {defcon.level}</span>
                <span className="defcon-badge__label" style={{ color: defcon.color }}>
                    {defcon.label}
                </span>
                <ChevronDown size={12} className={`defcon-badge__chevron ${expanded ? 'open' : ''}`} />
            </button>

            {/* Expanded Detail Panel */}
            {expanded && (
                <div className="defcon-badge__panel">
                    <div className="defcon-badge__header">
                        <AlertTriangle size={16} style={{ color: defcon.color }} />
                        <span>Global Threat Assessment</span>
                    </div>

                    {/* Current Level Detail */}
                    <div className="defcon-badge__current" style={{ borderColor: defcon.color }}>
                        <div className="defcon-badge__current-level" style={{ color: defcon.color }}>
                            DEFCON {defcon.level}
                        </div>
                        <div className="defcon-badge__current-label">{defcon.label} — {defcon.sublabel}</div>
                        <div className="defcon-badge__current-desc">{defcon.desc}</div>
                    </div>

                    {/* All Levels */}
                    <div className="defcon-badge__levels">
                        {DEFCON_LEVELS.map(d => (
                            <div
                                key={d.level}
                                className={`defcon-level-row ${d.level === currentLevel ? 'active' : ''}`}
                            >
                                <div
                                    className="defcon-level-dot"
                                    style={{ background: d.color, boxShadow: d.level === currentLevel ? `0 0 8px ${d.glow}` : 'none' }}
                                />
                                <span className="defcon-level-num">{d.level}</span>
                                <span className="defcon-level-label" style={{ color: d.level === currentLevel ? d.color : undefined }}>
                                    {d.label}
                                </span>
                                {d.level === currentLevel && (
                                    <Activity size={10} style={{ color: d.color, marginLeft: 'auto' }} />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Data Source Info */}
                    <div className="defcon-badge__source">
                        Based on {events.length} events • {conflictCount} active conflicts
                    </div>
                </div>
            )}
        </div>
    );
}
