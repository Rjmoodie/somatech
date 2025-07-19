import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Pause, 
  Square, 
  RefreshCw, 
  Database, 
  Globe, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  Download,
  Upload,
  Zap,
  Activity,
  MapPin,
  DollarSign,
  Users,
  Building2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ScrapingJob {
  id: string;
  dataType: string;
  county: string;
  state: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  recordsFound: number;
  recordsProcessed: number;
  errors: number;
  startedAt: string;
  completedAt?: string;
  errorMessage?: string;
  sourceUrl: string;
}

interface DataSource {
  id: string;
  name: string;
  dataType: string;
  county: string;
  state: string;
  url: string;
  method: 'scraper' | 'api' | 'file';
  lastScraped: string;
  recordsCount: number;
  status: 'active' | 'inactive' | 'error';
  apiKey?: string;
  credentials?: string;
}

interface ScrapedRecord {
  id: string;
  dataType: string;
  county: string;
  state: string;
  ownerName: string;
  propertyAddress: string;
  mailingAddress?: string;
  equityEstimate?: number;
  propertyValue?: number;
  lastSaleDate?: string;
  sourceUrl: string;
  scrapedAt: string;
  tags: string[];
  metadata: Record<string, any>;
}

const DataScrapingEngine = () => {
  const [scrapingJobs, setScrapingJobs] = useState<ScrapingJob[]>([]);
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [scrapedRecords, setScrapedRecords] = useState<ScrapedRecord[]>([]);
  const [activeTab, setActiveTab] = useState('jobs');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Data types with their scraping configurations
  const dataTypes = [
    {
      id: 'tax-delinquent',
      name: 'Tax Delinquent Properties',
      description: 'Properties with unpaid property taxes',
      icon: DollarSign,
      priority: 'high'
    },
    {
      id: 'code-violations',
      name: 'Code Violation Properties',
      description: 'Properties with building code violations',
      icon: AlertTriangle,
      priority: 'high'
    },
    {
      id: 'pre-foreclosures',
      name: 'Pre-Foreclosures',
      description: 'Properties in foreclosure process',
      icon: Building2,
      priority: 'high'
    },
    {
      id: 'probate-properties',
      name: 'Probate Properties',
      description: 'Properties in probate court',
      icon: FileText,
      priority: 'medium'
    },
    {
      id: 'vacant-properties',
      name: 'Vacant Properties',
      description: 'Unoccupied properties',
      icon: MapPin,
      priority: 'medium'
    },
    {
      id: 'absentee-owners',
      name: 'Absentee Owners',
      description: 'Owners with out-of-state mailing addresses',
      icon: Users,
      priority: 'medium'
    },
    {
      id: 'bank-owned',
      name: 'Bank-Owned (REO) Properties',
      description: 'Real estate owned by banks',
      icon: Building2,
      priority: 'high'
    },
    {
      id: 'rental-registrations',
      name: 'Rental Registration Lists',
      description: 'Registered rental properties',
      icon: FileText,
      priority: 'low'
    }
  ];

  // Mock data sources for demonstration
  const mockDataSources: DataSource[] = [
    {
      id: "1",
      name: "Los Angeles County Tax Assessor",
      dataType: "tax-delinquent",
      county: "Los Angeles",
      state: "California",
      url: "https://assessor.lacounty.gov/tax-delinquent",
      method: "scraper",
      lastScraped: "2024-01-15T10:00:00Z",
      recordsCount: 2500,
      status: "active"
    },
    {
      id: "2",
      name: "Harris County Property Records",
      dataType: "code-violations",
      county: "Harris",
      state: "Texas",
      url: "https://www.hcad.org/code-violations",
      method: "scraper",
      lastScraped: "2024-01-14T15:30:00Z",
      recordsCount: 1800,
      status: "active"
    },
    {
      id: "3",
      name: "Miami-Dade Clerk Records",
      dataType: "probate-properties",
      county: "Miami-Dade",
      state: "Florida",
      url: "https://www.miami-dadeclerk.com/probate",
      method: "scraper",
      lastScraped: "2024-01-13T09:15:00Z",
      recordsCount: 1200,
      status: "active"
    },
    {
      id: "4",
      name: "Chicago Data Portal",
      dataType: "code-violations",
      county: "Cook",
      state: "Illinois",
      url: "https://data.cityofchicago.org/code-violations",
      method: "api",
      lastScraped: "2024-01-15T11:00:00Z",
      recordsCount: 3200,
      status: "active"
    }
  ];

  const mockScrapingJobs: ScrapingJob[] = [
    {
      id: "1",
      dataType: "tax-delinquent",
      county: "Los Angeles",
      state: "California",
      status: "running",
      progress: 75,
      recordsFound: 2500,
      recordsProcessed: 1875,
      errors: 5,
      startedAt: "2024-01-15T10:00:00Z",
      sourceUrl: "https://assessor.lacounty.gov/tax-delinquent"
    },
    {
      id: "2",
      dataType: "code-violations",
      county: "Harris",
      state: "Texas",
      status: "completed",
      progress: 100,
      recordsFound: 1800,
      recordsProcessed: 1800,
      errors: 0,
      startedAt: "2024-01-15T09:00:00Z",
      completedAt: "2024-01-15T09:45:00Z",
      sourceUrl: "https://www.hcad.org/code-violations"
    },
    {
      id: "3",
      dataType: "probate-properties",
      county: "Miami-Dade",
      state: "Florida",
      status: "failed",
      progress: 25,
      recordsFound: 500,
      recordsProcessed: 125,
      errors: 15,
      startedAt: "2024-01-15T08:00:00Z",
      errorMessage: "Website structure changed, scraper needs update",
      sourceUrl: "https://www.miami-dadeclerk.com/probate"
    }
  ];

  useEffect(() => {
    setDataSources(mockDataSources);
    setScrapingJobs(mockScrapingJobs);
  }, []);

  const handleStartScraping = async (dataType: string, county: string, state: string) => {
    setLoading(true);
    try {
      const newJob: ScrapingJob = {
        id: Date.now().toString(),
        dataType,
        county,
        state,
        status: 'running',
        progress: 0,
        recordsFound: 0,
        recordsProcessed: 0,
        errors: 0,
        startedAt: new Date().toISOString(),
        sourceUrl: `https://example.com/${dataType}/${county.toLowerCase()}`
      };
      
      setScrapingJobs(prev => [...prev, newJob]);
      
      // Simulate scraping progress
      simulateScrapingProgress(newJob.id);
      
      toast({
        title: "Scraping Started",
        description: `Started scraping ${dataType} data for ${county}, ${state}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start scraping job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const simulateScrapingProgress = (jobId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setScrapingJobs(prev => 
          prev.map(job => 
            job.id === jobId 
              ? { 
                  ...job, 
                  status: 'completed', 
                  progress: 100, 
                  recordsFound: Math.floor(Math.random() * 2000) + 500,
                  recordsProcessed: Math.floor(Math.random() * 2000) + 500,
                  completedAt: new Date().toISOString()
                }
              : job
          )
        );
      } else {
        setScrapingJobs(prev => 
          prev.map(job => 
            job.id === jobId 
              ? { 
                  ...job, 
                  progress: Math.floor(progress),
                  recordsFound: Math.floor(progress * 20),
                  recordsProcessed: Math.floor(progress * 18)
                }
              : job
          )
        );
      }
    }, 1000);
  };

  const handleStopScraping = async (jobId: string) => {
    setScrapingJobs(prev => 
      prev.map(job => 
        job.id === jobId 
          ? { ...job, status: 'failed', completedAt: new Date().toISOString() }
          : job
      )
    );
    
    toast({
      title: "Scraping Stopped",
      description: "Data scraping job has been stopped",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      running: "default",
      completed: "default",
      failed: "destructive",
      pending: "outline"
    };

    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const getDataTypeIcon = (dataType: string) => {
    const dataTypeConfig = dataTypes.find(dt => dt.id === dataType);
    return dataTypeConfig?.icon || Globe;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Data Scraping Engine</h1>
          <p className="text-muted-foreground">
            Automated collection of real estate data from public sources
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Scraper Settings
          </Button>
          <Button>
            <Zap className="h-4 w-4 mr-2" />
            New Scraping Job
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="jobs">Scraping Jobs</TabsTrigger>
          <TabsTrigger value="sources">Data Sources</TabsTrigger>
          <TabsTrigger value="records">Scraped Records</TabsTrigger>
          <TabsTrigger value="types">Data Types</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-6">
          {/* Scraping Jobs */}
          <Card>
            <CardHeader>
              <CardTitle>Active Scraping Jobs</CardTitle>
              <CardDescription>
                Monitor and manage data scraping operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scrapingJobs.map((job) => (
                  <div key={job.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {React.createElement(getDataTypeIcon(job.dataType), { className: "h-5 w-5" })}
                        <div>
                          <div className="font-medium capitalize">
                            {job.dataType.replace('-', ' ')} - {job.county}, {job.state}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {job.sourceUrl}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(job.status)}
                        {getStatusBadge(job.status)}
                      </div>
                    </div>

                    {job.status === 'running' && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{job.progress}%</span>
                        </div>
                        <Progress value={job.progress} className="h-2" />
                      </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="font-medium">Records Found</div>
                        <div className="text-muted-foreground">{job.recordsFound.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="font-medium">Records Processed</div>
                        <div className="text-green-600">{job.recordsProcessed.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="font-medium">Errors</div>
                        <div className="text-red-600">{job.errors}</div>
                      </div>
                      <div>
                        <div className="font-medium">Duration</div>
                        <div className="text-muted-foreground">
                          {job.completedAt 
                            ? `${Math.round((new Date(job.completedAt).getTime() - new Date(job.startedAt).getTime()) / 1000)}s`
                            : `${Math.round((new Date().getTime() - new Date(job.startedAt).getTime()) / 1000)}s`
                          }
                        </div>
                      </div>
                    </div>

                    {job.errorMessage && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="text-sm font-medium text-red-800">Error</div>
                        <div className="text-sm text-red-700">{job.errorMessage}</div>
                      </div>
                    )}

                    <div className="flex items-center justify-end space-x-2 mt-4">
                      {job.status === 'running' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleStopScraping(job.id)}
                        >
                          <Square className="h-4 w-4 mr-2" />
                          Stop
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-6">
          {/* Data Sources */}
          <Card>
            <CardHeader>
              <CardTitle>Data Sources</CardTitle>
              <CardDescription>
                Configure and manage data sources for scraping
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dataSources.map((source) => (
                  <div key={source.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium">{source.name}</div>
                        <div className="text-sm text-muted-foreground">{source.url}</div>
                      </div>
                      <Badge variant={source.status === 'active' ? 'default' : 'outline'}>
                        {source.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <div className="font-medium">Data Type</div>
                        <div className="text-muted-foreground capitalize">
                          {source.dataType.replace('-', ' ')}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">Location</div>
                        <div className="text-muted-foreground">{source.county}, {source.state}</div>
                      </div>
                      <div>
                        <div className="font-medium">Method</div>
                        <div className="text-muted-foreground capitalize">{source.method}</div>
                      </div>
                      <div>
                        <div className="font-medium">Records</div>
                        <div className="text-muted-foreground">{source.recordsCount.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div>Last scraped: {new Date(source.lastScraped).toLocaleString()}</div>
                      <Button
                        size="sm"
                        onClick={() => handleStartScraping(source.dataType, source.county, source.state)}
                        disabled={loading}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Scrape Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="records" className="space-y-6">
          {/* Scraped Records */}
          <Card>
            <CardHeader>
              <CardTitle>Scraped Records</CardTitle>
              <CardDescription>
                View and manage collected real estate data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {scrapedRecords.length.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Records</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {dataTypes.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Data Types</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {dataSources.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Active Sources</div>
                  </div>
                </div>

                <div className="text-center py-8">
                  <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No Records Yet</h3>
                  <p className="text-muted-foreground">
                    Start scraping jobs to collect real estate data
                  </p>
                  <Button className="mt-4" onClick={() => setActiveTab('jobs')}>
                    <Play className="h-4 w-4 mr-2" />
                    Start Scraping
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="types" className="space-y-6">
          {/* Data Types */}
          <Card>
            <CardHeader>
              <CardTitle>Data Types</CardTitle>
              <CardDescription>
                Available real estate data types for scraping
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dataTypes.map((dataType) => (
                  <Card key={dataType.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-2">
                        {React.createElement(dataType.icon, { className: "h-5 w-5" })}
                        <div>
                          <CardTitle className="text-lg">{dataType.name}</CardTitle>
                          <CardDescription>{dataType.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge variant={dataType.priority === 'high' ? 'default' : 'secondary'}>
                          {dataType.priority} priority
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Play className="h-4 w-4 mr-2" />
                          Scrape
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataScrapingEngine; 