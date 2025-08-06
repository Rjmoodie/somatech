import { useState, useEffect } from 'react';
import { useAuth } from '@/components/somatech/AuthProvider';

export const useOnboarding = () => {
  const { user, loading: authLoading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [showProgressiveOnboarding, setShowProgressiveOnboarding] = useState(false);

  // Check onboarding status
  useEffect(() => {
    if (user && !authLoading) {
      const completed = localStorage.getItem(`onboarding-completed-${user.id}`);
      setHasCompletedOnboarding(!!completed);
      if (!completed) {
        // Show progressive onboarding for better UX
        setShowProgressiveOnboarding(true);
      }
    }
  }, [user, authLoading]);

  const handleOnboardingComplete = () => {
    if (user) {
      localStorage.setItem(`onboarding-completed-${user.id}`, 'true');
      setHasCompletedOnboarding(true);
    }
    setShowOnboarding(false);
  };

  return {
    showOnboarding,
    setShowOnboarding,
    hasCompletedOnboarding,
    setHasCompletedOnboarding,
    showProgressiveOnboarding,
    setShowProgressiveOnboarding,
    handleOnboardingComplete
  };
}; 