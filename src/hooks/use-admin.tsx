import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type UserRole = "admin" | "moderator" | "user";

export function useAdmin(userId: string | undefined) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      checkRoles();
    } else {
      setIsAdmin(false);
      setIsModerator(false);
      setLoading(false);
    }
  }, [userId]);

  const checkRoles = async () => {
    if (!userId) return;

    try {
      const [{ data: adminRole }, { data: modRole }] = await Promise.all([
        supabase.rpc("has_role", { _user_id: userId, _role: "admin" }),
        supabase.rpc("has_role", { _user_id: userId, _role: "moderator" }),
      ]);

      setIsAdmin(adminRole === true);
      setIsModerator(modRole === true);
    } catch (error) {
      console.error("Error checking roles:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePostPin = async (postId: string, isPinned: boolean) => {
    if (!isAdmin && !isModerator) {
      toast({
        title: "Unauthorized",
        description: "Only moderators and admins can pin posts",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from("forum_posts")
        .update({ is_pinned: !isPinned })
        .eq("id", postId);

      if (error) throw error;

      toast({
        title: "Success",
        description: isPinned ? "Post unpinned" : "Post pinned",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update post",
        variant: "destructive",
      });
      return false;
    }
  };

  const deletePost = async (postId: string) => {
    if (!isAdmin && !isModerator) {
      toast({
        title: "Unauthorized",
        description: "Only moderators and admins can delete posts",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from("forum_posts")
        .delete()
        .eq("id", postId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post deleted successfully",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteReply = async (replyId: string) => {
    if (!isAdmin && !isModerator) {
      toast({
        title: "Unauthorized",
        description: "Only moderators and admins can delete replies",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from("forum_replies")
        .delete()
        .eq("id", replyId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Reply deleted successfully",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete reply",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    isAdmin,
    isModerator,
    loading,
    canModerate: isAdmin || isModerator,
    togglePostPin,
    deletePost,
    deleteReply,
  };
}
