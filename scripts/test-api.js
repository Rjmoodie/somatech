#!/usr/bin/env node
import { pdufaAPI } from '../src/api/pdufa-api.js';

async function testAPI() {
  console.log('🧪 Testing PDUFA API...\n');
  
  try {
    console.log('📡 Testing getAllPDUFAs...');
    const response = await pdufaAPI.getAllPDUFAs();
    
    console.log('\n📊 API Response:');
    console.log(`Success: ${response.success}`);
    console.log(`Total: ${response.total}`);
    console.log(`Data length: ${response.data?.length || 0}`);
    
    if (response.data && response.data.length > 0) {
      console.log('\n📋 Sample data:');
      response.data.slice(0, 3).forEach((item, index) => {
        console.log(`${index + 1}. ${item.ticker} - ${item.company} - ${item.drug} (${item.pdufaDate})`);
      });
    } else {
      console.log('❌ No data in API response');
    }
    
    return response.data && response.data.length > 0;
  } catch (error) {
    console.error('❌ API test failed:', error);
    return false;
  }
}

// Run the test
testAPI()
  .then(success => {
    console.log(`\n${success ? '✅' : '❌'} API Test ${success ? 'PASSED' : 'FAILED'}`);
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Test runner error:', error);
    process.exit(1);
  });


