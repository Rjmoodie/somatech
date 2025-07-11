export interface MarketData {
  sp500: number;
  nasdaq: number;
  dow: number;
  vix: number;
  change: {
    sp500: number;
    nasdaq: number;
    dow: number;
    vix: number;
  };
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  timestamp: string;
  source: string;
  url?: string;
}

export const mockMarketData: MarketData = {
  sp500: 4156.82,
  nasdaq: 12845.39,
  dow: 33596.61,
  vix: 18.45,
  change: {
    sp500: 0.75,
    nasdaq: 1.23,
    dow: 0.45,
    vix: -2.1
  }
};

export const mockNews: NewsItem[] = [
  {
    id: "1",
    title: "Federal Reserve Signals Potential Rate Cut",
    summary: "Markets rally as Fed hints at possible monetary policy adjustments in response to economic indicators.",
    timestamp: "2 hours ago",
    source: "Financial Times"
  },
  {
    id: "2", 
    title: "Tech Sector Shows Strong Q4 Performance",
    summary: "Major technology companies report better-than-expected earnings, driving sector gains.",
    timestamp: "4 hours ago",
    source: "Bloomberg"
  },
  {
    id: "3",
    title: "Oil Prices Stabilize After Weekly Volatility", 
    summary: "Crude oil futures find support amid geopolitical tensions and supply concerns.",
    timestamp: "6 hours ago",
    source: "Reuters"
  }
];