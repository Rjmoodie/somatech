import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calculator, Home, RefreshCw, TrendingUp, DollarSign } from "lucide-react";
import { RealEstateResult } from "./types";

interface BRRRRInputs {
  // Buy Phase
  purchasePrice: number;
  downPaymentPercent: number;
  closingCosts: number;
  acquisitionFees: number;
  holdingCosts: number;
  
  // Rehab Phase
  renovationBudget: number;
  contingencyPercent: number;
  rehabDuration: number;
  rehabFinancingRate: number;
  
  // Rent Phase
  monthlyRent: number;
  vacancyRate: number;
  propertyManagement: number;
  insurance: number;
  propertyTax: number;
  maintenance: number;
  
  // Refinance Phase
  arv: number;
  refinanceLTV: number;
  newLoanRate: number;
  newLoanTerm: number;
  refinanceCosts: number;
}

interface BRRRRResults {
  // Buy Phase Results
  totalAcquisitionCost: number;
  initialCashNeeded: number;
  
  // Rehab Phase Results
  totalRehabCost: number;
  totalHoldingCost: number;
  preStabilizationInvestment: number;
  
  // Rent Phase Results
  effectiveMonthlyRent: number;
  monthlyOperatingExpenses: number;
  netOperatingIncome: number;
  preRefinanceCashFlow: number;
  preRefinanceROI: number;
  
  // Refinance Phase Results
  maxRefinanceLoan: number;
  cashOutAmount: number;
  newMonthlyPayment: number;
  postRefinanceCashFlow: number;
  postRefinanceROI: number;
  remainingEquity: number;
  
  // Summary Metrics
  totalInvestment: number;
  equityCreated: number;
  capitalRecycled: number;
  rentToValueRatio: number;
}

