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
import * as Icons from 'lucide-react';

interface GroupedNavigationProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
  variant?: 'desktop' | 'mobile' | 'dropdown';
  className?: string;
}

// Define the order and labels for nav groups
const navGroupOrder: { key: string; name: string }[] = [
  { key: 'dashboard', name: 'Dashboard' },
  { key: 'financial', name: 'Financial Tools' },
  { key: 'realEstate', name: 'Real Estate' },
  { key: 'settings', name: 'Settings & Enterprise' },
  { key: 'account', name: 'Account' },
  { key: 'enterprise', name: 'Enterprise' },
];

// Group modules by navGroup
const groupModules = () => {
  const groups: Record<string, typeof modules> = {};
  for (const m of modules) {
    if (!m.navGroup) continue;
    if (!groups[m.navGroup]) groups[m.navGroup] = [];
    groups[m.navGroup].push(m);
  }
  return groups;
};

const GroupedNavigation = ({
  activeModule,
  onModuleChange,
  variant = 'desktop',
  className
}: GroupedNavigationProps) => {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    financial: true,
    realEstate: true,
    settings: false,
    account: false,
    enterprise: false,
  });

  const toggleGroup = (groupKey: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  const groups = groupModules();

  // Dynamic icon component
  const DynamicIcon = ({ iconName, className }: { iconName: string; className?: string }) => {
    const IconComponent = Icons[iconName as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
    return IconComponent ? <IconComponent className={className} /> : null;
  };

  // Desktop Sidebar Navigation
  if (variant === 'desktop') {
    return (
      <nav className={cn('space-y-2', className)}>
        {navGroupOrder.map(({ key, name }) => {
          const group = groups[key];
          if (!group || group.length === 0) return null;
          // Dashboard is standalone, not collapsible
          if (key === 'dashboard') {
            return group.map(module => {
              const isActive = activeModule === module.id;
              return (
                <button
                  key={module.id}
                  onClick={() => onModuleChange(module.id)}
                  className={cn(
                    'w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'hover:bg-accent hover:text-accent-foreground text-muted-foreground'
                  )}
                >
                  <DynamicIcon iconName={module.icon} className="h-5 w-5" />
                  <span className="font-medium text-sm">{module.name}</span>
                </button>
              );
            });
          }
          // Collapsible groups
          return (
            <Collapsible
              key={key}
              open={openGroups[key]}
              onOpenChange={() => toggleGroup(key)}
            >
              <CollapsibleTrigger asChild>
                <button
                  className={cn(
                    'w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-200 font-medium text-sm',
                    openGroups[key]
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-accent/50 text-muted-foreground'
                  )}
                >
                  <span>{name}</span>
                  {openGroups[key] ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="ml-4 mt-1 space-y-1">
                {group.map(module => {
                  const isActive = activeModule === module.id;
                  return (
                    <button
                      key={module.id}
                      onClick={() => onModuleChange(module.id)}
                      className={cn(
                        'w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-all duration-200',
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'hover:bg-accent hover:text-accent-foreground text-muted-foreground'
                      )}
                    >
                      <DynamicIcon iconName={module.icon} className="h-4 w-4" />
                      <span className="text-sm">{module.name}</span>
                    </button>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </nav>
    );
  }

  // Dropdown Navigation
  if (variant === 'dropdown') {
    return (
      <div className="flex items-center space-x-2">
        {navGroupOrder.map(({ key, name }) => {
          const group = groups[key];
          if (!group || group.length === 0) return null;
          if (key === 'dashboard') {
            return group.map(module => (
              <Button
                key={module.id}
                variant={activeModule === module.id ? 'default' : 'ghost'}
                onClick={() => onModuleChange(module.id)}
                size="sm"
              >
                {module.name}
              </Button>
            ));
          }
          return (
            <DropdownMenu key={key}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={group.some(m => m.id === activeModule) ? 'default' : 'ghost'}
                  size="sm"
                  className="gap-1"
                >
                  {name}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>{name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {group.map(module => (
                  <DropdownMenuItem
                    key={module.id}
                    onClick={() => onModuleChange(module.id)}
                    className="gap-2 cursor-pointer"
                  >
                    <DynamicIcon iconName={module.icon} className="h-4 w-4" />
                    {module.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        })}
      </div>
    );
  }

  // Mobile Navigation (same as desktop but more compact)
  return (
    <nav className={cn('space-y-1', className)}>
      {navGroupOrder.map(({ key, name }) => {
        const group = groups[key];
        if (!group || group.length === 0) return null;
        if (key === 'dashboard') {
          return group.map(module => {
            const isActive = activeModule === module.id;
            return (
              <button
                key={module.id}
                onClick={() => onModuleChange(module.id)}
                className={cn(
                  'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground text-muted-foreground'
                )}
              >
                <DynamicIcon iconName={module.icon} className="h-4 w-4" />
                <span className="text-sm font-medium">{module.name}</span>
              </button>
            );
          });
        }
        return (
          <Collapsible
            key={key}
            open={openGroups[key]}
            onOpenChange={() => toggleGroup(key)}
          >
            <CollapsibleTrigger asChild>
              <button
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all duration-200 text-sm font-medium',
                  openGroups[key]
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-accent/50 text-muted-foreground'
                )}
              >
                <span>{name}</span>
                {openGroups[key] ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="ml-3 mt-1 space-y-1">
              {group.map(module => {
                const isActive = activeModule === module.id;
                return (
                  <button
                    key={module.id}
                    onClick={() => onModuleChange(module.id)}
                    className={cn(
                      'w-full flex items-center space-x-2 px-3 py-1.5 rounded-md text-left transition-all duration-200',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent hover:text-accent-foreground text-muted-foreground'
                    )}
                  >
                    <DynamicIcon iconName={module.icon} className="h-3 w-3" />
                    <span className="text-xs">{module.name}</span>
                  </button>
                );
              })}
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </nav>
  );
};

export default GroupedNavigation;