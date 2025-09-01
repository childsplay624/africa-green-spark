import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { TrendingUp, Zap, Users, Globe, Target, ArrowRight } from "lucide-react";

const stats = [
  {
    icon: Zap,
    label: "Clean Energy Projects",
    value: "125+",
    description: "Active renewable energy initiatives across Africa",
    color: "text-primary",
  },
  {
    icon: Users,
    label: "Lives Impacted",
    value: "2.5M+",
    description: "People benefiting from our sustainability programs",
    color: "text-secondary",
  },
  {
    icon: Globe,
    label: "Countries Reached",
    value: "28",
    description: "African nations with active AE&SC programs",
    color: "text-accent",
  },
  {
    icon: Target,
    label: "SDG Targets",
    value: "15",
    description: "UN Sustainable Development Goals directly addressed",
    color: "text-earth",
  },
];

const milestones = [
  {
    year: "2024",
    title: "Continental Expansion",
    description: "Launched operations in 8 new African countries",
    progress: 100,
  },
  {
    year: "2023",
    title: "Partnership Growth",
    description: "Established 25+ strategic partnerships",
    progress: 100,
  },
  {
    year: "2024",
    title: "Research Publications",
    description: "Published 12 major sustainability reports",
    progress: 85,
  },
  {
    year: "2025",
    title: "Investment Target",
    description: "Mobilize $1B in sustainable energy investments",
    progress: 35,
  },
];

export function ImpactStatsSection() {
  return (
    <section className="py-20 bg-gradient-subtle african-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Our{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Impact
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Measuring progress toward a sustainable Africa through tangible outcomes 
            and strategic milestones.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={stat.label}
                className="group hover:shadow-medium transition-all duration-300 transform hover:scale-105 border-0 shadow-soft text-center bg-white/80 backdrop-blur-sm"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className={`text-3xl md:text-4xl font-heading font-bold ${stat.color} mb-2`}>
                    {stat.value}
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">
                    {stat.label}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Milestones */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-heading font-bold text-center text-foreground mb-12">
            Key Milestones
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {milestones.map((milestone, index) => (
              <Card 
                key={`${milestone.year}-${milestone.title}`}
                className="border-0 shadow-medium hover:shadow-strong transition-shadow"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                      {milestone.year}
                    </span>
                    <TrendingUp className="h-5 w-5 text-accent" />
                  </div>
                  <CardTitle className="font-heading font-semibold text-lg">
                    {milestone.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {milestone.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium text-primary">{milestone.progress}%</span>
                    </div>
                    <Progress value={milestone.progress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Button variant="hero" size="lg" className="px-8 py-4" asChild>
            <Link to="/about">
              Learn About Our Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}