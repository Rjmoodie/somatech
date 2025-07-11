import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Calculator, 
  Building, 
  PiggyBank, 
  Home, 
  Star,
  FileText,
  BarChart3,
  Zap
} from "lucide-react";

interface QuickActionsProps {
  onActionSelect: (action: string) => void;
}

const QuickActions = ({ onActionSelect }: QuickActionsProps) => {
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  const actions = [
    {
      id: 'analyze-stock',
      title: 'Analyze Stock',
      description: 'Get DCF valuation for any stock',
      icon: TrendingUp,
      color: 'from-blue-500 to-blue-600',
      module: 'stock-analysis'
    },
    {
      id: 'add-watchlist',
      title: 'Add to Watchlist',
      description: 'Save stocks for tracking',
      icon: Star,
      color: 'from-yellow-500 to-yellow-600',
      module: 'watchlist'
    },
    {
      id: 'business-valuation',
      title: 'Value Business',
      description: 'Comprehensive business analysis',
      icon: Building,
      color: 'from-purple-500 to-purple-600',
      module: 'business-valuation'
    },
    {
      id: 'cash-flow',
      title: 'Cash Flow Model',
      description: 'Project future cash flows',
      icon: BarChart3,
      color: 'from-green-500 to-green-600',
      module: 'cash-flow'
    },
    {
      id: 'retirement-plan',
      title: 'Retirement Planning',
      description: 'Plan your financial future',
      icon: PiggyBank,
      color: 'from-emerald-500 to-emerald-600',
      module: 'retirement-planning'
    },
    {
      id: 'real-estate',
      title: 'Real Estate Calculator',
      description: 'BRRRR strategy analysis',
      icon: Home,
      color: 'from-orange-500 to-orange-600',
      module: 'real-estate'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="h-5 w-5 text-primary" />
          <span>Quick Actions</span>
        </CardTitle>
        <CardDescription>
          Jump into your most-used financial tools
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                variant="outline"
                className={`h-auto p-4 flex flex-col items-center space-y-2 transition-all duration-300 ${
                  hoveredAction === action.id 
                    ? 'border-primary/50 shadow-lg scale-105' 
                    : 'hover:border-primary/30'
                }`}
                onMouseEnter={() => setHoveredAction(action.id)}
                onMouseLeave={() => setHoveredAction(null)}
                onClick={() => onActionSelect(action.module)}
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="text-center">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {action.description}
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;