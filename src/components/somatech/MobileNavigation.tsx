import React from 'react';
import { modules } from './constants';

interface MobileNavigationProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const MobileNavigation = ({ activeModule, onModuleChange, isOpen, onClose }: MobileNavigationProps) => {
  const handleModuleSelect = (moduleId: string) => {
    onModuleChange(moduleId);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-fade-in"
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed left-0 top-0 h-full w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 z-50 md:hidden transform transition-transform duration-300 ease-apple ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">ST</span>
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-gray-900 dark:text-white">SomaTech</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Financial Intelligence</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400"
            >
              ×
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {modules.map((module, index) => {
              const Icon = module.icon;
              return (
                <button
                  key={module.id}
                  onClick={() => handleModuleSelect(module.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-4 rounded-xl text-left transition-all duration-300 animate-slide-in-left ${
                    activeModule === module.id 
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{module.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};

export default MobileNavigation;