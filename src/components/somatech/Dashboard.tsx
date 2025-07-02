import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TrendingUp, Calculator, BarChart3 } from "lucide-react";
import { modules } from "./constants";

interface DashboardProps {
  globalTicker: string;
  setGlobalTicker: (ticker: string) => void;
  setActiveModule: (module: string) => void;
}

const Dashboard = ({ globalTicker, setGlobalTicker, setActiveModule }: DashboardProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {modules.slice(1).map((module) => {
          const Icon = module.icon;
          return (
            <Card key={module.id} className="cursor-pointer hover:shadow-md transition-all duration-200" onClick={() => setActiveModule(module.id)}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Icon className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">{module.name}</h3>
                    <p className="text-sm text-muted-foreground">Available</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to SomaTech</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              SomaTech provides professional-grade financial analysis tools designed for entrepreneurs, 
              investors, and business professionals.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4 mr-2" />
                Real-time stock analysis with 8-pillar scoring
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calculator className="h-4 w-4 mr-2" />
                Business valuation using multiple methodologies
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <BarChart3 className="h-4 w-4 mr-2" />
                Cash flow simulation and runway analysis
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Stock Lookup</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Input
                placeholder="TSLA"
                value={globalTicker}
                onChange={(e) => setGlobalTicker(e.target.value.toUpperCase())}
                className="flex-1"
              />
              <Button onClick={() => setActiveModule("stock-analysis")}>
                Analyze
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;