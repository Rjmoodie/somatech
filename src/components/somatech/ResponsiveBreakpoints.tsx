import React from 'react';

interface ResponsiveBreakpointProps {
  children: React.ReactNode;
  show: 'mobile' | 'tablet' | 'desktop' | 'mobile-tablet' | 'tablet-desktop';
  className?: string;
}

export const ResponsiveBreakpoint: React.FC<ResponsiveBreakpointProps> = ({ 
  children, 
  show, 
  className = '' 
}) => {
  const getBreakpointClasses = () => {
    switch (show) {
      case 'mobile':
        return 'block sm:hidden';
      case 'tablet':
        return 'hidden sm:block lg:hidden';
      case 'desktop':
        return 'hidden lg:block';
      case 'mobile-tablet':
        return 'block lg:hidden';
      case 'tablet-desktop':
        return 'hidden sm:block';
      default:
        return '';
    }
  };

  return (
    <div className={`${getBreakpointClasses()} ${className}`}>
      {children}
    </div>
  );
};

// Responsive grid utility
export const ResponsiveGrid: React.FC<{
  children: React.ReactNode;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: string;
  className?: string;
}> = ({ 
  children, 
  cols = { mobile: 1, tablet: 2, desktop: 3 }, 
  gap = 'gap-4',
  className = ''
}) => {
  const getGridClasses = () => {
    const { mobile = 1, tablet = 2, desktop = 3 } = cols;
    return `grid grid-cols-${mobile} sm:grid-cols-${tablet} lg:grid-cols-${desktop} ${gap}`;
  };

  return (
    <div className={`${getGridClasses()} ${className}`}>
      {children}
    </div>
  );
};

// Responsive text utility
export const ResponsiveText: React.FC<{
  children: React.ReactNode;
  size?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  className?: string;
}> = ({ children, size = 'base', className = '' }) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs sm:text-sm md:text-base';
      case 'base':
        return 'text-sm sm:text-base md:text-lg';
      case 'lg':
        return 'text-base sm:text-lg md:text-xl';
      case 'xl':
        return 'text-lg sm:text-xl md:text-2xl';
      case '2xl':
        return 'text-xl sm:text-2xl md:text-3xl';
      case '3xl':
        return 'text-2xl sm:text-3xl md:text-4xl';
      default:
        return 'text-sm sm:text-base md:text-lg';
    }
  };

  return (
    <span className={`${getSizeClasses()} ${className}`}>
      {children}
    </span>
  );
};

// Responsive spacing utility
export const ResponsiveContainer: React.FC<{
  children: React.ReactNode;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  margin?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}> = ({ children, padding = 'md', margin = 'md', className = '' }) => {
  const getPaddingClasses = () => {
    switch (padding) {
      case 'sm':
        return 'p-2 sm:p-3 md:p-4';
      case 'md':
        return 'p-3 sm:p-4 md:p-6';
      case 'lg':
        return 'p-4 sm:p-6 md:p-8';
      case 'xl':
        return 'p-6 sm:p-8 md:p-12';
      default:
        return 'p-3 sm:p-4 md:p-6';
    }
  };

  const getMarginClasses = () => {
    switch (margin) {
      case 'sm':
        return 'm-2 sm:m-3 md:m-4';
      case 'md':
        return 'm-3 sm:m-4 md:m-6';
      case 'lg':
        return 'm-4 sm:m-6 md:m-8';
      case 'xl':
        return 'm-6 sm:m-8 md:m-12';
      default:
        return 'm-3 sm:m-4 md:m-6';
    }
  };

  return (
    <div className={`${getPaddingClasses()} ${getMarginClasses()} ${className}`}>
      {children}
    </div>
  );
};