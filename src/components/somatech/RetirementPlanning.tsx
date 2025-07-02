import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { RetirementResult } from "./types";
import { generateRetirementChartData } from "./utils";

const RetirementPlanning = () => {
  const [currentAge, setCurrentAge] = useState("");
  const [retirementAge, setRetirementAge] = useState("");
  const [currentSavings, setCurrentSavings] = useState("");
  const [monthlyContribution, setMonthlyContribution] = useState("");
  const [expectedReturn, setExpectedReturn] = useState([7]);
  const [retirementResult, setRetirementResult] = useState<RetirementResult | null>(null);

  const calculateRetirement = () => {
    if (!currentAge || !retirementAge || !currentSavings || !monthlyContribution) return;

    const age = parseInt(currentAge);
    const retAge = parseInt(retirementAge);
    const savings = parseFloat(currentSavings);
    const contribution = parseFloat(monthlyContribution);
    const returnRate = expectedReturn[0] / 100;

    const yearsToRetirement = retAge - age;
    const monthsToRetirement = yearsToRetirement * 12;
    const monthlyReturn = returnRate / 12;

    // Future value calculation
    const futureValue = savings * Math.pow(1 + returnRate, yearsToRetirement) +
      contribution * (Math.pow(1 + monthlyReturn, monthsToRetirement) - 1) / monthlyReturn;

    const recommended = contribution * 12 * yearsToRetirement * 1.5;

    setRetirementResult({
      futureValue: Math.round(futureValue),
      yearsToRetirement,
      recommendedSavings: Math.round(recommended),
      onTrack: futureValue >= recommended
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Retirement Planning</CardTitle>
            <CardDescription>Plan your financial future</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Current Age</Label>
              <Input
                type="number"
                placeholder="30"
                value={currentAge}
                onChange={(e) => setCurrentAge(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Target Retirement Age</Label>
              <Input
                type="number"
                placeholder="65"
                value={retirementAge}
                onChange={(e) => setRetirementAge(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Current Savings ($)</Label>
              <Input
                type="number"
                placeholder="50000"
                value={currentSavings}
                onChange={(e) => setCurrentSavings(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Monthly Contribution ($)</Label>
              <Input
                type="number"
                placeholder="1000"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Expected Annual Return: {expectedReturn[0]}%</Label>
              <Slider
                value={expectedReturn}
                onValueChange={setExpectedReturn}
                max={15}
                min={3}
                step={0.5}
                className="w-full"
              />
            </div>
            
            <Button onClick={calculateRetirement} className="w-full">
              Calculate Retirement
            </Button>
          </CardContent>
        </Card>

        {retirementResult && (
          <Card>
            <CardHeader>
              <CardTitle>Retirement Projection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    ${retirementResult.futureValue.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">Projected retirement savings</p>
                </div>
                
                <div className="flex justify-between">
                  <span>Years to retirement:</span>
                  <span className="font-semibold">{retirementResult.yearsToRetirement}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>On track:</span>
                  <span className={`font-semibold ${retirementResult.onTrack ? 'text-green-600' : 'text-red-600'}`}>
                    {retirementResult.onTrack ? 'Yes' : 'No'}
                  </span>
                </div>
                
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    This calculation assumes consistent contributions and returns. 
                    Consider consulting a financial advisor for personalized advice.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Retirement Growth Chart */}
      {retirementResult && (
        <Card>
          <CardHeader>
            <CardTitle>Retirement Savings Projection</CardTitle>
            <CardDescription>Growth timeline from age {currentAge} to {retirementAge}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={generateRetirementChartData(currentAge, retirementAge, currentSavings, monthlyContribution, expectedReturn)}>
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
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RetirementPlanning;