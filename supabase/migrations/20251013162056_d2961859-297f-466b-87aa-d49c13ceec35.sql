-- Fix security warnings by adding search_path to functions

-- Update increment_replies_count function
CREATE OR REPLACE FUNCTION increment_replies_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.forum_posts
  SET replies_count = replies_count + 1
  WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update notify_forum_subscribers function
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;