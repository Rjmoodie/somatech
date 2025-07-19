import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { DCFParams, StockData } from "./types";

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'excellent': return 'text-green-600';
    case 'good': return 'text-blue-600';
    case 'moderate': return 'text-yellow-600';
    case 'poor': return 'text-red-600';
    default: return 'text-muted-foreground';
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'excellent': return CheckCircle;
    case 'good': return CheckCircle;
    case 'moderate': return AlertTriangle;
    case 'poor': return XCircle;
    default: return AlertTriangle;
  }
};

export const generateStockChartData = () => {
  const data = [];
  let price = 150;
  for (let i = 0; i < 30; i++) {
    const change = (Math.random() - 0.5) * 10;
    price = Math.max(price + change, 50);
    data.push({
      date: `Day ${i + 1}`,
      price: Math.round(price * 100) / 100,
      volume: Math.floor(Math.random() * 1000000) + 500000
    });
  }
  return data;
};

export const calculateDCF = (scenario: DCFParams, stockData: StockData | null) => {
  if (!stockData) {
    return { intrinsicValue: 0, cagr: 0, upside: 0 };
  }

  const currentPrice = stockData.price;
  
  // Use real financial data from Alpha Vantage API
  const revenue = stockData.financials?.revenue ? 
    parseFloat(stockData.financials.revenue) / 1000000 : // Convert to millions
    stockData.marketCap / (stockData.pe || 20); // Fallback estimate
  
  const currentEarnings = stockData.financials?.netIncome ? 
    parseFloat(stockData.financials.netIncome) / 1000000 : // Convert to millions
    revenue * 0.15; // Fallback to 15% net margin
  
  // Calculate shares outstanding from market cap and price
  const sharesOutstanding = stockData.marketCap / (currentPrice * 1000000); // In millions
  
  // Project financials based on scenario
  const projectedRevenue = revenue * Math.pow(1 + scenario.revenueGrowth / 100, 5);
  const projectedEarnings = projectedRevenue * (scenario.netMargin / 100);
  
  // Calculate free cash flow growth
  const currentFCF = currentEarnings * 1.2; // Estimate FCF as 120% of net income
  const projectedFCF = currentFCF * Math.pow(1 + scenario.fcfGrowth / 100, 5);
  
  // Terminal value using both earnings and FCF
  const terminalValueEarnings = projectedEarnings * scenario.exitMultiple;
  const terminalValueFCF = projectedFCF * (scenario.exitMultiple * 0.8); // FCF multiple typically lower
  const terminalValue = (terminalValueEarnings + terminalValueFCF) / 2; // Average both methods
  
  // Discount to present value
  const discountFactor = Math.pow(1 + scenario.discountRate / 100, 5);
  const presentValue = terminalValue / discountFactor;
  
  // Calculate per-share value
  const sharePrice = presentValue / sharesOutstanding;
  
  return {
    intrinsicValue: Math.round(sharePrice),
    cagr: Math.round(((sharePrice / currentPrice) ** (1/5) - 1) * 100 * 100) / 100,
    upside: Math.round(((sharePrice - currentPrice) / currentPrice) * 100)
  };
};

