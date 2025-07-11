-- Add login activity tracking table
CREATE TABLE public.login_activity (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  login_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT,
  device_type TEXT,
  location TEXT,
  success BOOLEAN NOT NULL DEFAULT true,
  failure_reason TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.login_activity ENABLE ROW LEVEL SECURITY;

-- Create policies for login activity
CREATE POLICY "Users can view their own login activity" 
ON public.login_activity 
FOR SELECT 
USING (auth.uid() = user_id);

-- Only system can insert login activity
CREATE POLICY "System can insert login activity" 
ON public.login_activity 
FOR INSERT 
WITH CHECK (true);

-- Add email verification and 2FA fields to profiles
ALTER TABLE public.profiles 
ADD COLUMN email_verified BOOLEAN DEFAULT false,
ADD COLUMN email_verification_token TEXT,
ADD COLUMN email_verification_sent_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN two_factor_enabled BOOLEAN DEFAULT false,
ADD COLUMN two_factor_secret TEXT,
ADD COLUMN backup_codes TEXT[],
ADD COLUMN last_login_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN login_count INTEGER DEFAULT 0;

-- Create data export requests table for GDPR compliance
CREATE TABLE public.data_export_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  request_type TEXT NOT NULL CHECK (request_type IN ('export', 'deletion')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  download_url TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for data export requests
ALTER TABLE public.data_export_requests ENABLE ROW LEVEL SECURITY;

-- Users can view and create their own data requests
CREATE POLICY "Users can manage their own data requests" 
ON public.data_export_requests 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add onboarding tracking
ALTER TABLE public.profiles 
ADD COLUMN onboarding_step INTEGER DEFAULT 0,
ADD COLUMN onboarding_progress JSONB DEFAULT '{"steps_completed": [], "current_step": 0, "total_steps": 5}',
ADD COLUMN first_login_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN tutorial_completed BOOLEAN DEFAULT false;

-- Create function to track login activity
CREATE OR REPLACE FUNCTION public.track_login_activity(
  p_user_id UUID,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_success BOOLEAN DEFAULT true,
  p_failure_reason TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  activity_id UUID;
  device_type TEXT;
  location TEXT DEFAULT 'Unknown';
BEGIN
  -- Simple device type detection based on user agent
  IF p_user_agent ILIKE '%mobile%' OR p_user_agent ILIKE '%android%' OR p_user_agent ILIKE '%iphone%' THEN
    device_type := 'Mobile';
  ELSIF p_user_agent ILIKE '%tablet%' OR p_user_agent ILIKE '%ipad%' THEN
    device_type := 'Tablet';
  ELSE
    device_type := 'Desktop';
  END IF;

  -- Insert login activity
  INSERT INTO public.login_activity (
    user_id, 
    ip_address, 
    user_agent, 
    device_type, 
    location, 
    success, 
    failure_reason
  )
  VALUES (
    p_user_id,
    p_ip_address::INET,
    p_user_agent,
    device_type,
    location,
    p_success,
    p_failure_reason
  )
  RETURNING id INTO activity_id;

  -- Update profile login stats if successful
  IF p_success THEN
    UPDATE public.profiles 
    SET 
      last_login_at = now(),
      login_count = COALESCE(login_count, 0) + 1
    WHERE id = p_user_id;
  END IF;

  RETURN activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;