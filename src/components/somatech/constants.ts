import { 
  Calculator, 
  TrendingUp, 
  Users, 
  FileText, 
  Home, 
  DollarSign, 
  Star, 
  ShoppingCart, 
  LayoutDashboard, 
  Activity, 
  Heart, 
  Target,
  Crown,
  BarChart3,
  Settings,
  Palette,
  Shield,
  Building
} from "lucide-react";
import { Module } from "./types";

export const modules: Module[] = [
  { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
  { id: "stock-analysis", name: "Stock Analysis", icon: TrendingUp },
  { id: "watchlist", name: "Watchlist", icon: Star },
  { id: "marketplace", name: "Business Marketplace", icon: ShoppingCart },
  { id: "funding-campaigns", name: "Funding Campaigns", icon: Heart },
  { id: "business-valuation", name: "Business Valuation", icon: Calculator },
  { id: "cash-flow", name: "Cash Flow Simulator", icon: Activity },
  { id: "retirement-planning", name: "Retirement Planning", icon: FileText },
  { id: "real-estate", name: "Real Estate Calculator", icon: DollarSign },
  { id: "subscription", name: "Subscription", icon: Crown },
  // Enterprise Features
  { id: "enterprise-analytics", name: "Usage Analytics", icon: BarChart3 },
  { id: "enterprise-admin", name: "Admin Panel", icon: Settings },
  { id: "enterprise-whitelabel", name: "White Label", icon: Palette },
  { id: "enterprise-reporting", name: "Advanced Reports", icon: FileText },
  { id: "enterprise-performance", name: "Performance", icon: Activity },
  { id: "enterprise-success", name: "Customer Success", icon: Heart },
  { id: "enterprise-security", name: "Security & Audit", icon: Shield },
  { id: "enterprise-tenant", name: "Multi-Tenant", icon: Building }
];

export const industryMultipliers: Record<string, number> = {
  "technology": 8,
  "healthcare": 6,
  "finance": 4,
  "retail": 3,
  "manufacturing": 2.5,
  "other": 3
};

export const industryOptions = [
  { value: "saas", label: "SaaS/Software" },
  { value: "technology", label: "Technology Hardware" },
  { value: "healthcare", label: "Healthcare/Biotech" },
  { value: "finance", label: "Financial Services" },
  { value: "retail", label: "Retail/E-commerce" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "services", label: "Professional Services" },
  { value: "realestate", label: "Real Estate" },
  { value: "energy", label: "Energy/Utilities" },
  { value: "automotive", label: "Automotive" },
  { value: "food", label: "Food & Beverage" },
  { value: "media", label: "Media/Entertainment" },
  { value: "other", label: "Other" }
];

export const businessTypeOptions = [
  { value: "subscription", label: "Subscription-based" },
  { value: "product", label: "Product-based" },
  { value: "service", label: "Service-based" },
  { value: "marketplace", label: "Marketplace/Platform" },
  { value: "saas", label: "Software as a Service" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "retail", label: "Physical Retail" },
  { value: "manufacturing", label: "Manufacturing/Production" },
  { value: "consulting", label: "Consulting/Advisory" },
  { value: "franchise", label: "Franchise" }
];

export const valuationMultiples = {
  saas: { revenue: 6, ebitda: 15, pe: 25 },
  technology: { revenue: 4, ebitda: 12, pe: 20 },
  healthcare: { revenue: 3, ebitda: 10, pe: 18 },
  finance: { revenue: 2.5, ebitda: 8, pe: 12 },
  retail: { revenue: 1.5, ebitda: 6, pe: 15 },
  manufacturing: { revenue: 1.2, ebitda: 5, pe: 12 },
  services: { revenue: 2, ebitda: 7, pe: 16 },
  realestate: { revenue: 1.8, ebitda: 8, pe: 14 },
  energy: { revenue: 1.5, ebitda: 6, pe: 10 },
  automotive: { revenue: 1, ebitda: 5, pe: 12 },
  food: { revenue: 1.5, ebitda: 6, pe: 14 },
  media: { revenue: 2.5, ebitda: 8, pe: 18 },
  other: { revenue: 2, ebitda: 7, pe: 15 }
};

export const campaignCategories = [
  { value: "car", label: "Car/Vehicle" },
  { value: "education", label: "Education/Tuition" },
  { value: "business", label: "Business/Startup" },
  { value: "medical", label: "Medical/Health" },
  { value: "emergency", label: "Emergency Fund" },
  { value: "housing", label: "Housing/Rent" },
  { value: "other", label: "Other" }
];

export const donationAmounts = [10, 25, 50, 100, 250, 500];