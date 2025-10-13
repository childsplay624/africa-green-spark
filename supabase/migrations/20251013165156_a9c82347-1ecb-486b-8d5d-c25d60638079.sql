-- Create likes tables for posts and replies
CREATE TABLE IF NOT EXISTS public.forum_post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.forum_reply_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reply_id uuid NOT NULL REFERENCES public.forum_replies(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(reply_id, user_id)
);

-- Enable RLS on likes tables
ALTER TABLE public.forum_post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_reply_likes ENABLE ROW LEVEL SECURITY;

-- RLS policies for forum_post_likes
CREATE POLICY "Anyone can view post likes"
ON public.forum_post_likes FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can like posts"
ON public.forum_post_likes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike their own likes"
ON public.forum_post_likes FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- RLS policies for forum_reply_likes
CREATE POLICY "Anyone can view reply likes"
ON public.forum_reply_likes FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can like replies"
ON public.forum_reply_likes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike their own reply likes"
ON public.forum_reply_likes FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create function to update post likes count
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.forum_posts
    SET likes_count = likes_count + 1
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.forum_posts
    SET likes_count = GREATEST(0, likes_count - 1)
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
END;
$$;

-- Create function to update reply likes count
CREATE OR REPLACE FUNCTION update_reply_likes_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.forum_replies
    SET likes_count = likes_count + 1
    WHERE id = NEW.reply_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.forum_replies
    SET likes_count = GREATEST(0, likes_count - 1)
    WHERE id = OLD.reply_id;
    RETURN OLD;
  END IF;
END;
$$;

-- Create triggers for automatic likes count updates
CREATE TRIGGER update_post_likes_count_trigger
AFTER INSERT OR DELETE ON public.forum_post_likes
FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();

CREATE TRIGGER update_reply_likes_count_trigger
AFTER INSERT OR DELETE ON public.forum_reply_likes
FOR EACH ROW EXECUTE FUNCTION update_reply_likes_count();

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_forum_post_likes_post_id ON public.forum_post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_forum_post_likes_user_id ON public.forum_post_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_reply_likes_reply_id ON public.forum_reply_likes(reply_id);
CREATE INDEX IF NOT EXISTS idx_forum_reply_likes_user_id ON public.forum_reply_likes(user_id);

-- Update forum_posts RLS to allow moderators/admins to update any post (for pinning)
CREATE POLICY "Moderators can update any post"
ON public.forum_posts FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'moderator') OR 
  public.has_role(auth.uid(), 'admin')
);

-- Allow moderators/admins to delete any post
CREATE POLICY "Moderators can delete any post"
ON public.forum_posts FOR DELETE
TO authenticated
USING (
  public.has_role(auth.uid(), 'moderator') OR 
  public.has_role(auth.uid(), 'admin')
);

-- Update forum_replies RLS to allow moderators/admins to delete any reply
CREATE POLICY "Moderators can delete any reply"
ON public.forum_replies FOR DELETE
TO authenticated
USING (
  public.has_role(auth.uid(), 'moderator') OR 
  public.has_role(auth.uid(), 'admin')
);