import React from 'react';

interface BottomNavigationProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const BottomNavigation = ({ activeModule, onModuleChange }: BottomNavigationProps) => {
  const quickModules = [
    { id: 'dashboard', name: 'Home', icon: '🏠' },
    { id: 'stock-analysis', name: 'Stocks', icon: '📈' },
    { id: 'watchlist', name: 'Portfolio', icon: '💼' },
    { id: 'marketplace', name: 'Market', icon: '🏪' },
    { id: 'enterprise-analytics', name: 'Analytics', icon: '📊' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 lg:hidden z-30 safe-area-inset-bottom">
      <div className="grid grid-cols-5 h-16 w-full">
        {quickModules.map((module) => (
          <button
            key={module.id}
            onClick={() => onModuleChange(module.id)}
            className={`flex flex-col items-center justify-center space-y-1 transition-all duration-300 relative min-h-[44px] px-1 ${
              activeModule === module.id 
                ? 'text-blue-600 dark:text-blue-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            aria-label={module.name}
          >
            <span className="text-lg sm:text-xl">{module.icon}</span>
            <span className="text-xs font-medium leading-tight text-center">{module.name}</span>
            {activeModule === module.id && (
              <div className="absolute bottom-0 w-6 sm:w-8 h-1 bg-blue-500 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;