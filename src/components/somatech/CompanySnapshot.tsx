import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, MapPin, Calendar, Users } from "lucide-react";

interface CompanySnapshotProps {
  ticker: string;
}

const CompanySnapshot = ({ ticker }: CompanySnapshotProps) => {
  // Mock data - in real implementation, this would be fetched based on ticker
  const companyData = {
    name: ticker === "AAPL" ? "Apple Inc." : ticker === "TSLA" ? "Tesla, Inc." : `${ticker} Corporation`,
    sector: ticker === "AAPL" ? "Technology" : ticker === "TSLA" ? "Automotive" : "Technology",
    industry: ticker === "AAPL" ? "Consumer Electronics" : ticker === "TSLA" ? "Electric Vehicles" : "Software",
    marketCap: ticker === "AAPL" ? "$2.8T" : ticker === "TSLA" ? "$850B" : "$500B",
    exchange: "NASDAQ",
    headquarters: ticker === "AAPL" ? "Cupertino, CA" : ticker === "TSLA" ? "Austin, TX" : "Seattle, WA",
    founded: ticker === "AAPL" ? "1976" : ticker === "TSLA" ? "2003" : "1994",
    ceo: ticker === "AAPL" ? "Tim Cook" : ticker === "TSLA" ? "Elon Musk" : "John Smith",
    employees: ticker === "AAPL" ? "164,000" : ticker === "TSLA" ? "140,000" : "50,000",
    week52High: ticker === "AAPL" ? "$199.62" : ticker === "TSLA" ? "$414.50" : "$250.00",
    week52Low: ticker === "AAPL" ? "$164.08" : ticker === "TSLA" ? "$138.80" : "$150.00",
    currentPrice: ticker === "AAPL" ? "$175.43" : ticker === "TSLA" ? "$248.50" : "$185.20",
    priceChange: ticker === "AAPL" ? "+2.4%" : ticker === "TSLA" ? "+1.8%" : "+0.9%",
    peRatio: ticker === "AAPL" ? "25.4" : ticker === "TSLA" ? "45.2" : "18.7",
    dividendYield: ticker === "AAPL" ? "0.5%" : ticker === "TSLA" ? "N/A" : "2.1%",
    ma50: ticker === "AAPL" ? "$168.50" : ticker === "TSLA" ? "$235.20" : "$178.90",
    ma200: ticker === "AAPL" ? "$155.20" : ticker === "TSLA" ? "$210.80" : "$165.30"
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