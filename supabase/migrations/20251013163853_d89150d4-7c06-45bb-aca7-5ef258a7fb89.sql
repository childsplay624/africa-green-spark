-- Create forums/categories with initial data
INSERT INTO public.forums (title, description, category, creator_id, is_public)
SELECT 
  'Renewable Energy', 
  'Discussions about solar, wind, hydro and other renewable energy sources across Africa',
  'renewable',
  (SELECT id FROM auth.users LIMIT 1),
  true
WHERE NOT EXISTS (SELECT 1 FROM public.forums WHERE category = 'renewable');

INSERT INTO public.forums (title, description, category, creator_id, is_public)
SELECT 
  'Policy & Regulation', 
  'Energy policy, regulatory frameworks, and government initiatives',
  'policy',
  (SELECT id FROM auth.users LIMIT 1),
  true
WHERE NOT EXISTS (SELECT 1 FROM public.forums WHERE category = 'policy');

INSERT INTO public.forums (title, description, category, creator_id, is_public)
SELECT 
  'Technology Innovation', 
  'Latest innovations and technological advancements in clean energy',
  'innovation',
  (SELECT id FROM auth.users LIMIT 1),
  true
WHERE NOT EXISTS (SELECT 1 FROM public.forums WHERE category = 'innovation');

INSERT INTO public.forums (title, description, category, creator_id, is_public)
SELECT 
  'Investment & Funding', 
  'Investment opportunities, funding mechanisms, and financial instruments',
  'funding',
  (SELECT id FROM auth.users LIMIT 1),
  true
WHERE NOT EXISTS (SELECT 1 FROM public.forums WHERE category = 'funding');

INSERT INTO public.forums (title, description, category, creator_id, is_public)
SELECT 
  'Sustainability', 
  'Environmental impact, carbon credits, and sustainable practices',
  'sustainability',
  (SELECT id FROM auth.users LIMIT 1),
  true
WHERE NOT EXISTS (SELECT 1 FROM public.forums WHERE category = 'sustainability');

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_forum_posts_created_at ON public.forum_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_posts_forum_id ON public.forum_posts(forum_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_trending ON public.forum_posts(likes_count DESC, views_count DESC, created_at DESC);