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
    <Card className="border border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center">
          <Globe className="h-4 w-4 mr-2" />
          Key Indicators
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {indicators.map((indicator) => (
          <div
            key={indicator.label}
            className={`flex justify-between items-center p-2 rounded transition-colors ${
              indicator.chartKey ? 'cursor-pointer hover:bg-muted/30' : ''
            }`}
            onClick={() => handleClick(indicator.chartKey)}
          >
            <span className="text-sm text-muted-foreground">{indicator.label}</span>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{indicator.value}</Badge>
              {indicator.chartKey && <BarChart3 className="h-3 w-3 text-muted-foreground" />}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default MacroIndicators;