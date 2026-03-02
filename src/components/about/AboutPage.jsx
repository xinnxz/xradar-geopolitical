// ========================================
// About & Legal — Premium TradingView-style
// Hero, Manifesto, Stats, Features + Legal tabs
// ========================================

import { useState } from 'react';
import {
    Info, Shield, FileText, AlertTriangle, Mail, Globe,
    Bitcoin, TrendingUp, DollarSign, Fuel, MapPin, Newspaper,
    Wrench, Lock, Radio, Zap, Eye, RefreshCw, Database,
    ChevronRight, Target, Activity
} from 'lucide-react';
import './AboutPage.css';

const FEATURES = [
    { icon: Bitcoin, color: '#f7931a', title: 'Cryptocurrency', desc: '15+ coins tracked in real-time via CoinGecko' },
    { icon: TrendingUp, color: '#3b82f6', title: 'Stock Indices', desc: 'S&P 500, NASDAQ, Dow Jones, VIX Fear Index' },
    { icon: DollarSign, color: '#0ecb81', title: 'Forex', desc: '29 currency pairs from ECB exchange rates' },
    { icon: Fuel, color: '#f0b90b', title: 'Commodities', desc: 'Gold, WTI Oil, Brent Crude with live charts' },
    { icon: MapPin, color: '#f6465d', title: 'Conflict Map', desc: 'Armed conflicts from ACLED with live mapping' },
    { icon: Newspaper, color: '#8b5cf6', title: 'Live News', desc: 'Geopolitical news feed with infinite scroll' },
];

const STATS = [
    { value: '6', label: 'Market Categories' },
    { value: '50+', label: 'Instruments Tracked' },
    { value: '29', label: 'Forex Pairs' },
    { value: '24/7', label: 'Live Monitoring' },
];

const LEGAL_TABS = [
    { id: 'disclaimer', label: 'Disclaimer', icon: AlertTriangle },
    { id: 'privacy', label: 'Privacy Policy', icon: Shield },
    { id: 'terms', label: 'Terms of Use', icon: FileText },
];

