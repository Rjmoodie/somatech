import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Crown, 
  Star, 
  Zap, 
  Check, 
  ArrowRight, 
  Settings,
  TrendingUp,
  Shield,
  Headphones,
  Palette
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface SubscriptionFeatures {
  advanced_analytics: boolean;
  unlimited_saves: boolean;
  priority_support: boolean;
  white_label: boolean;
}

interface UsageLimits {
  monthly_calculations: number;
  saved_projects: number;
  export_reports: number;
}

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: 'free' | 'professional' | 'enterprise';
  subscription_end?: string;
  features_enabled: SubscriptionFeatures;
  usage_limits: UsageLimits;
}

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    icon: Star,
    color: 'text-blue-600',
    features: [
      '100 calculations per month',
      '10 saved projects',
      '5 export reports',
      'Basic financial tools',
      'Community support'
    ],
    priceId: null
  },
  {
    id: 'professional',
    name: 'Professional',
    price: '$29',
    period: 'per month',
    description: 'For serious financial planning',
    icon: TrendingUp,
    color: 'text-green-600',
    popular: true,
    features: [
      '1,000 calculations per month',
      '100 saved projects',
      '50 export reports',
      'Advanced analytics',
      'Priority email support',
      'PDF export capabilities',
      'Historical data access'
    ],
    priceId: 'price_professional' // Replace with actual Stripe price ID
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$99',
    period: 'per month',
    description: 'For teams and organizations',
    icon: Crown,
    color: 'text-purple-600',
    features: [
      'Unlimited calculations',
      'Unlimited saved projects',
      'Unlimited exports',
      'Advanced analytics',
      'Priority phone support',
      'White-label options',
      'Custom integrations',
      'Dedicated account manager'
    ],
    priceId: 'price_enterprise' // Replace with actual Stripe price ID
  }
];

interface PricingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSubscription?: SubscriptionData;
  onSubscriptionChange?: () => void;
}

const PricingDialog = ({ open, onOpenChange, currentSubscription, onSubscriptionChange }: PricingDialogProps) => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: typeof PLANS[0]) => {
    if (!plan.priceId) return;
    
    setLoading(plan.id);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-subscription', {
        body: {
          priceId: plan.priceId,
          planName: plan.name
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Subscription Error",
        description: "Failed to start subscription process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Portal error:', error);
      toast({
        title: "Error",
        description: "Failed to open customer portal. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Choose Your Plan</DialogTitle>
          <DialogDescription className="text-center">
            Unlock the full potential of SomaTech with our professional features
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            const isCurrentPlan = currentSubscription?.subscription_tier === plan.id;
            const isUpgrade = currentSubscription && (
              (currentSubscription.subscription_tier === 'free' && plan.id !== 'free') ||
              (currentSubscription.subscription_tier === 'professional' && plan.id === 'enterprise')
            );

            return (
              <Card 
                key={plan.id} 
                className={`relative transition-all duration-300 hover:shadow-lg ${
                  plan.popular ? 'border-2 border-primary shadow-lg scale-105' : ''
                } ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-3 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                {isCurrentPlan && (
                  <div className="absolute -top-3 right-4">
                    <Badge className="bg-green-500 text-white px-3 py-1">
                      Current Plan
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className={`w-12 h-12 mx-auto rounded-full bg-background flex items-center justify-center mb-4`}>
                    <Icon className={`h-6 w-6 ${plan.color}`} />
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold">
                    {plan.price}
                    {plan.period !== 'forever' && (
                      <span className="text-sm font-normal text-muted-foreground">/{plan.period}</span>
                    )}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {isCurrentPlan ? (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleManageSubscription}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Manage Plan
                    </Button>
                  ) : plan.id === 'free' ? (
                    <Button variant="outline" className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button 
                      className="w-full"
                      onClick={() => handleSubscribe(plan)}
                      disabled={loading === plan.id}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {loading === plan.id ? (
                        "Processing..."
                      ) : isUpgrade ? (
                        <>
                          Upgrade Now
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      ) : (
                        "Get Started"
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>All plans include 14-day free trial • Cancel anytime • No setup fees</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PricingDialog;