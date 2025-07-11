import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Calculator, Home, RefreshCw, TrendingUp, DollarSign, Save, FolderOpen } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { RealEstateResult } from "./types";
import { BRRRRInputs, BRRRRResults, SavedDeal, calculateBRRRR } from "./real-estate/brrrrCalculations";
import { useBRRRROperations } from "./real-estate/useBRRRROperations";
import { formatCurrency, formatPercentage } from "./real-estate/realEstateUtils";
import PropertyMap from "./real-estate/PropertyMap";

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
  
  // Save/Load State
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [dealName, setDealName] = useState("");
  const [dealNotes, setDealNotes] = useState("");
  const [currentDealId, setCurrentDealId] = useState<string | null>(null);

  // Operations hook
  const { loadSavedDeals, saveDeal, deleteDeal, updateDealNotes } = useBRRRROperations();
  const [savedDeals, setSavedDeals] = useState<SavedDeal[]>([]);

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

  useEffect(() => {
    const loadDeals = async () => {
      const deals = await loadSavedDeals();
      setSavedDeals(deals);
    };
    loadDeals();
  }, [loadSavedDeals]);

  const handleSaveDeal = async () => {
    if (!brrrrResults) return;
    
    const success = await saveDeal(dealName, brrrrInputs, brrrrResults, dealNotes, currentDealId);
    if (success) {
      setShowSaveDialog(false);
      setDealName("");
      setDealNotes("");
      const deals = await loadSavedDeals();
      setSavedDeals(deals);
    }
  };

  const handleLoadDeal = (deal: SavedDeal) => {
    setBrrrrInputs(deal.inputs);
    setBrrrrResults(deal.results);
    setCurrentDealId(deal.id);
    setDealName(deal.deal_name);
    setDealNotes(deal.notes || "");
    setShowLoadDialog(false);
    
    toast({
      title: "Deal Loaded",
      description: `"${deal.deal_name}" has been loaded successfully.`,
    });
  };

  const handleDeleteDeal = async (dealId: string, dealName: string) => {
    const success = await deleteDeal(dealId, dealName);
    if (success) {
      const deals = await loadSavedDeals();
      setSavedDeals(deals);
    }
  };

  const handleCalculateBRRRR = () => {
    const results = calculateBRRRR(brrrrInputs);
    setBrrrrResults(results);
  };

  const handleEditDealNotes = async (dealId: string, dealName: string, notes: string) => {
    await updateDealNotes(dealId, dealName, notes);
    const deals = await loadSavedDeals();
    setSavedDeals(deals);
  };

  const updateBrrrrInput = (field: keyof BRRRRInputs, value: number) => {
    setBrrrrInputs(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="traditional" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="traditional" className="gap-2">
            <Calculator className="h-4 w-4" />
            Traditional Analysis
          </TabsTrigger>
          <TabsTrigger value="brrrr" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            BRRRR Calculator
          </TabsTrigger>
          <TabsTrigger value="saved-deals" className="gap-2">
            <FolderOpen className="h-4 w-4" />
            Saved Deals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="traditional" className="space-y-6">
          <PropertyMap />
          
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
          <PropertyMap />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* BRRRR Input Forms */}
            <div className="space-y-6">
              {/* Buy Phase */}
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
                    <RefreshCw className="h-5 w-5 text-orange-500" />
                    Rehab Phase
                  </CardTitle>
                  <CardDescription>Renovation details</CardDescription>
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
                  <CardDescription>Rental income and expenses</CardDescription>
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
                    <TrendingUp className="h-5 w-5 text-purple-500" />
                    Refinance Phase
                  </CardTitle>
                  <CardDescription>Refinancing details</CardDescription>
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

              <Button onClick={handleCalculateBRRRR} className="w-full" size="lg">
                Calculate BRRRR Analysis
              </Button>
            </div>

            {/* BRRRR Results */}
            {brrrrResults && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>BRRRR Analysis Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Investment:</span>
                      <span className="font-semibold">{formatCurrency(brrrrResults.totalInvestment)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Equity Created:</span>
                      <span className="font-semibold">{formatCurrency(brrrrResults.equityCreated)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cash Out Amount:</span>
                      <span className="font-semibold">{formatCurrency(brrrrResults.cashOutAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Post-Refi ROI:</span>
                      <span className="font-semibold">{formatPercentage(brrrrResults.postRefinanceROI)}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex gap-2">
                  <Button onClick={() => setShowSaveDialog(true)} variant="outline" size="lg">
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="saved-deals" className="space-y-6">
          {savedDeals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No saved deals found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedDeals.map((deal) => (
                <Card key={deal.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleLoadDeal(deal)}>
                  <CardHeader>
                    <CardTitle>{deal.deal_name}</CardTitle>
                    <CardDescription>
                      Created: {new Date(deal.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Purchase Price:</span>
                        <span>{formatCurrency(deal.inputs.purchasePrice)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Total Investment:</span>
                        <span>{formatCurrency(deal.results.totalInvestment)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Post-Refi ROI:</span>
                        <span>{formatPercentage(deal.results.postRefinanceROI)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RealEstateCalculator;