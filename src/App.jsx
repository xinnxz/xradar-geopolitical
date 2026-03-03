import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GlobalDataProvider } from './hooks/useGlobalData';
import { usePageMeta } from './hooks/usePageMeta';
import ErrorBoundary from './components/layout/ErrorBoundary';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import './App.css';

// ── Lazy-loaded page components (code-split for faster LCP) ──
const Overview = lazy(() => import('./components/overview/Overview'));
const MarketPanel = lazy(() => import('./components/market/MarketPanel'));
const NewsFeed = lazy(() => import('./components/news/NewsFeed'));
const ConflictMap = lazy(() => import('./components/map/ConflictMap'));
const RiskPanel = lazy(() => import('./components/risk/RiskPanel'));
const AboutPage = lazy(() => import('./components/about/AboutPage'));

// Loading fallback
function PageLoader() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', color: 'var(--text-muted)', fontSize: '0.85rem',
      gap: '8px'
    }}>
      <div className="spinning" style={{
        width: 20, height: 20, border: '2px solid var(--border-color)',
        borderTopColor: 'var(--accent-blue)', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      Loading...
    </div>
  );
}

// SEO: update meta tags on every route change
function PageMeta() {
  usePageMeta();
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <PageMeta />
      <GlobalDataProvider>
        <div className="app">
          <Sidebar />
          <div className="app__main">
            <Header />
            <main className="main-content">
              <div className="main-content__body">
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary>
                    <Routes>
                      <Route path="/" element={<Overview />} />
                      <Route path="/markets" element={<MarketPanel />} />
                      <Route path="/news" element={<NewsFeed />} />
                      <Route path="/map" element={<ConflictMap />} />
                      <Route path="/risk" element={<RiskPanel />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </ErrorBoundary>
                </Suspense>
              </div>
              <Footer />
            </main>
          </div>
        </div>
      </GlobalDataProvider>
    </BrowserRouter>
  );
}
