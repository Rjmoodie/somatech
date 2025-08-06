import { useEffect, useState } from 'react';
import { mockMarketData, mockNews, type MarketData, type NewsItem } from './mockData';

export function useDashboardData() {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    // Simulate async fetch
    const timeout = setTimeout(() => {
      try {
        setMarketData(mockMarketData);
        setNews(mockNews);
        setLoading(false);
      } catch (e) {
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  return { marketData, news, loading, error };
} 