-- Create CMS tables for About page sections

-- Vision & Mission table
CREATE TABLE IF NOT EXISTS public.cms_vision_mission (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('vision', 'mission')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Core Values table
CREATE TABLE IF NOT EXISTS public.cms_core_values (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Strategic Pillars table
CREATE TABLE IF NOT EXISTS public.cms_strategic_pillars (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  bg_color TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cms_vision_mission ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_core_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_strategic_pillars ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vision_mission
CREATE POLICY "Anyone can view active vision/mission"
  ON public.cms_vision_mission FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage vision/mission"
  ON public.cms_vision_mission FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for core_values
CREATE POLICY "Anyone can view active values"
  ON public.cms_core_values FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage values"
  ON public.cms_core_values FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for strategic_pillars
CREATE POLICY "Anyone can view active pillars"
  ON public.cms_strategic_pillars FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage pillars"
  ON public.cms_strategic_pillars FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));