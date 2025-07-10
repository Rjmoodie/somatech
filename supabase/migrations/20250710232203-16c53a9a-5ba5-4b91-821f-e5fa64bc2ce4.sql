-- Create table for storing BRRRR deal calculations
CREATE TABLE public.brrrr_deals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  deal_name TEXT NOT NULL,
  
  -- Input parameters stored as JSONB for flexibility
  inputs JSONB NOT NULL,
  
  -- Calculated results stored as JSONB
  results JSONB NOT NULL,
  
  -- Metadata
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.brrrr_deals ENABLE ROW LEVEL SECURITY;

-- Create policies for brrrr_deals
CREATE POLICY "Users can view their own BRRRR deals" 
ON public.brrrr_deals 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own BRRRR deals" 
ON public.brrrr_deals 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own BRRRR deals" 
ON public.brrrr_deals 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own BRRRR deals" 
ON public.brrrr_deals 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_brrrr_deals_user_id ON public.brrrr_deals(user_id);
CREATE INDEX idx_brrrr_deals_created_at ON public.brrrr_deals(created_at);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_brrrr_deals_updated_at
BEFORE UPDATE ON public.brrrr_deals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();