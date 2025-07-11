-- Create comprehensive notification system
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error', 'alert', 'analysis_complete', 'watchlist_alert', 'price_target', 'weekly_summary')),
  category TEXT NOT NULL CHECK (category IN ('system', 'analysis', 'watchlist', 'portfolio', 'security', 'marketing')),
  read BOOLEAN NOT NULL DEFAULT false,
  action_url TEXT,
  action_label TEXT,
  metadata JSONB,
  expires_at TIMESTAMP WITH TIME ZONE,
  priority INTEGER NOT NULL DEFAULT 1 CHECK (priority BETWEEN 1 AND 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  read_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

-- System can create notifications
CREATE POLICY "System can create notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(user_id, read);
CREATE INDEX idx_notifications_type ON public.notifications(type);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- Create email campaign system
CREATE TABLE public.email_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  template_id TEXT NOT NULL,
  segment TEXT CHECK (segment IN ('all_users', 'new_users', 'active_users', 'premium_users', 'inactive_users')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  total_recipients INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  bounced_count INTEGER DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create email tracking
CREATE TABLE public.email_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES public.email_campaigns(id),
  user_id UUID,
  email TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('sent', 'delivered', 'opened', 'clicked', 'bounced', 'complained')),
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  link_clicked TEXT,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create feedback system
CREATE TABLE public.user_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  type TEXT NOT NULL CHECK (type IN ('feedback', 'feature_request', 'bug_report', 'testimonial')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  priority INTEGER DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'reviewing', 'planned', 'in_progress', 'completed', 'declined')),
  votes_count INTEGER DEFAULT 0,
  admin_response TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for feedback
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;

-- Create policies for feedback
CREATE POLICY "Anyone can create feedback" 
ON public.user_feedback 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view all feedback" 
ON public.user_feedback 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own feedback" 
ON public.user_feedback 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create feature voting system
CREATE TABLE public.feature_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  feedback_id UUID NOT NULL REFERENCES public.user_feedback(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(feedback_id, user_id)
);

-- Enable RLS for votes
ALTER TABLE public.feature_votes ENABLE ROW LEVEL SECURITY;

-- Create policies for votes
CREATE POLICY "Authenticated users can vote" 
ON public.feature_votes 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create notification preferences
ALTER TABLE public.profiles 
ADD COLUMN push_notifications_enabled BOOLEAN DEFAULT true,
ADD COLUMN email_notifications_enabled BOOLEAN DEFAULT true,
ADD COLUMN marketing_emails_enabled BOOLEAN DEFAULT false,
ADD COLUMN weekly_summary_enabled BOOLEAN DEFAULT true,
ADD COLUMN price_alerts_enabled BOOLEAN DEFAULT true;

-- Function to create notification
CREATE OR REPLACE FUNCTION public.create_notification(
  p_user_id UUID,
  p_title TEXT,
  p_message TEXT,
  p_type TEXT DEFAULT 'info',
  p_category TEXT DEFAULT 'system',
  p_action_url TEXT DEFAULT NULL,
  p_action_label TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL,
  p_priority INTEGER DEFAULT 1
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (
    user_id, title, message, type, category, action_url, action_label, metadata, priority
  )
  VALUES (
    p_user_id, p_title, p_message, p_type, p_category, p_action_url, p_action_label, p_metadata, p_priority
  )
  RETURNING id INTO notification_id;

  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update vote count
CREATE OR REPLACE FUNCTION public.update_feedback_votes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.user_feedback 
    SET votes_count = votes_count + CASE WHEN NEW.vote_type = 'up' THEN 1 ELSE -1 END
    WHERE id = NEW.feedback_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.user_feedback 
    SET votes_count = votes_count - CASE WHEN OLD.vote_type = 'up' THEN 1 ELSE -1 END
    WHERE id = OLD.feedback_id;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle vote change
    UPDATE public.user_feedback 
    SET votes_count = votes_count + 
      CASE WHEN NEW.vote_type = 'up' THEN 1 ELSE -1 END -
      CASE WHEN OLD.vote_type = 'up' THEN 1 ELSE -1 END
    WHERE id = NEW.feedback_id;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for vote counting
CREATE TRIGGER feedback_votes_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.feature_votes
FOR EACH ROW EXECUTE FUNCTION public.update_feedback_votes();

-- Enable realtime for notifications
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.notifications;