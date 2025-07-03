-- Add Book of Record columns to business_listings table
ALTER TABLE public.business_listings 
ADD COLUMN bor_documents TEXT[],
ADD COLUMN bor_visibility TEXT DEFAULT 'public' CHECK (bor_visibility IN ('public', 'premium', 'on_request'));

-- Create storage bucket for Book of Record uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('bor_uploads', 'bor_uploads', false);

-- Create RLS policies for Book of Record storage
CREATE POLICY "Users can upload their own BOR documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'bor_uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own BOR documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'bor_uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Public BOR documents are viewable by anyone" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'bor_uploads' AND EXISTS (
  SELECT 1 FROM public.business_listings 
  WHERE user_id::text = (storage.foldername(name))[1] 
  AND bor_visibility = 'public'
  AND status = 'live'
));

CREATE POLICY "Users can delete their own BOR documents" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'bor_uploads' AND auth.uid()::text = (storage.foldername(name))[1]);