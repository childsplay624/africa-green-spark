-- Create site_visits table to track all page visits
CREATE TABLE IF NOT EXISTS public.site_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_agent TEXT,
  referrer TEXT
);

-- Enable RLS
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert visits
CREATE POLICY "Anyone can insert site visits"
ON public.site_visits
FOR INSERT
WITH CHECK (true);

-- Only admins can view visits
CREATE POLICY "Admins can view all visits"
ON public.site_visits
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for better performance
CREATE INDEX idx_site_visits_created_at ON public.site_visits(created_at DESC);
CREATE INDEX idx_site_visits_page_path ON public.site_visits(page_path);