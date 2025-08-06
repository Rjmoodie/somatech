import React, { useState } from "react";
import { SearchContextProvider, useSearchContext } from "./context";
import FilterSidebar from "./FilterSidebar";
import MapEngine from "./MapEngine";
import MapTest from "./MapTest";
import SimpleMapTest from "./SimpleMapTest";
import PropertyResultsList from "./PropertyResultsList";
import PropertyDetailView from "./PropertyDetailView";
import ExportCSVButton from "./ExportCSVButton";
import SearchBar from "./SearchBar";
import { SaveSearchFeature } from "./SaveSearchFeature";
import { SavedDealsButton } from "./SavedDealsButton";
import NotificationBell from "@/components/somatech/NotificationBell";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, AlertCircle, Filter, Map, List, Download, Settings, HelpCircle, Calculator, TrendingUp, CheckCircle, X, Mail, Globe, RefreshCw } from "lucide-react";
import { hasValidMapboxToken } from "@/config/environment";
import { leadGenerationService, LeadGenerationFilters } from "@/services/lead-generation-service";

// Import Real Estate Calculator Components
import { TraditionalCalculator } from "../real-estate/TraditionalCalculator";
import { BRRRRCalculator } from "../real-estate/BRRRRCalculator";
import { BRRRRInputs, BRRRRResults, calculateBRRRR } from "../real-estate/brrrrCalculations";
import { RealEstateResult } from "../types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CampaignBuilder } from './CampaignBuilder';

