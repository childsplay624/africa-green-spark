-- Create user_activities table
CREATE TABLE public.user_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'post', 'comment', 'forum_post', 'forum_reply', 'achievement'
  title TEXT NOT NULL,
  description TEXT,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- Users can view their own activities
CREATE POLICY "Users can view their own activities"
ON public.user_activities
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own activities
CREATE POLICY "Users can insert their own activities"
ON public.user_activities
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own activities
CREATE POLICY "Users can update their own activities"
ON public.user_activities
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own activities
CREATE POLICY "Users can delete their own activities"
ON public.user_activities
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_user_activities_user_id ON public.user_activities(user_id);
CREATE INDEX idx_user_activities_created_at ON public.user_activities(created_at DESC);