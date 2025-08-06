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
import { modules } from "./constants";
import SEO from "../SEO";

const module = modules.find(m => m.id === "real-estate");

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

  // JSON-LD structured data for the real estate calculator
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": module?.name,
    "description": module?.seo?.description,
    "applicationCategory": "RealEstateApplication",
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
      <div className="space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto p-1">
            <TabsTrigger value="traditional" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 py-2">
              <Calculator className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Traditional Analysis</span>
              <span className="sm:hidden">Traditional</span>
            </TabsTrigger>
            <TabsTrigger value="brrrr" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 py-2">
              <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">BRRRR Calculator</span>
              <span className="sm:hidden">BRRRR</span>
            </TabsTrigger>
            <TabsTrigger value="saved-deals" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 py-2">
              <FolderOpen className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Saved Deals</span>
              <span className="sm:hidden">Saved</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="traditional" className="space-y-4 sm:space-y-6 mt-4">
            <PropertyMap />
            <TraditionalCalculator />
          </TabsContent>

          <TabsContent value="brrrr" className="space-y-4 sm:space-y-6 mt-4">
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
    </>
  );
};

export default RealEstateCalculatorContainer;