import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  FileText, 
  BookOpen, 
  Video, 
  Download, 
  Calendar, 
  Search,
  TrendingUp,
  Users,
  Clock,
  ArrowRight,
  Filter
} from "lucide-react";
import resourcesHero from "@/assets/resources-hero.jpg";

const resourceCategories = [
  {
    icon: FileText,
    title: "Research Reports",
    count: "45+ Reports",
    description: "Comprehensive analysis on energy transition and sustainability",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: BookOpen,
    title: "Policy Briefs",
    count: "28+ Briefs",
    description: "Strategic policy recommendations for governments",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: Video,
    title: "Case Studies",
    count: "35+ Studies",
    description: "Real-world implementations and lessons learned",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: TrendingUp,
    title: "Market Analysis",
    count: "22+ Reports",
    description: "Energy market trends and investment opportunities",
    color: "text-earth",
    bgColor: "bg-earth/10",
  },
];

const featuredResources = [
  {
    title: "Africa Energy Transition Outlook 2024",
    description: "Comprehensive assessment of renewable energy potential and investment opportunities across 54 African countries.",
    category: "Research Report",
    date: "2024-11-15",
    downloads: "3.2K",
    pages: "156 pages",
    featured: true,
  },
  {
    title: "Policy Framework for Sustainable Energy",
    description: "Strategic recommendations for implementing effective renewable energy policies in African markets.",
    category: "Policy Brief",
    date: "2024-10-28",
    downloads: "1.8K",
    pages: "45 pages",
    featured: true,
  },
  {
    title: "Solar Energy Implementation in Rural Nigeria",
    description: "Detailed case study of successful solar microgrid deployment in rural communities.",
    category: "Case Study",
    date: "2024-10-15",
    downloads: "2.1K",
    pages: "32 pages",
    featured: true,
  },
];

const recentNews = [
  {
    title: "AE&SC Launches Green Investment Initiative",
    excerpt: "New $500M fund targets renewable energy projects across West Africa.",
    date: "2024-12-01",
    category: "Investment",
    readTime: "3 min",
  },
  {
    title: "Partnership with African Development Bank",
    excerpt: "Strategic collaboration to accelerate sustainable infrastructure development.",
    date: "2024-11-28",
    category: "Partnership",
    readTime: "4 min",
  },
  {
    title: "Renewable Energy Milestone Reached",
    excerpt: "Africa surpasses 50GW of installed renewable energy capacity.",
    date: "2024-11-25",
    category: "Achievement",
    readTime: "2 min",
  },
  {
    title: "Clean Energy Policy Summit 2024",
    excerpt: "Key outcomes from the continental energy policy forum in Accra.",
    date: "2024-11-20",
    category: "Event",
    readTime: "5 min",
  },
];

const upcomingEvents = [
  {
    title: "Africa Energy Week 2025",
    date: "2025-01-15",
    location: "Lagos, Nigeria",
    type: "Conference",
  },
  {
    title: "Sustainable Finance Forum",
    date: "2025-02-08",
    location: "Cape Town, South Africa",
    type: "Forum",
  },
  {
    title: "Clean Energy Innovation Expo",
    date: "2025-02-22",
    location: "Nairobi, Kenya",
    type: "Exhibition",
  },
];

