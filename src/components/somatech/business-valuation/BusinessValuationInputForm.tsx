import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { BusinessValuationInputs, ValuationMethods } from "../types";
import { industryOptions, businessTypeOptions } from "../constants";

interface BusinessValuationInputFormProps {
  inputs: BusinessValuationInputs;
  methods: ValuationMethods;
  onInputChange: (field: keyof BusinessValuationInputs, value: any) => void;
  onMethodChange: (method: keyof ValuationMethods, checked: boolean) => void;
  onCalculate: () => void;
  isCalculating: boolean;
}

const BusinessValuationInputForm = ({
  inputs,
  methods,
  onInputChange,
  onMethodChange,
  onCalculate,
  isCalculating
}: BusinessValuationInputFormProps) => {
  const isFormValid = inputs.industry && inputs.businessType && inputs.currentRevenue > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Information</CardTitle>
        <CardDescription>Enter your business details for comprehensive valuation analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Basic Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select value={inputs.industry} onValueChange={(value) => onInputChange('industry', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent className="bg-background border z-50">
                  {industryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="businessType">Business Type</Label>
              <Select value={inputs.businessType} onValueChange={(value) => onInputChange('businessType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent className="bg-background border z-50">
                  {businessTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Financial Inputs */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Financial Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="revenue">Current Annual Revenue ($)</Label>
              <Input
                id="revenue"
                type="number"
                placeholder="1000000"
                value={inputs.currentRevenue || ''}
                onChange={(e) => onInputChange('currentRevenue', parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="revenueGrowth">Annual Revenue Growth (%)</Label>
              <Input
                id="revenueGrowth"
                type="number"
                placeholder="15"
                value={inputs.revenueGrowth || ''}
                onChange={(e) => onInputChange('revenueGrowth', parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="grossMargin">Gross Margin (%)</Label>
              <Input
                id="grossMargin"
                type="number"
                placeholder="60"
                value={inputs.grossMargin || ''}
                onChange={(e) => onInputChange('grossMargin', parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ebitdaMargin">EBITDA Margin (%)</Label>
              <Input
                id="ebitdaMargin"
                type="number"
                placeholder="25"
                value={inputs.ebitdaMargin || ''}
                onChange={(e) => onInputChange('ebitdaMargin', parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="netMargin">Net Profit Margin (%)</Label>
              <Input
                id="netMargin"
                type="number"
                placeholder="15"
                value={inputs.netMargin || ''}
                onChange={(e) => onInputChange('netMargin', parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="exitTimeframe">Exit Timeframe (years)</Label>
              <Input
                id="exitTimeframe"
                type="number"
                placeholder="5"
                value={inputs.exitTimeframe || ''}
                onChange={(e) => onInputChange('exitTimeframe', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* DCF Parameters */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">DCF Parameters</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discountRate">Discount Rate (%)</Label>
              <Input
                id="discountRate"
                type="number"
                placeholder="10"
                value={inputs.discountRate || ''}
                onChange={(e) => onInputChange('discountRate', parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="terminalGrowthRate">Terminal Growth Rate (%)</Label>
              <Input
                id="terminalGrowthRate"
                type="number"
                placeholder="3"
                value={inputs.terminalGrowthRate || ''}
                onChange={(e) => onInputChange('terminalGrowthRate', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Valuation Methods */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Valuation Methods</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="revenueMultiple"
                checked={methods.revenueMultiple}
                onCheckedChange={(checked) => onMethodChange('revenueMultiple', !!checked)}
              />
              <Label htmlFor="revenueMultiple" className="text-sm">Revenue Multiple</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ebitdaMultiple"
                checked={methods.ebitdaMultiple}
                onCheckedChange={(checked) => onMethodChange('ebitdaMultiple', !!checked)}
              />
              <Label htmlFor="ebitdaMultiple" className="text-sm">EBITDA Multiple</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="peMultiple"
                checked={methods.peMultiple}
                onCheckedChange={(checked) => onMethodChange('peMultiple', !!checked)}
              />
              <Label htmlFor="peMultiple" className="text-sm">P/E Multiple</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="dcf"
                checked={methods.dcf}
                onCheckedChange={(checked) => onMethodChange('dcf', !!checked)}
              />
              <Label htmlFor="dcf" className="text-sm">Discounted Cash Flow</Label>
            </div>
          </div>
        </div>

        <Button 
          onClick={onCalculate} 
          className="w-full" 
          disabled={!isFormValid || isCalculating}
        >
          {isCalculating ? "Calculating..." : "Generate Valuation Report"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BusinessValuationInputForm;