import { useState, useEffect } from 'react';
import { Clock, Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import './Header.css';

export default function Header({ riskScore = 0, riskLevel = 'Moderate' }) {
    const [time, setTime] = useState(new Date());
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        const onOnline = () => setIsOnline(true);
        const onOffline = () => setIsOnline(false);
        window.addEventListener('online', onOnline);
        window.addEventListener('offline', onOffline);
        return () => {
            clearInterval(timer);
            window.removeEventListener('online', onOnline);
            window.removeEventListener('offline', onOffline);
        };
    }, []);

    const getRiskColor = () => {
        if (riskScore <= 25) return 'var(--accent-green)';
        if (riskScore <= 50) return 'var(--accent-gold)';
        if (riskScore <= 75) return 'var(--accent-orange)';
        return 'var(--accent-red)';
    };

    return (
        <header className="header">
            <div className="header__left">
                <h1 className="header__title">
                    <span className="header__title-x">X</span>Radar
                    <span className="header__subtitle">Geopolitical Intelligence</span>
                </h1>
            </div>

            <div className="header__center">
                <div className="header__ticker">
                    <div className="header__ticker-content">
                        <span className="header__ticker-item">
                            <AlertTriangle size={12} />
                            LIVE MONITORING — Global Geopolitical Activity Dashboard
                        </span>
                        <span className="header__ticker-separator">•</span>
                        <span className="header__ticker-item">
                            Risk Level: <strong style={{ color: getRiskColor() }}>{riskLevel}</strong> ({riskScore}/100)
                        </span>
                        <span className="header__ticker-separator">•</span>
                        <span className="header__ticker-item">Data refreshes automatically</span>
                    </div>
                </div>
            </div>

            <div className="header__right">
                <div className="header__status">
                    {isOnline ? (
                        <span className="header__online"><Wifi size={14} /> Live</span>
                    ) : (
                        <span className="header__offline"><WifiOff size={14} /> Offline</span>
                    )}
                </div>
                <div className="header__clock">
                    <Clock size={14} />
                    <span className="header__time">
                        {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                    </span>
                    <span className="header__date">
                        {time.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                </div>
            </div>
        </header>
    );
}