export default function Resources() {
  const [heroData, setHeroData] = useState<any>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [pageContent, setPageContent] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [heroResult, articlesResult, contentResult] = await Promise.all([
      supabase.from('cms_hero_sections').select('*').eq('page', 'resources').eq('is_active', true).maybeSingle(),
      supabase.from('cms_news_articles').select('*').eq('is_published', true).order('published_date', { ascending: false }).limit(4),
      supabase.from('cms_page_content').select('*').eq('page_slug', 'resources').eq('is_published', true).maybeSingle()
    ]);
    
    if (heroResult.data) setHeroData(heroResult.data);
    if (articlesResult.data) setArticles(articlesResult.data);
    if (contentResult.data) setPageContent(contentResult.data.content);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section 
        className="py-20 relative bg-cover bg-center bg-no-repeat african-pattern"
        style={{ backgroundImage: `linear-gradient(rgba(19, 50, 44, 0.8), rgba(19, 50, 44, 0.8)), url(${resourcesHero})` }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <BookOpen className="h-16 w-16 mx-auto mb-6 text-accent animate-float" />
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 animate-fade-in text-white">
            {heroData?.title || "Resources & Insights"}
          </h1>
          <p className="text-xl leading-relaxed animate-fade-in delay-200">
            {heroData?.subtitle || pageContent?.subtitle || "Access our comprehensive library of research, analysis, and insights on Africa's energy transition and sustainability journey."}
          </p>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
              Resource Categories
            </h2>
            <p className="text-xl text-muted-foreground">
              Explore our diverse collection of sustainability and energy resources
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
            {(pageContent?.resourceCategories || resourceCategories).map((category: any, index: number) => {
              const iconName = typeof category.icon === 'string' ? category.icon : 'FileText';
              let Icon = FileText;
              if (iconName === 'FileText') Icon = FileText;
              if (iconName === 'BookOpen') Icon = BookOpen;
              if (iconName === 'Video') Icon = Video;
              if (iconName === 'TrendingUp') Icon = TrendingUp;
              return (
                <Card 
                  key={category.title}
                  className="group hover:shadow-medium transition-all duration-300 transform hover:scale-105 border-0 shadow-soft text-center"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 ${category.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-6 w-6 sm:h-8 sm:w-8 ${category.color}`} />
                    </div>
                    <h3 className="font-heading font-semibold text-base sm:text-lg mb-2">
                      {category.title}
                    </h3>
                    <div className={`text-sm font-medium ${category.color} mb-2`}>
                      {category.count}
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search resources..." className="pl-10" />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
              Featured Resources
            </h2>
            <p className="text-xl text-muted-foreground">
              Our most impactful and downloaded publications
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {(pageContent?.featuredResources || featuredResources).map((resource: any, index: number) => (
              <Card 
                key={resource.title}
                className="group hover:shadow-strong transition-all duration-300 border-0 shadow-medium"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {resource.category}
                    </Badge>
                    {resource.featured && (
                      <Badge className="text-xs bg-accent text-white">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="font-heading font-bold text-xl group-hover:text-primary transition-colors line-clamp-2">
                    {resource.title}
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed line-clamp-3">
                    {resource.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(resource.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        {resource.downloads}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {resource.pages}
                      </span>
                      <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-white transition-colors">
                        Download
                        <Download className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* News & Events */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Recent News */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-heading font-bold text-foreground">
                  Latest News
                </h2>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/news">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="space-y-6">
                {(articles.length > 0 ? articles : recentNews).map((article, index) => (
                  <Card 
                    key={article.title}
                    className="hover:shadow-medium transition-all duration-300 border-0 shadow-soft"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-3">
                        <Badge variant="secondary" className="text-xs">
                          {article.category}
                        </Badge>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {new Date(article.published_date || article.date).toLocaleDateString()}
                        </div>
                        {article.readTime && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {article.readTime}
                          </div>
                        )}
                      </div>
                      <h3 className="font-heading font-semibold text-lg mb-2 hover:text-primary transition-colors cursor-pointer">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {article.excerpt}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-heading font-bold text-foreground">
                  Upcoming Events
                </h2>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/events">
                    View Calendar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="space-y-6">
                {(pageContent?.upcomingEvents || upcomingEvents).map((event: any, index: number) => (
                  <Card 
                    key={event.title}
                    className="hover:shadow-medium transition-all duration-300 border-0 shadow-soft"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gradient-primary rounded-xl flex flex-col items-center justify-center text-white flex-shrink-0">
                          <div className="text-xs font-medium">
                            {new Date(event.date).toLocaleDateString('en', { month: 'short' })}
                          </div>
                          <div className="text-lg font-bold">
                            {new Date(event.date).getDate()}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-heading font-semibold text-lg mb-1">
                            {event.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <Badge variant="outline" className="text-xs">
                              {event.type}
                            </Badge>
                            <span>{event.location}</span>
                          </div>
                          <Button variant="ghost" size="sm" className="text-primary hover:bg-primary hover:text-white">
                            Learn More
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Newsletter Signup */}
              <Card className="mt-8 border-0 shadow-medium bg-gradient-primary text-white">
                <CardContent className="p-6 text-center">
                  <h3 className="font-heading font-bold text-xl mb-3">
                    Stay Updated
                  </h3>
                  <p className="text-white/90 mb-4">
                    Get the latest resources and insights delivered to your inbox
                  </p>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Enter your email" 
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                    <Button variant="cta" className="bg-white text-primary hover:bg-white/90">
                      Subscribe
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}