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
  const currentPrice = stockData?.price || 175;
  const revenue = 380000; // Mock current revenue in millions
  
  const projectedRevenue = revenue * Math.pow(1 + scenario.revenueGrowth / 100, 5);
  const projectedEarnings = projectedRevenue * (scenario.netMargin / 100);
  const terminalValue = projectedEarnings * scenario.exitMultiple;
  const discountFactor = Math.pow(1 + scenario.discountRate / 100, 5);
  const intrinsicValue = terminalValue / discountFactor;
  const sharePrice = intrinsicValue / 16000; // Mock shares outstanding in millions
  
  return {
    intrinsicValue: Math.round(sharePrice),
    cagr: Math.round(((sharePrice / currentPrice) ** (1/5) - 1) * 100 * 100) / 100,
    upside: Math.round(((sharePrice - currentPrice) / currentPrice) * 100)
  };
};

export const generateRetirementChartData = (
  currentAge: string,
  retirementAge: string,
  currentSavings: string,
  monthlyContribution: string,
  expectedReturn: number[]
) => {
  if (!currentAge || !retirementAge || !currentSavings || !monthlyContribution) return [];
  
  const age = parseInt(currentAge);
  const retAge = parseInt(retirementAge);
  const savings = parseFloat(currentSavings);
  const contribution = parseFloat(monthlyContribution);
  const returnRate = expectedReturn[0] / 100;
  
  const data = [];
  let currentBalance = savings;
  
  for (let year = age; year <= retAge; year++) {
    data.push({
      age: year,
      balance: Math.round(currentBalance),
      contributions: Math.round(contribution * 12 * (year - age + 1)),
      growth: Math.round(currentBalance - savings - (contribution * 12 * (year - age)))
    });
    currentBalance = currentBalance * (1 + returnRate) + (contribution * 12);
  }
  
  return data;
};