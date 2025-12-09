-- Create trigger function for reply notifications (notify post author when someone replies)
CREATE OR REPLACE FUNCTION public.notify_post_author_on_reply()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  post_author_id uuid;
  post_title text;
  replier_name text;
BEGIN
  -- Get the post author and title
  SELECT author_id, title INTO post_author_id, post_title
  FROM public.forum_posts
  WHERE id = NEW.post_id;

  -- Get the replier's name
  SELECT COALESCE(full_name, email) INTO replier_name
  FROM public.aesc_profiles
  WHERE id = NEW.author_id;

  -- Don't notify if replying to own post
  IF post_author_id != NEW.author_id THEN
    INSERT INTO public.notifications (user_id, type, title, message, link)
    VALUES (
      post_author_id,
      'new_reply',
      'New reply on your post',
      COALESCE(replier_name, 'Someone') || ' replied to "' || LEFT(post_title, 50) || '"',
      '/forum/' || (SELECT forum_id FROM public.forum_posts WHERE id = NEW.post_id) || '/' || NEW.post_id
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger for reply notifications
DROP TRIGGER IF EXISTS on_forum_reply_created ON public.forum_replies;
CREATE TRIGGER on_forum_reply_created
  AFTER INSERT ON public.forum_replies
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_post_author_on_reply();

-- Create trigger function for post like notifications
CREATE OR REPLACE FUNCTION public.notify_post_author_on_like()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  post_author_id uuid;
  post_title text;
  liker_name text;
  post_forum_id uuid;
BEGIN
  -- Get the post author, title and forum_id
  SELECT author_id, title, forum_id INTO post_author_id, post_title, post_forum_id
  FROM public.forum_posts
  WHERE id = NEW.post_id;

  -- Get the liker's name
  SELECT COALESCE(full_name, email) INTO liker_name
  FROM public.aesc_profiles
  WHERE id = NEW.user_id;

  -- Don't notify if liking own post
  IF post_author_id != NEW.user_id THEN
    INSERT INTO public.notifications (user_id, type, title, message, link)
    VALUES (
      post_author_id,
      'post_like',
      'Someone liked your post',
      COALESCE(liker_name, 'Someone') || ' liked "' || LEFT(post_title, 50) || '"',
      '/forum/' || post_forum_id || '/' || NEW.post_id
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger for post like notifications
DROP TRIGGER IF EXISTS on_forum_post_liked ON public.forum_post_likes;
CREATE TRIGGER on_forum_post_liked
  AFTER INSERT ON public.forum_post_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_post_author_on_like();

-- Create trigger function for reply like notifications
CREATE OR REPLACE FUNCTION public.notify_reply_author_on_like()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  reply_author_id uuid;
  reply_content text;
  liker_name text;
  reply_post_id uuid;
  post_forum_id uuid;
BEGIN
  -- Get the reply author and content
  SELECT author_id, content, post_id INTO reply_author_id, reply_content, reply_post_id
  FROM public.forum_replies
  WHERE id = NEW.reply_id;

  -- Get the forum_id from the post
  SELECT forum_id INTO post_forum_id
  FROM public.forum_posts
  WHERE id = reply_post_id;

  -- Get the liker's name
  SELECT COALESCE(full_name, email) INTO liker_name
  FROM public.aesc_profiles
  WHERE id = NEW.user_id;

  -- Don't notify if liking own reply
  IF reply_author_id != NEW.user_id THEN
    INSERT INTO public.notifications (user_id, type, title, message, link)
    VALUES (
      reply_author_id,
      'reply_like',
      'Someone liked your reply',
      COALESCE(liker_name, 'Someone') || ' liked your reply: "' || LEFT(reply_content, 40) || '..."',
      '/forum/' || post_forum_id || '/' || reply_post_id
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger for reply like notifications
DROP TRIGGER IF EXISTS on_forum_reply_liked ON public.forum_reply_likes;
CREATE TRIGGER on_forum_reply_liked
  AFTER INSERT ON public.forum_reply_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_reply_author_on_like();

-- Enable realtime for notifications table
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;