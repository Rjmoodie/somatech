import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { modules } from './constants';
import { cn } from '@/lib/utils';
import GroupedNavigation from './GroupedNavigation';

interface ResponsiveNavigationProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const ResponsiveNavigation = ({ activeModule, onModuleChange }: ResponsiveNavigationProps) => {
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

  const handleModuleSelect = (moduleId: string) => {
    onModuleChange(moduleId);
    setIsOpen(false);
    
    // Ensure proper scroll behavior on mobile
    if (isMobile) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 300);
    }
  };

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden p-2 min-h-[44px] min-w-[44px] touch-manipulation"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        
        <SheetContent side="left" className="w-80 p-0 safe-area-inset-bottom overflow-hidden">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-border flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">ST</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1 className="text-lg sm:text-xl font-display font-bold text-gray-900 dark:text-white truncate">SomaTech</h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Financial Intelligence</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="lg:hidden p-2 min-h-[44px] min-w-[44px] touch-manipulation"
                  aria-label="Close navigation menu"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              <div className="p-3 sm:p-4">
                <GroupedNavigation
                  activeModule={activeModule}
                  onModuleChange={handleModuleSelect}
                  variant="mobile"
                />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ResponsiveNavigation;