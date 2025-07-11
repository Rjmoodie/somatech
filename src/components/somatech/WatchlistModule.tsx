import { useState, useEffect } from "react";
import { CardContent } from "@/components/ui/card";
import { WatchlistHeader } from "./watchlist/WatchlistHeader";
import { WatchlistCard } from "./watchlist/WatchlistCard";
import { WatchlistEmptyState } from "./watchlist/WatchlistEmptyState";
import { WatchlistLoading } from "./watchlist/WatchlistLoading";
import { useWatchlistOperations } from "./watchlist/useWatchlistOperations";

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

interface WatchlistModuleProps {
  setActiveModule: (module: string) => void;
}

/**
 * Main watchlist module component
 */
const WatchlistModule = ({ setActiveModule }: WatchlistModuleProps) => {
  const [watchlistItems, setWatchlistItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { fetchWatchlist, removeFromWatchlist } = useWatchlistOperations();

  const loadWatchlist = async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await fetchWatchlist();
      setWatchlistItems(items);
    } catch (err) {
      setError('Failed to load your watchlist. Please try again.');
      console.error('Error loading watchlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (id: string) => {
    const success = await removeFromWatchlist(id);
    if (success) {
      setWatchlistItems(items => items.filter(item => item.id !== id));
    }
  };

  const handleAddStock = () => {
    setActiveModule('stock-analysis');
  };

  useEffect(() => {
    loadWatchlist();
  }, []);

  if (loading) {
    return <WatchlistLoading />;
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-red-600 dark:text-red-400 font-bold">!</span>
        </div>
        <h3 className="text-lg font-medium mb-2 text-red-800 dark:text-red-200">
          Unable to Load Watchlist
        </h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <button 
          onClick={loadWatchlist}
          className="btn-premium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <WatchlistHeader onAddStock={handleAddStock} />
      
      <CardContent>
        {watchlistItems.length === 0 ? (
          <WatchlistEmptyState onAnalyzeStocks={handleAddStock} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {watchlistItems.map((item) => (
              <WatchlistCard 
                key={item.id} 
                item={item} 
                onRemove={handleRemoveItem}
              />
            ))}
          </div>
        )}
      </CardContent>
    </div>
  );
};

export default WatchlistModule;