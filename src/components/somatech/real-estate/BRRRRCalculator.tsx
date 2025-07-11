import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, RefreshCw, DollarSign, TrendingUp, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { BRRRRInputs, BRRRRResults, calculateBRRRR } from "./brrrrCalculations";
import { formatCurrency, formatPercentage } from "./realEstateUtils";
import { BRRRRExplainer } from "./BRRRRExplainer";
import { MobileOptimizedForm } from "./MobileOptimizedForm";
import { FinancialTooltip } from "./FinancialTooltip";
import { PerformanceOptimizations } from "./PerformanceOptimizations";

interface BRRRRCalculatorProps {
  inputs: BRRRRInputs;
  onInputChange: (field: keyof BRRRRInputs, value: number) => void;
  results: BRRRRResults | null;
  onResults: (results: BRRRRResults) => void;
  onSaveClick: () => void;
  isMobile: boolean;
  dealName: string;
  dealNotes: string;
  currentDealId: string | null;
  onAutoSave: () => Promise<boolean>;
}

export const BRRRRCalculator = ({
  inputs,
  onInputChange,
  results,
  onResults,
  onSaveClick,
  isMobile,
  dealName,
  dealNotes,
  currentDealId,
  onAutoSave
}: BRRRRCalculatorProps) => {
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculateBRRRR = async () => {
    setIsCalculating(true);
    
    try {
      // Add small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const calculatedResults = calculateBRRRR(inputs);
      onResults(calculatedResults);
      
      toast({
        title: "BRRRR Analysis Complete",
        description: "Your BRRRR analysis has been calculated successfully.",
      });
    } catch (error) {
      console.error("Error calculating BRRRR:", error);
      toast({
        title: "Calculation Error",
        description: "There was an error calculating the BRRRR analysis. Please check your inputs.",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with explainer and auto-save status */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">BRRRR Calculator</h2>
          <BRRRRExplainer />
        </div>
        {currentDealId && (
          <PerformanceOptimizations
            inputs={inputs}
            results={results}
            dealName={dealName}
            dealNotes={dealNotes}
            currentDealId={currentDealId}
            onAutoSave={onAutoSave}
          />
        )}
      </div>
      
      {/* Mobile vs Desktop Layout */}
      {isMobile ? (
        <div className="space-y-6">
          <MobileOptimizedForm
            inputs={inputs}
            onInputChange={onInputChange}
            onCalculate={handleCalculateBRRRR}
            isCalculating={isCalculating}
          />
          
          {/* Mobile Results */}
          {results && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Analysis Results
                    <FinancialTooltip
                      term="Post-Refi ROI"
                      definition="Return on Investment after refinancing. This shows how much annual return you're getting on your remaining invested capital."
                      formula="(Annual Cash Flow ÷ Remaining Investment) × 100"
                      goodRange={{ min: 8, max: 20, label: "Target Range: 8-20%" }}
                      value={results.postRefinanceROI}
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Total Investment</p>
                      <p className="font-bold text-lg">{formatCurrency(results.totalInvestment)}</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Post-Refi ROI</p>
                      <p className="font-bold text-lg">{formatPercentage(results.postRefinanceROI)}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Cash Out</p>
                      <p className="font-bold text-lg">{formatCurrency(results.cashOutAmount)}</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Equity Created</p>
                      <p className="font-bold text-lg">{formatCurrency(results.equityCreated)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex gap-2">
                <Button onClick={onSaveClick} className="flex-1 gap-2">
                  <Save className="h-4 w-4" />
                  Save Deal
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Desktop BRRRR Input Forms */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-blue-500" />
                  Buy Phase
                </CardTitle>
                <CardDescription>Property acquisition details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label>Purchase Price ($)</label>
                    <input
                      type="number"
                      value={inputs.purchasePrice}
                      onChange={(e) => onInputChange('purchasePrice', Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <label>Down Payment (%)</label>
                    <input
                      type="number"
                      value={inputs.downPaymentPercent}
                      onChange={(e) => onInputChange('downPaymentPercent', Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>
                {/* Add more input fields as needed */}
              </CardContent>
            </Card>

            <Button 
              onClick={handleCalculateBRRRR} 
              className="w-full" 
              size="lg"
              disabled={isCalculating}
            >
              {isCalculating ? "Calculating..." : "Calculate BRRRR Analysis"}
            </Button>
          </div>

          {/* Desktop BRRRR Results */}
          {results && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    BRRRR Analysis Results
                    <FinancialTooltip
                      term="BRRRR Results"
                      definition="Complete analysis of your Buy, Rehab, Rent, Refinance, Repeat strategy showing key financial metrics."
                      goodRange={{ min: 8, max: 20, label: "Target ROI: 8-20%" }}
                      value={results.postRefinanceROI}
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      Total Investment:
                      <FinancialTooltip
                        term="Total Investment"
                        definition="Your remaining cash investment after refinancing and pulling out capital."
                        formula="Initial Investment - Cash Out Amount"
                      />
                    </span>
                    <span className="font-semibold">{formatCurrency(results.totalInvestment)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      Post-Refi ROI:
                      <FinancialTooltip
                        term="Post-Refinance ROI"
                        definition="Your annual return on investment after refinancing, based on remaining capital invested."
                        formula="(Annual Cash Flow ÷ Remaining Investment) × 100"
                        goodRange={{ min: 8, max: 20, label: "Target Range: 8-20%" }}
                        value={results.postRefinanceROI}
                      />
                    </span>
                    <span className="font-semibold">{formatPercentage(results.postRefinanceROI)}</span>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex gap-2">
                <Button onClick={onSaveClick} variant="outline" size="lg" className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Deal
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};