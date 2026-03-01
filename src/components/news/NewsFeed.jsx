import { useState, useMemo } from 'react';
import { ExternalLink, Clock, AlertTriangle } from 'lucide-react';
import { getMockNews } from '../../services/newsService';
import { formatTimeAgo, getSentimentBadge } from '../../utils/formatters';
import { NEWS_CATEGORIES } from '../../utils/constants';
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
        <article className={`news-card card fade-in stagger-${Math.min(index + 1, 6)}`}>
            <div className="news-card__header">
                <div className="news-card__badges">
                    <CategoryBadge category={article.category} />
                    <SentimentBadge sentiment={article.sentiment} />
                </div>
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="news-card__link">
                    <ExternalLink size={14} />
                </a>
            </div>
            <h3 className="news-card__title">{article.title}</h3>
            <p className="news-card__desc">{article.description}</p>
            <div className="news-card__footer">
                <span className="news-card__source">{article.source}</span>
                <span className="news-card__time">
                    <Clock size={12} /> {formatTimeAgo(article.publishedAt)}
                </span>
            </div>
        </article>
    );
}

export default function NewsFeed() {
    const [activeCategory, setActiveCategory] = useState('all');
    const allNews = useMemo(() => getMockNews(), []);

    const filtered = useMemo(() => {
        if (activeCategory === 'all') return allNews;
        return allNews.filter(n => n.category === activeCategory);
    }, [allNews, activeCategory]);

    const negativeCount = allNews.filter(n => n.sentiment === 'negative').length;

    return (
        <div className="news-feed fade-in">
            {/* Breaking news banner */}
            <div className="breaking-banner">
                <div className="breaking-banner__badge">
                    <AlertTriangle size={14} />
                    BREAKING
                </div>
                <div className="breaking-banner__text">
                    {allNews[0]?.title}
                </div>
            </div>

            {/* Stats */}
            <div className="news-feed__stats">
                <div className="news-stat">
                    <span className="news-stat__value">{allNews.length}</span>
                    <span className="news-stat__label">Total Articles</span>
                </div>
                <div className="news-stat">
                    <span className="news-stat__value" style={{ color: 'var(--accent-red)' }}>{negativeCount}</span>
                    <span className="news-stat__label">Negative Sentiment</span>
                </div>
                <div className="news-stat">
                    <span className="news-stat__value" style={{ color: 'var(--accent-green)' }}>{allNews.filter(n => n.sentiment === 'positive').length}</span>
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
                        {cat.id !== 'all' && (
                            <span className="filter-btn__count">
                                {allNews.filter(n => n.category === cat.id).length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* News list */}
            <div className="news-feed__list">
                {filtered.map((article, i) => (
                    <NewsCard key={article.id} article={article} index={i} />
                ))}
                {filtered.length === 0 && (
                    <div className="news-feed__empty">No articles in this category</div>
                )}
            </div>
        </div>
    );
}
