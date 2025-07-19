import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { modules } from './constants';
import { cn } from '@/lib/utils';

interface GroupedNavigationProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
  variant?: 'desktop' | 'mobile' | 'dropdown';
  className?: string;
}

const moduleGroups = {
  dashboard: {
    name: 'Dashboard',
    modules: ['dashboard']
  },
  financial: {
    name: 'Financial Tools',
    modules: [
      'stock-analysis',
      'watchlist', 
      'marketplace',
      'funding-campaigns',
      'business-valuation',
      'cash-flow',
      'retirement-planning'
    ]
  },
  realEstate: {
    name: 'Real Estate',
    modules: [
      'real-estate',
      'real-estate-deal-sourcing',
      'deal-sourcing-data-manager',
      'data-ingestion-pipeline',
      'data-scraping-engine',
      'tax-delinquent-scraper',
      'code-violation-scraper',
      'pre-foreclosure-scraper'
    ]
  },
  settings: {
    name: 'Settings & Enterprise',
    modules: [
      'subscription',
      'enterprise-analytics',
      'enterprise-admin',
      'enterprise-whitelabel',
      'enterprise-reporting',
      'enterprise-performance',
      'enterprise-success',
      'enterprise-security',
      'enterprise-tenant'
    ]
  }
};

const GroupedNavigation = ({ 
  activeModule, 
  onModuleChange, 
  variant = 'desktop',
  className 
}: GroupedNavigationProps) => {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    financial: true, // Financial tools open by default
    realEstate: true, // Real estate open by default
    settings: false
  });

  const toggleGroup = (groupKey: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  const getModuleData = (moduleId: string) => {
    return modules.find(m => m.id === moduleId);
  };

  const isModuleInGroup = (groupKey: string) => {
    return moduleGroups[groupKey as keyof typeof moduleGroups]?.modules.includes(activeModule);
  };

  // Desktop Sidebar Navigation
  if (variant === 'desktop') {
    return (
      <nav className={cn("space-y-2", className)}>
        {/* Dashboard - standalone */}
        {moduleGroups.dashboard.modules.map(moduleId => {
          const moduleData = getModuleData(moduleId);
          if (!moduleData) return null;
          
          const Icon = moduleData.icon;
          const isActive = activeModule === moduleId;
          
          return (
            <button
              key={moduleId}
              onClick={() => onModuleChange(moduleId)}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200",
                isActive 
                  ? 'bg-primary text-primary-foreground shadow-lg' 
                  : 'hover:bg-accent hover:text-accent-foreground text-muted-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium text-sm">{moduleData.name}</span>
            </button>
          );
        })}

        {/* Grouped sections */}
        {Object.entries(moduleGroups).filter(([key]) => key !== 'dashboard').map(([groupKey, group]) => (
          <Collapsible 
            key={groupKey}
            open={openGroups[groupKey]}
            onOpenChange={() => toggleGroup(groupKey)}
          >
            <CollapsibleTrigger asChild>
              <button
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-200 font-medium text-sm",
                  isModuleInGroup(groupKey)
                    ? 'bg-accent text-accent-foreground' 
                    : 'hover:bg-accent/50 text-muted-foreground'
                )}
              >
                <span>{group.name}</span>
                {openGroups[groupKey] ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="ml-4 mt-1 space-y-1">
              {group.modules.map(moduleId => {
                const moduleData = getModuleData(moduleId);
                if (!moduleData) return null;
                
                const Icon = moduleData.icon;
                const isActive = activeModule === moduleId;
                
                return (
                  <button
                    key={moduleId}
                    onClick={() => onModuleChange(moduleId)}
                    className={cn(
                      "w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-all duration-200",
                      isActive 
                        ? 'bg-primary text-primary-foreground shadow-md' 
                        : 'hover:bg-accent hover:text-accent-foreground text-muted-foreground'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm">{moduleData.name}</span>
                  </button>
                );
              })}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </nav>
    );
  }

  // Dropdown Navigation
  if (variant === 'dropdown') {
    return (
      <div className="flex items-center space-x-2">
        {/* Dashboard button */}
        <Button
          variant={activeModule === 'dashboard' ? 'default' : 'ghost'}
          onClick={() => onModuleChange('dashboard')}
          size="sm"
        >
          Dashboard
        </Button>

        {/* Financial Tools dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant={isModuleInGroup('financial') ? 'default' : 'ghost'} 
              size="sm"
              className="gap-1"
            >
              Financial Tools
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Financial Tools</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {moduleGroups.financial.modules.map(moduleId => {
              const moduleData = getModuleData(moduleId);
              if (!moduleData) return null;
              
              const Icon = moduleData.icon;
              
              return (
                <DropdownMenuItem
                  key={moduleId}
                  onClick={() => onModuleChange(moduleId)}
                  className="gap-2 cursor-pointer"
                >
                  <Icon className="h-4 w-4" />
                  {moduleData.name}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Settings dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant={isModuleInGroup('settings') ? 'default' : 'ghost'} 
              size="sm"
              className="gap-1"
            >
              Settings
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Settings & Enterprise</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {moduleGroups.settings.modules.map(moduleId => {
              const moduleData = getModuleData(moduleId);
              if (!moduleData) return null;
              
              const Icon = moduleData.icon;
              
              return (
                <DropdownMenuItem
                  key={moduleId}
                  onClick={() => onModuleChange(moduleId)}
                  className="gap-2 cursor-pointer"
                >
                  <Icon className="h-4 w-4" />
                  {moduleData.name}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // Mobile Navigation (same as desktop but more compact)
  return (
    <nav className={cn("space-y-1", className)}>
      {/* Dashboard */}
      {moduleGroups.dashboard.modules.map(moduleId => {
        const moduleData = getModuleData(moduleId);
        if (!moduleData) return null;
        
        const Icon = moduleData.icon;
        const isActive = activeModule === moduleId;
        
        return (
          <button
            key={moduleId}
            onClick={() => onModuleChange(moduleId)}
            className={cn(
              "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200",
              isActive 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-accent hover:text-accent-foreground text-muted-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="text-sm font-medium">{moduleData.name}</span>
          </button>
        );
      })}

      {/* Grouped sections */}
      {Object.entries(moduleGroups).filter(([key]) => key !== 'dashboard').map(([groupKey, group]) => (
        <Collapsible 
          key={groupKey}
          open={openGroups[groupKey]}
          onOpenChange={() => toggleGroup(groupKey)}
        >
          <CollapsibleTrigger asChild>
            <button
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all duration-200 text-sm font-medium",
                isModuleInGroup(groupKey)
                  ? 'bg-accent text-accent-foreground' 
                  : 'hover:bg-accent/50 text-muted-foreground'
              )}
            >
              <span>{group.name}</span>
              {openGroups[groupKey] ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="ml-3 mt-1 space-y-1">
            {group.modules.map(moduleId => {
              const moduleData = getModuleData(moduleId);
              if (!moduleData) return null;
              
              const Icon = moduleData.icon;
              const isActive = activeModule === moduleId;
              
              return (
                <button
                  key={moduleId}
                  onClick={() => onModuleChange(moduleId)}
                  className={cn(
                    "w-full flex items-center space-x-2 px-3 py-1.5 rounded-md text-left transition-all duration-200",
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-accent hover:text-accent-foreground text-muted-foreground'
                  )}
                >
                  <Icon className="h-3 w-3" />
                  <span className="text-xs">{moduleData.name}</span>
                </button>
              );
            })}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </nav>
  );
};

export default GroupedNavigation;