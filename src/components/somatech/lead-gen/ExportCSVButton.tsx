import React from "react";
import { useSearchContext } from "./context";

function toCSV(rows: any[], columns: string[]): string {
  const header = columns.join(",");
  const escape = (val: any) =>
    typeof val === "string"
      ? `"${val.replace(/"/g, '""')}"`
      : val == null
      ? ''
      : val;
  const csvRows = rows.map(row =>
    columns.map(col => escape(Array.isArray(row[col]) ? row[col].join(";") : row[col])).join(",")
  );
  return [header, ...csvRows].join("\r\n");
}

export const ExportCSVButton = () => {
  const { state } = useSearchContext();
  const columns = [
    "address",
    "city",
    "state",
    "zip",
    "property_type",
    "owner_name",
    "estimated_value",
    "equity_percent",
    "status",
    "tags",
    "last_updated",
  ];

  const handleExport = () => {
    if (!state.results.length) return;
    const csv = toCSV(state.results, columns);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `property-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
      onClick={handleExport}
      disabled={!state.results.length}
      title={state.results.length ? "Export current results to CSV" : "No results to export"}
    >
      Export CSV
    </button>
  );
};

export default ExportCSVButton; 