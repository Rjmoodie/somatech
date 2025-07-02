import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ValuationResult } from "./types";
import { industryMultipliers } from "./constants";

const BusinessValuation = () => {
  const [revenue, setRevenue] = useState("");
  const [growthRate, setGrowthRate] = useState("");
  const [profitMargin, setProfitMargin] = useState("");
  const [industry, setIndustry] = useState("");
  const [valuation, setValuation] = useState<ValuationResult | null>(null);

  const calculateValuation = () => {
    if (!revenue || !growthRate || !profitMargin) return;

    const annualRevenue = parseFloat(revenue);
    const growth = parseFloat(growthRate) / 100;
    const margin = parseFloat(profitMargin) / 100;
    
    const multiplier = industryMultipliers[industry] || 3;
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

  return (
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
};

export default BusinessValuation;