export default function AboutPage() {
    const [legalTab, setLegalTab] = useState(null);

    return (
        <div className="about-page fade-in">

            {/* ── HERO ── */}
            <section className="about-hero">
                <div className="about-hero__badge">
                    <Radio size={14} /> GEOPOLITICAL INTELLIGENCE
                </div>
                <h1 className="about-hero__title">
                    Where the world<br />
                    <span className="about-hero__accent">watches risk</span>
                </h1>
                <p className="about-hero__subtitle">
                    Real-time dashboard tracking global conflicts, their economic impact,
                    and financial markets — so you can make smarter decisions in uncertain times.
                </p>
            </section>

            {/* ── STATS ── */}
            <section className="about-stats">
                {STATS.map(s => (
                    <div key={s.label} className="about-stat">
                        <span className="about-stat__value">{s.value}</span>
                        <span className="about-stat__label">{s.label}</span>
                    </div>
                ))}
            </section>

            {/* ── MANIFESTO ── */}
            <section className="about-manifesto">
                <div className="about-manifesto__block">
                    <Target size={20} className="about-manifesto__icon" />
                    <h3>Knowledge is your best defense</h3>
                    <p>
                        When tensions between nations escalate, markets react in seconds. Your investments,
                        savings, and purchasing power are directly affected. We built GlobalWar.live because
                        staying informed shouldn't require dozens of tabs and expensive subscriptions.
                    </p>
                </div>
                <div className="about-manifesto__block">
                    <Eye size={20} className="about-manifesto__icon" />
                    <h3>See the full picture</h3>
                    <p>
                        Most platforms show you markets OR news OR conflicts — never all three together.
                        We connect the dots: when a conflict erupts, you immediately see its impact on oil,
                        gold, currencies, and crypto. One dashboard, zero blind spots.
                    </p>
                </div>
                <div className="about-manifesto__block">
                    <Zap size={20} className="about-manifesto__icon" />
                    <h3>Built for speed, free forever</h3>
                    <p>
                        Sub-second load times. Real-time data from 6 premium APIs. Intelligent key rotation
                        for unlimited capacity. And it's completely free. No account needed, no paywall,
                        no tracking — just pure information.
                    </p>
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section className="about-features-section">
                <h2 className="about-section-title">
                    <Activity size={16} /> What We Track
                </h2>
                <div className="about-features-grid">
                    {FEATURES.map(f => {
                        const Icon = f.icon;
                        return (
                            <div key={f.title} className="about-fcard">
                                <div className="about-fcard__icon" style={{ color: f.color }}>
                                    <Icon size={22} />
                                </div>
                                <h4 className="about-fcard__title">{f.title}</h4>
                                <p className="about-fcard__desc">{f.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ── TECH ── */}
            <section className="about-tech">
                <h2 className="about-section-title">
                    <Database size={16} /> Technology Stack
                </h2>
                <div className="about-tech__pills">
                    {['React 18', 'Vite', 'Lightweight Charts', 'Leaflet Maps', 'Vercel', 'Serverless Functions'].map(t => (
                        <span key={t} className="about-tech__pill">{t}</span>
                    ))}
                </div>
                <p className="about-tech__note">
                    All market data fetched in real-time from public APIs with intelligent caching and
                    flexible key rotation. No user data collected.
                </p>
            </section>

            {/* ── CONTACT ── */}
            <section className="about-contact">
                <div className="about-contact__item">
                    <Mail size={15} />
                    <a href="mailto:contact@globalwar.live">contact@globalwar.live</a>
                </div>
                <div className="about-contact__item">
                    <Globe size={15} />
                    <a href="https://globalwar.live" target="_blank" rel="noopener">globalwar.live</a>
                </div>
            </section>

            {/* ── LEGAL ── */}
            <section className="about-legal">
                <div className="about-legal__tabs">
                    {LEGAL_TABS.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button key={tab.id}
                                className={`about-legal__tab ${legalTab === tab.id ? 'about-legal__tab--active' : ''}`}
                                onClick={() => setLegalTab(legalTab === tab.id ? null : tab.id)}>
                                <Icon size={13} /> {tab.label}
                                <ChevronRight size={12} className={`about-legal__chevron ${legalTab === tab.id ? 'about-legal__chevron--open' : ''}`} />
                            </button>
                        );
                    })}
                </div>
                {legalTab && (
                    <div className="about-legal__content fade-in">
                        {legalTab === 'disclaimer' && <DisclaimerContent />}
                        {legalTab === 'privacy' && <PrivacyContent />}
                        {legalTab === 'terms' && <TermsContent />}
                    </div>
                )}
            </section>

        </div>
    );
}

// ── LEGAL CONTENT ──

function DisclaimerContent() {
    return (
        <>
            <p className="about-legal__date">Last updated: March 2026</p>
            <h4>Not Financial Advice</h4>
            <p>
                The information provided on GlobalWar.live is for <strong>general informational and educational purposes only</strong>.
                It should not be construed as financial advice, investment advice, trading advice, or any other type of advice.
                Always consult with a qualified financial advisor before making investment decisions.
            </p>
            <h4>No Guarantee of Accuracy</h4>
            <p>
                We make no representations about the completeness, accuracy, or reliability of the data displayed.
                Market data is sourced from third-party APIs and may be delayed or contain errors.
            </p>
            <h4>Risk Warning</h4>
            <p>
                Trading and investing involves substantial risk of loss. Past performance is not indicative of future results.
            </p>
            <h4>Third-Party Data</h4>
            <p>
                Data aggregated from: CoinGecko, Finnhub, Frankfurter (ECB), Alpha Vantage, GNews, and ACLED.
                We are not affiliated with these services.
            </p>
        </>
    );
}

function PrivacyContent() {
    return (
        <>
            <p className="about-legal__date">Last updated: March 2026</p>
            <h4>Information We Collect</h4>
            <p>
                GlobalWar.live does <strong>not</strong> collect personal data, require registration,
                or use tracking cookies. No user information is stored on our servers.
            </p>
            <h4>Local Storage</h4>
            <p>
                We use localStorage to cache market data for performance. This data stays on your device.
            </p>
            <h4>Third-Party Services</h4>
            <p>
                Hosted on Vercel. API calls proxied through serverless functions to protect keys.
                No user-identifiable data is sent to third-party APIs.
            </p>
            <h4>Contact</h4>
            <p>
                For privacy concerns: <a href="mailto:contact@globalwar.live">contact@globalwar.live</a>
            </p>
        </>
    );
}

function TermsContent() {
    return (
        <>
            <p className="about-legal__date">Last updated: March 2026</p>
            <h4>Acceptance of Terms</h4>
            <p>
                By accessing GlobalWar.live, you agree to these Terms. If you do not agree, do not use this website.
            </p>
            <h4>Use of Service</h4>
            <p>
                The service is provided "as is" without warranties of any kind.
            </p>
            <h4>Intellectual Property</h4>
            <p>
                Dashboard design and original content are property of GlobalWar.live.
                Market data is sourced from third-party providers under their respective terms.
            </p>
            <h4>Limitation of Liability</h4>
            <p>
                GlobalWar.live shall not be liable for any damages arising from use of this website.
            </p>
        </>
    );
}
