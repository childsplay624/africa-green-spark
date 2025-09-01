import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const news = [
  {
    title: "Africa's Renewable Energy Capacity Reaches New Milestone",
    excerpt: "Continental solar and wind installations surge 45% in 2024, marking significant progress toward energy independence.",
    date: "2024-12-15",
    category: "Clean Energy",
    readTime: "4 min read",
    image: "bg-gradient-to-r from-primary to-secondary",
  },
  {
    title: "Strategic Partnership with African Development Bank",
    excerpt: "New $500M initiative to accelerate sustainable infrastructure projects across 12 African nations.",
    date: "2024-12-10",
    category: "Partnerships", 
    readTime: "6 min read",
    image: "bg-gradient-to-r from-secondary to-accent",
  },
  {
    title: "Circular Economy Models Show 300% ROI in Pilot Programs",
    excerpt: "Waste-to-energy projects in Nigeria and Kenya demonstrate scalable solutions for urban sustainability.",
    date: "2024-12-05",
    category: "Innovation",
    readTime: "5 min read", 
    image: "bg-gradient-to-r from-accent to-earth",
  },
];

const insights = [
  {
    title: "The Economics of Africa's Energy Transition",
    description: "Comprehensive analysis of investment opportunities and economic impact of sustainable energy adoption across the continent.",
    type: "Research Report",
    downloads: "2.3K",
  },
  {
    title: "Policy Framework for Sustainable Development",
    description: "Strategic recommendations for governments implementing Agenda 2063 sustainability goals.",
    type: "Policy Brief",
    downloads: "1.8K",
  },
  {
    title: "Technology Innovation in African Markets",
    description: "Case studies on successful clean energy technology implementations and lessons learned.",
    type: "Case Study",
    downloads: "3.1K",
  },
];

export function NewsInsightsSection() {
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
              <Link to="/resources">
                View All News
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((article, index) => (
              <Card 
                key={article.title}
                className="group hover:shadow-medium transition-all duration-300 transform hover:scale-105 border-0 shadow-soft overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`h-32 ${article.image} relative`}>
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 text-primary text-xs font-medium px-2 py-1 rounded-full">
                      {article.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="font-heading font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(article.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {article.readTime}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Insights Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-heading font-semibold text-foreground">
              Research & Insights
            </h3>
            <Button variant="outline" asChild>
              <Link to="/resources">
                Browse Resources
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {insights.map((insight, index) => (
              <Card 
                key={insight.title}
                className="group hover:shadow-medium transition-all duration-300 border-0 shadow-soft bg-gradient-subtle"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                      {insight.type}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {insight.downloads} downloads
                    </span>
                  </div>
                  <CardTitle className="font-heading font-semibold text-lg group-hover:text-primary transition-colors">
                    {insight.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed mb-4">
                    {insight.description}
                  </CardDescription>
                  <Button variant="ghost" size="sm" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                    Download Report
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}