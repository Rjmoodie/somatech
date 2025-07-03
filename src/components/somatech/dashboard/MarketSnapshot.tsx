import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, TrendingUp, TrendingDown } from "lucide-react";

interface MarketData {
  sp500: { value: number; change: number };
  nasdaq: { value: number; change: number };
  dow: { value: number; change: number };
  treasury10y: { value: number; change: number };
  oil: { value: number; change: number };
  gold: { value: number; change: number };
}

interface MarketSnapshotProps {
  marketData: MarketData | null;
}

const MarketSnapshot = ({ marketData }: MarketSnapshotProps) => {
  const formatChange = (change: number) => {
    const isPositive = change >= 0;
    return (
      <span className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
        {isPositive ? '+' : ''}{change.toFixed(2)}%
      </span>
    );
  };

  const marketItems = marketData ? [
    { label: "S&P 500", value: marketData.sp500.value, change: marketData.sp500.change },
    { label: "NASDAQ", value: marketData.nasdaq.value, change: marketData.nasdaq.change },
    { label: "10Y Treasury", value: `${marketData.treasury10y.value}%`, change: marketData.treasury10y.change, isPercentage: true }
  ] : [];

  return (
    <Card className="border border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center">
          <Activity className="h-4 w-4 mr-2" />
          Market Snapshot
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {marketItems.map((item) => (
          <div key={item.label} className="flex justify-between items-center p-2 bg-muted/20 rounded">
            <span className="text-sm text-muted-foreground">{item.label}</span>
            <div className="text-right">
              <div className="text-sm font-medium">
                {item.isPercentage ? item.value : (item.value as number).toLocaleString()}
              </div>
              {formatChange(item.change)}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default MarketSnapshot;