import React, { lazy, Suspense } from 'react';

// Lazy load Framer Motion components
const Motion = lazy(() => import('framer-motion').then(module => ({ default: module.motion })));
const AnimatePresence = lazy(() => import('framer-motion').then(module => ({ default: module.AnimatePresence })));

interface LazyMotionProps {
  children: React.ReactNode;
  [key: string]: any;
}

interface LazyAnimatePresenceProps {
  children: React.ReactNode;
  [key: string]: any;
}

export const LazyMotion: React.FC<LazyMotionProps> = ({ children, ...props }) => {
  return (
    <Suspense fallback={<div className="animate-pulse">{children}</div>}>
      <Motion {...props}>
        {children}
      </Motion>
    </Suspense>
  );
};

export const LazyAnimatePresence: React.FC<LazyAnimatePresenceProps> = ({ children, ...props }) => {
  return (
    <Suspense fallback={<>{children}</>}>
      <AnimatePresence {...props}>
        {children}
      </AnimatePresence>
    </Suspense>
  );
};

// Export motion variants for reuse
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export const slideInFromRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

export const slideInFromLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 }
}; 