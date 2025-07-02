import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertTriangle, TrendingUp, BarChart3 } from "lucide-react";

interface PillarData {
  name: string;
  value: string;
  score: number;
  status: "pass" | "neutral" | "fail";
  industryAvg: string;
  trend: "up" | "down" | "stable";
  chartData: Array<{ period: string; value: number }>;
}

interface EnhancedPillarScorecardProps {
  ticker: string;
}

const EnhancedPillarScorecard = ({ ticker }: EnhancedPillarScorecardProps) => {
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null);

  // Mock data - in real implementation, this would be fetched based on ticker
  const pillarsData: Record<string, PillarData> = {
    revenueGrowth: {
      name: "Revenue Growth",
      value: "15.2%",
      score: 85,
      status: "pass",
      industryAvg: "8.5%",
      trend: "up",
      chartData: [
        { period: "2019", value: 8.2 },
        { period: "2020", value: 12.1 },
        { period: "2021", value: 18.5 },
        { period: "2022", value: 15.8 },
        { period: "2023", value: 15.2 }
      ]
    },
    earningsGrowth: {
      name: "Earnings Growth",
      value: "12.8%",
      score: 78,
      status: "pass",
      industryAvg: "10.2%",
      trend: "up",
      chartData: [
        { period: "2019", value: 5.1 },
        { period: "2020", value: 8.9 },
        { period: "2021", value: 16.2 },
        { period: "2022", value: 14.1 },
        { period: "2023", value: 12.8 }
      ]
    },
    roic: {
      name: "Return on Invested Capital",
      value: "26.8%",
      score: 92,
      status: "pass",
      industryAvg: "15.4%",
      trend: "stable",
      chartData: [
        { period: "2019", value: 24.2 },
        { period: "2020", value: 22.8 },
        { period: "2021", value: 28.1 },
        { period: "2022", value: 27.2 },
        { period: "2023", value: 26.8 }
      ]
    },
    freeCashFlow: {
      name: "Free Cash Flow",
      value: "$12.4B",
      score: 88,
      status: "pass",
      industryAvg: "$8.2B",
      trend: "up",
      chartData: [
        { period: "2019", value: 8.1 },
        { period: "2020", value: 9.2 },
        { period: "2021", value: 11.8 },
        { period: "2022", value: 12.1 },
        { period: "2023", value: 12.4 }
      ]
    },
    operatingMargin: {
      name: "Operating Margin Stability",
      value: "28.1%",
      score: 85,
      status: "pass",
      industryAvg: "22.5%",
      trend: "stable",
      chartData: [
        { period: "2019", value: 26.8 },
        { period: "2020", value: 25.2 },
        { period: "2021", value: 29.4 },
        { period: "2022", value: 28.8 },
        { period: "2023", value: 28.1 }
      ]
    },
    debtHealth: {
      name: "Debt Health",
      value: "1.73x",
      score: 65,
      status: "neutral",
      industryAvg: "1.45x",
      trend: "down",
      chartData: [
        { period: "2019", value: 1.2 },
        { period: "2020", value: 1.4 },
        { period: "2021", value: 1.6 },
        { period: "2022", value: 1.7 },
        { period: "2023", value: 1.73 }
      ]
    },
    shareCount: {
      name: "Share Count Trend",
      value: "-2.1%",
      score: 90,
      status: "pass",
      industryAvg: "+1.2%",
      trend: "up",
      chartData: [
        { period: "2019", value: -0.5 },
        { period: "2020", value: -1.2 },
        { period: "2021", value: -1.8 },
        { period: "2022", value: -2.0 },
        { period: "2023", value: -2.1 }
      ]
    },
    insiderOwnership: {
      name: "Insider Ownership",
      value: "8.4%",
      score: 95,
      status: "pass",
      industryAvg: "4.2%",
      trend: "stable",
      chartData: [
        { period: "2019", value: 7.8 },
        { period: "2020", value: 8.1 },
        { period: "2021", value: 8.2 },
        { period: "2022", value: 8.3 },
        { period: "2023", value: 8.4 }
      ]
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return CheckCircle;
      case 'neutral': return AlertTriangle;
      case 'fail': return XCircle;
      default: return AlertTriangle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'text-green-600';
      case 'neutral': return 'text-yellow-600';
      case 'fail': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      case 'stable': return <BarChart3 className="h-4 w-4 text-blue-600" />;
      default: return <BarChart3 className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{ticker} 8-Pillar Business Strength Scorecard</CardTitle>
        <CardDescription>
          Comprehensive evaluation of {ticker}'s long-term business quality indicators with industry benchmarks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(pillarsData).map(([key, pillar]) => {
            const Icon = getStatusIcon(pillar.status);
            const isSelected = selectedPillar === key;
            
            return (
              <div key={key} className="space-y-3">
                <div 
                  className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                    isSelected ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedPillar(isSelected ? null : key)}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <Icon className={`h-5 w-5 ${getStatusColor(pillar.status)}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{pillar.name}</div>
                        {getTrendIcon(pillar.trend)}
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-muted-foreground">
                          {ticker}: <span className="font-medium text-foreground">{pillar.value}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Industry Avg: <span className="font-medium text-foreground">{pillar.industryAvg}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Progress value={pillar.score} className="w-24" />
                    <span className="text-sm font-medium w-12 text-right">{pillar.score}/100</span>
                  </div>
                </div>

                {/* Expanded Chart View */}
                {isSelected && (
                  <div className="ml-4 p-4 bg-muted/30 rounded-lg border-l-4 border-primary">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{pillar.name} - 5 Year Trend</h4>
                      <Button variant="outline" size="sm" onClick={() => setSelectedPillar(null)}>
                        Close
                      </Button>
                    </div>
                    <div className="grid grid-cols-5 gap-2 mb-4">
                      {pillar.chartData.map((dataPoint, index) => (
                        <div key={dataPoint.period} className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">{dataPoint.period}</div>
                          <div className="h-20 bg-muted rounded flex items-end justify-center relative">
                            <div 
                              className={`w-full rounded-t ${
                                pillar.status === 'pass' ? 'bg-green-500' : 
                                pillar.status === 'neutral' ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ 
                                height: `${Math.max((dataPoint.value / Math.max(...pillar.chartData.map(d => d.value))) * 100, 10)}%` 
                              }}
                            />
                            <div className="absolute -top-6 text-xs font-medium">
                              {typeof dataPoint.value === 'number' ? 
                                (dataPoint.value > 10 ? `${dataPoint.value.toFixed(1)}` : `${dataPoint.value.toFixed(1)}%`) : 
                                dataPoint.value
                              }
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <strong>Analysis:</strong> {pillar.name} shows a {pillar.trend === 'up' ? 'positive' : pillar.trend === 'down' ? 'declining' : 'stable'} trend 
                      over the past 5 years, currently {pillar.status === 'pass' ? 'outperforming' : pillar.status === 'neutral' ? 'meeting' : 'underperforming'} industry benchmarks.
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedPillarScorecard;