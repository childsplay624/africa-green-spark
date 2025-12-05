import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Calendar, 
  Search,
  Clock,
  ArrowRight,
  Filter,
  TrendingUp,
  User,
  Newspaper
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export default function News() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [heroData, setHeroData] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [searchQuery, selectedCategory, articles]);

  const loadData = async () => {
    try {
      const [articlesResult, heroResult] = await Promise.all([
        supabase
          .from("cms_news_articles")
          .select("*")
          .eq("is_published", true)
          .order("published_date", { ascending: false }),
        supabase
          .from("cms_hero_sections")
          .select("*")
          .eq("page", "news")
          .eq("is_active", true)
          .maybeSingle()
      ]);

      if (articlesResult.data) {
        setArticles(articlesResult.data);
        // Extract unique categories
        const uniqueCategories = [...new Set(
          articlesResult.data
            .map(a => a.category)
            .filter(Boolean)
        )] as string[];
        setCategories(uniqueCategories);
      }
      
      if (heroResult.data) setHeroData(heroResult.data);
    } catch (error) {
      console.error("Error loading news:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterArticles = () => {
    let filtered = [...articles];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        article =>
          article.title.toLowerCase().includes(query) ||
          article.excerpt?.toLowerCase().includes(query) ||
          article.content.toLowerCase().includes(query) ||
          article.author?.toLowerCase().includes(query)
      );
    }

    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    setFilteredArticles(filtered);
  };

  const featuredArticle = filteredArticles[0];
  const remainingArticles = filteredArticles.slice(1);

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 relative bg-gradient-to-br from-primary via-primary/90 to-secondary">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white relative z-10">
          <Newspaper className="h-16 w-16 mx-auto mb-6 text-accent animate-float" />
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 animate-fade-in text-white">
            {heroData?.title || "News & Insights"}
          </h1>
          <p className="text-xl leading-relaxed animate-fade-in delay-200 text-white/90">
            {heroData?.subtitle || "Stay informed with the latest developments in Africa's energy transition and sustainability initiatives."}
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 border-b border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search news articles..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading articles...</p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-20">
              <Newspaper className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-heading font-semibold mb-2">No Articles Found</h3>
              <p className="text-muted-foreground">
                {searchQuery || selectedCategory !== "all" 
                  ? "Try adjusting your search or filter criteria."
                  : "Check back soon for the latest news and insights."}
              </p>
            </div>
          ) : (
            <>
              {/* Featured Article */}
              {featuredArticle && (
                <div className="mb-16">
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h2 className="text-2xl font-heading font-bold">Featured Article</h2>
                  </div>
                  <Card className="overflow-hidden border-0 shadow-strong hover:shadow-xl transition-all duration-300 group">
                    <div className="grid md:grid-cols-2 gap-0">
                      {featuredArticle.image_url ? (
                        <div className="h-64 md:h-full relative overflow-hidden">
                          <img 
                            src={featuredArticle.image_url} 
                            alt={featuredArticle.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        </div>
                      ) : (
                        <div className="h-64 md:h-full bg-gradient-primary flex items-center justify-center">
                          <Newspaper className="h-24 w-24 text-white/30" />
                        </div>
                      )}
                      <div className="p-8 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-4">
                          {featuredArticle.category && (
                            <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                              {featuredArticle.category}
                            </Badge>
                          )}
                          <Badge variant="secondary" className="bg-accent/10 text-accent">
                            Featured
                          </Badge>
                        </div>
                        <Link to={`/news/${featuredArticle.id}`}>
                          <h3 className="text-2xl md:text-3xl font-heading font-bold mb-4 group-hover:text-primary transition-colors">
                            {featuredArticle.title}
                          </h3>
                        </Link>
                        <p className="text-muted-foreground leading-relaxed mb-6 line-clamp-3">
                          {featuredArticle.excerpt || featuredArticle.content.substring(0, 200)}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(featuredArticle.published_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                          {featuredArticle.author && (
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {featuredArticle.author}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {estimateReadTime(featuredArticle.content)}
                          </div>
                        </div>
                        <Button asChild className="w-fit">
                          <Link to={`/news/${featuredArticle.id}`}>
                            Read Full Article
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Article Grid */}
              {remainingArticles.length > 0 && (
                <div>
                  <h2 className="text-2xl font-heading font-bold mb-6">Latest Articles</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {remainingArticles.map((article, index) => (
                      <Card 
                        key={article.id}
                        className="group hover:shadow-medium transition-all duration-300 border-0 shadow-soft overflow-hidden"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {article.image_url ? (
                          <div className="h-48 relative overflow-hidden">
                            <img 
                              src={article.image_url} 
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {article.category && (
                              <div className="absolute top-4 left-4">
                                <Badge className="bg-white/90 text-primary text-xs">
                                  {article.category}
                                </Badge>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center relative">
                            <Newspaper className="h-12 w-12 text-primary/30" />
                            {article.category && (
                              <div className="absolute top-4 left-4">
                                <Badge className="bg-white/90 text-primary text-xs">
                                  {article.category}
                                </Badge>
                              </div>
                            )}
                          </div>
                        )}
                        
                        <CardHeader className="pb-2">
                          <Link to={`/news/${article.id}`}>
                            <CardTitle className="font-heading font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                              {article.title}
                            </CardTitle>
                          </Link>
                        </CardHeader>
                        
                        <CardContent>
                          <CardDescription className="text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                            {article.excerpt || article.content.substring(0, 150)}
                          </CardDescription>
                          
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(article.published_date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {estimateReadTime(article.content)}
                            </div>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="mt-4 w-full justify-center group-hover:bg-primary group-hover:text-white transition-colors"
                            asChild
                          >
                            <Link to={`/news/${article.id}`}>
                              Read More
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
