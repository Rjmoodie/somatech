# 🔧 Somatech Debugging & Optimization Guide

## 🎯 Objective
Ensure the Somatech platform operates with maximum efficiency, clean user experience, real-time responsiveness, and optimized integrations (MapBox, Supabase, Stripe, etc.).

## 📋 Quick Start Commands

```bash
# Development with debugging
npm run dev

# Build and analyze bundle
npm run build
npm run build:analyze

# Performance monitoring
npm run lint
```

---

## 🔍 1. Global System Health Check

### Runtime Health Monitor
```typescript
// Add to src/lib/debug.ts
export const systemHealthCheck = async () => {
  const health = {
    timestamp: new Date().toISOString(),
    platform: {
      userAgent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      connection: (navigator as any).connection?.effectiveType || 'unknown',
    },
    integrations: {
      supabase: await checkSupabaseConnection(),
      mapbox: checkMapboxStatus(),
      stripe: checkStripeStatus(),
    },
    performance: {
      memory: (performance as any).memory,
      navigation: performance.getEntriesByType('navigation')[0],
    },
    errors: window.errorLog || [],
  };

  console.log('🏥 [SystemHealth]', health);
  return health;
};

const checkSupabaseConnection = async () => {
  try {
    const start = performance.now();
    const { data, error } = await supabase.from('system_settings').select('*').limit(1);
    const latency = performance.now() - start;
    
    return {
      status: error ? 'error' : 'connected',
      latency: `${latency.toFixed(2)}ms`,
      error: error?.message,
    };
  } catch (err) {
    return { status: 'failed', error: err.message };
  }
};

const checkMapboxStatus = () => {
  return {
    loaded: typeof mapboxgl !== 'undefined',
    token: !!mapboxgl?.accessToken,
    supported: mapboxgl?.supported?.() || false,
  };
};

const checkStripeStatus = () => {
  return {
    loaded: typeof window.Stripe !== 'undefined',
    testMode: process.env.NODE_ENV === 'development',
  };
};
```

### Health Check Integration
```typescript
// Add to src/components/somatech/PerformanceProvider.tsx
useEffect(() => {
  // Run health check on app start
  systemHealthCheck();
  
  // Monitor for performance issues
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.duration > 1000) {
        console.warn('⚠️ [Performance] Slow operation detected:', entry);
      }
    });
  });
  
  observer.observe({ entryTypes: ['measure', 'navigation'] });
  
  return () => observer.disconnect();
}, []);
```

---

## ⚙️ 2. Lead Generation Module Debug

### Enhanced Debugging Hook
```typescript
// Add to src/components/somatech/lead-gen/useLeadGenDebug.ts
export const useLeadGenDebug = (properties: any[], filters: any, isLoading: boolean) => {
  const debugInfo = useMemo(() => ({
    timestamp: new Date().toISOString(),
    data: {
      propertyCount: properties?.length || 0,
      filterCount: Object.keys(filters || {}).length,
      lastUpdated: properties?.[0]?.last_updated,
      sampleProperty: properties?.[0] ? {
        id: properties[0].id,
        address: properties[0].address,
        equity: properties[0].equity_percent,
      } : null,
    },
    state: {
      isLoading,
      hasError: false,
      filterState: filters,
    },
    performance: {
      renderTime: performance.now(),
      memoryUsage: (performance as any).memory?.usedJSHeapSize,
    },
  }), [properties, filters, isLoading]);

  useEffect(() => {
    console.log('🏠 [LeadGen Debug]', debugInfo);
    
    // Performance warnings
    if (properties?.length > 1000) {
      console.warn('⚠️ [LeadGen] Large dataset detected, consider pagination');
    }
    
    if (Object.keys(filters || {}).length > 10) {
      console.warn('⚠️ [LeadGen] Many active filters, check for conflicts');
    }
  }, [debugInfo]);

  return debugInfo;
};
```

### Filter Performance Monitor
```typescript
// Add to src/components/somatech/lead-gen/FilterSidebar.tsx
const useFilterPerformance = () => {
  const filterCount = useRef(0);
  const lastFilterTime = useRef(0);

  const logFilterChange = useCallback((filterType: string, value: any) => {
    const now = performance.now();
    const timeSinceLast = now - lastFilterTime.current;
    
    console.log('🔍 [Filter Debug]', {
      filterType,
      value,
      timeSinceLastFilter: `${timeSinceLast.toFixed(2)}ms`,
      totalFilters: ++filterCount.current,
    });
    
    lastFilterTime.current = now;
  }, []);

  return { logFilterChange };
};
```

---

## 📦 3. Supabase Data Sync Optimization

### Connection Monitor
```typescript
// Add to src/lib/supabase/debug.ts
export const supabaseDebug = {
  async testConnection() {
    const start = performance.now();
    const { data, error, count } = await supabase
      .from('properties')
      .select('id, address, zip', { count: 'exact' })
      .limit(1);
    
    const latency = performance.now() - start;
    
    console.log('🗄️ [Supabase Test]', {
      status: error ? 'error' : 'success',
      latency: `${latency.toFixed(2)}ms`,
      dataCount: count,
      sampleData: data?.[0],
      error: error?.message,
    });
    
    return { data, error, latency };
  },

  async checkIndexes() {
    const queries = [
      { name: 'zip_filter', query: supabase.from('properties').select('id').eq('zip', '12345') },
      { name: 'equity_filter', query: supabase.from('properties').select('id').gte('equity_percent', 20) },
      { name: 'owner_type_filter', query: supabase.from('properties').select('id').eq('owner_type', 'individual') },
    ];

    for (const { name, query } of queries) {
      const start = performance.now();
      const { error } = await query.limit(1);
      const latency = performance.now() - start;
      
      console.log(`📊 [Index Check] ${name}:`, {
        latency: `${latency.toFixed(2)}ms`,
        status: error ? 'needs_index' : 'optimized',
        error: error?.message,
      });
    }
  },

  monitorRealtime() {
    const subscription = supabase
      .channel('debug_channel')
      .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
        console.log('🔄 [Realtime Debug]', {
          table: payload.table,
          event: payload.eventType,
          record: payload.new,
          timestamp: new Date().toISOString(),
        });
      })
      .subscribe();

    return subscription;
  },
};
```

---

## 🗺️ 4. Map Performance (Mapbox) Optimization

### Map Performance Monitor
```typescript
// Add to src/components/somatech/LazyMapbox.tsx
export const useMapPerformance = (mapRef: React.MutableRefObject<mapboxgl.Map | null>) => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(0);

  const logMapEvent = useCallback((event: string, data?: any) => {
    const now = performance.now();
    const timeSinceLast = now - lastRenderTime.current;
    
    console.log('🗺️ [Map Debug]', {
      event,
      timeSinceLastRender: `${timeSinceLast.toFixed(2)}ms`,
      renderCount: ++renderCount.current,
      data,
      timestamp: new Date().toISOString(),
    });
    
    lastRenderTime.current = now;
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Monitor map events
    const events = ['load', 'moveend', 'zoomend', 'render'];
    events.forEach(event => {
      map.on(event, () => logMapEvent(event));
    });

    // Monitor performance
    map.on('render', () => {
      const fps = 1000 / (performance.now() - lastRenderTime.current);
      if (fps < 30) {
        console.warn('⚠️ [Map Performance] Low FPS detected:', fps.toFixed(1));
      }
    });

    return () => {
      events.forEach(event => {
        map.off(event, () => logMapEvent(event));
      });
    };
  }, [mapRef, logMapEvent]);

  return { logMapEvent };
};
```

### Clustering Optimization
```typescript
// Add to src/components/somatech/lead-gen/MapEngine.tsx
const optimizeMapClustering = (map: mapboxgl.Map, data: any[]) => {
  // Use Supercluster for better performance
  const cluster = new Supercluster({
    radius: 40,
    maxZoom: 16,
    minPoints: 3,
  });

  const points = data.map(property => ({
    type: 'Feature',
    properties: { cluster: false, propertyId: property.id },
    geometry: {
      type: 'Point',
      coordinates: [property.longitude, property.latitude],
    },
  }));

  cluster.load(points);

  // Add clustered source
  map.addSource('clusters', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: points,
    },
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50,
  });

  console.log('🗺️ [Clustering]', {
    totalPoints: points.length,
    clusters: cluster.getClusters([-180, -85, 180, 85], 10).length,
    performance: 'optimized',
  });
};
```

---

## 💬 5. Real-time Messaging/Notifications

### Notification Debug Monitor
```typescript
// Add to src/components/somatech/NotificationCenter.tsx
export const useNotificationDebug = () => {
  const notificationLog = useRef<any[]>([]);

  const logNotification = useCallback((notification: any) => {
    const logEntry = {
      id: notification.id,
      type: notification.type,
      timestamp: new Date().toISOString(),
      deliveryStatus: 'sent',
      userAction: null,
    };

    notificationLog.current.push(logEntry);
    console.log('🔔 [Notification Debug]', logEntry);

    // Keep only last 100 notifications
    if (notificationLog.current.length > 100) {
      notificationLog.current = notificationLog.current.slice(-100);
    }
  }, []);

  const getNotificationStats = () => {
    const stats = notificationLog.current.reduce((acc, notif) => {
      acc[notif.type] = (acc[notif.type] || 0) + 1;
      return acc;
    }, {});

    console.log('📊 [Notification Stats]', stats);
    return stats;
  };

  return { logNotification, getNotificationStats };
};
```

