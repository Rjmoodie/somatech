-- Create table for storing retirement planning calculations
CREATE TABLE public.retirement_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plan_name TEXT NOT NULL,
  
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
ALTER TABLE public.retirement_plans ENABLE ROW LEVEL SECURITY;

-- Create policies for retirement_plans
CREATE POLICY "Users can view their own retirement plans" 
ON public.retirement_plans 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own retirement plans" 
ON public.retirement_plans 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own retirement plans" 
ON public.retirement_plans 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own retirement plans" 
ON public.retirement_plans 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_retirement_plans_user_id ON public.retirement_plans(user_id);
CREATE INDEX idx_retirement_plans_created_at ON public.retirement_plans(created_at);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_retirement_plans_updated_at
BEFORE UPDATE ON public.retirement_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();