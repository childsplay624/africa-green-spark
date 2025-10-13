-- Enhanced user profiles with trial tracking
ALTER TABLE public.aesc_profiles ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE public.aesc_profiles ADD COLUMN IF NOT EXISTS location text;
ALTER TABLE public.aesc_profiles ADD COLUMN IF NOT EXISTS organization text;
ALTER TABLE public.aesc_profiles ADD COLUMN IF NOT EXISTS website text;
ALTER TABLE public.aesc_profiles ADD COLUMN IF NOT EXISTS trial_started_at timestamp with time zone DEFAULT now();
ALTER TABLE public.aesc_profiles ADD COLUMN IF NOT EXISTS trial_expires_at timestamp with time zone DEFAULT (now() + interval '90 days');
ALTER TABLE public.aesc_profiles ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'trial';

-- User-created forums
CREATE TABLE IF NOT EXISTS public.forums (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL,
  creator_id uuid REFERENCES public.aesc_profiles(id) ON DELETE CASCADE NOT NULL,
  is_public boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.forums ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public forums"
  ON public.forums FOR SELECT
  USING (is_public = true OR auth.uid() = creator_id);

CREATE POLICY "Authenticated users can create forums"
  ON public.forums FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Forum creators can update their forums"
  ON public.forums FOR UPDATE
  USING (auth.uid() = creator_id);

CREATE POLICY "Forum creators can delete their forums"
  ON public.forums FOR DELETE
  USING (auth.uid() = creator_id);

-- Forum posts
CREATE TABLE IF NOT EXISTS public.forum_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  forum_id uuid REFERENCES public.forums(id) ON DELETE CASCADE NOT NULL,
  author_id uuid REFERENCES public.aesc_profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  tags text[],
  is_pinned boolean DEFAULT false,
  likes_count integer DEFAULT 0,
  replies_count integer DEFAULT 0,
  views_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view forum posts"
  ON public.forum_posts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON public.forum_posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Post authors can update their posts"
  ON public.forum_posts FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Post authors can delete their posts"
  ON public.forum_posts FOR DELETE
  USING (auth.uid() = author_id);

-- Forum replies
CREATE TABLE IF NOT EXISTS public.forum_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES public.forum_posts(id) ON DELETE CASCADE NOT NULL,
  author_id uuid REFERENCES public.aesc_profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  likes_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view replies"
  ON public.forum_replies FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create replies"
  ON public.forum_replies FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Reply authors can update their replies"
  ON public.forum_replies FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Reply authors can delete their replies"
  ON public.forum_replies FOR DELETE
  USING (auth.uid() = author_id);

-- Forum subscriptions
CREATE TABLE IF NOT EXISTS public.forum_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.aesc_profiles(id) ON DELETE CASCADE NOT NULL,
  forum_id uuid REFERENCES public.forums(id) ON DELETE CASCADE NOT NULL,
  notify_on_post boolean DEFAULT true,
  notify_on_reply boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, forum_id)
);

ALTER TABLE public.forum_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscriptions"
  ON public.forum_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own subscriptions"
  ON public.forum_subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
  ON public.forum_subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subscriptions"
  ON public.forum_subscriptions FOR DELETE
  USING (auth.uid() = user_id);

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.aesc_profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  link text,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
  ON public.notifications FOR DELETE
  USING (auth.uid() = user_id);

-- Payment records
CREATE TABLE IF NOT EXISTS public.payment_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.aesc_profiles(id) ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL,
  currency text DEFAULT 'USD',
  payment_method text NOT NULL,
  transaction_reference text UNIQUE NOT NULL,
  status text DEFAULT 'pending',
  metadata jsonb,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.payment_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments"
  ON public.payment_records FOR SELECT
  USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_forums_updated_at BEFORE UPDATE ON public.forums
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_posts_updated_at BEFORE UPDATE ON public.forum_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_replies_updated_at BEFORE UPDATE ON public.forum_replies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment reply count
CREATE OR REPLACE FUNCTION increment_replies_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.forum_posts
  SET replies_count = replies_count + 1
  WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_reply_created
  AFTER INSERT ON public.forum_replies
  FOR EACH ROW EXECUTE FUNCTION increment_replies_count();

-- Function to create notification on new post in subscribed forum
CREATE OR REPLACE FUNCTION notify_forum_subscribers()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, link)
  SELECT 
    fs.user_id,
    'new_post',
    'New post in ' || f.title,
    'New post: ' || NEW.title,
    '/forum/' || NEW.forum_id || '/' || NEW.id
  FROM public.forum_subscriptions fs
  JOIN public.forums f ON f.id = fs.forum_id
  WHERE fs.forum_id = NEW.forum_id
    AND fs.notify_on_post = true
    AND fs.user_id != NEW.author_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_post_created
  AFTER INSERT ON public.forum_posts
  FOR EACH ROW EXECUTE FUNCTION notify_forum_subscribers();