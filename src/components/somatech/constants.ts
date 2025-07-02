import { Calculator, TrendingUp, BarChart3, Target, Users, FileText, Activity, Home, DollarSign, Clock, Brain } from "lucide-react";
import { Module } from "./types";

export const modules: Module[] = [
  { id: "dashboard", name: "Dashboard", icon: Home },
  { id: "stock-analysis", name: "Stock Analysis", icon: TrendingUp },
  { id: "business-valuation", name: "Business Valuation", icon: Calculator },
  { id: "cash-flow", name: "Cash Flow Simulator", icon: BarChart3 },
  { id: "financial-ratios", name: "Financial Ratios", icon: Target },
  { id: "investor-readiness", name: "Investor Readiness", icon: Users },
  { id: "retirement-planning", name: "Retirement Planning", icon: FileText },
  { id: "real-estate", name: "Real Estate Calculator", icon: DollarSign },
  { id: "performance-tracker", name: "Performance Tracker", icon: Activity },
  { id: "time-analyzer", name: "Time Allocation", icon: Clock },
  { id: "founder-wellness", name: "Founder Wellness", icon: Brain },
];

export const industryMultipliers: Record<string, number> = {
  "technology": 8,
  "healthcare": 6,
  "finance": 4,
  "retail": 3,
  "manufacturing": 2.5,
  "other": 3
};