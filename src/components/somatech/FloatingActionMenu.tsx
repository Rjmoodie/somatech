import { useState, useEffect } from "react";
import { Plus, TrendingUp, Calculator, PieChart, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingActionMenuProps {
  onModuleSelect: (module: string) => void;
}

const FloatingActionMenu = ({ onModuleSelect }: FloatingActionMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const quickActions = [
    { icon: TrendingUp, label: "Stock Analysis", module: "stock-analysis", color: "from-green-500 to-emerald-600" },
    { icon: Calculator, label: "Cash Flow", module: "cash-flow", color: "from-blue-500 to-cyan-600" },
    { icon: PieChart, label: "Business Valuation", module: "business-valuation", color: "from-purple-500 to-violet-600" },
    { icon: Building2, label: "Real Estate", module: "real-estate", color: "from-orange-500 to-red-600" },
  ];

  const handleActionClick = (module: string) => {
    onModuleSelect(module);
    setIsOpen(false);
    
    // Ensure proper scroll behavior
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('.floating-action-menu')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="fixed bottom-8 right-8 z-50 floating-action-menu">
      {/* Quick Action Buttons */}
      <div className={`flex flex-col-reverse space-y-reverse space-y-3 mb-4 transition-all duration-300 ${
        isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}>
        {quickActions.map((action, index) => (
          <Button
            key={action.module}
            onClick={() => handleActionClick(action.module)}
            className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 bg-gradient-to-r ${action.color} border-0 animate-bounce-subtle touch-manipulation`}
            style={{ animationDelay: `${index * 100}ms` }}
            title={action.label}
            aria-label={action.label}
          >
            <action.icon className="h-6 w-6 text-white" />
          </Button>
        ))}
      </div>

      {/* Main FAB */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 transition-all duration-300 hover:scale-110 active:scale-95 touch-manipulation ${
          isOpen ? "rotate-45" : "rotate-0"
        }`}
        aria-label={isOpen ? "Close quick actions" : "Open quick actions"}
      >
        <Plus className="h-8 w-8 text-white transition-transform duration-300" />
      </Button>
    </div>
  );
};

export default FloatingActionMenu;