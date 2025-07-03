import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { generateRetirementChartData } from "../utils";

interface RetirementVisualizationProps {
  currentAge: string;
  retirementAge: string;
  lifeExpectancy: string;
  currentSavings: string;
  monthlyContribution: string;
  expectedReturn: number[];
  retirementSpending: string;
  inflationRate: number[];
}

const RetirementVisualization = ({
  currentAge,
  retirementAge,
  lifeExpectancy,
  currentSavings,
  monthlyContribution,
  expectedReturn,
  retirementSpending,
  inflationRate
}: RetirementVisualizationProps) => {
  const chartData = generateRetirementChartData(
    currentAge,
    retirementAge,
    lifeExpectancy,
    currentSavings,
    monthlyContribution,
    expectedReturn,
    retirementSpending,
    inflationRate
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Retirement Savings Projection</CardTitle>
            <CardDescription>Accumulation + Decumulation from age {currentAge} to {lifeExpectancy}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chart" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chart">Chart View</TabsTrigger>
            <TabsTrigger value="table">Table View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" />
                  <YAxis tickFormatter={(value) => `$${(value / 1000)}k`} />
                  <Tooltip 
                    formatter={(value, name) => {
                      const labels: Record<string, string> = {
                        balance: 'Total Balance',
                        contributions: 'Total Contributions',
                        growth: 'Investment Growth'
                      };
                      return [`$${Number(value).toLocaleString()}`, labels[name as string] || name];
                    }}
                    labelFormatter={(label) => `Age: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="contributions" 
                    stackId="1"
                    stroke="hsl(var(--muted-foreground))" 
                    fill="hsl(var(--muted))"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="growth" 
                    stackId="1"
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))"
                    fillOpacity={0.8}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="balance" 
                    stroke="hsl(var(--foreground))" 
                    strokeWidth={2}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="table" className="space-y-4">
            <div className="max-h-80 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-2 text-left">Age</th>
                    <th className="p-2 text-right">Balance</th>
                    <th className="p-2 text-right">Contributions</th>
                    <th className="p-2 text-right">Growth</th>
                    <th className="p-2 text-center">Phase</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((row, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{row.age}</td>
                      <td className="p-2 text-right">${row.balance.toLocaleString()}</td>
                      <td className="p-2 text-right">${row.contributions.toLocaleString()}</td>
                      <td className="p-2 text-right">${row.growth.toLocaleString()}</td>
                      <td className="p-2 text-center">
                        <span className={`px-2 py-1 rounded text-xs ${
                          row.phase === 'accumulation' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {row.phase}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RetirementVisualization;