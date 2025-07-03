import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { RetirementResult } from "./types";
import { generateRetirementChartData } from "./utils";

const RetirementPlanning = () => {
  const [currentAge, setCurrentAge] = useState("");
  const [retirementAge, setRetirementAge] = useState("");
  const [lifeExpectancy, setLifeExpectancy] = useState("90");
  const [currentSavings, setCurrentSavings] = useState("");
  const [monthlyContribution, setMonthlyContribution] = useState("");
  const [expectedReturn, setExpectedReturn] = useState([7]);
  const [retirementSpending, setRetirementSpending] = useState("");
  const [inflationRate, setInflationRate] = useState([2.5]);
  const [otherIncome, setOtherIncome] = useState("");
  const [retirementResult, setRetirementResult] = useState<any>(null);

  const calculateRetirement = () => {
    if (!currentAge || !retirementAge || !currentSavings || !monthlyContribution || !retirementSpending) return;

    const age = parseInt(currentAge);
    const retAge = parseInt(retirementAge);
    const lifeExp = parseInt(lifeExpectancy);
    const savings = parseFloat(currentSavings);
    const contribution = parseFloat(monthlyContribution);
    const returnRate = expectedReturn[0] / 100;
    const annualSpending = parseFloat(retirementSpending);
    const inflation = inflationRate[0] / 100;
    const otherAnnualIncome = parseFloat(otherIncome) || 0;

    const yearsToRetirement = retAge - age;
    const yearsInRetirement = lifeExp - retAge;
    const monthsToRetirement = yearsToRetirement * 12;
    const monthlyReturn = returnRate / 12;

    // Future value at retirement
    const totalSavingsAtRetirement = savings * Math.pow(1 + returnRate, yearsToRetirement) +
      contribution * (Math.pow(1 + monthlyReturn, monthsToRetirement) - 1) / monthlyReturn;

    // Adjust spending for inflation
    const inflationAdjustedSpending = annualSpending * Math.pow(1 + inflation, yearsToRetirement);
    const netAnnualNeed = inflationAdjustedSpending - otherAnnualIncome;
    
    // Calculate how long funds will last
    let remainingFunds = totalSavingsAtRetirement;
    let yearsLasted = 0;
    for (let year = 0; year < yearsInRetirement; year++) {
      const yearlySpendingNeed = netAnnualNeed * Math.pow(1 + inflation, year);
      if (remainingFunds >= yearlySpendingNeed) {
        remainingFunds = remainingFunds * (1 + returnRate) - yearlySpendingNeed;
        yearsLasted++;
      } else {
        break;
      }
    }

    // Calculate total needed at retirement for full coverage
    const totalNeeded = netAnnualNeed * yearsInRetirement * 1.05; // 5% buffer
    const surplusOrShortfall = totalSavingsAtRetirement - totalNeeded;
    
    // Required return rate to meet goal
    const requiredReturn = surplusOrShortfall < 0 ? 
      Math.pow((totalNeeded - savings) / (contribution * 12 * yearsToRetirement), 1/yearsToRetirement) - 1 : 
      returnRate;

    setRetirementResult({
      totalSavingsAtRetirement: Math.round(totalSavingsAtRetirement),
      yearsToRetirement,
      yearsInRetirement,
      inflationAdjustedSpending: Math.round(inflationAdjustedSpending),
      annualIncomeGap: Math.round(Math.max(0, netAnnualNeed)),
      surplusOrShortfall: Math.round(surplusOrShortfall),
      requiredReturnToMeetGoal: Math.round(requiredReturn * 100 * 100) / 100,
      yearsWillLast: yearsLasted,
      onTrack: surplusOrShortfall >= 0
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
            
            <div className="grid grid-cols-2 gap-3">
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
                <Label>Life Expectancy</Label>
                <Input
                  type="number"
                  placeholder="90"
                  value={lifeExpectancy}
                  onChange={(e) => setLifeExpectancy(e.target.value)}
                />
              </div>
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
              <Label>Annual Contributions ($)</Label>
              <Input
                type="number"
                placeholder="12000"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Expected Retirement Spending (Annual $)</Label>
              <Input
                type="number"
                placeholder="60000"
                value={retirementSpending}
                onChange={(e) => setRetirementSpending(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Other Income Sources (Annual $)</Label>
              <Input
                type="number"
                placeholder="20000"
                value={otherIncome}
                onChange={(e) => setOtherIncome(e.target.value)}
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
            
            <div className="space-y-2">
              <Label>Inflation Rate: {inflationRate[0]}%</Label>
              <Slider
                value={inflationRate}
                onValueChange={setInflationRate}
                max={5}
                min={1}
                step={0.25}
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
              <CardTitle>Retirement Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    ${retirementResult.totalSavingsAtRetirement.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Savings at Retirement</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span>Years to retirement:</span>
                    <span className="font-semibold">{retirementResult.yearsToRetirement}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Years in retirement:</span>
                    <span className="font-semibold">{retirementResult.yearsInRetirement}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Annual income gap:</span>
                    <span className="font-semibold">${retirementResult.annualIncomeGap.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Funds will last:</span>
                    <span className="font-semibold">{retirementResult.yearsWillLast} years</span>
                  </div>
                </div>
                
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Surplus/Shortfall:</span>
                    <span className={`font-bold ${retirementResult.surplusOrShortfall >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${Math.abs(retirementResult.surplusOrShortfall).toLocaleString()} 
                      {retirementResult.surplusOrShortfall >= 0 ? ' surplus' : ' shortfall'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Required return to meet goal:</span>
                    <span className="font-semibold">{retirementResult.requiredReturnToMeetGoal}%</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                  <span className="font-medium">On track:</span>
                  <span className={`font-bold ${retirementResult.onTrack ? 'text-green-600' : 'text-red-600'}`}>
                    {retirementResult.onTrack ? 'Yes' : 'No'}
                  </span>
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
                    <AreaChart data={generateRetirementChartData(
                      currentAge, 
                      retirementAge, 
                      lifeExpectancy, 
                      currentSavings, 
                      monthlyContribution, 
                      expectedReturn, 
                      retirementSpending, 
                      inflationRate
                    )}>
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
                      {generateRetirementChartData(
                        currentAge, 
                        retirementAge, 
                        lifeExpectancy, 
                        currentSavings, 
                        monthlyContribution, 
                        expectedReturn, 
                        retirementSpending, 
                        inflationRate
                      ).map((row, index) => (
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
      )}
    </div>
  );
};

export default RetirementPlanning;