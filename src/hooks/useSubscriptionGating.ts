import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SubscriptionFeatures {
  advanced_analytics: boolean;
  unlimited_saves: boolean;
  priority_support: boolean;
  white_label: boolean;
}

export interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: 'free' | 'professional' | 'enterprise';
  subscription_end?: string;
  features_enabled: SubscriptionFeatures;
  usage_limits: {
    monthly_calculations: number;
    saved_projects: number;
    export_reports: number;
  };
}

export const useSubscriptionGating = () => {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);

  const checkSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setSubscription({
          subscribed: false,
          subscription_tier: 'free',
          features_enabled: {
            advanced_analytics: false,
            unlimited_saves: false,
            priority_support: false,
            white_label: false
          },
          usage_limits: {
            monthly_calculations: 100,
            saved_projects: 10,
            export_reports: 5
          }
        });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) throw error;
      
      setSubscription(data);
    } catch (error) {
      console.error('Error checking subscription:', error);
      // Default to free tier on error
      setSubscription({
        subscribed: false,
        subscription_tier: 'free',
        features_enabled: {
          advanced_analytics: false,
          unlimited_saves: false,
          priority_support: false,
          white_label: false
        },
        usage_limits: {
          monthly_calculations: 100,
          saved_projects: 10,
          export_reports: 5
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const hasFeature = (feature: keyof SubscriptionFeatures): boolean => {
    return subscription?.features_enabled[feature] || false;
  };

  const canAccessFeature = (requiredTier: 'free' | 'professional' | 'enterprise'): boolean => {
    if (!subscription) return false;
    
    const tierHierarchy = { free: 0, professional: 1, enterprise: 2 };
    const userTier = tierHierarchy[subscription.subscription_tier];
    const requiredTierLevel = tierHierarchy[requiredTier];
    
    return userTier >= requiredTierLevel;
  };

  const isWithinUsageLimit = (featureType: 'monthly_calculations' | 'saved_projects' | 'export_reports', currentUsage: number): boolean => {
    if (!subscription) return false;
    
    const limit = subscription.usage_limits[featureType];
    return limit === -1 || currentUsage < limit; // -1 means unlimited
  };

  useEffect(() => {
    checkSubscription();
  }, []);

  return {
    subscription,
    loading,
    hasFeature,
    canAccessFeature,
    isWithinUsageLimit,
    refreshSubscription: checkSubscription
  };
};