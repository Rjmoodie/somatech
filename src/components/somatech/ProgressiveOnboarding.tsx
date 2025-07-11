import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  Star,
  Target,
  Users,
  TrendingUp,
  Lightbulb
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  completed: boolean;
  action?: () => void;
  href?: string;
}

interface ProgressiveOnboardingProps {
  onStepComplete: (stepId: string) => void;
  onSkip: () => void;
}

const ProgressiveOnboarding: React.FC<ProgressiveOnboardingProps> = ({ 
  onStepComplete, 
  onSkip 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [showOnboarding, setShowOnboarding] = useState(true);

  // Check if user has completed onboarding before
  useEffect(() => {
    const completed = localStorage.getItem('progressive-onboarding-completed');
    if (completed) {
      setShowOnboarding(false);
    }
  }, []);

  const steps: OnboardingStep[] = [
    {
      id: 'explore-campaigns',
      title: 'Explore Campaigns',
      description: 'Browse community funding campaigns and discover inspiring projects',
      icon: Target,
      completed: completedSteps.has('explore-campaigns'),
      action: () => {
        // In real app, navigate to campaigns
        toast({ title: "Great! You're exploring campaigns" });
        markStepComplete('explore-campaigns');
      }
    },
    {
      id: 'create-account',
      title: 'Create Your Account',
      description: 'Sign up to create campaigns, donate, and save your progress',
      icon: Users,
      completed: completedSteps.has('create-account'),
      action: () => {
        // In real app, open auth dialog
        toast({ title: "Account creation started!" });
        markStepComplete('create-account');
      }
    },
    {
      id: 'create-campaign',
      title: 'Create Your First Campaign',
      description: 'Use our tools to create a compelling funding campaign',
      icon: Star,
      completed: completedSteps.has('create-campaign'),
      action: () => {
        // In real app, open campaign creation
        toast({ title: "Let's create your campaign!" });
        markStepComplete('create-campaign');
      }
    },
    {
      id: 'optimize-campaign',
      title: 'Optimize for Success',
      description: 'Use our projection tools and best practices for better results',
      icon: TrendingUp,
      completed: completedSteps.has('optimize-campaign'),
      action: () => {
        toast({ title: "Optimization tips unlocked!" });
        markStepComplete('optimize-campaign');
      }
    }
  ];

  const markStepComplete = (stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
    onStepComplete(stepId);
    
    // Auto-advance to next step
    if (currentStep < steps.length - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 500);
    } else {
      // All steps completed
      setTimeout(() => {
        localStorage.setItem('progressive-onboarding-completed', 'true');
        setShowOnboarding(false);
        toast({
          title: "Onboarding Complete! 🎉",
          description: "You're ready to start using all features."
        });
      }, 1000);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('progressive-onboarding-completed', 'true');
    setShowOnboarding(false);
    onSkip();
    toast({
      title: "Onboarding skipped",
      description: "You can always access help from the menu."
    });
  };

  const progress = (completedSteps.size / steps.length) * 100;

  if (!showOnboarding) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md animate-scale-in">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Lightbulb className="h-8 w-8 text-white" />
              </div>
              <Badge className="absolute -top-2 -right-2 bg-green-500">
                {completedSteps.size}/{steps.length}
              </Badge>
            </div>
          </div>
          <CardTitle className="text-xl">Get Started with SomaTech</CardTitle>
          <Progress value={progress} className="mt-2" />
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Current Step Highlight */}
          <div className="bg-muted p-4 rounded-lg border-l-4 border-primary">
            <div className="flex items-start gap-3">
              <div className={cn(
                "p-2 rounded-full",
                steps[currentStep]?.completed ? "bg-green-500" : "bg-primary"
              )}>
                {React.createElement(steps[currentStep]?.icon || Circle, {
                  className: "h-4 w-4 text-white"
                })}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">
                  {steps[currentStep]?.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {steps[currentStep]?.description}
                </p>
                {steps[currentStep] && !steps[currentStep].completed && (
                  <Button 
                    size="sm" 
                    className="mt-2"
                    onClick={steps[currentStep].action}
                  >
                    Let's Go!
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* All Steps Overview */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Your Progress
            </h4>
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg transition-colors",
                  index === currentStep && "bg-muted",
                  step.completed && "opacity-60"
                )}
              >
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center",
                  step.completed 
                    ? "bg-green-500 text-white" 
                    : index === currentStep
                    ? "bg-primary text-white"
                    : "bg-muted-foreground/20"
                )}>
                  {step.completed ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <span className="text-xs font-medium">{index + 1}</span>
                  )}
                </div>
                <span className={cn(
                  "text-sm",
                  step.completed && "line-through",
                  index === currentStep && "font-medium"
                )}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSkip}
              className="flex-1"
            >
              Skip Tour
            </Button>
            <Button 
              size="sm" 
              onClick={() => setCurrentStep(Math.min(currentStep + 1, steps.length - 1))}
              className="flex-1"
            >
              Next Step
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressiveOnboarding;