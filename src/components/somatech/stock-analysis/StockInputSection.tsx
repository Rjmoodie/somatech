import { useStockData } from "./StockDataProvider";
import StockTickerInput from "../StockTickerInput";

interface StockInputSectionProps {
  globalTicker: string;
  setGlobalTicker: (ticker: string) => void;
}

const StockInputSection = ({ globalTicker, setGlobalTicker }: StockInputSectionProps) => {
  const { analyzeStock, loading } = useStockData();

  return (
    <div className="elevated-card p-6 primary-glow">
      <StockTickerInput 
        globalTicker={globalTicker}
        setGlobalTicker={setGlobalTicker}
        onAnalyze={analyzeStock}
        loading={loading}
      />
    </div>
  );
};

export default StockInputSection;