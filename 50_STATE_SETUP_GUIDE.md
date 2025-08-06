# 🚀 50-State Data Integration Setup Guide

## 📋 Prerequisites

Before starting the 50-state data integration, ensure you have:

- ✅ Node.js 18+ installed
- ✅ npm or yarn package manager
- ✅ Mapbox API key (free tier available)
- ✅ Supabase project configured
- ✅ Stable internet connection

## 🔧 Quick Setup

### 1. Install Dependencies

```bash
# Install all dependencies including Puppeteer
npm install
```

### 2. Environment Configuration

Create a `.env` file in your project root:

```env
# Required: Mapbox API Key (get free key at https://account.mapbox.com/)
VITE_MAPBOX_API_KEY=pk.your_mapbox_api_key_here

# Required: Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Enhanced Data Sources
VITE_CENSUS_API_KEY=your_census_api_key
VITE_FEMA_API_KEY=your_fema_api_key
```

### 3. Get API Keys

#### Mapbox API Key (Required)
1. Go to [Mapbox Account](https://account.mapbox.com/)
2. Create a free account
3. Generate a public access token
4. Add to your `.env` file

#### Supabase Setup (Required)
1. Go to [Supabase](https://supabase.com/)
2. Create a new project
3. Copy your project URL and anon key
4. Add to your `.env` file

#### Optional: Census API Key
1. Go to [Census API](https://api.census.gov/data/key_signup.html)
2. Request a free API key
3. Add to your `.env` file for enhanced demographic data

## 🎯 Getting Started

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Access the Dashboard

Navigate to the 50-State Data Integration dashboard:

1. Open your browser to `http://localhost:5173`
2. Navigate to **Real Estate** → **50-State Data Integration**
3. Or directly visit: `http://localhost:5173/#/50-state-integration`

### 3. First Run

1. **Check Configuration**: The dashboard will validate your environment setup
2. **Start Integration**: Click "Start Integration" to begin the process
3. **Monitor Progress**: Watch real-time progress across all phases
4. **Download Results**: Export data in CSV, JSON, or GeoJSON formats

## 📊 What the System Does

### Phase 1: County Discovery
- Automatically discovers data sources for all 3,142 counties
- Validates URLs and identifies working selectors
- Prioritizes sources based on data quality and accessibility

### Phase 2: Data Scraping
- Intelligent web scraping with multiple strategies
- Rate limiting and error recovery
- Browser pool management for efficiency

### Phase 3: Data Processing
- Address standardization and geocoding
- Deduplication and data enrichment
- Quality assessment and validation

### Phase 4: Federal Data Integration
- US Census Bureau data
- FEMA flood zone information
- EPA environmental data
- HUD REO properties

## 🔍 Monitoring & Control

### Dashboard Features
- **Real-time Status**: Live progress tracking
- **Quality Metrics**: Data quality assessment
- **Error Reporting**: Detailed error logs
- **Export Options**: Multiple format support
- **Performance Monitoring**: System health checks

### Control Options
- **Start/Stop**: Control integration process
- **Pause/Resume**: Manage long-running operations
- **Refresh**: Update status manually
- **Download**: Export processed data

## 📈 Expected Results

### Data Coverage
- **3,142 Counties**: All US counties covered
- **50 States**: Complete nationwide coverage
- **Federal Data**: Census, FEMA, EPA, HUD integration
- **Property Records**: Tax delinquent, code violations, pre-foreclosures

### Performance Metrics
- **Processing Speed**: ~100 properties/minute
- **Data Quality**: 85%+ accuracy target
- **Coverage Rate**: 70%+ county coverage
- **Enrichment**: 60%+ federal data integration

## 🛠️ Troubleshooting

### Common Issues

#### 1. Mapbox API Key Error
```
Error: MAPBOX_API_KEY is required for geocoding functionality
```
**Solution**: Add your Mapbox API key to `.env` file

#### 2. Supabase Connection Error
```
Error: Supabase configuration is required for data storage
```
**Solution**: Configure Supabase URL and anon key in `.env`

#### 3. Puppeteer Installation Issues
```
Error: Puppeteer browser not found
```
**Solution**: 
```bash
# Reinstall Puppeteer
npm uninstall puppeteer
npm install puppeteer
```

#### 4. Memory Issues
```
Error: JavaScript heap out of memory
```
**Solution**: Increase Node.js memory limit
```bash
# Add to package.json scripts
"dev": "node --max-old-space-size=4096 node_modules/.bin/vite"
```

### Performance Optimization

#### For Large Datasets
1. **Increase Memory**: Set `--max-old-space-size=8192`
2. **Batch Processing**: Reduce batch size in configuration
3. **Concurrent Limits**: Lower browser pool size
4. **Rate Limiting**: Increase delays between requests

#### For Development
1. **Test Mode**: Use smaller datasets for testing
2. **Mock Data**: Enable mock mode for development
3. **Local Testing**: Test with single county first

## 🔒 Security & Compliance

### Data Privacy
- **PII Protection**: Personal data is masked
- **Local Processing**: Data processed locally
- **Secure Storage**: Encrypted database storage
- **Access Control**: Role-based permissions

### Rate Limiting
- **Respectful Scraping**: Built-in delays and limits
- **Robots.txt**: Respects website policies
- **Error Handling**: Graceful failure recovery
- **Retry Logic**: Intelligent retry mechanisms

## 📚 Advanced Configuration

### Custom Configuration
Edit `src/config/environment.ts` for advanced settings:

```typescript
// Scraping configuration
MAX_CONCURRENT_BROWSERS: 5,
REQUEST_DELAY_MS: 1000,
MAX_RETRIES: 3,

// Data processing
BATCH_SIZE: 100,
GEOCODING_RATE_LIMIT: 600
```

### API Rate Limits
- **Mapbox**: 600 requests/minute (free tier)
- **Census**: 500 requests/day (free tier)
- **FEMA**: No rate limit (public data)
- **EPA**: No rate limit (public data)

## 🎉 Success Indicators

### Integration Complete
- ✅ All phases completed successfully
- ✅ Data quality metrics above 85%
- ✅ Coverage rate above 70%
- ✅ No critical errors in logs

### Data Quality Metrics
- **Address Accuracy**: 90%+ standardized addresses
- **Geocoding Success**: 85%+ successful geocoding
- **Deduplication**: 95%+ duplicate removal
- **Enrichment**: 60%+ federal data integration

## 📞 Support

### Getting Help
1. **Check Logs**: Review browser console for errors
2. **Validate Config**: Ensure all API keys are correct
3. **Test Connectivity**: Verify internet connection
4. **Review Documentation**: Check README files

### Next Steps
After successful setup:
1. **Explore Data**: Review processed property records
2. **Customize Filters**: Adjust data collection parameters
3. **Export Results**: Download data for analysis
4. **Integrate with Lead Gen**: Connect to lead generation system

---

**Ready to start?** Navigate to the 50-State Data Integration dashboard and click "Start Integration" to begin your comprehensive data collection journey! 🚀 