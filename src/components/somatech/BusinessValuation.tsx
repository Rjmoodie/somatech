import { useState } from "react";
import { BusinessValuationInputs, ValuationMethods, BusinessValuationReport } from "./types";
import BusinessValuationInputForm from "./business-valuation/BusinessValuationInputForm";
import BusinessValuationResults from "./business-valuation/BusinessValuationResults";
import BusinessValuationChart from "./business-valuation/BusinessValuationChart";
import BusinessValuationExport from "./business-valuation/BusinessValuationExport";
import { calculateBusinessValuation } from "./business-valuation/valuationEngine";

const BusinessValuation = () => {
  const [inputs, setInputs] = useState<BusinessValuationInputs>({
    industry: "",
    businessType: "",
    currentRevenue: 0,
    grossMargin: 60,
    ebitdaMargin: 25,
    netMargin: 15,
    revenueGrowth: 15,
    exitTimeframe: 5,
    discountRate: 10,
    terminalGrowthRate: 3
  });

  const [methods, setMethods] = useState<ValuationMethods>({
    revenueMultiple: true,
    ebitdaMultiple: true,
    peMultiple: true,
    dcf: true
  });

  const [report, setReport] = useState<BusinessValuationReport | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleInputChange = (field: keyof BusinessValuationInputs, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleMethodChange = (method: keyof ValuationMethods, checked: boolean) => {
    setMethods(prev => ({ ...prev, [method]: checked }));
  };

  const handleCalculate = async () => {
    setIsCalculating(true);
    
    // Simulate calculation delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const calculatedReport = calculateBusinessValuation(inputs, methods);
      setReport(calculatedReport);
    } catch (error) {
      console.error("Error calculating valuation:", error);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BusinessValuationInputForm
          inputs={inputs}
          methods={methods}
          onInputChange={handleInputChange}
          onMethodChange={handleMethodChange}
          onCalculate={handleCalculate}
          isCalculating={isCalculating}
        />
        
        {report && (
          <div className="space-y-6">
            <BusinessValuationChart report={report} />
            <BusinessValuationExport report={report} />
          </div>
        )}
      </div>

      {report && (
        <BusinessValuationResults report={report} />
      )}
    </div>
  );
};

export default BusinessValuation;