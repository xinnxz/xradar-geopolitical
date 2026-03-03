import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, X, Volume2, VolumeX } from 'lucide-react';
import './AlertBanner.css';

/**
 * 🚨 BREAKING NEWS ALERT BANNER
 * Terinspirasi dari WorldMonitor BreakingNewsBanner.ts (297 lines)
 *
 * Fitur:
 * - Banner merah sliding di atas halaman
 * - Auto-dismiss setelah 30 detik
 * - Sound notification (opsional)
 * - Manual dismiss button
 * - Queue sistem — bisa terima multiple alerts
 */

export default function AlertBanner() {
    const [alerts, setAlerts] = useState([]);
    const [currentAlert, setCurrentAlert] = useState(null);
    const [soundEnabled, setSoundEnabled] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    // Demo alerts — nanti diganti dengan real breaking news feed
    useEffect(() => {
        // Simulasi breaking news setelah 5 detik
        const timer = setTimeout(() => {
            addAlert({
                id: 'demo-1',
                title: '⚡ BREAKING: Multiple Active Conflict Zones Detected',
                subtitle: 'Ukraine, Gaza, Sudan, Yemen — elevated military activity worldwide',
                severity: 'critical', // critical | high | medium
                timestamp: new Date(),
            });
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const addAlert = useCallback((alert) => {
        setAlerts(prev => {
            // Avoid duplicates
            if (prev.some(a => a.id === alert.id)) return prev;
            return [...prev, alert];
        });
        setCurrentAlert(alert);
        setDismissed(false);

        // Play alert sound jika enabled
        if (soundEnabled) {
            try {
                // Gunakan Web Audio API untuk generate beep
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.value = 800;
                gain.gain.value = 0.1;
                osc.start();
                osc.stop(ctx.currentTime + 0.2);
            } catch {
                // Sound not available
            }
        }

        // Auto-dismiss after 30 seconds
        setTimeout(() => {
            setDismissed(true);
        }, 30000);
    }, [soundEnabled]);

    // Expose addAlert globally so other components can trigger it
    useEffect(() => {
        window.__xradarAlert = addAlert;
        return () => { delete window.__xradarAlert; };
    }, [addAlert]);

    const handleDismiss = () => {
        setDismissed(true);
    };

    if (!currentAlert || dismissed) return null;

    const severityClass = currentAlert.severity === 'critical' ? 'alert-critical'
        : currentAlert.severity === 'high' ? 'alert-high' : 'alert-medium';

    return (
        <div className={`alert-banner ${severityClass}`}>
            <div className="alert-banner__icon">
                <AlertTriangle size={18} />
            </div>

            <div className="alert-banner__content">
                <span className="alert-banner__title">{currentAlert.title}</span>
                {currentAlert.subtitle && (
                    <span className="alert-banner__subtitle">{currentAlert.subtitle}</span>
                )}
            </div>

            <div className="alert-banner__actions">
                <span className="alert-banner__time">
                    {currentAlert.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>

                <button
                    className="alert-banner__sound"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    title={soundEnabled ? 'Mute alerts' : 'Enable sound'}
                >
                    {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                </button>

                <button className="alert-banner__dismiss" onClick={handleDismiss} title="Dismiss">
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}
