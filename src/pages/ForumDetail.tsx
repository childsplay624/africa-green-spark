import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  ThumbsUp, 
  MessageCircle, 
  ArrowLeft,
  Send
} from "lucide-react";

interface Post {
  id: string;
  title: string;
  content: string;
  tags: string[];
  likes_count: number;
  replies_count: number;
  views_count: number;
  created_at: string;
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

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("forum_replies")
        .insert({
          post_id: postId,
          author_id: user.id,
          content: newReply.trim(),
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
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
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
                <AvatarImage src={post.author.avatar_url || undefined} />
                <AvatarFallback>
                  {post.author.full_name?.split(' ').map(n => n[0]).join('') || post.author.email[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-2xl font-display font-bold mb-2">{post.title}</h1>
                <p className="text-sm text-muted-foreground">
                  by {post.author.full_name || post.author.email} • {new Date(post.created_at).toLocaleDateString()}
                </p>
              </div>
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

            <div className="flex items-center gap-4 text-sm text-muted-foreground border-t pt-4">
              <div className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4" />
                <span>{post.likes_count}</span>
              </div>
              <div className="flex items-center gap-1">
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
                      <AvatarImage src={reply.author.avatar_url || undefined} />
                      <AvatarFallback>
                        {reply.author.full_name?.split(' ').map(n => n[0]).join('') || reply.author.email[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-sm">
                          {reply.author.full_name || reply.author.email}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(reply.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-foreground mb-2">{reply.content}</p>
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="w-3 h-3 mr-1" />
                        {reply.likes_count}
                      </Button>
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
                />
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