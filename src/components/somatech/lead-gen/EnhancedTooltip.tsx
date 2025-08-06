import React from "react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { HelpCircle, Info, AlertCircle, CheckCircle, Clock, MapPin, DollarSign, Home, User, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnhancedTooltipProps {
  content: string | React.ReactNode;
  title?: string;
  type?: "info" | "help" | "warning" | "success" | "property" | "financial" | "location" | "owner" | "tag";
  trigger?: React.ReactNode;
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  delayDuration?: number;
  children?: React.ReactNode;
}

const getIcon = (type: string) => {
  switch (type) {
    case "info":
      return <Info className="h-4 w-4" />;
    case "help":
      return <HelpCircle className="h-4 w-4" />;
    case "warning":
      return <AlertCircle className="h-4 w-4" />;
    case "success":
      return <CheckCircle className="h-4 w-4" />;
    case "property":
      return <Home className="h-4 w-4" />;
    case "financial":
      return <DollarSign className="h-4 w-4" />;
    case "location":
      return <MapPin className="h-4 w-4" />;
    case "owner":
      return <User className="h-4 w-4" />;
    case "tag":
      return <Tag className="h-4 w-4" />;
    default:
      return <Info className="h-4 w-4" />;
  }
};

const getIconColor = (type: string) => {
  switch (type) {
    case "info":
      return "text-blue-500 dark:text-blue-400";
    case "help":
      return "text-gray-500 dark:text-gray-400";
    case "warning":
      return "text-yellow-500 dark:text-yellow-400";
    case "success":
      return "text-green-500 dark:text-green-400";
    case "property":
      return "text-purple-500 dark:text-purple-400";
    case "financial":
      return "text-emerald-500 dark:text-emerald-400";
    case "location":
      return "text-red-500 dark:text-red-400";
    case "owner":
      return "text-indigo-500 dark:text-indigo-400";
    case "tag":
      return "text-orange-500 dark:text-orange-400";
    default:
      return "text-gray-500 dark:text-gray-400";
  }
};

export const EnhancedTooltip: React.FC<EnhancedTooltipProps> = ({
  content,
  title,
  type = "info",
  trigger,
  className,
  side = "top",
  align = "center",
  delayDuration = 300,
  children
}) => {
  const defaultTrigger = (
    <div className={cn("inline-flex items-center justify-center", className)}>
      {getIcon(type)}
    </div>
  );

  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>
          {trigger || children || defaultTrigger}
        </TooltipTrigger>
        <TooltipContent 
          side={side} 
          align={align}
          className="max-w-xs p-3 bg-popover border shadow-lg"
        >
          <div className="space-y-2">
            {title && (
              <div className="flex items-center gap-2 pb-1 border-b border-border">
                <div className={getIconColor(type)}>
                  {getIcon(type)}
                </div>
                <span className="font-semibold text-sm text-foreground">{title}</span>
              </div>
            )}
            <div className="text-sm text-muted-foreground leading-relaxed">
              {content}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Specialized tooltip components for common use cases
export const FilterTooltip: React.FC<{ field: string; description: string }> = ({ field, description }) => (
  <EnhancedTooltip
    type="help"
    title={`${field} Filter`}
    content={description}
    className="text-muted-foreground hover:text-foreground transition-colors"
  />
);

export const PropertyTooltip: React.FC<{ property: any; children: React.ReactNode }> = ({ property, children }) => (
  <EnhancedTooltip
    type="property"
    title={property.address}
    content={
      <div className="space-y-1">
        <div><strong>Value:</strong> ${property.estimated_value?.toLocaleString() || "N/A"}</div>
        <div><strong>Equity:</strong> {property.equity_percent ?? "N/A"}%</div>
        <div><strong>Owner:</strong> {property.owner_name || "N/A"}</div>
        <div><strong>Status:</strong> {property.status || "N/A"}</div>
      </div>
    }
  >
    {children}
  </EnhancedTooltip>
);

export const FinancialTooltip: React.FC<{ term: string; definition: string; formula?: string }> = ({ term, definition, formula }) => (
  <EnhancedTooltip
    type="financial"
    title={term}
    content={
      <div className="space-y-2">
        <p>{definition}</p>
        {formula && (
          <div className="bg-muted/50 rounded p-2">
            <p className="text-xs font-mono text-foreground">{formula}</p>
          </div>
        )}
      </div>
    }
  />
);

export default EnhancedTooltip; 