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
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          <span>Market Snapshot</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {indices.map((index, i) => (
          <div key={i} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{index.name}</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {index.value.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center space-x-1">
              {index.change > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ${
                index.change > 0 ? "text-green-600" : "text-red-600"
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