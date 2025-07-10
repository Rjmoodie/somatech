import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Calculator, Save, FolderOpen, Download, Trash2, Edit3, FileText, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import RetirementInputForm from "./retirement/RetirementInputForm";
import RetirementResults from "./retirement/RetirementResults";
import RetirementVisualization from "./retirement/RetirementVisualization";

interface RetirementInputs {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  currentSavings: number;
  monthlyContribution: number;
  expectedReturn: number;
  retirementSpending: number;
  inflationRate: number;
  otherIncome: number;
}

interface RetirementResults {
  totalSavingsAtRetirement: number;
  yearsToRetirement: number;
  yearsInRetirement: number;
  inflationAdjustedSpending: number;
  annualIncomeGap: number;
  surplusOrShortfall: number;
  requiredReturnToMeetGoal: number;
  yearsWillLast: number;
  onTrack: boolean;
}

interface SavedPlan {
  id: string;
  plan_name: string;
  inputs: RetirementInputs;
  results: RetirementResults;
  notes?: string;
  created_at: string;
  updated_at: string;
}

const RetirementPlanning = () => {
  // Original state
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

  // Save/Load State
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showEditNotesDialog, setShowEditNotesDialog] = useState(false);
  const [planName, setPlanName] = useState("");
  const [planNotes, setPlanNotes] = useState("");
  const [currentNotes, setCurrentNotes] = useState("");
  const [editingPlan, setEditingPlan] = useState<SavedPlan | null>(null);
  const [editNotes, setEditNotes] = useState("");

  useEffect(() => {
    loadSavedPlans();
  }, []);

  const loadSavedPlans = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('retirement_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedPlans((data as any[])?.map(item => ({
        ...item,
        inputs: item.inputs as RetirementInputs,
        results: item.results as RetirementResults
      })) || []);
    } catch (error) {
      console.error('Error loading plans:', error);
    }
  };

  const savePlan = async () => {
    if (!planName.trim() || !retirementResult) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to save retirement plans.",
          variant: "destructive",
        });
        return;
      }

      const inputs: RetirementInputs = {
        currentAge: parseInt(currentAge),
        retirementAge: parseInt(retirementAge),
        lifeExpectancy: parseInt(lifeExpectancy),
        currentSavings: parseFloat(currentSavings),
        monthlyContribution: parseFloat(monthlyContribution),
        expectedReturn: expectedReturn[0],
        retirementSpending: parseFloat(retirementSpending),
        inflationRate: inflationRate[0],
        otherIncome: parseFloat(otherIncome) || 0,
      };

      const notesToSave = planNotes || currentNotes;
      
      const { data, error } = await supabase
        .from('retirement_plans')
        .insert({
          plan_name: planName,
          user_id: user.id,
          inputs: inputs as any,
          results: retirementResult as any,
          notes: notesToSave,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        toast({
          title: "Plan Saved",
          description: `"${planName}" has been saved successfully.`,
        });
      }

      setShowSaveDialog(false);
      setPlanName("");
      setPlanNotes("");
      loadSavedPlans();
    } catch (error) {
      console.error('Error saving plan:', error);
      toast({
        title: "Error",
        description: "Failed to save plan. Please try again.",
        variant: "destructive",
      });
    }
  };

  const loadPlan = (plan: SavedPlan) => {
    setCurrentAge(plan.inputs.currentAge.toString());
    setRetirementAge(plan.inputs.retirementAge.toString());
    setLifeExpectancy(plan.inputs.lifeExpectancy.toString());
    setCurrentSavings(plan.inputs.currentSavings.toString());
    setMonthlyContribution(plan.inputs.monthlyContribution.toString());
    setExpectedReturn([plan.inputs.expectedReturn]);
    setRetirementSpending(plan.inputs.retirementSpending.toString());
    setInflationRate([plan.inputs.inflationRate]);
    setOtherIncome(plan.inputs.otherIncome.toString());
    setRetirementResult(plan.results);
    setPlanNotes(plan.notes || "");
    setCurrentNotes(plan.notes || "");
    setShowLoadDialog(false);
    
    toast({
      title: "Plan Loaded",
      description: `"${plan.plan_name}" has been loaded successfully.`,
    });
  };

  const deletePlan = async (planId: string, planName: string) => {
    try {
      const { error } = await supabase
        .from('retirement_plans')
        .delete()
        .eq('id', planId);

      if (error) throw error;
      
      toast({
        title: "Plan Deleted",
        description: `"${planName}" has been deleted.`,
      });
      
      loadSavedPlans();
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast({
        title: "Error",
        description: "Failed to delete plan. Please try again.",
        variant: "destructive",
      });
    }
  };

  const editPlanNotes = (plan: SavedPlan) => {
    setEditingPlan(plan);
    setEditNotes(plan.notes || "");
    setShowEditNotesDialog(true);
  };

  const updatePlanNotes = async () => {
    if (!editingPlan) return;

    try {
      const { error } = await supabase
        .from('retirement_plans')
        .update({ notes: editNotes })
        .eq('id', editingPlan.id);

      if (error) throw error;
      
      toast({
        title: "Notes Updated",
        description: `Notes for "${editingPlan.plan_name}" have been updated.`,
      });
      
      setShowEditNotesDialog(false);
      setEditingPlan(null);
      setEditNotes("");
      loadSavedPlans();
    } catch (error) {
      console.error('Error updating notes:', error);
      toast({
        title: "Error",
        description: "Failed to update notes. Please try again.",
        variant: "destructive",
      });
    }
  };

  const generatePDFReport = () => {
    if (!retirementResult) return;

    const reportContent = `
      Retirement Planning Report
      
      Plan Summary:
      - Current Age: ${currentAge}
      - Retirement Age: ${retirementAge}
      - Current Savings: $${parseFloat(currentSavings).toLocaleString()}
      - Monthly Contribution: $${parseFloat(monthlyContribution).toLocaleString()}
      
      Key Results:
      - Total at Retirement: $${retirementResult.totalSavingsAtRetirement.toLocaleString()}
      - Years to Retirement: ${retirementResult.yearsToRetirement}
      - Surplus/Shortfall: $${retirementResult.surplusOrShortfall.toLocaleString()}
      - Funds Will Last: ${retirementResult.yearsWillLast} years
      - On Track: ${retirementResult.onTrack ? 'Yes' : 'No'}
      
      Generated on: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'retirement-plan-report.txt';
    a.click();
    URL.revokeObjectURL(url);
    
    setShowExportDialog(false);
    toast({
      title: "Report Exported",
      description: "Your retirement plan report has been downloaded.",
    });
  };

  const generateCSVReport = () => {
    if (!retirementResult) return;

    const csvContent = [
      ['Metric', 'Value'],
      ['Current Age', currentAge],
      ['Retirement Age', retirementAge],
      ['Life Expectancy', lifeExpectancy],
      ['Current Savings', currentSavings],
      ['Monthly Contribution', monthlyContribution],
      ['Expected Return %', expectedReturn[0]],
      ['Total at Retirement', retirementResult.totalSavingsAtRetirement],
      ['Years to Retirement', retirementResult.yearsToRetirement],
      ['Surplus/Shortfall', retirementResult.surplusOrShortfall],
      ['Years Will Last', retirementResult.yearsWillLast],
      ['On Track', retirementResult.onTrack ? 'Yes' : 'No']
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'retirement-plan-data.csv';
    a.click();
    URL.revokeObjectURL(url);
    
    setShowExportDialog(false);
    toast({
      title: "Data Exported",
      description: "Your retirement plan data has been downloaded as CSV.",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

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
      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calculator" className="gap-2">
            <Calculator className="h-4 w-4" />
            Retirement Calculator
          </TabsTrigger>
          <TabsTrigger value="saved-plans" className="gap-2">
            <FolderOpen className="h-4 w-4" />
            Saved Plans
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <RetirementInputForm
                currentAge={currentAge}
                setCurrentAge={setCurrentAge}
                retirementAge={retirementAge}
                setRetirementAge={setRetirementAge}
                lifeExpectancy={lifeExpectancy}
                setLifeExpectancy={setLifeExpectancy}
                currentSavings={currentSavings}
                setCurrentSavings={setCurrentSavings}
                monthlyContribution={monthlyContribution}
                setMonthlyContribution={setMonthlyContribution}
                expectedReturn={expectedReturn}
                setExpectedReturn={setExpectedReturn}
                retirementSpending={retirementSpending}
                setRetirementSpending={setRetirementSpending}
                inflationRate={inflationRate}
                setInflationRate={setInflationRate}
                otherIncome={otherIncome}
                setOtherIncome={setOtherIncome}
                onCalculate={calculateRetirement}
              />

              {/* Action Buttons */}
              {retirementResult && (
                <div className="flex gap-2">
                  <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="lg">
                        <Save className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Save Retirement Plan</DialogTitle>
                        <DialogDescription>
                          Save this plan analysis for future reference
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Plan Name</Label>
                          <Input
                            placeholder="e.g., Conservative Retirement Plan"
                            value={planName}
                            onChange={(e) => setPlanName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Notes (Optional)</Label>
                          <Textarea
                            placeholder="Add any notes about this plan..."
                            value={planNotes || currentNotes}
                            onChange={(e) => setPlanNotes(e.target.value)}
                            rows={4}
                          />
                          {currentNotes && !planNotes && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Using notes from current analysis. Edit above to change.
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={savePlan} disabled={!planName.trim()} className="flex-1">
                            Save Plan
                          </Button>
                          <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
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
                        <DialogTitle>Load Saved Plan</DialogTitle>
                        <DialogDescription>
                          Choose a previously saved plan to load
                        </DialogDescription>
                      </DialogHeader>
                      <div className="max-h-96 overflow-y-auto">
                        {savedPlans.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            No saved plans found. Save your first plan to see it here.
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {savedPlans.map((plan) => (
                              <Card key={plan.id} className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <h4 className="font-semibold">{plan.plan_name}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      Created: {new Date(plan.created_at).toLocaleDateString()}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      Age {plan.inputs.currentAge} → {plan.inputs.retirementAge} | {formatCurrency(plan.results.totalSavingsAtRetirement)} at retirement
                                    </p>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => loadPlan(plan)}
                                    >
                                      Load
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => deletePlan(plan.id, plan.plan_name)}
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
                </div>
              )}
            </div>

            {retirementResult && <RetirementResults result={retirementResult} />}
          </div>

          {/* Current Analysis Notes */}
          {retirementResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Plan Notes
                </CardTitle>
                <CardDescription>
                  Add notes about this retirement analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={currentNotes}
                  onChange={(e) => setCurrentNotes(e.target.value)}
                  placeholder="Add your thoughts about this plan, concerns, alternative scenarios, etc..."
                  rows={4}
                  className="resize-none"
                />
              </CardContent>
            </Card>
          )}

          {retirementResult && (
            <RetirementVisualization
              currentAge={currentAge}
              retirementAge={retirementAge}
              lifeExpectancy={lifeExpectancy}
              currentSavings={currentSavings}
              monthlyContribution={monthlyContribution}
              expectedReturn={expectedReturn}
              retirementSpending={retirementSpending}
              inflationRate={inflationRate}
            />
          )}
        </TabsContent>

        <TabsContent value="saved-plans" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Saved Retirement Plans
              </CardTitle>
              <CardDescription>
                View, load, and manage your saved retirement planning analyses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {savedPlans.length === 0 ? (
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Saved Plans</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't saved any retirement plans yet. Create a plan analysis and save it to see it here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedPlans.map((plan) => (
                    <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{plan.plan_name}</CardTitle>
                        <CardDescription>
                          Created {new Date(plan.created_at).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Plan Summary Metrics */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Current Age:</span>
                            <span className="font-medium">{plan.inputs.currentAge}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Retirement Age:</span>
                            <span className="font-medium">{plan.inputs.retirementAge}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Total at Retirement:</span>
                            <span className="font-medium">{formatCurrency(plan.results.totalSavingsAtRetirement)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Surplus/Shortfall:</span>
                            <span className={`font-medium ${plan.results.surplusOrShortfall >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatCurrency(plan.results.surplusOrShortfall)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">On Track:</span>
                            <span className={`font-medium ${plan.results.onTrack ? 'text-green-600' : 'text-red-600'}`}>
                              {plan.results.onTrack ? 'Yes' : 'No'}
                            </span>
                          </div>
                        </div>

                        {/* Plan Quality Badge */}
                        <div className="flex justify-center">
                          <Badge 
                            variant={
                              plan.results.onTrack && plan.results.surplusOrShortfall > 50000
                                ? "default" 
                                : plan.results.onTrack
                                ? "secondary" 
                                : "destructive"
                            }
                          >
                            {plan.results.onTrack && plan.results.surplusOrShortfall > 50000
                              ? "Excellent Plan" 
                              : plan.results.onTrack
                              ? "Good Plan" 
                              : "Needs Adjustment"
                            }
                          </Badge>
                        </div>

                        {/* Notes */}
                        {plan.notes && (
                          <div className="pt-2 border-t">
                            <p className="text-xs text-muted-foreground">Notes:</p>
                            <p className="text-sm mt-1 line-clamp-2">{plan.notes}</p>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => loadPlan(plan)}
                          >
                            Load Plan
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => editPlanNotes(plan)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deletePlan(plan.id, plan.plan_name)}
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
            <DialogTitle>Edit Plan Notes</DialogTitle>
            <DialogDescription>
              Update notes for "{editingPlan?.plan_name}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Add your thoughts, concerns, alternative scenarios for this plan..."
                rows={6}
                className="resize-none"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={updatePlanNotes} className="flex-1">
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
            <DialogTitle>Export Retirement Plan</DialogTitle>
            <DialogDescription>
              Choose how you'd like to export your retirement analysis
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

export default RetirementPlanning;