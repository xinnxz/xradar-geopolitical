import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Overview from './components/overview/Overview';
import MarketPanel from './components/market/MarketPanel';
import NewsFeed from './components/news/NewsFeed';
import ConflictMap from './components/map/ConflictMap';
import RiskPanel from './components/risk/RiskPanel';
import './App.css';

const views = {
  overview: Overview,
  markets: MarketPanel,
  news: NewsFeed,
  map: ConflictMap,
  risk: RiskPanel,
};

export default function App() {
  const [activeView, setActiveView] = useState('overview');

  const ActiveComponent = views[activeView] || Overview;

  return (
    <div className="app">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <Header riskScore={58} riskLevel="High" />
      <main className="main-content">
        <ActiveComponent key={activeView} />
      </main>
    </div>
  );
}
