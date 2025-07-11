import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PieChart, User, LogOut } from "lucide-react";
import DarkModeToggle from "@/components/somatech/DarkModeToggle";
import FloatingActionMenu from "@/components/somatech/FloatingActionMenu";
import BottomNavigation from "@/components/somatech/BottomNavigation";
import OnboardingWelcome from "@/components/somatech/OnboardingWelcome";
import OfflineIndicator from "@/components/somatech/OfflineIndicator";
import ErrorBoundary from "@/components/somatech/ErrorBoundary";
import ResponsiveNavigation from "@/components/somatech/ResponsiveNavigation";
import { modules } from "@/components/somatech/constants";
import StockAnalysis from "@/components/somatech/StockAnalysis";
import WatchlistModule from "@/components/somatech/WatchlistModule";
import BusinessValuation from "@/components/somatech/BusinessValuation";
import CashFlowSimulator from "@/components/somatech/CashFlowSimulator";
import RetirementPlanning from "@/components/somatech/RetirementPlanning";
import RealEstateCalculator from "@/components/somatech/RealEstateCalculator";

import Dashboard from "@/components/somatech/Dashboard";
import Marketplace from "@/components/somatech/Marketplace";
import FundingCampaigns from "@/components/somatech/FundingCampaigns";
import CampaignProjection from "@/components/somatech/CampaignProjection";
import DonationSuccess from "@/components/somatech/funding/DonationSuccess";
import AuthDialog, { useAuth } from "@/components/somatech/AuthDialog";

// Enterprise Components
import PricingDialog from "@/components/somatech/enterprise/PricingDialog";
import SubscriptionStatus from "@/components/somatech/enterprise/SubscriptionStatus";
import OnboardingFlow from "@/components/somatech/enterprise/OnboardingFlow";
import UsageAnalytics from "@/components/somatech/enterprise/UsageAnalytics";
import AdminPanel from "@/components/somatech/enterprise/AdminPanel";
import WhiteLabelCustomizer from "@/components/somatech/enterprise/WhiteLabelCustomizer";
import AdvancedReporting from "@/components/somatech/enterprise/AdvancedReporting";
import PerformanceMonitoring from "@/components/somatech/enterprise/PerformanceMonitoring";
import CustomerSuccessDashboard from "@/components/somatech/enterprise/CustomerSuccessDashboard";
import SecurityAuditDashboard from "@/components/somatech/enterprise/SecurityAuditDashboard";
import MultiTenantArchitecture from "@/components/somatech/enterprise/MultiTenantArchitecture";

import { toast } from "@/hooks/use-toast";

