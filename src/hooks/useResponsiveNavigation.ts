import { useEffect, useCallback, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface UseResponsiveNavigationProps {
  onModuleChange: (module: string) => void;
  activeModule: string;
}

export const useResponsiveNavigation = ({ 
  onModuleChange, 
  activeModule 
}: UseResponsiveNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(location.search);
      const moduleParam = urlParams.get('module');
      
      if (moduleParam && moduleParam !== activeModule) {
        onModuleChange(moduleParam);
      } else if (!moduleParam && activeModule !== 'dashboard') {
        onModuleChange('dashboard');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [location, activeModule, onModuleChange]);

  // Enhanced module change with proper URL management
  const handleModuleChange = useCallback((module: string, replace = false) => {
    // Update URL
    const searchParams = new URLSearchParams(location.search);
    if (module === 'dashboard') {
      searchParams.delete('module');
    } else {
      searchParams.set('module', module);
    }
    
    const newUrl = `/somatech${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    
    if (replace) {
      navigate(newUrl, { replace: true });
    } else {
      navigate(newUrl);
    }
    
    onModuleChange(module);
  }, [navigate, location, onModuleChange]);

  // Handle scroll restoration
  useEffect(() => {
    // Restore scroll position for better UX
    const scrollPosition = sessionStorage.getItem(`scroll-${activeModule}`);
    if (scrollPosition) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(scrollPosition, 10));
      }, 100);
    }

    // Save current scroll position
    const handleScroll = () => {
      sessionStorage.setItem(`scroll-${activeModule}`, window.scrollY.toString());
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Save final scroll position
      sessionStorage.setItem(`scroll-${activeModule}`, window.scrollY.toString());
    };
  }, [activeModule]);

  return {
    handleModuleChange,
    currentPath: location.pathname,
    searchParams: new URLSearchParams(location.search),
  };
};

// Hook for mobile responsiveness detection
export const useResponsiveDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkResponsive = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkResponsive();
    window.addEventListener('resize', checkResponsive);
    return () => window.removeEventListener('resize', checkResponsive);
  }, []);

  return { isMobile, isTablet, isDesktop: !isMobile && !isTablet };
};

// Hook for preventing horizontal scroll
export const usePreventHorizontalScroll = () => {
  useEffect(() => {
    const preventHorizontalScroll = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
      }
    };

    const preventTouchScroll = (e: TouchEvent) => {
      if (e.touches.length > 1) return;
      
      const touch = e.touches[0];
      const element = e.target as HTMLElement;
      
      // Allow horizontal scroll on specific elements
      if (element.closest('.overflow-x-auto, .table-responsive')) {
        return;
      }
      
      // Prevent horizontal swipes on the body
      if (element === document.body) {
        e.preventDefault();
      }
    };

    document.addEventListener('wheel', preventHorizontalScroll, { passive: false });
    document.addEventListener('touchmove', preventTouchScroll, { passive: false });

    return () => {
      document.removeEventListener('wheel', preventHorizontalScroll);
      document.removeEventListener('touchmove', preventTouchScroll);
    };
  }, []);
};