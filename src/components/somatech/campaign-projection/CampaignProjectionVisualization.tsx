import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { generateCampaignProjectionData } from "../utils";

interface CampaignProjectionVisualizationProps {
  targetAmount: string;
  timeframe: string;
  averageDonation: string;
  donationFrequency: number[];
  networkSize: string;
  participationRate: number[];
  projectionResult: any;
}

const CampaignProjectionVisualization = ({
  targetAmount,
  timeframe,
  averageDonation,
  donationFrequency,
  networkSize,
  participationRate,
  projectionResult
}: CampaignProjectionVisualizationProps) => {
  const chartData = generateCampaignProjectionData(
    targetAmount,
    timeframe,
    averageDonation,
    donationFrequency,
    networkSize,
    participationRate
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Campaign Funding Projection</CardTitle>
            <CardDescription>
              Projected funding progress over {timeframe} weeks to reach ${targetAmount}
            </CardDescription>
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
                  <XAxis dataKey="week" />
                  <YAxis tickFormatter={(value) => `$${(value / 1000)}k`} />
                  <Tooltip 
                    formatter={(value, name) => {
                      const labels: Record<string, string> = {
                        realistic: 'Realistic Projection',
                        optimistic: 'Optimistic Scenario',
                        pessimistic: 'Pessimistic Scenario',
                        target: 'Target Amount'
                      };
                      return [`$${Number(value).toLocaleString()}`, labels[name as string] || name];
                    }}
                    labelFormatter={(label) => `Week: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="pessimistic" 
                    stackId="1"
                    stroke="hsl(var(--destructive))" 
                    fill="hsl(var(--destructive))"
                    fillOpacity={0.3}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="realistic" 
                    stackId="2"
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))"
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="optimistic" 
                    stackId="3"
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))"
                    fillOpacity={0.8}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="hsl(var(--muted-foreground))" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
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
                    <th className="p-2 text-left">Week</th>
                    <th className="p-2 text-right">Realistic</th>
                    <th className="p-2 text-right">Optimistic</th>
                    <th className="p-2 text-right">Pessimistic</th>
                    <th className="p-2 text-right">Target</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((row, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{row.week}</td>
                      <td className="p-2 text-right">${row.realistic.toLocaleString()}</td>
                      <td className="p-2 text-right">${row.optimistic.toLocaleString()}</td>
                      <td className="p-2 text-right">${row.pessimistic.toLocaleString()}</td>
                      <td className="p-2 text-right">${row.target.toLocaleString()}</td>
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

export default CampaignProjectionVisualization;