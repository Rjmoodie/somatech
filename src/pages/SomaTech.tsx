import React, { useState, useEffect, lazy } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
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
import GroupedNavigation from "@/components/somatech/GroupedNavigation";
import ModuleWrapper from "@/components/somatech/ModuleWrapper";
import { useAuth } from "@/components/somatech/AuthProvider";
import { useError } from "@/components/somatech/ErrorProvider";
import { usePerformance } from "@/components/somatech/PerformanceProvider";
import UserFeedbackSystem from "@/components/somatech/UserFeedbackSystem";
import NetworkStatus from "@/components/somatech/NetworkStatus";
import ProgressiveOnboarding from "@/components/somatech/ProgressiveOnboarding";
import { ProfileDropdown } from "@/components/somatech/ProfileDropdown";
import NotificationBell from "@/components/somatech/NotificationBell";
import Footer from "@/components/somatech/Footer";
import Trades from "@/components/somatech/Trades";

// Lazy load modules for better performance
const Dashboard = lazy(() => import("@/components/somatech/Dashboard"));
const StockAnalysis = lazy(() => import("@/components/somatech/StockAnalysis"));
const PDUFAPage = lazy(() => import("@/pages/PDUFAPage"));
const EarningsPage = lazy(() => import("@/pages/EarningsPage"));
const WatchlistModule = lazy(() => import("@/components/somatech/WatchlistModule"));
const BusinessValuation = lazy(() => import("@/components/somatech/BusinessValuation"));
const CashFlowSimulator = lazy(() => import("@/components/somatech/CashFlowSimulator"));
const RetirementPlanning = lazy(() => import("@/components/somatech/RetirementPlanning"));
const Marketplace = lazy(() => import("@/components/somatech/Marketplace"));
const FundingCampaigns = lazy(() => import("@/components/somatech/FundingCampaigns"));
const DonationSuccess = lazy(() => import("@/components/somatech/funding/DonationSuccess"));
const AuthDialog = lazy(() => import("@/components/somatech/AuthDialog"));
const PrivacyPolicy = lazy(() => import("@/components/somatech/PrivacyPolicy"));
const TermsOfService = lazy(() => import("@/components/somatech/TermsOfService"));
const AccountSettings = lazy(() => import("@/components/somatech/AccountSettings"));
const UserDashboard = lazy(() => import("@/components/somatech/UserDashboard"));
const OnboardingModal = lazy(() => import("@/components/somatech/OnboardingModal"));
const NotificationCenter = lazy(() => import("@/components/somatech/NotificationCenter"));
const FeedbackHub = lazy(() => import("@/components/somatech/FeedbackHub"));
const PWAManager = lazy(() => import("@/components/somatech/PWAManager"));

// Enterprise Components
const PricingDialog = lazy(() => import("@/components/somatech/enterprise/PricingDialog"));
const SubscriptionStatus = lazy(() => import("@/components/somatech/enterprise/SubscriptionStatus"));
const OnboardingFlow = lazy(() => import("@/components/somatech/enterprise/OnboardingFlow"));
const UsageAnalytics = lazy(() => import("@/components/somatech/enterprise/UsageAnalytics"));
const AdminPanel = lazy(() => import("@/components/somatech/enterprise/AdminPanel"));
const WhiteLabelCustomizer = lazy(() => import("@/components/somatech/enterprise/WhiteLabelCustomizer"));
const AdvancedReporting = lazy(() => import("@/components/somatech/enterprise/AdvancedReporting"));
const PerformanceMonitoring = lazy(() => import("@/components/somatech/enterprise/PerformanceMonitoring"));
const CustomerSuccessDashboard = lazy(() => import("@/components/somatech/enterprise/CustomerSuccessDashboard"));
const SecurityAuditDashboard = lazy(() => import("@/components/somatech/enterprise/SecurityAuditDashboard"));
const MultiTenantArchitecture = lazy(() => import("@/components/somatech/enterprise/MultiTenantArchitecture"));

