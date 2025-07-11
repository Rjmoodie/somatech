export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      brrrr_deals: {
        Row: {
          created_at: string
          deal_name: string
          id: string
          inputs: Json
          notes: string | null
          results: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deal_name: string
          id?: string
          inputs: Json
          notes?: string | null
          results: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deal_name?: string
          id?: string
          inputs?: Json
          notes?: string | null
          results?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
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
      data_export_requests: {
        Row: {
          completed_at: string | null
          created_at: string
          download_url: string | null
          expires_at: string | null
          id: string
          notes: string | null
          request_type: string
          requested_at: string
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          download_url?: string | null
          expires_at?: string | null
          id?: string
          notes?: string | null
          request_type: string
          requested_at?: string
          status?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          download_url?: string | null
          expires_at?: string | null
          id?: string
          notes?: string | null
          request_type?: string
          requested_at?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount: number
          campaign_id: string
          created_at: string
          donor_email: string | null
          donor_name: string | null
          id: string
          is_anonymous: boolean
          message: string | null
          stripe_payment_intent_id: string | null
        }
        Insert: {
          amount: number
          campaign_id: string
          created_at?: string
          donor_email?: string | null
          donor_name?: string | null
          id?: string
          is_anonymous?: boolean
          message?: string | null
          stripe_payment_intent_id?: string | null
        }
        Update: {
          amount?: number
          campaign_id?: string
          created_at?: string
          donor_email?: string | null
          donor_name?: string | null
          id?: string
          is_anonymous?: boolean
          message?: string | null
          stripe_payment_intent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "funding_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      email_campaigns: {
        Row: {
          bounced_count: number | null
          clicked_count: number | null
          created_at: string
          delivered_count: number | null
          id: string
          metadata: Json | null
          name: string
          opened_count: number | null
          scheduled_at: string | null
          segment: string | null
          sent_at: string | null
          status: string
          subject: string
          template_id: string
          total_recipients: number | null
          updated_at: string
        }
        Insert: {
          bounced_count?: number | null
          clicked_count?: number | null
          created_at?: string
          delivered_count?: number | null
          id?: string
          metadata?: Json | null
          name: string
          opened_count?: number | null
          scheduled_at?: string | null
          segment?: string | null
          sent_at?: string | null
          status?: string
          subject: string
          template_id: string
          total_recipients?: number | null
          updated_at?: string
        }
        Update: {
          bounced_count?: number | null
          clicked_count?: number | null
          created_at?: string
          delivered_count?: number | null
          id?: string
          metadata?: Json | null
          name?: string
          opened_count?: number | null
          scheduled_at?: string | null
          segment?: string | null
          sent_at?: string | null
          status?: string
          subject?: string
          template_id?: string
          total_recipients?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      feature_votes: {
        Row: {
          created_at: string
          feedback_id: string
          id: string
          user_id: string
          vote_type: string
        }
        Insert: {
          created_at?: string
          feedback_id: string
          id?: string
          user_id: string
          vote_type: string
        }
        Update: {
          created_at?: string
          feedback_id?: string
          id?: string
          user_id?: string
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "feature_votes_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "user_feedback"
            referencedColumns: ["id"]
          },
        ]
      }
      funding_campaigns: {
        Row: {
          category: string
          created_at: string
          current_amount: number
          deadline: string | null
          description: string
          financial_breakdown: Json | null
          id: string
          image_url: string | null
          projection_data: Json | null
          status: string
          target_amount: number
          title: string
          updated_at: string
          url_slug: string | null
          user_id: string
          video_url: string | null
          visibility: string
        }
        Insert: {
          category: string
          created_at?: string
          current_amount?: number
          deadline?: string | null
          description: string
          financial_breakdown?: Json | null
          id?: string
          image_url?: string | null
          projection_data?: Json | null
          status?: string
          target_amount: number
          title: string
          updated_at?: string
          url_slug?: string | null
          user_id: string
          video_url?: string | null
          visibility?: string
        }
        Update: {
          category?: string
          created_at?: string
          current_amount?: number
          deadline?: string | null
          description?: string
          financial_breakdown?: Json | null
          id?: string
          image_url?: string | null
          projection_data?: Json | null
          status?: string
          target_amount?: number
          title?: string
          updated_at?: string
          url_slug?: string | null
          user_id?: string
          video_url?: string | null
          visibility?: string
        }
        Relationships: []
      }
      login_activity: {
        Row: {
          created_at: string
          device_type: string | null
          failure_reason: string | null
          id: string
          ip_address: unknown | null
          location: string | null
          login_timestamp: string
          session_id: string | null
          success: boolean
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          device_type?: string | null
          failure_reason?: string | null
          id?: string
          ip_address?: unknown | null
          location?: string | null
          login_timestamp?: string
          session_id?: string | null
          success?: boolean
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          device_type?: string | null
          failure_reason?: string | null
          id?: string
          ip_address?: unknown | null
          location?: string | null
          login_timestamp?: string
          session_id?: string | null
          success?: boolean
          user_agent?: string | null
          user_id?: string
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
      notifications: {
        Row: {
          action_label: string | null
          action_url: string | null
          category: string | null
          created_at: string
          expires_at: string | null
          id: string
          message: string
          metadata: Json | null
          priority: number | null
          read: boolean | null
          read_at: string | null
          title: string
          type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          action_label?: string | null
          action_url?: string | null
          category?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          message: string
          metadata?: Json | null
          priority?: number | null
          read?: boolean | null
          read_at?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          action_label?: string | null
          action_url?: string | null
          category?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          priority?: number | null
          read?: boolean | null
          read_at?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          backup_codes: string[] | null
          bio: string | null
          created_at: string
          email: string | null
          email_notifications_enabled: boolean | null
          email_verification_sent_at: string | null
          email_verification_token: string | null
          email_verified: boolean | null
          first_login_at: string | null
          id: string
          last_login_at: string | null
          location: string | null
          login_count: number | null
          marketing_emails_enabled: boolean | null
          onboarding_completed: boolean | null
          onboarding_progress: Json | null
          onboarding_step: number | null
          price_alerts_enabled: boolean | null
          profile_completion_score: number | null
          push_notifications_enabled: boolean | null
          theme_preference: string | null
          tutorial_completed: boolean | null
          two_factor_enabled: boolean | null
          two_factor_secret: string | null
          updated_at: string
          username: string | null
          website: string | null
          weekly_summary_enabled: boolean | null
        }
        Insert: {
          avatar_url?: string | null
          backup_codes?: string[] | null
          bio?: string | null
          created_at?: string
          email?: string | null
          email_notifications_enabled?: boolean | null
          email_verification_sent_at?: string | null
          email_verification_token?: string | null
          email_verified?: boolean | null
          first_login_at?: string | null
          id: string
          last_login_at?: string | null
          location?: string | null
          login_count?: number | null
          marketing_emails_enabled?: boolean | null
          onboarding_completed?: boolean | null
          onboarding_progress?: Json | null
          onboarding_step?: number | null
          price_alerts_enabled?: boolean | null
          profile_completion_score?: number | null
          push_notifications_enabled?: boolean | null
          theme_preference?: string | null
          tutorial_completed?: boolean | null
          two_factor_enabled?: boolean | null
          two_factor_secret?: string | null
          updated_at?: string
          username?: string | null
          website?: string | null
          weekly_summary_enabled?: boolean | null
        }
        Update: {
          avatar_url?: string | null
          backup_codes?: string[] | null
          bio?: string | null
          created_at?: string
          email?: string | null
          email_notifications_enabled?: boolean | null
          email_verification_sent_at?: string | null
          email_verification_token?: string | null
          email_verified?: boolean | null
          first_login_at?: string | null
          id?: string
          last_login_at?: string | null
          location?: string | null
          login_count?: number | null
          marketing_emails_enabled?: boolean | null
          onboarding_completed?: boolean | null
          onboarding_progress?: Json | null
          onboarding_step?: number | null
          price_alerts_enabled?: boolean | null
          profile_completion_score?: number | null
          push_notifications_enabled?: boolean | null
          theme_preference?: string | null
          tutorial_completed?: boolean | null
          two_factor_enabled?: boolean | null
          two_factor_secret?: string | null
          updated_at?: string
          username?: string | null
          website?: string | null
          weekly_summary_enabled?: boolean | null
        }
        Relationships: []
      }
      retirement_plans: {
        Row: {
          created_at: string
          id: string
          inputs: Json
          notes: string | null
          plan_name: string
          results: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          inputs: Json
          notes?: string | null
          plan_name: string
          results: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          inputs?: Json
          notes?: string | null
          plan_name?: string
          results?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          features_enabled: Json | null
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          usage_limits: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          features_enabled?: Json | null
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          usage_limits?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          features_enabled?: Json | null
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          usage_limits?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          dashboard_layout: Json | null
          id: string
          notification_preferences: Json | null
          theme: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          dashboard_layout?: Json | null
          id?: string
          notification_preferences?: Json | null
          theme?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          dashboard_layout?: Json | null
          id?: string
          notification_preferences?: Json | null
          theme?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      usage_tracking: {
        Row: {
          created_at: string
          feature_type: string
          id: string
          month_year: string
          usage_count: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          feature_type: string
          id?: string
          month_year?: string
          usage_count?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          feature_type?: string
          id?: string
          month_year?: string
          usage_count?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_feedback: {
        Row: {
          admin_response: string | null
          category: string | null
          created_at: string
          description: string
          id: string
          metadata: Json | null
          priority: number | null
          status: string
          title: string
          type: string
          updated_at: string
          user_id: string | null
          votes_count: number | null
        }
        Insert: {
          admin_response?: string | null
          category?: string | null
          created_at?: string
          description: string
          id?: string
          metadata?: Json | null
          priority?: number | null
          status?: string
          title: string
          type: string
          updated_at?: string
          user_id?: string | null
          votes_count?: number | null
        }
        Update: {
          admin_response?: string | null
          category?: string | null
          created_at?: string
          description?: string
          id?: string
          metadata?: Json | null
          priority?: number | null
          status?: string
          title?: string
          type?: string
          updated_at?: string
          user_id?: string | null
          votes_count?: number | null
        }
        Relationships: []
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
      calculate_profile_completion: {
        Args: {
          profile_record: Database["public"]["Tables"]["profiles"]["Row"]
        }
        Returns: number
      }
      create_notification: {
        Args: {
          p_user_id: string
          p_title: string
          p_message: string
          p_type?: string
          p_category?: string
          p_action_url?: string
          p_action_label?: string
          p_metadata?: Json
          p_priority?: number
        }
        Returns: string
      }
      track_login_activity: {
        Args: {
          p_user_id: string
          p_ip_address?: string
          p_user_agent?: string
          p_success?: boolean
          p_failure_reason?: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
