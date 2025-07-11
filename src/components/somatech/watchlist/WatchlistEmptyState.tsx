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
    <div className="text-center py-16 space-y-6">
      <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-full flex items-center justify-center mx-auto">
        <Star className="h-12 w-12 text-blue-600 dark:text-blue-400" />
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          Start Building Your Watchlist
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Track your favorite stocks with DCF analysis, price targets, and investment recommendations. 
          Begin by analyzing your first stock.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
        <button 
          onClick={onAnalyzeStocks}
          className="btn-premium flex items-center space-x-2"
        >
          <Star className="h-4 w-4" />
          <span>Analyze Your First Stock</span>
        </button>
        <div className="text-sm text-muted-foreground">
          or explore popular stocks like AAPL, GOOGL, MSFT
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto pt-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-2">
            <span className="text-green-600 dark:text-green-400 font-bold text-sm">DCF</span>
          </div>
          <p className="text-xs text-muted-foreground">Intrinsic Value</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-2">
            <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">%</span>
          </div>
          <p className="text-xs text-muted-foreground">Upside/Downside</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mx-auto mb-2">
            <span className="text-orange-600 dark:text-orange-400 font-bold text-sm">★</span>
          </div>
          <p className="text-xs text-muted-foreground">Score & Rating</p>
        </div>
      </div>
    </div>
  );
};