const RealEstateCalculator = () => {
  // Traditional Calculator State
  const [propertyPrice, setPropertyPrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [operatingExpenses, setOperatingExpenses] = useState("");
  const [realEstateResult, setRealEstateResult] = useState<RealEstateResult | null>(null);
  
  // BRRRR Calculator State
  const [brrrrInputs, setBrrrrInputs] = useState<BRRRRInputs>({
    purchasePrice: 100000,
    downPaymentPercent: 25,
    closingCosts: 3000,
    acquisitionFees: 1000,
    holdingCosts: 500,
    renovationBudget: 25000,
    contingencyPercent: 10,
    rehabDuration: 3,
    rehabFinancingRate: 7,
    monthlyRent: 1200,
    vacancyRate: 5,
    propertyManagement: 100,
    insurance: 75,
    propertyTax: 150,
    maintenance: 100,
    arv: 150000,
    refinanceLTV: 75,
    newLoanRate: 6.5,
    newLoanTerm: 30,
    refinanceCosts: 3500,
  });
  
  const [brrrrResults, setBrrrrResults] = useState<BRRRRResults | null>(null);

  const calculateRealEstate = () => {
    if (!propertyPrice || !downPayment || !monthlyRent || !operatingExpenses) return;

    const price = parseFloat(propertyPrice);
    const down = parseFloat(downPayment);
    const rent = parseFloat(monthlyRent);
    const expenses = parseFloat(operatingExpenses);

    const loanAmount = price - down;
    const monthlyPayment = loanAmount * 0.005;
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

  const calculateBRRRR = () => {
    const inputs = brrrrInputs;
    
    // Buy Phase Calculations
    const downPaymentAmount = (inputs.purchasePrice * inputs.downPaymentPercent) / 100;
    const totalAcquisitionCost = inputs.purchasePrice + inputs.closingCosts + inputs.acquisitionFees;
    const initialCashNeeded = downPaymentAmount + inputs.closingCosts + inputs.acquisitionFees;
    
    // Rehab Phase Calculations
    const contingencyAmount = (inputs.renovationBudget * inputs.contingencyPercent) / 100;
    const totalRehabCost = inputs.renovationBudget + contingencyAmount;
    const totalHoldingCost = inputs.holdingCosts * inputs.rehabDuration;
    const preStabilizationInvestment = initialCashNeeded + totalRehabCost + totalHoldingCost;
    
    // Rent Phase Calculations
    const effectiveMonthlyRent = inputs.monthlyRent * (1 - inputs.vacancyRate / 100);
    const monthlyOperatingExpenses = inputs.propertyManagement + inputs.insurance + inputs.propertyTax + inputs.maintenance;
    const netOperatingIncome = effectiveMonthlyRent - monthlyOperatingExpenses;
    
    // Calculate existing loan payment (purchase loan)
    const loanAmount = inputs.purchasePrice - downPaymentAmount;
    const monthlyRate = (inputs.rehabFinancingRate / 100) / 12;
    const numPayments = 30 * 12;
    const existingLoanPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    const preRefinanceCashFlow = netOperatingIncome - existingLoanPayment;
    const preRefinanceROI = (preRefinanceCashFlow * 12) / preStabilizationInvestment * 100;
    
    // Refinance Phase Calculations
    const maxRefinanceLoan = (inputs.arv * inputs.refinanceLTV) / 100;
    const cashOutAmount = Math.max(0, maxRefinanceLoan - loanAmount - inputs.refinanceCosts);
    
    // New loan payment calculation
    const newMonthlyRate = (inputs.newLoanRate / 100) / 12;
    const newNumPayments = inputs.newLoanTerm * 12;
    const newMonthlyPayment = maxRefinanceLoan * (newMonthlyRate * Math.pow(1 + newMonthlyRate, newNumPayments)) / (Math.pow(1 + newMonthlyRate, newNumPayments) - 1);
    
    const postRefinanceCashFlow = netOperatingIncome - newMonthlyPayment;
    const remainingInvestment = preStabilizationInvestment - cashOutAmount;
    const postRefinanceROI = remainingInvestment > 0 ? (postRefinanceCashFlow * 12) / remainingInvestment * 100 : 0;
    const remainingEquity = inputs.arv - maxRefinanceLoan;
    
    // Summary Metrics
    const equityCreated = inputs.arv - inputs.purchasePrice - totalRehabCost;
    const capitalRecycled = cashOutAmount / preStabilizationInvestment * 100;
    const rentToValueRatio = (inputs.monthlyRent * 12) / inputs.arv * 100;
    
    setBrrrrResults({
      totalAcquisitionCost,
      initialCashNeeded,
      totalRehabCost,
      totalHoldingCost,
      preStabilizationInvestment,
      effectiveMonthlyRent,
      monthlyOperatingExpenses,
      netOperatingIncome,
      preRefinanceCashFlow,
      preRefinanceROI,
      maxRefinanceLoan,
      cashOutAmount,
      newMonthlyPayment,
      postRefinanceCashFlow,
      postRefinanceROI,
      remainingEquity,
      totalInvestment: preStabilizationInvestment,
      equityCreated,
      capitalRecycled,
      rentToValueRatio
    });
  };

  const updateBrrrrInput = (field: keyof BRRRRInputs, value: number) => {
    setBrrrrInputs(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="traditional" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="traditional" className="gap-2">
            <Calculator className="h-4 w-4" />
            Traditional Analysis
          </TabsTrigger>
          <TabsTrigger value="brrrr" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            BRRRR Calculator
          </TabsTrigger>
        </TabsList>

        <TabsContent value="traditional" className="space-y-6">
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
        </TabsContent>

        <TabsContent value="brrrr" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* BRRRR Input Forms */}
            <div className="space-y-6">
              {/* Buy Phase */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-blue-500" />
                    Buy Phase
                  </CardTitle>
                  <CardDescription>Property acquisition details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Purchase Price ($)</Label>
                      <Input
                        type="number"
                        value={brrrrInputs.purchasePrice}
                        onChange={(e) => updateBrrrrInput('purchasePrice', Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Down Payment (%)</Label>
                      <Input
                        type="number"
                        value={brrrrInputs.downPaymentPercent}
                        onChange={(e) => updateBrrrrInput('downPaymentPercent', Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Closing Costs ($)</Label>
                      <Input
                        type="number"
                        value={brrrrInputs.closingCosts}
                        onChange={(e) => updateBrrrrInput('closingCosts', Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Acquisition Fees ($)</Label>
                      <Input
                        type="number"
                        value={brrrrInputs.acquisitionFees}
                        onChange={(e) => updateBrrrrInput('acquisitionFees', Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Monthly Holding Costs ($)</Label>
                    <Input
                      type="number"
                      value={brrrrInputs.holdingCosts}
                      onChange={(e) => updateBrrrrInput('holdingCosts', Number(e.target.value))}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Rehab Phase */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-orange-500" />
                    Rehab Phase
                  </CardTitle>
                  <CardDescription>Renovation and improvement costs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Renovation Budget ($)</Label>
                      <Input
                        type="number"
                        value={brrrrInputs.renovationBudget}
                        onChange={(e) => updateBrrrrInput('renovationBudget', Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Contingency (%)</Label>
                      <Input
                        type="number"
                        value={brrrrInputs.contingencyPercent}
                        onChange={(e) => updateBrrrrInput('contingencyPercent', Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Rehab Duration (months)</Label>
                      <Input
                        type="number"
                        value={brrrrInputs.rehabDuration}
                        onChange={(e) => updateBrrrrInput('rehabDuration', Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Financing Rate (%)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={brrrrInputs.rehabFinancingRate}
                        onChange={(e) => updateBrrrrInput('rehabFinancingRate', Number(e.target.value))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Rent Phase */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-500" />
                    Rent Phase
                  </CardTitle>
                  <CardDescription>Rental income and operating expenses</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Monthly Rent ($)</Label>
                      <Input
                        type="number"
                        value={brrrrInputs.monthlyRent}
                        onChange={(e) => updateBrrrrInput('monthlyRent', Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Vacancy Rate (%)</Label>
                      <Input
                        type="number"
                        value={brrrrInputs.vacancyRate}
                        onChange={(e) => updateBrrrrInput('vacancyRate', Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Property Management ($)</Label>
                      <Input
                        type="number"
                        value={brrrrInputs.propertyManagement}
                        onChange={(e) => updateBrrrrInput('propertyManagement', Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Insurance ($)</Label>
                      <Input
                        type="number"
                        value={brrrrInputs.insurance}
                        onChange={(e) => updateBrrrrInput('insurance', Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Property Tax ($)</Label>
                      <Input
                        type="number"
                        value={brrrrInputs.propertyTax}
                        onChange={(e) => updateBrrrrInput('propertyTax', Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Maintenance ($)</Label>
                      <Input
                        type="number"
                        value={brrrrInputs.maintenance}
                        onChange={(e) => updateBrrrrInput('maintenance', Number(e.target.value))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Refinance Phase */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5 text-purple-500" />
                    Refinance Phase
                  </CardTitle>
                  <CardDescription>Cash-out refinance details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>After Repair Value ($)</Label>
                      <Input
                        type="number"
                        value={brrrrInputs.arv}
                        onChange={(e) => updateBrrrrInput('arv', Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Refinance LTV (%)</Label>
                      <Input
                        type="number"
                        value={brrrrInputs.refinanceLTV}
                        onChange={(e) => updateBrrrrInput('refinanceLTV', Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>New Loan Rate (%)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={brrrrInputs.newLoanRate}
                        onChange={(e) => updateBrrrrInput('newLoanRate', Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>New Loan Term (years)</Label>
                      <Input
                        type="number"
                        value={brrrrInputs.newLoanTerm}
                        onChange={(e) => updateBrrrrInput('newLoanTerm', Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Refinance Costs ($)</Label>
                    <Input
                      type="number"
                      value={brrrrInputs.refinanceCosts}
                      onChange={(e) => updateBrrrrInput('refinanceCosts', Number(e.target.value))}
                    />
                  </div>
                </CardContent>
              </Card>

              <Button onClick={calculateBRRRR} className="w-full" size="lg">
                Calculate BRRRR Deal
              </Button>
            </div>

            {/* BRRRR Results */}
            {brrrrResults && (
              <div className="space-y-6">
                {/* Summary Dashboard */}
                <Card>
                  <CardHeader>
                    <CardTitle>BRRRR Deal Summary</CardTitle>
                    <CardDescription>Key performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatCurrency(brrrrResults.totalInvestment)}
                        </div>
                        <div className="text-sm text-blue-600">Total Investment</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {formatCurrency(brrrrResults.equityCreated)}
                        </div>
                        <div className="text-sm text-green-600">Equity Created</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {formatCurrency(brrrrResults.cashOutAmount)}
                        </div>
                        <div className="text-sm text-purple-600">Cash Out</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {formatPercentage(brrrrResults.capitalRecycled)}
                        </div>
                        <div className="text-sm text-orange-600">Capital Recycled</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Phase Results */}
                <Card>
                  <CardHeader>
                    <CardTitle>Phase-by-Phase Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Buy Phase Results */}
                    <div>
                      <h4 className="font-semibold text-blue-600 mb-3 flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        Buy Phase
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between">
                          <span>Total Acquisition Cost:</span>
                          <span className="font-medium">{formatCurrency(brrrrResults.totalAcquisitionCost)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Initial Cash Needed:</span>
                          <span className="font-medium">{formatCurrency(brrrrResults.initialCashNeeded)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Rehab Phase Results */}
                    <div>
                      <h4 className="font-semibold text-orange-600 mb-3 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Rehab Phase
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between">
                          <span>Total Rehab Cost:</span>
                          <span className="font-medium">{formatCurrency(brrrrResults.totalRehabCost)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Holding Costs:</span>
                          <span className="font-medium">{formatCurrency(brrrrResults.totalHoldingCost)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Rent Phase Results */}
                    <div>
                      <h4 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Rent Phase
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between">
                          <span>Effective Monthly Rent:</span>
                          <span className="font-medium">{formatCurrency(brrrrResults.effectiveMonthlyRent)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Operating Expenses:</span>
                          <span className="font-medium">{formatCurrency(brrrrResults.monthlyOperatingExpenses)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pre-Refi Cash Flow:</span>
                          <span className={`font-medium ${brrrrResults.preRefinanceCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(brrrrResults.preRefinanceCashFlow)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pre-Refi ROI:</span>
                          <span className="font-medium">{formatPercentage(brrrrResults.preRefinanceROI)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Refinance Phase Results */}
                    <div>
                      <h4 className="font-semibold text-purple-600 mb-3 flex items-center gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Refinance Phase
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between">
                          <span>Max Refinance Loan:</span>
                          <span className="font-medium">{formatCurrency(brrrrResults.maxRefinanceLoan)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>New Monthly Payment:</span>
                          <span className="font-medium">{formatCurrency(brrrrResults.newMonthlyPayment)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Post-Refi Cash Flow:</span>
                          <span className={`font-medium ${brrrrResults.postRefinanceCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(brrrrResults.postRefinanceCashFlow)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Remaining Equity:</span>
                          <span className="font-medium">{formatCurrency(brrrrResults.remainingEquity)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Investment Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Investment Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Rent-to-Value Ratio:</span>
                        <Badge variant={brrrrResults.rentToValueRatio >= 1 ? "default" : "secondary"}>
                          {formatPercentage(brrrrResults.rentToValueRatio)}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Post-Refinance ROI:</span>
                        <Badge variant={brrrrResults.postRefinanceROI >= 15 ? "default" : "secondary"}>
                          {formatPercentage(brrrrResults.postRefinanceROI)}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Deal Quality:</span>
                        <Badge variant={
                          brrrrResults.capitalRecycled >= 90 && brrrrResults.postRefinanceCashFlow > 0 
                            ? "default" 
                            : brrrrResults.capitalRecycled >= 70 
                            ? "secondary" 
                            : "outline"
                        }>
                          {brrrrResults.capitalRecycled >= 90 && brrrrResults.postRefinanceCashFlow > 0 
                            ? "Excellent" 
                            : brrrrResults.capitalRecycled >= 70 
                            ? "Good" 
                            : "Fair"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RealEstateCalculator;