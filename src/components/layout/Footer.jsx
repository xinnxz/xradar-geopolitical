// ========================================
// Footer — Copyright, Legal Links, Data Sources
// ========================================

import { Shield, FileText, AlertTriangle, Info, Heart } from 'lucide-react';
import './Footer.css';

export default function Footer({ onNavigate }) {
    const year = new Date().getFullYear();

    return (
        <footer className="site-footer">
            <div className="site-footer__inner">
                {/* Left: Copyright */}
                <div className="site-footer__left">
                    <span className="site-footer__copy">
                        © {year} <strong>GlobalWar.live</strong> — All rights reserved
                    </span>
                </div>

                {/* Center: Legal links */}
                <div className="site-footer__center">
                    <button className="site-footer__link" onClick={() => onNavigate?.('about')}>
                        <Info size={11} /> About
                    </button>
                    <span className="site-footer__dot">·</span>
                    <button className="site-footer__link" onClick={() => onNavigate?.('about')}>
                        <AlertTriangle size={11} /> Disclaimer
                    </button>
                    <span className="site-footer__dot">·</span>
                    <button className="site-footer__link" onClick={() => onNavigate?.('about')}>
                        <Shield size={11} /> Privacy
                    </button>
                    <span className="site-footer__dot">·</span>
                    <button className="site-footer__link" onClick={() => onNavigate?.('about')}>
                        <FileText size={11} /> Terms
                    </button>
                </div>

                {/* Right: Data sources */}
                <div className="site-footer__right">
                    <span className="site-footer__sources">
                        Data: CoinGecko · Finnhub · ECB · Alpha Vantage · ACLED · GNews
                    </span>
                </div>
            </div>
        </footer>
    );
}
