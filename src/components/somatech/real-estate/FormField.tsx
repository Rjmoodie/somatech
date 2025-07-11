import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HelpCircle, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ValidationRule {
  min?: number;
  max?: number;
  required?: boolean;
  custom?: (value: number) => string | null;
}

interface FormFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  helpText?: string;
  validation?: ValidationRule;
  placeholder?: string;
  step?: string;
  suffix?: string;
  className?: string;
}

export const FormField = ({
  label,
  value,
  onChange,
  helpText,
  validation,
  placeholder,
  step,
  suffix,
  className
}: FormFieldProps) => {
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const validateValue = useCallback((val: number): string | null => {
    if (!validation) return null;
    
    if (validation.required && (!val || val === 0)) {
      return "This field is required";
    }
    
    if (validation.min !== undefined && val < validation.min) {
      return `Must be at least ${validation.min.toLocaleString()}`;
    }
    
    if (validation.max !== undefined && val > validation.max) {
      return `Must be no more than ${validation.max.toLocaleString()}`;
    }
    
    if (validation.custom) {
      return validation.custom(val);
    }
    
    return null;
  }, [validation]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value) || 0;
    onChange(newValue);
    
    if (touched) {
      setError(validateValue(newValue));
    }
  };

  const handleBlur = () => {
    setTouched(true);
    setError(validateValue(value));
  };

  const formatDisplayValue = (val: number): string => {
    if (val === 0) return "";
    if (suffix === "%") return val.toString();
    return val.toLocaleString();
  };

  const isValid = !error && touched && value > 0;
  const hasError = error && touched;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium">{label}</Label>
        {helpText && (
          <div className="group relative">
            <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-popover border rounded-md shadow-lg text-sm max-w-xs opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
              {helpText}
            </div>
          </div>
        )}
      </div>
      
      <div className="relative">
        <Input
          type="number"
          value={formatDisplayValue(value)}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          step={step}
          className={cn(
            "pr-10",
            hasError && "border-destructive focus-visible:ring-destructive",
            isValid && "border-green-500 focus-visible:ring-green-500"
          )}
        />
        
        {/* Status Icon */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {hasError && <AlertCircle className="h-4 w-4 text-destructive" />}
          {isValid && <CheckCircle className="h-4 w-4 text-green-500" />}
        </div>
      </div>
      
      {/* Error Message */}
      {hasError && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
      
      {/* Suffix Display */}
      {suffix && !hasError && (
        <p className="text-xs text-muted-foreground">
          Values in {suffix}
        </p>
      )}
    </div>
  );
};