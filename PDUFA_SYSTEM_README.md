# PDUFA Calendar & Alert System

A comprehensive system for tracking FDA Prescription Drug User Fee Act (PDUFA) decision dates with automated Discord alerts and a modern web interface.

## 🚀 Features

### Core Functionality
- **Multi-source PDUFA scraping** from reliable public sources
- **Automated Discord alerts** for upcoming PDUFA dates
- **Real-time web interface** with filtering and search
- **Scheduled daily checks** at 8:00 AM ET
- **Caching system** for performance optimization
- **Error handling and monitoring**

### Data Sources
- RTT News FDA Calendar
- BiopharmCatalyst PDUFA Calendar
- CheckRare Orphan Drug PDUFA Dates
- FDA Tracker Calendar
- Benzinga FDA Calendar

### Alert System
- **24-hour advance alerts** for upcoming PDUFA dates
- **Same-day alerts** at 9:00 AM ET on PDUFA decision dates
- **Weekly summaries** every Monday
- **Error notifications** for system issues
- **Test alert functionality**

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Sources   │    │  PDUFA Scraper  │    │   Redis Cache   │
│                 │───▶│                 │───▶│                 │
│ • RTT News      │    │ • Multi-source  │    │ • 1-hour TTL    │
│ • BiopharmCat   │    │ • Error handling│    │ • Deduplication │
│ • CheckRare     │    │ • Date parsing  │    │ • Performance   │
│ • FDA Tracker   │    │ • Validation    │    │                 │
│ • Benzinga      │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Discord Alerts │◀───│ PDUFA Scheduler │◀───│   PDUFA API     │
│                 │    │                 │    │                 │
│ • Rich embeds   │    │ • Daily 8AM ET  │    │ • REST endpoints│
│ • Color coding  │    │ • Timezone aware│    │ • Pagination    │
│ • Error alerts  │    │ • Manual checks │    │ • Search/filter │
│ • Test messages │    │ • Status tracking│    │ • Stats/metrics │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ React Frontend  │◀───│   Vite Dev      │◀───│  Express Server │
│                 │    │                 │    │                 │
│ • Modern UI     │    │ • Hot reload    │    │ • CORS enabled  │
│ • Real-time     │    │ • TypeScript    │    │ • Health checks │
│ • Filtering     │    │ • Tailwind CSS  │    │ • Error handling│
│ • Responsive    │    │ • Shadcn/ui     │    │ • Graceful shutdown│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- Redis server (for caching)
- Discord webhook URL

### Setup

1. **Clone and install dependencies:**
```bash
git clone <repository>
cd somatech
npm install
```

2. **Install additional dependencies:**
```bash
npm install express cors
```

3. **Configure Discord webhook:**
The system uses the provided Discord webhook URL:
```
https://discordapp.com/api/webhooks/1405025532323827842/Lj61sBgYfjG4wm0AXTg25hIijDrsTyeOqFEWURSaO6BVt8nJSQhZYpag7r4ChAz_OWP2
```

4. **Start Redis server:**
```bash
# On Windows (if using WSL or Docker)
docker run -d -p 6379:6379 redis:alpine

# On macOS
brew install redis
brew services start redis

# On Linux
sudo apt-get install redis-server
sudo systemctl start redis
```

## 🚀 Usage

### Development Mode
```bash
# Start both frontend and PDUFA server
npm run pdufa:dev

# Or start separately
npm run dev          # Frontend (Vite)
npm run pdufa:server # PDUFA API server
```

### Production Mode
```bash
# Build and start
npm run pdufa:build
```

### Manual Operations
```bash
# Test Discord webhook
curl -X POST http://localhost:3001/api/pdufa/scheduler/test-alert

# Run manual PDUFA check
curl -X POST http://localhost:3001/api/pdufa/scheduler/check

# Clear cache
curl -X POST http://localhost:3001/api/pdufa/cache/clear

# Get system status
curl http://localhost:3001/api/pdufa/scheduler/status
```

## 📡 API Endpoints

### PDUFA Data
- `GET /api/pdufa` - Get all PDUFA data (paginated)
- `GET /api/pdufa/upcoming?days=30` - Get upcoming PDUFAs
- `GET /api/pdufa/date/:date` - Get PDUFAs for specific date
- `GET /api/pdufa/ticker/:ticker` - Get PDUFAs by ticker
- `GET /api/pdufa/company/:company` - Get PDUFAs by company
- `GET /api/pdufa/search?q=query` - Search PDUFAs
- `GET /api/pdufa/stats` - Get PDUFA statistics

