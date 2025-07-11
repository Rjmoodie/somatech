import { toast } from "@/hooks/use-toast";
import { RetirementResults } from "./retirementOperations";

/**
 * Utility functions for retirement planning
 */

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const generatePDFReport = (
  retirementResult: RetirementResults,
  currentAge: string,
  retirementAge: string,
  currentSavings: string,
  monthlyContribution: string
): void => {
  if (!retirementResult) return;

  const reportContent = `
    Retirement Planning Report
    
    Plan Summary:
    - Current Age: ${currentAge}
    - Retirement Age: ${retirementAge}
    - Current Savings: $${parseFloat(currentSavings).toLocaleString()}
    - Monthly Contribution: $${parseFloat(monthlyContribution).toLocaleString()}
    
    Key Results:
    - Total at Retirement: $${retirementResult.totalSavingsAtRetirement.toLocaleString()}
    - Years to Retirement: ${retirementResult.yearsToRetirement}
    - Surplus/Shortfall: $${retirementResult.surplusOrShortfall.toLocaleString()}
    - Funds Will Last: ${retirementResult.yearsWillLast} years
    - On Track: ${retirementResult.onTrack ? 'Yes' : 'No'}
    
    Generated on: ${new Date().toLocaleDateString()}
  `;

  const blob = new Blob([reportContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'retirement-plan-report.txt';
  a.click();
  URL.revokeObjectURL(url);
  
  toast({
    title: "Report Exported",
    description: "Your retirement plan report has been downloaded.",
  });
};

export const generateCSVReport = (
  retirementResult: RetirementResults,
  currentAge: string,
  retirementAge: string,
  lifeExpectancy: string,
  currentSavings: string,
  monthlyContribution: string,
  expectedReturn: number[]
): void => {
  if (!retirementResult) return;

  const csvContent = [
    ['Metric', 'Value'],
    ['Current Age', currentAge],
    ['Retirement Age', retirementAge],
    ['Life Expectancy', lifeExpectancy],
    ['Current Savings', currentSavings],
    ['Monthly Contribution', monthlyContribution],
    ['Expected Return %', expectedReturn[0]],
    ['Total at Retirement', retirementResult.totalSavingsAtRetirement],
    ['Years to Retirement', retirementResult.yearsToRetirement],
    ['Surplus/Shortfall', retirementResult.surplusOrShortfall],
    ['Years Will Last', retirementResult.yearsWillLast],
    ['On Track', retirementResult.onTrack ? 'Yes' : 'No']
  ].map(row => row.join(',')).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'retirement-plan-data.csv';
  a.click();
  URL.revokeObjectURL(url);
  
  toast({
    title: "Data Exported",
    description: "Your retirement plan data has been downloaded as CSV.",
  });
};