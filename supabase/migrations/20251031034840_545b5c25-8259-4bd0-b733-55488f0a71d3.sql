-- Add session tracking and bot detection to site_visits
ALTER TABLE public.site_visits 
ADD COLUMN session_id TEXT,
ADD COLUMN is_bot BOOLEAN DEFAULT false;

-- Create index for performance on session-based queries
CREATE INDEX idx_site_visits_session ON public.site_visits(session_id);
CREATE INDEX idx_site_visits_is_bot ON public.site_visits(is_bot);

-- Create unique constraint to prevent duplicate session visits
CREATE UNIQUE INDEX idx_unique_session_page ON public.site_visits(session_id, page_path) 
WHERE session_id IS NOT NULL;