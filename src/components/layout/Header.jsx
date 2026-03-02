import { useState, useEffect } from 'react';
import { Clock, Wifi, WifiOff, AlertTriangle, Sun, Moon } from 'lucide-react';
import { useGlobalData } from '../../hooks/useGlobalData';
import { useTheme } from '../../hooks/useTheme';
import ShareBar from './ShareBar';
import './Header.css';

export default function Header() {
    const { risk, loading } = useGlobalData();
    const { theme, toggle } = useTheme();
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

    const riskScore = risk?.score || 0;
    const riskLevel = risk?.level || 'Loading...';
    const riskColor = risk?.color || 'var(--text-muted)';

    return (
        <header className="header">
            <div className="header__left">
                <h1 className="header__title">
                    <span className="header__title-x">Global</span>War
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
                            Risk Level: <strong style={{ color: riskColor }}>
                                {loading ? '...' : riskLevel}
                            </strong> ({loading ? '—' : `${riskScore}/100`})
                        </span>
                        <span className="header__ticker-separator">•</span>
                        <span className="header__ticker-item">Data refreshes automatically</span>
                    </div>
                </div>
            </div>

            <div className="header__right">
                <ShareBar />
                <button className="header__theme-toggle" onClick={toggle} title={theme === 'dark' ? 'Light mode' : 'Dark mode'}>
                    {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                </button>
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
