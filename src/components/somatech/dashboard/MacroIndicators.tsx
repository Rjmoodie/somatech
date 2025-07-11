import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

interface MacroIndicatorsProps {
  onChartSelect: (chart: string) => void;
  selectedChart: string;
}

const MacroIndicators = ({ onChartSelect, selectedChart }: MacroIndicatorsProps) => {
  const indicators = [
    { name: "GDP Growth", value: "2.4%", change: 0.3, trend: "up" },
    { name: "Inflation", value: "3.1%", change: -0.2, trend: "down" },
    { name: "Unemployment", value: "3.8%", change: -0.1, trend: "down" },
    { name: "10Y Treasury", value: "4.25%", change: 0.05, trend: "up" }
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-blue-600" />
          <span>Macro Indicators</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {indicators.map((indicator, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => onChartSelect(`macro-${indicator.name.toLowerCase().replace(/\s+/g, '-')}`)}
          >
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{indicator.name}</p>
              <p className="text-lg font-bold text-gray-700 dark:text-gray-300">{indicator.value}</p>
            </div>
            <div className="flex items-center space-x-1">
              {indicator.trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ${
                indicator.change > 0 ? "text-green-600" : "text-red-600"
              }`}>
                {indicator.change > 0 ? "+" : ""}{indicator.change}%
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default MacroIndicators;