import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, FolderOpen } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import RetirementInputForm from "./retirement/RetirementInputForm";
import RetirementResults from "./retirement/RetirementResults";
import RetirementVisualization from "./retirement/RetirementVisualization";
import { SavePlanDialog } from "./retirement/SavePlanDialog";
import { LoadPlanDialog } from "./retirement/LoadPlanDialog";
import { SavedPlanCard } from "./retirement/SavedPlanCard";
import { useRetirementOperations, useSavePlan, useDeletePlan, useUpdatePlanNotes } from "./retirement/retirementOperations";
import { calculateRetirement } from "./retirement/retirementUtils";
import { RetirementInputs, RetirementResults as IRetirementResults, SavedPlan } from "./retirement/retirementOperations";
import { modules } from "./constants";
import SEO from "../SEO";

const module = modules.find(m => m.id === "retirement-planning");

const RetirementPlanning = () => {
  // Form state
  const [currentAge, setCurrentAge] = useState("");
  const [retirementAge, setRetirementAge] = useState("");
  const [lifeExpectancy, setLifeExpectancy] = useState("90");
  const [currentSavings, setCurrentSavings] = useState("");
  const [monthlyContribution, setMonthlyContribution] = useState("");
  const [expectedReturn, setExpectedReturn] = useState([7]);
  const [retirementSpending, setRetirementSpending] = useState("");
  const [inflationRate, setInflationRate] = useState([2.5]);
  const [otherIncome, setOtherIncome] = useState("");
  const [retirementResult, setRetirementResult] = useState<IRetirementResults | null>(null);

  // Dialog state
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [planName, setPlanName] = useState("");
  const [planNotes, setPlanNotes] = useState("");
  const [currentNotes, setCurrentNotes] = useState("");

  // User ID (replace with your auth context if needed)
  const userId = undefined; // <-- Replace with actual user ID from auth context

  // Query and mutations
  const { data: savedPlans = [], isLoading, error } = useRetirementOperations(userId);
  const savePlanMutation = useSavePlan(userId);
  const deletePlanMutation = useDeletePlan(userId);
  const updatePlanNotesMutation = useUpdatePlanNotes(userId);

  const handleSavePlan = async () => {
    if (!retirementResult) return;
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
    savePlanMutation.mutate({ planName, inputs, results: retirementResult, notes: planNotes || currentNotes }, {
      onSuccess: () => {
        setShowSaveDialog(false);
        setPlanName("");
        setPlanNotes("");
      }
    });
  };

  const handleLoadPlan = (plan: SavedPlan) => {
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

  const handleDeletePlan = async (planId: string) => {
    deletePlanMutation.mutate(planId);
  };

  const handleEditNotes = async (plan: SavedPlan) => {
    updatePlanNotesMutation.mutate({ planId: plan.id, planName: plan.plan_name, notes: plan.notes || "" });
  };

  const handleCalculateRetirement = () => {
    if (!currentAge || !retirementAge || !currentSavings || !monthlyContribution || !retirementSpending) return;
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
    const result = calculateRetirement(inputs);
    setRetirementResult(result);
  };

  // JSON-LD structured data for the retirement planning module
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": module?.name,
    "description": module?.seo?.description,
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "All",
    "publisher": {
      "@type": "Organization",
      "name": "SomaTech"
    }
  };

  return (
    <>
      {module?.seo && (
        <SEO
          title={module.seo.title}
          description={module.seo.description}
          keywords={module.seo.keywords}
          url={typeof window !== 'undefined' ? window.location.href : undefined}
          jsonLd={jsonLd}
        />
      )}
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
                  onCalculate={handleCalculateRetirement}
                />

                {/* Action Buttons */}
                {retirementResult && (
                  <div className="flex gap-2">
                    <SavePlanDialog
                      open={showSaveDialog}
                      onOpenChange={setShowSaveDialog}
                      planName={planName}
                      setPlanName={setPlanName}
                      planNotes={planNotes}
                      setPlanNotes={setPlanNotes}
                      currentNotes={currentNotes}
                      onSave={handleSavePlan}
                    />

                    <LoadPlanDialog
                      open={showLoadDialog}
                      onOpenChange={setShowLoadDialog}
                      savedPlans={savedPlans}
                      onLoadPlan={handleLoadPlan}
                      onDeletePlan={handleDeletePlan}
                      onEditNotes={handleEditNotes}
                    />
                  </div>
                )}
              </div>

              {retirementResult && <RetirementResults result={retirementResult} />}
            </div>

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
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading saved plans...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                <p>Error loading saved plans: {error.message}</p>
              </div>
            ) : Array.isArray(savedPlans) && savedPlans.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No saved plans found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.isArray(savedPlans) && savedPlans.map((plan) => (
                  <SavedPlanCard
                    key={plan.id}
                    plan={plan}
                    onLoad={() => handleLoadPlan(plan)}
                    onDelete={() => handleDeletePlan(plan.id)}
                    onEditNotes={() => handleEditNotes(plan)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default RetirementPlanning;