import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import ErrorBoundary from '@/components/somatech/ErrorBoundary';
import PerformanceProvider from '@/components/somatech/PerformanceProvider';
import ErrorProvider from '@/components/somatech/ErrorProvider';
import AuthProvider from '@/components/somatech/AuthProvider';

// Lazy load main pages
const SomaTech = lazy(() => import('./pages/SomaTech'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <PerformanceProvider>
          <ErrorProvider>
            <AuthProvider>
              <TooltipProvider>
                <BrowserRouter>
                  <div className="min-h-screen bg-background">
                    <Routes>
                      <Route 
                        path="/" 
                        element={
                          <Suspense fallback={
                            <div className="flex items-center justify-center min-h-screen">
                              <div className="text-center">
                                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
                                <p className="mt-4 text-muted-foreground">Loading SomaTech Platform...</p>
                              </div>
                            </div>
                          }>
                            <SomaTech />
                          </Suspense>
                        } 
                      />
                      <Route 
                        path="/404" 
                        element={
                          <Suspense fallback={<div>Loading...</div>}>
                            <NotFound />
                          </Suspense>
                        } 
                      />
                      <Route path="*" element={<Navigate to="/404" replace />} />
                    </Routes>
                  </div>
                </BrowserRouter>
                <Toaster />
                <Sonner />
              </TooltipProvider>
            </AuthProvider>
          </ErrorProvider>
        </PerformanceProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
