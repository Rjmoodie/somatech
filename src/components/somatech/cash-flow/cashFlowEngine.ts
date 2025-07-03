import { CashFlowInputs, CashFlowReport, CashFlowScenario } from "../types";

export const calculateCashFlow = (inputs: CashFlowInputs): CashFlowReport => {
  // Create three scenarios with different assumptions
  const scenarios = {
    conservative: calculateScenario(inputs, 'conservative'),
    base: calculateScenario(inputs, 'base'),
    optimistic: calculateScenario(inputs, 'optimistic')
  };

  return {
    inputs,
    scenarios,
    generatedAt: new Date().toISOString()
  };
};

const calculateScenario = (inputs: CashFlowInputs, scenarioType: 'conservative' | 'base' | 'optimistic'): CashFlowScenario => {
  // Adjust assumptions based on scenario type
  const adjustments = getScenarioAdjustments(scenarioType);
  
  const adjustedInputs = {
    ...inputs,
    monthlyRevenue: inputs.monthlyRevenue * adjustments.revenueMultiplier,
    revenueGrowthRate: inputs.revenueGrowthRate * adjustments.growthMultiplier,
    fixedExpenses: inputs.fixedExpenses.map(exp => ({
      ...exp,
      amount: exp.amount * adjustments.expenseMultiplier
    })),
    variableExpenses: inputs.variableExpenses.map(exp => ({
      ...exp,
      amount: exp.amount * adjustments.expenseMultiplier
    }))
  };

  const monthlyProjections = [];
  let currentCash = inputs.startingCash;
  let totalInflows = 0;
  let totalOutflows = 0;
  let breakEvenMonth = 0;
  let hasHitBreakeven = false;

  for (let month = 1; month <= inputs.timeframe; month++) {
    // Calculate revenue for this month
    const monthlyRevenue = calculateMonthlyRevenue(adjustedInputs, month);
    
    // Calculate AR adjustment (delayed cash receipt)
    const arDelay = Math.floor(inputs.accountsReceivableDays / 30);
    const actualRevenueReceived = month > arDelay ? 
      calculateMonthlyRevenue(adjustedInputs, month - arDelay) : 
      (month === 1 ? monthlyRevenue : 0);

    // Calculate fixed expenses
    const fixedExpenseTotal = adjustedInputs.fixedExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Calculate variable expenses
    const variableExpenseTotal = adjustedInputs.variableExpenses.reduce((sum, exp) => {
      return sum + (exp.isPercentage ? (monthlyRevenue * exp.amount / 100) : exp.amount);
    }, 0);

    // Calculate loan payment
    const loanPayment = calculateLoanPayment(inputs);

    // Calculate tax (on revenue, simplified)
    const taxPayment = monthlyRevenue * (inputs.taxRate / 100);

    // AP adjustment (delayed cash payment)
    const apDelay = Math.floor(inputs.accountsPayableDays / 30);
    const actualExpensesPaid = month > apDelay ? 
      (fixedExpenseTotal + variableExpenseTotal) : 
      (month === 1 ? (fixedExpenseTotal + variableExpenseTotal) : 0);

    // Calculate equity injection
    const equityInflow = (inputs.equityRaised > 0 && month === inputs.equityRaiseMonth) ? inputs.equityRaised : 0;

    // Calculate total inflows and outflows
    const monthlyInflows = actualRevenueReceived + equityInflow + (month === 1 && inputs.loanAmount > 0 ? inputs.loanAmount : 0);
    const monthlyOutflows = actualExpensesPaid + loanPayment + taxPayment;
    const netFlow = monthlyInflows - monthlyOutflows;

    currentCash += netFlow;
    totalInflows += monthlyInflows;
    totalOutflows += monthlyOutflows;

    // Check for break-even
    if (!hasHitBreakeven && netFlow > 0) {
      breakEvenMonth = month;
      hasHitBreakeven = true;
    }

    monthlyProjections.push({
      month,
      inflows: monthlyInflows,
      outflows: monthlyOutflows,
      netFlow,
      cashBalance: currentCash,
      revenue: monthlyRevenue,
      expenses: actualExpensesPaid + loanPayment + taxPayment
    });
  }

  // Calculate runway (months until cash runs out)
  const runway = calculateRunway(monthlyProjections, inputs.startingCash);

  // Calculate average monthly cash flow
  const avgMonthlyCashFlow = monthlyProjections.reduce((sum, month) => sum + month.netFlow, 0) / monthlyProjections.length;

  // Generate alerts and milestones
  const alerts = generateAlerts(monthlyProjections, inputs);
  const keyMilestones = generateKeyMilestones(monthlyProjections, breakEvenMonth);

  return {
    monthlyProjections,
    totalInflows,
    totalOutflows,
    endingCash: currentCash,
    avgMonthlyCashFlow,
    runway,
    breakEvenMonth,
    alerts,
    keyMilestones
  };
};

