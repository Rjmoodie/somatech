import React, { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { motion, AnimatePresence } from "framer-motion";
import { Info, ChevronDown, ChevronUp } from "lucide-react";

interface HoldingsTableProps {
  investor: string | null;
  quarter: string | null;
  sector: string[];
  onRowsChange?: (rows: any[]) => void;
}

interface Holding {
  investor: string;
  stock: string;
  ticker: string;
  sector: string;
  allocation: number;
  insight: string;
  quarter: string;
}

type SortKey = "investor" | "stock" | "sector" | "allocation";
type SortDirection = "asc" | "desc";

const HoldingsTable = forwardRef<any, HoldingsTableProps>(
  ({ investor, quarter, sector, onRowsChange }, ref) => {
    const [holdings, setHoldings] = useState<Holding[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<number | null>(null);
    const [sortKey, setSortKey] = useState<SortKey>("allocation");
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

    useImperativeHandle(ref, () => ({ getRows: () => sortedHoldings }));

    useEffect(() => {
      async function fetchHoldings() {
        setLoading(true);
        let query = supabase
          .from("superinvestor_holdings")
          .select("investor,stock,ticker,sector,allocation,insight,quarter");
        if (investor) query = query.eq("investor", investor);
        if (quarter) query = query.eq("quarter", quarter);
        // Don't filter by sector here, filter in-memory for multi-select
        const { data, error } = await query;
        if (error) {
          setHoldings([]);
          setLoading(false);
          return;
        }
        setHoldings(data ?? []);
        setLoading(false);
      }
      fetchHoldings();
    }, [investor, quarter]);

    // Multi-sector filter in-memory
    const filteredHoldings = sector.length > 0
      ? holdings.filter((h) => sector.includes(h.sector))
      : holdings;

    // Find the highest allocation for badge/heatmap
    const topAllocation = filteredHoldings.length > 0 ? Math.max(...filteredHoldings.map(h => h.allocation || 0)) : 0;

    // Sorting logic
    const sortedHoldings = [...filteredHoldings].sort((a, b) => {
      let aValue: any = a[sortKey];
      let bValue: any = b[sortKey];
      if (sortKey === "allocation") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else {
        aValue = (aValue || "").toString().toLowerCase();
        bValue = (bValue || "").toString().toLowerCase();
      }
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    // Notify parent of current rows for export
    useEffect(() => {
      if (onRowsChange) onRowsChange(sortedHoldings);
    }, [sortedHoldings, onRowsChange]);

    function handleSort(key: SortKey) {
      if (sortKey === key) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortKey(key);
        setSortDirection(key === "allocation" ? "desc" : "asc");
      }
    }

    function renderSortIcon(key: SortKey) {
      if (sortKey !== key) return null;
      return sortDirection === "asc" ? <ChevronUp size={16} className="inline ml-1" /> : <ChevronDown size={16} className="inline ml-1" />;
    }

    return (
      <div className="overflow-x-auto mt-4">
        <Table className="min-w-full border rounded text-sm">
          <TableHeader className="sticky top-0 z-10 bg-white">
            <TableRow>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort("investor")}>Investor {renderSortIcon("investor")}</TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort("stock")}>Top Holding {renderSortIcon("stock")}</TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort("sector")}>Sector {renderSortIcon("sector")}</TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort("allocation")}>Allocation % {renderSortIcon("allocation")}</TableHead>
              <TableHead>Insight Summary</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="p-4 text-center text-gray-500">Loading...</TableCell>
              </TableRow>
            ) : sortedHoldings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="p-4 text-center text-gray-500">No holdings found.</TableCell>
              </TableRow>
            ) : (
              <AnimatePresence>
                {sortedHoldings.map((h, i) => {
                  const isTop = h.allocation === topAllocation && topAllocation > 0;
                  return (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18, delay: i * 0.03 }}
                      className={
                        `border-b transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50` +
                        (expanded === i ? " !bg-blue-100" : "")
                      }
                    >
                      <TableCell className="font-semibold whitespace-nowrap">{h.investor}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {h.stock} <span className="text-xs text-gray-500">({h.ticker})</span>
                        {isTop && <Badge className="ml-2 bg-blue-600 text-white">Top 1</Badge>}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge variant="secondary">{h.sector}</Badge>
                      </TableCell>
                      <TableCell style={{ background: isTop ? "rgba(37,99,235,0.08)" : undefined }}>
                        {h.allocation ? `~${h.allocation}%` : "-"}
                      </TableCell>
                      <TableCell className="relative">
                        {/* Desktop: Popover, Mobile: Expandable */}
                        <div className="hidden md:block">
                          <InsightPopover insight={h.insight} />
                        </div>
                        <div className="block md:hidden">
                          <button
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                            onClick={() => setExpanded(expanded === i ? null : i)}
                            aria-label="Show insight"
                          >
                            <Info size={16} />
                            <span className="underline">Insight</span>
                          </button>
                          <AnimatePresence>
                            {expanded === i && (
                              <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 8 }}
                                className="absolute left-0 mt-2 w-64 p-3 bg-white border border-blue-200 rounded shadow-lg text-sm text-gray-800 z-20"
                              >
                                {h.insight}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            )}
          </TableBody>
        </Table>
      </div>
    );
  }
);

function InsightPopover({ insight }: { insight: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none flex items-center gap-1">
          <Info size={16} />
          <span className="underline">Insight</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="center" sideOffset={8} className="text-sm">
        {insight}
      </PopoverContent>
    </Popover>
  );
}

export default HoldingsTable; 