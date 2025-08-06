import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface WatchlistItem {
  id: string;
  ticker: string;
  company_name: string;
  current_price: number;
  dcf_scenario: string;
  dcf_intrinsic_value: number;
  dcf_upside_percentage: number;
  recommendation: string;
  score: number;
  market_cap: number;
  pe_ratio: number;
  notes: string;
  added_at: string;
}

/**
 * Custom hook for watchlist operations
 */
export const useWatchlistOperations = (userId: string | undefined) => {
  const fetchWatchlist = async (): Promise<WatchlistItem[]> => {
    if (!userId) return [];
    const { data, error } = await supabase
      .from('watchlist')
      .select('*')
      .eq('user_id', userId)
      .order('added_at', { ascending: false });
    if (error) throw error;
    return data || [];
  };

  const query = useQuery({
    queryKey: ['watchlist', userId],
    queryFn: fetchWatchlist,
    enabled: !!userId,
    staleTime: 60000
  });
  return query;
};