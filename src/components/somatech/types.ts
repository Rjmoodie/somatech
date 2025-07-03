export interface DCFScenarios {
  low: DCFParams;
  base: DCFParams;
  high: DCFParams;
}

export interface DCFParams {
  revenueGrowth: number;
  netMargin: number;
  fcfGrowth: number;
  exitMultiple: number;
  discountRate: number;
}

export interface InvestmentThesis {
  moat: string;
  risks: string;
  opportunities: string;
}

export interface StockPillar {
  score: number;
  status: string;
  value: string;
}

export interface StockTechnicals {
  trend: string;
  ma50: number;
  ma200: number;
  rsi: number;
  macd: string;
}

export interface StockRatios {
  quickRatio: number;
  assetTurnover: number;
  grossMargin: number;
  operatingMargin: number;
}

export interface StockData {
  symbol: string;
  price: number;
  pe: number;
  pbv: number;
  roe: number;
  debtToEquity: number;
  currentRatio: number;
  score: number;
  intrinsicValue: number;
  recommendation: string;
  chartData: any[];
  pillars: Record<string, StockPillar>;
  technicals: StockTechnicals;
  ratios: StockRatios;
  marketCap?: number;
  eps?: number;
  companyName?: string;
  headquarters?: string;
  founded?: string;
  employees?: string;
  ceo?: string;
  exchange?: string;
  sector?: string;
  industry?: string;
  description?: string;
  week52High?: number;
  week52Low?: number;
  dividendYield?: number;
  beta?: number;
  volume?: number;
  priceChange?: number;
  priceChangePercent?: number;
  financials?: {
    revenue: string;
    netIncome: string;
    totalAssets: string;
    totalDebt: string;
    shareholderEquity: string;
  };
}

export interface ValuationResult {
  revenueMultiple: number;
  earningsMultiple: number;
  dcfValue: number;
  averageValue: number;
}

export interface BusinessValuationInputs {
  industry: string;
  businessType: string;
  currentRevenue: number;
  grossMargin: number;
  ebitdaMargin: number;
  netMargin: number;
  revenueGrowth: number;
  exitTimeframe: number;
  discountRate: number;
  terminalGrowthRate: number;
}

export interface ValuationMethods {
  revenueMultiple: boolean;
  ebitdaMultiple: boolean;
  peMultiple: boolean;
  dcf: boolean;
}

export interface ValuationScenarios {
  conservative: ValuationBreakdown;
  base: ValuationBreakdown;
  optimistic: ValuationBreakdown;
}

export interface ValuationBreakdown {
  revenueMultiple?: number;
  ebitdaMultiple?: number;
  peMultiple?: number;
  dcfValue?: number;
  totalValue: number;
}

export interface BusinessValuationReport {
  inputs: BusinessValuationInputs;
  scenarios: ValuationScenarios;
  projections: Array<{
    year: number;
    revenue: number;
    ebitda: number;
    netIncome: number;
    value: number;
  }>;
  sensitivityAnalysis: {
    revenueGrowthImpact: Array<{ growth: number; value: number }>;
    marginImpact: Array<{ margin: number; value: number }>;
    multipleImpact: Array<{ multiple: number; value: number }>;
  };
}

export interface CashFlowInputs {
  businessName: string;
  industry: string;
  startingCash: number;
  timeframe: number;
  monthlyRevenue: number;
  revenueGrowthRate: number;
  hasSeasonality: boolean;
  seasonalityMultiplier: number;
  accountsReceivableDays: number;
  accountsPayableDays: number;
  fixedExpenses: Array<{
    name: string;
    amount: number;
    isPercentage: boolean;
  }>;
  variableExpenses: Array<{
    name: string;
    amount: number;
    isPercentage: boolean;
  }>;
  taxRate: number;
  loanAmount: number;
  interestRate: number;
  loanTermMonths: number;
  equityRaised: number;
  equityRaiseMonth: number;
}

export interface CashFlowScenario {
  monthlyProjections: Array<{
    month: number;
    inflows: number;
    outflows: number;
    netFlow: number;
    cashBalance: number;
    revenue: number;
    expenses: number;
  }>;
  totalInflows: number;
  totalOutflows: number;
  endingCash: number;
  avgMonthlyCashFlow: number;
  runway: number;
  breakEvenMonth: number;
  alerts: Array<{
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }>;
  keyMilestones: Array<{
    month: number;
    description: string;
    type: 'positive' | 'warning';
  }>;
}

export interface CashFlowReport {
  inputs: CashFlowInputs;
  scenarios: {
    conservative: CashFlowScenario;
    base: CashFlowScenario;
    optimistic: CashFlowScenario;
  };
  generatedAt: string;
}

export interface RetirementResult {
  futureValue: number;
  yearsToRetirement: number;
  recommendedSavings: number;
  onTrack: boolean;
}

export interface RealEstateResult {
  monthlyPayment: number;
  netCashFlow: number;
  cashOnCashReturn: number;
  capRate: number;
  profitable: boolean;
}

export interface Module {
  id: string;
  name: string;
  icon: any;
}