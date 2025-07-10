import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PieChart, User, LogOut } from "lucide-react";
import { modules } from "@/components/somatech/constants";
import StockAnalysis from "@/components/somatech/StockAnalysis";
import WatchlistModule from "@/components/somatech/WatchlistModule";
import BusinessValuation from "@/components/somatech/BusinessValuation";
import CashFlowSimulator from "@/components/somatech/CashFlowSimulator";
import RetirementPlanning from "@/components/somatech/RetirementPlanning";
import RealEstateCalculator from "@/components/somatech/RealEstateCalculator";
import PerformanceTracker from "@/components/somatech/PerformanceTracker";
import Dashboard from "@/components/somatech/Dashboard";
import Marketplace from "@/components/somatech/Marketplace";
import FundingCampaigns from "@/components/somatech/FundingCampaigns";
import CampaignProjection from "@/components/somatech/CampaignProjection";
import DonationSuccess from "@/components/somatech/funding/DonationSuccess";
import AuthDialog, { useAuth } from "@/components/somatech/AuthDialog";
import { toast } from "@/hooks/use-toast";

const SomaTech = () => {
  const [activeModule, setActiveModule] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [globalTicker, setGlobalTicker] = useState("AAPL");
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const { user, profile, loading: authLoading, signOut } = useAuth();

  useEffect(() => {
    const donation = searchParams.get('donation');
    const sessionId = searchParams.get('session_id');
    
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
      case "performance-tracker":
        return <PerformanceTracker />;
      default:
        return renderPlaceholder(modules.find(m => m.id === activeModule)?.name || "Tool");
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-card border-r transition-all duration-300 flex flex-col`}>
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">ST</span>
            </div>
            {!sidebarCollapsed && (
              <h1 className="text-xl font-bold">SomaTech</h1>
            )}
          </div>
        </div>
        
        <nav className="flex-1 px-2">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 mb-1 rounded-lg text-left transition-colors ${
                  activeModule === module.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted'
                }`}
              >
                <Icon className="h-5 w-5" />
                {!sidebarCollapsed && <span>{module.name}</span>}
              </button>
            );
          })}
        </nav>
        
        <div className="p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full"
          >
            {sidebarCollapsed ? '→' : '←'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-card border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {modules.find(m => m.id === activeModule)?.name || "Dashboard"}
              </h2>
              <p className="text-muted-foreground">
                Professional business intelligence tools
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {authLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-muted rounded-full animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">Loading...</span>
                </div>
              ) : user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                     <div className="text-sm">
                       <div className="font-medium">{profile?.username || user.email}</div>
                       <Badge variant="secondary" className="text-xs">
                         Pro User
                       </Badge>
                     </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={signOut}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAuthDialog(true)}
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => setShowAuthDialog(true)}
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>

      {/* Auth Dialog */}
      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onAuthSuccess={() => setShowAuthDialog(false)}
      />
    </div>
  );
};

export default SomaTech;