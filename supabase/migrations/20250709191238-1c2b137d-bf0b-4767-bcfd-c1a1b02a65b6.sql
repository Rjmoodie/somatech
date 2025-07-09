-- Create funding campaigns table
CREATE TABLE public.funding_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('car', 'education', 'business', 'medical', 'emergency', 'housing', 'other')),
  description TEXT NOT NULL,
  target_amount DECIMAL(12,2) NOT NULL,
  current_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  deadline TIMESTAMP WITH TIME ZONE,
  image_url TEXT,
  video_url TEXT,
  financial_breakdown JSONB,
  url_slug TEXT UNIQUE,
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create donations table
CREATE TABLE public.donations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES public.funding_campaigns(id) ON DELETE CASCADE,
  donor_name TEXT,
  donor_email TEXT,
  amount DECIMAL(10,2) NOT NULL,
  message TEXT,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.funding_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Create policies for funding_campaigns
CREATE POLICY "Public campaigns are viewable by everyone" 
ON public.funding_campaigns 
FOR SELECT 
USING (visibility = 'public' AND status = 'active');

CREATE POLICY "Users can view their own campaigns" 
ON public.funding_campaigns 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own campaigns" 
ON public.funding_campaigns 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own campaigns" 
ON public.funding_campaigns 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own campaigns" 
ON public.funding_campaigns 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for donations
CREATE POLICY "Campaign owners can view donations to their campaigns"
ON public.donations 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.funding_campaigns 
    WHERE id = campaign_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Anyone can create donations"
ON public.donations 
FOR INSERT 
WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_funding_campaigns_user_id ON public.funding_campaigns(user_id);
CREATE INDEX idx_funding_campaigns_category ON public.funding_campaigns(category);
CREATE INDEX idx_funding_campaigns_status ON public.funding_campaigns(status);
CREATE INDEX idx_funding_campaigns_visibility ON public.funding_campaigns(visibility);
CREATE INDEX idx_funding_campaigns_url_slug ON public.funding_campaigns(url_slug);
CREATE INDEX idx_donations_campaign_id ON public.donations(campaign_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_funding_campaigns_updated_at
BEFORE UPDATE ON public.funding_campaigns
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update campaign current_amount when donations are added
CREATE OR REPLACE FUNCTION public.update_campaign_amount()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.funding_campaigns 
    SET current_amount = current_amount + NEW.amount
    WHERE id = NEW.campaign_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.funding_campaigns 
    SET current_amount = current_amount - OLD.amount
    WHERE id = OLD.campaign_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update campaign amount
CREATE TRIGGER update_campaign_amount_trigger
AFTER INSERT OR DELETE ON public.donations
FOR EACH ROW
EXECUTE FUNCTION public.update_campaign_amount();

-- Create storage bucket for campaign media
INSERT INTO storage.buckets (id, name, public) VALUES ('campaign-media', 'campaign-media', true);

-- Create storage policies for campaign media
CREATE POLICY "Campaign media is publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'campaign-media');

CREATE POLICY "Authenticated users can upload campaign media" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'campaign-media' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own campaign media" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'campaign-media' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own campaign media" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'campaign-media' AND auth.uid() IS NOT NULL);