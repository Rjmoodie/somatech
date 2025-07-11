import { CashFlowInputs, CashFlowReport, CashFlowScenario } from "../types";
import { calculateMonthlyRevenue, calculateLoanPayment, calculateRunway } from "./calculationUtils";
import { getScenarioAdjustments, applyScenarioAdjustments } from "./scenarioUtils";
import { generateAlerts, generateKeyMilestones } from "./alertsUtils";

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
  const adjustedInputs = applyScenarioAdjustments(inputs, adjustments);

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
