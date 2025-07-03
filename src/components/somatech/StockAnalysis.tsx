import { StockDataProvider } from "./stock-analysis/StockDataProvider";
import StockInputSection from "./stock-analysis/StockInputSection";
import StockAnalysisContent from "./stock-analysis/StockAnalysisContent";

interface StockAnalysisProps {
  globalTicker: string;
  setGlobalTicker: (ticker: string) => void;
}

const StockAnalysis = ({ globalTicker, setGlobalTicker }: StockAnalysisProps) => {
  return (
    <StockDataProvider globalTicker={globalTicker}>
      <div className="space-y-8">
        <StockInputSection 
          globalTicker={globalTicker} 
          setGlobalTicker={setGlobalTicker} 
        />
        <StockAnalysisContent globalTicker={globalTicker} />
      </div>
    </StockDataProvider>
  );
};

export default StockAnalysis;