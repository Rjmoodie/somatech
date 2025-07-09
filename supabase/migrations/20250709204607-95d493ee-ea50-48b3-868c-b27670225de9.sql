-- Add projection_data column to funding_campaigns table
ALTER TABLE public.funding_campaigns 
ADD COLUMN projection_data jsonb;

-- Add comment to document the column
COMMENT ON COLUMN public.funding_campaigns.projection_data IS 'Stores campaign projection calculations including expected donors, weekly targets, success probability, etc.';