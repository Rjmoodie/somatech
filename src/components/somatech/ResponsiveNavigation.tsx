import React, { useState } from 'react';
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

  const handleModuleSelect = (moduleId: string) => {
    onModuleChange(moduleId);
    setIsOpen(false);
  };

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden p-2"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        
        <SheetContent side="left" className="w-80 p-0">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">ST</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-display font-bold text-gray-900 dark:text-white">SomaTech</h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Financial Intelligence</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
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