import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Plus } from "lucide-react";

interface WatchlistHeaderProps {
  onAddStock: () => void;
}

/**
 * Header component for the watchlist with title and add stock button
 */
export const WatchlistHeader = ({ onAddStock }: WatchlistHeaderProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5" />
              <span>Stock Watchlist</span>
            </CardTitle>
            <p className="text-muted-foreground mt-1">
              Track your saved stock analyses and DCF scenarios
            </p>
          </div>
          <Button onClick={onAddStock}>
            <Plus className="h-4 w-4 mr-2" />
            Add Stock
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
};