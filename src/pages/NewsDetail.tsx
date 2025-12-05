import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Calendar, 
  Clock,
  ArrowLeft,
  ArrowRight,
  User,
  Share2,
  Newspaper,
  Tag
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  image_url: string | null;
  author: string | null;
  category: string | null;
  is_published: boolean;
  published_date: string;
  tags: string[] | null;
}

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadArticle(id);
    }
  }, [id]);

  const loadArticle = async (articleId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("cms_news_articles")
        .select("*")
        .eq("id", articleId)
        .eq("is_published", true)
        .single();

      if (error) throw error;
      if (!data) {
        navigate("/news");
        return;
      }

      setArticle(data);

      // Load related articles
      const { data: related } = await supabase
        .from("cms_news_articles")
        .select("*")
        .eq("is_published", true)
        .neq("id", articleId)
        .eq("category", data.category || "")
        .order("published_date", { ascending: false })
        .limit(3);

      if (related && related.length > 0) {
        setRelatedArticles(related);
      } else {
        // If no related by category, get recent articles
        const { data: recent } = await supabase
          .from("cms_news_articles")
          .select("*")
          .eq("is_published", true)
          .neq("id", articleId)
          .order("published_date", { ascending: false })
          .limit(3);
        
        if (recent) setRelatedArticles(recent);
      }
    } catch (error) {
      console.error("Error loading article:", error);
      navigate("/news");
    } finally {
      setLoading(false);
    }
  };

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  const handleShare = async () => {
    const shareData = {
      title: article?.title,
      text: article?.excerpt || article?.title,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // User cancelled or error
      }
    } else {
      // Fallback to copying link
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Article link has been copied to clipboard.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Newspaper className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-heading font-bold mb-2">Article Not Found</h2>
          <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/news">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to News
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image */}
      {article.image_url && (
        <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
          <img 
            src={article.image_url} 
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
        </div>
      )}

      {/* Article Content */}
      <article className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ${article.image_url ? '-mt-32 relative z-10' : 'pt-20'}`}>
        {/* Back Button */}
        <Button variant="ghost" size="sm" className="mb-6" asChild>
          <Link to="/news">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to News
          </Link>
        </Button>

        {/* Article Header */}
        <Card className="border-0 shadow-strong mb-8">
          <CardContent className="p-8 md:p-12">
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {article.category && (
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                  {article.category}
                </Badge>
              )}
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {new Date(article.published_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {estimateReadTime(article.content)}
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Excerpt */}
            {article.excerpt && (
              <p className="text-xl text-muted-foreground leading-relaxed mb-8 border-l-4 border-primary pl-4">
                {article.excerpt}
              </p>
            )}

            {/* Author and Share */}
            <div className="flex items-center justify-between pt-6 border-t border-border">
              {article.author && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{article.author}</p>
                    <p className="text-sm text-muted-foreground">Author</p>
                  </div>
                </div>
              )}
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Article Body */}
        <Card className="border-0 shadow-soft mb-8">
          <CardContent className="p-8 md:p-12">
            <div className="prose prose-lg max-w-none text-foreground">
              {article.content.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="mb-4 leading-relaxed text-foreground/90">
                    {paragraph}
                  </p>
                )
              ))}
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-border">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  {article.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="py-12">
            <h2 className="text-2xl font-heading font-bold mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((related, index) => (
                <Card 
                  key={related.id}
                  className="group hover:shadow-medium transition-all duration-300 border-0 shadow-soft overflow-hidden"
                >
                  {related.image_url ? (
                    <div className="h-32 relative overflow-hidden">
                      <img 
                        src={related.image_url} 
                        alt={related.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="h-32 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <Newspaper className="h-8 w-8 text-primary/30" />
                    </div>
                  )}
                  <CardHeader className="p-4">
                    <Link to={`/news/${related.id}`}>
                      <CardTitle className="font-heading font-semibold text-base line-clamp-2 group-hover:text-primary transition-colors">
                        {related.title}
                      </CardTitle>
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                      <Calendar className="h-3 w-3" />
                      {new Date(related.published_date).toLocaleDateString()}
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <Card className="border-0 bg-gradient-primary text-white mb-12">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-heading font-bold mb-3">Stay Informed</h3>
            <p className="text-white/90 mb-6">
              Get the latest news and insights on Africa's energy transition delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" asChild>
                <Link to="/news">
                  Browse All Articles
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </article>
    </div>
  );
}