const SomaTech = () => {
  const [activeModule, setActiveModule] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [globalTicker, setGlobalTicker] = useState("AAPL");
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showPricingDialog, setShowPricingDialog] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const { user, profile, loading: authLoading, signOut } = useAuth();

  // Check onboarding status
  useEffect(() => {
    if (user && !authLoading) {
      const completed = localStorage.getItem(`onboarding-completed-${user.id}`);
      setHasCompletedOnboarding(!!completed);
      if (!completed) {
        setShowOnboarding(true);
      }
    }
  }, [user, authLoading]);

  useEffect(() => {
    const moduleParam = searchParams.get('module');
    const donation = searchParams.get('donation');
    const sessionId = searchParams.get('session_id');
    
    // Set active module from URL parameter
    if (moduleParam && modules.find(m => m.id === moduleParam)) {
      setActiveModule(moduleParam);
    }
    
    if (donation === 'success' && sessionId) {
      setActiveModule("funding-campaigns");
    } else if (donation === 'cancelled') {
      toast({
        title: "Donation cancelled",
        description: "Your donation was cancelled. You can try again anytime.",
        variant: "default",
      });
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const renderPlaceholder = (title: string) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <PieChart className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            This advanced financial tool is currently being developed.
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const handleModuleChange = (module: string) => {
    setActiveModule(module);
    // Update URL with proper navigation
    setSearchParams({ module });
  };

  const handleOnboardingComplete = () => {
    if (user) {
      localStorage.setItem(`onboarding-completed-${user.id}`, 'true');
      setHasCompletedOnboarding(true);
    }
    setShowOnboarding(false);
    setActiveModule('stock-analysis'); // Start with stock analysis
  };

  const renderContent = () => {
    switch (activeModule) {
      case "dashboard":
        return <Dashboard globalTicker={globalTicker} setGlobalTicker={setGlobalTicker} setActiveModule={setActiveModule} />;
      case "stock-analysis":
        return <StockAnalysis globalTicker={globalTicker} setGlobalTicker={setGlobalTicker} />;
      case "watchlist":
        return <WatchlistModule setActiveModule={setActiveModule} />;
      case "marketplace":
        return <Marketplace />;
      case "funding-campaigns":
        const sessionId = searchParams.get('session_id');
        const donation = searchParams.get('donation');
        
        if (donation === 'success' && sessionId) {
          return <DonationSuccess />;
        }
        return <FundingCampaigns user={user} onAuthRequired={() => setShowAuthDialog(true)} />;
      case "business-valuation":
        return <BusinessValuation />;
      case "cash-flow":
        return <CashFlowSimulator />;
      case "retirement-planning":
        return <RetirementPlanning />;
      case "real-estate":
        return <RealEstateCalculator />;
      case "subscription":
        return <SubscriptionStatus onUpgradeClick={() => setShowPricingDialog(true)} />;
      case "enterprise-analytics":
        return <UsageAnalytics onUpgrade={() => setShowPricingDialog(true)} />;
      case "enterprise-admin":
        return <AdminPanel />;
      case "enterprise-whitelabel":
        return <WhiteLabelCustomizer onUpgrade={() => setShowPricingDialog(true)} />;
      case "enterprise-reporting":
        return <AdvancedReporting onUpgrade={() => setShowPricingDialog(true)} />;
      case "enterprise-performance":
        return <PerformanceMonitoring />;
      case "enterprise-success":
        return <CustomerSuccessDashboard />;
      case "enterprise-security":
        return <SecurityAuditDashboard />;
      case "enterprise-tenant":
        return <MultiTenantArchitecture onUpgrade={() => setShowPricingDialog(true)} />;
      default:
        return renderPlaceholder(modules.find(m => m.id === activeModule)?.name || "Tool");
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex overflow-hidden">
        <OfflineIndicator />
      {/* Sidebar - Hidden on mobile, shown on desktop */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-72'} transition-all duration-500 ease-apple flex-col hidden lg:flex flex-shrink-0`}>
        <div className="glass-card m-4 mb-2 p-6 rounded-2xl border-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">ST</span>
            </div>
            {!sidebarCollapsed && (
              <div className="animate-fade-in">
                <h1 className="text-xl font-display font-bold text-gray-900 dark:text-white">SomaTech</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Financial Intelligence</p>
              </div>
            )}
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {modules.map((module, index) => {
            const Icon = module.icon;
            return (
              <button
                key={module.id}
                onClick={() => handleModuleChange(module.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-300 ease-apple group ${
                  activeModule === module.id 
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02]' 
                    : 'hover:bg-white/50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:shadow-md'
                } animate-slide-in-left`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Icon className={`h-5 w-5 transition-transform duration-300 ${
                  activeModule === module.id ? 'scale-110' : 'group-hover:scale-105'
                }`} />
                {!sidebarCollapsed && (
                  <span className="font-medium text-sm">{module.name}</span>
                )}
              </button>
            );
          })}
        </nav>
        
        <div className="p-4">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full premium-card p-3 rounded-xl text-center hover-lift"
          >
            <span className="text-gray-600 dark:text-gray-400 font-medium text-sm">
              {sidebarCollapsed ? '→' : '←'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 max-w-full">
        {/* Header */}
        <header className="glass-card m-2 md:m-4 mb-2 px-4 md:px-8 py-4 md:py-6 rounded-2xl border-0 flex-shrink-0">
          <div className="flex items-center justify-between">
            <ResponsiveNavigation activeModule={activeModule} onModuleChange={handleModuleChange} />
            <div className="animate-slide-in-left">
              <h2 className="text-xl md:text-3xl font-display font-bold text-gray-900 dark:text-white mb-1">
                {modules.find(m => m.id === activeModule)?.name || "Dashboard"}
              </h2>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium hidden sm:block">
                Professional business intelligence platform
              </p>
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-4 animate-slide-in-right">
              <DarkModeToggle />
              {authLoading ? (
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-200 rounded-full animate-skeleton"></div>
                  <div className="w-16 md:w-24 h-3 md:h-4 bg-gray-200 rounded animate-skeleton hidden sm:block"></div>
                </div>
              ) : user ? (
                <div className="flex items-center space-x-2 md:space-x-4">
                  <div className="premium-card px-3 md:px-6 py-2 md:py-3 rounded-xl flex items-center space-x-2 md:space-x-3">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="h-3 w-3 md:h-4 md:w-4 text-white" />
                    </div>
                    <div className="text-xs md:text-sm hidden sm:block">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {profile?.username || user.email?.split('@')[0]}
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                        Pro Member
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={signOut}
                    className="premium-card p-2 md:p-3 rounded-xl hover-lift text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  >
                    <LogOut className="h-3 w-3 md:h-4 md:w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 md:space-x-3">
                  <button 
                    onClick={() => setShowAuthDialog(true)}
                    className="px-3 md:px-6 py-2 md:py-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-300 hidden sm:block"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => setShowAuthDialog(true)}
                    className="btn-apple text-xs md:text-sm px-3 md:px-6 py-2 md:py-3"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 px-2 md:px-4 pb-20 lg:pb-4 overflow-auto max-w-full">
          <div className="premium-card p-4 md:p-8 rounded-2xl animate-fade-in min-h-[calc(100vh-200px)] max-w-full overflow-hidden">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation activeModule={activeModule} onModuleChange={handleModuleChange} />

      {/* Floating Action Menu - Hidden on mobile */}
      <div className="hidden lg:block">
        <FloatingActionMenu onModuleSelect={handleModuleChange} />
      </div>

      {/* Dialogs */}
      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onAuthSuccess={() => setShowAuthDialog(false)}
      />
      
      <PricingDialog
        open={showPricingDialog}
        onOpenChange={setShowPricingDialog}
        onSubscriptionChange={() => {
          // Refresh subscription status if needed
        }}
      />
      
      
      <OnboardingWelcome
        open={showOnboarding && !!user && !authLoading}
        onOpenChange={setShowOnboarding}
        onComplete={handleOnboardingComplete}
      />
      </div>
    </ErrorBoundary>
  );
};

export default SomaTech;