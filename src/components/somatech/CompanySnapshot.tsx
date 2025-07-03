import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, MapPin, Calendar, Users } from "lucide-react";

interface CompanySnapshotProps {
  ticker: string;
  stockData?: any;
}

const CompanySnapshot = ({ ticker, stockData }: CompanySnapshotProps) => {
  // Use real API data when available, fallback to reasonable defaults
  const formatCurrency = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${value.toLocaleString()}`;
  };

  const formatPercent = (value: number) => {
    const formatted = value.toFixed(2);
    return value >= 0 ? `+${formatted}%` : `${formatted}%`;
  };

  const companyData = {
    name: stockData?.companyName || `${ticker} Corporation`,
    sector: stockData?.sector || "Technology",
    industry: stockData?.industry || "Software",
    marketCap: stockData?.marketCap ? formatCurrency(stockData.marketCap) : "$500B",
    exchange: "NASDAQ",
    description: stockData?.description || "No description available",
    week52High: stockData?.week52High ? `$${stockData.week52High.toFixed(2)}` : "$250.00",
    week52Low: stockData?.week52Low ? `$${stockData.week52Low.toFixed(2)}` : "$150.00",
    currentPrice: stockData?.price ? `$${stockData.price.toFixed(2)}` : "$185.20",
    priceChange: stockData?.priceChangePercent ? formatPercent(stockData.priceChangePercent) : "+0.9%",
    peRatio: stockData?.pe ? stockData.pe.toFixed(1) : "18.7",
    dividendYield: stockData?.dividendYield ? `${(stockData.dividendYield * 100).toFixed(1)}%` : "N/A",
    ma50: stockData?.technicals?.ma50 ? `$${stockData.technicals.ma50.toFixed(2)}` : "$178.90",
    ma200: stockData?.technicals?.ma200 ? `$${stockData.technicals.ma200.toFixed(2)}` : "$165.30",
    beta: stockData?.beta ? stockData.beta.toFixed(2) : "1.0",
    volume: stockData?.volume ? stockData.volume.toLocaleString() : "1,000,000",
    headquarters: "N/A", // API doesn't provide this data
    founded: "N/A", // API doesn't provide this data  
    employees: "N/A", // API doesn't provide this data
    ceo: "N/A" // API doesn't provide this data
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Building2 className="h-5 w-5" />
          <span>{ticker} Company Snapshot</span>
        </CardTitle>
        <CardDescription>Core company information and market performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Company Identity */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Company Identity</h4>
            <div className="space-y-3">
              <div>
                <div className="text-lg font-semibold">{companyData.name}</div>
                <div className="text-sm text-muted-foreground">{ticker} • {companyData.exchange}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Sector & Industry</div>
                <div className="text-sm text-muted-foreground">{companyData.sector} • {companyData.industry}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Market Cap</div>
                <div className="text-sm text-muted-foreground">{companyData.marketCap}</div>
              </div>
            </div>
          </div>

          {/* Company Details */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Company Details</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Headquarters</div>
                  <div className="text-sm text-muted-foreground">{companyData.headquarters}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Founded</div>
                  <div className="text-sm text-muted-foreground">{companyData.founded}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Employees</div>
                  <div className="text-sm text-muted-foreground">{companyData.employees}</div>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">CEO</div>
                <div className="text-sm text-muted-foreground">{companyData.ceo}</div>
              </div>
            </div>
          </div>

          {/* Market Performance */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Market Performance</h4>
            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium">Current Price</div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold">{companyData.currentPrice}</span>
                  <span className={`text-sm font-medium ${
                    companyData.priceChange.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {companyData.priceChange}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">52-Week Range</div>
                <div className="text-sm text-muted-foreground">{companyData.week52Low} - {companyData.week52High}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-sm font-medium">50-Day MA</div>
                  <div className="text-sm text-muted-foreground">{companyData.ma50}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">200-Day MA</div>
                  <div className="text-sm text-muted-foreground">{companyData.ma200}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-sm font-medium">P/E Ratio</div>
                  <div className="text-sm text-muted-foreground">{companyData.peRatio}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Dividend Yield</div>
                  <div className="text-sm text-muted-foreground">{companyData.dividendYield}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanySnapshot;