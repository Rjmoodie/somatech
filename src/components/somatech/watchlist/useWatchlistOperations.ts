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
export const useWatchlistOperations = () => {
  const fetchWatchlist = async (): Promise<WatchlistItem[]> => {
    try {
      const { data, error } = await supabase
        .from('watchlist')
        .select('*')
        .order('added_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      toast.error('Failed to load watchlist');
      return [];
    }
  };

  const removeFromWatchlist = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Removed from watchlist');
      return true;
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      toast.error('Failed to remove from watchlist');
      return false;
    }
  };

  return {
    fetchWatchlist,
    removeFromWatchlist,
  };
};