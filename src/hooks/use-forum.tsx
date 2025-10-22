import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

export interface ForumCategory {
  id: string;
  title: string;
  description: string;
  category: string;
  posts_count: number;
  icon?: string;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  tags: string[];
  likes_count: number;
  replies_count: number;
  views_count: number;
  created_at: string;
  forum_id: string;
  author: {
    full_name: string | null;
    email: string;
    avatar_url: string | null;
  };
  forum: {
    category: string;
  };
}

export function useForum() {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("forums")
        .select("id, title, description, category, icon")
        .eq("is_public", true);

      if (error) throw error;

      // Get post counts for each forum
      const categoriesWithCounts = await Promise.all(
        (data || []).map(async (forum) => {
          const { count } = await supabase
            .from("forum_posts")
            .select("*", { count: "exact", head: true })
            .eq("forum_id", forum.id);

          return {
            ...forum,
            posts_count: count || 0,
          };
        })
      );

      setCategories(categoriesWithCounts);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load forum categories",
        variant: "destructive",
      });
    }
  };

  const loadPosts = async (forumCategory?: string) => {
    try {
      let query = supabase
        .from("forum_posts")
        .select(`
          *,
          author:aesc_profiles!forum_posts_author_id_fkey(full_name, email, avatar_url),
          forum:forums!forum_posts_forum_id_fkey(category)
        `)
        .order("created_at", { ascending: false });

      if (forumCategory && forumCategory !== "all") {
        const { data: forum } = await supabase
          .from("forums")
          .select("id")
          .eq("category", forumCategory)
          .single();

        if (forum) {
          query = query.eq("forum_id", forum.id);
        }
      }

      const { data, error } = await query;

      if (error) throw error;

      setPosts((data as unknown as ForumPost[]) || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load discussions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (
    forumCategory: string,
    title: string,
    content: string,
    tags: string[]
  ) => {
    // Validation schema
    const postSchema = z.object({
      title: z.string().trim().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
      content: z.string().trim().min(1, "Content is required").max(5000, "Content must be less than 5000 characters"),
      tags: z.array(z.string().max(20)).max(5, "Maximum 5 tags allowed"),
    });

    try {
      // Validate input
      const validated = postSchema.parse({ title, content, tags });

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to create a post",
          variant: "destructive",
        });
        return false;
      }

      const { data: forum } = await supabase
        .from("forums")
        .select("id")
        .eq("category", forumCategory)
        .single();

      if (!forum) {
        toast({
          title: "Error",
          description: "Forum category not found",
          variant: "destructive",
        });
        return false;
      }

      const { data: postData, error } = await supabase.from("forum_posts").insert({
        forum_id: forum.id,
        author_id: session.user.id,
        title: validated.title,
        content: validated.content,
        tags: validated.tags,
      }).select('id').single();

      if (error) throw error;

      // Create a "Start New Discussion" activity
      if (postData) {
        await supabase.from("user_activities").insert({
          user_id: session.user.id,
          type: "new_discussion",
          title: `Started discussion: ${validated.title}`,
          description: validated.content.substring(0, 150) + (validated.content.length > 150 ? "..." : ""),
          link: `/forum/${postData.id}`,
        });
      }

      toast({
        title: "Success",
        description: "Discussion created successfully",
      });

      await loadPosts();
      return true;
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to create discussion",
          variant: "destructive",
        });
      }
      return false;
    }
  };

  const incrementViews = async (postId: string) => {
    try {
      const { data: post } = await supabase
        .from("forum_posts")
        .select("views_count")
        .eq("id", postId)
        .single();

      if (post) {
        await supabase
          .from("forum_posts")
          .update({ views_count: post.views_count + 1 })
          .eq("id", postId);
      }
    } catch (error) {
      console.error("Failed to increment views:", error);
    }
  };

  useEffect(() => {
    loadCategories();
    loadPosts();
  }, []);

  return {
    categories,
    posts,
    loading,
    loadPosts,
    createPost,
    incrementViews,
  };
}
