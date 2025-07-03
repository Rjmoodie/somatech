import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface StockTickerInputProps {
  globalTicker: string;
  setGlobalTicker: (ticker: string) => void;
  onAnalyze: () => void;
  loading?: boolean;
}

const StockTickerInput = ({ globalTicker, setGlobalTicker, onAnalyze, loading }: StockTickerInputProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Ticker Input</CardTitle>
        <CardDescription>Enter any public stock symbol for analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-4">
          <Input
            placeholder="AAPL"
            value={globalTicker}
            onChange={(e) => setGlobalTicker(e.target.value.toUpperCase())}
            className="flex-1"
          />
          <Button onClick={onAnalyze} disabled={loading}>
            <Search className="h-4 w-4 mr-2" />
            {loading ? "Loading..." : "Analyze"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockTickerInput;