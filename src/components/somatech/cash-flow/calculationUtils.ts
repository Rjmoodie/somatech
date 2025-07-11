import { CashFlowInputs } from "../types";

/**
 * Calculate revenue for a specific month considering growth and seasonality
 */
export const calculateMonthlyRevenue = (inputs: CashFlowInputs, month: number): number => {
  let revenue = inputs.monthlyRevenue;
  
  // Apply growth
  if (inputs.revenueGrowthRate > 0) {
    revenue = inputs.monthlyRevenue * Math.pow(1 + inputs.revenueGrowthRate / 100, month - 1);
  }

  // Apply seasonality
  if (inputs.hasSeasonality && inputs.seasonalityMultiplier) {
    // Simple seasonality: Q4 gets multiplier, Q1-Q3 get reduced
    const monthMod = month % 12;
    if (monthMod >= 10 || monthMod === 0) { // Oct, Nov, Dec
      revenue *= inputs.seasonalityMultiplier;
    } else if (monthMod <= 3) { // Jan, Feb, Mar
      revenue *= (2 - inputs.seasonalityMultiplier + 1) / 2; // Inverse adjustment
    }
  }

  return revenue;
};

/**
 * Calculate monthly loan payment using standard amortization formula
 */
export const calculateLoanPayment = (inputs: CashFlowInputs): number => {
  if (!inputs.loanAmount || !inputs.interestRate || !inputs.loanTermMonths) {
    return 0;
  }

  const monthlyRate = inputs.interestRate / 100 / 12;
  const numPayments = inputs.loanTermMonths;
  
  // Standard loan payment formula
  const payment = inputs.loanAmount * 
    (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
    (Math.pow(1 + monthlyRate, numPayments) - 1);

  return payment;
};

/**
 * Calculate how many months until cash runs out
 */
export const calculateRunway = (projections: any[], startingCash: number): number => {
  let runway = 0;
  let cash = startingCash;

  for (const month of projections) {
    cash += month.netFlow;
    if (cash <= 0) {
      runway = month.month;
      break;
    }
  }

  return runway;
};