import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { env } from './env';

// Global error log
declare global {
  interface Window {
    errorLog: any[];
    debugMode: boolean;
  }
}

// Initialize global error log
if (typeof window !== 'undefined') {
  window.errorLog = [];
  window.debugMode = env.isDevelopment;
}

// System Health Check
export const systemHealthCheck = async () => {
  const health = {
    timestamp: new Date().toISOString(),
    platform: {
      userAgent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      connection: (navigator as any).connection?.effectiveType || 'unknown',
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
    },
    integrations: {
      supabase: await checkSupabaseConnection(),
      mapbox: checkMapboxStatus(),
      stripe: checkStripeStatus(),
    },
    performance: {
      memory: (performance as any).memory ? {
        used: Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round((performance as any).memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round((performance as any).memory.jsHeapSizeLimit / 1024 / 1024),
      } : null,
      navigation: performance.getEntriesByType('navigation')[0] ? {
        loadEventEnd: performance.getEntriesByType('navigation')[0].loadEventEnd,
        domContentLoadedEventEnd: performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd,
        firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime,
      } : null,
    },
    errors: window.errorLog || [],
    debugMode: window.debugMode,
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
      timestamp: new Date().toISOString(),
    };
  } catch (err: any) {
    return { 
      status: 'failed', 
      error: err.message,
      timestamp: new Date().toISOString(),
    };
  }
};

const checkMapboxStatus = () => {
  return {
    loaded: typeof (window as any).mapboxgl !== 'undefined',
    token: !!(window as any).mapboxgl?.accessToken,
    supported: (window as any).mapboxgl?.supported?.() || false,
    timestamp: new Date().toISOString(),
  };
};

const checkStripeStatus = () => {
  return {
    loaded: typeof (window as any).Stripe !== 'undefined',
    testMode: env.isDevelopment,
    timestamp: new Date().toISOString(),
  };
};

// Performance Monitoring
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
    const errorInfo = {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
      timestamp: new Date().toISOString(),
    };

    window.errorLog.push(errorInfo);
    console.error('🚨 [Error Monitor]', errorInfo);
  });

  // Monitor unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const errorInfo = {
      reason: event.reason,
      promise: event.promise,
      timestamp: new Date().toISOString(),
    };

    window.errorLog.push(errorInfo);
    console.error('🚨 [Promise Error]', errorInfo);
  });

  // Monitor performance issues
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.duration > 1000) {
        console.warn('⚠️ [Performance] Slow operation detected:', {
          name: entry.name,
          duration: `${entry.duration.toFixed(2)}ms`,
          timestamp: new Date().toISOString(),
        });
      }
    });
  });
  
  observer.observe({ entryTypes: ['measure', 'navigation'] });
};

// UX Debug Hook
export const useUXDebug = () => {
  const [debugInfo, setDebugInfo] = React.useState({
    screenSize: { width: window.innerWidth, height: window.innerHeight },
    userPath: window.location.pathname,
    interactions: [] as any[],
  });

  const logInteraction = React.useCallback((interaction: string, data?: any) => {
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

  React.useEffect(() => {
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

// Logger with environment-based logging
export const logger = {
  debug: (message: string, data?: any) => {
    if (env.isDevelopment) {
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

// Error Tracking
export const setupErrorTracking = () => {
  const sendError = (error: Error, context?: any) => {
    const errorInfo = {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name,
      },
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // In production, send to error tracking service
    if (env.isProduction) {
      // Replace with your error tracking service
      console.error('🚨 [Error Tracking]', errorInfo);
    } else {
      console.error('🚨 [Error Tracking]', errorInfo);
    }
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

// Memory Usage Monitor
export const monitorMemoryUsage = () => {
  if (!(performance as any).memory) return;

  const checkMemory = () => {
    const memory = (performance as any).memory;
    const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
    const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024);
    const limitMB = Math.round(memory.jsHeapSizeLimit / 1024 / 1024);
    const usagePercent = Math.round((usedMB / limitMB) * 100);

    if (usagePercent > 80) {
      console.warn('⚠️ [Memory] High memory usage detected:', {
        used: `${usedMB}MB`,
        total: `${totalMB}MB`,
        limit: `${limitMB}MB`,
        usage: `${usagePercent}%`,
      });
    }

    return { usedMB, totalMB, limitMB, usagePercent };
  };

  // Check memory every 30 seconds
  const interval = setInterval(checkMemory, 30000);
  
  return () => clearInterval(interval);
};

// Network Monitor
export const monitorNetworkStatus = () => {
  const checkConnection = () => {
    const connection = (navigator as any).connection;
    if (connection) {
      console.log('🌐 [Network]', {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData,
      });
    }
  };

  if ('connection' in navigator) {
    (navigator as any).connection.addEventListener('change', checkConnection);
    checkConnection();
  }
};

// Debug Console Commands
export const setupDebugCommands = () => {
  if (typeof window !== 'undefined') {
    (window as any).debugCommands = {
      systemHealth: systemHealthCheck,
      memoryUsage: monitorMemoryUsage,
      clearErrors: () => { window.errorLog = []; },
      getErrors: () => window.errorLog,
      toggleDebugMode: () => { window.debugMode = !window.debugMode; },
    };

    console.log('🔧 [Debug] Commands available:', Object.keys((window as any).debugCommands));
  }
};

// Initialize all debugging tools
export const initializeDebugging = () => {
  if (env.isDevelopment) {
    setupPerformanceMonitoring();
    setupErrorTracking();
    monitorMemoryUsage();
    monitorNetworkStatus();
    setupDebugCommands();
    
    console.log('🔧 [Debug] All debugging tools initialized');
  }
}; 