import { toast } from "@/hooks/use-toast";
import InvestorGuide from "@/components/somatech/investor-guide/InvestorGuide";
const LeadGenDashboard = lazy(() => import("@/components/modules/lead-gen/LeadGenDashboard"));


const ExpandedDataSourcesDashboard = lazy(() => import("@/components/somatech/real-estate/scrapers/ExpandedDataSourcesDashboard"));

const SomaTech = () => {
  const [activeModule, setActiveModule] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [globalTicker, setGlobalTicker] = useState("AAPL");
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showPricingDialog, setShowPricingDialog] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [showProgressiveOnboarding, setShowProgressiveOnboarding] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const { reportError } = useError();
  const { trackPerformance, debounce } = usePerformance();

  // Check onboarding status
  useEffect(() => {
    if (user && !authLoading) {
      const completed = localStorage.getItem(`onboarding-completed-${user.id}`);
      setHasCompletedOnboarding(!!completed);
      if (!completed) {
        // Show progressive onboarding for better UX
        setShowProgressiveOnboarding(true);
      }
    }
  }, [user, authLoading]);

  // Handle URL parameters and module state
  useEffect(() => {
    const moduleParam = searchParams.get('module');
    const donation = searchParams.get('donation');
    const sessionId = searchParams.get('session_id');
    
    // Set active module from URL parameter
    if (moduleParam && (modules.find(m => m.id === moduleParam) || moduleParam === 'privacy-policy' || moduleParam === 'terms-of-service')) {
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

  // Handle browser back/forward button
  useEffect(() => {
    const handlePopState = () => {
      const moduleParam = new URLSearchParams(window.location.search).get('module');
      if (moduleParam && modules.find(m => m.id === moduleParam)) {
        setActiveModule(moduleParam);
      } else if (!moduleParam) {
        setActiveModule('dashboard');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Save module state to sessionStorage for persistence
  useEffect(() => {
    sessionStorage.setItem('somatech-active-module', activeModule);
  }, [activeModule]);

  // Restore module state on page load
  useEffect(() => {
    const savedModule = sessionStorage.getItem('somatech-active-module');
    if (savedModule && !searchParams.get('module')) {
      setActiveModule(savedModule);
    }
  }, []);

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

  const handleModuleChange = debounce((module: string) => {
    try {
      trackPerformance('moduleChange', () => {
        setActiveModule(module);
        
        // Update URL with module parameter
        const newSearchParams = new URLSearchParams(searchParams);
        if (module === 'dashboard') {
          newSearchParams.delete('module');
        } else {
          newSearchParams.set('module', module);
        }
        
        // Preserve other parameters
        const donation = searchParams.get('donation');
        const sessionId = searchParams.get('session_id');
        if (donation) newSearchParams.set('donation', donation);
        if (sessionId) newSearchParams.set('session_id', sessionId);
        
        setSearchParams(newSearchParams);
        
        // Ensure proper scroll behavior
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      });
    } catch (error) {
      reportError(error as Error, 'module-change');
    }
  }, 150);

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
        return <Dashboard />;
      case "investor-guide":
        return <InvestorGuide />;
      case "stock-analysis":
        return <StockAnalysis />;
      case "pdufa":
        return <PDUFAPage />;
      case "earnings":
        return <EarningsPage />;
      case "trades":
        return <Trades />;
      case "watchlist":
        return <WatchlistModule />;
      case "business-valuation":
        return <BusinessValuation />;
      case "cash-flow":
        return <CashFlowSimulator />;
      case "retirement-planning":
        return <RetirementPlanning />;
              case "lead-gen":
          return <LeadGenDashboard />;


        case "expanded-data-sources":
          return <ExpandedDataSourcesDashboard />;
      case "account":
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">Account Settings</h2>
              <p className="text-gray-600 dark:text-gray-400">Account management coming soon...</p>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">Settings</h2>
              <p className="text-gray-600 dark:text-gray-400">Application settings coming soon...</p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex overflow-x-hidden box-border">
        <OfflineIndicator />
        {/* Sidebar - Hidden on mobile, shown on desktop */}
        <div className={`${sidebarCollapsed ? 'w-16' : 'w-72'} transition-all duration-500 ease-apple flex-col hidden lg:flex flex-shrink-0 max-w-[300px]`}>
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
        
        <div className="flex-1 px-4 overflow-y-auto">
          <GroupedNavigation
            activeModule={activeModule}
            onModuleChange={handleModuleChange}
            variant="desktop"
          />
        </div>
        
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
        <div className="flex-1 flex flex-col min-w-0 w-full overflow-x-hidden">
          {/* Header */}
          <header className="glass-card m-2 md:m-4 mb-2 px-2 sm:px-4 md:px-8 py-3 md:py-6 rounded-2xl border-0 flex-shrink-0">
            <div className="flex items-center justify-between gap-2 w-full">
              <div className="flex items-center gap-2 min-w-0">
                <ResponsiveNavigation activeModule={activeModule} onModuleChange={handleModuleChange} />
                <div className="animate-slide-in-left min-w-0 flex-1">
                  <h2 className="text-lg sm:text-xl md:text-3xl font-display font-bold text-gray-900 dark:text-white mb-1 truncate">
                    {activeModule === 'privacy-policy' ? 'Privacy Policy' : (modules.find(m => m.id === activeModule)?.name || "Dashboard")}
                  </h2>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium hidden sm:block truncate">
                    Professional business intelligence platform
                  </p>
                </div>
              </div>
            
              <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 animate-slide-in-right flex-shrink-0">
                <DarkModeToggle />
                {authLoading ? (
                  <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-200 rounded-full animate-skeleton"></div>
                    <div className="w-12 sm:w-16 md:w-24 h-3 md:h-4 bg-gray-200 rounded animate-skeleton hidden sm:block"></div>
                  </div>
                ) : user ? (
                  <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
                    <NotificationBell />
                    <ProfileDropdown 
                      username={profile?.username || user.email?.split('@')[0] || 'User'}
                      userEmail={user.email || ''}
                    />
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
                    <button 
                      onClick={() => setShowAuthDialog(true)}
                      className="px-2 sm:px-3 md:px-6 py-2 md:py-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-300 hidden sm:block"
                    >
                      Sign In
                    </button>
                    <button 
                      onClick={() => setShowAuthDialog(true)}
                      className="btn-apple text-xs md:text-sm px-2 sm:px-3 md:px-6 py-2 md:py-3 whitespace-nowrap"
                    >
                      Get Started
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 px-2 sm:px-3 md:px-4 pb-20 lg:pb-4 overflow-auto w-full box-border">
            <div className="premium-card p-3 sm:p-4 md:p-8 rounded-2xl animate-fade-in min-h-[calc(100vh-200px)] w-full overflow-x-auto">
              <div className="w-full min-w-0">
                {renderContent()}
                <Footer 
                  onPrivacyClick={() => handleModuleChange('privacy-policy')} 
                  onTermsClick={() => handleModuleChange('terms-of-service')} 
                />
              </div>
            </div>
          </main>
        </div>

        {/* Floating Action Menu - Desktop only */}
        <div className="hidden lg:block">
          <FloatingActionMenu onModuleSelect={handleModuleChange} />
        </div>

        {/* Bottom Navigation - Mobile only */}
        <div className="lg:hidden">
          <BottomNavigation 
            activeModule={activeModule} 
            onModuleChange={handleModuleChange} 
          />
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

        {/* Progressive Onboarding */}
        {showProgressiveOnboarding && user && !hasCompletedOnboarding && (
          <ProgressiveOnboarding
            onStepComplete={() => {
              setShowProgressiveOnboarding(false);
              if (user) {
                localStorage.setItem(`onboarding-completed-${user.id}`, 'true');
                setHasCompletedOnboarding(true);
              }
            }}
            onSkip={() => setShowProgressiveOnboarding(false)}
          />
        )}

        {/* Network Status */}
        <NetworkStatus />
      </div>
    </ErrorBoundary>
  );

};

export default SomaTech;