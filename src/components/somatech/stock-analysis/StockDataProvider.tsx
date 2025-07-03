import React, { useState, useEffect, ReactNode } from "react";
import { StockData, DCFScenarios, InvestmentThesis } from "../types";
import { generateStockDataForTicker } from "./stockAnalysisUtils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface StockDataContextType {
  stockData: StockData | null;
  loading: boolean;
  dcfScenarios: DCFScenarios;
  setDcfScenarios: (scenarios: DCFScenarios) => void;
  investmentThesis: InvestmentThesis;
  setInvestmentThesis: (thesis: InvestmentThesis) => void;
  analyzeStock: () => Promise<void>;
}

const StockDataContext = React.createContext<StockDataContextType | null>(null);

interface StockDataProviderProps {
  children: ReactNode;
  globalTicker: string;
}

export const StockDataProvider = ({ children, globalTicker }: StockDataProviderProps) => {
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

  const value = {
    stockData,
    loading,
    dcfScenarios,
    setDcfScenarios,
    investmentThesis,
    setInvestmentThesis,
    analyzeStock
  };

  return (
    <StockDataContext.Provider value={value}>
      {children}
    </StockDataContext.Provider>
  );
};

export const useStockData = () => {
  const context = React.useContext(StockDataContext);
  if (!context) {
    throw new Error('useStockData must be used within a StockDataProvider');
  }
  return context;
};