export const generateRetirementChartData = (
  currentAge: string,
  retirementAge: string,
  lifeExpectancy: string,
  currentSavings: string,
  annualContribution: string,
  expectedReturn: number[],
  retirementSpending: string,
  inflationRate: number[]
) => {
  if (!currentAge || !retirementAge || !currentSavings || !annualContribution) return [];
  
  const age = parseInt(currentAge);
  const retAge = parseInt(retirementAge);
  const lifeExp = parseInt(lifeExpectancy) || 90;
  const savings = parseFloat(currentSavings);
  const contribution = parseFloat(annualContribution);
  const returnRate = expectedReturn[0] / 100;
  const annualSpending = parseFloat(retirementSpending) || 0;
  const inflation = inflationRate ? inflationRate[0] / 100 : 0.025;
  
  const data = [];
  let currentBalance = savings;
  
  // Accumulation phase (working years)
  for (let year = age; year <= retAge; year++) {
    const totalContributions = contribution * (year - age + 1);
    const growth = currentBalance - savings - totalContributions;
    
    data.push({
      age: year,
      balance: Math.round(currentBalance),
      contributions: Math.round(totalContributions),
      growth: Math.round(Math.max(0, growth)),
      phase: 'accumulation'
    });
    
    if (year < retAge) {
      currentBalance = currentBalance * (1 + returnRate) + contribution;
    }
  }
  
  // Decumulation phase (retirement years)
  let retirementBalance = currentBalance;
  const inflationAdjustedSpending = annualSpending * Math.pow(1 + inflation, retAge - age);
  
  for (let year = retAge + 1; year <= lifeExp; year++) {
    const yearlySpending = inflationAdjustedSpending * Math.pow(1 + inflation, year - retAge);
    retirementBalance = Math.max(0, retirementBalance * (1 + returnRate) - yearlySpending);
    
    data.push({
      age: year,
      balance: Math.round(retirementBalance),
      contributions: Math.round(contribution * (retAge - age + 1)),
      growth: Math.round(retirementBalance),
      phase: 'decumulation'
    });
    
    if (retirementBalance <= 0) break;
  }
  
  return data;
};

export const generateCampaignProjectionData = (
  targetAmount: string,
  timeframe: string,
  averageDonation: string,
  donationFrequency: number[],
  networkSize: string,
  participationRate: number[]
) => {
  if (!targetAmount || !timeframe || !averageDonation || !networkSize) return [];
  
  const target = parseFloat(targetAmount);
  const weeks = parseInt(timeframe);
  const avgDonation = parseFloat(averageDonation);
  const frequency = donationFrequency[0];
  const network = parseInt(networkSize);
  const participation = participationRate[0] / 100;
  
  const expectedDonors = Math.floor(network * participation);
  const weeklyDonations = expectedDonors * frequency;
  const weeklyAmount = weeklyDonations * avgDonation;
  
  const data = [];
  
  for (let week = 0; week <= weeks; week++) {
    const realistic = Math.round(weeklyAmount * week);
    const optimistic = Math.round(weeklyAmount * week * 1.5);
    const pessimistic = Math.round(weeklyAmount * week * 0.6);
    
    data.push({
      week,
      realistic,
      optimistic,
      pessimistic,
      target: Math.round(target)
    });
  }
  
  return data;
};

// Utility functions for debugging and validation

/**
 * Validate numeric input and return safe value
 */
export const validateNumericInput = (value: string, min: number = 0, max: number = Infinity): number => {
  const num = parseFloat(value);
  if (isNaN(num)) return min;
  return Math.max(min, Math.min(max, num));
};

/**
 * Format currency for display
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
 * Format percentage for display
 */
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Debounce function for performance optimization
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function for performance optimization
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Check if device is mobile
 */
export const isMobile = (): boolean => {
  return window.innerWidth < 768;
};

/**
 * Check if device is tablet
 */
export const isTablet = (): boolean => {
  return window.innerWidth >= 768 && window.innerWidth < 1024;
};

/**
 * Check if device is desktop
 */
export const isDesktop = (): boolean => {
  return window.innerWidth >= 1024;
};

/**
 * Safe scroll to top with fallback
 */
export const scrollToTop = (): void => {
  try {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    // Fallback for older browsers
    window.scrollTo(0, 0);
  }
};

/**
 * Validate stock ticker format
 */
export const validateStockTicker = (ticker: string): boolean => {
  return /^[A-Z]{1,5}$/.test(ticker);
};

/**
 * Clean stock ticker input
 */
export const cleanStockTicker = (input: string): string => {
  return input.toUpperCase().replace(/[^A-Z]/g, '');
};

/**
 * Log performance metrics
 */
export const logPerformance = (name: string, startTime: number): void => {
  const duration = performance.now() - startTime;
  console.log(`Performance [${name}]: ${duration.toFixed(2)}ms`);
  
  if (duration > 1000) {
    console.warn(`Slow operation detected: ${name} took ${duration.toFixed(2)}ms`);
  }
};

/**
 * Generate unique ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Deep clone object
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as T;
  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
};