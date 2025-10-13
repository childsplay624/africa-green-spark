import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useForumLikes(userId: string | undefined) {
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [likedReplies, setLikedReplies] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      loadUserLikes();
    }
  }, [userId]);

  const loadUserLikes = async () => {
    if (!userId) return;

    try {
      const [{ data: postLikes }, { data: replyLikes }] = await Promise.all([
        supabase
          .from("forum_post_likes")
          .select("post_id")
          .eq("user_id", userId),
        supabase
          .from("forum_reply_likes")
          .select("reply_id")
          .eq("user_id", userId),
      ]);

      if (postLikes) {
        setLikedPosts(new Set(postLikes.map((l) => l.post_id)));
      }
      if (replyLikes) {
        setLikedReplies(new Set(replyLikes.map((l) => l.reply_id)));
      }
    } catch (error) {
      console.error("Error loading user likes:", error);
    }
  };

  const togglePostLike = async (postId: string) => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to like posts",
        variant: "destructive",
      });
      return false;
    }

    const isLiked = likedPosts.has(postId);

    try {
      if (isLiked) {
        const { error } = await supabase
          .from("forum_post_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", userId);

        if (error) throw error;

        setLikedPosts((prev) => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
      } else {
        const { error } = await supabase
          .from("forum_post_likes")
          .insert({ post_id: postId, user_id: userId });

        if (error) throw error;

        setLikedPosts((prev) => new Set(prev).add(postId));
      }

      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
      });
      return false;
    }
  };

  const toggleReplyLike = async (replyId: string) => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to like replies",
        variant: "destructive",
      });
      return false;
    }

    const isLiked = likedReplies.has(replyId);

    try {
      if (isLiked) {
        const { error } = await supabase
          .from("forum_reply_likes")
          .delete()
          .eq("reply_id", replyId)
          .eq("user_id", userId);

        if (error) throw error;

        setLikedReplies((prev) => {
          const newSet = new Set(prev);
          newSet.delete(replyId);
          return newSet;
        });
      } else {
        const { error } = await supabase
          .from("forum_reply_likes")
          .insert({ reply_id: replyId, user_id: userId });

        if (error) throw error;

        setLikedReplies((prev) => new Set(prev).add(replyId));
      }

      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    likedPosts,
    likedReplies,
    togglePostLike,
    toggleReplyLike,
  };
}
