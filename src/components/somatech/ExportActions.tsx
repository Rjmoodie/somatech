import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Save } from "lucide-react";
import { StockData, DCFScenarios, InvestmentThesis } from "./types";
import WatchlistDialog from "./WatchlistDialog";

interface ExportActionsProps {
  ticker: string;
  stockData?: StockData | null;
  dcfScenarios?: DCFScenarios;
  investmentThesis?: InvestmentThesis;
}

const ExportActions = ({ ticker, stockData, dcfScenarios, investmentThesis }: ExportActionsProps) => {
  const [watchlistDialogOpen, setWatchlistDialogOpen] = useState(false);

  const defaultDcfScenarios: DCFScenarios = {
    low: { revenueGrowth: 5, netMargin: 8, fcfGrowth: 3, exitMultiple: 15, discountRate: 12 },
    base: { revenueGrowth: 12, netMargin: 15, fcfGrowth: 8, exitMultiple: 20, discountRate: 10 },
    high: { revenueGrowth: 20, netMargin: 22, fcfGrowth: 15, exitMultiple: 25, discountRate: 8 }
  };

  const defaultInvestmentThesis: InvestmentThesis = {
    moat: "",
    risks: "",
    opportunities: ""
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Export & Save {ticker} Analysis</CardTitle>
          <CardDescription>Save your {ticker} analysis or export as a report</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Export {ticker} PDF Report</span>
              <span className="sm:hidden">Export PDF</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setWatchlistDialogOpen(true)}
              disabled={!stockData}
            >
              <Save className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Save to Watchlist</span>
              <span className="sm:hidden">Save</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <WatchlistDialog
        open={watchlistDialogOpen}
        onOpenChange={setWatchlistDialogOpen}
        ticker={ticker}
        stockData={stockData}
        dcfScenarios={dcfScenarios || defaultDcfScenarios}
        investmentThesis={investmentThesis || defaultInvestmentThesis}
      />
    </>
  );
};

export default ExportActions;