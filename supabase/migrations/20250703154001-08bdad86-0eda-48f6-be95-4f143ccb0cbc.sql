-- Create business_listings table
CREATE TABLE public.business_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  business_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  location TEXT NOT NULL,
  revenue NUMERIC NOT NULL,
  ebitda NUMERIC NOT NULL,
  cash_flow NUMERIC,
  asking_price NUMERIC NOT NULL,
  valuation_summary JSONB,
  description TEXT NOT NULL,
  key_value_drivers TEXT,
  growth_potential TEXT,
  competitive_advantages TEXT,
  documents TEXT[], -- Array of document URLs
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'verified_only')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'live', 'under_negotiation', 'sold')),
  views_count INTEGER DEFAULT 0,
  contact_requests_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create marketplace_messages table for buyer-seller communication
CREATE TABLE public.marketplace_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID NOT NULL REFERENCES public.business_listings(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  message TEXT NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.business_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for business_listings
CREATE POLICY "Anyone can view public listings" 
ON public.business_listings 
FOR SELECT 
USING (status = 'live' AND visibility = 'public');

CREATE POLICY "Users can view their own listings" 
ON public.business_listings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own listings" 
ON public.business_listings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own listings" 
ON public.business_listings 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own listings" 
ON public.business_listings 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for marketplace_messages
CREATE POLICY "Users can view messages they sent or received" 
ON public.marketplace_messages 
FOR SELECT 
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages" 
ON public.marketplace_messages 
FOR INSERT 
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update messages they received" 
ON public.marketplace_messages 
FOR UPDATE 
USING (auth.uid() = recipient_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_business_listings_updated_at
BEFORE UPDATE ON public.business_listings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_business_listings_industry ON public.business_listings(industry);
CREATE INDEX idx_business_listings_location ON public.business_listings(location);
CREATE INDEX idx_business_listings_asking_price ON public.business_listings(asking_price);
CREATE INDEX idx_business_listings_ebitda ON public.business_listings(ebitda);
CREATE INDEX idx_business_listings_status ON public.business_listings(status);
CREATE INDEX idx_marketplace_messages_listing_id ON public.marketplace_messages(listing_id);
CREATE INDEX idx_marketplace_messages_participants ON public.marketplace_messages(sender_id, recipient_id);