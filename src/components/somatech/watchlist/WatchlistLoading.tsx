import { Card, CardContent } from "@/components/ui/card";

/**
 * Loading state component for watchlist
 */
export const WatchlistLoading = () => {
  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your watchlist...</p>
        </CardContent>
      </Card>
    </div>
  );
};