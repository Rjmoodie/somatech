import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RealEstateResult } from "../types";

interface TraditionalCalculatorProps {
  onResultCalculated?: (result: RealEstateResult) => void;
}

export const TraditionalCalculator = ({ onResultCalculated }: TraditionalCalculatorProps) => {
  const [propertyPrice, setPropertyPrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [operatingExpenses, setOperatingExpenses] = useState("");
  const [realEstateResult, setRealEstateResult] = useState<RealEstateResult | null>(null);

  // Validation for traditional calculator
  const validation = useMemo(() => {
    const price = parseFloat(propertyPrice) || 0;
    const down = parseFloat(downPayment) || 0;
    const rent = parseFloat(monthlyRent) || 0;
    const expenses = parseFloat(operatingExpenses) || 0;
    
    return {
      isValid: price > 0 && down > 0 && rent > 0 && expenses >= 0 && down < price,
      errors: {
        propertyPrice: price <= 0 ? "Property price must be greater than 0" : null,
        downPayment: down <= 0 ? "Down payment must be greater than 0" : down >= price ? "Down payment must be less than property price" : null,
        monthlyRent: rent <= 0 ? "Monthly rent must be greater than 0" : null,
        operatingExpenses: expenses < 0 ? "Operating expenses cannot be negative" : null
      }
    };
  }, [propertyPrice, downPayment, monthlyRent, operatingExpenses]);

  const calculateRealEstate = () => {
    if (!validation.isValid) return;

    const price = parseFloat(propertyPrice);
    const down = parseFloat(downPayment);
    const rent = parseFloat(monthlyRent);
    const expenses = parseFloat(operatingExpenses);

    const loanAmount = price - down;
    const monthlyPayment = loanAmount * 0.005;
    const netCashFlow = rent - monthlyPayment - expenses;
    const cashOnCashReturn = (netCashFlow * 12) / down * 100;
    const capRate = ((rent * 12) - (expenses * 12)) / price * 100;

    const result = {
      monthlyPayment: Math.round(monthlyPayment),
      netCashFlow: Math.round(netCashFlow),
      cashOnCashReturn: Math.round(cashOnCashReturn * 100) / 100,
      capRate: Math.round(capRate * 100) / 100,
      profitable: netCashFlow > 0
    };

    setRealEstateResult(result);
    onResultCalculated?.(result);
  };

  return (
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
              onChange={(e) => setPropertyPrice(e.target.value)}
              className={validation.errors.propertyPrice ? "border-destructive" : ""}
            />
            {validation.errors.propertyPrice && (
              <p className="text-sm text-destructive">{validation.errors.propertyPrice}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label>Down Payment ($)</Label>
            <Input
              type="number"
              placeholder="60000"
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
              className={validation.errors.downPayment ? "border-destructive" : ""}
            />
            {validation.errors.downPayment && (
              <p className="text-sm text-destructive">{validation.errors.downPayment}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label>Monthly Rent ($)</Label>
            <Input
              type="number"
              placeholder="2500"
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(e.target.value)}
              className={validation.errors.monthlyRent ? "border-destructive" : ""}
            />
            {validation.errors.monthlyRent && (
              <p className="text-sm text-destructive">{validation.errors.monthlyRent}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label>Monthly Operating Expenses ($)</Label>
            <Input
              type="number"
              placeholder="500"
              value={operatingExpenses}
              onChange={(e) => setOperatingExpenses(e.target.value)}
              className={validation.errors.operatingExpenses ? "border-destructive" : ""}
            />
            {validation.errors.operatingExpenses && (
              <p className="text-sm text-destructive">{validation.errors.operatingExpenses}</p>
            )}
          </div>
          
          <Button 
            onClick={calculateRealEstate} 
            className="w-full"
            disabled={!validation.isValid}
          >
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
  );
};