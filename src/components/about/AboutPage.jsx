// ========================================
// About & Legal — Trust Pages
// About, Privacy Policy, Disclaimer, Terms
// ========================================

import { useState } from 'react';
import {
    Info, Shield, FileText, AlertTriangle, Mail, Globe,
    Bitcoin, TrendingUp, DollarSign, Fuel, MapPin, Newspaper,
    Wrench, Lock, Radio
} from 'lucide-react';
import './AboutPage.css';

const TABS = [
    { id: 'about', label: 'About', icon: Info },
    { id: 'disclaimer', label: 'Disclaimer', icon: AlertTriangle },
    { id: 'privacy', label: 'Privacy Policy', icon: Shield },
    { id: 'terms', label: 'Terms of Use', icon: FileText },
];

export default function AboutPage() {
    const [activeTab, setActiveTab] = useState('about');

    return (
        <div className="about-page fade-in">
            <div className="about-header">
                <Info size={18} style={{ color: 'var(--accent-blue)' }} />
                <h2>About GlobalWar.live</h2>
            </div>

            <div className="about-tabs">
                {TABS.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button key={tab.id}
                            className={`about-tab ${activeTab === tab.id ? 'about-tab--active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}>
                            <Icon size={13} /> {tab.label}
                        </button>
                    );
                })}
            </div>

            <div className="about-content">
                {activeTab === 'about' && <AboutContent />}
                {activeTab === 'disclaimer' && <DisclaimerContent />}
                {activeTab === 'privacy' && <PrivacyContent />}
                {activeTab === 'terms' && <TermsContent />}
            </div>
        </div>
    );
}

function AboutContent() {
    return (
        <div className="about-section fade-in">
            <h3><Radio size={16} className="about-icon about-icon--blue" /> What is GlobalWar.live?</h3>
            <p>
                GlobalWar.live is a <strong>real-time geopolitical intelligence and market monitoring dashboard</strong> that tracks
                global conflicts, their economic impact, and financial markets — all in one place.
            </p>
            <p>
                In a world where tensions between nations directly affect your investments, savings, and daily life,
                we provide the tools to stay informed and make better decisions.
            </p>

            <h3><TrendingUp size={16} className="about-icon about-icon--green" /> What We Track</h3>
            <div className="about-features">
                <div className="about-feature">
                    <span className="about-feature__icon"><Bitcoin size={18} style={{ color: '#f7931a' }} /></span>
                    <div>
                        <strong>Cryptocurrency</strong>
                        <span>15+ coins — BTC, ETH, SOL, and more via CoinGecko</span>
                    </div>
                </div>
                <div className="about-feature">
                    <span className="about-feature__icon"><TrendingUp size={18} style={{ color: '#3b82f6' }} /></span>
                    <div>
                        <strong>Stock Indices</strong>
                        <span>S&P 500, NASDAQ, Dow Jones, VIX Fear Index via Finnhub</span>
                    </div>
                </div>
                <div className="about-feature">
                    <span className="about-feature__icon"><DollarSign size={18} style={{ color: '#0ecb81' }} /></span>
                    <div>
                        <strong>Forex</strong>
                        <span>29 currency pairs from ECB via Frankfurter API</span>
                    </div>
                </div>
                <div className="about-feature">
                    <span className="about-feature__icon"><Fuel size={18} style={{ color: '#f0b90b' }} /></span>
                    <div>
                        <strong>Commodities</strong>
                        <span>Gold, WTI Oil, Brent Crude via Alpha Vantage</span>
                    </div>
                </div>
                <div className="about-feature">
                    <span className="about-feature__icon"><MapPin size={18} style={{ color: '#f6465d' }} /></span>
                    <div>
                        <strong>Conflict Tracking</strong>
                        <span>Armed conflict events from ACLED (Armed Conflict Location & Event Data)</span>
                    </div>
                </div>
                <div className="about-feature">
                    <span className="about-feature__icon"><Newspaper size={18} style={{ color: '#8b5cf6' }} /></span>
                    <div>
                        <strong>Live News</strong>
                        <span>Geopolitical news with infinite scroll via GNews API</span>
                    </div>
                </div>
            </div>

            <h3><Wrench size={16} className="about-icon about-icon--muted" /> Technology</h3>
            <p>
                Built with React, Vite, Lightweight Charts (TradingView), and Vercel Serverless Functions.
                All market data is fetched in real-time from public APIs with intelligent caching and key rotation.
            </p>

            <h3><Mail size={16} className="about-icon about-icon--blue" /> Contact</h3>
            <p>
                <Mail size={14} style={{ verticalAlign: 'middle' }} /> Email: <a href="mailto:contact@globalwar.live">contact@globalwar.live</a>
            </p>
            <p>
                <Globe size={14} style={{ verticalAlign: 'middle' }} /> Website: <a href="https://globalwar.live" target="_blank" rel="noopener">globalwar.live</a>
            </p>
        </div>
    );
}

function DisclaimerContent() {
    return (
        <div className="about-section fade-in">
            <h3><AlertTriangle size={16} className="about-icon about-icon--yellow" /> Disclaimer</h3>
            <p><strong>Last updated: March 2026</strong></p>

            <h4>Not Financial Advice</h4>
            <p>
                The information provided on GlobalWar.live is for <strong>general informational and educational purposes only</strong>.
                It should not be construed as financial advice, investment advice, trading advice, or any other type of advice.
            </p>
            <p>
                You should not make any financial decision based solely on the information presented on this website.
                Always consult with a qualified financial advisor before making investment decisions.
            </p>

            <h4>No Guarantee of Accuracy</h4>
            <p>
                While we strive to provide accurate and up-to-date information, we make no representations or warranties
                of any kind about the completeness, accuracy, reliability, or suitability of the data displayed.
                Market data is sourced from third-party APIs and may be delayed or contain errors.
            </p>

            <h4>Risk Warning</h4>
            <p>
                Trading and investing in cryptocurrencies, stocks, forex, and commodities involves substantial risk of loss.
                Past performance is not indicative of future results. You could lose some or all of your invested capital.
            </p>

            <h4>Third-Party Data</h4>
            <p>
                Data is aggregated from: CoinGecko, Finnhub, Frankfurter (ECB), Alpha Vantage, GNews, and ACLED.
                We are not affiliated with these services and do not guarantee their data accuracy or availability.
            </p>
        </div>
    );
}

function PrivacyContent() {
    return (
        <div className="about-section fade-in">
            <h3><Lock size={16} className="about-icon about-icon--green" /> Privacy Policy</h3>
            <p><strong>Last updated: March 2026</strong></p>

            <h4>Information We Collect</h4>
            <p>
                GlobalWar.live does <strong>not</strong> collect personal data, require user registration,
                or use tracking cookies. We do not store any user information on our servers.
            </p>

            <h4>Local Storage</h4>
            <p>
                We use your browser's localStorage to cache market data for performance optimization.
                This data stays on your device and is never transmitted to our servers.
            </p>

            <h4>Third-Party Services</h4>
            <p>
                Our website is hosted on Vercel. API calls are proxied through Vercel Serverless Functions
                to protect API keys. No user-identifiable data is sent to third-party APIs.
            </p>

            <h4>Analytics</h4>
            <p>
                We may use anonymous, privacy-respecting analytics to understand general traffic patterns.
                No personal data is collected or shared.
            </p>

            <h4>Contact</h4>
            <p>
                For privacy concerns, email: <a href="mailto:contact@globalwar.live">contact@globalwar.live</a>
            </p>
        </div>
    );
}

function TermsContent() {
    return (
        <div className="about-section fade-in">
            <h3><FileText size={16} className="about-icon about-icon--blue" /> Terms of Use</h3>
            <p><strong>Last updated: March 2026</strong></p>

            <h4>Acceptance of Terms</h4>
            <p>
                By accessing and using GlobalWar.live, you accept and agree to be bound by these Terms of Use.
                If you do not agree, please do not use this website.
            </p>

            <h4>Use of Service</h4>
            <p>
                GlobalWar.live provides a dashboard for monitoring geopolitical events and financial markets.
                The service is provided "as is" without warranties of any kind.
            </p>

            <h4>Intellectual Property</h4>
            <p>
                The dashboard design, code, and original content are the property of GlobalWar.live.
                Market data is sourced from third-party providers under their respective terms.
            </p>

            <h4>Limitation of Liability</h4>
            <p>
                GlobalWar.live shall not be liable for any direct, indirect, incidental, or consequential
                damages arising from the use of this website or reliance on the information provided.
            </p>

            <h4>Changes to Terms</h4>
            <p>
                We reserve the right to modify these terms at any time. Continued use of the website
                constitutes acceptance of updated terms.
            </p>
        </div>
    );
}
