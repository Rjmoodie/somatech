import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface InvestorDropdownProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

export default function InvestorDropdown({ value, onChange }: InvestorDropdownProps) {
  const [investors, setInvestors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInvestors() {
      setLoading(true);
      const { data, error } = await supabase
        .from("superinvestor_holdings")
        .select("investor")
        .neq("investor", null)
        .order("investor", { ascending: true });
      if (error) {
        setInvestors([]);
        setLoading(false);
        return;
      }
      const unique = Array.from(new Set((data ?? []).map((row) => row.investor)));
      setInvestors(unique);
      setLoading(false);
    }
    fetchInvestors();
  }, []);

  return (
    <div>
      <label className="block text-sm font-medium mb-1">Investor</label>
      <select
        className="border rounded p-2 min-w-[180px]"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        disabled={loading}
      >
        <option value="">All Investors</option>
        {investors.map((inv) => (
          <option key={inv} value={inv}>
            {inv}
          </option>
        ))}
      </select>
    </div>
  );
} 