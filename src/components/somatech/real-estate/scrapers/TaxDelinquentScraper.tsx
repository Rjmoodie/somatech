import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  MapPin,
  Calendar,
  FileText,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TaxDelinquentRecord {
  id: string;
  ownerName: string;
  propertyAddress: string;
  mailingAddress?: string;
  taxAmount: number;
  delinquentYear: string;
  propertyValue?: number;
  county: string;
  state: string;
  scrapedAt: string;
  sourceUrl: string;
}

interface ScrapingConfig {
  county: string;
  state: string;
  url: string;
  method: 'puppeteer' | 'api' | 'csv';
  selectors?: {
    tableSelector: string;
    rowSelector: string;
    ownerSelector: string;
    addressSelector: string;
    amountSelector: string;
    yearSelector: string;
  };
  apiConfig?: {
    endpoint: string;
    apiKey?: string;
    headers?: Record<string, string>;
  };
}

const TaxDelinquentScraper = () => {
  const [scrapingConfig, setScrapingConfig] = useState<ScrapingConfig>({
    county: 'Los Angeles',
    state: 'California',
    url: 'https://assessor.lacounty.gov/tax-delinquent',
    method: 'puppeteer',
    selectors: {
      tableSelector: '.tax-delinquent-table',
      rowSelector: 'tr',
      ownerSelector: '.owner-name',
      addressSelector: '.property-address',
      amountSelector: '.tax-amount',
      yearSelector: '.delinquent-year'
    }
  });

  const [isScraping, setIsScraping] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scrapedRecords, setScrapedRecords] = useState<TaxDelinquentRecord[]>([]);
  const [currentStatus, setCurrentStatus] = useState('');
  const { toast } = useToast();

  // Pre-configured scraping targets
  const scrapingTargets = [
    {
      county: 'Los Angeles',
      state: 'California',
      url: 'https://assessor.lacounty.gov/tax-delinquent',
      method: 'puppeteer' as const,
      selectors: {
        tableSelector: '.tax-delinquent-table',
        rowSelector: 'tr',
        ownerSelector: '.owner-name',
        addressSelector: '.property-address',
        amountSelector: '.tax-amount',
        yearSelector: '.delinquent-year'
      }
    },
    {
      county: 'Harris',
      state: 'Texas',
      url: 'https://www.hcad.org/tax-delinquent',
      method: 'puppeteer' as const,
      selectors: {
        tableSelector: '.delinquent-properties',
        rowSelector: '.property-row',
        ownerSelector: '.owner',
        addressSelector: '.address',
        amountSelector: '.amount',
        yearSelector: '.year'
      }
    },
    {
      county: 'Miami-Dade',
      state: 'Florida',
      url: 'https://www.miamidade.gov/tax-delinquent',
      method: 'api' as const,
      apiConfig: {
        endpoint: 'https://api.miamidade.gov/tax-delinquent',
        apiKey: 'your-api-key-here'
      }
    },
    {
      county: 'Cook',
      state: 'Illinois',
      url: 'https://www.cookcountyassessor.com/tax-delinquent',
      method: 'csv' as const
    }
  ];

  const handleStartScraping = async () => {
    setIsScraping(true);
    setProgress(0);
    setCurrentStatus('Initializing scraper...');

    try {
      // Simulate scraping process
      await simulateScrapingProcess();
      
      toast({
        title: "Scraping Complete",
        description: `Successfully scraped ${scrapedRecords.length} tax delinquent records`,
      });
    } catch (error) {
      toast({
        title: "Scraping Failed",
        description: "Failed to scrape tax delinquent data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsScraping(false);
      setProgress(100);
    }
  };

  const simulateScrapingProcess = async () => {
    const steps = [
      { progress: 10, status: 'Connecting to county website...' },
      { progress: 25, status: 'Locating tax delinquent data...' },
      { progress: 40, status: 'Extracting property records...' },
      { progress: 60, status: 'Processing owner information...' },
      { progress: 80, status: 'Validating data integrity...' },
      { progress: 95, status: 'Saving records to database...' },
      { progress: 100, status: 'Scraping completed successfully!' }
    ];

    for (const step of steps) {
      setProgress(step.progress);
      setCurrentStatus(step.status);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Generate mock records
    const mockRecords: TaxDelinquentRecord[] = Array.from({ length: 50 }, (_, i) => ({
      id: `tax-${Date.now()}-${i}`,
      ownerName: `Owner ${i + 1}`,
      propertyAddress: `${1000 + i} Main St, ${scrapingConfig.county}, ${scrapingConfig.state}`,
      mailingAddress: `${2000 + i} Oak Ave, Beverly Hills, CA 90210`,
      taxAmount: Math.floor(Math.random() * 50000) + 5000,
      delinquentYear: '2023',
      propertyValue: Math.floor(Math.random() * 500000) + 200000,
      county: scrapingConfig.county,
      state: scrapingConfig.state,
      scrapedAt: new Date().toISOString(),
      sourceUrl: scrapingConfig.url
    }));

    setScrapedRecords(mockRecords);
  };

  const handleExportRecords = () => {
    const csvContent = [
      ['Owner Name', 'Property Address', 'Mailing Address', 'Tax Amount', 'Delinquent Year', 'Property Value'],
      ...scrapedRecords.map(record => [
        record.ownerName,
        record.propertyAddress,
        record.mailingAddress || '',
        record.taxAmount.toString(),
        record.delinquentYear,
        record.propertyValue?.toString() || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tax-delinquent-${scrapingConfig.county}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Tax delinquent records exported to CSV",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tax Delinquent Scraper</h1>
          <p className="text-muted-foreground">
            Extract tax delinquent property data from county assessor websites
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            View Logs
          </Button>
          <Button onClick={handleExportRecords} disabled={scrapedRecords.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Scraping Configuration
          </CardTitle>
          <CardDescription>
            Configure the target county and scraping method
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>County</Label>
              <Select 
                value={scrapingConfig.county}
                onValueChange={(value) => {
                  const target = scrapingTargets.find(t => t.county === value);
                  if (target) {
                    setScrapingConfig(target);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select county" />
                </SelectTrigger>
                <SelectContent>
                  {scrapingTargets.map(target => (
                    <SelectItem key={target.county} value={target.county}>
                      {target.county}, {target.state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Scraping Method</Label>
              <Select 
                value={scrapingConfig.method}
                onValueChange={(value) => setScrapingConfig(prev => ({ ...prev, method: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="puppeteer">Web Scraping (Puppeteer)</SelectItem>
                  <SelectItem value="api">API Integration</SelectItem>
                  <SelectItem value="csv">CSV Download</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Source URL</Label>
              <Input 
                value={scrapingConfig.url}
                onChange={(e) => setScrapingConfig(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://assessor.county.gov/tax-delinquent"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Method: <Badge variant="outline">{scrapingConfig.method}</Badge>
            </div>
            <Button 
              onClick={handleStartScraping} 
              disabled={isScraping}
              className="min-w-[120px]"
            >
              {isScraping ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Scraping...
                </>
              ) : (
                <>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Start Scraping
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      {isScraping && (
        <Card>
          <CardHeader>
            <CardTitle>Scraping Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="text-sm text-muted-foreground">
                {currentStatus}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {scrapedRecords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Scraped Records
            </CardTitle>
            <CardDescription>
              {scrapedRecords.length} tax delinquent records found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scrapedRecords.slice(0, 10).map((record) => (
                <div key={record.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{record.ownerName}</div>
                    <Badge variant="destructive">
                      {formatCurrency(record.taxAmount)}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {record.propertyAddress}
                    </div>
                    {record.mailingAddress && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Mailing: {record.mailingAddress}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      Property Value: {record.propertyValue ? formatCurrency(record.propertyValue) : 'N/A'}
                    </div>
                  </div>
                </div>
              ))}
              
              {scrapedRecords.length > 10 && (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">
                    Showing first 10 of {scrapedRecords.length} records
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      {scrapedRecords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Scraping Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {scrapedRecords.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Records</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(scrapedRecords.reduce((sum, r) => sum + r.taxAmount, 0))}
                </div>
                <div className="text-sm text-muted-foreground">Total Tax Amount</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(scrapedRecords.reduce((sum, r) => sum + (r.propertyValue || 0), 0))}
                </div>
                <div className="text-sm text-muted-foreground">Total Property Value</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {scrapingConfig.county}
                </div>
                <div className="text-sm text-muted-foreground">County</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TaxDelinquentScraper; 