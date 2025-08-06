import { useCallback } from 'react';
import { useError } from '@/components/somatech/ErrorProvider';
import { toast } from '@/hooks/use-toast';

interface ErrorContext {
  component: string;
  action: string;
  user?: any;
  additionalData?: Record<string, any>;
}

interface ErrorHandlerReturn {
  handleError: (error: Error, context: ErrorContext) => void;
  handleAsyncError: <T>(promise: Promise<T>, context: ErrorContext) => Promise<T | null>;
  handleModuleError: (error: Error, moduleName: string) => void;
  handleNavigationError: (error: Error) => void;
  handleAuthError: (error: Error) => void;
  handleDataError: (error: Error, dataType: string) => void;
}

export const useErrorHandler = (): ErrorHandlerReturn => {
  const { reportError } = useError();

  const handleError = useCallback((error: Error, context: ErrorContext) => {
    // Log error for debugging
    console.error(`Error in ${context.component} during ${context.action}:`, error);
    
    // Report error to monitoring service
    reportError(error, `${context.component}-${context.action}`);
    
    // Show user-friendly error message
    const errorMessage = getErrorMessage(error, context);
    toast({
      title: "Something went wrong",
      description: errorMessage,
      variant: "destructive",
    });
  }, [reportError]);

  const handleAsyncError = useCallback(async <T>(
    promise: Promise<T>, 
    context: ErrorContext
  ): Promise<T | null> => {
    try {
      return await promise;
    } catch (error) {
      handleError(error as Error, context);
      return null;
    }
  }, [handleError]);

  const handleModuleError = useCallback((error: Error, moduleName: string) => {
    handleError(error, {
      component: 'Module',
      action: 'load',
      additionalData: { moduleName }
    });
  }, [handleError]);

  const handleNavigationError = useCallback((error: Error) => {
    handleError(error, {
      component: 'Navigation',
      action: 'navigate'
    });
  }, [handleError]);

  const handleAuthError = useCallback((error: Error) => {
    handleError(error, {
      component: 'Authentication',
      action: 'auth'
    });
  }, [handleError]);

  const handleDataError = useCallback((error: Error, dataType: string) => {
    handleError(error, {
      component: 'Data',
      action: 'fetch',
      additionalData: { dataType }
    });
  }, [handleError]);

  return {
    handleError,
    handleAsyncError,
    handleModuleError,
    handleNavigationError,
    handleAuthError,
    handleDataError
  };
};

// Helper function to get user-friendly error messages
const getErrorMessage = (error: Error, context: ErrorContext): string => {
  const errorMessage = error.message.toLowerCase();
  
  // Network errors
  if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
    return "Network connection issue. Please check your internet connection and try again.";
  }
  
  // Authentication errors
  if (errorMessage.includes('auth') || errorMessage.includes('unauthorized')) {
    return "Authentication failed. Please sign in again.";
  }
  
  // Module loading errors
  if (context.component === 'Module') {
    return `Failed to load ${context.additionalData?.moduleName || 'module'}. Please refresh the page and try again.`;
  }
  
  // Navigation errors
  if (context.component === 'Navigation') {
    return "Navigation failed. Please try again or refresh the page.";
  }
  
  // Data errors
  if (context.component === 'Data') {
    return `Failed to load ${context.additionalData?.dataType || 'data'}. Please try again later.`;
  }
  
  // Default error message
  return "An unexpected error occurred. Please try again or contact support if the problem persists.";
}; 