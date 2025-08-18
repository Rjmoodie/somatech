import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  DollarSign, 
  AlertTriangle, 
  RefreshCw, 
  Bell,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock
} from 'lucide-react';
import { AlphaVantageAPI } from '@/services/api/alpha-vantage-api';

interface EarningsData {
  symbol: string;
  name: string;
  reportDate: string;
  fiscalDateEnding: string;
  estimate: string;
  actual: string;
  surprise: string;
  surprisePercent: string;
  timeZone: string;
  lastUpdated: string;
  isSP500: boolean;
}

const EarningsCalendar: React.FC = () => {
  const [data, setData] = useState<EarningsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    tomorrow: 0,
    thisWeek: 0,
    sp500Count: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const alphaVantageAPI = new AlphaVantageAPI();
      const result = await alphaVantageAPI.getEarningsData();
      setData(result.data);
      setStats(result.stats);
    } catch (err) {
      setError('Failed to fetch earnings data');
      console.error('Earnings fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTestAlert = async () => {
    try {
      const alphaVantageAPI = new AlphaVantageAPI();
      await alphaVantageAPI.sendTestAlert();
      alert('Test alert sent successfully!');
    } catch (err) {
      alert('Failed to send test alert');
      console.error('Test alert error:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isToday = (dateString: string) => {
    const today = new Date();
    const date = new Date(dateString);
    return date.toDateString() === today.toDateString();
  };

  const isTomorrow = (dateString: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const date = new Date(dateString);
    return date.toDateString() === tomorrow.toDateString();
  };

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  const getSurpriseColor = (surprise: string) => {
    const num = parseFloat(surprise);
    if (isNaN(num)) return 'bg-gray-100 text-gray-800';
    return num >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getSurpriseIcon = (surprise: string) => {
    const num = parseFloat(surprise);
    if (isNaN(num)) return null;
    return num >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading earnings data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Earnings Calendar</h1>
          <p className="text-muted-foreground">
            Track quarterly earnings announcements for S&P 500 companies
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleTestAlert}
          >
            <Bell className="h-4 w-4 mr-2" />
            Test Alert
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.today}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tomorrow</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tomorrow}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisWeek}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">S&P 500</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sp500Count}</div>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Data */}
      <Card>
        <CardHeader>
          <CardTitle>Earnings Announcements</CardTitle>
          <CardDescription>
            Upcoming quarterly earnings reports and financial results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.map((item, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{item.symbol} - {item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Fiscal Period: {item.fiscalDateEnding}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {isToday(item.reportDate) && (
                          <Badge variant="destructive" className="text-xs">
                            TODAY
                          </Badge>
                        )}
                        {isTomorrow(item.reportDate) && (
                          <Badge variant="secondary" className="text-xs">
                            TOMORROW
                          </Badge>
                        )}
                        {item.isSP500 && (
                          <Badge variant="outline" className="text-xs">
                            S&P 500
                          </Badge>
                        )}
                        {item.surprise && (
                          <Badge className={`text-xs ${getSurpriseColor(item.surprise)}`}>
                            {getSurpriseIcon(item.surprise)}
                            <span className="ml-1">{item.surprisePercent}%</span>
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                      <div>
                        <div className="text-sm text-muted-foreground">Report Date</div>
                        <div className="font-medium">{formatDate(item.reportDate)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Estimate</div>
                        <div className="font-medium">{formatCurrency(item.estimate)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Actual</div>
                        <div className="font-medium">{formatCurrency(item.actual)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Surprise</div>
                        <div className="font-medium">{formatCurrency(item.surprise)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { EarningsCalendar };
