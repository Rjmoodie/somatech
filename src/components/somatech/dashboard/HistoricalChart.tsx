import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface HistoricalChartProps {
  selectedChart: string;
  onClose: () => void;
}

const HistoricalChart = ({ selectedChart, onClose }: HistoricalChartProps) => {
  // Mock historical data
  const historicalData = {
    fedRate: [
      { month: 'Jan', value: 5.0 },
      { month: 'Feb', value: 5.1 },
      { month: 'Mar', value: 5.15 },
      { month: 'Apr', value: 5.2 },
      { month: 'May', value: 5.25 },
      { month: 'Jun', value: 5.25 }
    ],
    inflation: [
      { month: 'Jan', value: 3.4 },
      { month: 'Feb', value: 3.3 },
      { month: 'Mar', value: 3.2 },
      { month: 'Apr', value: 3.1 },
      { month: 'May', value: 3.2 },
      { month: 'Jun', value: 3.2 }
    ],
    unemployment: [
      { month: 'Jan', value: 4.0 },
      { month: 'Feb', value: 3.9 },
      { month: 'Mar', value: 3.8 },
      { month: 'Apr', value: 3.9 },
      { month: 'May', value: 3.8 },
      { month: 'Jun', value: 3.8 }
    ],
    gdpGrowth: [
      { month: 'Jan', value: 2.1 },
      { month: 'Feb', value: 2.3 },
      { month: 'Mar', value: 2.4 },
      { month: 'Apr', value: 2.2 },
      { month: 'May', value: 2.4 },
      { month: 'Jun', value: 2.4 }
    ]
  };

  const chartData = historicalData[selectedChart as keyof typeof historicalData];
  
  const getTitle = (chart: string) => {
    switch (chart) {
      case 'fedRate': return 'Federal Funds Rate - 6 Month Trend';
      case 'inflation': return 'Inflation Rate - 6 Month Trend';
      case 'unemployment': return 'Unemployment Rate - 6 Month Trend';
      case 'gdpGrowth': return 'GDP Growth Rate - 6 Month Trend';
      default: return 'Economic Indicator - 6 Month Trend';
    }
  };
  
  const title = getTitle(selectedChart);

  return (
    <Card className="border-2 border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <ChartContainer config={{ value: { label: "Value", color: "hsl(var(--primary))" } }} className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default HistoricalChart;