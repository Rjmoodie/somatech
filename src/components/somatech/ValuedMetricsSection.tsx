import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface ValuedMetric {
  [key: string]: any;
  Sector: string;
  "Metric Name": string;
  "Metric Tier": string;
  "Relevance Score": number;
  Benchmark: string;
  Description: string;
  "Relevance Reason": string;
  "Benchmark Source"?: string;
  "Company Value"?: string | number;
}

interface ValuedMetricsSectionProps {
  sector: string;
  companyMetrics: Record<string, string | number>; // { [metricName]: value }
}

const ValuedMetricsSection: React.FC<ValuedMetricsSectionProps> = ({ sector, companyMetrics }) => {
  const [metrics, setMetrics] = useState<ValuedMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMetrics() {
      setLoading(true);
      const response = await fetch("/valued-metrics.json");
      const allMetrics = await response.json();
      const filtered = allMetrics
        .filter((row: ValuedMetric) => row.Sector === sector && row["Metric Tier"] === "Primary")
        .sort((a: ValuedMetric, b: ValuedMetric) => b["Relevance Score"] - a["Relevance Score"]);
      setMetrics(filtered);
      setLoading(false);
    }
    fetchMetrics();
  }, [sector]);

  const getStatusIcon = (outperforms: boolean | null) => {
    if (outperforms === null) return AlertTriangle;
    return outperforms ? CheckCircle : XCircle;
  };

  const getStatusColor = (outperforms: boolean | null) => {
    if (outperforms === null) return 'text-yellow-600';
    return outperforms ? 'text-green-600' : 'text-red-600';
  };

  if (loading) return <div>Loading valued metrics...</div>;
  if (!metrics.length) return <div>No valued metrics found for this sector.</div>;

  return (
    <Card className="w-full">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl">Valued Metrics</CardTitle>
        <CardDescription className="text-sm">
          Comprehensive evaluation of business quality with industry benchmarks
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          {metrics.map((metric) => {
            const metricName = metric["Metric Name"];
            const companyValue = companyMetrics[metricName] ?? "N/A";
            const benchmark = metric.Benchmark;
            const isNumber = !isNaN(Number(companyValue)) && !isNaN(Number(benchmark));
            const outperforms = isNumber ? Number(companyValue) >= Number(benchmark) : null;
            const Icon = getStatusIcon(outperforms);
            const isSelected = selectedMetric === metricName;
            return (
              <div key={metricName} className="space-y-3">
                <div
                  className={`flex flex-col sm:flex-row sm:items-center p-3 sm:p-4 border rounded-lg cursor-pointer transition-all ${
                    isSelected ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedMetric(isSelected ? null : metricName)}
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${getStatusColor(outperforms)} flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-sm sm:text-base truncate">{metricName}</div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <div className="text-xs sm:text-sm text-muted-foreground">
                          Company: <span className="font-medium text-foreground">{companyValue}</span>
                        </div>
                        <div className="text-xs sm:text-sm text-muted-foreground">
                          Benchmark: <span className="font-medium text-foreground">{benchmark}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end space-x-3 mt-3 sm:mt-0">
                    {/* Optionally, you can add a progress bar or score if you have one */}
                    <span className={`text-xs sm:text-sm font-medium w-24 text-right ${getStatusColor(outperforms)}`}>
                      {outperforms === null ? 'N/A' : outperforms ? 'Outperforms' : 'Underperforms'}
                    </span>
                  </div>
                </div>
                {/* Expanded View */}
                {isSelected && (
                  <div className="ml-4 p-4 bg-muted/30 rounded-lg border-l-4 border-primary">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{metricName} Details</h4>
                      <Button variant="outline" size="sm" onClick={() => setSelectedMetric(null)}>
                        Close
                      </Button>
                    </div>
                    <div className="mb-2 text-sm">{metric.Description}</div>
                    <div className="mb-2 text-xs text-muted-foreground">
                      <strong>Why it matters:</strong> {metric["Relevance Reason"]}
                    </div>
                    {metric["Benchmark Source"] && (
                      <div className="text-xs text-muted-foreground">
                        <strong>Benchmark Source:</strong> {metric["Benchmark Source"]}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ValuedMetricsSection; 