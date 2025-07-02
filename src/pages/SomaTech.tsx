import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Calculator, TrendingUp, BarChart3, Target, Users, FileText, Activity, Home } from "lucide-react";

const SomaTech = () => {
  const [activeModule, setActiveModule] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Business Valuation Tool State
  const [revenue, setRevenue] = useState("");
  const [growthRate, setGrowthRate] = useState("");
  const [profitMargin, setProfitMargin] = useState("");
  const [industry, setIndustry] = useState("");
  const [valuation, setValuation] = useState<any>(null);

  const modules = [
    { id: "dashboard", name: "Dashboard", icon: Home },
    { id: "stock-analysis", name: "Stock Analysis", icon: TrendingUp },
    { id: "business-valuation", name: "Business Valuation", icon: Calculator },
    { id: "cash-flow", name: "Cash Flow Simulator", icon: BarChart3 },
    { id: "financial-ratios", name: "Financial Ratios", icon: Target },
    { id: "investor-readiness", name: "Investor Readiness", icon: Users },
    { id: "retirement-planning", name: "Retirement Planning", icon: FileText },
    { id: "performance-tracker", name: "Performance Tracker", icon: Activity },
  ];

  const calculateValuation = () => {
    if (!revenue || !growthRate || !profitMargin) return;

    const annualRevenue = parseFloat(revenue);
    const growth = parseFloat(growthRate) / 100;
    const margin = parseFloat(profitMargin) / 100;
    
    // Industry multipliers
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
    const dcfValue = netIncome * (1 + growth) * 10; // Simplified DCF

    setValuation({
      revenueMultiple: Math.round(revenueMultiple),
      earningsMultiple: Math.round(earningsMultiple),
      dcfValue: Math.round(dcfValue),
      averageValue: Math.round((revenueMultiple + earningsMultiple + dcfValue) / 3)
    });
  };

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
                <SelectContent className="bg-background border">
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
              
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">
                  This is a simplified valuation model. Actual business valuations require 
                  comprehensive analysis of market conditions, competition, and financial history.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {modules.slice(1).map((module) => {
          const Icon = module.icon;
          return (
            <Card key={module.id} className="cursor-pointer hover:shadow-md transition-shadow">
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
      
      <Card>
        <CardHeader>
          <CardTitle>Welcome to SomaTech</CardTitle>
          <CardDescription>
            Your comprehensive suite of business and financial intelligence tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Select a tool from the sidebar to get started with your financial analysis and business optimization.
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderPlaceholder = (title: string) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Coming soon</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">This tool is under development.</p>
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    switch (activeModule) {
      case "dashboard":
        return renderDashboard();
      case "business-valuation":
        return renderBusinessValuation();
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

        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default SomaTech;