import { useState, useCallback } from 'react';
import { ExternalLink, Clock, AlertTriangle, RefreshCw, Wifi } from 'lucide-react';
import { fetchNews } from '../../services/newsService';
import { formatTimeAgo, getSentimentBadge } from '../../utils/formatters';
import { NEWS_CATEGORIES, API_KEYS, REFRESH_INTERVALS } from '../../utils/constants';
import { useAutoRefresh } from '../../hooks/useAutoRefresh';
import './NewsFeed.css';

function SentimentBadge({ sentiment }) {
    const labels = { positive: '😊 Positive', negative: '😟 Negative', neutral: '😐 Neutral' };
    return (
        <span className={`badge ${getSentimentBadge(sentiment)}`}>
            {labels[sentiment] || sentiment}
        </span>
    );
}

function CategoryBadge({ category }) {
    const colors = {
        war: 'badge-red',
        economy: 'badge-blue',
        sanctions: 'badge-purple',
        energy: 'badge-gold',
        diplomacy: 'badge-green',
    };
    return (
        <span className={`badge ${colors[category] || 'badge-blue'}`}>
            {category}
        </span>
    );
}

function NewsCard({ article, index }) {
    return (
        <a href={article.url} target="_blank" rel="noopener noreferrer"
            className={`news-card card news-card--clickable fade-in stagger-${Math.min(index + 1, 6)}`}>
            <div className="news-card__header">
                <div className="news-card__badges">
                    <CategoryBadge category={article.category} />
                    <SentimentBadge sentiment={article.sentiment} />
                </div>
                <ExternalLink size={14} className="news-card__link-icon" />
            </div>
            {article.imageUrl && (
                <img src={article.imageUrl} alt="" className="news-card__image" loading="lazy" />
            )}
            <h3 className="news-card__title">{article.title}</h3>
            <p className="news-card__desc">{article.description}</p>
            <div className="news-card__footer">
                <span className="news-card__source">{article.source}</span>
                <span className="news-card__time">
                    <Clock size={12} /> {formatTimeAgo(article.publishedAt)}
                </span>
            </div>
        </a>
    );
}

function SkeletonCard() {
    return (
        <div className="news-card card">
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <div className="skeleton" style={{ width: 60, height: 22, borderRadius: 999 }} />
                <div className="skeleton" style={{ width: 80, height: 22, borderRadius: 999 }} />
            </div>
            <div className="skeleton" style={{ width: '90%', height: 18, marginBottom: 8 }} />
            <div className="skeleton" style={{ width: '70%', height: 14, marginBottom: 8 }} />
            <div className="skeleton" style={{ width: '60%', height: 14 }} />
        </div>
    );
}

export default function NewsFeed() {
    const [activeCategory, setActiveCategory] = useState('all');

    // Fetch news via auto-refresh
    const fetchFn = useCallback(() => fetchNews(activeCategory), [activeCategory]);
    const { data: allNews, loading, lastUpdated, refresh } = useAutoRefresh(
        fetchFn, REFRESH_INTERVALS.NEWS, [activeCategory]
    );

    const news = allNews || [];
    const negativeCount = news.filter(n => n.sentiment === 'negative').length;
    const positiveCount = news.filter(n => n.sentiment === 'positive').length;
    const isLive = !!API_KEYS.GNEWS;

    return (
        <div className="news-feed fade-in">
            {/* Status bar */}
            <div className="market-panel__status">
                <div className="market-panel__status-left">
                    {isLive ? (
                        <span className="badge badge-green"><Wifi size={10} /> GNews: Live</span>
                    ) : (
                        <span className="badge badge-gold">News: Mock Data (set VITE_GNEWS_KEY for live)</span>
                    )}
                </div>
                <button className="market-panel__refresh" onClick={refresh}>
                    <RefreshCw size={14} className={loading ? 'spinning' : ''} />
                    {lastUpdated && (
                        <span>Updated {lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    )}
                </button>
            </div>

            {/* Breaking news banner */}
            {news.length > 0 && (
                <a href={news[0]?.url} target="_blank" rel="noopener noreferrer" className="breaking-banner breaking-banner--clickable">
                    <div className="breaking-banner__badge">
                        <AlertTriangle size={14} />
                        BREAKING
                    </div>
                    <div className="breaking-banner__text">
                        {news[0]?.title}
                    </div>
                    <ExternalLink size={14} className="breaking-banner__link" />
                </a>
            )}

            {/* Stats */}
            <div className="news-feed__stats">
                <div className="news-stat">
                    <span className="news-stat__value">{news.length}</span>
                    <span className="news-stat__label">Total Articles</span>
                </div>
                <div className="news-stat">
                    <span className="news-stat__value" style={{ color: 'var(--accent-red)' }}>{negativeCount}</span>
                    <span className="news-stat__label">Negative Sentiment</span>
                </div>
                <div className="news-stat">
                    <span className="news-stat__value" style={{ color: 'var(--accent-green)' }}>{positiveCount}</span>
                    <span className="news-stat__label">Positive Sentiment</span>
                </div>
            </div>

            {/* Category filters */}
            <div className="news-feed__filters">
                {NEWS_CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        className={`filter-btn ${activeCategory === cat.id ? 'filter-btn--active' : ''}`}
                        onClick={() => setActiveCategory(cat.id)}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* News list */}
            <div className="news-feed__list">
                {loading ? (
                    <>
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </>
                ) : news.length > 0 ? (
                    news.map((article, i) => (
                        <NewsCard key={article.id} article={article} index={i} />
                    ))
                ) : (
                    <div className="news-feed__empty">No articles found</div>
                )}
            </div>
        </div>
    );
}
