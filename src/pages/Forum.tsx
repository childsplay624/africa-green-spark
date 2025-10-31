import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { AnimatedSection } from "@/hooks/use-scroll-animation";
import { useForum } from "@/hooks/use-forum";
import { useForumLikes } from "@/hooks/use-forum-likes";
import { NewPostDialog } from "@/components/forum/new-post-dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { 
  MessageCircle, 
  ThumbsUp,
  Share2,
  Search,
  Filter,
  Plus,
  Users,
  Clock,
  TrendingUp,
  Eye,
  Reply
} from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import * as LucideIcons from "lucide-react";
import forumHero from "@/assets/forum-hero.jpg";

const categoryColors: Record<string, string> = {
  renewable: 'bg-secondary',
  policy: 'bg-primary',
  innovation: 'bg-accent',
  funding: 'bg-earth',
  sustainability: 'bg-secondary',
};

export default function Forum() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showNewPost, setShowNewPost] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { categories, posts, loading, loadPosts, createPost, incrementViews } = useForum();
  const { likedPosts, togglePostLike } = useForumLikes(user?.id);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    loadPosts(selectedCategory);
  }, [selectedCategory]);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
  };

  const handleCreatePost = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a discussion",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    setShowNewPost(true);
  };

  const handlePostClick = (postId: string) => {
    incrementViews(postId);
    navigate(`/forum/${postId}`);
  };

  const handleLikePost = async (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    const success = await togglePostLike(postId);
    if (success) {
      await loadPosts(selectedCategory);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const trendingPosts = filteredPosts
    .filter(post => {
      const createdAt = new Date(post.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return createdAt > weekAgo;
    })
    .sort((a, b) => (b.likes_count + b.views_count) - (a.likes_count + a.views_count))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <AnimatedSection animation="fade-in">
        <section 
          className="py-20 relative bg-cover bg-center bg-no-repeat african-pattern"
          style={{ backgroundImage: `linear-gradient(rgba(19, 50, 44, 0.8), rgba(19, 50, 44, 0.8)), url(${forumHero})` }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Community{" "}
              <span className="text-accent">
                Forum
              </span>
            </h1>
            <p className="text-xl leading-relaxed mb-8">
              Connect, discuss, and collaborate on Africa's energy transition with experts, 
              policymakers, and practitioners from across the continent.
            </p>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={handleCreatePost}
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20"
            >
              <Plus className="mr-2 h-5 w-5" />
              Start New Discussion
            </Button>
          </div>
        </section>
      </AnimatedSection>

      {/* Forum Categories */}
      <AnimatedSection animation="fade-up" delay={200}>
        <section className="py-16 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-heading font-bold text-center mb-12">Discussion Categories</h2>
            <Carousel className="w-full max-w-6xl mx-auto">
              <CarouselContent className="-ml-2 md:-ml-4">
                {categories.map((category, index) => {
                  const IconComponent = category.icon && (LucideIcons as any)[category.icon] 
                    ? (LucideIcons as any)[category.icon] 
                    : Users;
                  
                  return (
                    <CarouselItem key={category.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/5">
                      <AnimatedSection animation="scale-in" delay={index * 100}>
                        <Card 
                          className={`cursor-pointer transition-all duration-300 hover:shadow-medium ${
                            selectedCategory === category.category ? 'ring-2 ring-primary' : ''
                          }`}
                          onClick={() => setSelectedCategory(category.category)}
                        >
                          <CardContent className="p-4 text-center">
                            <div className={`w-12 h-12 ${categoryColors[category.category] || 'bg-primary'} rounded-full flex items-center justify-center mx-auto mb-3`}>
                              <IconComponent className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="font-heading font-semibold text-sm mb-2">{category.title}</h3>
                            <p className="text-xs text-muted-foreground">{category.posts_count} discussions</p>
                          </CardContent>
                        </Card>
                      </AnimatedSection>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious className="-left-12" />
              <CarouselNext className="-right-12" />
            </Carousel>
          </div>
        </section>
      </AnimatedSection>

      {/* Search and Filter */}
      <AnimatedSection animation="fade-up" delay={300}>
        <section className="py-8 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search discussions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={selectedCategory === "all" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setSelectedCategory("all")}
                >
                  All Categories
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="discussions" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="discussions">All Discussions</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="recent">Most Recent</TabsTrigger>
            </TabsList>

            <TabsContent value="discussions" className="space-y-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : filteredPosts.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">No discussions found. Be the first to start one!</p>
                    <Button className="mt-4" onClick={handleCreatePost}>
                      <Plus className="mr-2 h-4 w-4" />
                      Start Discussion
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredPosts.map((discussion, index) => (
                  <AnimatedSection key={discussion.id} animation="fade-up" delay={index * 100}>
                    <Card 
                      className="hover:shadow-medium transition-all duration-300 cursor-pointer"
                      onClick={() => handlePostClick(discussion.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={discussion.author?.avatar_url || undefined} />
                            <AvatarFallback>
                              {discussion.author?.full_name?.split(' ').map(n => n[0]).join('') || discussion.author?.email?.[0]?.toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-lg font-heading font-semibold mb-1 hover:text-primary">
                                  {discussion.title}
                                  {trendingPosts.some(p => p.id === discussion.id) && (
                                    <Badge variant="secondary" className="ml-2">
                                      <TrendingUp className="w-3 h-3 mr-1" />
                                      Trending
                                    </Badge>
                                  )}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <span>by {discussion.author?.full_name || discussion.author?.email || 'Anonymous'}</span>
                                  <span>•</span>
                                  <Clock className="w-4 h-4" />
                                  <span>{getTimeAgo(discussion.created_at)}</span>
                                </div>
                              </div>
                            </div>
                            
                            <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-3">
                              {discussion.content}
                            </p>
                            
                            {discussion.tags && discussion.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {discussion.tags.map(tag => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    #{tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <MessageCircle className="w-4 h-4" />
                                  <span>{discussion.replies_count} replies</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Eye className="w-4 h-4" />
                                  <span>{discussion.views_count} views</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={(e) => handleLikePost(e, discussion.id)}
                                  className={cn(likedPosts.has(discussion.id) && "text-primary")}
                                >
                                  <ThumbsUp className={cn("w-4 h-4 mr-1", likedPosts.has(discussion.id) && "fill-current")} />
                                  {discussion.likes_count}
                                </Button>
                                <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                                  <Reply className="w-4 h-4 mr-1" />
                                  Reply
                                </Button>
                                <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                                  <Share2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </AnimatedSection>
                ))
              )}
            </TabsContent>

            <TabsContent value="trending">
              <div className="space-y-6">
                {trendingPosts.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No trending discussions this week</p>
                    </CardContent>
                  </Card>
                ) : (
                  trendingPosts.map((discussion, index) => (
                    <AnimatedSection key={discussion.id} animation="fade-up" delay={index * 100}>
                      <Card 
                        className="hover:shadow-medium transition-all duration-300 cursor-pointer"
                        onClick={() => handlePostClick(discussion.id)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center gap-2 mb-3">
                            <TrendingUp className="w-5 h-5 text-secondary" />
                            <Badge variant="secondary">Trending Discussion</Badge>
                          </div>
                          <h3 className="text-lg font-heading font-semibold mb-2">{discussion.title}</h3>
                          <p className="text-muted-foreground mb-4 line-clamp-2">{discussion.content}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              by {discussion.author?.full_name || discussion.author?.email || 'Anonymous'}
                            </span>
                            <div className="flex gap-4 text-sm text-muted-foreground">
                              <span>{discussion.replies_count} replies</span>
                              <span>{discussion.likes_count} likes</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </AnimatedSection>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="recent">
              <div className="space-y-6">
                {filteredPosts.map((discussion, index) => (
                  <AnimatedSection key={discussion.id} animation="fade-up" delay={index * 100}>
                    <Card 
                      className="hover:shadow-medium transition-all duration-300 cursor-pointer"
                      onClick={() => handlePostClick(discussion.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-heading font-semibold">{discussion.title}</h3>
                          <Badge variant="outline">{getTimeAgo(discussion.created_at)}</Badge>
                        </div>
                        <p className="text-muted-foreground mb-4 line-clamp-2">{discussion.content}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            by {discussion.author.full_name || discussion.author.email}
                          </span>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>{discussion.replies_count} replies</span>
                            <span>{discussion.views_count} views</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </AnimatedSection>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* New Post Dialog */}
      <NewPostDialog
        open={showNewPost}
        onOpenChange={setShowNewPost}
        onSubmit={createPost}
        categories={categories}
      />
    </div>
  );
}