import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Home, RefreshCw, TrendingUp, DollarSign, Save, FolderOpen, Download, Trash2, Edit3, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
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

interface SavedDeal {
  id: string;
  deal_name: string;
  inputs: BRRRRInputs;
  results: BRRRRResults;
  notes?: string;
  created_at: string;
  updated_at: string;
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
  
  // Save/Load State
  const [savedDeals, setSavedDeals] = useState<SavedDeal[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [dealName, setDealName] = useState("");
  const [dealNotes, setDealNotes] = useState("");
  const [currentDealId, setCurrentDealId] = useState<string | null>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showEditNotesDialog, setShowEditNotesDialog] = useState(false);
  const [editingDeal, setEditingDeal] = useState<SavedDeal | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [currentNotes, setCurrentNotes] = useState("");

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
    loadSavedDeals();
  }, []);

  const loadSavedDeals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('brrrr_deals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedDeals((data as any[])?.map(item => ({
        ...item,
        inputs: item.inputs as BRRRRInputs,
        results: item.results as BRRRRResults
      })) || []);
    } catch (error) {
      console.error('Error loading saved deals:', error);
    }
  };

  const saveDeal = async () => {
    if (!brrrrResults || !dealName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please calculate the deal and enter a deal name before saving.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to save deals.",
          variant: "destructive",
        });
        return;
      }

      if (currentDealId) {
        const { error } = await supabase
          .from('brrrr_deals')
          .update({
            deal_name: dealName,
            inputs: brrrrInputs as any,
            results: brrrrResults as any,
            notes: dealNotes,
          })
          .eq('id', currentDealId);

        if (error) throw error;
        
        toast({
          title: "Deal Updated",
          description: `"${dealName}" has been updated successfully.`,
        });
      } else {
        const { error } = await supabase
          .from('brrrr_deals')
          .insert([{
            user_id: user.id,
            deal_name: dealName,
            inputs: brrrrInputs as any,
            results: brrrrResults as any,
            notes: dealNotes,
          }]);
        
        toast({
          title: "Deal Saved",
          description: `"${dealName}" has been saved successfully.`,
        });
      }

      setShowSaveDialog(false);
      setDealName("");
      setDealNotes("");
      loadSavedDeals();
    } catch (error) {
      console.error('Error saving deal:', error);
      toast({
        title: "Error",
        description: "Failed to save deal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const loadDeal = (deal: SavedDeal) => {
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

  const deleteDeal = async (dealId: string, dealName: string) => {
    try {
      const { error } = await supabase
        .from('brrrr_deals')
        .delete()
        .eq('id', dealId);

      if (error) throw error;
      
      toast({
        title: "Deal Deleted",
        description: `"${dealName}" has been deleted.`,
      });
      
      loadSavedDeals();
    } catch (error) {
      console.error('Error deleting deal:', error);
      toast({
        title: "Error",
        description: "Failed to delete deal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const editDealNotes = (deal: SavedDeal) => {
    setEditingDeal(deal);
    setEditNotes(deal.notes || "");
    setShowEditNotesDialog(true);
  };

  const updateDealNotes = async () => {
    if (!editingDeal) return;

    try {
      const { error } = await supabase
        .from('brrrr_deals')
        .update({ notes: editNotes })
        .eq('id', editingDeal.id);

      if (error) throw error;
      
      toast({
        title: "Notes Updated",
        description: `Notes for "${editingDeal.deal_name}" have been updated.`,
      });
      
      setShowEditNotesDialog(false);
      setEditingDeal(null);
      setEditNotes("");
      loadSavedDeals();
    } catch (error) {
      console.error('Error updating notes:', error);
      toast({
        title: "Error",
        description: "Failed to update notes. Please try again.",
        variant: "destructive",
      });
    }
  };

  const exportToPrint = () => {
    if (!brrrrResults) {
      toast({
        title: "No Data",
        description: "Please calculate a deal before exporting.",
        variant: "destructive",
      });
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>BRRRR Deal Report - ${dealName || 'Untitled Deal'}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .section { margin-bottom: 30px; }
            .section h2 { color: #333; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
            .metrics { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 20px; }
            .metric { padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
            .metric-value { font-size: 1.2em; font-weight: bold; color: #2563eb; }
            .positive { color: #16a34a; }
            .negative { color: #dc2626; }
            .phase { margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 5px; }
            .phase h3 { margin-top: 0; color: #666; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>BRRRR Deal Analysis Report</h1>
            <h2>${dealName || 'Untitled Deal'}</h2>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>

          <div class="section">
            <h2>Executive Summary</h2>
            <div class="metrics">
              <div class="metric">
                <div>Total Investment</div>
                <div class="metric-value">${formatCurrency(brrrrResults.totalInvestment)}</div>
              </div>
              <div class="metric">
                <div>Equity Created</div>
                <div class="metric-value">${formatCurrency(brrrrResults.equityCreated)}</div>
              </div>
              <div class="metric">
                <div>Cash Out Amount</div>
                <div class="metric-value">${formatCurrency(brrrrResults.cashOutAmount)}</div>
              </div>
              <div class="metric">
                <div>Capital Recycled</div>
                <div class="metric-value">${formatPercentage(brrrrResults.capitalRecycled)}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>Phase Analysis</h2>
            
            <div class="phase">
              <h3>Buy Phase</h3>
              <p><strong>Purchase Price:</strong> ${formatCurrency(brrrrInputs.purchasePrice)}</p>
              <p><strong>Down Payment:</strong> ${formatCurrency((brrrrInputs.purchasePrice * brrrrInputs.downPaymentPercent) / 100)} (${brrrrInputs.downPaymentPercent}%)</p>
              <p><strong>Total Acquisition Cost:</strong> ${formatCurrency(brrrrResults.totalAcquisitionCost)}</p>
              <p><strong>Initial Cash Needed:</strong> ${formatCurrency(brrrrResults.initialCashNeeded)}</p>
            </div>

            <div class="phase">
              <h3>Rehab Phase</h3>
              <p><strong>Renovation Budget:</strong> ${formatCurrency(brrrrInputs.renovationBudget)}</p>
              <p><strong>Contingency:</strong> ${formatCurrency((brrrrInputs.renovationBudget * brrrrInputs.contingencyPercent) / 100)} (${brrrrInputs.contingencyPercent}%)</p>
              <p><strong>Total Rehab Cost:</strong> ${formatCurrency(brrrrResults.totalRehabCost)}</p>
              <p><strong>Holding Costs:</strong> ${formatCurrency(brrrrResults.totalHoldingCost)}</p>
            </div>

            <div class="phase">
              <h3>Rent Phase</h3>
              <p><strong>Monthly Rent:</strong> ${formatCurrency(brrrrInputs.monthlyRent)}</p>
              <p><strong>Effective Monthly Rent:</strong> ${formatCurrency(brrrrResults.effectiveMonthlyRent)}</p>
              <p><strong>Operating Expenses:</strong> ${formatCurrency(brrrrResults.monthlyOperatingExpenses)}</p>
              <p><strong>Pre-Refi Cash Flow:</strong> <span class="${brrrrResults.preRefinanceCashFlow >= 0 ? 'positive' : 'negative'}">${formatCurrency(brrrrResults.preRefinanceCashFlow)}</span></p>
            </div>

            <div class="phase">
              <h3>Refinance Phase</h3>
              <p><strong>After Repair Value (ARV):</strong> ${formatCurrency(brrrrInputs.arv)}</p>
              <p><strong>Refinance LTV:</strong> ${brrrrInputs.refinanceLTV}%</p>
              <p><strong>Max Refinance Loan:</strong> ${formatCurrency(brrrrResults.maxRefinanceLoan)}</p>
              <p><strong>Post-Refi Cash Flow:</strong> <span class="${brrrrResults.postRefinanceCashFlow >= 0 ? 'positive' : 'negative'}">${formatCurrency(brrrrResults.postRefinanceCashFlow)}</span></p>
              <p><strong>Remaining Equity:</strong> ${formatCurrency(brrrrResults.remainingEquity)}</p>
            </div>
          </div>

          ${dealNotes ? `
          <div class="section">
            <h2>Notes</h2>
            <p>${dealNotes.replace(/\n/g, '<br>')}</p>
          </div>
          ` : ''}

          <div class="section">
            <h2>Investment Metrics</h2>
            <div class="metrics">
              <div class="metric">
                <div>Post-Refinance ROI</div>
                <div class="metric-value">${formatPercentage(brrrrResults.postRefinanceROI)}</div>
              </div>
              <div class="metric">
                <div>Rent-to-Value Ratio</div>
                <div class="metric-value">${formatPercentage(brrrrResults.rentToValueRatio)}</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  const resetCalculator = () => {
    setBrrrrResults(null);
    setCurrentDealId(null);
    setDealName("");
    setDealNotes("");
    
    toast({
      title: "Calculator Reset",
      description: "Ready for a new deal analysis.",
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

  const generatePDFReport = () => {
    if (!brrrrResults) return;

    const reportContent = `
      BRRRR Deal Analysis Report
      
      Deal Summary:
      - Purchase Price: ${formatCurrency(brrrrInputs.purchasePrice)}
      - After Repair Value: ${formatCurrency(brrrrInputs.arv)}
      - Monthly Rent: ${formatCurrency(brrrrInputs.monthlyRent)}
      
      Key Metrics:
      - Capital Recycled: ${formatPercentage(brrrrResults.capitalRecycled)}
      - Post-Refinance Cash Flow: ${formatCurrency(brrrrResults.postRefinanceCashFlow)}/month
      - Post-Refinance ROI: ${formatPercentage(brrrrResults.postRefinanceROI)}
      
      Generated on: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'brrrr-deal-report.txt';
    a.click();
    URL.revokeObjectURL(url);
    
    setShowExportDialog(false);
    toast({
      title: "Report Exported",
      description: "Your BRRRR deal report has been downloaded.",
    });
  };

  const generateCSVReport = () => {
    if (!brrrrResults) return;

    const csvContent = [
      ['Metric', 'Value'],
      ['Purchase Price', brrrrInputs.purchasePrice],
      ['Down Payment %', brrrrInputs.downPaymentPercent],
      ['Renovation Budget', brrrrInputs.renovationBudget],
      ['ARV', brrrrInputs.arv],
      ['Monthly Rent', brrrrInputs.monthlyRent],
      ['Capital Recycled %', brrrrResults.capitalRecycled.toFixed(2)],
      ['Post-Refi Cash Flow', brrrrResults.postRefinanceCashFlow.toFixed(2)],
      ['Post-Refi ROI %', brrrrResults.postRefinanceROI.toFixed(2)],
      ['Remaining Equity', brrrrResults.remainingEquity.toFixed(2)]
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'brrrr-deal-data.csv';
    a.click();
    URL.revokeObjectURL(url);
    
    setShowExportDialog(false);
    toast({
      title: "Data Exported",
      description: "Your BRRRR deal data has been downloaded as CSV.",
    });
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

              <div className="flex gap-2">
                <Button onClick={calculateBRRRR} className="flex-1" size="lg">
                  Calculate BRRRR Deal
                </Button>
                {brrrrResults && (
                  <>
                    <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="lg">
                          <Save className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Save BRRRR Deal</DialogTitle>
                          <DialogDescription>
                            Save this deal analysis for future reference
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Deal Name</Label>
                            <Input
                              placeholder="e.g., 123 Main St Property"
                              value={dealName}
                              onChange={(e) => setDealName(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Notes (Optional)</Label>
                            <Textarea
                              placeholder="Add any notes about this deal..."
                              value={dealNotes || currentNotes}
                              onChange={(e) => setDealNotes(e.target.value)}
                              rows={4}
                            />
                            {currentNotes && !dealNotes && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Using notes from current analysis. Edit above to change.
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={saveDeal} className="flex-1">
                              {currentDealId ? 'Update Deal' : 'Save Deal'}
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => setShowSaveDialog(false)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={showLoadDialog} onOpenChange={setShowLoadDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="lg">
                          <FolderOpen className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Load Saved Deal</DialogTitle>
                          <DialogDescription>
                            Choose a previously saved deal to load
                          </DialogDescription>
                        </DialogHeader>
                        <div className="max-h-96 overflow-y-auto">
                          {savedDeals.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                              No saved deals found. Save your first deal to see it here.
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {savedDeals.map((deal) => (
                                <Card key={deal.id} className="p-4">
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <h4 className="font-semibold">{deal.deal_name}</h4>
                                      <p className="text-sm text-muted-foreground">
                                        Created: {new Date(deal.created_at).toLocaleDateString()}
                                      </p>
                                      <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                                        <span>Purchase: {formatCurrency(deal.inputs.purchasePrice)}</span>
                                        <span>ARV: {formatCurrency(deal.inputs.arv)}</span>
                                        <span>Cash Flow: {formatCurrency(deal.results.postRefinanceCashFlow)}</span>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => loadDeal(deal)}
                                      >
                                        Load
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => deleteDeal(deal.id, deal.deal_name)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </Card>
                              ))}
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={() => setShowExportDialog(true)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>

                  </>
                )}
              </div>
            </div>

            {/* Current Analysis Notes */}
            {brrrrResults && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Analysis Notes
                  </CardTitle>
                  <CardDescription>
                    Add notes about this deal analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={currentNotes}
                    onChange={(e) => setCurrentNotes(e.target.value)}
                    placeholder="Add your thoughts about this deal, potential concerns, next steps, etc..."
                    rows={4}
                    className="resize-none"
                  />
                </CardContent>
              </Card>
            )}

            {/* BRRRR Results */}
            {brrrrResults && (
              <div className="space-y-6">
                {/* Current Deal Indicator */}
                {currentDealId && (
                  <Card className="mb-4">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">Currently Editing: {dealName}</h4>
                          <p className="text-sm text-muted-foreground">
                            This deal is loaded from your saved deals
                          </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={resetCalculator}>
                          New Deal
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

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

        <TabsContent value="saved-deals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Saved BRRRR Deals
              </CardTitle>
              <CardDescription>
                View, load, and manage your saved real estate investment analyses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {savedDeals.length === 0 ? (
                <div className="text-center py-8">
                  <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Saved Deals</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't saved any BRRRR deals yet. Create a deal analysis and save it to see it here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedDeals.map((deal) => (
                    <Card key={deal.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{deal.deal_name}</CardTitle>
                        <CardDescription>
                          Created {new Date(deal.created_at).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Deal Summary Metrics */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Purchase Price:</span>
                            <span className="font-medium">{formatCurrency(deal.inputs.purchasePrice)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">ARV:</span>
                            <span className="font-medium">{formatCurrency(deal.inputs.arv)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Monthly Rent:</span>
                            <span className="font-medium">{formatCurrency(deal.inputs.monthlyRent)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Capital Recycled:</span>
                            <span className={`font-medium ${deal.results.capitalRecycled >= 80 ? 'text-green-600' : deal.results.capitalRecycled >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                              {formatPercentage(deal.results.capitalRecycled)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Post-Refi Cash Flow:</span>
                            <span className={`font-medium ${deal.results.postRefinanceCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatCurrency(deal.results.postRefinanceCashFlow)}/mo
                            </span>
                          </div>
                        </div>

                        {/* Deal Quality Badge */}
                        <div className="flex justify-center">
                          <Badge 
                            variant={
                              deal.results.capitalRecycled >= 80 && deal.results.postRefinanceCashFlow > 200 
                                ? "default" 
                                : deal.results.capitalRecycled >= 50 && deal.results.postRefinanceCashFlow > 0 
                                ? "secondary" 
                                : "destructive"
                            }
                          >
                            {deal.results.capitalRecycled >= 80 && deal.results.postRefinanceCashFlow > 200 
                              ? "Excellent Deal" 
                              : deal.results.capitalRecycled >= 50 && deal.results.postRefinanceCashFlow > 0 
                              ? "Good Deal" 
                              : "Fair Deal"
                            }
                          </Badge>
                        </div>

                        {/* Notes */}
                        {deal.notes && (
                          <div className="pt-2 border-t">
                            <p className="text-xs text-muted-foreground">Notes:</p>
                            <p className="text-sm mt-1 line-clamp-2">{deal.notes}</p>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => loadDeal(deal)}
                          >
                            Load Deal
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => editDealNotes(deal)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteDeal(deal.id, deal.deal_name)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>

      {/* Edit Notes Dialog */}
      <Dialog open={showEditNotesDialog} onOpenChange={setShowEditNotesDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Deal Notes</DialogTitle>
            <DialogDescription>
              Update notes for "{editingDeal?.deal_name}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Add your thoughts, observations, or next steps for this deal..."
                rows={6}
                className="resize-none"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={updateDealNotes} className="flex-1">
                Save Notes
              </Button>
              <Button variant="outline" onClick={() => setShowEditNotesDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Deal Report</DialogTitle>
            <DialogDescription>
              Choose how you'd like to export your BRRRR analysis
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={() => generatePDFReport()}
              >
                <Download className="h-6 w-6" />
                <span>PDF Report</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={() => generateCSVReport()}
              >
                <Download className="h-6 w-6" />
                <span>CSV Data</span>
              </Button>
            </div>
            <Button variant="outline" onClick={() => setShowExportDialog(false)} className="w-full">
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RealEstateCalculator;