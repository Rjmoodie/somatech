import { toast } from "@/hooks/use-toast";
import { RetirementInputs, RetirementResults } from "./retirementOperations";

/**
 * Format currency values for display
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Calculate retirement projections based on inputs
 */
export const calculateRetirement = (inputs: RetirementInputs): RetirementResults => {
  const {
    currentAge,
    retirementAge,
    lifeExpectancy,
    currentSavings,
    monthlyContribution,
    expectedReturn,
    retirementSpending,
    inflationRate,
    otherIncome
  } = inputs;

  const yearsToRetirement = retirementAge - currentAge;
  const yearsInRetirement = lifeExpectancy - retirementAge;
  const monthsToRetirement = yearsToRetirement * 12;
  const monthlyReturn = expectedReturn / 100 / 12;

  // Future value at retirement
  const totalSavingsAtRetirement = currentSavings * Math.pow(1 + expectedReturn / 100, yearsToRetirement) +
    monthlyContribution * (Math.pow(1 + monthlyReturn, monthsToRetirement) - 1) / monthlyReturn;

  // Adjust spending for inflation
  const inflationAdjustedSpending = retirementSpending * Math.pow(1 + inflationRate / 100, yearsToRetirement);
  const netAnnualNeed = inflationAdjustedSpending - otherIncome;
  
  // Calculate how long funds will last
  let remainingFunds = totalSavingsAtRetirement;
  let yearsLasted = 0;
  for (let year = 0; year < yearsInRetirement; year++) {
    const yearlySpendingNeed = netAnnualNeed * Math.pow(1 + inflationRate / 100, year);
    if (remainingFunds >= yearlySpendingNeed) {
      remainingFunds = remainingFunds * (1 + expectedReturn / 100) - yearlySpendingNeed;
      yearsLasted++;
    } else {
      break;
    }
  }

  // Calculate total needed at retirement for full coverage
  const totalNeeded = netAnnualNeed * yearsInRetirement * 1.05; // 5% buffer
  const surplusOrShortfall = totalSavingsAtRetirement - totalNeeded;
  
  // Required return rate to meet goal
  const requiredReturn = surplusOrShortfall < 0 ? 
    Math.pow((totalNeeded - currentSavings) / (monthlyContribution * 12 * yearsToRetirement), 1/yearsToRetirement) - 1 : 
    expectedReturn / 100;

  return {
    totalSavingsAtRetirement: Math.round(totalSavingsAtRetirement),
    yearsToRetirement,
    yearsInRetirement,
    inflationAdjustedSpending: Math.round(inflationAdjustedSpending),
    annualIncomeGap: Math.round(Math.max(0, netAnnualNeed)),
    surplusOrShortfall: Math.round(surplusOrShortfall),
    requiredReturnToMeetGoal: Math.round(requiredReturn * 100 * 100) / 100,
    yearsWillLast: yearsLasted,
    onTrack: surplusOrShortfall >= 0
  };
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