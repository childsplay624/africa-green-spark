-- Create RLS policies for header-images bucket to allow admins to upload logos

-- Allow admins to upload files to header-images bucket
CREATE POLICY "Admins can upload to header-images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'header-images' AND
  has_role(auth.uid(), 'admin'::app_role)
);

-- Allow admins to update files in header-images bucket
CREATE POLICY "Admins can update header-images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'header-images' AND
  has_role(auth.uid(), 'admin'::app_role)
);

-- Allow admins to delete files from header-images bucket
CREATE POLICY "Admins can delete from header-images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'header-images' AND
  has_role(auth.uid(), 'admin'::app_role)
);

-- Allow anyone to view files in header-images bucket (since it's a public bucket)
CREATE POLICY "Anyone can view header-images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'header-images');