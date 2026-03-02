import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard, TrendingUp, Newspaper, Map, ShieldAlert,
    ChevronLeft, ChevronRight, Radio, Info
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
    { path: '/', label: 'Overview', Icon: LayoutDashboard },
    { path: '/markets', label: 'Markets', Icon: TrendingUp },
    { path: '/news', label: 'News Feed', Icon: Newspaper },
    { path: '/map', label: 'Conflict Map', Icon: Map },
    { path: '/risk', label: 'Risk Index', Icon: ShieldAlert },
    { path: '/about', label: 'About', Icon: Info },
];

export default function Sidebar() {
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
                {navItems.map(({ path, label, Icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        end={path === '/'}
                        className={({ isActive }) =>
                            `sidebar__btn ${isActive ? 'sidebar__btn--active' : ''}`
                        }
                        title={label}
                    >
                        <Icon size={20} />
                        {expanded && <span className="sidebar__btn-label">{label}</span>}
                    </NavLink>
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
