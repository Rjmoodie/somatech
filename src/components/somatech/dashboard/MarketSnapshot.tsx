import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { MarketData } from "./mockData";

interface MarketSnapshotProps {
  marketData: MarketData | null;
}

const MarketSnapshot = ({ marketData }: MarketSnapshotProps) => {
  if (!marketData) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <span>Market Snapshot</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-40">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-300 h-10 w-10"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const indices = [
    { name: "S&P 500", value: marketData?.sp500 || 0, change: marketData?.change?.sp500 || 0 },
    { name: "NASDAQ", value: marketData?.nasdaq || 0, change: marketData?.change?.nasdaq || 0 },
    { name: "DOW", value: marketData?.dow || 0, change: marketData?.change?.dow || 0 },
    { name: "VIX", value: marketData?.vix || 0, change: marketData?.change?.vix || 0 }
  ];

  return (
    <Card className="premium-card h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <span>Market Snapshot</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {indices.map((index, i) => (
          <div key={i} className="flex items-center justify-between p-3 surface-card hover:bg-muted/30 transition-colors rounded-xl">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{index.name}</p>
              <p className="text-xl font-bold text-foreground">
                {index.value.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                index.change > 0 
                  ? "bg-success/10" 
                  : "bg-destructive/10"
              }`}>
                {index.change > 0 ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
              </div>
              <span className={`text-sm font-semibold ${
                index.change > 0 ? "text-success" : "text-destructive"
              }`}>
                {index.change > 0 ? "+" : ""}{index.change}%
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default MarketSnapshot;