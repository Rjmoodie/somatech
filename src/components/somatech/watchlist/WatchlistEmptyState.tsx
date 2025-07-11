import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

interface WatchlistEmptyStateProps {
  onAnalyzeStocks: () => void;
}

/**
 * Empty state component for when watchlist has no items
 */
export const WatchlistEmptyState = ({ onAnalyzeStocks }: WatchlistEmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <Star className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-medium mb-2">No stocks in your watchlist yet</h3>
      <p className="text-muted-foreground mb-4">
        Start by analyzing a stock and saving it to your watchlist
      </p>
      <button 
        onClick={onAnalyzeStocks}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        Analyze Stocks
      </button>
    </div>
  );
};