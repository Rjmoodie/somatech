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
      <div className="text-center py-8 animate-slide-up">
        <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-4">
          Financial Intelligence Dashboard
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
          Your comprehensive view into market performance and business analytics
        </p>
      </div>
      
      <WelcomeSection />
      
      <AnnouncementsSection announcements={announcements} />

      <div className="border-t border-gray-200/50 dark:border-gray-700/50"></div>

      {/* Enhanced Market Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-scale-in">
        <div className="glass-card p-6 rounded-2xl hover-lift">
          <MacroIndicators 
            onChartSelect={setSelectedChart} 
            selectedChart={selectedChart} 
          />
        </div>
        <div className="glass-card p-6 rounded-2xl hover-lift">
          <MarketSnapshot marketData={marketData} />
        </div>
        <div className="glass-card p-6 rounded-2xl hover-lift">
          <BusinessPulse />
        </div>
        <div className="glass-card p-6 rounded-2xl hover-lift">
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
      <div className="glass-card p-8 rounded-2xl animate-slide-up">
        <FeaturedVideo />
      </div>

      <div className="border-t border-gray-200/50 dark:border-gray-700/50"></div>

      {/* Learning Resources */}
      <div className="glass-card p-8 rounded-2xl animate-fade-in">
        <LearningResources />
      </div>

      <div className="border-t border-gray-200/50 dark:border-gray-700/50"></div>

      {/* Latest News */}
      <div className="glass-card p-8 rounded-2xl animate-slide-up">
        <LatestNews news={news} />
      </div>
    </div>
  );
};

export default Dashboard;