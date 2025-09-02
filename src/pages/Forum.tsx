import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AnimatedSection } from "@/hooks/use-scroll-animation";
import { 
  MessageCircle, 
  ThumbsUp, 
  ThumbsDown,
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

// Simulated forum data
const forumCategories = [
  { id: 'renewable', name: 'Renewable Energy', posts: 45, color: 'bg-secondary' },
  { id: 'policy', name: 'Policy & Regulation', posts: 32, color: 'bg-primary' },
  { id: 'innovation', name: 'Technology Innovation', posts: 28, color: 'bg-accent' },
  { id: 'funding', name: 'Investment & Funding', posts: 23, color: 'bg-earth' },
  { id: 'sustainability', name: 'Sustainability', posts: 38, color: 'bg-secondary' },
];

const discussions = [
  {
    id: 1,
    title: "Solar Energy Potential in West Africa: Opportunities and Challenges",
    category: "renewable",
    author: "Dr. Amina Hassan",
    avatar: "/placeholder.svg",
    time: "2 hours ago",
    replies: 12,
    likes: 24,
    views: 156,
    excerpt: "Exploring the vast solar energy potential across West African countries and discussing key challenges in implementation...",
    tags: ["solar", "west-africa", "policy"],
    trending: true
  },
  {
    id: 2,
    title: "Green Bonds: Financing Africa's Clean Energy Transition",
    category: "funding",
    author: "Michael Okafor",
    avatar: "/placeholder.svg",
    time: "5 hours ago",
    replies: 8,
    likes: 31,
    views: 203,
    excerpt: "Discussing the role of green bonds in mobilizing capital for renewable energy projects across the continent...",
    tags: ["green-bonds", "financing", "clean-energy"]
  },
  {
    id: 3,
    title: "Community-Based Energy Solutions: Lessons from Kenya",
    category: "innovation",
    author: "Sarah Mwangi",
    avatar: "/placeholder.svg",
    time: "1 day ago",
    replies: 15,
    likes: 42,
    views: 287,
    excerpt: "Sharing insights from successful community-driven renewable energy projects in rural Kenya...",
    tags: ["community", "kenya", "rural-energy"]
  },
  {
    id: 4,
    title: "Carbon Credits and African Markets: Creating Value",
    category: "sustainability",
    author: "Prof. James Adebayo",
    avatar: "/placeholder.svg",
    time: "2 days ago",
    replies: 19,
    likes: 38,
    views: 342,
    excerpt: "Analyzing opportunities for African countries to benefit from carbon credit markets...",
    tags: ["carbon-credits", "markets", "climate"]
  }
];

const replies = [
  {
    id: 1,
    author: "Energy Analyst",
    avatar: "/placeholder.svg",
    time: "1 hour ago",
    content: "Great analysis! I'd like to add that government policy frameworks will be crucial for scaling solar adoption. What are your thoughts on feed-in tariffs?",
    likes: 5
  },
  {
    id: 2,
    author: "Solar Engineer",
    avatar: "/placeholder.svg",
    time: "30 minutes ago",
    content: "The technical challenges around grid integration are also worth discussing. Modern inverter technology is making a big difference.",
    likes: 3
  }
];

export default function Forum() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showNewPost, setShowNewPost] = useState(false);

  const filteredDiscussions = discussions.filter(discussion => {
    const matchesSearch = discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         discussion.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || discussion.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <AnimatedSection animation="fade-in">
        <section className="py-20 bg-gradient-primary african-pattern">
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
              onClick={() => setShowNewPost(true)}
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {forumCategories.map((category, index) => (
                <AnimatedSection key={category.id} animation="scale-in" delay={index * 100}>
                  <Card 
                    className={`cursor-pointer transition-all duration-300 hover:shadow-medium ${
                      selectedCategory === category.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-heading font-semibold text-sm mb-2">{category.name}</h3>
                      <p className="text-xs text-muted-foreground">{category.posts} discussions</p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
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
              {filteredDiscussions.map((discussion, index) => (
                <AnimatedSection key={discussion.id} animation="fade-up" delay={index * 100}>
                  <Card className="hover:shadow-medium transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={discussion.avatar} />
                          <AvatarFallback>{discussion.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-heading font-semibold mb-1 hover:text-primary cursor-pointer">
                                {discussion.title}
                                {discussion.trending && (
                                  <Badge variant="secondary" className="ml-2">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    Trending
                                  </Badge>
                                )}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>by {discussion.author}</span>
                                <span>•</span>
                                <Clock className="w-4 h-4" />
                                <span>{discussion.time}</span>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-muted-foreground mb-4 leading-relaxed">
                            {discussion.excerpt}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {discussion.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MessageCircle className="w-4 h-4" />
                                <span>{discussion.replies} replies</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                <span>{discussion.views} views</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <ThumbsUp className="w-4 h-4 mr-1" />
                                {discussion.likes}
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Reply className="w-4 h-4 mr-1" />
                                Reply
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Share2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </TabsContent>

            <TabsContent value="trending">
              <div className="space-y-6">
                {discussions.filter(d => d.trending).map((discussion, index) => (
                  <AnimatedSection key={discussion.id} animation="fade-up" delay={index * 100}>
                    <Card className="hover:shadow-medium transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <TrendingUp className="w-5 h-5 text-secondary" />
                          <Badge variant="secondary">Trending Discussion</Badge>
                        </div>
                        <h3 className="text-lg font-heading font-semibold mb-2">{discussion.title}</h3>
                        <p className="text-muted-foreground mb-4">{discussion.excerpt}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">by {discussion.author}</span>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>{discussion.replies} replies</span>
                            <span>{discussion.likes} likes</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </AnimatedSection>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="recent">
              <div className="space-y-6">
                {discussions.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).map((discussion, index) => (
                  <AnimatedSection key={discussion.id} animation="fade-up" delay={index * 100}>
                    <Card className="hover:shadow-medium transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-heading font-semibold">{discussion.title}</h3>
                          <Badge variant="outline">{discussion.time}</Badge>
                        </div>
                        <p className="text-muted-foreground mb-4">{discussion.excerpt}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">by {discussion.author}</span>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>{discussion.replies} replies</span>
                            <span>{discussion.views} views</span>
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

      {/* Sample Discussion Thread */}
      <AnimatedSection animation="fade-up">
        <section className="py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-heading font-bold mb-8">Recent Replies</h3>
            <div className="space-y-4">
              {replies.map((reply, index) => (
                <AnimatedSection key={reply.id} animation="slide-in" delay={index * 150}>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={reply.avatar} />
                          <AvatarFallback>{reply.author[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-sm">{reply.author}</span>
                            <span className="text-xs text-muted-foreground">{reply.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{reply.content}</p>
                          <Button variant="ghost" size="sm">
                            <ThumbsUp className="w-3 h-3 mr-1" />
                            {reply.likes}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
}