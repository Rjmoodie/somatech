import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SomaTech from "./pages/SomaTech";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/somatech/ErrorBoundary";
import PerformanceProvider from "./components/somatech/PerformanceProvider";
import ErrorProvider from "./components/somatech/ErrorProvider";
import AuthProvider from "./components/somatech/AuthProvider";

// Prevent horizontal scroll and ensure proper mobile rendering
document.documentElement.style.overflowX = 'hidden';
document.body.style.overflowX = 'hidden';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ErrorBoundary>
        <PerformanceProvider>
          <ErrorProvider>
            <AuthProvider>
              <div className="overflow-x-hidden min-h-screen w-full box-border">
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Navigate to="/somatech" replace />} />
                    <Route path="/somatech" element={<SomaTech />} />
                    <Route path="/somatech/*" element={<SomaTech />} />
                    <Route path="/404" element={<NotFound />} />
                    <Route path="*" element={<Navigate to="/404" replace />} />
                  </Routes>
                </BrowserRouter>
              </div>
            </AuthProvider>
          </ErrorProvider>
        </PerformanceProvider>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
