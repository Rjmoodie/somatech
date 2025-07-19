import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Activity
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PipelineJob {
  id: string;
  name: string;
  type: 'api_fetch' | 'web_scrape' | 'file_process' | 'data_clean';
  status: 'idle' | 'running' | 'paused' | 'completed' | 'failed';
  source: string;
  target: string;
  progress: number;
  records_processed: number;
  records_added: number;
  records_updated: number;
  errors: number;
  started_at?: string;
  completed_at?: string;
  estimated_completion?: string;
  last_error?: string;
}

interface DataSource {
  id: string;
  name: string;
  type: 'api' | 'scraper' | 'file' | 'database';
  url: string;
  credentials: any;
  schedule: 'hourly' | 'daily' | 'weekly' | 'monthly';
  last_run: string;
  next_run: string;
  status: 'active' | 'inactive' | 'error';
  total_records: number;
  new_records: number;
  updated_records: number;
}

const DataIngestionPipeline = () => {
  const [pipelineJobs, setPipelineJobs] = useState<PipelineJob[]>([]);
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Mock data for demonstration
  const mockPipelineJobs: PipelineJob[] = [
    {
      id: "1",
      name: "LA County Tax Data Fetch",
      type: "api_fetch",
      status: "running",
      source: "Los Angeles County API",
      target: "real_estate_leads",
      progress: 75,
      records_processed: 15000,
      records_added: 1200,
      records_updated: 800,
      errors: 5,
      started_at: "2024-01-15T10:00:00Z",
      estimated_completion: "2024-01-15T11:30:00Z"
    },
    {
      id: "2",
      name: "Harris County Web Scrape",
      type: "web_scrape",
      status: "completed",
      source: "Harris County Website",
      target: "real_estate_leads",
      progress: 100,
      records_processed: 8000,
      records_added: 600,
      records_updated: 400,
      errors: 0,
      started_at: "2024-01-15T09:00:00Z",
      completed_at: "2024-01-15T09:45:00Z"
    },
    {
      id: "3",
      name: "Miami-Dade File Processing",
      type: "file_process",
      status: "failed",
      source: "Miami-Dade CSV Upload",
      target: "real_estate_leads",
      progress: 25,
      records_processed: 2000,
      records_added: 150,
      records_updated: 100,
      errors: 15,
      started_at: "2024-01-15T08:00:00Z",
      last_error: "Invalid CSV format detected"
    }
  ];

  const mockDataSources: DataSource[] = [
    {
      id: "1",
      name: "Los Angeles County API",
      type: "api",
      url: "https://assessor.lacounty.gov/api/v1/properties",
      credentials: { api_key: "***" },
      schedule: "daily",
      last_run: "2024-01-15T10:00:00Z",
      next_run: "2024-01-16T10:00:00Z",
      status: "active",
      total_records: 25000,
      new_records: 1200,
      updated_records: 800
    },
    {
      id: "2",
      name: "Harris County Scraper",
      type: "scraper",
      url: "https://www.hcad.org/property-search",
      credentials: {},
      schedule: "weekly",
      last_run: "2024-01-15T09:00:00Z",
      next_run: "2024-01-22T09:00:00Z",
      status: "active",
      total_records: 18000,
      new_records: 600,
      updated_records: 400
    },
    {
      id: "3",
      name: "Miami-Dade File Upload",
      type: "file",
      url: "manual-upload",
      credentials: {},
      schedule: "monthly",
      last_run: "2024-01-15T08:00:00Z",
      next_run: "2024-02-15T08:00:00Z",
      status: "error",
      total_records: 12000,
      new_records: 150,
      updated_records: 100
    }
  ];

  useEffect(() => {
    setPipelineJobs(mockPipelineJobs);
    setDataSources(mockDataSources);
  }, []);

  const handleStartJob = async (jobId: string) => {
    setLoading(true);
    try {
      setPipelineJobs(prev => 
        prev.map(job => 
          job.id === jobId 
            ? { ...job, status: 'running', started_at: new Date().toISOString() }
            : job
        )
      );
      
      toast({
        title: "Job Started",
        description: "Pipeline job has been initiated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePauseJob = async (jobId: string) => {
    setPipelineJobs(prev => 
      prev.map(job => 
        job.id === jobId 
          ? { ...job, status: 'paused' }
          : job
      )
    );
    
    toast({
      title: "Job Paused",
      description: "Pipeline job has been paused",
    });
  };

  const handleStopJob = async (jobId: string) => {
    setPipelineJobs(prev => 
      prev.map(job => 
        job.id === jobId 
          ? { ...job, status: 'failed', completed_at: new Date().toISOString() }
          : job
      )
    );
    
    toast({
      title: "Job Stopped",
      description: "Pipeline job has been stopped",
    });
  };

  const handleCreateJob = async (jobData: any) => {
    setLoading(true);
    try {
      const newJob: PipelineJob = {
        id: Date.now().toString(),
        ...jobData,
        status: 'idle',
        progress: 0,
        records_processed: 0,
        records_added: 0,
        records_updated: 0,
        errors: 0
      };
      
      setPipelineJobs(prev => [...prev, newJob]);
      
      toast({
        title: "Job Created",
        description: "New pipeline job has been created",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      running: "default",
      completed: "default",
      failed: "destructive",
      paused: "secondary",
      idle: "outline"
    };

    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const getJobTypeIcon = (type: string) => {
    switch (type) {
      case 'api_fetch':
        return <Globe className="h-4 w-4" />;
      case 'web_scrape':
        return <FileText className="h-4 w-4" />;
      case 'file_process':
        return <Upload className="h-4 w-4" />;
      case 'data_clean':
        return <Database className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Data Ingestion Pipeline</h1>
          <p className="text-muted-foreground">
            Automated data collection, processing, and updates
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Pipeline Settings
          </Button>
          <Button>
            <Zap className="h-4 w-4 mr-2" />
            Create Job
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="jobs">Pipeline Jobs</TabsTrigger>
          <TabsTrigger value="sources">Data Sources</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Pipeline Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold">{pipelineJobs.filter(j => j.status === 'running').length}</div>
                    <div className="text-sm text-muted-foreground">Active Jobs</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="text-2xl font-bold">
                      {pipelineJobs.reduce((sum, job) => sum + job.records_added, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Records Added</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <RefreshCw className="h-5 w-5 text-purple-500" />
                  <div>
                    <div className="text-2xl font-bold">
                      {pipelineJobs.reduce((sum, job) => sum + job.records_updated, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Records Updated</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <div>
                    <div className="text-2xl font-bold">
                      {pipelineJobs.reduce((sum, job) => sum + job.errors, 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Errors</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Pipeline Activity</CardTitle>
              <CardDescription>
                Latest pipeline jobs and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pipelineJobs.slice(0, 5).map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getJobTypeIcon(job.type)}
                      <div>
                        <div className="font-medium">{job.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {job.source} → {job.target}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {job.records_added.toLocaleString()} added
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {job.records_updated.toLocaleString()} updated
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(job.status)}
                        {getStatusBadge(job.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-6">
          {/* Pipeline Jobs */}
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Jobs</CardTitle>
              <CardDescription>
                Manage and monitor data ingestion jobs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pipelineJobs.map((job) => (
                  <div key={job.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getJobTypeIcon(job.type)}
                        <div>
                          <div className="font-medium">{job.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {job.source} → {job.target}
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
                        {job.estimated_completion && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Estimated completion: {new Date(job.estimated_completion).toLocaleTimeString()}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="font-medium">Processed</div>
                        <div className="text-muted-foreground">{job.records_processed.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="font-medium">Added</div>
                        <div className="text-green-600">{job.records_added.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="font-medium">Updated</div>
                        <div className="text-blue-600">{job.records_updated.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="font-medium">Errors</div>
                        <div className="text-red-600">{job.errors}</div>
                      </div>
                    </div>

                    {job.last_error && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="text-sm font-medium text-red-800">Error</div>
                        <div className="text-sm text-red-700">{job.last_error}</div>
                      </div>
                    )}

                    <div className="flex items-center justify-end space-x-2 mt-4">
                      {job.status === 'idle' && (
                        <Button
                          size="sm"
                          onClick={() => handleStartJob(job.id)}
                          disabled={loading}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Start
                        </Button>
                      )}
                      {job.status === 'running' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePauseJob(job.id)}
                          >
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleStopJob(job.id)}
                          >
                            <Square className="h-4 w-4 mr-2" />
                            Stop
                          </Button>
                        </>
                      )}
                      {job.status === 'paused' && (
                        <Button
                          size="sm"
                          onClick={() => handleStartJob(job.id)}
                          disabled={loading}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Resume
                        </Button>
                      )}
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
                Configure data sources for automated ingestion
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
                        <div className="font-medium">Schedule</div>
                        <div className="text-muted-foreground capitalize">{source.schedule}</div>
                      </div>
                      <div>
                        <div className="font-medium">Total Records</div>
                        <div className="text-muted-foreground">{source.total_records.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="font-medium">New Records</div>
                        <div className="text-green-600">{source.new_records.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="font-medium">Updated Records</div>
                        <div className="text-blue-600">{source.updated_records.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div>Last run: {new Date(source.last_run).toLocaleString()}</div>
                      <div>Next run: {new Date(source.next_run).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          {/* Monitoring Dashboard */}
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Monitoring</CardTitle>
              <CardDescription>
                Real-time monitoring of data ingestion performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Performance Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Average Processing Time</span>
                      <span className="font-medium">2.3 minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Success Rate</span>
                      <span className="font-medium text-green-600">98.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Error Rate</span>
                      <span className="font-medium text-red-600">1.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Data Freshness</span>
                      <span className="font-medium">4.2 hours avg</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">System Health</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>API Rate Limits</span>
                      <Badge variant="default">Healthy</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Database Connections</span>
                      <Badge variant="default">Stable</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Storage Usage</span>
                      <Badge variant="secondary">65%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Memory Usage</span>
                      <Badge variant="secondary">42%</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataIngestionPipeline; 