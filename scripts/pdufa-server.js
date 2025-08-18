import express from 'express';
import cors from 'cors';
import { pdufaAPI } from '../dist/api/pdufa-api.js';
import { pdufaScheduler } from '../dist/services/pdufa-scheduler.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'PDUFA API Server'
  });
});

// PDUFA API endpoints
app.get('/api/pdufa', async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const response = await pdufaAPI.getAllPDUFAs(parseInt(page), parseInt(limit));
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/api/pdufa/upcoming', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const response = await pdufaAPI.getUpcomingPDUFAs(parseInt(days));
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/api/pdufa/date/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const response = await pdufaAPI.getPDUFAsForDate(date);
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/api/pdufa/ticker/:ticker', async (req, res) => {
  try {
    const { ticker } = req.params;
    const response = await pdufaAPI.getPDUFAsByTicker(ticker);
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/api/pdufa/company/:company', async (req, res) => {
  try {
    const { company } = req.params;
    const response = await pdufaAPI.getPDUFAsByCompany(company);
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/api/pdufa/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query parameter "q" is required',
        timestamp: new Date().toISOString()
      });
    }
    const response = await pdufaAPI.searchPDUFAs(q);
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/api/pdufa/stats', async (req, res) => {
  try {
    const response = await pdufaAPI.getStats();
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Scheduler management endpoints
app.get('/api/pdufa/scheduler/status', async (req, res) => {
  try {
    const response = await pdufaAPI.getSchedulerStatus();
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.post('/api/pdufa/scheduler/check', async (req, res) => {
  try {
    const response = await pdufaAPI.runManualCheck();
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.post('/api/pdufa/scheduler/test-alert', async (req, res) => {
  try {
    const response = await pdufaAPI.sendTestAlert();
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.post('/api/pdufa/scheduler/validate', async (req, res) => {
  try {
    const response = await pdufaAPI.validateSystem();
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.post('/api/pdufa/cache/clear', async (req, res) => {
  try {
    const response = await pdufaAPI.clearCache();
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Start scheduler
async function startScheduler() {
  try {
    await pdufaScheduler.start();
    console.log('PDUFA Scheduler started successfully');
  } catch (error) {
    console.error('Failed to start PDUFA Scheduler:', error);
  }
}

// Start server
app.listen(PORT, async () => {
  console.log(`PDUFA API Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API docs: http://localhost:${PORT}/api/pdufa`);
  
  // Start the scheduler
  await startScheduler();
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down PDUFA API Server...');
  await pdufaScheduler.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nShutting down PDUFA API Server...');
  await pdufaScheduler.stop();
  process.exit(0);
});

export default app;
