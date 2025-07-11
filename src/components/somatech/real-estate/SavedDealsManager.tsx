import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderOpen } from "lucide-react";
import { SavedDeal } from "./brrrrCalculations";
import { formatCurrency, formatPercentage } from "./realEstateUtils";
import { DealComparison } from "./DealComparison";

interface SavedDealsManagerProps {
  savedDeals: SavedDeal[];
  onLoadDeal: (deal: SavedDeal) => void;
  onSwitchToCalculator?: () => void;
}

export const SavedDealsManager = ({ 
  savedDeals, 
  onLoadDeal, 
  onSwitchToCalculator 
}: SavedDealsManagerProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Saved Deals</h2>
        <DealComparison savedDeals={savedDeals} />
      </div>

      {savedDeals.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4">
            <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto" />
          </div>
          <h3 className="text-lg font-medium mb-2">No saved deals found</h3>
          <p className="text-muted-foreground mb-4">
            Save your BRRRR analyses to compare deals and track your investment pipeline.
          </p>
          <Button variant="outline" onClick={onSwitchToCalculator}>
            Create Your First Deal
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedDeals.map((deal) => (
            <Card 
              key={deal.id} 
              className="hover:shadow-md transition-all cursor-pointer hover:scale-[1.02]" 
              onClick={() => onLoadDeal(deal)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate">{deal.deal_name}</CardTitle>
                    <CardDescription className="text-xs">
                      {new Date(deal.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  {(() => {
                    const roi = deal.results.postRefinanceROI;
                    if (roi >= 15) return <span className="text-lg">🚀</span>;
                    if (roi >= 10) return <span className="text-lg">💪</span>;
                    if (roi >= 5) return <span className="text-lg">👍</span>;
                    return <span className="text-lg">⚠️</span>;
                  })()}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Purchase:</span>
                    <span className="font-medium">{formatCurrency(deal.inputs.purchasePrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Investment:</span>
                    <span className="font-medium">{formatCurrency(deal.results.totalInvestment)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">ROI:</span>
                    <span className={`font-bold ${deal.results.postRefinanceROI >= 10 ? 'text-green-600' : deal.results.postRefinanceROI >= 5 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {formatPercentage(deal.results.postRefinanceROI)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cash Flow:</span>
                    <span className={`font-medium ${deal.results.postRefinanceCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(deal.results.postRefinanceCashFlow)}/mo
                    </span>
                  </div>
                </div>
                
                {deal.notes && (
                  <div className="mt-3 pt-2 border-t">
                    <p className="text-xs text-muted-foreground truncate">
                      {deal.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};