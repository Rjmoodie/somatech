import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, RefreshCw, Wifi, WifiOff, Loader2 } from 'lucide-react';

interface GlobalLoadingStateProps {
  isLoading?: boolean;
  isOffline?: boolean;
  error?: string | null;
  onRetry?: () => void;
  loadingText?: string;
}

const GlobalLoadingState: React.FC<GlobalLoadingStateProps> = ({
  isLoading = false,
  isOffline = false,
  error = null,
  onRetry,
  loadingText = "Loading..."
}) => {
  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle className="text-destructive">Error Occurred</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">{error}</p>
            {onRetry && (
              <Button onClick={onRetry} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isOffline) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <WifiOff className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <CardTitle>No Internet Connection</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Please check your internet connection and try again.
            </p>
            {onRetry && (
              <Button onClick={onRetry} className="w-full">
                <Wifi className="h-4 w-4 mr-2" />
                Retry Connection
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center space-y-6">
            <Loader2 className="h-12 w-12 text-primary mx-auto animate-spin" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{loadingText}</h3>
              <p className="text-sm text-muted-foreground">
                Please wait while we prepare your content...
              </p>
            </div>
            <div className="space-y-3 w-full">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default GlobalLoadingState;