// Separate component that uses the context
const SearchPageContent = () => {
  // Check if Mapbox token is available using the environment configuration
  const hasMapboxToken = hasValidMapboxToken();
  const { state, dispatch } = useSearchContext();

  // Real Estate Calculator State
  const [activeCalculatorTab, setActiveCalculatorTab] = React.useState("traditional");
  const [brrrrInputs, setBrrrrInputs] = React.useState<BRRRRInputs>({
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
  const [brrrrResults, setBrrrrResults] = React.useState<BRRRRResults | null>(null);
  const [traditionalResults, setTraditionalResults] = React.useState<RealEstateResult | null>(null);
  const [dataImported, setDataImported] = React.useState(false);
  const [importedProperty, setImportedProperty] = React.useState<any>(null);
  const [showTip, setShowTip] = React.useState(true);
  const [showCampaignBuilder, setShowCampaignBuilder] = useState(false);

  // CSV Export utility functions
  const generateCSV = (properties: any[]) => {
    const headers = ['Address', 'City', 'State', 'ZIP', 'Owner Name', 'Owner Type', 'Bedrooms', 'Bathrooms', 'Assessed Value', 'Estimated Value', 'Equity %', 'Status'];
    const rows = properties.map(prop => [
      prop.address,
      prop.city,
      prop.state,
      prop.zip,
      prop.owner_name,
      prop.owner_type,
      prop.bedrooms,
      prop.bathrooms,
      prop.assessed_value,
      prop.estimated_value,
      prop.equity_percent,
      prop.status
    ]);
    
    return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Real Estate Calculator Functions
  const handleBRRRRInputChange = (field: keyof BRRRRInputs, value: number) => {
    setBrrrrInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleBRRRRCalculate = () => {
    const results = calculateBRRRR(brrrrInputs);
    setBrrrrResults(results);
  };

  const handleTraditionalResult = (result: RealEstateResult) => {
    setTraditionalResults(result);
  };

  // Lead Generation Service Integration
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchStats, setSearchStats] = useState<any>(null);

  const performAdvancedSearch = async (searchTerm: string) => {
    setIsSearching(true);
    try {
      // Convert search term to filters
      const filters: LeadGenerationFilters = {};
      
      // Parse search term for location
      if (searchTerm.includes('County')) {
        filters.county = searchTerm;
      } else if (searchTerm.includes(',')) {
        const [city, state] = searchTerm.split(',').map(s => s.trim());
        filters.city = city;
        filters.state = state;
      } else {
        // Try to match as city, state, or zip
        if (/^\d{5}$/.test(searchTerm)) {
          filters.zipCode = searchTerm;
        } else {
          filters.city = searchTerm;
        }
      }

      // Add common property filters
      filters.status = ['tax-delinquent', 'pre-foreclosure', 'code-violation'];
      filters.equityRange = { min: 50, max: 100 };

      const results = await leadGenerationService.searchProperties(filters);
      setSearchResults(results.properties);
      setSearchStats(results);
      
      // Update the search context with results
      dispatch({ 
        type: 'SET_PROPERTIES', 
        payload: results.properties.map(prop => ({
          id: prop.id,
          address: prop.address,
          city: prop.city,
          state: prop.state,
          zip: prop.zip,
          latitude: prop.latitude,
          longitude: prop.longitude,
          owner_name: prop.owner_name,
          owner_type: prop.owner_type,
          property_type: prop.property_type,
          bedrooms: prop.bedrooms,
          bathrooms: prop.bathrooms,
          square_feet: prop.square_feet,
          lot_size: prop.lot_size,
          year_built: prop.year_built,
          assessed_value: prop.assessed_value,
          estimated_value: prop.estimated_value,
          equity_percent: prop.equity_percent,
          mortgage_status: prop.mortgage_status,
          lien_status: prop.lien_status,
          tags: prop.tags || [],
          status: prop.status,
          last_updated: prop.last_updated
        }))
      });

    } catch (error) {
      console.error('Search failed:', error);
      // Fall back to mock data if service fails
    } finally {
      setIsSearching(false);
    }
  };

  // Enhanced search handler
  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    // Update the context for existing functionality
    dispatch({ type: 'SET_SEARCH_TERM', payload: searchTerm });
  };

  // Listen for search term changes and trigger enhanced search
  React.useEffect(() => {
    if (state.searchTerm && state.searchTerm.trim()) {
      // Search term updated, will be handled by context
    }
  }, [state.searchTerm]);

  // Function to populate calculator with selected property data
  const populateCalculatorFromProperty = (property: any) => {
    if (property) {
      setBrrrrInputs(prev => ({
        ...prev,
        purchasePrice: property.assessed_value || property.estimated_value || 100000,
        arv: property.estimated_value || property.assessed_value * 1.2 || 150000,
        monthlyRent: Math.round((property.estimated_value || 150000) * 0.01) || 1200, // 1% rule estimate
      }));
      setDataImported(true);
      setImportedProperty(property);
    }
  };

  // Handle calculator population from property detail view
  React.useEffect(() => {
    const handlePopulateCalculator = (event: CustomEvent) => {
      const property = event.detail;
      if (property) {
        populateCalculatorFromProperty(property);
        // Switch to BRRRR tab for better analysis
        setActiveCalculatorTab("brrrr");
      }
    };

    // Listen for custom event from PropertyDetailView
    window.addEventListener('populate-calculator', handlePopulateCalculator as EventListener);
    
    return () => {
      window.removeEventListener('populate-calculator', handlePopulateCalculator as EventListener);
    };
  }, []);

  // Clear import indicator after 5 seconds
  React.useEffect(() => {
    if (dataImported) {
      const timer = setTimeout(() => {
        setDataImported(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [dataImported]);

  // Auto-hide tip after 8 seconds
  React.useEffect(() => {
    if (showTip) {
      const timer = setTimeout(() => {
        setShowTip(false);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [showTip]);

  // Handle loading saved deals
  const handleLoadSavedDeal = (deal: any) => {
    setBrrrrInputs(prev => ({
      ...prev,
      purchasePrice: deal.purchasePrice,
      monthlyRent: deal.monthlyRent,
      arv: deal.arv,
    }));
    setDataImported(true);
    setImportedProperty({
      address: deal.propertyAddress,
      city: deal.propertyAddress.split(',')[1]?.trim() || '',
      state: deal.propertyAddress.split(',')[2]?.trim() || '',
      assessed_value: deal.purchasePrice,
      estimated_value: deal.arv,
      equity_percent: 0
    });
    setActiveCalculatorTab("brrrr");
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50 dark:bg-gray-900 overflow-hidden">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between w-full px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Lead Generation</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Find and analyze property opportunities</p>
              </div>
            </div>
            <Badge variant="secondary" className="ml-4">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Live
            </Badge>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <HelpCircle className="h-4 w-4" />
              Help
            </Button>
            <NotificationBell />
          </div>
        </div>
        
        {/* Mapbox Token Warning - Enhanced */}
        {!hasMapboxToken && (
          <Alert className="mx-6 mt-4 border-orange-200 bg-orange-50 dark:bg-orange-900/20">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800 dark:text-orange-200">
              <div className="flex items-center justify-between">
                <span>Mapbox token not configured. Enable full map functionality.</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="ml-4 border-orange-300 text-orange-700 hover:bg-orange-100"
                  onClick={() => window.open('https://account.mapbox.com/access-tokens/', '_blank')}
                >
                  Get Token
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        {/* Enhanced Search Bar */}
        <div className="px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <SearchBar />
        </div>
        
        {/* Main Content Area - Enhanced Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Filters - Enhanced */}
          <div className="w-80 min-w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">Filters</h2>
              </div>
                              <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => {
                    // Clear all filters by dispatching empty filters
                    dispatch({
                      type: "SET_FILTERS",
                      payload: {}
                    });
                    dispatch({
                      type: "SET_ADVANCED_FILTERS",
                      payload: undefined
                    });
                  }}
                >
                  Clear All
                </Button>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
              <FilterSidebar />
            </div>
            {/* Save Search Feature */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <SaveSearchFeature />
            </div>
          </div>
          
          {/* Center - Map and Calculator - Enhanced */}
          <div className="flex-1 min-w-0 flex flex-col">
            {/* Map Section */}
            <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Map className="h-5 w-5 text-green-600 dark:text-green-400" />
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">Property Map</h2>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  5 Properties
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => {
                    // TODO: Implement full screen map view
                    console.log('Full Screen Map - To be implemented');
                  }}
                >
                  Full Screen
                </Button>
              </div>
            </div>
            
            <div className="h-1/2 relative">
              {hasMapboxToken ? (
                <div className="h-full w-full">
                  <SimpleMapTest />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900">
                  <div className="text-center max-w-md">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MapPin className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Interactive Map
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                      Configure your Mapbox token to view properties on an interactive map with real-time filtering and property details.
                    </p>
                    <Button 
                      variant="outline"
                      onClick={() => window.open('https://account.mapbox.com/access-tokens/', '_blank')}
                      className="flex items-center gap-2"
                    >
                      <MapPin className="h-4 w-4" />
                      Get Mapbox Token
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Calculator Section */}
            <div className="h-1/2 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex flex-col" data-calculator-section>
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h2 className="font-semibold text-gray-900 dark:text-gray-100">Investment Calculator</h2>
                </div>
                              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Analysis Ready
                </Badge>
                
                {/* Import Indicator */}
                {dataImported && (
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Data Imported
                  </Badge>
                )}
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => {
                    // Populate calculator with selected property data
                    const selectedProperty = state.results.find(p => p.id === state.selectedPropertyId);
                    if (selectedProperty) {
                      populateCalculatorFromProperty(selectedProperty);
                    }
                  }}
                >
                  Use Selected Property
                </Button>
                
                <SavedDealsButton onLoadDeal={handleLoadSavedDeal} />
              </div>
              </div>
              
              {/* Import Information Display */}
              {dataImported && importedProperty && (
                <div className="px-4 pb-2">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        Property Data Imported
                      </span>
                    </div>
                    <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                      <div><strong>Address:</strong> {importedProperty.address}, {importedProperty.city}, {importedProperty.state}</div>
                      <div><strong>Assessed Value:</strong> ${importedProperty.assessed_value?.toLocaleString() || 'N/A'}</div>
                      <div><strong>Estimated Value:</strong> ${importedProperty.estimated_value?.toLocaleString() || 'N/A'}</div>
                      <div><strong>Equity:</strong> {importedProperty.equity_percent}%</div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex-1 overflow-y-auto">
                <div className="p-4">
                  <Tabs value={activeCalculatorTab} onValueChange={setActiveCalculatorTab}>
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="traditional">Traditional</TabsTrigger>
                      <TabsTrigger value="brrrr">BRRRR</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="traditional" className="space-y-4">
                      <TraditionalCalculator onResultCalculated={handleTraditionalResult} />
                    </TabsContent>
                    
                    <TabsContent value="brrrr" className="space-y-4">
                      <BRRRRCalculator
                        inputs={brrrrInputs}
                        onInputChange={handleBRRRRInputChange}
                        results={brrrrResults}
                        onResults={setBrrrrResults}
                        onSaveClick={() => console.log('Save BRRRR deal')}
                        isMobile={false}
                        dealName=""
                        dealNotes=""
                        currentDealId={null}
                        onAutoSave={async () => true}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Sidebar - Property Results - Enhanced */}
          <div className="w-96 min-w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <List className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">Properties</h2>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {state.results.length} Results
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => {
                    // Export current properties to CSV
                    const csvContent = generateCSV(state.results);
                    downloadCSV(csvContent, 'properties-export.csv');
                  }}
                >
                  <Download className="h-3 w-3 mr-1" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
                  onClick={() => setShowCampaignBuilder(true)}
                  disabled={state.results.length === 0}
                  title="Create an email campaign with these leads"
                >
                  <Mail className="h-3 w-3 mr-1" />
                  Email
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
              <PropertyResultsList />
            </div>
          </div>
        </div>
        
        {/* Scroll to Calculator Button - Keep this one as it's useful */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            size="sm"
            variant="outline"
            className="shadow-lg bg-white dark:bg-gray-800"
            onClick={() => {
              const calculatorSection = document.querySelector('[data-calculator-section]');
              if (calculatorSection) {
                calculatorSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <Calculator className="h-4 w-4 mr-2" />
            Calculator
          </Button>
        </div>
        
        {/* Quick Actions Tooltip - Temporary */}
        {showTip && (
          <div className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-bottom-2 duration-300">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  💡 <strong>Tip:</strong> Use the search bar to find properties by address, city, or ZIP code
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTip(false)}
                  className="h-4 w-4 p-0 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Campaign Builder Modal */}
        <CampaignBuilder
          isVisible={showCampaignBuilder}
          onClose={() => setShowCampaignBuilder(false)}
        />
      </div>
    );
  };

  // Main component that provides the context
  export const SearchPage = () => {
    return (
      <SearchContextProvider>
        <SearchPageContent />
      </SearchContextProvider>
    );
  };

  export default SearchPage; 