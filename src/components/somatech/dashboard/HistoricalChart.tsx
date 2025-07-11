import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, BarChart3 } from "lucide-react";

interface HistoricalChartProps {
  selectedChart: string;
  onClose: () => void;
}

const HistoricalChart = ({ selectedChart, onClose }: HistoricalChartProps) => {
  // Mock historical data for demonstration
  const mockData = [
    { date: '2023-01', value: 2.1 },
    { date: '2023-02', value: 2.3 },
    { date: '2023-03', value: 2.5 },
    { date: '2023-04', value: 2.2 },
    { date: '2023-05', value: 2.4 },
    { date: '2023-06', value: 2.6 },
  ];

  return (
    <Card className="premium-card w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle className="flex items-center space-x-2 text-sm sm:text-base">
            <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
            <span className="truncate">Historical Data: {selectedChart.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="self-end sm:self-auto">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <div className="h-48 sm:h-64 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg flex items-center justify-center overflow-hidden">
          <div className="text-center px-4">
            <BarChart3 className="h-12 w-12 sm:h-16 sm:w-16 text-blue-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              Historical chart for {selectedChart.replace(/-/g, ' ')} 
            </p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 mt-2">
              Showing mock data - connect to provider for live charts
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
              {mockData.slice(0, 3).map((item, index) => (
                <div key={index} className="bg-white/50 dark:bg-gray-800/50 p-2 rounded">
                  <div className="font-semibold">{item.date}</div>
                  <div className="text-blue-600">{item.value}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoricalChart;