// Test file to verify environment variables are working
import { env, getEnvVar } from './env';

export const testEnvironmentVariables = () => {
  console.log('🔧 Testing environment variables...');
  
  // Test our env object
  console.log('NODE_ENV:', env.NODE_ENV);
  console.log('isDevelopment:', env.isDevelopment);
  console.log('isProduction:', env.isProduction);
  console.log('VITE_MAPBOX_TOKEN exists:', !!env.VITE_MAPBOX_TOKEN);
  console.log('VITE_VAPID_PUBLIC_KEY exists:', !!env.VITE_VAPID_PUBLIC_KEY);
  
  // Test direct access
  console.log('Direct VITE_MAPBOX_TOKEN:', getEnvVar('VITE_MAPBOX_TOKEN'));
  console.log('Direct NODE_ENV:', getEnvVar('NODE_ENV'));
  
  // Test process object (should be defined now)
  if (typeof process !== 'undefined') {
    console.log('✅ process object is available');
    console.log('process.env.NODE_ENV:', process.env?.NODE_ENV);
  } else {
    console.log('❌ process object is not available');
  }
  
  // Test import.meta.env
  console.log('import.meta.env.MODE:', import.meta.env.MODE);
  console.log('import.meta.env.VITE_MAPBOX_TOKEN exists:', !!import.meta.env.VITE_MAPBOX_TOKEN);
  
  return {
    envWorking: true,
    processAvailable: typeof process !== 'undefined',
    importMetaWorking: !!import.meta.env.MODE,
  };
}; 