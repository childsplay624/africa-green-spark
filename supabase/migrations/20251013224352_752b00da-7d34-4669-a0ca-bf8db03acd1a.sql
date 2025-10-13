
-- Create site settings table for logo and branding
CREATE TABLE IF NOT EXISTS public.cms_site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.cms_site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can view settings
CREATE POLICY "Anyone can view site settings"
ON public.cms_site_settings
FOR SELECT
TO public
USING (true);

-- Admins can manage settings
CREATE POLICY "Admins can manage site settings"
ON public.cms_site_settings
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default logo setting
INSERT INTO public.cms_site_settings (setting_key, setting_value)
VALUES ('site_logo', '/logo.png')
ON CONFLICT (setting_key) DO NOTHING;

-- Add updated_at trigger
CREATE TRIGGER update_cms_site_settings_updated_at
BEFORE UPDATE ON public.cms_site_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
