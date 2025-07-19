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
  const handleTickerChange = (value: string) => {
    // Allow any input - no restrictions
    setGlobalTicker(value.toUpperCase());
  };

  const handleAnalyze = () => {
    if (!globalTicker.trim()) {
      return; // Just return if empty, no error message
    }
    
    onAnalyze();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Analysis</CardTitle>
        <CardDescription>Enter any stock symbol for comprehensive analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex space-x-4">
            <Input
              placeholder="Enter any stock symbol"
              value={globalTicker}
              onChange={(e) => handleTickerChange(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
              disabled={loading}
            />
            <Button 
              onClick={handleAnalyze} 
              disabled={loading}
              className="min-w-[100px]"
            >
              <Search className="h-4 w-4 mr-2" />
              {loading ? "Loading..." : "Analyze"}
            </Button>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground">
          <p>• Enter any stock symbol of your choice</p>
          <p>• Analysis includes real-time data, technical indicators, and valuation metrics</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockTickerInput;