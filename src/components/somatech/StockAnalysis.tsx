import { useState } from "react";
import { StockData, DCFScenarios, InvestmentThesis } from "./types";
import { generateStockChartData } from "./utils";
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

  const analyzeStock = () => {
    const mockData: StockData = {
      symbol: globalTicker,
      price: 175.43,
      pe: 25.4,
      pbv: 4.2,
      roe: 26.8,
      debtToEquity: 1.73,
      currentRatio: 1.05,
      score: 85,
      intrinsicValue: 165,
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
        ma50: 168.50,
        ma200: 155.20,
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
    setStockData(mockData);
  };

  return (
    <div className="space-y-6">
      <StockTickerInput 
        globalTicker={globalTicker}
        setGlobalTicker={setGlobalTicker}
        onAnalyze={analyzeStock}
      />

      {stockData && (
        <div className="space-y-6">
          <CompanySnapshot ticker={globalTicker} />
          <FinancialStatements ticker={globalTicker} />
          <TradingViewChart ticker={globalTicker} />
          <EnhancedPillarScorecard ticker={globalTicker} />
          <BusinessBenchmarks ticker={globalTicker} />
          <DCFAnalysis 
            ticker={globalTicker}
            dcfScenarios={dcfScenarios}
            setDcfScenarios={setDcfScenarios}
            stockData={stockData}
          />
          <InvestmentThesisGenerator 
            ticker={globalTicker}
            investmentThesis={investmentThesis}
            setInvestmentThesis={setInvestmentThesis}
          />
          <ExportActions ticker={globalTicker} />
        </div>
      )}
    </div>
  );
};

export default StockAnalysis;