### Scheduler Management
- `GET /api/pdufa/scheduler/status` - Get scheduler status
- `POST /api/pdufa/scheduler/check` - Run manual check
- `POST /api/pdufa/scheduler/test-alert` - Send test Discord alert
- `POST /api/pdufa/scheduler/validate` - Validate system components
- `POST /api/pdufa/cache/clear` - Clear cache

### Health & Monitoring
- `GET /health` - Health check endpoint

## 🎨 Frontend Features

### PDUFA Calendar Component
- **Real-time data** with auto-refresh every 30 minutes
- **Advanced filtering** by date, status, company, ticker
- **Search functionality** across all fields
- **Sorting options** by date, ticker, company, drug
- **Responsive design** for mobile and desktop
- **Status badges** with color coding
- **Confidence indicators** for data reliability

### Statistics Dashboard
- Total PDUFAs tracked
- Today's PDUFAs
- Tomorrow's PDUFAs  
- This week's PDUFAs
- Real-time updates

## 🔧 Configuration

### Scheduler Settings
```typescript
interface SchedulerConfig {
  checkTime: "08:00",           // Daily check time
  timezone: "America/New_York", // Timezone for alerts
  alertDaysAhead: 1,            // Days before PDUFA to alert
  weeklySummaryDay: "monday",   // Day for weekly summaries
  enabled: true                 // Enable/disable scheduler
}
```

### Discord Alert Settings
- **Webhook URL**: Configured in `discord-alerts.ts`
- **Alert types**: Today, Tomorrow, Weekly, Error, Test
- **Rich embeds**: Color-coded with detailed information
- **Rate limiting**: Built-in to prevent spam

## 📊 Data Structure

```typescript
interface PDUFAData {
  ticker: string;           // Stock ticker symbol
  company: string;          // Company name
  drug: string;            // Drug name
  indication: string;      // Medical indication
  pdufaDate: string;       // PDUFA decision date (YYYY-MM-DD)
  reviewType: string;      // Review type (PDUFA, etc.)
  status: string;          // Current status
  sourceUrl: string;       // Source URL
  lastUpdated: string;     // Last update timestamp
  confidence: 'high' | 'medium' | 'low'; // Data confidence
}
```

## 🔍 Monitoring & Debugging

### Logs
The system provides comprehensive logging:
- Scraper success/failure
- Discord alert delivery status
- Scheduler execution times
- Error details with context

### Health Checks
```bash
# Check system health
curl http://localhost:3001/health

# Validate all components
curl -X POST http://localhost:3001/api/pdufa/scheduler/validate
```

### Common Issues

1. **Redis Connection Failed**
   - Ensure Redis server is running
   - Check Redis connection settings

2. **Discord Webhook Failed**
   - Verify webhook URL is correct
   - Check Discord server permissions
   - Test with manual alert

3. **Scraper Errors**
   - Check network connectivity
   - Verify source websites are accessible
   - Review error logs for specific issues

## 🔒 Security Considerations

- **Rate limiting** on API endpoints
- **Input validation** for all parameters
- **Error handling** without exposing sensitive data
- **CORS configuration** for web security
- **Graceful degradation** when services are unavailable

## 🚀 Deployment

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
COPY scripts ./scripts
EXPOSE 3001
CMD ["npm", "run", "pdufa:server"]
```

### Environment Variables
```bash
PORT=3001                    # Server port
REDIS_URL=redis://localhost:6379  # Redis connection
NODE_ENV=production          # Environment
```

## 📈 Performance Optimization

- **Redis caching** with 1-hour TTL
- **Deduplication** of scraped data
- **Pagination** for large datasets
- **Debounced search** in frontend
- **Memoized filtering** and sorting
- **Auto-refresh** with intelligent intervals

## 🔄 Future Enhancements

- **Slack integration** as alternative to Discord
- **Email alerts** for critical PDUFAs
- **Mobile app** for push notifications
- **Advanced analytics** and trend analysis
- **Machine learning** for date prediction
- **Export functionality** (CSV, Excel)
- **API rate limiting** and authentication
- **Webhook management** dashboard

## 📝 License

This project is part of the SomaTech platform and follows the same licensing terms.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For issues or questions:
- Check the logs for error details
- Review the API documentation
- Test individual components
- Contact the development team

---

**PDUFA System v1.0** - Built with ❤️ for the biotech investment community
