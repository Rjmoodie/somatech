-- Add additional fields to profiles table for enhanced user experience
ALTER TABLE public.profiles 
ADD COLUMN avatar_url TEXT,
ADD COLUMN bio TEXT,
ADD COLUMN location TEXT,
ADD COLUMN website TEXT,
ADD COLUMN theme_preference TEXT DEFAULT 'system',
ADD COLUMN onboarding_completed BOOLEAN DEFAULT false,
ADD COLUMN profile_completion_score INTEGER DEFAULT 0;

-- Create storage bucket for user avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true);

-- Create storage policies for avatar uploads
CREATE POLICY "Users can upload their own avatar" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Avatar images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'avatars');

-- Function to calculate profile completion score
CREATE OR REPLACE FUNCTION public.calculate_profile_completion(profile_record public.profiles)
RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 0;
BEGIN
  -- Base score for having a profile
  score := 10;
  
  -- Add points for each completed field
  IF profile_record.username IS NOT NULL AND profile_record.username != '' THEN
    score := score + 20;
  END IF;
  
  IF profile_record.email IS NOT NULL AND profile_record.email != '' THEN
    score := score + 20;
  END IF;
  
  IF profile_record.avatar_url IS NOT NULL AND profile_record.avatar_url != '' THEN
    score := score + 15;
  END IF;
  
  IF profile_record.bio IS NOT NULL AND profile_record.bio != '' THEN
    score := score + 15;
  END IF;
  
  IF profile_record.location IS NOT NULL AND profile_record.location != '' THEN
    score := score + 10;
  END IF;
  
  IF profile_record.website IS NOT NULL AND profile_record.website != '' THEN
    score := score + 10;
  END IF;
  
  RETURN LEAST(score, 100); -- Cap at 100%
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update profile completion score
CREATE OR REPLACE FUNCTION public.update_profile_completion_score()
RETURNS TRIGGER AS $$
BEGIN
  NEW.profile_completion_score := public.calculate_profile_completion(NEW);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profile_completion_trigger
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_profile_completion_score();