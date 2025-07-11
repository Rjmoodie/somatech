import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, RefreshCw, FolderOpen } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { RealEstateResult } from "./types";
import { BRRRRInputs, BRRRRResults, SavedDeal } from "./real-estate/brrrrCalculations";
import { useBRRRROperations } from "./real-estate/useBRRRROperations";
import PropertyMap from "./real-estate/PropertyMap";
import { TraditionalCalculator } from "./real-estate/TraditionalCalculator";
import { BRRRRCalculator } from "./real-estate/BRRRRCalculator";
import { SavedDealsManager } from "./real-estate/SavedDealsManager";
import { EnhancedSaveDialog } from "./real-estate/EnhancedSaveDialog";

const RealEstateCalculatorContainer = () => {
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
  const [dealName, setDealName] = useState("");
  const [dealNotes, setDealNotes] = useState("");
  const [currentDealId, setCurrentDealId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeTab, setActiveTab] = useState("traditional");

  // Operations hook
  const { loadSavedDeals, saveDeal, deleteDeal, updateDealNotes } = useBRRRROperations();
  const [savedDeals, setSavedDeals] = useState<SavedDeal[]>([]);

  useEffect(() => {
    const loadDeals = async () => {
      const deals = await loadSavedDeals();
      setSavedDeals(deals);
    };
    loadDeals();
    
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
    setActiveTab("brrrr");
    
    toast({
      title: "Deal Loaded",
      description: `"${deal.deal_name}" has been loaded successfully.`,
    });
  };

  const updateBrrrrInput = (field: keyof BRRRRInputs, value: number) => {
    setBrrrrInputs(prev => ({ ...prev, [field]: value }));
  };

  // Enhanced auto-save function
  const handleAutoSave = async (): Promise<boolean> => {
    if (!dealName.trim() || !brrrrResults || !currentDealId) return false;
    return await saveDeal(dealName, brrrrInputs, brrrrResults, dealNotes, currentDealId);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
          <TraditionalCalculator />
        </TabsContent>

        <TabsContent value="brrrr" className="space-y-6">
          <PropertyMap />
          <BRRRRCalculator
            inputs={brrrrInputs}
            onInputChange={updateBrrrrInput}
            results={brrrrResults}
            onResults={setBrrrrResults}
            onSaveClick={() => setShowSaveDialog(true)}
            isMobile={isMobile}
            dealName={dealName}
            dealNotes={dealNotes}
            currentDealId={currentDealId}
            onAutoSave={handleAutoSave}
          />
        </TabsContent>

        <TabsContent value="saved-deals" className="space-y-6">
          <SavedDealsManager
            savedDeals={savedDeals}
            onLoadDeal={handleLoadDeal}
            onSwitchToCalculator={() => setActiveTab("brrrr")}
          />
        </TabsContent>
      </Tabs>

      {/* Enhanced Save Dialog */}
      <EnhancedSaveDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        dealName={dealName}
        setDealName={setDealName}
        dealNotes={dealNotes}
        setDealNotes={setDealNotes}
        onSave={handleSaveDeal}
        results={brrrrResults}
        inputs={brrrrInputs}
        isUpdate={!!currentDealId}
      />
    </div>
  );
};

export default RealEstateCalculatorContainer;