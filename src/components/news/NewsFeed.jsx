// ========================================
// NewsFeed — Professional News Portal
// BBC/Reuters-inspired with:
// - Hero + side + grid layout
// - Load More (pagination)
// - Auto-refresh with "new articles" indicator
// - Reading time estimates
// - All real GNews data
// ========================================

import { useState, useCallback, useRef, useEffect } from 'react';
import {
    ExternalLink, Clock, RefreshCw, Wifi,
    TrendingUp, Flame, ChevronDown,
    Newspaper, Globe, Zap, BarChart3, BookOpen, WifiOff
} from 'lucide-react';
import { fetchNews } from '../../services/newsService';
import { formatTimeAgo } from '../../utils/formatters';
import { NEWS_CATEGORIES, API_KEYS, REFRESH_INTERVALS } from '../../utils/constants';
import { useAutoRefresh } from '../../hooks/useAutoRefresh';
import './NewsFeed.css';

// Category meta
const CAT_META = {
    war: { icon: Flame, color: '#ef4444', label: 'Conflict' },
    economy: { icon: BarChart3, color: '#3b82f6', label: 'Economy' },
    sanctions: { icon: Zap, color: '#8b5cf6', label: 'Sanctions' },
    energy: { icon: TrendingUp, color: '#f59e0b', label: 'Energy' },
    diplomacy: { icon: Globe, color: '#10b981', label: 'Diplomacy' },
};

// Estimate reading time from description length
function getReadingTime(text) {
    const words = (text || '').split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
}

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

// Hero article — BBC top story
function HeroArticle({ article }) {
    if (!article) return null;
    return (
        <a href={article.url} target="_blank" rel="noopener noreferrer" className="nf-hero">
            <div className="nf-hero__image-wrap">
                {article.imageUrl ? (
                    <img src={article.imageUrl} alt="" className="nf-hero__image" loading="eager" />
                ) : (
                    <div className="nf-hero__image-placeholder"><Newspaper size={48} /></div>
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
                        <span className="nf-source">{article.source}</span>
                        <span className="nf-hero__time"><Clock size={12} /> {formatTimeAgo(article.publishedAt)}</span>
                        <span className="nf-reading-time"><BookOpen size={11} /> {getReadingTime(article.description)}</span>
                    </div>
                </div>
            </div>
        </a>
    );
}

// Side story — Reuters compact
function SideStory({ article }) {
    if (!article) return null;
    return (
        <a href={article.url} target="_blank" rel="noopener noreferrer" className="nf-side-story">
            {article.imageUrl && (
                <img src={article.imageUrl} alt="" className="nf-side-story__img" loading="lazy" />
            )}
            <div className="nf-side-story__content">
                <div className="nf-side-story__meta"><CategoryBadge category={article.category} /></div>
                <h3 className="nf-side-story__title">{article.title}</h3>
                <div className="nf-side-story__footer">
                    <span className="nf-source">{article.source}</span>
                    <span className="nf-side-story__time"><Clock size={10} /> {formatTimeAgo(article.publishedAt)}</span>
                </div>
            </div>
        </a>
    );
}

// Grid card
function GridCard({ article }) {
    if (!article) return null;
    return (
        <a href={article.url} target="_blank" rel="noopener noreferrer" className="nf-grid-card">
            <div className="nf-grid-card__img-wrap">
                {article.imageUrl ? (
                    <img src={article.imageUrl} alt="" className="nf-grid-card__img" loading="lazy" />
                ) : (
                    <div className="nf-grid-card__img-placeholder"><Newspaper size={24} /></div>
                )}
                <SentimentDot sentiment={article.sentiment} />
            </div>
            <div className="nf-grid-card__body">
                <CategoryBadge category={article.category} />
                <h3 className="nf-grid-card__title">{article.title}</h3>
                <p className="nf-grid-card__desc">{article.description}</p>
                <div className="nf-grid-card__footer">
                    <span className="nf-source">{article.source}</span>
                    <span className="nf-grid-card__time">
                        <Clock size={10} /> {formatTimeAgo(article.publishedAt)}
                        <span className="nf-grid-card__reading"> · <BookOpen size={10} /> {getReadingTime(article.description)}</span>
                    </span>
                </div>
            </div>
        </a>
    );
}

// Skeletons
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
            <div className="skeleton" style={{ width: '100%', height: 150, borderRadius: 'var(--radius-md)' }} />
            <div style={{ padding: '12px 0' }}>
                <div className="skeleton" style={{ width: 60, height: 18, borderRadius: 999, marginBottom: 8 }} />
                <div className="skeleton" style={{ width: '90%', height: 16, marginBottom: 6 }} />
                <div className="skeleton" style={{ width: '70%', height: 14 }} />
            </div>
        </div>
    );
}

function SideSkeleton() {
    return (
        <div className="nf-side-story" style={{ pointerEvents: 'none' }}>
            <div className="skeleton" style={{ width: 100, minWidth: 100, height: 80, borderRadius: 'var(--radius-sm)' }} />
            <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ width: 60, height: 16, borderRadius: 999, marginBottom: 6 }} />
                <div className="skeleton" style={{ width: '90%', height: 14, marginBottom: 4 }} />
                <div className="skeleton" style={{ width: '60%', height: 12 }} />
            </div>
        </div>
    );
}

