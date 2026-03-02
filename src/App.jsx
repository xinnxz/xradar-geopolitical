import { useState } from 'react';
import { GlobalDataProvider } from './hooks/useGlobalData';
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

const views = {
  overview: Overview,
  markets: MarketPanel,
  news: NewsFeed,
  map: ConflictMap,
  risk: RiskPanel,
  about: AboutPage,
};

export default function App() {
  const [activeView, setActiveView] = useState('overview');

  const ActiveComponent = views[activeView] || Overview;

  return (
    <GlobalDataProvider>
      <div className="app">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        <Header />
        <main className="main-content">
          <ErrorBoundary key={activeView}>
            <ActiveComponent />
          </ErrorBoundary>
          <Footer onNavigate={setActiveView} />
        </main>
      </div>
    </GlobalDataProvider>
  );
}

