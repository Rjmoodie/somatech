import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StockData } from "./types";

interface BusinessBenchmarksProps {
  ticker: string;
  stockData?: StockData | null;
}

const BusinessBenchmarks = ({ ticker, stockData }: BusinessBenchmarksProps) => {
  
  // Calculate profile match based on real stock data
  const calculateProfileMatch = (data: StockData | null) => {
    if (!data) return { type: "Unknown", description: "Unable to determine profile without data." };
    
    const { pe, roe, marketCap, financials } = data;
    
    // Calculate revenue growth estimate based on financials
    const revenue = financials?.revenue ? parseFloat(financials.revenue) : 0;
    const netIncome = financials?.netIncome ? parseFloat(financials.netIncome) : 0;
    const netMargin = revenue > 0 ? (netIncome / revenue) * 100 : 0;
    
    // High-Growth profile: High P/E, High ROE, Strong margins or rapid growth potential
    if (pe > 30 && roe > 0.15 && (netMargin > 15 || marketCap < 50000000000)) {
      return {
        type: "High-Growth",
        description: `${ticker} shows high-growth characteristics with elevated P/E ratio (${pe.toFixed(1)}), strong ROE (${(roe * 100).toFixed(1)}%), suggesting investors expect rapid expansion.`
      };
    }
    
    // Declining profile: Low P/E, Poor ROE, declining margins
    if (pe < 12 && roe < 0.05 && netMargin < 5) {
      return {
        type: "Declining",
        description: `${ticker} exhibits declining business characteristics with low P/E (${pe.toFixed(1)}), weak ROE (${(roe * 100).toFixed(1)}%), indicating potential operational challenges.`
      };
    }
    
    // Mature & Stable (default for everything in between)
    return {
      type: "Mature & Stable",
      description: `${ticker} demonstrates mature, stable business characteristics with balanced P/E (${pe.toFixed(1)}), solid ROE (${(roe * 100).toFixed(1)}%), typical of established companies.`
    };
  };
  
  const profileMatch = calculateProfileMatch(stockData);
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
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              profileMatch.type === "High-Growth" ? "bg-green-100 text-green-800" :
              profileMatch.type === "Declining" ? "bg-red-100 text-red-800" :
              "bg-blue-100 text-blue-800"
            }`}>
              {ticker} most similar to: {profileMatch.type}
            </div>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            {profileMatch.description}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessBenchmarks;