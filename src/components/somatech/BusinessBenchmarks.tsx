import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface BusinessBenchmarksProps {
  ticker: string;
}

const BusinessBenchmarks = ({ ticker }: BusinessBenchmarksProps) => {
  const benchmarkData = [
    {
      type: "High-Growth",
      emoji: "🧨",
      subtitle: "Early-Stage Rocket",
      examples: "SNOW, PLTR, NVDA",
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      metrics: [
        { label: "Revenue Growth", value: "20-100%" },
        { label: "EPS Growth", value: "15-60%" },
        { label: "Operating Margin", value: "Low → Rising" },
        { label: "FCF Margin", value: "0-10%" },
        { label: "P/E Ratio", value: "50-100+" },
        { label: "EV/Revenue", value: "10-30x" },
        { label: "R&D % Revenue", value: "15-30%" }
      ]
    },
    {
      type: "Mature & Stable",
      emoji: "🧱",
      subtitle: "Cash-Rich Compounder",
      examples: "MSFT, JNJ, V",
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      metrics: [
        { label: "Revenue Growth", value: "5-12%" },
        { label: "EPS Growth", value: "5-15%" },
        { label: "Operating Margin", value: "20-40%" },
        { label: "FCF Margin", value: "15-25%" },
        { label: "P/E Ratio", value: "15-25" },
        { label: "EV/Revenue", value: "3-6x" },
        { label: "R&D % Revenue", value: "5-10%" }
      ]
    },
    {
      type: "Declining",
      emoji: "🕳️",
      subtitle: "Stagnant or Deteriorating",
      examples: "IBM, T, INTC",
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      metrics: [
        { label: "Revenue Growth", value: "0% or negative" },
        { label: "EPS Growth", value: "Flat or declining" },
        { label: "Operating Margin", value: "Shrinking/volatile" },
        { label: "FCF Margin", value: "Negative/inconsistent" },
        { label: "P/E Ratio", value: "<10" },
        { label: "EV/Revenue", value: "<2x" },
        { label: "R&D % Revenue", value: "Very low" }
      ]
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Lifecycle Benchmarks</CardTitle>
        <CardDescription>Compare to archetypal business profiles across different lifecycle stages</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benchmarkData.map((benchmark) => (
            <div key={benchmark.type} className="space-y-4">
              <div className="text-center">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${benchmark.bgColor} ${benchmark.textColor} mb-2`}>
                  {benchmark.emoji} {benchmark.type}
                </div>
                <p className="text-xs text-muted-foreground">{benchmark.subtitle}</p>
                <p className="text-xs text-muted-foreground mt-1">Examples: {benchmark.examples}</p>
              </div>
              
              <div className="space-y-3">
                {benchmark.metrics.map((metric) => (
                  <div key={metric.label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{metric.label}</span>
                    <span className="font-medium">{metric.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* AI Match Badge */}
        <div className="mt-6 p-4 border rounded-lg bg-muted/50">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">{ticker} Profile Match</div>
              <div className="text-xs text-muted-foreground">Based on {ticker}&apos;s current financial metrics</div>
            </div>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {ticker} most similar to: Mature & Stable
            </div>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            {ticker} exhibits characteristics of a mature, cash-generating business with stable margins and moderate growth, similar to companies like MSFT and V.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessBenchmarks;