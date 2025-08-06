# 🚀 Real Data Sources Setup Guide

## Overview

SomaTech now supports integration with real property data sources. This guide will help you configure API keys and start using real data instead of mock data.

## 📋 Required API Keys

### 1. **ATTOM Data API** - High Quality Property Data
- **Cost**: $500/month + $0.01 per request
- **Sign up**: https://api.developer.attomdata.com/
- **Coverage**: All 50 states
- **Data Quality**: 95% accuracy, 90% completeness
- **Features**: Property details, owner info, sales history, tax assessments

### 2. **CoreLogic Data API** - Investment Property Data
- **Cost**: $750/month + $0.015 per request
- **Sign up**: https://developer.corelogic.com/
- **Coverage**: All 50 states
- **Data Quality**: 92% accuracy, 88% completeness
- **Features**: Investment analytics, market trends, risk assessment

### 3. **RentSpree API** - Rental Property Data
- **Cost**: $300/month + $0.005 per request
- **Sign up**: https://www.rentspree.com/developers
- **Coverage**: AZ, TX, FL, CA, NY, GA, NC, SC
- **Data Quality**: 88% accuracy, 85% completeness
- **Features**: Rental listings, tenant screening, rental analytics

### 4. **RealtyMole Property API** - Market Property Data
- **Cost**: $200/month + $0.008 per request
- **Sign up**: https://rapidapi.com/realty-mole-property-api
- **Coverage**: All 50 states
- **Data Quality**: 90% accuracy, 82% completeness
- **Features**: Property details, rental estimates, market analysis

### 5. **MLS Grid API** - MLS Listings
- **Cost**: $400/month + $0.012 per request
- **Sign up**: https://mlsgrid.com/
- **Coverage**: AZ, TX, FL, CA, NY, GA, NV, CO
- **Data Quality**: 95% accuracy, 92% completeness
- **Features**: MLS listings, listing history, agent data

### 6. **US Census Bureau API** - Demographic Data (FREE)
- **Cost**: FREE
- **Sign up**: https://api.census.gov/data/key_signup.html
- **Coverage**: All 50 states
- **Data Quality**: 99% accuracy, 98% completeness
- **Features**: Demographics, population data, housing data

### 7. **FEMA API** - Flood Zone Data (FREE)
- **Cost**: FREE
- **Sign up**: https://www.fema.gov/about/openfema
- **Coverage**: All 50 states
- **Data Quality**: 95% accuracy, 90% completeness
- **Features**: Flood zones, risk assessment, flood insurance data

## 🔧 Environment Configuration

Create a `.env` file in your project root with the following variables:

```bash
# Mapbox API (for geocoding and maps)
VITE_MAPBOX_TOKEN=your_mapbox_token_here

# Supabase Configuration (already configured)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Real Data Source API Keys
VITE_ATTOM_API_KEY=your_attom_api_key_here
VITE_CORELOGIC_API_KEY=your_corelogic_api_key_here
VITE_RENTSPREE_API_KEY=your_rentspree_api_key_here
VITE_REALTYMOLE_API_KEY=your_realtymole_api_key_here
VITE_MLSGRID_API_KEY=your_mlsgrid_api_key_here
VITE_CENSUS_API_KEY=your_census_api_key_here
VITE_FEMA_API_KEY=your_fema_api_key_here

# Development Configuration
VITE_APP_ENV=development
VITE_DEBUG_MODE=true
VITE_ENABLE_MAPBOX=true
VITE_ENABLE_SUPABASE=true
```

## 💰 Cost Analysis

### Monthly Costs (with 1000 requests/month per source):
- **ATTOM**: $500 + $10 = $510/month
- **CoreLogic**: $750 + $15 = $765/month
- **RentSpree**: $300 + $5 = $305/month
- **RealtyMole**: $200 + $8 = $208/month
- **MLS Grid**: $400 + $12 = $412/month
- **Census**: FREE
- **FEMA**: FREE

**Total Monthly Cost**: $2,200/month

### Cost Optimization Strategies:
1. **Start with FREE sources**: Census and FEMA APIs
2. **Add paid sources gradually**: Start with RealtyMole ($208/month)
3. **Use caching**: Reduce API calls with intelligent caching
4. **Monitor usage**: Track API usage to optimize costs

## 🚀 Getting Started

### Step 1: Configure API Keys
1. Sign up for the data sources you want to use
2. Add your API keys to the `.env` file
3. Restart your development server

### Step 2: Test Data Sources
1. Navigate to the "Data Sources" tab in the lead generation interface
2. Check the status of each data source
3. Test individual sources with sample addresses
4. Monitor response times and data quality

### Step 3: Enable Real Data
1. The system will automatically use real data when API keys are configured
2. Fall back to mock data when sources are unavailable
3. Monitor data quality and coverage

## 📊 Data Source Comparison

| Source | Cost/Month | Coverage | Accuracy | Best For |
|--------|------------|----------|----------|----------|
| ATTOM | $510 | All States | 95% | High-quality property data |
| CoreLogic | $765 | All States | 92% | Investment analytics |
| RentSpree | $305 | 8 States | 88% | Rental properties |
| RealtyMole | $208 | All States | 90% | Market analysis |
| MLS Grid | $412 | 8 States | 95% | Active listings |
| Census | FREE | All States | 99% | Demographics |
| FEMA | FREE | All States | 95% | Risk assessment |

## 🔍 Testing Your Setup

### 1. Check Data Source Status
- Go to "Data Sources" tab
- Verify all configured sources show "online" status
- Check response times and error rates

### 2. Test with Sample Addresses
- Use addresses from different states
- Test each data source individually
- Verify data quality and completeness

### 3. Monitor Performance
- Check cache hit rates
- Monitor API usage and costs
- Track data freshness and accuracy

## 🛠️ Troubleshooting

### Common Issues:

1. **API Key Errors**
   - Verify API keys are correct
   - Check if keys have proper permissions
   - Ensure keys are not expired

2. **Rate Limiting**
   - Monitor request frequency
   - Implement proper caching
   - Consider upgrading API plans

3. **Data Quality Issues**
   - Check data source status
   - Verify address formatting
   - Monitor error logs

4. **Performance Issues**
   - Enable caching
   - Optimize request patterns
   - Monitor response times

## 📈 Next Steps

1. **Start with FREE sources**: Census and FEMA APIs
2. **Add one paid source**: RealtyMole for market data
3. **Expand gradually**: Add more sources based on needs
4. **Monitor and optimize**: Track usage and costs
5. **Scale up**: Add more sources as business grows

## 🎯 Benefits of Real Data

- **Accurate property information**: Real market data instead of mock data
- **Comprehensive coverage**: Multiple data sources for complete picture
- **Investment insights**: Advanced analytics and scoring
- **Risk assessment**: Flood zones, demographics, market trends
- **Competitive advantage**: Access to premium data sources

## 📞 Support

For questions about data source configuration:
- Check the "Data Sources" tab for status and testing
- Review API documentation for each source
- Monitor error logs for troubleshooting
- Contact data source providers for API support

---

**Ready to get started?** Configure your API keys and test the real data sources today! 