import { useStockData } from "./StockDataProvider";
import CompanySnapshot from "../CompanySnapshot";
import FinancialStatements from "../FinancialStatements";
import TradingViewChart from "../TradingViewChart";
import EnhancedPillarScorecard from "../EnhancedPillarScorecard";
import BusinessBenchmarks from "../BusinessBenchmarks";
import DCFAnalysis from "../DCFAnalysis";
import InvestmentThesisGenerator from "../InvestmentThesisGenerator";
import ExportActions from "../ExportActions";
import { modules } from "../../somatech/constants";
import SEO from "../../SEO";
import ValuedMetricsSection from "../ValuedMetricsSection";

const module = modules.find(m => m.id === "stock-analysis");

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

  // Build companyMetrics object from stockData
  const companyMetrics: Record<string, string | number> = {
    "P/E Ratio": stockData.pe,
    "Market Cap": stockData.marketCap,
    "ROE": stockData.roe,
    "Debt to Equity": stockData.debtToEquity,
    "Current Ratio": stockData.currentRatio,
    "Dividend Yield": stockData.dividendYield,
    "Beta": stockData.beta,
    // Add more mappings as needed based on your Excel metric names
  };

  // JSON-LD structured data for the stock analysis module
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": module?.name,
    "description": module?.seo?.description,
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "All",
    "publisher": {
      "@type": "Organization",
      "name": "SomaTech"
    }
  };

  return (
    <>
      {module?.seo && (
        <SEO
          title={module.seo.title}
          description={module.seo.description}
          keywords={module.seo.keywords}
          url={typeof window !== 'undefined' ? window.location.href : undefined}
          jsonLd={jsonLd}
        />
      )}
      <div className="space-y-8">
        <div className="glass-card smooth-transition">
          <CompanySnapshot ticker={globalTicker} stockData={stockData} />
        </div>
        {/* Valued Metrics Section (replaces 8-Pillar Scorecard) */}
        <div className="glass-card smooth-transition">
          <ValuedMetricsSection sector={stockData.sector || "Technology"} companyMetrics={companyMetrics} />
        </div>
        <div className="glass-card smooth-transition">
          <FinancialStatements ticker={globalTicker} stockData={stockData} />
        </div>
        <div className="glass-card smooth-transition">
          <TradingViewChart ticker={globalTicker} />
        </div>
        {/* <div className="glass-card smooth-transition">
          <EnhancedPillarScorecard ticker={globalTicker} stockData={stockData} />
        </div> */} // Removed: Replaced by ValuedMetricsSection
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
    </>
  );
};

export default StockAnalysisContent;