export default function NewsFeed() {
    const [activeCategory, setActiveCategory] = useState('all');
    const [visibleCount, setVisibleCount] = useState(10); // Initial articles shown
    const [loadingMore, setLoadingMore] = useState(false);
    const prevCountRef = useRef(0);
    const [newArticleCount, setNewArticleCount] = useState(0);

    const fetchFn = useCallback(() => fetchNews(activeCategory), [activeCategory]);
    const { data: allNews, loading, lastUpdated, refresh } = useAutoRefresh(
        fetchFn, REFRESH_INTERVALS.NEWS, [activeCategory]
    );

    const news = allNews || [];

    // Track new articles arriving from auto-refresh
    useEffect(() => {
        if (news.length > 0 && prevCountRef.current > 0 && news.length > prevCountRef.current) {
            setNewArticleCount(news.length - prevCountRef.current);
        }
        prevCountRef.current = news.length;
    }, [news.length]);

    // Reset visible count when category changes
    useEffect(() => {
        setVisibleCount(10);
        setNewArticleCount(0);
    }, [activeCategory]);

    const negativeCount = news.filter(n => n.sentiment === 'negative').length;
    const positiveCount = news.filter(n => n.sentiment === 'positive').length;

    // Split news into sections
    const hero = news[0] || null;
    const sideStories = news.slice(1, 4);
    const gridArticles = news.slice(4, visibleCount);
    const hasMore = news.length > visibleCount;

    const handleLoadMore = () => {
        setLoadingMore(true);
        setTimeout(() => {
            setVisibleCount(prev => prev + 6);
            setLoadingMore(false);
        }, 300);
    };

    const handleRefreshNew = () => {
        setNewArticleCount(0);
        refresh();
    };

    return (
        <div className="nf fade-in">
            {/* Header */}
            <div className="nf-header">
                <div className="nf-header__left">
                    <Newspaper size={18} style={{ color: 'var(--accent-blue)' }} />
                    <h2 className="nf-header__title">Geopolitical Intelligence Briefing</h2>
                    {news.length > 0 ? (
                        <span className="badge badge-green"><Wifi size={10} /> Live</span>
                    ) : !loading ? (
                        <span className="badge badge-gold"><WifiOff size={10} /> Offline</span>
                    ) : null}
                </div>
                <div className="nf-header__right">
                    {newArticleCount > 0 && (
                        <button className="nf-new-articles-btn" onClick={handleRefreshNew}>
                            <Zap size={12} /> {newArticleCount} new article{newArticleCount > 1 ? 's' : ''}
                        </button>
                    )}
                    <button className="market-panel__refresh" onClick={refresh}>
                        <RefreshCw size={14} className={loading ? 'spinning' : ''} />
                        {lastUpdated && (
                            <span>Updated {lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                        )}
                    </button>
                </div>
            </div>

            {/* Breaking news ticker */}
            {news.length > 0 && (
                <a href={news[0]?.url} target="_blank" rel="noopener noreferrer" className="nf-breaking">
                    <span className="nf-breaking__badge"><Zap size={11} /> BREAKING</span>
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

            {loading && news.length === 0 ? (
                /* Loading skeletons */
                <>
                    <div className="nf-layout">
                        <div className="nf-layout__main"><HeroSkeleton /></div>
                        <div className="nf-layout__side">
                            <SideSkeleton /><SideSkeleton /><SideSkeleton />
                        </div>
                    </div>
                    <div className="nf-grid">
                        <GridSkeleton /><GridSkeleton /><GridSkeleton />
                    </div>
                </>
            ) : news.length > 0 ? (
                <>
                    {/* Hero + Side */}
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
                            <h3 className="nf-section__title"><Globe size={16} /> More Stories</h3>
                            <div className="nf-grid">
                                {gridArticles.map(article => (
                                    <GridCard key={article.id} article={article} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Load More button */}
                    {hasMore && (
                        <button className="nf-load-more" onClick={handleLoadMore} disabled={loadingMore}>
                            {loadingMore ? (
                                <><RefreshCw size={14} className="spinning" /> Loading...</>
                            ) : (
                                <><ChevronDown size={16} /> Load More Articles ({news.length - visibleCount} remaining)</>
                            )}
                        </button>
                    )}

                    {/* End indicator */}
                    {!hasMore && news.length > 4 && (
                        <div className="nf-end">
                            <span>You've reached the end · {news.length} articles loaded</span>
                        </div>
                    )}
                </>
            ) : (
                /* Empty state */
                <div className="nf-empty">
                    <WifiOff size={36} />
                    <h3>No Articles Available</h3>
                    <p>Ensure <strong>GNEWS_KEY</strong> is set in Vercel Environment Variables</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        Vercel Dashboard → Settings → Environment Variables → Add GNEWS_KEY → Redeploy
                    </p>
                    <button className="nf-filter nf-filter--active" onClick={refresh} style={{ marginTop: 12 }}>
                        <RefreshCw size={14} /> Try Again
                    </button>
                </div>
            )}
        </div>
    );
}
