#!/usr/bin/env node
import { enhancedPdufaScraper } from '../src/services/enhanced-pdufa-scraper.js';

async function testScraper() {
  console.log('🧪 Testing Enhanced PDUFA Scraper...\n');
  
  try {
    console.log('📡 Starting scrape...');
    const data = await enhancedPdufaScraper.scrapeAllSources();
    
    console.log('\n📊 Results:');
    console.log(`Total PDUFAs found: ${data.length}`);
    
    if (data.length > 0) {
      console.log('\n📋 Sample data:');
      data.slice(0, 3).forEach((item, index) => {
        console.log(`${index + 1}. ${item.ticker} - ${item.company} - ${item.drug} (${item.pdufaDate})`);
      });
    } else {
      console.log('❌ No data found');
    }
    
    return data.length > 0;
  } catch (error) {
    console.error('❌ Scraper test failed:', error);
    return false;
  }
}

// Run the test
testScraper()
  .then(success => {
    console.log(`\n${success ? '✅' : '❌'} Test ${success ? 'PASSED' : 'FAILED'}`);
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Test runner error:', error);
    process.exit(1);
  });