---

## 🧪 6. UI/UX Debugging

### UX Debug Hook
```typescript
// Add to src/lib/debug.ts
export const useUXDebug = () => {
  const [debugInfo, setDebugInfo] = useState({
    screenSize: { width: window.innerWidth, height: window.innerHeight },
    userPath: window.location.pathname,
    interactions: [] as any[],
  });

  const logInteraction = useCallback((interaction: string, data?: any) => {
    const interactionLog = {
      type: interaction,
      timestamp: new Date().toISOString(),
      pathname: window.location.pathname,
      data,
    };

    setDebugInfo(prev => ({
      ...prev,
      interactions: [...prev.interactions.slice(-50), interactionLog],
    }));

    console.log('👆 [UX Debug]', interactionLog);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setDebugInfo(prev => ({
        ...prev,
        screenSize: { width: window.innerWidth, height: window.innerHeight },
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { debugInfo, logInteraction };
};
```

### Accessibility Monitor
```typescript
// Add to src/components/somatech/AccessibilityMonitor.tsx
export const AccessibilityMonitor = () => {
  useEffect(() => {
    const checkAccessibility = () => {
      const issues = [];

      // Check for missing alt text
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        if (!img.alt && !img.getAttribute('aria-label')) {
          issues.push(`Missing alt text: ${img.src}`);
        }
      });

      // Check for proper heading structure
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let lastLevel = 0;
      headings.forEach(heading => {
        const level = parseInt(heading.tagName[1]);
        if (level > lastLevel + 1) {
          issues.push(`Skipped heading level: ${heading.tagName}`);
        }
        lastLevel = level;
      });

      // Check for keyboard navigation
      const focusableElements = document.querySelectorAll('button, a, input, select, textarea');
      focusableElements.forEach(el => {
        if (el.getAttribute('tabindex') === '-1') {
          issues.push(`Element not keyboard accessible: ${el.tagName}`);
        }
      });

      if (issues.length > 0) {
        console.warn('♿ [Accessibility Issues]', issues);
      } else {
        console.log('♿ [Accessibility] All checks passed');
      }
    };

    // Run on mount and after route changes
    checkAccessibility();
    const observer = new MutationObserver(checkAccessibility);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
};
```

---

## 🧾 7. Stripe Integration Debug

### Stripe Debug Monitor
```typescript
// Add to src/lib/stripe/debug.ts
export const stripeDebug = {
  async testConnection() {
    try {
      const stripe = window.Stripe(process.env.VITE_STRIPE_PUBLISHABLE_KEY!);
      const { error } = await stripe.confirmCardSetup('seti_test', {
        payment_method: {
          card: {
            number: '4242424242424242',
            exp_month: 12,
            exp_year: 2024,
            cvc: '123',
          },
        },
      });

      console.log('💳 [Stripe Test]', {
        status: error ? 'error' : 'success',
        error: error?.message,
        testMode: true,
      });

      return { success: !error, error };
    } catch (err) {
      console.error('💳 [Stripe Error]', err);
      return { success: false, error: err };
    }
  },

  async testWebhook() {
    // Test webhook endpoint
    const response = await fetch('/api/stripe/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'payment_intent.succeeded',
        data: { object: { id: 'pi_test' } },
      }),
    });

    console.log('🔗 [Webhook Test]', {
      status: response.status,
      success: response.ok,
    });
  },

  monitorTransactions() {
    // Monitor transaction events
    const events = ['payment_intent.succeeded', 'payment_intent.failed', 'customer.subscription.created'];
    
    events.forEach(event => {
      // Listen for webhook events
      console.log(`💰 [Stripe Event] ${event} monitored`);
    });
  },
};
```

---

## 🧹 8. Performance Audit Commands

### Automated Performance Check
```bash
#!/bin/bash
# Add to scripts/performance-audit.sh

echo "🔍 Starting Performance Audit..."

# Build and analyze
echo "📦 Building application..."
npm run build

echo "📊 Analyzing bundle..."
npm run build:analyze

# Run tests
echo "🧪 Running tests..."
npm run test

# Lint check
echo "🔍 Linting code..."
npm run lint

# Performance metrics
echo "📈 Performance metrics:"
echo "- Bundle size: $(du -sh dist/ | cut -f1)"
echo "- Build time: $(date)"
echo "- Memory usage: $(node -e "console.log(process.memoryUsage().heapUsed / 1024 / 1024 + ' MB')")"

echo "✅ Performance audit complete!"
```

