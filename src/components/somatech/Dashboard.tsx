import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity, 
  Users, 
  Building2,
  Globe,
  AlertCircle,
  Calendar,
  PlayCircle,
  BookOpen,
  ExternalLink,
  Megaphone,
  BarChart3
} from "lucide-react";
import { useEffect, useState } from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface DashboardProps {
  globalTicker: string;
  setGlobalTicker: (ticker: string) => void;
  setActiveModule: (module: string) => void;
}

interface MarketData {
  sp500: { value: number; change: number };
  nasdaq: { value: number; change: number };
  dow: { value: number; change: number };
  treasury10y: { value: number; change: number };
  oil: { value: number; change: number };
  gold: { value: number; change: number };
}

interface NewsItem {
  title: string;
  summary: string;
  url: string;
  time_published: string;
  source: string;
}

const Dashboard = ({ globalTicker, setGlobalTicker, setActiveModule }: DashboardProps) => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demo - in production, fetch from APIs
  useEffect(() => {
    const mockMarketData: MarketData = {
      sp500: { value: 4563.45, change: 1.2 },
      nasdaq: { value: 14234.56, change: 0.8 },
      dow: { value: 35234.78, change: -0.3 },
      treasury10y: { value: 4.25, change: 0.05 },
      oil: { value: 78.45, change: 2.1 },
      gold: { value: 1985.34, change: -0.5 }
    };

    const mockNews: NewsItem[] = [
      {
        title: "Federal Reserve Holds Interest Rates Steady",
        summary: "The Fed maintains current rates while signaling potential future adjustments based on inflation data.",
        url: "#",
        time_published: "2025-07-03T08:00:00Z",
        source: "Financial Times"
      },
      {
        title: "Small Business Confidence Index Reaches Highest Level This Year",
        summary: "NFIB report shows increased optimism among small business owners regarding economic outlook.",
        url: "#",
        time_published: "2025-07-03T07:30:00Z",
        source: "Reuters"
      },
      {
        title: "Tech Startup Funding Shows Signs of Recovery",
        summary: "VC investment in early-stage companies increases 15% quarter-over-quarter.",
        url: "#",
        time_published: "2025-07-03T06:45:00Z",
        source: "Bloomberg"
      }
    ];

    setTimeout(() => {
      setMarketData(mockMarketData);
      setNews(mockNews);
      setLoading(false);
    }, 1000);
  }, []);

  const formatChange = (change: number) => {
    const isPositive = change >= 0;
    return (
      <span className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
        {isPositive ? '+' : ''}{change.toFixed(2)}%
      </span>
    );
  };

  const featuredVideo = {
    title: "SomaTech Financial Analysis Deep Dive",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    duration: "24:15",
    description: "Learn advanced valuation techniques and cash flow modeling with real-world examples."
  };

  // Mock historical data for charts
  const historicalData = {
    fedRate: [
      { month: 'Jan', value: 5.0 },
      { month: 'Feb', value: 5.1 },
      { month: 'Mar', value: 5.15 },
      { month: 'Apr', value: 5.2 },
      { month: 'May', value: 5.25 },
      { month: 'Jun', value: 5.25 }
    ],
    inflation: [
      { month: 'Jan', value: 3.4 },
      { month: 'Feb', value: 3.3 },
      { month: 'Mar', value: 3.2 },
      { month: 'Apr', value: 3.1 },
      { month: 'May', value: 3.2 },
      { month: 'Jun', value: 3.2 }
    ]
  };

  const [selectedChart, setSelectedChart] = useState<string | null>(null);

  const announcements = [
    // Empty array to show "no announcements today"
  ];

  const contentResources = [
    {
      title: "The Complete Guide to Business Valuation",
      type: "Guide",
      description: "Learn the fundamentals of valuing any business with our comprehensive guide."
    },
    {
      title: "Financial Modeling Templates",
      type: "Templates",
      description: "Ready-to-use Excel templates for financial projections and analysis."
    },
    {
      title: "Investment Due Diligence Checklist",
      type: "Checklist",
      description: "Essential items to review before making any investment decision."
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-none bg-gradient-to-r from-primary/10 to-primary/5">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Welcome to SomaTech
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary/70 mx-auto rounded-full"></div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              SomaTech provides professional-grade financial analysis tools designed for entrepreneurs, 
              investors, and business professionals.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Announcements Section */}
      {announcements.length > 0 ? (
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-background">
          <CardHeader className="pb-3 bg-gradient-to-r from-primary/10 to-primary/5">
            <CardTitle className="text-sm font-medium flex items-center">
              <Megaphone className="h-4 w-4 mr-2" />
              Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            {announcements.map((announcement, index) => (
              <div key={index} className="p-3 bg-gradient-to-r from-background to-muted/20 rounded-lg">
                <p className="text-sm">{announcement}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-dashed border-2 border-muted bg-gradient-to-r from-muted/5 to-background">
          <CardContent className="p-6 text-center">
            <Megaphone className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No announcements today</p>
          </CardContent>
        </Card>
      )}

      {/* Horizontal Separator */}
      <div className="border-t border-border/30"></div>

      {/* Market Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Macroeconomic Indicators */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-3 bg-gradient-to-r from-primary/10 to-primary/5">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span className="flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                Key Indicators
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedChart(selectedChart === 'indicators' ? null : 'indicators')}
                className="h-6 w-6 p-0"
              >
                <BarChart3 className="h-3 w-3" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors" onClick={() => setSelectedChart('fedRate')}>
              <span className="text-sm text-muted-foreground">Fed Rate</span>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">5.25%</Badge>
                <BarChart3 className="h-3 w-3 text-muted-foreground" />
              </div>
            </div>
            <div className="flex justify-between items-center cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors" onClick={() => setSelectedChart('inflation')}>
              <span className="text-sm text-muted-foreground">Inflation</span>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">3.2%</Badge>
                <BarChart3 className="h-3 w-3 text-muted-foreground" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Unemployment</span>
              <Badge variant="outline" className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">3.8%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">GDP Growth</span>
              <Badge variant="outline" className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">2.4%</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Market Snapshot */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-3 bg-gradient-to-r from-green-50 to-green-100/50">
            <CardTitle className="text-sm font-medium flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              Market Snapshot
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {marketData && (
              <>
                <div className="flex justify-between items-center p-2 bg-gradient-to-r from-background to-muted/20 rounded">
                  <span className="text-sm text-muted-foreground">S&P 500</span>
                  <div className="text-right">
                    <div className="text-sm font-medium">{marketData.sp500.value.toLocaleString()}</div>
                    {formatChange(marketData.sp500.change)}
                  </div>
                </div>
                <div className="flex justify-between items-center p-2 bg-gradient-to-r from-background to-muted/20 rounded">
                  <span className="text-sm text-muted-foreground">NASDAQ</span>
                  <div className="text-right">
                    <div className="text-sm font-medium">{marketData.nasdaq.value.toLocaleString()}</div>
                    {formatChange(marketData.nasdaq.change)}
                  </div>
                </div>
                <div className="flex justify-between items-center p-2 bg-gradient-to-r from-background to-muted/20 rounded">
                  <span className="text-sm text-muted-foreground">10Y Treasury</span>
                  <div className="text-right">
                    <div className="text-sm font-medium">{marketData.treasury10y.value}%</div>
                    {formatChange(marketData.treasury10y.change)}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Business Environment */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-blue-100/50">
            <CardTitle className="text-sm font-medium flex items-center">
              <Building2 className="h-4 w-4 mr-2" />
              Business Pulse
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center p-2 bg-gradient-to-r from-green-50 to-green-100/30 rounded-lg">
              <span className="text-sm text-muted-foreground">SMB Confidence</span>
              <Badge variant="secondary" className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md">High</Badge>
            </div>
            <div className="flex justify-between items-center p-2 bg-gradient-to-r from-yellow-50 to-yellow-100/30 rounded-lg">
              <span className="text-sm text-muted-foreground">VC Funding</span>
              <Badge variant="secondary" className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-md">Moderate</Badge>
            </div>
            <div className="flex justify-between items-center p-2 bg-gradient-to-r from-green-50 to-green-100/30 rounded-lg">
              <span className="text-sm text-muted-foreground">Credit Access</span>
              <Badge variant="secondary" className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md">Good</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Key Alerts */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-3 bg-gradient-to-r from-orange-50 to-orange-100/50">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              Today's Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm p-2 bg-gradient-to-r from-blue-50 to-blue-100/30 rounded-lg">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0 shadow-sm"></div>
                <span className="text-muted-foreground">Fed meeting minutes released</span>
              </div>
            </div>
            <div className="text-sm p-2 bg-gradient-to-r from-green-50 to-green-100/30 rounded-lg">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0 shadow-sm"></div>
                <span className="text-muted-foreground">Tech earnings beat expectations</span>
              </div>
            </div>
            <div className="text-sm p-2 bg-gradient-to-r from-orange-50 to-orange-100/30 rounded-lg">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 flex-shrink-0 shadow-sm"></div>
                <span className="text-muted-foreground">Oil prices volatile</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historical Chart Modal */}
      {selectedChart && (
        <Card className="shadow-2xl border-2 border-primary/20">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
            <CardTitle className="flex items-center justify-between">
              <span>{selectedChart === 'fedRate' ? 'Federal Funds Rate - 6 Month Trend' : 'Inflation Rate - 6 Month Trend'}</span>
              <Button variant="ghost" size="sm" onClick={() => setSelectedChart(null)}>×</Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={selectedChart === 'fedRate' ? historicalData.fedRate : historicalData.inflation}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Featured Video Section */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-red-50 to-red-100/50">
          <CardTitle className="flex items-center">
            <PlayCircle className="h-5 w-5 mr-2" />
            Featured Video
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg shadow-lg">
                <img 
                  src={featuredVideo.thumbnail} 
                  alt={featuredVideo.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors">
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-medium">
                    FEATURED
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium">
                    {featuredVideo.duration}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                      <PlayCircle className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <h3 className="text-xl font-bold text-foreground">{featuredVideo.title}</h3>
              <p className="text-muted-foreground">{featuredVideo.description}</p>
              <Button className="w-fit bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
                <PlayCircle className="h-4 w-4 mr-2" />
                Watch Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Horizontal Separator */}
      <div className="border-t border-border/30"></div>

      {/* Content Resources */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-green-50 to-green-100/50">
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Learning Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contentResources.map((resource, index) => (
              <div key={index} className="p-4 bg-gradient-to-r from-background to-muted/20 rounded-lg hover:shadow-md transition-shadow cursor-pointer border border-border/30">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline">{resource.type}</Badge>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
                <h4 className="font-medium mb-2">{resource.title}</h4>
                <p className="text-sm text-muted-foreground">{resource.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Horizontal Separator */}
      <div className="border-t border-border/30"></div>

      {/* Latest News */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50">
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Latest Business News
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {news.map((item, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-background to-muted/20 rounded-lg hover:shadow-md transition-shadow cursor-pointer border border-border/30">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium hover:text-primary transition-colors">{item.title}</h4>
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{item.summary}</p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>{item.source}</span>
                    <span>•</span>
                    <span>{new Date(item.time_published).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;