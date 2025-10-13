/**
 * Environment verification utility
 * Use this to check if your .env variables are being read correctly
 */

import { config } from './environment';

/**
 * Verify environment configuration
 */
export function verifyEnvironment() {
  console.log('🔧 STREAMIA Environment Verification:');
  console.log('=====================================');
  
  // Check API URL
  console.log('📡 API Base URL:', config.API_BASE_URL);
  
  // Check if it's using localhost (might indicate .env not loaded)
  if (config.API_BASE_URL.includes('localhost:3000')) {
    console.warn('⚠️  Using default localhost URL. Check your .env file:');
    console.warn('   - Make sure you have a .env file in your project root');
    console.warn('   - Make sure it contains: VITE_API_URL=your_backend_url');
    console.warn('   - Restart your dev server after creating .env');
  } else {
    console.log('✅ Custom API URL detected - .env file is working!');
  }
  
  // Check other variables
  console.log('📱 App Name:', config.APP_NAME);
  console.log('🔢 App Version:', config.APP_VERSION);
  console.log('🐛 Debug Mode:', config.DEBUG);
  
  console.log('=====================================');
  
  return {
    apiUrl: config.API_BASE_URL,
    isUsingCustomUrl: !config.API_BASE_URL.includes('localhost:3000'),
    appName: config.APP_NAME,
    appVersion: config.APP_VERSION,
    debug: config.DEBUG
  };
}

/**
 * Test API connectivity
 */
export async function testAPIConnectivity() {
  console.log('🌐 Testing API connectivity...');
  
  try {
    const response = await fetch(`${config.API_BASE_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    });
    
    if (response.ok) {
      console.log('✅ Backend is reachable!');
      return true;
    } else {
      console.log('❌ Backend responded with error:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Backend is not reachable:', error);
    console.log('💡 Make sure your backend is running on:', config.API_BASE_URL);
    return false;
  }
}
