import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { useState } from "react";
import { BusinessValuationReport } from "../types";

interface BusinessValuationChartProps {
  report: BusinessValuationReport;
}

const BusinessValuationChart = ({ report }: BusinessValuationChartProps) => {
  const [chartType, setChartType] = useState<'bar' | 'line' | 'table'>('bar');

  const scenarioData = [
    {
      name: 'Conservative',
      value: report.scenarios.conservative.totalValue,
      revenue: report.scenarios.conservative.revenueMultiple || 0,
      ebitda: report.scenarios.conservative.ebitdaMultiple || 0,
      dcf: report.scenarios.conservative.dcfValue || 0
    },
    {
      name: 'Base Case',
      value: report.scenarios.base.totalValue,
      revenue: report.scenarios.base.revenueMultiple || 0,
      ebitda: report.scenarios.base.ebitdaMultiple || 0,
      dcf: report.scenarios.base.dcfValue || 0
    },
    {
      name: 'Optimistic',
      value: report.scenarios.optimistic.totalValue,
      revenue: report.scenarios.optimistic.revenueMultiple || 0,
      ebitda: report.scenarios.optimistic.ebitdaMultiple || 0,
      dcf: report.scenarios.optimistic.dcfValue || 0
    }
  ];

  const formatCurrency = (value: number) => `$${(value / 1000000).toFixed(1)}M`;
  const formatTooltip = (value: number) => [`$${value.toLocaleString()}`, ''];

  const renderChart = () => {
    if (chartType === 'table') {
      return (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Scenario</th>
                <th className="text-right py-2">Total Value</th>
                <th className="text-right py-2">Revenue Multiple</th>
                <th className="text-right py-2">EBITDA Multiple</th>
                <th className="text-right py-2">DCF Value</th>
              </tr>
            </thead>
            <tbody>
              {scenarioData.map((scenario, index) => (
                <tr key={scenario.name} className={index % 2 === 0 ? 'bg-muted/50' : ''}>
                  <td className="py-2 font-medium">{scenario.name}</td>
                  <td className="text-right py-2 font-semibold">${scenario.value.toLocaleString()}</td>
                  <td className="text-right py-2">{scenario.revenue ? `$${scenario.revenue.toLocaleString()}` : 'N/A'}</td>
                  <td className="text-right py-2">{scenario.ebitda ? `$${scenario.ebitda.toLocaleString()}` : 'N/A'}</td>
                  <td className="text-right py-2">{scenario.dcf ? `$${scenario.dcf.toLocaleString()}` : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (chartType === 'line') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={report.projections}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={formatTooltip} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              name="Business Value"
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="hsl(var(--secondary))" 
              strokeWidth={2}
              name="Revenue"
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={scenarioData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={formatCurrency} />
          <Tooltip formatter={formatTooltip} />
          <Legend />
          <Bar dataKey="value" fill="hsl(var(--primary))" name="Total Valuation" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg sm:text-xl">Valuation Visualization</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              {chartType === 'table' 
                ? 'Detailed valuation breakdown by scenario' 
                : chartType === 'line'
                ? 'Projected business value over time'
                : 'Valuation scenarios comparison'
              }
            </CardDescription>
          </div>
          <div className="flex space-x-1 sm:space-x-2">
            <Button
              variant={chartType === 'bar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('bar')}
              className="px-2 sm:px-3"
            >
              <span className="hidden sm:inline">Bar Chart</span>
              <span className="sm:hidden">Bar</span>
            </Button>
            <Button
              variant={chartType === 'line' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('line')}
              className="px-2 sm:px-3"
            >
              <span className="hidden sm:inline">Line Chart</span>
              <span className="sm:hidden">Line</span>
            </Button>
            <Button
              variant={chartType === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('table')}
              className="px-2 sm:px-3"
            >
              <span className="hidden sm:inline">Table</span>
              <span className="sm:hidden">Tbl</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
};

export default BusinessValuationChart;