const getScenarioAdjustments = (scenarioType: 'conservative' | 'base' | 'optimistic') => {
  switch (scenarioType) {
    case 'conservative':
      return {
        revenueMultiplier: 0.8,
        growthMultiplier: 0.5,
        expenseMultiplier: 1.2
      };
    case 'optimistic':
      return {
        revenueMultiplier: 1.2,
        growthMultiplier: 1.5,
        expenseMultiplier: 0.9
      };
    default: // base
      return {
        revenueMultiplier: 1,
        growthMultiplier: 1,
        expenseMultiplier: 1
      };
  }
};

const calculateMonthlyRevenue = (inputs: CashFlowInputs, month: number): number => {
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

const calculateLoanPayment = (inputs: CashFlowInputs): number => {
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

const calculateRunway = (projections: any[], startingCash: number): number => {
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

const generateAlerts = (projections: any[], inputs: CashFlowInputs): Array<{title: string, description: string, severity: 'low' | 'medium' | 'high'}> => {
  const alerts = [];

  // Check for cash runway warnings
  const finalCash = projections[projections.length - 1]?.cashBalance || 0;
  if (finalCash < 0) {
    alerts.push({
      title: "Cash Depletion Risk",
      description: `Your business may run out of cash during the projection period. Consider reducing expenses or increasing revenue.`,
      severity: 'high' as const
    });
  }

  // Check for consistently negative cash flow
  const negativeFlowMonths = projections.filter(month => month.netFlow < 0).length;
  if (negativeFlowMonths > projections.length * 0.6) {
    alerts.push({
      title: "Persistent Negative Cash Flow",
      description: `${negativeFlowMonths} out of ${projections.length} months show negative cash flow. Review your business model.`,
      severity: 'high' as const
    });
  }

  // Check for low cash warnings
  const lowCashMonths = projections.filter(month => month.cashBalance < inputs.startingCash * 0.2).length;
  if (lowCashMonths > 0) {
    alerts.push({
      title: "Low Cash Periods",
      description: `Cash balance drops below 20% of starting amount in ${lowCashMonths} months. Consider maintaining higher reserves.`,
      severity: 'medium' as const
    });
  }

  return alerts;
};

const generateKeyMilestones = (projections: any[], breakEvenMonth: number): Array<{month: number, description: string, type: 'positive' | 'warning'}> => {
  const milestones = [];

  if (breakEvenMonth > 0) {
    milestones.push({
      month: breakEvenMonth,
      description: "Break-even achieved",
      type: 'positive' as const
    });
  }

  // Find first cash low point
  const minCashMonth = projections.reduce((min, month, index) => 
    month.cashBalance < projections[min].cashBalance ? index : min, 0
  );

  if (projections[minCashMonth].cashBalance < 0) {
    milestones.push({
      month: minCashMonth + 1,
      description: "Cash depletion point",
      type: 'warning' as const
    });
  }

  return milestones;
};