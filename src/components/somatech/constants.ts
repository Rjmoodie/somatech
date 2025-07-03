import { Calculator, TrendingUp, BarChart3, Users, FileText, Home, DollarSign, Star } from "lucide-react";
import { Module } from "./types";

export const modules: Module[] = [
  { id: "dashboard", name: "Dashboard", icon: Home },
  { id: "stock-analysis", name: "Stock Analysis", icon: TrendingUp },
  { id: "watchlist", name: "Watchlist", icon: Star },
  { id: "business-valuation", name: "Business Valuation", icon: Calculator },
  { id: "cash-flow", name: "Cash Flow Simulator", icon: BarChart3 },
  { id: "investor-readiness", name: "Investor Readiness", icon: Users },
  { id: "retirement-planning", name: "Retirement Planning", icon: FileText },
  { id: "real-estate", name: "Real Estate Calculator", icon: DollarSign },
];

export const industryMultipliers: Record<string, number> = {
  "technology": 8,
  "healthcare": 6,
  "finance": 4,
  "retail": 3,
  "manufacturing": 2.5,
  "other": 3
};