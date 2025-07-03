export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      business_listings: {
        Row: {
          asking_price: number
          bor_documents: string[] | null
          bor_visibility: string | null
          business_name: string
          cash_flow: number | null
          competitive_advantages: string | null
          contact_requests_count: number | null
          created_at: string
          description: string
          documents: string[] | null
          ebitda: number
          growth_potential: string | null
          id: string
          industry: string
          key_value_drivers: string | null
          location: string
          revenue: number
          status: string
          updated_at: string
          user_id: string
          valuation_summary: Json | null
          views_count: number | null
          visibility: string
        }
        Insert: {
          asking_price: number
          bor_documents?: string[] | null
          bor_visibility?: string | null
          business_name: string
          cash_flow?: number | null
          competitive_advantages?: string | null
          contact_requests_count?: number | null
          created_at?: string
          description: string
          documents?: string[] | null
          ebitda: number
          growth_potential?: string | null
          id?: string
          industry: string
          key_value_drivers?: string | null
          location: string
          revenue: number
          status?: string
          updated_at?: string
          user_id: string
          valuation_summary?: Json | null
          views_count?: number | null
          visibility?: string
        }
        Update: {
          asking_price?: number
          bor_documents?: string[] | null
          bor_visibility?: string | null
          business_name?: string
          cash_flow?: number | null
          competitive_advantages?: string | null
          contact_requests_count?: number | null
          created_at?: string
          description?: string
          documents?: string[] | null
          ebitda?: number
          growth_potential?: string | null
          id?: string
          industry?: string
          key_value_drivers?: string | null
          location?: string
          revenue?: number
          status?: string
          updated_at?: string
          user_id?: string
          valuation_summary?: Json | null
          views_count?: number | null
          visibility?: string
        }
        Relationships: []
      }
      marketplace_messages: {
        Row: {
          created_at: string
          id: string
          listing_id: string
          message: string
          read_at: string | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          listing_id: string
          message: string
          read_at?: string | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          created_at?: string
          id?: string
          listing_id?: string
          message?: string
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_messages_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "business_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      watchlist: {
        Row: {
          added_at: string
          company_name: string | null
          current_price: number | null
          dcf_intrinsic_value: number | null
          dcf_scenario: string
          dcf_upside_percentage: number | null
          id: string
          market_cap: number | null
          notes: string | null
          pe_ratio: number | null
          recommendation: string | null
          score: number | null
          ticker: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          added_at?: string
          company_name?: string | null
          current_price?: number | null
          dcf_intrinsic_value?: number | null
          dcf_scenario: string
          dcf_upside_percentage?: number | null
          id?: string
          market_cap?: number | null
          notes?: string | null
          pe_ratio?: number | null
          recommendation?: string | null
          score?: number | null
          ticker: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          added_at?: string
          company_name?: string | null
          current_price?: number | null
          dcf_intrinsic_value?: number | null
          dcf_scenario?: string
          dcf_upside_percentage?: number | null
          id?: string
          market_cap?: number | null
          notes?: string | null
          pe_ratio?: number | null
          recommendation?: string | null
          score?: number | null
          ticker?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
