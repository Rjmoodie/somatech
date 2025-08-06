import React, { memo, forwardRef, useCallback, useRef, useEffect } from 'react';
import { usePerformanceMonitor } from '@/lib/performance';

interface OptimizedComponentProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onIntersect?: () => void;
  threshold?: number;
  rootMargin?: string;
  monitorPerformance?: boolean;
  componentName?: string;
  [key: string]: any;
}

const OptimizedComponent = forwardRef<HTMLDivElement, OptimizedComponentProps>(
  (
    {
      children,
      className = '',
      style,
      onIntersect,
      threshold = 0.1,
      rootMargin = '50px',
      monitorPerformance = false,
      componentName = 'OptimizedComponent',
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const combinedRef = useCallback(
      (node: HTMLDivElement) => {
        internalRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    const performanceMonitor = usePerformanceMonitor(componentName);

    // Intersection Observer for lazy loading
    useEffect(() => {
      if (!onIntersect || !internalRef.current) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              onIntersect();
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold,
          rootMargin,
        }
      );

      observer.observe(internalRef.current);

      return () => {
        if (internalRef.current) {
          observer.unobserve(internalRef.current);
        }
      };
    }, [onIntersect, threshold, rootMargin]);

    // Performance monitoring
    useEffect(() => {
      if (monitorPerformance) {
        performanceMonitor('render', () => {
          // Component rendered
        });
      }
    });

    return (
      <div
        ref={combinedRef}
        className={className}
        style={style}
        {...props}
      >
        {children}
      </div>
    );
  }
);

OptimizedComponent.displayName = 'OptimizedComponent';

// Memoized version for components that don't change often
export const MemoizedComponent = memo(OptimizedComponent);

// Lazy loading wrapper
export const LazyComponent: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
}> = ({ children, fallback, threshold = 0.1 }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);

  const handleIntersect = useCallback(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (isVisible && !isLoaded) {
      // Simulate loading delay for better UX
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isVisible, isLoaded]);

  return (
    <OptimizedComponent
      onIntersect={handleIntersect}
      threshold={threshold}
      monitorPerformance={true}
      componentName="LazyComponent"
    >
      {isLoaded ? children : fallback || <div className="animate-pulse bg-muted h-32 rounded-lg" />}
    </OptimizedComponent>
  );
};

// Virtual scrolling wrapper
export const VirtualScrollContainer: React.FC<{
  items: any[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: any, index: number) => React.ReactNode;
}> = ({ items, itemHeight, containerHeight, renderItem }) => {
  const [scrollTop, setScrollTop] = React.useState(0);

  const visibleItems = React.useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );

    return items.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      index: startIndex + index,
      style: {
        position: 'absolute' as const,
        top: (startIndex + index) * itemHeight,
        height: itemHeight,
      },
    }));
  }, [items, itemHeight, containerHeight, scrollTop]);

  const totalHeight = items.length * itemHeight;

  return (
    <div
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map((item) => (
          <div key={item.index} style={item.style}>
            {renderItem(item, item.index)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OptimizedComponent; 