import React, { useState, memo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { quickActions } from './quickActionsConfig';

interface QuickActionsProps {
  onActionSelect: (action: string) => void;
}

const MemoQuickActionButton = memo(({ action, hovered, setHovered, onActionSelect }: any) => {
  const Icon = action.icon;
  return (
    <Button
      key={action.id}
      variant="outline"
      className={`h-auto p-4 flex flex-col items-center space-y-2 transition-all duration-300 ${
        hovered === action.id 
          ? 'border-primary/50 shadow-lg scale-105' 
          : 'hover:border-primary/30'
      }`}
      onMouseEnter={() => setHovered(action.id)}
      onMouseLeave={() => setHovered(null)}
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
});
MemoQuickActionButton.displayName = 'MemoQuickActionButton';

const QuickActions = ({ onActionSelect }: QuickActionsProps) => {
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);
  const actions = quickActions.filter(a => !a.floating);

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
          {actions.map((action) => (
            <MemoQuickActionButton
              key={action.id}
              action={action}
              hovered={hoveredAction}
              setHovered={setHoveredAction}
              onActionSelect={onActionSelect}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;