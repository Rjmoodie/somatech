import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, BarChart3 } from "lucide-react";
import GroupedNavigation from "../GroupedNavigation";

interface WelcomeSectionProps {
  setActiveModule?: (module: string) => void;
}

const WelcomeSection = ({ setActiveModule }: WelcomeSectionProps) => {
  return (
    <Card className="premium-card border-0 bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-sm w-full">
      <CardContent className="p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="space-y-6 min-w-0 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <TrendingUp className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground tracking-tight">Welcome to SomaTech</h3>
                <p className="text-base sm:text-lg text-muted-foreground">Your financial intelligence command center</p>
              </div>
            </div>
            <p className="text-base sm:text-lg text-muted-foreground max-w-full lg:max-w-2xl leading-relaxed">
              Access powerful tools for stock analysis, business valuation, portfolio management, and market insights all in one platform.
            </p>
            {setActiveModule ? (
              <div className="w-full sm:w-auto">
                <GroupedNavigation
                  activeModule=""
                  onModuleChange={setActiveModule}
                  variant="dropdown"
                  className="justify-start w-full sm:w-auto"
                />
              </div>
            ) : (
              <Button className="btn-apple group w-full sm:w-auto text-base">
                <span>Explore Tools</span>
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            )}
          </div>
          <div className="hidden lg:flex items-center justify-center flex-shrink-0">
            <div className="w-28 h-28 xl:w-36 xl:h-36 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-border/20">
              <BarChart3 className="h-14 w-14 xl:h-18 xl:w-18 text-primary" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeSection;