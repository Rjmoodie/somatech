import React from 'react';
import { modules } from './constants';
import * as LucideIcons from 'lucide-react';

interface BottomNavigationProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const BottomNavigation = ({ activeModule, onModuleChange }: BottomNavigationProps) => {
  // Only show featured modules in main nav groups
  const navModules = modules.filter(m => m.featured && ['dashboard', 'financial', 'realEstate'].includes(m.navGroup || ''));

  const handleModuleSelect = (moduleId: string) => {
    onModuleChange(moduleId);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 lg:hidden z-30 safe-area-inset-bottom">
      <div className="grid grid-cols-5 h-16 w-full">
        {navModules.map((module) => {
          const Icon = LucideIcons[module.icon as keyof typeof LucideIcons];
          return (
            <button
              key={module.id}
              onClick={() => handleModuleSelect(module.id)}
              className={`flex flex-col items-center justify-center space-y-1 transition-all duration-300 relative min-h-[44px] px-1 touch-manipulation ${
                activeModule === module.id 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              aria-label={module.name}
              aria-pressed={activeModule === module.id}
            >
              <span className="text-lg sm:text-xl select-none">
                {(() => {
                  if (typeof Icon === 'function' && Icon.length === 0) {
                    const LucideIcon = Icon as React.ComponentType<{ className?: string }>;
                    return <LucideIcon className="h-5 w-5" />;
                  }
                  return null;
                })()}
              </span>
              <span className="text-xs font-medium leading-tight text-center select-none">{module.name}</span>
              {activeModule === module.id && (
                <div className="absolute bottom-0 w-6 sm:w-8 h-1 bg-blue-500 rounded-full transition-all duration-300" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;