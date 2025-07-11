import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, BarChart3 } from "lucide-react";

interface HistoricalChartProps {
  selectedChart: string;
  onClose: () => void;
}

const HistoricalChart = ({ selectedChart, onClose }: HistoricalChartProps) => {
  return (
    <Card className="premium-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <span>Historical Data: {selectedChart.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="h-16 w-16 text-blue-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Historical chart for {selectedChart.replace(/-/g, ' ')} would be displayed here
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Connect to data provider for live charts
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoricalChart;