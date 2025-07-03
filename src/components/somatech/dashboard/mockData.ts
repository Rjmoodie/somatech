// Mock data for dashboard components
export interface MarketData {
  sp500: { value: number; change: number };
  nasdaq: { value: number; change: number };
  dow: { value: number; change: number };
  treasury10y: { value: number; change: number };
  oil: { value: number; change: number };
  gold: { value: number; change: number };
}

export interface NewsItem {
  title: string;
  summary: string;
  url: string;
  time_published: string;
  source: string;
}

export const mockMarketData: MarketData = {
  sp500: { value: 4563.45, change: 1.2 },
  nasdaq: { value: 14234.56, change: 0.8 },
  dow: { value: 35234.78, change: -0.3 },
  treasury10y: { value: 4.25, change: 0.05 },
  oil: { value: 78.45, change: 2.1 },
  gold: { value: 1985.34, change: -0.5 }
};

export const mockNews: NewsItem[] = [
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