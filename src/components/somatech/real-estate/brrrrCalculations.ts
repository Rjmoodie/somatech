export interface BRRRRInputs {
  // Buy Phase
  purchasePrice: number;
  downPaymentPercent: number;
  closingCosts: number;
  acquisitionFees: number;
  holdingCosts: number;
  
  // Rehab Phase
  renovationBudget: number;
  contingencyPercent: number;
  rehabDuration: number;
  rehabFinancingRate: number;
  
  // Rent Phase
  monthlyRent: number;
  vacancyRate: number;
  propertyManagement: number;
  insurance: number;
  propertyTax: number;
  maintenance: number;
  
  // Refinance Phase
  arv: number;
  refinanceLTV: number;
  newLoanRate: number;
  newLoanTerm: number;
  refinanceCosts: number;
}

export interface BRRRRResults {
  // Buy Phase Results
  totalAcquisitionCost: number;
  initialCashNeeded: number;
  
  // Rehab Phase Results
  totalRehabCost: number;
  totalHoldingCost: number;
  preStabilizationInvestment: number;
  
  // Rent Phase Results
  effectiveMonthlyRent: number;
  monthlyOperatingExpenses: number;
  netOperatingIncome: number;
  preRefinanceCashFlow: number;
  preRefinanceROI: number;
  
  // Refinance Phase Results
  maxRefinanceLoan: number;
  cashOutAmount: number;
  newMonthlyPayment: number;
  postRefinanceCashFlow: number;
  postRefinanceROI: number;
  remainingEquity: number;
  
  // Summary Metrics
  totalInvestment: number;
  equityCreated: number;
  capitalRecycled: number;
  rentToValueRatio: number;
}

export interface SavedDeal {
  id: string;
  deal_name: string;
  inputs: BRRRRInputs;
  results: BRRRRResults;
  notes?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Core BRRRR calculation engine
 */
export const calculateBRRRR = (inputs: BRRRRInputs): BRRRRResults => {
  // Buy Phase Calculations
  const downPaymentAmount = (inputs.purchasePrice * inputs.downPaymentPercent) / 100;
  const totalAcquisitionCost = inputs.purchasePrice + inputs.closingCosts + inputs.acquisitionFees;
  const initialCashNeeded = downPaymentAmount + inputs.closingCosts + inputs.acquisitionFees;
  
  // Rehab Phase Calculations
  const contingencyAmount = (inputs.renovationBudget * inputs.contingencyPercent) / 100;
  const totalRehabCost = inputs.renovationBudget + contingencyAmount;
  const totalHoldingCost = inputs.holdingCosts * inputs.rehabDuration;
  const preStabilizationInvestment = initialCashNeeded + totalRehabCost + totalHoldingCost;
  
  // Rent Phase Calculations
  const effectiveMonthlyRent = inputs.monthlyRent * (1 - inputs.vacancyRate / 100);
  const monthlyOperatingExpenses = inputs.propertyManagement + inputs.insurance + inputs.propertyTax + inputs.maintenance;
  const netOperatingIncome = effectiveMonthlyRent - monthlyOperatingExpenses;
  
  // Calculate existing loan payment (purchase loan)
  const loanAmount = inputs.purchasePrice - downPaymentAmount;
  const monthlyRate = (inputs.rehabFinancingRate / 100) / 12;
  const numPayments = 30 * 12;
  const existingLoanPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
  
  const preRefinanceCashFlow = netOperatingIncome - existingLoanPayment;
  const preRefinanceROI = (preRefinanceCashFlow * 12) / preStabilizationInvestment * 100;
  
  // Refinance Phase Calculations
  const maxRefinanceLoan = (inputs.arv * inputs.refinanceLTV) / 100;
  const cashOutAmount = Math.max(0, maxRefinanceLoan - loanAmount - inputs.refinanceCosts);
  
  // New loan payment calculation
  const newMonthlyRate = (inputs.newLoanRate / 100) / 12;
  const newNumPayments = inputs.newLoanTerm * 12;
  const newMonthlyPayment = maxRefinanceLoan * (newMonthlyRate * Math.pow(1 + newMonthlyRate, newNumPayments)) / (Math.pow(1 + newMonthlyRate, newNumPayments) - 1);
  
  const postRefinanceCashFlow = netOperatingIncome - newMonthlyPayment;
  const remainingEquity = inputs.arv - maxRefinanceLoan;
  
  // Calculate final investment after cash-out
  const totalInvestment = Math.max(0, preStabilizationInvestment - cashOutAmount);
  const postRefinanceROI = totalInvestment > 0 ? (postRefinanceCashFlow * 12) / totalInvestment * 100 : 0;
  
  // Summary metrics
  const equityCreated = inputs.arv - inputs.purchasePrice;
  const capitalRecycled = (cashOutAmount / preStabilizationInvestment) * 100;
  const rentToValueRatio = (inputs.monthlyRent * 12) / inputs.arv * 100;

  return {
    totalAcquisitionCost,
    initialCashNeeded,
    totalRehabCost,
    totalHoldingCost,
    preStabilizationInvestment,
    effectiveMonthlyRent,
    monthlyOperatingExpenses,
    netOperatingIncome,
    preRefinanceCashFlow,
    preRefinanceROI,
    maxRefinanceLoan,
    cashOutAmount,
    newMonthlyPayment,
    postRefinanceCashFlow,
    postRefinanceROI,
    remainingEquity,
    totalInvestment,
    equityCreated,
    capitalRecycled,
    rentToValueRatio
  };
};