// ========================================
// NewsFeed — Professional News Portal
// BBC/Reuters-inspired layout with:
// - Hero article with large image
// - Side stories with thumbnails
// - Grid articles with images
// - Live GNews API data
// ========================================

import { useState, useCallback, useMemo } from 'react';
import {
    ExternalLink, Clock, AlertTriangle, RefreshCw, Wifi,
    TrendingUp, TrendingDown, Minus, Flame, ChevronRight,
    Newspaper, Globe, Zap, BarChart3
} from 'lucide-react';
import { fetchNews } from '../../services/newsService';
import { formatTimeAgo, getSentimentBadge } from '../../utils/formatters';
import { NEWS_CATEGORIES, API_KEYS, REFRESH_INTERVALS } from '../../utils/constants';
import { useAutoRefresh } from '../../hooks/useAutoRefresh';
import './NewsFeed.css';

// Category icons & colors
const CAT_META = {
    war: { icon: Flame, color: '#ef4444', label: 'Conflict' },
    economy: { icon: BarChart3, color: '#3b82f6', label: 'Economy' },
    sanctions: { icon: Zap, color: '#8b5cf6', label: 'Sanctions' },
    energy: { icon: TrendingUp, color: '#f59e0b', label: 'Energy' },
    diplomacy: { icon: Globe, color: '#10b981', label: 'Diplomacy' },
};

function CategoryBadge({ category }) {
    const meta = CAT_META[category] || { color: '#3b82f6', label: category };
    return (
        <span className="nf-cat-badge" style={{ '--cat-color': meta.color }}>
            {meta.label}
        </span>
    );
}

function SentimentDot({ sentiment }) {
    const colors = { positive: '#0ecb81', negative: '#f6465d', neutral: '#848e9c' };
    return (
        <span className="nf-sentiment-dot" style={{ background: colors[sentiment] || colors.neutral }}
            title={sentiment} />
    );
}

function SourceBadge({ source }) {
    return <span className="nf-source">{source}</span>;
}

// Hero article — BBC top story style
function HeroArticle({ article }) {
    if (!article) return null;
    return (
        <a href={article.url} target="_blank" rel="noopener noreferrer" className="nf-hero">
            <div className="nf-hero__image-wrap">
                {article.imageUrl ? (
                    <img src={article.imageUrl} alt="" className="nf-hero__image" loading="eager" />
                ) : (
                    <div className="nf-hero__image-placeholder">
                        <Newspaper size={48} />
                    </div>
                )}
                <div className="nf-hero__overlay" />
                <div className="nf-hero__content">
                    <div className="nf-hero__meta">
                        <CategoryBadge category={article.category} />
                        <SentimentDot sentiment={article.sentiment} />
                    </div>
                    <h1 className="nf-hero__title">{article.title}</h1>
                    <p className="nf-hero__desc">{article.description}</p>
                    <div className="nf-hero__footer">
                        <SourceBadge source={article.source} />
                        <span className="nf-hero__time">
                            <Clock size={12} /> {formatTimeAgo(article.publishedAt)}
                        </span>
                    </div>
                </div>
            </div>
        </a>
    );
}

// Side story — compact with thumbnail (Reuters style)
function SideStory({ article }) {
    if (!article) return null;
    return (
        <a href={article.url} target="_blank" rel="noopener noreferrer" className="nf-side-story">
            {article.imageUrl && (
                <img src={article.imageUrl} alt="" className="nf-side-story__img" loading="lazy" />
            )}
            <div className="nf-side-story__content">
                <div className="nf-side-story__meta">
                    <CategoryBadge category={article.category} />
                </div>
                <h3 className="nf-side-story__title">{article.title}</h3>
                <div className="nf-side-story__footer">
                    <SourceBadge source={article.source} />
                    <span className="nf-side-story__time">
                        <Clock size={10} /> {formatTimeAgo(article.publishedAt)}
                    </span>
                </div>
            </div>
        </a>
    );
}

// Grid news card — image + title + desc
function GridCard({ article, featured = false }) {
    if (!article) return null;
    return (
        <a href={article.url} target="_blank" rel="noopener noreferrer"
            className={`nf-grid-card ${featured ? 'nf-grid-card--featured' : ''}`}>
            <div className="nf-grid-card__img-wrap">
                {article.imageUrl ? (
                    <img src={article.imageUrl} alt="" className="nf-grid-card__img" loading="lazy" />
                ) : (
                    <div className="nf-grid-card__img-placeholder">
                        <Newspaper size={24} />
                    </div>
                )}
                <SentimentDot sentiment={article.sentiment} />
            </div>
            <div className="nf-grid-card__body">
                <CategoryBadge category={article.category} />
                <h3 className="nf-grid-card__title">{article.title}</h3>
                <p className="nf-grid-card__desc">{article.description}</p>
                <div className="nf-grid-card__footer">
                    <SourceBadge source={article.source} />
                    <span className="nf-grid-card__time">
                        <Clock size={10} /> {formatTimeAgo(article.publishedAt)}
                    </span>
                </div>
            </div>
        </a>
    );
}

