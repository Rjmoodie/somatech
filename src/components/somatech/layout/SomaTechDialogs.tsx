import React from 'react';
import { useAuth } from '@/components/somatech/AuthProvider';
import { useOnboarding } from '@/components/somatech/hooks/useOnboarding';
import OnboardingWelcome from '@/components/somatech/OnboardingWelcome';
import ProgressiveOnboarding from '@/components/somatech/ProgressiveOnboarding';

const SomaTechDialogs: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { 
    showOnboarding, 
    setShowOnboarding, 
    hasCompletedOnboarding, 
    setHasCompletedOnboarding,
    showProgressiveOnboarding,
    setShowProgressiveOnboarding,
    handleOnboardingComplete 
  } = useOnboarding();

  return (
    <>
      {/* Onboarding Welcome */}
      <OnboardingWelcome
        open={showOnboarding && !!user && !authLoading}
        onOpenChange={setShowOnboarding}
        onComplete={handleOnboardingComplete}
      />

      {/* Progressive Onboarding */}
      {showProgressiveOnboarding && user && !hasCompletedOnboarding && (
        <ProgressiveOnboarding
          onStepComplete={() => {
            setShowProgressiveOnboarding(false);
            if (user) {
              localStorage.setItem(`onboarding-completed-${user.id}`, 'true');
              setHasCompletedOnboarding(true);
            }
          }}
          onSkip={() => setShowProgressiveOnboarding(false)}
        />
      )}
    </>
  );
};

export default SomaTechDialogs; 