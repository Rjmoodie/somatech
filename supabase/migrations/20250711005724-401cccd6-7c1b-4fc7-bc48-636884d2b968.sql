-- Create subscribers table for subscription management
CREATE TABLE public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  subscribed BOOLEAN NOT NULL DEFAULT false,
  subscription_tier TEXT CHECK (subscription_tier IN ('free', 'professional', 'enterprise')),
  subscription_end TIMESTAMPTZ,
  features_enabled JSONB DEFAULT '{"advanced_analytics": false, "unlimited_saves": false, "priority_support": false, "white_label": false}'::jsonb,
  usage_limits JSONB DEFAULT '{"monthly_calculations": 100, "saved_projects": 10, "export_reports": 5}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own subscription info
CREATE POLICY "select_own_subscription" ON public.subscribers
FOR SELECT
USING (user_id = auth.uid() OR email = auth.email());

-- Create policy for edge functions to update subscription info
CREATE POLICY "update_own_subscription" ON public.subscribers
FOR UPDATE
USING (true);

-- Create policy for edge functions to insert subscription info
CREATE POLICY "insert_subscription" ON public.subscribers
FOR INSERT
WITH CHECK (true);

-- Create usage tracking table
CREATE TABLE public.usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_type TEXT NOT NULL,
  usage_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  month_year TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM')
);

-- Enable RLS
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;

-- Create policies for usage tracking
CREATE POLICY "users_can_view_own_usage" ON public.usage_tracking
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "users_can_insert_usage" ON public.usage_tracking
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Create index for efficient usage queries
CREATE INDEX idx_usage_tracking_user_month ON public.usage_tracking(user_id, month_year);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('info', 'success', 'warning', 'error', 'system')),
  read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for notifications
CREATE POLICY "users_can_view_own_notifications" ON public.notifications
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "users_can_update_own_notifications" ON public.notifications
FOR UPDATE
USING (user_id = auth.uid());

-- Create system settings table for enterprise features
CREATE TABLE public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'auto')),
  notification_preferences JSONB DEFAULT '{"email": true, "in_app": true, "marketing": false}'::jsonb,
  dashboard_layout JSONB DEFAULT '{"widgets": [], "layout": "default"}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "users_can_manage_own_settings" ON public.system_settings
FOR ALL
USING (user_id = auth.uid());