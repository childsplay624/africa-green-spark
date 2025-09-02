import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { TrendingUp, Zap, Users, Globe, Target, ArrowRight } from "lucide-react";
import { Counter } from "./ui/counter";
import { useEffect, useState } from "react";

const stats = [
  {
    icon: Zap,
    label: "Clean Energy Projects",
    value: 125,
    suffix: "+",
    description: "Active renewable energy initiatives across Africa",
    color: "text-primary",
  },
  {
    icon: Users,
    label: "Lives Impacted",
    value: 2.5,
    suffix: "M+",
    description: "People benefiting from our sustainability programs",
    color: "text-secondary",
  },
  {
    icon: Globe,
    label: "Countries Reached",
    value: 28,
    description: "African nations with active AE&SC programs",
    color: "text-accent",
  },
  {
    icon: Target,
    label: "SDG Targets",
    value: 15,
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

const AnimatedProgress = ({ value, className = "" }: { value: number; className?: string }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(value);
    }, 100); // Small delay to ensure the component is mounted
    
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="w-full">
      <Progress value={progress} className={`h-2 transition-all duration-1000 ease-out ${className}`} />
    </div>
  );
};

export function ImpactStatsSection() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Image with Parallax */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-110"
          style={{
            backgroundImage: 'url(https://www.unescap.org/sites/default/d8files/2020-06/iStock-518613574-3_cr.png)',
            backgroundAttachment: 'fixed',
            willChange: 'transform',
            transition: 'transform 0.3s ease-out'
          }}
          onMouseMove={(e) => {
            const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
            const x = (e.clientX - left) / width;
            const y = (e.clientY - top) / height;
            const moveX = (x - 0.5) * 20;
            const moveY = (y - 0.5) * 20;
            e.currentTarget.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.1)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateZ(0) scale(1.1)';
          }}
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    <Counter value={stat.value} suffix={stat.suffix} />
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
                      <span className="font-medium text-primary">
                        <Counter value={milestone.progress} suffix="%" duration={1500} />
                      </span>
                    </div>
                    <AnimatedProgress value={milestone.progress} />
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