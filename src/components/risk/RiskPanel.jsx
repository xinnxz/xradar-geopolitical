import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { ShieldAlert, Activity, Newspaper, Swords, TrendingUp } from 'lucide-react';
import { useGlobalData } from '../../hooks/useGlobalData';
import { CHART_COLORS } from '../../utils/constants';
import './RiskPanel.css';

function RiskGauge({ score, level, color }) {
    const radius = 80;
    const circumference = Math.PI * radius;
    const progress = (score / 100) * circumference;

    return (
        <div className="risk-gauge">
            <svg viewBox="0 0 200 120" className="risk-gauge__svg">
                <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="var(--border-color)"
                    strokeWidth="12"
                    strokeLinecap="round"
                />
                <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke={color}
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${progress} ${circumference}`}
                    style={{ transition: 'stroke-dasharray 1s ease, stroke 0.5s ease' }}
                />
                <text x="100" y="85" textAnchor="middle" className="risk-gauge__score" fill={color}>
                    {score}
                </text>
                <text x="100" y="105" textAnchor="middle" className="risk-gauge__label" fill="var(--text-muted)">
                    / 100
                </text>
            </svg>
            <div className="risk-gauge__level" style={{ color }}>
                <ShieldAlert size={18} />
                {level}
            </div>
        </div>
    );
}

function FactorCard({ icon: Icon, label, score, color, description }) {
    return (
        <div className="factor-card card">
            <div className="factor-card__header">
                <div className="factor-card__icon" style={{ background: `${color}20`, color }}>
                    <Icon size={16} />
                </div>
                <span className="factor-card__label">{label}</span>
            </div>
            <div className="factor-card__bar-track">
                <div
                    className="factor-card__bar-fill"
                    style={{ width: `${score}%`, background: color, transition: 'width 1s ease' }}
                />
            </div>
            <div className="factor-card__footer">
                <span className="factor-card__score" style={{ color }}>{score}/100</span>
                <span className="factor-card__desc">{description}</span>
            </div>
        </div>
    );
}

export default function RiskPanel() {
    const { risk, riskHistory, conflicts, news, snapshot, loading } = useGlobalData();

    // Build dynamic descriptions from real data
    const conflictCountries = new Set(conflicts.map(e => e.country));
    const negCount = news.filter(n => n.sentiment === 'negative').length;
    const negPercent = news.length > 0 ? Math.round((negCount / news.length) * 100) : 0;
    const oilChange = snapshot?.oil?.wti?.changePercent?.toFixed(1) || '0.0';
    const goldChange = snapshot?.gold?.changePercent?.toFixed(1) || '0.0';

    const radarData = [
        { subject: 'Conflict', value: risk.factors.conflict },
        { subject: 'Volatility', value: risk.factors.volatility },
        { subject: 'Sentiment', value: risk.factors.sentiment },
        { subject: 'Events', value: risk.factors.events },
    ];

    if (loading) {
        return (
            <div className="risk-panel fade-in">
                <div className="risk-panel__top">
                    <div className="risk-panel__gauge card">
                        <div className="skeleton" style={{ width: '100%', height: 200, borderRadius: 8 }} />
                    </div>
                    <div className="risk-panel__radar card">
                        <div className="skeleton" style={{ width: '100%', height: 200, borderRadius: 8 }} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="risk-panel fade-in">
            <div className="risk-panel__top">
                {/* Gauge */}
                <div className="risk-panel__gauge card">
                    <h3 className="section-title">
                        <ShieldAlert size={16} style={{ color: risk.color }} />
                        Global Risk Index
                    </h3>
                    <RiskGauge score={risk.score} level={risk.level} color={risk.color} />
                    <p className="risk-panel__description">
                        Composite risk score computed from <strong>{conflicts.length}</strong> conflict events,
                        commodity volatility, and <strong>{news.length}</strong> news articles.
                    </p>
                </div>

                {/* Radar Chart */}
                <div className="risk-panel__radar card">
                    <h3 className="section-title">
                        <Activity size={16} style={{ color: CHART_COLORS.blue }} />
                        Risk Factor Breakdown
                    </h3>
                    <ResponsiveContainer width="100%" height={240}>
                        <RadarChart data={radarData}>
                            <PolarGrid stroke="var(--border-color)" />
                            <PolarAngleAxis dataKey="subject" />
                            <PolarRadiusAxis domain={[0, 100]} tick={false} />
                            <Radar
                                name="Risk"
                                dataKey="value"
                                stroke={CHART_COLORS.blue}
                                fill={CHART_COLORS.blue}
                                fillOpacity={0.2}
                                strokeWidth={2}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Factor Cards — all descriptions generated from real data */}
            <div className="risk-panel__factors">
                <FactorCard
                    icon={Swords}
                    label="Conflict Intensity"
                    score={risk.factors.conflict}
                    color={CHART_COLORS.red}
                    description={`${conflicts.length} events across ${conflictCountries.size} countries`}
                />
                <FactorCard
                    icon={TrendingUp}
                    label="Market Volatility"
                    score={risk.factors.volatility}
                    color={CHART_COLORS.orange}
                    description={`Oil ${oilChange}%, Gold ${goldChange}%`}
                />
                <FactorCard
                    icon={Newspaper}
                    label="News Sentiment"
                    score={risk.factors.sentiment}
                    color={CHART_COLORS.purple}
                    description={`${negPercent}% negative across ${news.length} articles`}
                />
                <FactorCard
                    icon={Activity}
                    label="Event Frequency"
                    score={risk.factors.events}
                    color={CHART_COLORS.gold}
                    description={`${news.length} news articles monitored`}
                />
            </div>

            {/* Timeline Chart */}
            <div className="risk-panel__timeline card">
                <h3 className="section-title">
                    <Activity size={16} style={{ color: CHART_COLORS.blue }} />
                    Risk Score — 30 Day Trend
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={riskHistory} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="gradRisk" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={risk.color} stopOpacity={0.3} />
                                <stop offset="100%" stopColor={risk.color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={6} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                        <Tooltip
                            contentStyle={{
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-md)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.8rem',
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="score"
                            name="Risk Score"
                            stroke={risk.color}
                            fill="url(#gradRisk)"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
