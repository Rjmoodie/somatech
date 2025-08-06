// Environment configuration that works in both browser and Node.js
export const env = {
  NODE_ENV: typeof process !== 'undefined' ? process.env.NODE_ENV : import.meta.env.MODE,
  VITE_MAPBOX_TOKEN: typeof process !== 'undefined' ? process.env.VITE_MAPBOX_TOKEN : import.meta.env.VITE_MAPBOX_TOKEN,
  VITE_VAPID_PUBLIC_KEY: typeof process !== 'undefined' ? process.env.VITE_VAPID_PUBLIC_KEY : import.meta.env.VITE_VAPID_PUBLIC_KEY,
  MAPBOX_API_KEY: typeof process !== 'undefined' ? process.env.MAPBOX_API_KEY : import.meta.env.VITE_MAPBOX_TOKEN,
  isDevelopment: (typeof process !== 'undefined' ? process.env.NODE_ENV : import.meta.env.MODE) === 'development',
  isProduction: (typeof process !== 'undefined' ? process.env.NODE_ENV : import.meta.env.MODE) === 'production',
  isTest: (typeof process !== 'undefined' ? process.env.NODE_ENV : import.meta.env.MODE) === 'test',
};

// Safe process.env access
export const getProcessEnv = (key: string, fallback?: string): string => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || fallback || '';
  }
  return fallback || '';
};

// Safe environment variable access
export const getEnvVar = (key: string, fallback?: string): string => {
  // Try Vite's import.meta.env first
  if (import.meta.env && import.meta.env[key]) {
    return import.meta.env[key] as string;
  }
  
  // Fall back to process.env
  return getProcessEnv(key, fallback);
}; 