### Lighthouse Integration
```typescript
// Add to src/lib/performance/lighthouse.ts
export const runLighthouseAudit = async () => {
  const lighthouse = await import('lighthouse');
  const chromeLauncher = await import('chrome-launcher');

  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
  };

  const runnerResult = await lighthouse('http://localhost:8080', options, undefined);
  const reportResults = runnerResult.lhr;

  console.log('🏆 [Lighthouse Results]', {
    performance: reportResults.categories.performance.score * 100,
    accessibility: reportResults.categories.accessibility.score * 100,
    bestPractices: reportResults.categories['best-practices'].score * 100,
    seo: reportResults.categories.seo.score * 100,
  });

  await chrome.kill();
  return reportResults;
};
```

---

## 🛠️ 9. Optimization Checklist

### Immediate Actions
- [ ] **Images**: Convert to WebP + implement lazy loading
- [ ] **Bundle**: Verify code splitting is working
- [ ] **Database**: Check Supabase indexes on heavy queries
- [ ] **Maps**: Implement clustering for dense areas
- [ ] **React**: Add React.memo, useMemo, useCallback where needed

### Performance Targets
| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Bundle Size | < 2MB | ~3.5MB | ⚠️ Needs optimization |
| First Contentful Paint | < 1.5s | TBD | 📊 Monitor |
| Largest Contentful Paint | < 2.5s | TBD | 📊 Monitor |
| Cumulative Layout Shift | < 0.1 | TBD | 📊 Monitor |
| Supabase Latency | < 300ms | TBD | 📊 Monitor |

### Monitoring Setup
```typescript
// Add to src/lib/monitoring.ts
export const setupPerformanceMonitoring = () => {
  // Monitor Core Web Vitals
  if ('web-vital' in window) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(console.log);
      getFID(console.log);
      getFCP(console.log);
      getLCP(console.log);
      getTTFB(console.log);
    });
  }

  // Monitor errors
  window.addEventListener('error', (event) => {
    console.error('🚨 [Error Monitor]', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
    });
  });

  // Monitor unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('🚨 [Promise Error]', {
      reason: event.reason,
      promise: event.promise,
    });
  });
};
```

---

## 📊 10. Debug Console Commands

### Quick Debug Commands
```javascript
// Run in browser console
// System health check
systemHealthCheck();

// Supabase connection test
supabaseDebug.testConnection();

// Map performance check
mapPerformance.logMapEvent('debug_check');

// Notification stats
notificationDebug.getNotificationStats();

// UX interaction log
uxDebug.logInteraction('manual_test');

// Stripe test
stripeDebug.testConnection();

// Performance audit
runLighthouseAudit();
```

---

## 🎯 11. Production Monitoring

### Error Tracking
```typescript
// Add to src/lib/errorTracking.ts
export const setupErrorTracking = () => {
  // Send errors to monitoring service
  const sendError = (error: Error, context?: any) => {
    // Replace with your error tracking service
    console.error('🚨 [Error Tracking]', { error, context, timestamp: new Date().toISOString() });
  };

  window.addEventListener('error', (event) => {
    sendError(event.error, {
      type: 'runtime_error',
      filename: event.filename,
      lineno: event.lineno,
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    sendError(new Error(event.reason), {
      type: 'unhandled_promise',
    });
  });
};
```

---

## 📝 12. Debug Logging Configuration

### Environment-based Logging
```typescript
// Add to src/lib/logger.ts
export const logger = {
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 [Debug] ${message}`, data);
    }
  },
  
  info: (message: string, data?: any) => {
    console.log(`ℹ️ [Info] ${message}`, data);
  },
  
  warn: (message: string, data?: any) => {
    console.warn(`⚠️ [Warning] ${message}`, data);
  },
  
  error: (message: string, error?: any) => {
    console.error(`🚨 [Error] ${message}`, error);
  },
  
  performance: (operation: string, duration: number) => {
    if (duration > 100) {
      console.warn(`⏱️ [Performance] ${operation} took ${duration.toFixed(2)}ms`);
    }
  },
};
```

---

## 🏁 Summary

This comprehensive debugging guide provides:

1. **System Health Monitoring** - Real-time platform status
2. **Module-specific Debugging** - Targeted debugging for each feature
3. **Performance Optimization** - Bundle analysis and optimization
4. **Integration Testing** - Supabase, Mapbox, Stripe validation
5. **UX Monitoring** - User interaction and accessibility tracking
6. **Production Monitoring** - Error tracking and performance metrics

Use these tools to maintain optimal performance and quickly identify and resolve issues across the Somatech platform.

**Remember**: Always test in development first, then validate in staging before deploying to production. 