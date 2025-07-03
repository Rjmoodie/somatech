import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Star, TrendingUp, TrendingDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface WatchlistItem {
  id: string;
  ticker: string;
  company_name: string;
  current_price: number;
  dcf_scenario: string;
  dcf_intrinsic_value: number;
  dcf_upside_percentage: number;
  recommendation: string;
  score: number;
  market_cap: number;
  pe_ratio: number;
  notes: string;
  added_at: string;
}

const Watchlist = () => {
  const [watchlistItems, setWatchlistItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWatchlist = async () => {
    try {
      const { data, error } = await supabase
        .from('watchlist')
        .select('*')
        .order('added_at', { ascending: false });

      if (error) throw error;
      setWatchlistItems(data || []);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      toast.error('Failed to load watchlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = async (id: string) => {
    try {
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setWatchlistItems(items => items.filter(item => item.id !== id));
      toast.success('Removed from watchlist');
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      toast.error('Failed to remove from watchlist');
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${value.toLocaleString()}`;
  };

  const getScenarioBadgeColor = (scenario: string) => {
    switch (scenario) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'base': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation.toLowerCase()) {
      case 'strong buy':
      case 'buy':
        return 'text-green-600';
      case 'hold':
        return 'text-yellow-600';
      case 'sell':
      case 'strong sell':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your watchlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Stock Watchlist</h1>
          <p className="text-muted-foreground">
            Track your saved stock analyses and DCF scenarios
          </p>
        </div>

        {watchlistItems.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Star className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No stocks in your watchlist yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by analyzing a stock and saving it to your watchlist
              </p>
              <Button onClick={() => window.location.href = '/somatech'}>
                Analyze Stocks
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {watchlistItems.map((item) => (
              <Card key={item.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{item.ticker}</CardTitle>
                      <p className="text-sm text-muted-foreground">{item.company_name}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromWatchlist(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">${item.current_price.toFixed(2)}</span>
                    <Badge className={getScenarioBadgeColor(item.dcf_scenario)}>
                      {item.dcf_scenario.toUpperCase()} Case
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Market Cap</p>
                      <p className="font-medium">{formatCurrency(item.market_cap)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">P/E Ratio</p>
                      <p className="font-medium">{item.pe_ratio?.toFixed(1) || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">DCF Value</span>
                      <span className="font-medium">${item.dcf_intrinsic_value.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Upside/Downside</span>
                      <div className="flex items-center space-x-1">
                        {item.dcf_upside_percentage > 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                        <span className={`font-medium ${
                          item.dcf_upside_percentage > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {item.dcf_upside_percentage > 0 ? '+' : ''}{item.dcf_upside_percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className={`font-medium ${getRecommendationColor(item.recommendation)}`}>
                      {item.recommendation}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Score: {item.score}/100
                    </span>
                  </div>

                  {item.notes && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground">{item.notes}</p>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground">
                    Added: {new Date(item.added_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;