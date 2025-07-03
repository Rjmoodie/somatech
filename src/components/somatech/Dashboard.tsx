import { useEffect, useState } from "react";
import WelcomeSection from "./dashboard/WelcomeSection";
import AnnouncementsSection from "./dashboard/AnnouncementsSection";
import MacroIndicators from "./dashboard/MacroIndicators";
import MarketSnapshot from "./dashboard/MarketSnapshot";
import BusinessPulse from "./dashboard/BusinessPulse";
import TodaysAlerts from "./dashboard/TodaysAlerts";
import HistoricalChart from "./dashboard/HistoricalChart";
import FeaturedVideo from "./dashboard/FeaturedVideo";
import LearningResources from "./dashboard/LearningResources";
import LatestNews from "./dashboard/LatestNews";
import { mockMarketData, mockNews, type MarketData, type NewsItem } from "./dashboard/mockData";

interface DashboardProps {
  globalTicker: string;
  setGlobalTicker: (ticker: string) => void;
  setActiveModule: (module: string) => void;
}

// Component props interface

const Dashboard = ({ globalTicker, setGlobalTicker, setActiveModule }: DashboardProps) => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChart, setSelectedChart] = useState<string>("");

  // Load mock data - in production, fetch from APIs
  useEffect(() => {
    setTimeout(() => {
      setMarketData(mockMarketData);
      setNews(mockNews);
      setLoading(false);
    }, 1000);
  }, []);

  const announcements: string[] = []; // Empty array shows "no announcements today"

  return (
    <div className="space-y-8 animate-fade-in">
      <WelcomeSection />
      
      <AnnouncementsSection announcements={announcements} />

      <div className="border-t border-border/30"></div>

      {/* Market Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <MacroIndicators 
          onChartSelect={setSelectedChart} 
          selectedChart={selectedChart} 
        />
        <MarketSnapshot marketData={marketData} />
        <BusinessPulse />
        <TodaysAlerts />
      </div>

      {/* Historical Chart Display */}
      {selectedChart && (
        <HistoricalChart 
          selectedChart={selectedChart} 
          onClose={() => setSelectedChart("")} 
        />
      )}

      <FeaturedVideo />

      <div className="border-t border-border/30"></div>

      <LearningResources />

      <div className="border-t border-border/30"></div>

      <LatestNews news={news} />
    </div>
  );
};

export default Dashboard;