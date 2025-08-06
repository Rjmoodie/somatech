import React, { useState } from 'react';
import { useSearchContext } from './context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Phone, 
  Mail, 
  User, 
  Building, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Shield,
  Eye,
  EyeOff,
  Download,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface SkipTracingResult {
  propertyId: string;
  ownerName: string;
  phoneNumbers: string[];
  emailAddresses: string[];
  confidence: number;
  lastVerified: Date;
  source: string;
}

interface SkipTracingStatus {
  isRunning: boolean;
  progress: number;
  currentProperty: string;
  totalProperties: number;
  processedProperties: number;
  results: SkipTracingResult[];
  errors: string[];
}

export const SkipTracingIntegration = () => {
  const { state } = useSearchContext();
  const [skipTracingStatus, setSkipTracingStatus] = useState<SkipTracingStatus>({
    isRunning: false,
    progress: 0,
    currentProperty: '',
    totalProperties: 0,
    processedProperties: 0,
    results: [],
    errors: []
  });
  const [showResults, setShowResults] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);

  // Mock skip tracing API call
  const mockSkipTracingAPI = async (property: any): Promise<SkipTracingResult> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
    
    // Mock data based on property
    const hasPhone = Math.random() > 0.3;
    const hasEmail = Math.random() > 0.4;
    
    return {
      propertyId: property.id,
      ownerName: property.owner_name || 'Unknown Owner',
      phoneNumbers: hasPhone ? [
        `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`
      ] : [],
      emailAddresses: hasEmail ? [
        `${property.owner_name?.toLowerCase().replace(/\s+/g, '.')}@email.com`,
        `${property.owner_name?.toLowerCase().replace(/\s+/g, '')}@gmail.com`
      ] : [],
      confidence: Math.floor(Math.random() * 40) + 60, // 60-100%
      lastVerified: new Date(),
      source: ['Public Records', 'Social Media', 'Business Directory'][Math.floor(Math.random() * 3)]
    };
  };

  const startSkipTracing = async () => {
    if (state.results.length === 0) {
      toast.error('No properties to enrich');
      return;
    }

    setSkipTracingStatus(prev => ({
      ...prev,
      isRunning: true,
      progress: 0,
      totalProperties: state.results.length,
      processedProperties: 0,
      results: [],
      errors: []
    }));

    const results: SkipTracingResult[] = [];
    const errors: string[] = [];

    for (let i = 0; i < state.results.length; i++) {
      const property = state.results[i];
      
      setSkipTracingStatus(prev => ({
        ...prev,
        currentProperty: property.address,
        progress: ((i + 1) / state.results.length) * 100,
        processedProperties: i + 1
      }));

      try {
        const result = await mockSkipTracingAPI(property);
        results.push(result);
        
        // Update results in real-time
        setSkipTracingStatus(prev => ({
          ...prev,
          results: [...prev.results, result]
        }));
      } catch (error) {
        errors.push(`Failed to enrich ${property.address}: ${error}`);
        setSkipTracingStatus(prev => ({
          ...prev,
          errors: [...prev.errors, `Failed to enrich ${property.address}: ${error}`]
        }));
      }
    }

    setSkipTracingStatus(prev => ({
      ...prev,
      isRunning: false,
      progress: 100
    }));

    toast.success(`Skip tracing completed! Found contact info for ${results.length} properties`);
    setShowResults(true);
  };

  const exportResults = () => {
    const csvContent = [
      'Property Address,Owner Name,Phone Numbers,Email Addresses,Confidence,Source',
      ...skipTracingStatus.results.map(result => 
        `"${result.propertyId}","${result.ownerName}","${result.phoneNumbers.join('; ')}","${result.emailAddresses.join('; ')}","${result.confidence}%","${result.source}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skip-tracing-results-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Results exported to CSV');
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-green-100 text-green-800';
    if (confidence >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 90) return <CheckCircle className="h-4 w-4" />;
    if (confidence >= 70) return <AlertCircle className="h-4 w-4" />;
    return <AlertCircle className="h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      {/* Skip Tracing Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-blue-600" />
            Skip Tracing Integration
          </CardTitle>
          <CardDescription>
            Enrich property leads with owner contact information using advanced skip tracing technology.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Legal Notice */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Legal Notice:</strong> Skip tracing must comply with TCPA, CAN-SPAM, and state regulations. 
              Only use for legitimate business purposes with proper consent.
            </AlertDescription>
          </Alert>

          {/* Status Display */}
          {skipTracingStatus.isRunning && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Processing properties...</span>
                <span>{skipTracingStatus.processedProperties} / {skipTracingStatus.totalProperties}</span>
              </div>
              <Progress value={skipTracingStatus.progress} className="w-full" />
              <p className="text-sm text-muted-foreground">
                Current: {skipTracingStatus.currentProperty}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              onClick={startSkipTracing}
              disabled={skipTracingStatus.isRunning || state.results.length === 0}
              className="flex items-center gap-2"
            >
              {skipTracingStatus.isRunning ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Phone className="h-4 w-4" />
              )}
              {skipTracingStatus.isRunning ? 'Processing...' : 'Start Skip Tracing'}
            </Button>
            
            {skipTracingStatus.results.length > 0 && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowResults(!showResults)}
                  className="flex items-center gap-2"
                >
                  {showResults ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showResults ? 'Hide' : 'Show'} Results
                </Button>
                <Button
                  variant="outline"
                  onClick={exportResults}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              </>
            )}
          </div>

          {/* Summary Stats */}
          {skipTracingStatus.results.length > 0 && (
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {skipTracingStatus.results.length}
                </div>
                <div className="text-xs text-muted-foreground">Properties Processed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {skipTracingStatus.results.filter(r => r.phoneNumbers.length > 0 || r.emailAddresses.length > 0).length}
                </div>
                <div className="text-xs text-muted-foreground">With Contact Info</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {skipTracingStatus.errors.length}
                </div>
                <div className="text-xs text-muted-foreground">Errors</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Display */}
      <AnimatePresence>
        {showResults && skipTracingStatus.results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-green-600" />
                  Skip Tracing Results
                </CardTitle>
                <CardDescription>
                  Contact information found for {skipTracingStatus.results.length} properties
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {skipTracingStatus.results.map((result, index) => (
                    <motion.div
                      key={result.propertyId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{result.ownerName}</span>
                                <Badge 
                                  variant="secondary" 
                                  className={`text-xs ${getConfidenceColor(result.confidence)}`}
                                >
                                  {getConfidenceIcon(result.confidence)}
                                  {result.confidence}% Confidence
                                </Badge>
                              </div>
                              
                              <div className="text-sm text-muted-foreground">
                                Property ID: {result.propertyId}
                              </div>

                              {/* Contact Information */}
                              <div className="space-y-2">
                                {result.phoneNumbers.length > 0 && (
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-3 w-3 text-green-600" />
                                    <div className="flex flex-wrap gap-1">
                                      {result.phoneNumbers.map((phone, i) => (
                                        <Badge key={i} variant="outline" className="text-xs">
                                          {phone}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {result.emailAddresses.length > 0 && (
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-3 w-3 text-blue-600" />
                                    <div className="flex flex-wrap gap-1">
                                      {result.emailAddresses.map((email, i) => (
                                        <Badge key={i} variant="outline" className="text-xs">
                                          {email}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Building className="h-3 w-3" />
                                Source: {result.source}
                                <span>•</span>
                                Verified: {result.lastVerified.toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Display */}
      {skipTracingStatus.errors.length > 0 && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200">
              <AlertCircle className="h-5 w-5" />
              Processing Errors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {skipTracingStatus.errors.map((error, index) => (
                <div key={index} className="text-sm text-red-700 dark:text-red-300">
                  • {error}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 