import { useState, useEffect } from "react";
import { StockData, DCFScenarios, InvestmentThesis } from "./types";
import { generateStockChartData } from "./utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import StockTickerInput from "./StockTickerInput";
import CompanySnapshot from "./CompanySnapshot";
import FinancialStatements from "./FinancialStatements";
import TradingViewChart from "./TradingViewChart";
import EnhancedPillarScorecard from "./EnhancedPillarScorecard";
import BusinessBenchmarks from "./BusinessBenchmarks";
import DCFAnalysis from "./DCFAnalysis";
import InvestmentThesisGenerator from "./InvestmentThesisGenerator";
import ExportActions from "./ExportActions";

interface StockAnalysisProps {
  globalTicker: string;
  setGlobalTicker: (ticker: string) => void;
}

const StockAnalysis = ({ globalTicker, setGlobalTicker }: StockAnalysisProps) => {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(false);
  const [dcfScenarios, setDcfScenarios] = useState<DCFScenarios>({
    low: { revenueGrowth: 5, netMargin: 8, fcfGrowth: 3, exitMultiple: 15, discountRate: 12 },
    base: { revenueGrowth: 12, netMargin: 15, fcfGrowth: 8, exitMultiple: 20, discountRate: 10 },
    high: { revenueGrowth: 20, netMargin: 22, fcfGrowth: 15, exitMultiple: 25, discountRate: 8 }
  });
  const [investmentThesis, setInvestmentThesis] = useState<InvestmentThesis>({
    moat: "",
    risks: "",
    opportunities: ""
  });

  const generateMockData = (ticker: string): StockData => {
    // Generate different mock data based on ticker
    const baseData: Record<string, Partial<StockData>> = {
      AAPL: { price: 175.43, pe: 25.4 },
      TSLA: { price: 248.50, pe: 45.2 },
      MSFT: { price: 412.30, pe: 28.1 },
      GOOGL: { price: 138.21, pe: 22.8 },
      AMZN: { price: 145.86, pe: 35.7 }
    };

    const tickerData = baseData[ticker] || { price: 185.20, pe: 20.5 };
    
    return {
      symbol: ticker,
      price: tickerData.price || 185.20,
      pe: tickerData.pe || 20.5,
      pbv: 4.2,
      roe: 26.8,
      debtToEquity: 1.73,
      currentRatio: 1.05,
      score: 85,
      intrinsicValue: (tickerData.price || 185.20) * 0.94,
      recommendation: "BUY",
      chartData: generateStockChartData(),
      pillars: {
        revenueGrowth: { score: 85, status: "good", value: "15.2%" },
        epsGrowth: { score: 78, status: "good", value: "12.8%" },
        returnOnCapital: { score: 92, status: "excellent", value: "26.8%" },
        debtLevels: { score: 65, status: "moderate", value: "1.73x" },
        freeCashFlow: { score: 88, status: "good", value: "$12.4B" },
        valuation: { score: 72, status: "moderate", value: "25.4x P/E" },
        shareDilution: { score: 90, status: "excellent", value: "-2.1%" },
        insiderOwnership: { score: 95, status: "excellent", value: "8.4%" }
      },
      technicals: {
        trend: "bullish",
        ma50: (tickerData.price || 185.20) * 0.96,
        ma200: (tickerData.price || 185.20) * 0.89,
        rsi: 62,
        macd: "positive"
      },
      ratios: {
        quickRatio: 0.98,
        assetTurnover: 1.1,
        grossMargin: 42.5,
        operatingMargin: 28.1
      }
    };
  };

  const analyzeStock = async () => {
    if (!globalTicker) {
      toast.error("Please enter a stock symbol");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-stock-data', {
        body: { symbol: globalTicker }
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setStockData(data);
      toast.success(`Successfully loaded data for ${globalTicker}`);
    } catch (error) {
      console.error('Error fetching stock data:', error);
      toast.error(`Failed to fetch real-time data for ${globalTicker}. Please try another symbol or check if the market is open.`);
      // Clear any existing data to show the error state
      setStockData(null);
    } finally {
      setLoading(false);
    }
  };

  // Auto-update data when ticker changes
  useEffect(() => {
    if (globalTicker && stockData) {
      analyzeStock();
    }
  }, [globalTicker]);

  return (
    <div className="space-y-8">
      <div className="elevated-card p-6 primary-glow">
        <StockTickerInput 
          globalTicker={globalTicker}
          setGlobalTicker={setGlobalTicker}
          onAnalyze={analyzeStock}
          loading={loading}
        />
      </div>

      {stockData && (
        <div className="space-y-8">
          <div className="glass-card smooth-transition">
            <CompanySnapshot ticker={globalTicker} stockData={stockData} />
          </div>
          <div className="glass-card smooth-transition">
            <FinancialStatements ticker={globalTicker} stockData={stockData} />
          </div>
          <div className="glass-card smooth-transition">
            <TradingViewChart ticker={globalTicker} />
          </div>
          <div className="glass-card smooth-transition">
            <EnhancedPillarScorecard ticker={globalTicker} stockData={stockData} />
          </div>
          <div className="glass-card smooth-transition">
            <BusinessBenchmarks ticker={globalTicker} stockData={stockData} />
          </div>
          <div className="glass-card smooth-transition">
            <DCFAnalysis 
              ticker={globalTicker}
              dcfScenarios={dcfScenarios}
              setDcfScenarios={setDcfScenarios}
              stockData={stockData}
            />
          </div>
          <div className="glass-card smooth-transition">
            <InvestmentThesisGenerator 
              ticker={globalTicker}
              investmentThesis={investmentThesis}
              setInvestmentThesis={setInvestmentThesis}
            />
          </div>
          <div className="glass-card smooth-transition">
            <ExportActions ticker={globalTicker} />
          </div>
        </div>
      )}
    </div>
  );
};

export default StockAnalysis;