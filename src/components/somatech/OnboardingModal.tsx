import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, ArrowRight, User, Settings, Mail, Shield, Target } from "lucide-react";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  icon: React.ComponentType<any>;
  action: () => void;
  required: boolean;
}

interface OnboardingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OnboardingModal = ({ open, onOpenChange }: OnboardingModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingProgress, setOnboardingProgress] = useState({
    steps_completed: [] as string[],
    current_step: 0,
    total_steps: 5
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && open) {
      fetchOnboardingProgress();
    }
  }, [user, open]);

  const fetchOnboardingProgress = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('onboarding_progress, onboarding_completed')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data?.onboarding_progress) {
        const progress = data.onboarding_progress as any;
        setOnboardingProgress(progress);
        setCurrentStep(progress.current_step || 0);
      }
    } catch (error) {
      console.error('Error fetching onboarding progress:', error);
    }
  };

  const updateOnboardingProgress = async (stepId: string) => {
    if (!user) return;

    try {
      const updatedProgress = {
        ...onboardingProgress,
        steps_completed: [...onboardingProgress.steps_completed, stepId],
        current_step: currentStep + 1
      };

      const { error } = await supabase
        .from('profiles')
        .update({
          onboarding_progress: updatedProgress,
          onboarding_completed: updatedProgress.current_step >= updatedProgress.total_steps
        })
        .eq('id', user.id);

      if (error) throw error;

      setOnboardingProgress(updatedProgress);
      setCurrentStep(updatedProgress.current_step);

      if (updatedProgress.current_step >= updatedProgress.total_steps) {
        toast({
          title: "Onboarding Complete! 🎉",
          description: "Welcome to SomaTech! You're all set to start analyzing.",
        });
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error updating onboarding progress:', error);
    }
  };

  const steps: OnboardingStep[] = [
    {
      id: "profile",
      title: "Complete Your Profile",
      description: "Add your username and basic information",
      completed: onboardingProgress.steps_completed.includes("profile"),
      icon: User,
      action: () => window.location.href = '/somatech?module=account-settings',
      required: true
    },
    {
      id: "email",
      title: "Verify Your Email",
      description: "Confirm your email address for security",
      completed: onboardingProgress.steps_completed.includes("email"),
      icon: Mail,
      action: () => {
        toast({
          title: "Email Verification",
          description: "Check your inbox for a verification email",
        });
        updateOnboardingProgress("email");
      },
      required: true
    },
    {
      id: "security",
      title: "Review Security Settings",
      description: "Set up your password and security preferences",
      completed: onboardingProgress.steps_completed.includes("security"),
      icon: Shield,
      action: () => {
        updateOnboardingProgress("security");
        window.location.href = '/somatech?module=account-settings';
      },
      required: false
    },
    {
      id: "first-analysis",
      title: "Try Your First Analysis",
      description: "Analyze a stock to see SomaTech in action",
      completed: onboardingProgress.steps_completed.includes("first-analysis"),
      icon: Target,
      action: () => {
        updateOnboardingProgress("first-analysis");
        window.location.href = '/somatech?module=stock-analysis';
      },
      required: true
    },
    {
      id: "explore",
      title: "Explore Features",
      description: "Discover all the tools available to you",
      completed: onboardingProgress.steps_completed.includes("explore"),
      icon: Settings,
      action: () => {
        updateOnboardingProgress("explore");
        window.location.href = '/somatech?module=dashboard';
      },
      required: false
    }
  ];

  const completedSteps = onboardingProgress.steps_completed.length;
  const progressPercentage = (completedSteps / onboardingProgress.total_steps) * 100;

  const handleSkipOnboarding = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          onboarding_completed: true,
          onboarding_progress: {
            ...onboardingProgress,
            current_step: onboardingProgress.total_steps
          }
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Onboarding Skipped",
        description: "You can access these features anytime from your account settings",
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error skipping onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Welcome to SomaTech! 🚀</DialogTitle>
          <DialogDescription>
            Let's get you set up in just a few steps. This will take less than 5 minutes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Overview */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Setup Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {completedSteps}/{onboardingProgress.total_steps} completed
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Getting Started</span>
                  <span>Ready to Use</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Onboarding Steps */}
          <div className="space-y-3">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isActive = index === currentStep;
              
              return (
                <Card 
                  key={step.id} 
                  className={`transition-all ${
                    isActive ? 'ring-2 ring-primary' : ''
                  } ${step.completed ? 'bg-muted/50' : ''}`}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-4">
                      <div className={`flex-shrink-0 ${step.completed ? 'text-green-600' : 'text-muted-foreground'}`}>
                        {step.completed ? (
                          <CheckCircle className="h-6 w-6" />
                        ) : (
                          <Circle className="h-6 w-6" />
                        )}
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          <IconComponent className="h-4 w-4" />
                          <h3 className="font-medium">{step.title}</h3>
                          {step.required && (
                            <Badge variant="secondary" className="text-xs">Required</Badge>
                          )}
                          {step.completed && (
                            <Badge variant="default" className="text-xs">✓ Done</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                      
                      <div className="flex-shrink-0">
                        {!step.completed && (
                          <Button
                            variant={isActive ? "default" : "outline"}
                            size="sm"
                            onClick={step.action}
                            className="min-w-[80px]"
                          >
                            {isActive ? "Start" : "Begin"}
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={handleSkipOnboarding}
              disabled={loading}
            >
              {loading ? "Skipping..." : "Skip for Now"}
            </Button>
            
            <div className="text-sm text-muted-foreground">
              💡 You can access these features anytime from your profile
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;