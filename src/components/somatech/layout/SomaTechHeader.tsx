import React from 'react';
import { modules } from '@/components/somatech/constants';
import ResponsiveNavigation from '@/components/somatech/ResponsiveNavigation';
import DarkModeToggle from '@/components/somatech/DarkModeToggle';
import NotificationBell from '@/components/somatech/NotificationBell';
import { ProfileDropdown } from '@/components/somatech/ProfileDropdown';
import { useAuth } from '@/components/somatech/AuthProvider';

interface SomaTechHeaderProps {
  activeModule: string;
  user: any;
  profile: any;
  authLoading: boolean;
}

const SomaTechHeader: React.FC<SomaTechHeaderProps> = ({
  activeModule,
  user,
  profile,
  authLoading
}) => {
  const { signOut } = useAuth();

  return (
    <header className="glass-card m-2 md:m-4 mb-2 px-2 sm:px-4 md:px-8 py-3 md:py-6 rounded-2xl border-0 flex-shrink-0">
      <div className="flex items-center justify-between gap-2 w-full">
        <div className="flex items-center gap-2 min-w-0">
          <ResponsiveNavigation activeModule={activeModule} />
          <div className="animate-slide-in-left min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl md:text-3xl font-display font-bold text-gray-900 dark:text-white mb-1 truncate">
              {activeModule === 'privacy-policy' ? 'Privacy Policy' : 
               activeModule === 'terms-of-service' ? 'Terms of Service' :
               (modules.find(m => m.id === activeModule)?.name || "Dashboard")}
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium hidden sm:block truncate">
              Professional business intelligence platform
            </p>
          </div>
        </div>
      
        <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 animate-slide-in-right flex-shrink-0">
          <DarkModeToggle />
          {authLoading ? (
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-200 rounded-full animate-skeleton"></div>
              <div className="w-12 sm:w-16 md:w-24 h-3 md:h-4 bg-gray-200 rounded animate-skeleton hidden sm:block"></div>
            </div>
          ) : user ? (
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
              <NotificationBell />
              <ProfileDropdown 
                username={profile?.username || user.email?.split('@')[0] || 'User'}
                userEmail={user.email || ''}
              />
            </div>
          ) : (
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
              <button 
                className="px-2 sm:px-3 md:px-6 py-2 md:py-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-300 hidden sm:block"
              >
                Sign In
              </button>
              <button 
                className="btn-apple text-xs md:text-sm px-2 sm:px-3 md:px-6 py-2 md:py-3 whitespace-nowrap"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default SomaTechHeader; 