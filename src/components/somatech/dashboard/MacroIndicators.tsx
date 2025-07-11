import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, BarChart3 } from "lucide-react";

interface MacroIndicatorsProps {
  onChartSelect: (chart: string) => void;
  selectedChart: string | null;
}

const MacroIndicators = ({ onChartSelect, selectedChart }: MacroIndicatorsProps) => {
  const indicators = [
    { label: "Fed Rate", value: "5.25%", chartKey: "fedRate" },
    { label: "Inflation", value: "3.2%", chartKey: "inflation" },
    { label: "Unemployment", value: "3.8%", chartKey: "unemployment" },
    { label: "GDP Growth", value: "2.4%", chartKey: "gdpGrowth" }
  ];

  const handleClick = (chartKey: string | null) => {
    if (chartKey) {
      onChartSelect(selectedChart === chartKey ? "" : chartKey);
    }
  };

  return (
    <div className="h-full">
      <div className="pb-4 border-b border-border/50">
        <h3 className="text-display text-lg font-semibold flex items-center">
          <Globe className="h-5 w-5 mr-3 text-primary" />
          Key Indicators
        </h3>
      </div>
      <div className="space-y-4 pt-4">
        {indicators.map((indicator) => (
          <div
            key={indicator.label}
            className={`group flex justify-between items-center p-3 rounded-lg transition-all duration-200 ${
              indicator.chartKey 
                ? "cursor-pointer hover:bg-muted/50 hover:scale-[1.02] active:scale-[0.98]" 
                : "opacity-75"
            } ${
              selectedChart === indicator.chartKey 
                ? "bg-primary/10 border border-primary/20 shadow-sm" 
                : ""
            }`}
            onClick={() => handleClick(indicator.chartKey)}
          >
            <span className="text-sm font-medium text-foreground/80">{indicator.label}</span>
            <div className="flex items-center space-x-3">
              <span className="text-mono-elegant text-sm font-semibold px-3 py-1 bg-muted/50 rounded-md">
                {indicator.value}
              </span>
              {indicator.chartKey && (
                <BarChart3 className={`h-4 w-4 transition-all duration-200 ${
                  selectedChart === indicator.chartKey 
                    ? "text-primary scale-110" 
                    : "text-muted-foreground group-hover:text-primary group-hover:scale-105"
                }`} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MacroIndicators;