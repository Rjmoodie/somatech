import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CashFlowResult } from "./types";

const CashFlowSimulator = () => {
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [monthlyExpenses, setMonthlyExpenses] = useState("");
  const [currentCash, setCurrentCash] = useState("");
  const [cashFlowResult, setCashFlowResult] = useState<CashFlowResult | null>(null);

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

  return (
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
                    {cashFlowResult.projections.slice(0, 6).map((projection) => (
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
};

export default CashFlowSimulator;