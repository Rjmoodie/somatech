import { useStockData } from "./StockDataProvider";
import CompanySnapshot from "../CompanySnapshot";
import FinancialStatements from "../FinancialStatements";
import TradingViewChart from "../TradingViewChart";
import EnhancedPillarScorecard from "../EnhancedPillarScorecard";
import BusinessBenchmarks from "../BusinessBenchmarks";
import DCFAnalysis from "../DCFAnalysis";
import InvestmentThesisGenerator from "../InvestmentThesisGenerator";
import ExportActions from "../ExportActions";

interface StockAnalysisContentProps {
  globalTicker: string;
}

const StockAnalysisContent = ({ globalTicker }: StockAnalysisContentProps) => {
  const { 
    stockData, 
    dcfScenarios, 
    setDcfScenarios, 
    investmentThesis, 
    setInvestmentThesis 
  } = useStockData();

  if (!stockData) return null;

  return (
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
        <ExportActions 
          ticker={globalTicker}
          stockData={stockData}
          dcfScenarios={dcfScenarios}
          investmentThesis={investmentThesis}
        />
      </div>
    </div>
  );
};

export default StockAnalysisContent;