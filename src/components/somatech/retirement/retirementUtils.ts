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
    monthlyContribution, // This is actually annual contribution from the form
    expectedReturn,
    retirementSpending,
    inflationRate,
    otherIncome
  } = inputs;

  // Input validation
  if (currentAge >= retirementAge) {
    throw new Error("Retirement age must be greater than current age");
  }
  if (retirementAge >= lifeExpectancy) {
    throw new Error("Life expectancy must be greater than retirement age");
  }
  if (expectedReturn < 0 || expectedReturn > 20) {
    throw new Error("Expected return should be between 0% and 20%");
  }

  const yearsToRetirement = retirementAge - currentAge;
  const yearsInRetirement = lifeExpectancy - retirementAge;
  
  // Convert annual contribution to monthly (fixing the mismatch)
  const actualMonthlyContribution = monthlyContribution / 12;
  const monthsToRetirement = yearsToRetirement * 12;
  const monthlyReturn = expectedReturn / 100 / 12;
  const annualReturn = expectedReturn / 100;

  // Future value of current savings (compound annually)
  const futureValueCurrentSavings = currentSavings * Math.pow(1 + annualReturn, yearsToRetirement);
  
  // Future value of monthly contributions (compound monthly)
  const futureValueContributions = monthlyReturn > 0 ? 
    actualMonthlyContribution * ((Math.pow(1 + monthlyReturn, monthsToRetirement) - 1) / monthlyReturn) :
    actualMonthlyContribution * monthsToRetirement;
  
  const totalSavingsAtRetirement = futureValueCurrentSavings + futureValueContributions;

  // Debug logging for transparency
  console.log('🧮 Retirement Calculation Breakdown:', {
    inputs: {
      currentSavings: currentSavings.toLocaleString(),
      annualContribution: monthlyContribution.toLocaleString(),
      monthlyContribution: actualMonthlyContribution.toLocaleString(),
      expectedReturn: expectedReturn + '%',
      yearsToRetirement
    },
    calculations: {
      futureValueCurrentSavings: Math.round(futureValueCurrentSavings).toLocaleString(),
      futureValueContributions: Math.round(futureValueContributions).toLocaleString(),
      totalSavingsAtRetirement: Math.round(totalSavingsAtRetirement).toLocaleString()
    }
  });

  // Adjust spending for inflation
  const inflationAdjustedSpending = retirementSpending * Math.pow(1 + inflationRate / 100, yearsToRetirement);
  const netAnnualNeed = Math.max(0, inflationAdjustedSpending - otherIncome);
  
  // Calculate how long funds will last
  let remainingFunds = totalSavingsAtRetirement;
  let yearsLasted = 0;
  for (let year = 0; year < yearsInRetirement; year++) {
    const yearlySpendingNeed = netAnnualNeed * Math.pow(1 + inflationRate / 100, year);
    if (remainingFunds >= yearlySpendingNeed) {
      remainingFunds = remainingFunds * (1 + annualReturn) - yearlySpendingNeed;
      yearsLasted++;
    } else {
      break;
    }
  }

  // Calculate total needed at retirement for full coverage
  const totalNeeded = netAnnualNeed * yearsInRetirement * 1.05; // 5% buffer
  const surplusOrShortfall = totalSavingsAtRetirement - totalNeeded;
  
  // Required return rate to meet goal (simplified calculation)
  const requiredReturn = surplusOrShortfall < 0 ? 
    Math.max(0, ((totalNeeded / currentSavings) ** (1/yearsToRetirement) - 1) * 100) : 
    expectedReturn;

  return {
    totalSavingsAtRetirement: Math.round(totalSavingsAtRetirement),
    yearsToRetirement,
    yearsInRetirement,
    inflationAdjustedSpending: Math.round(inflationAdjustedSpending),
    annualIncomeGap: Math.round(netAnnualNeed),
    surplusOrShortfall: Math.round(surplusOrShortfall),
    requiredReturnToMeetGoal: Math.round(requiredReturn * 100) / 100,
    yearsWillLast: yearsLasted,
    onTrack: surplusOrShortfall >= 0,
    // Add breakdown for display
    breakdown: {
      futureValueCurrentSavings: Math.round(futureValueCurrentSavings),
      futureValueContributions: Math.round(futureValueContributions),
      actualMonthlyContribution: Math.round(actualMonthlyContribution)
    }
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