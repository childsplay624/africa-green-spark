-- Create CMS content tables

-- Hero sections table
CREATE TABLE public.cms_hero_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT,
  cta_text TEXT,
  cta_link TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Impact stats table
CREATE TABLE public.cms_impact_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Initiatives table
CREATE TABLE public.cms_initiatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  category TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- News/insights articles table
CREATE TABLE public.cms_news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  author TEXT,
  category TEXT,
  tags TEXT[],
  published_date TIMESTAMPTZ DEFAULT now(),
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Page content table (for About, Strategic Focus, etc.)
CREATE TABLE public.cms_page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  meta_description TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Partners table
CREATE TABLE public.cms_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  website TEXT,
  description TEXT,
  category TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cms_hero_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_impact_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_initiatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_partners ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Anyone can view active hero sections"
  ON public.cms_hero_sections FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view active stats"
  ON public.cms_impact_stats FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view active initiatives"
  ON public.cms_initiatives FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view published articles"
  ON public.cms_news_articles FOR SELECT
  USING (is_published = true);

CREATE POLICY "Anyone can view published pages"
  ON public.cms_page_content FOR SELECT
  USING (is_published = true);

CREATE POLICY "Anyone can view active partners"
  ON public.cms_partners FOR SELECT
  USING (is_active = true);

-- Admin policies
CREATE POLICY "Admins can manage hero sections"
  ON public.cms_hero_sections FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage stats"
  ON public.cms_impact_stats FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage initiatives"
  ON public.cms_initiatives FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage articles"
  ON public.cms_news_articles FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage pages"
  ON public.cms_page_content FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage partners"
  ON public.cms_partners FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_cms_hero_sections_updated_at
  BEFORE UPDATE ON public.cms_hero_sections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cms_impact_stats_updated_at
  BEFORE UPDATE ON public.cms_impact_stats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cms_initiatives_updated_at
  BEFORE UPDATE ON public.cms_initiatives
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cms_news_articles_updated_at
  BEFORE UPDATE ON public.cms_news_articles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cms_page_content_updated_at
  BEFORE UPDATE ON public.cms_page_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cms_partners_updated_at
  BEFORE UPDATE ON public.cms_partners
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();