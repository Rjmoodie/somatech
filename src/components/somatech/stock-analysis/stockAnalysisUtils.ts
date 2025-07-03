import { StockData } from "../types";
import { generateStockChartData } from "../utils";

// Generate mock stock data based on ticker symbol
export const generateStockDataForTicker = (ticker: string): StockData => {
  // Different mock data based on ticker
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