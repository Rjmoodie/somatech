import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, ComposedChart, Area, AreaChart } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { CashFlowReport } from "../types";

interface CashFlowChartProps {
  report: CashFlowReport;
  activeScenario: 'conservative' | 'base' | 'optimistic';
}

const CashFlowChart = ({ report, activeScenario }: CashFlowChartProps) => {
  const [chartType, setChartType] = useState<'cashBalance' | 'cashFlow' | 'comparison'>('cashBalance');
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const currentScenario = report.scenarios[activeScenario];
  
  // Prepare data for cash balance chart
  const cashBalanceData = currentScenario.monthlyProjections.map((month) => ({
    month: `M${month.month}`,
    cashBalance: month.cashBalance,
    netFlow: month.netFlow,
    inflows: month.inflows,
    outflows: month.outflows,
  }));

  // Prepare comparison data
  const comparisonData = report.scenarios.base.monthlyProjections.map((_, index) => ({
    month: `M${index + 1}`,
    conservative: report.scenarios.conservative.monthlyProjections[index]?.cashBalance || 0,
    base: report.scenarios.base.monthlyProjections[index]?.cashBalance || 0,
    optimistic: report.scenarios.optimistic.monthlyProjections[index]?.cashBalance || 0,
  }));

  const renderCashBalanceChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={cashBalanceData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={formatCurrency} />
        <Tooltip 
          formatter={(value: number, name: string) => [formatCurrency(value), name]}
          labelFormatter={(label) => `Month ${label.replace('M', '')}`}
        />
        <Area 
          type="monotone" 
          dataKey="cashBalance" 
          fill="hsl(var(--primary))" 
          fillOpacity={0.3}
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          name="Cash Balance"
        />
        <Line 
          type="monotone" 
          dataKey="netFlow" 
          stroke="hsl(var(--chart-2))" 
          strokeWidth={2}
          dot={false}
          name="Net Cash Flow"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );

  const renderCashFlowChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={cashBalanceData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={formatCurrency} />
        <Tooltip 
          formatter={(value: number, name: string) => [formatCurrency(value), name]}
          labelFormatter={(label) => `Month ${label.replace('M', '')}`}
        />
        <Legend />
        <Bar dataKey="inflows" fill="hsl(var(--chart-1))" name="Inflows" />
        <Bar dataKey="outflows" fill="hsl(var(--chart-3))" name="Outflows" />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderComparisonChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={comparisonData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={formatCurrency} />
        <Tooltip 
          formatter={(value: number, name: string) => [formatCurrency(value), name]}
          labelFormatter={(label) => `Month ${label.replace('M', '')}`}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="conservative" 
          stroke="hsl(var(--chart-3))" 
          strokeWidth={2}
          name="Conservative"
          strokeDasharray="5 5"
        />
        <Line 
          type="monotone" 
          dataKey="base" 
          stroke="hsl(var(--primary))" 
          strokeWidth={3}
          name="Base Case"
        />
        <Line 
          type="monotone" 
          dataKey="optimistic" 
          stroke="hsl(var(--chart-1))" 
          strokeWidth={2}
          name="Optimistic"
          strokeDasharray="5 5"
        />
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Cash Flow Visualization</CardTitle>
            <CardDescription>
              Interactive charts showing your cash flow projections
            </CardDescription>
          </div>
          <Select value={chartType} onValueChange={(value: any) => setChartType(value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cashBalance">Cash Balance Over Time</SelectItem>
              <SelectItem value="cashFlow">Monthly Cash Flow</SelectItem>
              <SelectItem value="comparison">Scenario Comparison</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {chartType === 'cashBalance' && renderCashBalanceChart()}
        {chartType === 'cashFlow' && renderCashFlowChart()}
        {chartType === 'comparison' && renderComparisonChart()}
        
        <div className="mt-4 text-sm text-muted-foreground">
          {chartType === 'cashBalance' && "Shows cash balance and net cash flow over time"}
          {chartType === 'cashFlow' && "Compares monthly inflows vs outflows"}
          {chartType === 'comparison' && "Compares cash balance across all scenarios"}
        </div>
      </CardContent>
    </Card>
  );
};

export default CashFlowChart;