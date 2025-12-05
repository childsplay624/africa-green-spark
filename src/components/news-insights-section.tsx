import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, TrendingUp, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function NewsInsightsSection() {
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    const { data } = await supabase
      .from("cms_news_articles")
      .select("*")
      .eq("is_published", true)
      .order("published_date", { ascending: false })
      .limit(3);
    
    if (data) setNews(data);
  };

  if (news.length === 0) return null;

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Latest{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              News & Insights
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Stay informed with the latest developments in Africa's energy transition 
            and sustainability initiatives.
          </p>
        </div>

        {/* News Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-heading font-semibold text-foreground">
              Recent News
            </h3>
            <Button variant="outline" asChild>
              <Link to="/news">
                View All News
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {news.map((article, index) => (
              <Link key={article.id} to={`/news/${article.id}`}>
                <Card 
                  className="group hover:shadow-medium transition-all duration-300 transform hover:scale-105 border-0 shadow-soft overflow-hidden h-full"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {article.image_url ? (
                    <div className="h-32 relative overflow-hidden">
                      <img 
                        src={article.image_url} 
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/90 text-primary text-xs font-medium px-2 py-1 rounded-full">
                          {article.category || "News"}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <TrendingUp className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="h-32 bg-gradient-primary flex items-center justify-center relative">
                      <TrendingUp className="h-12 w-12 text-white/30" />
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/90 text-primary text-xs font-medium px-2 py-1 rounded-full">
                          {article.category || "News"}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="font-heading font-semibold text-base sm:text-lg line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(article.published_date).toLocaleDateString()}
                      </div>
                      {article.author && (
                        <div className="flex items-center gap-1 text-xs">
                          <User className="h-3 w-3" />
                          {article.author}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <CardDescription className="text-muted-foreground leading-relaxed line-clamp-3">
                      {article.excerpt || article.content?.substring(0, 150)}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}