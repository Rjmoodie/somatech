import { useState } from "react";
import { CardContent } from "@/components/ui/card";
import { WatchlistHeader } from "./watchlist/WatchlistHeader";
import { WatchlistCard } from "./watchlist/WatchlistCard";
import { WatchlistEmptyState } from "./watchlist/WatchlistEmptyState";
import { WatchlistLoading } from "./watchlist/WatchlistLoading";
import { useWatchlistOperations } from "./watchlist/useWatchlistOperations";
import { useAuth } from "./AuthProvider";
import { modules } from "./constants";


const module = modules.find(m => m.id === "watchlist");

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

const WatchlistModule = ({ setActiveModule }: WatchlistModuleProps) => {
  const { user } = useAuth();
  const { data: watchlistItems = [], isLoading, error, refetch } = useWatchlistOperations(user?.id);

  const handleAddStock = () => {
    setActiveModule('stock-analysis');
  };

  // JSON-LD structured data for the watchlist
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": module?.name,
    "description": module?.seo?.description,
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "All",
    "publisher": {
      "@type": "Organization",
      "name": "SomaTech"
    }
  };

  if (isLoading) {
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
        <p className="text-muted-foreground mb-4">{error.message || 'Failed to load your watchlist. Please try again.'}</p>
        <button 
          onClick={() => refetch()}
          className="btn-premium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>

      <WatchlistHeader onAddStock={handleAddStock} />
      <CardContent>
        {Array.isArray(watchlistItems) && watchlistItems.length === 0 ? (
          <WatchlistEmptyState onAnalyzeStocks={handleAddStock} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {Array.isArray(watchlistItems) && watchlistItems.map((item) => (
              <WatchlistCard 
                key={item.id} 
                item={item} 
                onRemove={() => refetch()}
              />
            ))}
          </div>
        )}
      </CardContent>
    </>
  );
};

export default WatchlistModule;