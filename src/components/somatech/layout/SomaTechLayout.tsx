import React from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PieChart } from 'lucide-react';
import OfflineIndicator from '@/components/somatech/OfflineIndicator';
import ErrorBoundary from '@/components/somatech/ErrorBoundary';
import SomaTechHeader from './SomaTechHeader';
import SomaTechSidebar from './SomaTechSidebar';
import SomaTechContent from './SomaTechContent';
import SomaTechDialogs from './SomaTechDialogs';
import FloatingActionMenu from '@/components/somatech/FloatingActionMenu';
import BottomNavigation from '@/components/somatech/BottomNavigation';
import NetworkStatus from '@/components/somatech/NetworkStatus';
import { useAuth } from '@/components/somatech/AuthProvider';
import { useError } from '@/components/somatech/ErrorProvider';
import { usePerformance } from '@/components/somatech/PerformanceProvider';

interface SomaTechLayoutProps {
  activeModule: string;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  onModuleChange: (module: string) => void;
  children: React.ReactNode;
}

const SomaTechLayout: React.FC<SomaTechLayoutProps> = ({
  activeModule,
  sidebarCollapsed,
  setSidebarCollapsed,
  onModuleChange,
  children
}) => {
  const location = useLocation();
  const { user, profile, loading: authLoading } = useAuth();
  const { reportError } = useError();
  const { trackPerformance } = usePerformance();

  const handleSidebarToggle = () => {
    try {
      trackPerformance('sidebarToggle', () => {
        setSidebarCollapsed(!sidebarCollapsed);
      });
    } catch (error) {
      reportError(error as Error, 'sidebar-toggle');
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex overflow-x-hidden box-border">
        <OfflineIndicator />
        
        {/* Sidebar - Hidden on mobile, shown on desktop */}
        <SomaTechSidebar
          activeModule={activeModule}
          sidebarCollapsed={sidebarCollapsed}
          onModuleChange={onModuleChange}
          onSidebarToggle={handleSidebarToggle}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 w-full overflow-x-hidden">
          {/* Header */}
          <SomaTechHeader 
            activeModule={activeModule}
            user={user}
            profile={profile}
            authLoading={authLoading}
          />

          {/* Main Content Area */}
          <main className="flex-1 px-2 sm:px-3 md:px-4 pb-20 lg:pb-4 overflow-auto w-full box-border">
            <div className="premium-card p-3 sm:p-4 md:p-8 rounded-2xl animate-fade-in min-h-[calc(100vh-200px)] w-full overflow-x-auto">
              <div className="w-full min-w-0">
                <SomaTechContent activeModule={activeModule}>
                  {children}
                </SomaTechContent>
              </div>
            </div>
          </main>
        </div>

        {/* Floating Action Menu - Desktop only */}
        <div className="hidden lg:block">
          <FloatingActionMenu onModuleSelect={onModuleChange} />
        </div>

        {/* Bottom Navigation - Mobile only */}
        <div className="lg:hidden">
          <BottomNavigation 
            activeModule={activeModule} 
            onModuleChange={onModuleChange} 
          />
        </div>

        {/* Dialogs */}
        <SomaTechDialogs />

        {/* Network Status */}
        <NetworkStatus />
      </div>
    </ErrorBoundary>
  );
};

export default SomaTechLayout; 