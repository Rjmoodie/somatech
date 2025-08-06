import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";

interface SectorFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
  investor: string | null;
  quarter: string | null;
}

export default function SectorFilter({ value, onChange, investor, quarter }: SectorFilterProps) {
  const [sectors, setSectors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSectors() {
      setLoading(true);
      let query = supabase
        .from("superinvestor_holdings")
        .select("sector")
        .neq("sector", null);
      if (investor) query = query.eq("investor", investor);
      if (quarter) query = query.eq("quarter", quarter);
      const { data, error } = await query;
      if (error) {
        setSectors([]);
        setLoading(false);
        return;
      }
      const unique = Array.from(new Set((data ?? []).map((row) => row.sector)));
      setSectors(unique);
      setLoading(false);
    }
    fetchSectors();
  }, [investor, quarter]);

  const handleToggle = (sector: string) => {
    if (value.includes(sector)) {
      onChange(value.filter((s) => s !== sector));
    } else {
      onChange([...value, sector]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1">Sector</label>
      <ToggleGroup type="multiple" className="flex flex-wrap gap-1" aria-label="Sector multi-select">
        {sectors.map((s) => (
          <ToggleGroupItem
            key={s}
            value={s}
            aria-pressed={value.includes(s)}
            data-state={value.includes(s) ? "on" : "off"}
            onClick={() => handleToggle(s)}
            className={value.includes(s) ? "bg-blue-600 text-white" : ""}
          >
            {s}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <div className="flex flex-wrap gap-1 mt-2">
        {value.map((s) => (
          <Badge key={s} variant="secondary">{s}</Badge>
        ))}
      </div>
    </div>
  );
} 