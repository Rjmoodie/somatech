import React, { useState, useRef } from "react";
import { Card, CardContent } from "../../ui/card";
import InvestorDropdown from "./key-holdings/InvestorDropdown";
import QuarterSelector from "./key-holdings/QuarterSelector";
import SectorFilter from "./key-holdings/SectorFilter";
import HoldingsTable from "./key-holdings/HoldingsTable";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { useToast } from "@/hooks/use-toast";
import { BarChart3, Info, Link as LinkIcon, PieChart, TrendingUp } from "lucide-react";

function toCSV(rows: any[], columns: string[]): string {
  const header = columns.join(",");
  const body = rows.map(row => columns.map(col => `"${(row[col] ?? "").toString().replace(/"/g, '""')}"`).join(",")).join("\n");
  return `${header}\n${body}`;
}

export default function KeyHoldingsSection() {
  const [investor, setInvestor] = useState<string | null>(null);
  const [quarter, setQuarter] = useState<string | null>(null);
  const [sectors, setSectors] = useState<string[]>([]);
  const { toast } = useToast();
  const tableRef = useRef<any>(null);
  const [exportRows, setExportRows] = useState<any[]>([]);

  const handleReset = () => {
    setInvestor(null);
    setQuarter(null);
    setSectors([]);
  };

  const hasActiveFilters = investor || quarter || sectors.length > 0;

  const handleNotify = () => {
    toast({
      title: "Notifications Enabled!",
      description: "You will be notified of major changes to these holdings.",
      duration: 4000,
    });
  };

  // Export logic: get rows from HoldingsTable via callback
  const handleExport = () => {
    if (!exportRows.length) {
      toast({ title: "No data to export", description: "There are no holdings to export." });
      return;
    }
    const columns = ["investor", "stock", "ticker", "sector", "allocation", "insight", "quarter"];
    const csv = toCSV(exportRows, columns);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "key_holdings.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="w-full py-10 bg-gradient-to-br from-white via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <Card className="p-8 w-full shadow-xl bg-white/90 dark:bg-gray-900/90">
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="text-blue-500" size={28} />
              <h2 className="text-3xl heading-stern mb-1 dark:text-white">Key Holdings</h2>
            </div>
            <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full mb-4" />
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center gap-1 text-xs bg-blue-50 dark:bg-gray-800 text-blue-700 dark:text-cyan-200 px-2 py-1 rounded-full">
                <Info size={14} /> Source: <a href="https://www.dataroma.com/m/home.php" target="_blank" rel="noopener noreferrer" className="underline flex items-center gap-1 dark:text-cyan-400">Dataroma <LinkIcon size={12} /></a>
              </span>
            </div>
            {/* Snapshot summary row (placeholder) */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-100 via-cyan-100 to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-xl flex flex-wrap gap-8 text-base font-medium shadow-sm items-center">
              <span className="flex items-center gap-2 text-gray-800 dark:text-cyan-200"><PieChart className="text-blue-400 dark:text-cyan-400" size={18} /> Top Sector: <b>Technology</b> (45%)</span>
              <span className="flex items-center gap-2 text-gray-800 dark:text-cyan-200"><TrendingUp className="text-blue-400 dark:text-cyan-400" size={18} /> Avg. Portfolio Beta: <b>1.12</b></span>
              <span className="flex items-center gap-2 text-gray-800 dark:text-cyan-200"><BarChart3 className="text-blue-400 dark:text-cyan-400" size={18} /> Avg. Return YTD: <b>+8.3%</b></span>
            </div>
            {/* Sticky Filter Bar */}
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 pb-2 mb-2 border-b flex flex-wrap gap-4 items-center justify-center">
              <InvestorDropdown value={investor} onChange={setInvestor} />
              <QuarterSelector value={quarter} onChange={setQuarter} />
              <SectorFilter value={sectors} onChange={setSectors} investor={investor} quarter={quarter} />
              {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={handleReset} className="ml-2">
                  Clear/Reset
                </Button>
              )}
            </div>
            {/* Active Filters as Badges */}
            <div className="flex flex-wrap gap-2 mb-2 justify-center">
              {investor && <Badge variant="secondary" className="dark:bg-gray-800 dark:text-cyan-200">Investor: {investor}</Badge>}
              {quarter && <Badge variant="secondary" className="dark:bg-gray-800 dark:text-cyan-200">Quarter: {quarter}</Badge>}
              {sectors.map((s) => <Badge key={s} variant="secondary" className="dark:bg-gray-800 dark:text-cyan-200">Sector: {s}</Badge>)}
            </div>
            {/* Holdings Table */}
            <div className="transition-all duration-200 hover:scale-[1.01] hover:shadow-lg">
              <HoldingsTable ref={tableRef} investor={investor} quarter={quarter} sector={sectors} onRowsChange={setExportRows} />
            </div>
            {/* Call-to-Action Area */}
            <div className="flex flex-wrap gap-4 mt-8 justify-center border-t pt-6">
              <Button variant="secondary" size="sm">Save View</Button>
              <Button variant="outline" size="sm" onClick={handleExport}>Export</Button>
              <Button variant="default" size="sm" onClick={handleNotify}>Get Notified</Button>
            </div>
            <small className="text-sm text-muted-foreground mt-6 block text-center dark:text-cyan-200">
              Last updated: July 2025 — based on Q2 filings.
            </small>
          </CardContent>
        </Card>
      </div>
    </section>
  );
} 