// Skeleton loaders
function HeroSkeleton() {
    return (
        <div className="nf-hero">
            <div className="nf-hero__image-wrap">
                <div className="skeleton" style={{ width: '100%', height: '100%', borderRadius: 'var(--radius-lg)' }} />
            </div>
        </div>
    );
}

function GridSkeleton() {
    return (
        <div className="nf-grid-card" style={{ pointerEvents: 'none' }}>
            <div className="skeleton" style={{ width: '100%', height: 160, borderRadius: 'var(--radius-md)' }} />
            <div style={{ padding: '12px 0' }}>
                <div className="skeleton" style={{ width: 60, height: 18, borderRadius: 999, marginBottom: 8 }} />
                <div className="skeleton" style={{ width: '90%', height: 16, marginBottom: 6 }} />
                <div className="skeleton" style={{ width: '70%', height: 14 }} />
            </div>
        </div>
    );
}

export default function NewsFeed() {
    const [activeCategory, setActiveCategory] = useState('all');

    const fetchFn = useCallback(() => fetchNews(activeCategory), [activeCategory]);
    const { data: allNews, loading, lastUpdated, refresh } = useAutoRefresh(
        fetchFn, REFRESH_INTERVALS.NEWS, [activeCategory]
    );

    const news = allNews || [];
    const negativeCount = news.filter(n => n.sentiment === 'negative').length;
    const positiveCount = news.filter(n => n.sentiment === 'positive').length;
    const isLive = !!API_KEYS.GNEWS;

    // Split news into sections
    const hero = news[0] || null;
    const sideStories = news.slice(1, 4);
    const gridArticles = news.slice(4);

    return (
        <div className="nf fade-in">
            {/* Header bar */}
            <div className="nf-header">
                <div className="nf-header__left">
                    <Newspaper size={18} style={{ color: 'var(--accent-blue)' }} />
                    <h2 className="nf-header__title">Geopolitical Intelligence Briefing</h2>
                    {isLive && <span className="badge badge-green"><Wifi size={10} /> Live</span>}
                </div>
                <button className="market-panel__refresh" onClick={refresh}>
                    <RefreshCw size={14} className={loading ? 'spinning' : ''} />
                    {lastUpdated && (
                        <span>Updated {lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    )}
                </button>
            </div>

            {/* Breaking news ticker */}
            {news.length > 0 && (
                <a href={news[0]?.url} target="_blank" rel="noopener noreferrer" className="nf-breaking">
                    <span className="nf-breaking__badge">
                        <Zap size={11} /> BREAKING
                    </span>
                    <span className="nf-breaking__text">{news[0]?.title}</span>
                    <ExternalLink size={12} className="nf-breaking__link" />
                </a>
            )}

            {/* Stats ribbon */}
            <div className="nf-stats-ribbon">
                <div className="nf-stat">
                    <span className="nf-stat__val">{news.length}</span>
                    <span className="nf-stat__label">Articles</span>
                </div>
                <div className="nf-stat__divider" />
                <div className="nf-stat">
                    <span className="nf-stat__val" style={{ color: '#f6465d' }}>{negativeCount}</span>
                    <span className="nf-stat__label">Negative</span>
                </div>
                <div className="nf-stat__divider" />
                <div className="nf-stat">
                    <span className="nf-stat__val" style={{ color: '#0ecb81' }}>{positiveCount}</span>
                    <span className="nf-stat__label">Positive</span>
                </div>
                <div className="nf-stat__divider" />
                <div className="nf-stat">
                    <span className="nf-stat__val" style={{ color: '#848e9c' }}>
                        {news.length - negativeCount - positiveCount}
                    </span>
                    <span className="nf-stat__label">Neutral</span>
                </div>
            </div>

            {/* Category filters */}
            <div className="nf-filters">
                {NEWS_CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        className={`nf-filter ${activeCategory === cat.id ? 'nf-filter--active' : ''}`}
                        onClick={() => setActiveCategory(cat.id)}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {loading ? (
                /* Loading skeletons */
                <div className="nf-layout">
                    <div className="nf-layout__main">
                        <HeroSkeleton />
                    </div>
                    <div className="nf-layout__grid">
                        <GridSkeleton /><GridSkeleton /><GridSkeleton />
                    </div>
                </div>
            ) : news.length > 0 ? (
                <>
                    {/* Main layout: Hero + Side */}
                    <div className="nf-layout">
                        <div className="nf-layout__main">
                            <HeroArticle article={hero} />
                        </div>
                        <div className="nf-layout__side">
                            {sideStories.map(article => (
                                <SideStory key={article.id} article={article} />
                            ))}
                        </div>
                    </div>

                    {/* Grid section */}
                    {gridArticles.length > 0 && (
                        <div className="nf-section">
                            <h3 className="nf-section__title">
                                <Globe size={16} /> More Stories
                            </h3>
                            <div className="nf-grid">
                                {gridArticles.map(article => (
                                    <GridCard key={article.id} article={article} />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="nf-empty">
                    <Newspaper size={32} />
                    <p>No articles found for this category</p>
                </div>
            )}
        </div>
    );
}
