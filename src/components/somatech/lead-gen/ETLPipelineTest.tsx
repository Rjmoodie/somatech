import React, { useState } from 'react';
import { enhancedLeadService } from '@/services/enhanced-lead-service';
import { ETLResult } from '@/services/etl-pipeline';

interface PipelineStatus {
  source: string;
  lastRun?: Date;
  status: string;
}

const ETLPipelineTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ETLResult[]>([]);
  const [pipelineStatus, setPipelineStatus] = useState<PipelineStatus[]>([]);
  const [selectedSource, setSelectedSource] = useState<string>('mock');

  const handleRunPipeline = async (source?: string) => {
    setIsLoading(true);
    try {
      const pipelineResults = await enhancedLeadService.refreshPropertyData(source);
      setResults(pipelineResults);
      console.log('ETL Pipeline Results:', pipelineResults);
    } catch (error) {
      console.error('ETL Pipeline Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetStatus = async () => {
    try {
      const status = await enhancedLeadService.getPipelineStatus();
      setPipelineStatus(status);
    } catch (error) {
      console.error('Failed to get pipeline status:', error);
    }
  };

  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        ETL Pipeline Test - Phase 2A Implementation
      </h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Pipeline Management
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Source
            </label>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="mock">Mock Data (Testing)</option>
              <option value="attom">ATTOM Data API</option>
              <option value="corelogic">CoreLogic API</option>
              <option value="county_assessor">County Assessor</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => handleRunPipeline(selectedSource)}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Running...' : `Run ${selectedSource} Pipeline`}
            </button>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => handleRunPipeline()}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Running...' : 'Run All Pipelines'}
            </button>
          </div>
        </div>
        
        <button
          onClick={handleGetStatus}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Get Pipeline Status
        </button>
      </div>

      {/* Pipeline Status */}
      {pipelineStatus.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Pipeline Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pipelineStatus.map((status, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="font-medium text-gray-800">{status.source}</div>
                <div className="text-sm text-gray-600">
                  Status: <span className="font-medium">{status.status}</span>
                </div>
                {status.lastRun && (
                  <div className="text-sm text-gray-600">
                    Last Run: {status.lastRun.toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ETL Results */}
      {results.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            ETL Pipeline Results
          </h3>
          
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-medium text-gray-800 capitalize">
                    {result.source} Pipeline
                  </h4>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    result.success 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {result.success ? 'Success' : 'Failed'}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {result.propertiesProcessed}
                    </div>
                    <div className="text-sm text-gray-600">Processed</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {result.propertiesAdded}
                    </div>
                    <div className="text-sm text-gray-600">Added</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {result.propertiesUpdated}
                    </div>
                    <div className="text-sm text-gray-600">Updated</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {result.propertiesSkipped}
                    </div>
                    <div className="text-sm text-gray-600">Skipped</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div>
                    Processing Time: <span className="font-medium">{formatDuration(result.processingTime)}</span>
                  </div>
                  <div>
                    Data Source: <span className="font-medium capitalize">{result.source}</span>
                  </div>
                </div>
                
                {result.errors.length > 0 && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                    <div className="text-sm font-medium text-red-800 mb-2">Errors:</div>
                    <ul className="text-sm text-red-700 space-y-1">
                      {result.errors.map((error, errorIndex) => (
                        <li key={errorIndex}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Implementation Notes */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2 text-blue-800">
          Phase 2A Implementation Notes
        </h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>ETL Pipeline Infrastructure:</strong> Modular extract, transform, load system</li>
          <li>• <strong>Data Validation:</strong> Multi-layer validation with confidence scoring</li>
          <li>• <strong>Investment Scoring:</strong> Automated calculation based on equity, property type, and condition</li>
          <li>• <strong>ARV Estimation:</strong> After-repair value calculations with condition-based multipliers</li>
          <li>• <strong>Data Enrichment:</strong> Enhanced fields for better lead generation</li>
          <li>• <strong>Conflict Resolution:</strong> Smart handling of duplicate properties</li>
        </ul>
      </div>

      {/* Next Steps */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2 text-yellow-800">
          Next Steps - Phase 2B
        </h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• <strong>Real Data Sources:</strong> Integrate ATTOM, CoreLogic, and county assessor APIs</li>
          <li>• <strong>Advanced Search:</strong> Implement PostGIS for geospatial queries</li>
          <li>• <strong>Performance Optimization:</strong> Add Redis caching and query optimization</li>
          <li>• <strong>Real-time Updates:</strong> Automated data refresh with notifications</li>
        </ul>
      </div>
    </div>
  );
};

export default ETLPipelineTest; 