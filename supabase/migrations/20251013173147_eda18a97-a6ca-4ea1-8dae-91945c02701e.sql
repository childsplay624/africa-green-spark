-- Create storage buckets for profile images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true);

INSERT INTO storage.buckets (id, name, public) 
VALUES ('header-images', 'header-images', true);

-- Add header_image_url column to profiles table
ALTER TABLE public.aesc_profiles 
ADD COLUMN IF NOT EXISTS header_image_url text;

-- Create storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatar" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatar" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create storage policies for header images
CREATE POLICY "Header images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'header-images');

CREATE POLICY "Users can upload their own header image" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'header-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own header image" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'header-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own header image" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'header-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);