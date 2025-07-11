import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DCFScenarios, StockData } from "./types";
import { calculateDCF } from "./utils";

interface DCFAnalysisProps {
  ticker: string;
  dcfScenarios: DCFScenarios;
  setDcfScenarios: (scenarios: DCFScenarios) => void;
  stockData: StockData | null;
}

const DCFAnalysis = ({ ticker, dcfScenarios, setDcfScenarios, stockData }: DCFAnalysisProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{ticker} DCF Scenario Analysis</CardTitle>
        <CardDescription>Three-scenario valuation model for {ticker} with customizable inputs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Input Table */}
          <div className="overflow-x-auto">
            <div className="grid grid-cols-4 gap-2 sm:gap-4 min-w-[400px]">
              <div className="font-medium text-xs sm:text-sm">Variable</div>
              <div className="font-medium text-center text-xs sm:text-sm">Low Case</div>
              <div className="font-medium text-center text-xs sm:text-sm">Base Case</div>
              <div className="font-medium text-center text-xs sm:text-sm">High Case</div>
              
              {Object.entries(dcfScenarios.low).map(([key, _]) => (
                <div key={key} className="contents">
                  <div className="text-xs sm:text-sm py-2">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</div>
                  {(['low', 'base', 'high'] as const).map(scenario => (
                    <Input
                      key={`${key}-${scenario}`}
                      type="number"
                      value={dcfScenarios[scenario][key as keyof typeof dcfScenarios.low]}
                      onChange={(e) => setDcfScenarios({
                        ...dcfScenarios,
                        [scenario]: { ...dcfScenarios[scenario], [key]: parseFloat(e.target.value) }
                      })}
                      className="text-center text-xs sm:text-sm"
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* DCF Results */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['low', 'base', 'high'] as const).map(scenario => {
              const result = calculateDCF(dcfScenarios[scenario], stockData);
              return (
                <Card key={scenario} className={scenario === 'base' ? 'border-primary' : ''}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-center text-sm sm:text-base">{scenario.toUpperCase()} CASE</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-2 pt-0">
                    <div className="text-lg sm:text-2xl font-bold text-primary">${result.intrinsicValue}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Intrinsic Value</div>
                    <div className="text-base sm:text-lg font-semibold">{result.cagr}%</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">5-Year CAGR</div>
                    <div className={`text-base sm:text-lg font-semibold ${result.upside > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {result.upside > 0 ? '+' : ''}{result.upside}%
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Upside/Downside</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DCFAnalysis;