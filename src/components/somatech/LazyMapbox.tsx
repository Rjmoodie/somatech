import React, { lazy, Suspense } from 'react';

// Lazy load Mapbox components
const MapboxMap = lazy(() => import('./real-estate/EnhancedPropertyMap'));
const LeadMap = lazy(() => import('./lead-gen/LeadMap'));
const MapEngine = lazy(() => import('./lead-gen/MapEngine'));

interface LazyMapboxProps {
  type: 'property' | 'lead' | 'engine';
  [key: string]: any;
}

const LazyMapbox: React.FC<LazyMapboxProps> = ({ type, ...props }) => {
  const MapComponent = React.useMemo(() => {
    switch (type) {
      case 'property':
        return MapboxMap;
      case 'lead':
        return LeadMap;
      case 'engine':
        return MapEngine;
      default:
        return MapboxMap;
    }
  }, [type]);

  return (
    <Suspense 
      fallback={
        <div className="w-full h-[400px] bg-muted animate-pulse rounded-lg flex items-center justify-center">
          <div className="text-muted-foreground">Loading map...</div>
        </div>
      }
    >
      <MapComponent {...props} />
    </Suspense>
  );
};

export default LazyMapbox; 