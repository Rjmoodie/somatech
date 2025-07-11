import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Home, RefreshCw, DollarSign, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormField } from "./FormField";
import { BRRRRInputs } from "./brrrrCalculations";

interface MobileOptimizedFormProps {
  inputs: BRRRRInputs;
  onInputChange: (field: keyof BRRRRInputs, value: number) => void;
  onCalculate: () => void;
  isCalculating?: boolean;
}

export const MobileOptimizedForm = ({
  inputs,
  onInputChange,
  onCalculate,
  isCalculating = false
}: MobileOptimizedFormProps) => {
  const [openSections, setOpenSections] = useState<string[]>(["buy"]);

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const sections = [
    {
      id: "buy",
      title: "Buy Phase",
      icon: Home,
      color: "text-blue-500",
      description: "Property acquisition details",
      fields: [
        { key: "purchasePrice", label: "Purchase Price", suffix: "$", validation: { min: 1000, required: true } },
        { key: "downPaymentPercent", label: "Down Payment", suffix: "%", validation: { min: 0, max: 100, required: true } },
        { key: "closingCosts", label: "Closing Costs", suffix: "$", validation: { min: 0 } },
        { key: "acquisitionFees", label: "Acquisition Fees", suffix: "$", validation: { min: 0 } },
        { key: "holdingCosts", label: "Monthly Holding Costs", suffix: "$", validation: { min: 0 } }
      ]
    },
    {
      id: "rehab",
      title: "Rehab Phase",
      icon: RefreshCw,
      color: "text-orange-500",
      description: "Renovation details",
      fields: [
        { key: "renovationBudget", label: "Renovation Budget", suffix: "$", validation: { min: 0, required: true } },
        { key: "contingencyPercent", label: "Contingency", suffix: "%", validation: { min: 0, max: 50 } },
        { key: "rehabDuration", label: "Rehab Duration", suffix: " months", validation: { min: 1, max: 24 } },
        { key: "rehabFinancingRate", label: "Financing Rate", suffix: "%", validation: { min: 0, max: 30 } }
      ]
    },
    {
      id: "rent",
      title: "Rent Phase",
      icon: DollarSign,
      color: "text-green-500",
      description: "Rental income and expenses",
      fields: [
        { key: "monthlyRent", label: "Monthly Rent", suffix: "$", validation: { min: 100, required: true } },
        { key: "vacancyRate", label: "Vacancy Rate", suffix: "%", validation: { min: 0, max: 50 } },
        { key: "propertyManagement", label: "Property Management", suffix: "$", validation: { min: 0 } },
        { key: "insurance", label: "Insurance", suffix: "$", validation: { min: 0 } },
        { key: "propertyTax", label: "Property Tax", suffix: "$", validation: { min: 0 } },
        { key: "maintenance", label: "Maintenance", suffix: "$", validation: { min: 0 } }
      ]
    },
    {
      id: "refinance",
      title: "Refinance Phase",
      icon: TrendingUp,
      color: "text-purple-500",
      description: "Refinancing details",
      fields: [
        { key: "arv", label: "After Repair Value", suffix: "$", validation: { min: 1000, required: true } },
        { key: "refinanceLTV", label: "Refinance LTV", suffix: "%", validation: { min: 50, max: 90 } },
        { key: "newLoanRate", label: "New Loan Rate", suffix: "%", validation: { min: 0, max: 15 } },
        { key: "newLoanTerm", label: "New Loan Term", suffix: " years", validation: { min: 10, max: 40 } },
        { key: "refinanceCosts", label: "Refinance Costs", suffix: "$", validation: { min: 0 } }
      ]
    }
  ];

  return (
    <div className="space-y-4">
      {sections.map((section) => {
        const isOpen = openSections.includes(section.id);
        
        return (
          <Collapsible key={section.id} open={isOpen} onOpenChange={() => toggleSection(section.id)}>
            <Card className="overflow-hidden">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        <section.icon className={`h-5 w-5 ${section.color}`} />
                      </div>
                      <div className="text-left">
                        <CardTitle className="text-base">{section.title}</CardTitle>
                        <CardDescription className="text-sm">{section.description}</CardDescription>
                      </div>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <CardContent className="pt-0 space-y-4">
                  <div className="grid gap-4">
                    {section.fields.map((field) => (
                      <FormField
                        key={field.key}
                        label={field.label}
                        value={inputs[field.key as keyof BRRRRInputs] as number}
                        onChange={(value) => onInputChange(field.key as keyof BRRRRInputs, value)}
                        suffix={field.suffix}
                        validation={field.validation}
                        className="w-full"
                      />
                    ))}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        );
      })}
      
      {/* Calculate Button */}
      <Button 
        onClick={onCalculate} 
        className="w-full h-12 text-base font-medium sticky bottom-4 z-10 shadow-lg"
        disabled={isCalculating}
        size="lg"
      >
        {isCalculating ? "Calculating..." : "Calculate BRRRR Analysis"}
      </Button>
    </div>
  );
};