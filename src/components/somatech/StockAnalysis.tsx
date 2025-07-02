import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Search, Download, Save } from "lucide-react";
import TradingViewWidget from "react-tradingview-widget";
import { StockData, DCFScenarios, InvestmentThesis } from "./types";
import { getStatusColor, getStatusIcon, generateStockChartData, calculateDCF } from "./utils";

interface StockAnalysisProps {
  globalTicker: string;
  setGlobalTicker: (ticker: string) => void;
}

const StockAnalysis = ({ globalTicker, setGlobalTicker }: StockAnalysisProps) => {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [dcfScenarios, setDcfScenarios] = useState<DCFScenarios>({
    low: { revenueGrowth: 5, netMargin: 8, fcfGrowth: 3, exitMultiple: 15, discountRate: 12 },
    base: { revenueGrowth: 12, netMargin: 15, fcfGrowth: 8, exitMultiple: 20, discountRate: 10 },
    high: { revenueGrowth: 20, netMargin: 22, fcfGrowth: 15, exitMultiple: 25, discountRate: 8 }
  });
  const [investmentThesis, setInvestmentThesis] = useState<InvestmentThesis>({
    moat: "",
    risks: "",
    opportunities: ""
  });

  const analyzeStock = () => {
    const mockData: StockData = {
      symbol: globalTicker,
      price: 175.43,
      pe: 25.4,
      pbv: 4.2,
      roe: 26.8,
      debtToEquity: 1.73,
      currentRatio: 1.05,
      score: 85,
      intrinsicValue: 165,
      recommendation: "BUY",
      chartData: generateStockChartData(),
      pillars: {
        revenueGrowth: { score: 85, status: "good", value: "15.2%" },
        epsGrowth: { score: 78, status: "good", value: "12.8%" },
        returnOnCapital: { score: 92, status: "excellent", value: "26.8%" },
        debtLevels: { score: 65, status: "moderate", value: "1.73x" },
        freeCashFlow: { score: 88, status: "good", value: "$12.4B" },
        valuation: { score: 72, status: "moderate", value: "25.4x P/E" },
        shareDilution: { score: 90, status: "excellent", value: "-2.1%" },
        insiderOwnership: { score: 95, status: "excellent", value: "8.4%" }
      },
      technicals: {
        trend: "bullish",
        ma50: 168.50,
        ma200: 155.20,
        rsi: 62,
        macd: "positive"
      },
      ratios: {
        quickRatio: 0.98,
        assetTurnover: 1.1,
        grossMargin: 42.5,
        operatingMargin: 28.1
      }
    };
    setStockData(mockData);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Stock Ticker Input</CardTitle>
          <CardDescription>Enter any public stock symbol for analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <Input
              placeholder="AAPL"
              value={globalTicker}
              onChange={(e) => setGlobalTicker(e.target.value.toUpperCase())}
              className="flex-1"
            />
            <Button onClick={analyzeStock}>
              <Search className="h-4 w-4 mr-2" />
              Analyze
            </Button>
          </div>
        </CardContent>
      </Card>

      {stockData && (
        <div className="space-y-6">
          {/* TradingView Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Live Chart - {stockData.symbol}</CardTitle>
              <CardDescription>Professional TradingView chart with real-time data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <TradingViewWidget
                  symbol={globalTicker}
                  theme="Light"
                  autosize
                  hide_side_toolbar={false}
                  studies={["RSI", "MACD"]}
                  interval="D"
                  toolbar_bg="#f1f3f6"
                  enable_publishing={false}
                  allow_symbol_change={true}
                  save_image={false}
                  hide_volume={false}
                />
              </div>
            </CardContent>
          </Card>

          {/* Technical Analysis Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Technical & Momentum Snapshot</CardTitle>
              <CardDescription>Key technical indicators and trend analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium mb-2 ${
                    stockData.technicals.trend === 'bullish' ? 'bg-green-100 text-green-800' : 
                    stockData.technicals.trend === 'bearish' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {stockData.technicals.trend.toUpperCase()}
                  </div>
                  <p className="text-xs text-muted-foreground">Overall Trend</p>
                </div>
                <div className="text-center">
                  <div className="font-semibold">${stockData.technicals.ma50}</div>
                  <p className="text-xs text-muted-foreground">50-Day MA</p>
                </div>
                <div className="text-center">
                  <div className="font-semibold">${stockData.technicals.ma200}</div>
                  <p className="text-xs text-muted-foreground">200-Day MA</p>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{stockData.technicals.rsi}</div>
                  <p className="text-xs text-muted-foreground">RSI</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Financial Ratios with Color Coding */}
          <Card>
            <CardHeader>
              <CardTitle>Enhanced Financial Ratios</CardTitle>
              <CardDescription>Color-coded analysis with industry benchmarks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(stockData.ratios).map(([key, value]) => (
                  <div key={key} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                      <div className={`w-3 h-3 rounded-full ${
                        typeof value === 'number' && value > 1 ? 'bg-green-500' : 
                        typeof value === 'number' && value > 0.5 ? 'bg-yellow-500' : 
                        'bg-red-500'
                      }`} />
                    </div>
                    <div className="text-lg font-semibold">{typeof value === 'number' ? value.toFixed(2) : String(value)}{typeof value === 'number' && value > 1 ? 'x' : '%'}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 8-Pillar Scorecard Detailed */}
          <Card>
            <CardHeader>
              <CardTitle>8-Pillar Financial Strength Scorecard</CardTitle>
              <CardDescription>Proprietary scoring system analyzing key financial metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stockData.pillars).map(([key, pillar]) => {
                  const Icon = getStatusIcon(pillar.status);
                  return (
                    <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon className={`h-5 w-5 ${getStatusColor(pillar.status)}`} />
                        <div>
                          <div className="font-medium">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</div>
                          <div className="text-sm text-muted-foreground">{pillar.value}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={pillar.score} className="w-20" />
                        <span className="text-sm font-medium w-8">{pillar.score}</span>
                      </div>
                    </div>
                  );
                })}
                
                <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{stockData.score}/100</div>
                    <Progress value={stockData.score} className="mb-2" />
                    <p className="text-sm text-muted-foreground">Overall Somatic Investment Score</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Type Benchmarks */}
          <Card>
            <CardHeader>
              <CardTitle>Business Lifecycle Benchmarks</CardTitle>
              <CardDescription>Compare to archetypal business profiles across different lifecycle stages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* High-Growth Companies */}
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mb-2">
                      🧨 High-Growth
                    </div>
                    <p className="text-xs text-muted-foreground">Early-Stage Rocket</p>
                    <p className="text-xs text-muted-foreground mt-1">Examples: SNOW, PLTR, NVDA</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Revenue Growth</span>
                      <span className="font-medium">20-100%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">EPS Growth</span>
                      <span className="font-medium">15-60%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Operating Margin</span>
                      <span className="font-medium">Low → Rising</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">FCF Margin</span>
                      <span className="font-medium">0-10%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">P/E Ratio</span>
                      <span className="font-medium">50-100+</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">EV/Revenue</span>
                      <span className="font-medium">10-30x</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">R&D % Revenue</span>
                      <span className="font-medium">15-30%</span>
                    </div>
                  </div>
                </div>

                {/* Mature & Stable Companies */}
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-2">
                      🧱 Mature & Stable
                    </div>
                    <p className="text-xs text-muted-foreground">Cash-Rich Compounder</p>
                    <p className="text-xs text-muted-foreground mt-1">Examples: MSFT, JNJ, V</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Revenue Growth</span>
                      <span className="font-medium">5-12%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">EPS Growth</span>
                      <span className="font-medium">5-15%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Operating Margin</span>
                      <span className="font-medium">20-40%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">FCF Margin</span>
                      <span className="font-medium">15-25%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">P/E Ratio</span>
                      <span className="font-medium">15-25</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">EV/Revenue</span>
                      <span className="font-medium">3-6x</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">R&D % Revenue</span>
                      <span className="font-medium">5-10%</span>
                    </div>
                  </div>
                </div>

                {/* Declining Companies */}
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 mb-2">
                      🕳️ Declining
                    </div>
                    <p className="text-xs text-muted-foreground">Stagnant or Deteriorating</p>
                    <p className="text-xs text-muted-foreground mt-1">Examples: IBM, T, INTC</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Revenue Growth</span>
                      <span className="font-medium">0% or negative</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">EPS Growth</span>
                      <span className="font-medium">Flat or declining</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Operating Margin</span>
                      <span className="font-medium">Shrinking/volatile</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">FCF Margin</span>
                      <span className="font-medium">Negative/inconsistent</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">P/E Ratio</span>
                      <span className="font-medium">&lt;10</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">EV/Revenue</span>
                      <span className="font-medium">&lt;2x</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">R&D % Revenue</span>
                      <span className="font-medium">Very low</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Match Badge */}
              <div className="mt-6 p-4 border rounded-lg bg-muted/50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{globalTicker} Profile Match</div>
                    <div className="text-xs text-muted-foreground">Based on {globalTicker}'s current financial metrics</div>
                  </div>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {globalTicker} most similar to: Mature & Stable
                  </div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {globalTicker} exhibits characteristics of a mature, cash-generating business with stable margins and moderate growth, similar to companies like MSFT and V.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* DCF Scenario Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>{globalTicker} DCF Scenario Analysis</CardTitle>
              <CardDescription>Three-scenario valuation model for {globalTicker} with customizable inputs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Input Table */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="font-medium">Variable</div>
                  <div className="font-medium text-center">Low Case</div>
                  <div className="font-medium text-center">Base Case</div>
                  <div className="font-medium text-center">High Case</div>
                  
                  {Object.entries(dcfScenarios.low).map(([key, _]) => (
                    <div key={key} className="contents">
                      <div className="text-sm py-2">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</div>
                      {(['low', 'base', 'high'] as const).map(scenario => (
                        <Input
                          key={`${key}-${scenario}`}
                          type="number"
                          value={dcfScenarios[scenario][key as keyof typeof dcfScenarios.low]}
                          onChange={(e) => setDcfScenarios(prev => ({
                            ...prev,
                            [scenario]: { ...prev[scenario], [key]: parseFloat(e.target.value) }
                          }))}
                          className="text-center"
                        />
                      ))}
                    </div>
                  ))}
                </div>

                {/* DCF Results */}
                <div className="grid grid-cols-3 gap-4">
                  {(['low', 'base', 'high'] as const).map(scenario => {
                    const result = calculateDCF(dcfScenarios[scenario], stockData);
                    return (
                      <Card key={scenario} className={scenario === 'base' ? 'border-primary' : ''}>
                        <CardHeader>
                          <CardTitle className="text-center">{scenario.toUpperCase()} CASE</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center space-y-2">
                          <div className="text-2xl font-bold text-primary">${result.intrinsicValue}</div>
                          <div className="text-sm text-muted-foreground">Intrinsic Value</div>
                          <div className="text-lg font-semibold">{result.cagr}%</div>
                          <div className="text-sm text-muted-foreground">5-Year CAGR</div>
                          <div className={`text-lg font-semibold ${result.upside > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {result.upside > 0 ? '+' : ''}{result.upside}%
                          </div>
                          <div className="text-sm text-muted-foreground">Upside/Downside</div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Investment Thesis Generator */}
          <Card>
            <CardHeader>
              <CardTitle>{globalTicker} Investment Thesis Generator</CardTitle>
              <CardDescription>Document your {globalTicker} investment analysis and thesis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{globalTicker} Economic Moat & Competitive Advantages</Label>
                <textarea
                  className="w-full min-h-20 p-3 border rounded-lg resize-none"
                  placeholder={`Describe ${globalTicker}'s competitive moats, brand strength, network effects, switching costs...`}
                  value={investmentThesis.moat}
                  onChange={(e) => setInvestmentThesis(prev => ({ ...prev, moat: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>{globalTicker} Key Risks & Concerns</Label>
                <textarea
                  className="w-full min-h-20 p-3 border rounded-lg resize-none"
                  placeholder={`${globalTicker} regulatory risks, competition, balance sheet concerns, market risks...`}
                  value={investmentThesis.risks}
                  onChange={(e) => setInvestmentThesis(prev => ({ ...prev, risks: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>{globalTicker} Growth Opportunities</Label>
                <textarea
                  className="w-full min-h-20 p-3 border rounded-lg resize-none"
                  placeholder={`${globalTicker} market expansion, product innovation, M&A opportunities, margin improvement...`}
                  value={investmentThesis.opportunities}
                  onChange={(e) => setInvestmentThesis(prev => ({ ...prev, opportunities: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Export/Save Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Export & Save {globalTicker} Analysis</CardTitle>
              <CardDescription>Save your {globalTicker} analysis or export as a report</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <Button className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Export {globalTicker} PDF Report
                </Button>
                <Button variant="outline" className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Save {globalTicker} to Portfolio
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StockAnalysis;