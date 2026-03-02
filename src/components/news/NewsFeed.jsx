// ========================================
// NewsFeed — Professional News Portal
// True infinite scroll with IntersectionObserver
// BBC/Reuters layout + auto-load on scroll
// ========================================

import { useState, useCallback, useRef, useEffect } from 'react';
import {
    ExternalLink, Clock, RefreshCw, Wifi,
    TrendingUp, Flame, Loader,
    Newspaper, Globe, Zap, BarChart3, BookOpen, WifiOff
} from 'lucide-react';
import { fetchNews, fetchNewsPage } from '../../services/newsService';
import { formatTimeAgo } from '../../utils/formatters';
import { NEWS_CATEGORIES, API_KEYS, REFRESH_INTERVALS } from '../../utils/constants';
import { useAutoRefresh } from '../../hooks/useAutoRefresh';
import './NewsFeed.css';

const CAT_META = {
    war: { icon: Flame, color: '#ef4444', label: 'Conflict' },
    economy: { icon: BarChart3, color: '#3b82f6', label: 'Economy' },
    sanctions: { icon: Zap, color: '#8b5cf6', label: 'Sanctions' },
    energy: { icon: TrendingUp, color: '#f59e0b', label: 'Energy' },
    diplomacy: { icon: Globe, color: '#10b981', label: 'Diplomacy' },
};

