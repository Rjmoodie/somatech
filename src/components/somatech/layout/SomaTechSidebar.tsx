import React from 'react';
import GroupedNavigation from '@/components/somatech/GroupedNavigation';

interface SomaTechSidebarProps {
  activeModule: string;
  sidebarCollapsed: boolean;
  onModuleChange: (module: string) => void;
  onSidebarToggle: () => void;
}

const SomaTechSidebar: React.FC<SomaTechSidebarProps> = ({
  activeModule,
  sidebarCollapsed,
  onModuleChange,
  onSidebarToggle
}) => {
  return (
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
          onModuleChange={onModuleChange}
          variant="desktop"
        />
      </div>
      
      <div className="p-4">
        <button
          onClick={onSidebarToggle}
          className="w-full premium-card p-3 rounded-xl text-center hover-lift"
        >
          <span className="text-gray-600 dark:text-gray-400 font-medium text-sm">
            {sidebarCollapsed ? '→' : '←'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default SomaTechSidebar; 