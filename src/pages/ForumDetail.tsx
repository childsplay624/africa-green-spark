import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForumLikes } from "@/hooks/use-forum-likes";
import { useAdmin } from "@/hooks/use-admin";
import { z } from "zod";
import { 
  ThumbsUp, 
  MessageCircle, 
  ArrowLeft,
  Send,
  Pin,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Post {
  id: string;
  title: string;
  content: string;
  tags: string[];
  likes_count: number;
  replies_count: number;
  views_count: number;
  created_at: string;
  is_pinned: boolean | null;
  author_id: string;
  author: {
    full_name: string | null;
    email: string;
    avatar_url: string | null;
  };
}

interface Reply {
  id: string;
  content: string;
  likes_count: number;
  created_at: string;
  author_id: string;
  author: {
    full_name: string | null;
    email: string;
    avatar_url: string | null;
  };
}

export default function ForumDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [post, setPost] = useState<Post | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [newReply, setNewReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const { likedPosts, likedReplies, togglePostLike, toggleReplyLike } = useForumLikes(user?.id);
  const { canModerate, togglePostPin, deletePost: adminDeletePost, deleteReply: adminDeleteReply } = useAdmin(user?.id);

  useEffect(() => {
    checkUser();
    if (postId) {
      loadPost();
      loadReplies();
      incrementViewCount();
    }
  }, [postId]);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
  };

  const loadPost = async () => {
    if (!postId) return;

    const { data, error } = await supabase
      .from("forum_posts")
      .select(`
        *,
        author:aesc_profiles!forum_posts_author_id_fkey(full_name, email, avatar_url)
      `)
      .eq("id", postId)
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load post",
        variant: "destructive",
      });
      return;
    }

    setPost(data as unknown as Post);
    setLoading(false);
  };

  const loadReplies = async () => {
    if (!postId) return;

    const { data, error } = await supabase
      .from("forum_replies")
      .select(`
        *,
        author:aesc_profiles!forum_replies_author_id_fkey(full_name, email, avatar_url)
      `)
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error loading replies:", error);
      return;
    }

    setReplies(data as unknown as Reply[]);
  };

  const incrementViewCount = async () => {
    if (!postId || !post) return;

    await supabase
      .from("forum_posts")
      .update({ views_count: post.views_count + 1 })
      .eq("id", postId);
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !postId || !newReply.trim()) return;

    // Validation
    const replySchema = z.object({
      content: z.string().trim().min(1, "Reply cannot be empty").max(5000, "Reply must be less than 5000 characters"),
    });

    setSubmitting(true);
    try {
      const validated = replySchema.parse({ content: newReply });

      const { error } = await supabase
        .from("forum_replies")
        .insert({
          post_id: postId,
          author_id: user.id,
          content: validated.content,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Reply posted successfully",
      });

      setNewReply("");
      await loadReplies();
      await loadPost();
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
          description: "Failed to post reply",
          variant: "destructive",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikePost = async () => {
    if (!post) return;
    const success = await togglePostLike(post.id);
    if (success) {
      await loadPost();
    }
  };

  const handleLikeReply = async (replyId: string) => {
    const success = await toggleReplyLike(replyId);
    if (success) {
      await loadReplies();
    }
  };

  const handlePinPost = async () => {
    if (!post) return;
    const success = await togglePostPin(post.id, post.is_pinned || false);
    if (success) {
      await loadPost();
    }
  };

  const handleDeletePost = async () => {
    if (!post || !confirm("Are you sure you want to delete this post?")) return;
    const success = await adminDeletePost(post.id);
    if (success) {
      navigate("/forum");
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    if (!confirm("Are you sure you want to delete this reply?")) return;
    const success = await adminDeleteReply(replyId);
    if (success) {
      await loadReplies();
      await loadPost();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Post not found</h2>
          <Button onClick={() => navigate("/forum")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Forum
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/forum")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Forum
        </Button>

        {/* Post */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <Avatar className="w-12 h-12">
                <AvatarImage src={post.author?.avatar_url || undefined} />
                <AvatarFallback>
                  {post.author?.full_name?.split(' ').map(n => n[0]).join('') || post.author?.email?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-display font-bold">{post.title}</h1>
                  {post.is_pinned && (
                    <Badge variant="secondary" className="gap-1">
                      <Pin className="h-3 w-3" />
                      Pinned
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  by {post.author?.full_name || post.author?.email || 'Anonymous'} • {new Date(post.created_at).toLocaleDateString()}
                </p>
              </div>
              {canModerate && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePinPost}
                    className="gap-2"
                  >
                    <Pin className={cn("h-4 w-4", post.is_pinned && "fill-current")} />
                    {post.is_pinned ? "Unpin" : "Pin"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDeletePost}
                    className="gap-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              )}
            </div>

            <div className="prose max-w-none mb-6">
              <p className="text-foreground leading-relaxed">{post.content}</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags?.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-4 text-sm border-t pt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLikePost}
                className={cn(
                  "gap-1",
                  likedPosts.has(post.id) && "text-primary"
                )}
              >
                <ThumbsUp className={cn("w-4 h-4", likedPosts.has(post.id) && "fill-current")} />
                <span>{post.likes_count}</span>
              </Button>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MessageCircle className="w-4 h-4" />
                <span>{post.replies_count} replies</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Replies */}
        <div className="mb-8">
          <h2 className="text-xl font-heading font-bold mb-4">
            Replies ({replies.length})
          </h2>
          <div className="space-y-4">
            {replies.map((reply) => (
              <Card key={reply.id}>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={reply.author?.avatar_url || undefined} />
                      <AvatarFallback>
                        {reply.author?.full_name?.split(' ').map(n => n[0]).join('') || reply.author?.email?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-sm">
                          {reply.author?.full_name || reply.author?.email || 'Anonymous'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(reply.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-foreground mb-2">{reply.content}</p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLikeReply(reply.id)}
                          className={cn(
                            "gap-1",
                            likedReplies.has(reply.id) && "text-primary"
                          )}
                        >
                          <ThumbsUp className={cn("w-3 h-3", likedReplies.has(reply.id) && "fill-current")} />
                          {reply.likes_count}
                        </Button>
                        {canModerate && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteReply(reply.id)}
                            className="gap-1 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Reply Form */}
        {user ? (
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Add a Reply</h3>
              <form onSubmit={handleSubmitReply}>
                <Textarea
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={4}
                  className="mb-4"
                  maxLength={5000}
                />
                <p className="text-xs text-muted-foreground mb-4">
                  {newReply.length}/5000 characters
                </p>
                <Button type="submit" disabled={submitting || !newReply.trim()}>
                  <Send className="mr-2 h-4 w-4" />
                  {submitting ? "Posting..." : "Post Reply"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground mb-4">
                Please sign in to reply to this discussion
              </p>
              <Button onClick={() => navigate("/auth")}>Sign In</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}