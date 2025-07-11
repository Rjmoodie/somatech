import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, BarChart3 } from "lucide-react";
import GroupedNavigation from "../GroupedNavigation";

interface WelcomeSectionProps {
  setActiveModule?: (module: string) => void;
}

const WelcomeSection = ({ setActiveModule }: WelcomeSectionProps) => {
  return (
    <Card className="premium-card border-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 w-full">
      <CardContent className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-4 min-w-0 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Welcome to SomaTech</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Your financial intelligence command center</p>
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 max-w-full lg:max-w-lg">
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
              <Button className="btn-apple group w-full sm:w-auto">
                <span>Explore Tools</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            )}
          </div>
          <div className="hidden lg:flex items-center justify-center flex-shrink-0">
            <div className="w-24 h-24 xl:w-32 xl:h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center">
              <BarChart3 className="h-12 w-12 xl:h-16 xl:w-16 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeSection;