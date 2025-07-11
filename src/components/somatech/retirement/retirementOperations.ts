import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface RetirementInputs {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  currentSavings: number;
  monthlyContribution: number;
  expectedReturn: number;
  retirementSpending: number;
  inflationRate: number;
  otherIncome: number;
}

export interface RetirementResults {
  totalSavingsAtRetirement: number;
  yearsToRetirement: number;
  yearsInRetirement: number;
  inflationAdjustedSpending: number;
  annualIncomeGap: number;
  surplusOrShortfall: number;
  requiredReturnToMeetGoal: number;
  yearsWillLast: number;
  onTrack: boolean;
  breakdown?: {
    futureValueCurrentSavings: number;
    futureValueContributions: number;
    actualMonthlyContribution: number;
  };
}

export interface SavedPlan {
  id: string;
  plan_name: string;
  inputs: RetirementInputs;
  results: RetirementResults;
  notes?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Core retirement calculation logic
 */
export const calculateRetirement = (
  currentAge: string,
  retirementAge: string,
  lifeExpectancy: string,
  currentSavings: string,
  monthlyContribution: string,
  expectedReturn: number[],
  retirementSpending: string,
  inflationRate: number[],
  otherIncome: string
): RetirementResults | null => {
  if (!currentAge || !retirementAge || !currentSavings || !monthlyContribution || !retirementSpending) return null;

  const age = parseInt(currentAge);
  const retAge = parseInt(retirementAge);
  const lifeExp = parseInt(lifeExpectancy);
  const savings = parseFloat(currentSavings);
  const contribution = parseFloat(monthlyContribution);
  const returnRate = expectedReturn[0] / 100;
  const annualSpending = parseFloat(retirementSpending);
  const inflation = inflationRate[0] / 100;
  const otherAnnualIncome = parseFloat(otherIncome) || 0;

  const yearsToRetirement = retAge - age;
  const yearsInRetirement = lifeExp - retAge;
  const monthsToRetirement = yearsToRetirement * 12;
  const monthlyReturn = returnRate / 12;

  // Future value at retirement
  const totalSavingsAtRetirement = savings * Math.pow(1 + returnRate, yearsToRetirement) +
    contribution * (Math.pow(1 + monthlyReturn, monthsToRetirement) - 1) / monthlyReturn;

  // Adjust spending for inflation
  const inflationAdjustedSpending = annualSpending * Math.pow(1 + inflation, yearsToRetirement);
  const netAnnualNeed = inflationAdjustedSpending - otherAnnualIncome;
  
  // Calculate how long funds will last
  let remainingFunds = totalSavingsAtRetirement;
  let yearsLasted = 0;
  for (let year = 0; year < yearsInRetirement; year++) {
    const yearlySpendingNeed = netAnnualNeed * Math.pow(1 + inflation, year);
    if (remainingFunds >= yearlySpendingNeed) {
      remainingFunds = remainingFunds * (1 + returnRate) - yearlySpendingNeed;
      yearsLasted++;
    } else {
      break;
    }
  }

  // Calculate total needed at retirement for full coverage
  const totalNeeded = netAnnualNeed * yearsInRetirement * 1.05; // 5% buffer
  const surplusOrShortfall = totalSavingsAtRetirement - totalNeeded;
  
  // Required return rate to meet goal
  const requiredReturn = surplusOrShortfall < 0 ? 
    Math.pow((totalNeeded - savings) / (contribution * 12 * yearsToRetirement), 1/yearsToRetirement) - 1 : 
    returnRate;

  return {
    totalSavingsAtRetirement: Math.round(totalSavingsAtRetirement),
    yearsToRetirement,
    yearsInRetirement,
    inflationAdjustedSpending: Math.round(inflationAdjustedSpending),
    annualIncomeGap: Math.round(Math.max(0, netAnnualNeed)),
    surplusOrShortfall: Math.round(surplusOrShortfall),
    requiredReturnToMeetGoal: Math.round(requiredReturn * 100 * 100) / 100,
    yearsWillLast: yearsLasted,
    onTrack: surplusOrShortfall >= 0
  };
};

/**
 * Custom hook for retirement plan operations
 */
export const useRetirementOperations = () => {
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const loadSavedPlans = async (): Promise<SavedPlan[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('retirement_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data as any[])?.map(item => ({
        ...item,
        inputs: item.inputs as RetirementInputs,
        results: item.results as RetirementResults
      })) || [];
    } catch (error) {
      console.error('Error loading plans:', error);
      return [];
    }
  };

  const savePlan = async (
    planName: string, 
    inputs: RetirementInputs, 
    results: RetirementResults, 
    notes?: string
  ): Promise<boolean> => {
    if (!planName.trim()) return false;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to save retirement plans.",
          variant: "destructive",
        });
        return false;
      }

      const { data, error } = await supabase
        .from('retirement_plans')
        .insert({
          plan_name: planName,
          user_id: user.id,
          inputs: inputs as any,
          results: results as any,
          notes: notes,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        toast({
          title: "Plan Saved",
          description: `"${planName}" has been saved successfully.`,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error saving plan:', error);
      if (error instanceof Error && error.message.includes('not authenticated')) {
        toast({
          title: "Sign In Required",
          description: "Please sign in or create an account to save your retirement plans and access advanced features.",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to save plan. Please try again.",
          variant: "destructive",
        });
      }
      return false;
    }
  };

  const deletePlan = async (planId: string, planName: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('retirement_plans')
        .delete()
        .eq('id', planId);

      if (error) throw error;
      
      toast({
        title: "Plan Deleted",
        description: `"${planName}" has been deleted.`,
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast({
        title: "Error",
        description: "Failed to delete plan. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const updatePlanNotes = async (planId: string, planName: string, notes: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('retirement_plans')
        .update({ notes })
        .eq('id', planId);

      if (error) throw error;
      
      toast({
        title: "Notes Updated",
        description: `Notes for "${planName}" have been updated.`,
      });
      
      return true;
    } catch (error) {
      console.error('Error updating notes:', error);
      toast({
        title: "Error",
        description: "Failed to update notes. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    savedPlans,
    loadSavedPlans,
    savePlan,
    deletePlan,
    updatePlanNotes,
  };
};