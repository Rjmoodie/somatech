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
      {/* Hero Welcome Section */}
      <div className="text-center py-12 animate-slide-up">
        <h1 className="text-hero bg-gradient-to-r from-gray-900 via-blue-600 to-purple-700 dark:from-white dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent mb-6">
          Financial Intelligence Dashboard
        </h1>
        <p className="text-subtitle max-w-3xl mx-auto">
          Your comprehensive platform for market insights, business analytics, and financial intelligence
        </p>
      </div>
      
      <WelcomeSection setActiveModule={setActiveModule} />
      
      <AnnouncementsSection announcements={announcements} />

      <div className="border-t border-border/50"></div>

      {/* Enhanced Market Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-scale-in">
        <div className="card-elegant interactive-element">
          <MacroIndicators 
            onChartSelect={setSelectedChart} 
            selectedChart={selectedChart} 
          />
        </div>
        <div className="card-elegant interactive-element">
          <MarketSnapshot marketData={marketData} />
        </div>
        <div className="card-elegant interactive-element">
          <BusinessPulse />
        </div>
        <div className="card-elegant interactive-element">
          <TodaysAlerts />
        </div>
      </div>

      {/* Historical Chart Display */}
      {selectedChart && (
        <div className="animate-fade-in">
          <HistoricalChart 
            selectedChart={selectedChart} 
            onClose={() => setSelectedChart("")} 
          />
        </div>
      )}

      {/* Featured Content */}
      <div className="premium-card animate-slide-up">
        <FeaturedVideo />
      </div>

      <div className="border-t border-border/50"></div>

      {/* Learning Resources */}
      <div className="premium-card animate-fade-in">
        <LearningResources />
      </div>

      <div className="border-t border-border/50"></div>

      {/* Latest News */}
      <div className="premium-card animate-slide-up">
        <LatestNews news={news} />
      </div>
    </div>
  );
};

export default Dashboard;