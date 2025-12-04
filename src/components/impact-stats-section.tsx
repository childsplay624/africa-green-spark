import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { TrendingUp, Zap, Users, Globe, Target, ArrowRight } from "lucide-react";
import { Counter } from "./ui/counter";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const { data } = await supabase
      .from("cms_impact_stats")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });
    
    if (data) setStats(data);
  };

  const getIconComponent = (iconName?: string) => {
    const iconMap: Record<string, any> = {
      Zap, Users, Globe, Target, TrendingUp
    };
    return iconMap[iconName || "Target"] || Target;
  };

  if (stats.length === 0) return null;

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
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
            Our Impact
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Measuring progress toward a sustainable Africa through tangible outcomes 
            and strategic milestones.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {stats.map((stat, index) => {
            const Icon = getIconComponent(stat.icon);
            return (
              <Card 
                key={stat.id}
                className="group hover:shadow-medium transition-all duration-300 transform hover:scale-105 border-0 shadow-soft text-center bg-white/80 backdrop-blur-sm"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <h3 className="font-heading font-semibold text-base sm:text-lg mb-2">
                    {stat.label}
                  </h3>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Milestones */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-heading font-bold text-center text-white mb-8 sm:mb-12">
            Key Milestones
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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