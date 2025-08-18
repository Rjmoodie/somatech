import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Calendar, 
  AlertTriangle, 
  ExternalLink, 
  RefreshCw, 
  Bell,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { PDUFAAPI } from '@/services/api/pdufa-api';

interface PDUFAData {
  ticker: string;
  company: string;
  drug: string;
  indication: string;
  pdufaDate: string;
  reviewType: string;
  status: string;
  sourceUrl?: string;
  lastUpdated: string;
  confidence: number;
}

const PDUFACalendar: React.FC = () => {
  const [data, setData] = useState<PDUFAData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    tomorrow: 0,
    thisWeek: 0,
    thisMonth: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const pdufaAPI = new PDUFAAPI();
      const result = await pdufaAPI.getPDUFAData();
      setData(result.data);
      setStats(result.stats);
    } catch (err) {
      setError('Failed to fetch PDUFA data');
      console.error('PDUFA fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTestAlert = async () => {
    try {
      const pdufaAPI = new PDUFAAPI();
      await pdufaAPI.sendTestAlert();
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (reviewType: string) => {
    return reviewType.toLowerCase().includes('priority') 
      ? 'bg-red-100 text-red-800' 
      : 'bg-blue-100 text-blue-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading PDUFA data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">PDUFA Calendar</h1>
          <p className="text-muted-foreground">
            Track FDA decision dates for pharmaceutical companies
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
            <Calendar className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisMonth}</div>
          </CardContent>
        </Card>
      </div>

      {/* PDUFA Data */}
      <Card>
        <CardHeader>
          <CardTitle>PDUFA Decisions</CardTitle>
          <CardDescription>
            Upcoming FDA decision dates for pharmaceutical products
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
                        <h3 className="font-semibold">{item.ticker} - {item.company}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.drug} ({item.indication})
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {isToday(item.pdufaDate) && (
                          <Badge variant="destructive" className="text-xs">
                            TODAY
                          </Badge>
                        )}
                        {isTomorrow(item.pdufaDate) && (
                          <Badge variant="secondary" className="text-xs">
                            TOMORROW
                          </Badge>
                        )}
                        <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                          {item.status}
                        </Badge>
                        <Badge className={`text-xs ${getPriorityColor(item.reviewType)}`}>
                          {item.reviewType}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                      <div>
                        <div className="text-sm text-muted-foreground">PDUFA Date</div>
                        <div className="font-medium">{formatDate(item.pdufaDate)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Review Type</div>
                        <div className="font-medium">{item.reviewType}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Status</div>
                        <div className="font-medium">{item.status}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Confidence</div>
                        <div className="font-medium">{item.confidence}%</div>
                      </div>
                    </div>
                    
                    {item.sourceUrl && (
                      <div className="mt-3">
                        <a
                          href={item.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View Source
                        </a>
                      </div>
                    )}
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

export { PDUFACalendar };
