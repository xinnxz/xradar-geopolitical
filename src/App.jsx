import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GlobalDataProvider } from './hooks/useGlobalData';
import { usePageMeta } from './hooks/usePageMeta';
import ErrorBoundary from './components/layout/ErrorBoundary';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Overview from './components/overview/Overview';
import MarketPanel from './components/market/MarketPanel';
import NewsFeed from './components/news/NewsFeed';
import ConflictMap from './components/map/ConflictMap';
import RiskPanel from './components/risk/RiskPanel';
import AboutPage from './components/about/AboutPage';
import './App.css';

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
              </div>
              <Footer />
            </main>
          </div>
        </div>
      </GlobalDataProvider>
    </BrowserRouter>
  );
}
