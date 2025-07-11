import React, { useCallback, useEffect } from 'react';
import { AlertTriangle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useError } from './ErrorProvider';

const ErrorFallback: React.FC<{ 
  error: Error; 
  resetError: () => void;
  context?: string;
}> = ({ error, resetError, context }) => {
  const { isOnline } = useError();

  const handleRetry = useCallback(() => {
    // Clear any cached data that might be causing issues
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
    
    resetError();
  }, [resetError]);

  useEffect(() => {
    // Log error for debugging
    console.error('Error Boundary caught error:', error, 'Context:', context);
  }, [error, context]);

  // Network error
  if (!isOnline || error.message.includes('fetch') || error.message.includes('network')) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <WifiOff className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Connection Problem</h2>
          <p className="text-muted-foreground mb-6">
            Please check your internet connection and try again.
          </p>
          <div className="space-y-2">
            <Button onClick={handleRetry} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()} 
              className="w-full"
            >
              Reload Page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Module loading error
  if (error.message.includes('Loading chunk') || error.message.includes('ChunkLoadError')) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <RefreshCw className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Loading Error</h2>
          <p className="text-muted-foreground mb-6">
            Failed to load the application module. This usually resolves with a refresh.
          </p>
          <Button onClick={() => window.location.reload()} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reload Application
          </Button>
        </div>
      </div>
    );
  }

  // Generic error
  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="text-center max-w-lg">
        <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
        <p className="text-muted-foreground mb-6">
          {context 
            ? `An error occurred in the ${context} module.` 
            : 'An unexpected error occurred.'
          } Please try again or contact support if the problem persists.
        </p>
        
        <Alert className="mb-6 text-left">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="font-mono text-sm">
            {error.message}
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Button onClick={handleRetry} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/somatech?module=dashboard'} 
            className="w-full"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;