function getReadingTime(text) {
    const words = (text || '').split(/\s+/).length;
    return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

function CategoryBadge({ category }) {
    const meta = CAT_META[category] || { color: '#3b82f6', label: category };
    return <span className="nf-cat-badge" style={{ '--cat-color': meta.color }}>{meta.label}</span>;
}

function SentimentDot({ sentiment }) {
    const colors = { positive: '#0ecb81', negative: '#f6465d', neutral: '#848e9c' };
    return <span className="nf-sentiment-dot" style={{ background: colors[sentiment] || colors.neutral }} title={sentiment} />;
}

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

function SideStory({ article }) {
    if (!article) return null;
    return (
        <a href={article.url} target="_blank" rel="noopener noreferrer" className="nf-side-story">
            {article.imageUrl && <img src={article.imageUrl} alt="" className="nf-side-story__img" loading="lazy" />}
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

function HeroSkeleton() {
    return (
        <div className="nf-hero">
            <div className="nf-hero__image-wrap">
                <div className="skeleton" style={{ width: '100%', height: '100%', borderRadius: 'var(--radius-lg)' }} />
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

export default function NewsFeed() {
    const [activeCategory, setActiveCategory] = useState('all');
    const [extraArticles, setExtraArticles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const sentinelRef = useRef(null);

    // Initial page 1 fetch
    const fetchFn = useCallback(() => fetchNews(activeCategory), [activeCategory]);
    const { data: initialNews, loading, lastUpdated, refresh } = useAutoRefresh(
        fetchFn, REFRESH_INTERVALS.NEWS, [activeCategory]
    );

    // Combine initial + extra pages
    const news = [...(initialNews || []), ...extraArticles];
    const negativeCount = news.filter(n => n.sentiment === 'negative').length;
    const positiveCount = news.filter(n => n.sentiment === 'positive').length;

    // Reset when category changes
    useEffect(() => {
        setExtraArticles([]);
        setCurrentPage(1);
        setHasMore(true);
    }, [activeCategory]);

    // Infinite scroll: load next page when sentinel becomes visible
    const loadNextPage = useCallback(async () => {
        if (loadingMore || !hasMore) return;

        setLoadingMore(true);
        const nextPage = currentPage + 1;

        try {
            const result = await fetchNewsPage(activeCategory, nextPage);
            if (result.articles.length > 0) {
                setExtraArticles(prev => {
                    // Deduplicate — check titles
                    const existingTitles = new Set([...(initialNews || []), ...prev].map(a => a.title?.substring(0, 50)));
                    const newOnes = result.articles.filter(a => !existingTitles.has(a.title?.substring(0, 50)));
                    return [...prev, ...newOnes];
                });
                setCurrentPage(nextPage);
                setHasMore(result.hasMore);
            } else {
                setHasMore(false);
            }
        } catch (e) {
            console.error('Load more failed:', e);
            setHasMore(false);
        }

        setLoadingMore(false);
    }, [loadingMore, hasMore, currentPage, activeCategory, initialNews]);

    // IntersectionObserver — triggers loadNextPage when scroll sentinel is visible
    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading && news.length > 0) {
                    loadNextPage();
                }
            },
            { rootMargin: '200px' } // Trigger 200px BEFORE reaching bottom
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [loadNextPage, loading, news.length]);

    // Layout split
    const hero = news[0] || null;
    const sideStories = news.slice(1, 4);
    const gridArticles = news.slice(4);

    return (
        <div className="nf fade-in">
            {/* Header */}
            <div className="nf-header">
                <div className="nf-header__left">
                    <Newspaper size={18} style={{ color: 'var(--accent-blue)' }} />
                    <h2 className="nf-header__title">Geopolitical Intelligence Briefing</h2>
                    {news.length > 0 && <span className="badge badge-green"><Wifi size={10} /> Live</span>}
                </div>
                <div className="nf-header__right">
                    <button className="market-panel__refresh" onClick={refresh}>
                        <RefreshCw size={14} className={loading ? 'spinning' : ''} />
                        {lastUpdated && (
                            <span>Updated {lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                        )}
                    </button>
                </div>
            </div>

            {/* Breaking */}
            {news.length > 0 && (
                <a href={news[0]?.url} target="_blank" rel="noopener noreferrer" className="nf-breaking">
                    <span className="nf-breaking__badge"><Zap size={11} /> BREAKING</span>
                    <span className="nf-breaking__text">{news[0]?.title}</span>
                    <ExternalLink size={12} className="nf-breaking__link" />
                </a>
            )}

            {/* Stats */}
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
                    <span className="nf-stat__val" style={{ color: '#848e9c' }}>{news.length - negativeCount - positiveCount}</span>
                    <span className="nf-stat__label">Neutral</span>
                </div>
            </div>

            {/* Filters */}
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

            {/* Content */}
            {loading && news.length === 0 ? (
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
                        <div className="nf-layout__main"><HeroArticle article={hero} /></div>
                        <div className="nf-layout__side">
                            {sideStories.map(article => (
                                <SideStory key={article.id} article={article} />
                            ))}
                        </div>
                    </div>

                    {/* Grid */}
                    {gridArticles.length > 0 && (
                        <div className="nf-section">
                            <h3 className="nf-section__title">
                                <Globe size={16} /> More Stories
                                <span className="nf-section__count">{news.length} articles · Page {currentPage}</span>
                            </h3>
                            <div className="nf-grid">
                                {gridArticles.map(article => (
                                    <GridCard key={article.id} article={article} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Infinite scroll sentinel — invisible div at the bottom */}
                    {hasMore && (
                        <div ref={sentinelRef} className="nf-scroll-sentinel">
                            {loadingMore && (
                                <div className="nf-loading-more">
                                    <Loader size={18} className="spinning" />
                                    <span>Loading more articles...</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* End of feed */}
                    {!hasMore && news.length > 4 && (
                        <div className="nf-end">
                            <span>End of feed · {news.length} articles loaded across {currentPage} page{currentPage > 1 ? 's' : ''}</span>
                        </div>
                    )}
                </>
            ) : (
                <div className="nf-empty">
                    <WifiOff size={36} />
                    <h3>No Articles Available</h3>
                    <p>Ensure <strong>GNEWS_KEY</strong> is set in Vercel Environment Variables</p>
                    <button className="nf-filter nf-filter--active" onClick={refresh} style={{ marginTop: 12 }}>
                        <RefreshCw size={14} /> Try Again
                    </button>
                </div>
            )}
        </div>
    );
}
