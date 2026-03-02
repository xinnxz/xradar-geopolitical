import { useState } from 'react';
import {
    LayoutDashboard, TrendingUp, Newspaper, Map, ShieldAlert,
    ChevronLeft, ChevronRight, Radio, Info
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
    { id: 'overview', label: 'Overview', Icon: LayoutDashboard },
    { id: 'markets', label: 'Markets', Icon: TrendingUp },
    { id: 'news', label: 'News Feed', Icon: Newspaper },
    { id: 'map', label: 'Conflict Map', Icon: Map },
    { id: 'risk', label: 'Risk Index', Icon: ShieldAlert },
    { id: 'about', label: 'About', Icon: Info },
];

export default function Sidebar({ activeView, onViewChange }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <aside className={`sidebar ${expanded ? 'sidebar--expanded' : ''}`}>
            {/* Logo */}
            <div className="sidebar__logo">
                <div className="sidebar__logo-icon">
                    <Radio size={22} />
                </div>
                {expanded && <span className="sidebar__logo-text">GlobalWar</span>}
            </div>

            {/* Navigation */}
            <nav className="sidebar__nav">
                {navItems.map(({ id, label, Icon }) => (
                    <button
                        key={id}
                        className={`sidebar__btn ${activeView === id ? 'sidebar__btn--active' : ''}`}
                        onClick={() => onViewChange(id)}
                        title={label}
                    >
                        <Icon size={20} />
                        {expanded && <span className="sidebar__btn-label">{label}</span>}
                        {activeView === id && <div className="sidebar__btn-indicator" />}
                    </button>
                ))}
            </nav>

            {/* Toggle */}
            <button
                className="sidebar__toggle"
                onClick={() => setExpanded(!expanded)}
                title={expanded ? 'Collapse' : 'Expand'}
            >
                {expanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
        </aside>
    );
}
