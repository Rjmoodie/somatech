import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Calculator, TrendingUp, BarChart3, Target, Users, FileText, Activity, Home, Search, DollarSign, PieChart, Clock, Brain, Download, Save, CheckCircle, XCircle, AlertTriangle, Zap, Shield, TrendingDown, Building2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import TradingViewWidget from "react-tradingview-widget";

const SomaTech = () => {
  const [activeModule, setActiveModule] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [globalTicker, setGlobalTicker] = useState("AAPL");

  // Business Valuation State
  const [revenue, setRevenue] = useState("");
  const [growthRate, setGrowthRate] = useState("");
  const [profitMargin, setProfitMargin] = useState("");
  const [industry, setIndustry] = useState("");
  const [valuation, setValuation] = useState<any>(null);

  // Cash Flow State
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [monthlyExpenses, setMonthlyExpenses] = useState("");
  const [currentCash, setCurrentCash] = useState("");
  const [cashFlowResult, setCashFlowResult] = useState<any>(null);

  // Retirement Planning State
  const [currentAge, setCurrentAge] = useState("");
  const [retirementAge, setRetirementAge] = useState("");
  const [currentSavings, setCurrentSavings] = useState("");
  const [monthlyContribution, setMonthlyContribution] = useState("");
  const [expectedReturn, setExpectedReturn] = useState([7]);
  const [retirementResult, setRetirementResult] = useState<any>(null);

  // Real Estate State
  const [propertyPrice, setPropertytyPrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [operatingExpenses, setOperatingExpenses] = useState("");
  const [realEstateResult, setRealEstateResult] = useState<any>(null);

  // Performance Tracker State
  const [energy, setEnergy] = useState([7]);
  const [stress, setStress] = useState([3]);
  const [focus, setFocus] = useState([8]);
  const [sleep, setSleep] = useState([7]);

  // Stock Analysis State
  const [stockData, setStockData] = useState<any>(null);
  const [dcfScenarios, setDcfScenarios] = useState({
    low: { revenueGrowth: 5, netMargin: 8, fcfGrowth: 3, exitMultiple: 15, discountRate: 12 },
    base: { revenueGrowth: 12, netMargin: 15, fcfGrowth: 8, exitMultiple: 20, discountRate: 10 },
    high: { revenueGrowth: 20, netMargin: 22, fcfGrowth: 15, exitMultiple: 25, discountRate: 8 }
  });
  const [investmentThesis, setInvestmentThesis] = useState({
    moat: "",
    risks: "",
    opportunities: ""
  });

  const modules = [
    { id: "dashboard", name: "Dashboard", icon: Home },
    { id: "stock-analysis", name: "Stock Analysis", icon: TrendingUp },
    { id: "business-valuation", name: "Business Valuation", icon: Calculator },
    { id: "cash-flow", name: "Cash Flow Simulator", icon: BarChart3 },
    { id: "financial-ratios", name: "Financial Ratios", icon: Target },
    { id: "investor-readiness", name: "Investor Readiness", icon: Users },
    { id: "retirement-planning", name: "Retirement Planning", icon: FileText },
    { id: "real-estate", name: "Real Estate Calculator", icon: DollarSign },
    { id: "performance-tracker", name: "Performance Tracker", icon: Activity },
    { id: "time-analyzer", name: "Time Allocation", icon: Clock },
    { id: "founder-wellness", name: "Founder Wellness", icon: Brain },
  ];

  const calculateValuation = () => {
    if (!revenue || !growthRate || !profitMargin) return;

    const annualRevenue = parseFloat(revenue);
    const growth = parseFloat(growthRate) / 100;
    const margin = parseFloat(profitMargin) / 100;
    
    const multipliers: Record<string, number> = {
      "technology": 8,
      "healthcare": 6,
      "finance": 4,
      "retail": 3,
      "manufacturing": 2.5,
      "other": 3
    };

    const multiplier = multipliers[industry] || 3;
    const adjustedMultiplier = multiplier * (1 + growth);
    const netIncome = annualRevenue * margin;
    
    const revenueMultiple = annualRevenue * adjustedMultiplier;
    const earningsMultiple = netIncome * (multiplier * 15);
    const dcfValue = netIncome * (1 + growth) * 10;

    setValuation({
      revenueMultiple: Math.round(revenueMultiple),
      earningsMultiple: Math.round(earningsMultiple),
      dcfValue: Math.round(dcfValue),
      averageValue: Math.round((revenueMultiple + earningsMultiple + dcfValue) / 3)
    });
  };

  const calculateCashFlow = () => {
    if (!monthlyIncome || !monthlyExpenses || !currentCash) return;

    const income = parseFloat(monthlyIncome);
    const expenses = parseFloat(monthlyExpenses);
    const cash = parseFloat(currentCash);
    const netCashFlow = income - expenses;
    const runway = netCashFlow <= 0 ? Math.floor(cash / Math.abs(netCashFlow)) : 0;

    const projections = [];
    let runningCash = cash;
    for (let i = 1; i <= 12; i++) {
      runningCash += netCashFlow;
      projections.push({
        month: i,
        cash: Math.round(runningCash),
        status: runningCash > 0 ? 'positive' : 'negative'
      });
    }

    setCashFlowResult({
      netCashFlow: Math.round(netCashFlow),
      runway,
      projections
    });
  };

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

  const calculateRealEstate = () => {
    if (!propertyPrice || !downPayment || !monthlyRent || !operatingExpenses) return;

    const price = parseFloat(propertyPrice);
    const down = parseFloat(downPayment);
    const rent = parseFloat(monthlyRent);
    const expenses = parseFloat(operatingExpenses);

    const loanAmount = price - down;
    const monthlyPayment = loanAmount * 0.005; // Simplified mortgage calculation
    const netCashFlow = rent - monthlyPayment - expenses;
    const cashOnCashReturn = (netCashFlow * 12) / down * 100;
    const capRate = ((rent * 12) - (expenses * 12)) / price * 100;

    setRealEstateResult({
      monthlyPayment: Math.round(monthlyPayment),
      netCashFlow: Math.round(netCashFlow),
      cashOnCashReturn: Math.round(cashOnCashReturn * 100) / 100,
      capRate: Math.round(capRate * 100) / 100,
      profitable: netCashFlow > 0
    });
  };

  const generateStockChartData = () => {
    const data = [];
    let price = 150;
    for (let i = 0; i < 30; i++) {
      const change = (Math.random() - 0.5) * 10;
      price = Math.max(price + change, 50);
      data.push({
        date: `Day ${i + 1}`,
        price: Math.round(price * 100) / 100,
        volume: Math.floor(Math.random() * 1000000) + 500000
      });
    }
    return data;
  };

  const generateRetirementChartData = () => {
    if (!currentAge || !retirementAge || !currentSavings || !monthlyContribution) return [];
    
    const age = parseInt(currentAge);
    const retAge = parseInt(retirementAge);
    const savings = parseFloat(currentSavings);
    const contribution = parseFloat(monthlyContribution);
    const returnRate = expectedReturn[0] / 100;
    
    const data = [];
    let currentBalance = savings;
    
    for (let year = age; year <= retAge; year++) {
      data.push({
        age: year,
        balance: Math.round(currentBalance),
        contributions: Math.round(contribution * 12 * (year - age + 1)),
        growth: Math.round(currentBalance - savings - (contribution * 12 * (year - age)))
      });
      currentBalance = currentBalance * (1 + returnRate) + (contribution * 12);
    }
    
    return data;
  };

  const analyzeStock = () => {
    // Mock advanced stock analysis data
    const mockData = {
      symbol: globalTicker,
      price: 175.43,
      pe: 25.4,
      pbv: 4.2,
      roe: 26.8,
      debtToEquity: 1.73,
      currentRatio: 1.05,
      score: 85,
      intrinsicValue: 165,
      recommendation: "BUY",
      chartData: generateStockChartData(),
      pillars: {
        revenueGrowth: { score: 85, status: "good", value: "15.2%" },
        epsGrowth: { score: 78, status: "good", value: "12.8%" },
        returnOnCapital: { score: 92, status: "excellent", value: "26.8%" },
        debtLevels: { score: 65, status: "moderate", value: "1.73x" },
        freeCashFlow: { score: 88, status: "good", value: "$12.4B" },
        valuation: { score: 72, status: "moderate", value: "25.4x P/E" },
        shareDilution: { score: 90, status: "excellent", value: "-2.1%" },
        insiderOwnership: { score: 95, status: "excellent", value: "8.4%" }
      },
      technicals: {
        trend: "bullish",
        ma50: 168.50,
        ma200: 155.20,
        rsi: 62,
        macd: "positive"
      },
      ratios: {
        quickRatio: 0.98,
        assetTurnover: 1.1,
        grossMargin: 42.5,
        operatingMargin: 28.1
      }
    };
    setStockData(mockData);
  };

  const calculateDCF = (scenario: 'low' | 'base' | 'high') => {
    const params = dcfScenarios[scenario];
    const currentPrice = stockData?.price || 175;
    const revenue = 380000; // Mock current revenue in millions
    
    const projectedRevenue = revenue * Math.pow(1 + params.revenueGrowth / 100, 5);
    const projectedEarnings = projectedRevenue * (params.netMargin / 100);
    const terminalValue = projectedEarnings * params.exitMultiple;
    const discountFactor = Math.pow(1 + params.discountRate / 100, 5);
    const intrinsicValue = terminalValue / discountFactor;
    const sharePrice = intrinsicValue / 16000; // Mock shares outstanding in millions
    
    return {
      intrinsicValue: Math.round(sharePrice),
      cagr: Math.round(((sharePrice / currentPrice) ** (1/5) - 1) * 100 * 100) / 100,
      upside: Math.round(((sharePrice - currentPrice) / currentPrice) * 100)
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'moderate': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return CheckCircle;
      case 'good': return CheckCircle;
      case 'moderate': return AlertTriangle;
      case 'poor': return XCircle;
      default: return AlertTriangle;
    }
  };

  const calculateSomaticScore = () => {
    const score = (energy[0] + (10 - stress[0]) + focus[0] + sleep[0]) / 4;
    return Math.round(score * 10);
  };

  const renderStockAnalysis = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Stock Ticker Input</CardTitle>
          <CardDescription>Enter any public stock symbol for analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <Input
              placeholder="AAPL"
              value={globalTicker}
              onChange={(e) => setGlobalTicker(e.target.value.toUpperCase())}
              className="flex-1"
            />
            <Button onClick={analyzeStock}>
              <Search className="h-4 w-4 mr-2" />
              Analyze
            </Button>
          </div>
        </CardContent>
      </Card>

      {stockData && (
        <div className="space-y-6">
          {/* TradingView Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Live Chart - {stockData.symbol}</CardTitle>
              <CardDescription>Professional TradingView chart with real-time data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <TradingViewWidget
                  symbol={globalTicker}
                  theme="Light"
                  autosize
                  hide_side_toolbar={false}
                  studies={["RSI", "MACD"]}
                  interval="D"
                  toolbar_bg="#f1f3f6"
                  enable_publishing={false}
                  allow_symbol_change={true}
                  save_image={false}
                  hide_volume={false}
                />
              </div>
            </CardContent>
          </Card>

          {/* Technical Analysis Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Technical & Momentum Snapshot</CardTitle>
              <CardDescription>Key technical indicators and trend analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium mb-2 ${
                    stockData.technicals.trend === 'bullish' ? 'bg-green-100 text-green-800' : 
                    stockData.technicals.trend === 'bearish' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {stockData.technicals.trend.toUpperCase()}
                  </div>
                  <p className="text-xs text-muted-foreground">Overall Trend</p>
                </div>
                <div className="text-center">
                  <div className="font-semibold">${stockData.technicals.ma50}</div>
                  <p className="text-xs text-muted-foreground">50-Day MA</p>
                </div>
                <div className="text-center">
                  <div className="font-semibold">${stockData.technicals.ma200}</div>
                  <p className="text-xs text-muted-foreground">200-Day MA</p>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{stockData.technicals.rsi}</div>
                  <p className="text-xs text-muted-foreground">RSI</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Financial Ratios with Color Coding */}
          <Card>
            <CardHeader>
              <CardTitle>Enhanced Financial Ratios</CardTitle>
              <CardDescription>Color-coded analysis with industry benchmarks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(stockData.ratios).map(([key, value]) => (
                  <div key={key} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                      <div className={`w-3 h-3 rounded-full ${
                        typeof value === 'number' && value > 1 ? 'bg-green-500' : 
                        typeof value === 'number' && value > 0.5 ? 'bg-yellow-500' : 
                        'bg-red-500'
                      }`} />
                    </div>
                    <div className="text-lg font-semibold">{typeof value === 'number' ? value.toFixed(2) : String(value)}{typeof value === 'number' && value > 1 ? 'x' : '%'}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 8-Pillar Scorecard Detailed */}
          <Card>
            <CardHeader>
              <CardTitle>8-Pillar Financial Strength Scorecard</CardTitle>
              <CardDescription>Proprietary scoring system analyzing key financial metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stockData.pillars).map(([key, pillar]: [string, any]) => {
                  const Icon = getStatusIcon(pillar.status);
                  return (
                    <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon className={`h-5 w-5 ${getStatusColor(pillar.status)}`} />
                        <div>
                          <div className="font-medium">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</div>
                          <div className="text-sm text-muted-foreground">{pillar.value}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={pillar.score} className="w-20" />
                        <span className="text-sm font-medium w-8">{pillar.score}</span>
                      </div>
                    </div>
                  );
                })}
                
                <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{stockData.score}/100</div>
                    <Progress value={stockData.score} className="mb-2" />
                    <p className="text-sm text-muted-foreground">Overall Somatic Investment Score</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* DCF Scenario Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>DCF Scenario Analysis</CardTitle>
              <CardDescription>Three-scenario valuation model with customizable inputs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Input Table */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="font-medium">Variable</div>
                  <div className="font-medium text-center">Low Case</div>
                  <div className="font-medium text-center">Base Case</div>
                  <div className="font-medium text-center">High Case</div>
                  
                  {Object.entries(dcfScenarios.low).map(([key, _]) => (
                    <div key={key} className="contents">
                      <div className="text-sm py-2">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</div>
                      {(['low', 'base', 'high'] as const).map(scenario => (
                        <Input
                          key={`${key}-${scenario}`}
                          type="number"
                          value={dcfScenarios[scenario][key as keyof typeof dcfScenarios.low]}
                          onChange={(e) => setDcfScenarios(prev => ({
                            ...prev,
                            [scenario]: { ...prev[scenario], [key]: parseFloat(e.target.value) }
                          }))}
                          className="text-center"
                        />
                      ))}
                    </div>
                  ))}
                </div>

                {/* DCF Results */}
                <div className="grid grid-cols-3 gap-4">
                  {(['low', 'base', 'high'] as const).map(scenario => {
                    const result = calculateDCF(scenario);
                    return (
                      <Card key={scenario} className={scenario === 'base' ? 'border-primary' : ''}>
                        <CardHeader>
                          <CardTitle className="text-center">{scenario.toUpperCase()} CASE</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center space-y-2">
                          <div className="text-2xl font-bold text-primary">${result.intrinsicValue}</div>
                          <div className="text-sm text-muted-foreground">Intrinsic Value</div>
                          <div className="text-lg font-semibold">{result.cagr}%</div>
                          <div className="text-sm text-muted-foreground">5-Year CAGR</div>
                          <div className={`text-lg font-semibold ${result.upside > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {result.upside > 0 ? '+' : ''}{result.upside}%
                          </div>
                          <div className="text-sm text-muted-foreground">Upside/Downside</div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Investment Thesis Generator */}
          <Card>
            <CardHeader>
              <CardTitle>Investment Thesis Generator</CardTitle>
              <CardDescription>Document your investment analysis and thesis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Economic Moat & Competitive Advantages</Label>
                <textarea
                  className="w-full min-h-20 p-3 border rounded-lg resize-none"
                  placeholder="Describe the company's competitive moats, brand strength, network effects, switching costs..."
                  value={investmentThesis.moat}
                  onChange={(e) => setInvestmentThesis(prev => ({ ...prev, moat: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Key Risks & Concerns</Label>
                <textarea
                  className="w-full min-h-20 p-3 border rounded-lg resize-none"
                  placeholder="Regulatory risks, competition, balance sheet concerns, market risks..."
                  value={investmentThesis.risks}
                  onChange={(e) => setInvestmentThesis(prev => ({ ...prev, risks: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Growth Opportunities</Label>
                <textarea
                  className="w-full min-h-20 p-3 border rounded-lg resize-none"
                  placeholder="Market expansion, product innovation, M&A opportunities, margin improvement..."
                  value={investmentThesis.opportunities}
                  onChange={(e) => setInvestmentThesis(prev => ({ ...prev, opportunities: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Export/Save Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Export & Save</CardTitle>
              <CardDescription>Save your analysis or export as a report</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <Button className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF Report
                </Button>
                <Button variant="outline" className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Save to Portfolio
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  const renderBusinessValuation = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Business Inputs</CardTitle>
            <CardDescription>Enter your business fundamentals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="revenue">Annual Revenue ($)</Label>
              <Input
                id="revenue"
                type="number"
                placeholder="1000000"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="growth">Expected Growth Rate (%)</Label>
              <Input
                id="growth"
                type="number"
                placeholder="15"
                value={growthRate}
                onChange={(e) => setGrowthRate(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="margin">Profit Margin (%)</Label>
              <Input
                id="margin"
                type="number"
                placeholder="20"
                value={profitMargin}
                onChange={(e) => setProfitMargin(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent className="bg-background border z-50">
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={calculateValuation} className="w-full">
              Calculate Valuation
            </Button>
          </CardContent>
        </Card>

        {valuation && (
          <Card>
            <CardHeader>
              <CardTitle>Valuation Results</CardTitle>
              <CardDescription>Multiple valuation approaches</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Revenue Multiple:</span>
                  <span className="font-semibold">${valuation.revenueMultiple.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Earnings Multiple:</span>
                  <span className="font-semibold">${valuation.earningsMultiple.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">DCF Estimate:</span>
                  <span className="font-semibold">${valuation.dcfValue.toLocaleString()}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <span className="font-medium">Average Valuation:</span>
                  <span className="text-xl font-bold text-primary">
                    ${valuation.averageValue.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  const renderCashFlow = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cash Flow Inputs</CardTitle>
            <CardDescription>Enter your financial data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Monthly Income ($)</Label>
              <Input
                type="number"
                placeholder="10000"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Monthly Expenses ($)</Label>
              <Input
                type="number"
                placeholder="8000"
                value={monthlyExpenses}
                onChange={(e) => setMonthlyExpenses(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Current Cash ($)</Label>
              <Input
                type="number"
                placeholder="50000"
                value={currentCash}
                onChange={(e) => setCurrentCash(e.target.value)}
              />
            </div>
            
            <Button onClick={calculateCashFlow} className="w-full">
              Run Simulation
            </Button>
          </CardContent>
        </Card>

        {cashFlowResult && (
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Net Monthly Cash Flow:</span>
                  <span className={`font-semibold ${cashFlowResult.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${cashFlowResult.netCashFlow.toLocaleString()}
                  </span>
                </div>
                
                {cashFlowResult.runway > 0 && (
                  <div className="flex justify-between">
                    <span>Cash Runway:</span>
                    <span className="font-semibold text-orange-600">
                      {cashFlowResult.runway} months
                    </span>
                  </div>
                )}
                
                <div className="mt-4">
                  <h4 className="font-medium mb-2">12-Month Projection</h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {cashFlowResult.projections.slice(0, 6).map((projection: any) => (
                      <div key={projection.month} className="flex justify-between text-sm">
                        <span>Month {projection.month}:</span>
                        <span className={projection.status === 'positive' ? 'text-green-600' : 'text-red-600'}>
                          ${projection.cash.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  const renderRetirementPlanning = () => (
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
                <AreaChart data={generateRetirementChartData()}>
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

  const renderRealEstate = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Real Estate Investment</CardTitle>
            <CardDescription>Analyze property investment potential</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Property Price ($)</Label>
              <Input
                type="number"
                placeholder="300000"
                value={propertyPrice}
                onChange={(e) => setPropertytyPrice(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Down Payment ($)</Label>
              <Input
                type="number"
                placeholder="60000"
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Monthly Rent ($)</Label>
              <Input
                type="number"
                placeholder="2500"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Monthly Operating Expenses ($)</Label>
              <Input
                type="number"
                placeholder="500"
                value={operatingExpenses}
                onChange={(e) => setOperatingExpenses(e.target.value)}
              />
            </div>
            
            <Button onClick={calculateRealEstate} className="w-full">
              Analyze Investment
            </Button>
          </CardContent>
        </Card>

        {realEstateResult && (
          <Card>
            <CardHeader>
              <CardTitle>Investment Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Monthly Mortgage Payment:</span>
                  <span className="font-semibold">${realEstateResult.monthlyPayment.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Net Monthly Cash Flow:</span>
                  <span className={`font-semibold ${realEstateResult.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${realEstateResult.netCashFlow.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Cash-on-Cash Return:</span>
                  <span className="font-semibold">{realEstateResult.cashOnCashReturn}%</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Cap Rate:</span>
                  <span className="font-semibold">{realEstateResult.capRate}%</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Investment Viability:</span>
                  <span className={`font-semibold ${realEstateResult.profitable ? 'text-green-600' : 'text-red-600'}`}>
                    {realEstateResult.profitable ? 'Profitable' : 'Unprofitable'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  const renderPerformanceTracker = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Somatic Performance Tracker</CardTitle>
          <CardDescription>Track your daily wellness metrics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Energy Level: {energy[0]}/10</Label>
              <Slider
                value={energy}
                onValueChange={setEnergy}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Stress Level: {stress[0]}/10</Label>
              <Slider
                value={stress}
                onValueChange={setStress}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Focus Level: {focus[0]}/10</Label>
              <Slider
                value={focus}
                onValueChange={setFocus}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Sleep Quality: {sleep[0]}/10</Label>
              <Slider
                value={sleep}
                onValueChange={setSleep}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
          </div>
          
          <Card className="bg-primary/5">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {calculateSomaticScore()}/100
                </div>
                <Progress value={calculateSomaticScore()} className="mb-2" />
                <p className="text-sm text-muted-foreground">Your Somatic Score</p>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {modules.slice(1).map((module) => {
          const Icon = module.icon;
          return (
            <Card key={module.id} className="cursor-pointer hover:shadow-md hover-scale transition-all duration-200" onClick={() => setActiveModule(module.id)}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Icon className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">{module.name}</h3>
                    <p className="text-sm text-muted-foreground">Available</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to SomaTech</CardTitle>
            <CardDescription>
              Your comprehensive suite of business and financial intelligence tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              SomaTech provides professional-grade financial analysis tools designed for entrepreneurs, 
              investors, and business professionals. Get started by selecting a tool from the grid above 
              or use the sidebar navigation.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4 mr-2" />
                Real-time stock analysis with 8-pillar scoring
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calculator className="h-4 w-4 mr-2" />
                Business valuation using multiple methodologies
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <BarChart3 className="h-4 w-4 mr-2" />
                Cash flow simulation and runway analysis
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Stock Lookup</CardTitle>
            <CardDescription>
              Enter a ticker symbol for instant analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Input
                placeholder="TSLA"
                value={globalTicker}
                onChange={(e) => setGlobalTicker(e.target.value.toUpperCase())}
                className="flex-1"
              />
              <Button onClick={() => setActiveModule("stock-analysis")}>
                Analyze
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderPlaceholder = (title: string) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Professional tool under development</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <PieChart className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            This advanced financial tool is currently being developed and will be available soon.
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    switch (activeModule) {
      case "dashboard":
        return renderDashboard();
      case "stock-analysis":
        return renderStockAnalysis();
      case "business-valuation":
        return renderBusinessValuation();
      case "cash-flow":
        return renderCashFlow();
      case "retirement-planning":
        return renderRetirementPlanning();
      case "real-estate":
        return renderRealEstate();
      case "performance-tracker":
        return renderPerformanceTracker();
      default:
        return renderPlaceholder(modules.find(m => m.id === activeModule)?.name || "Tool");
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-card border-r transition-all duration-300 flex flex-col`}>
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">ST</span>
            </div>
            {!sidebarCollapsed && (
              <h1 className="text-xl font-bold">SomaTech</h1>
            )}
          </div>
        </div>
        
        <nav className="flex-1 px-2">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 mb-1 rounded-lg text-left transition-colors ${
                  activeModule === module.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted'
                }`}
              >
                <Icon className="h-5 w-5" />
                {!sidebarCollapsed && <span>{module.name}</span>}
              </button>
            );
          })}
        </nav>
        
        <div className="p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full"
          >
            {sidebarCollapsed ? '→' : '←'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-card border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {modules.find(m => m.id === activeModule)?.name || "Dashboard"}
              </h2>
              <p className="text-muted-foreground">
                Professional business intelligence tools
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">Free Trial</Button>
              <Button>Upgrade to Pro</Button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default SomaTech;