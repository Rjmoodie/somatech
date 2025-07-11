import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, TrendingUp, TrendingDown } from "lucide-react";
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

interface WatchlistCardProps {
  item: WatchlistItem;
  onRemove: (id: string) => void;
}

/**
 * Individual watchlist item card component
 */
export const WatchlistCard = ({ item, onRemove }: WatchlistCardProps) => {
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

  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{item.ticker}</h3>
            <p className="text-sm text-muted-foreground">{item.company_name}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(item.id)}
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
  );
};