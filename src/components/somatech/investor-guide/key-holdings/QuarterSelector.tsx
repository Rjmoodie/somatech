import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface QuarterSelectorProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

export default function QuarterSelector({ value, onChange }: QuarterSelectorProps) {
  const [quarters, setQuarters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuarters() {
      setLoading(true);
      const { data, error } = await supabase
        .from("superinvestor_holdings")
        .select("quarter")
        .neq("quarter", null)
        .order("quarter", { ascending: false });
      if (error) {
        setQuarters([]);
        setLoading(false);
        return;
      }
      const unique = Array.from(new Set((data ?? []).map((row) => row.quarter)));
      setQuarters(unique);
      setLoading(false);
    }
    fetchQuarters();
  }, []);

  return (
    <div>
      <label className="block text-sm font-medium mb-1">Quarter</label>
      <select
        className="border rounded p-2 min-w-[140px]"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        disabled={loading}
      >
        <option value="">All Quarters</option>
        {quarters.map((q) => (
          <option key={q} value={q}>
            {q}
          </option>
        ))}
      </select>
    </div>
  );
} 