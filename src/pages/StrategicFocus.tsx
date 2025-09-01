import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { 
  Leaf, 
  Zap, 
  Building, 
  Recycle, 
  Lightbulb, 
  Target,
  ArrowRight,
  TrendingUp,
  Globe,
  Factory
} from "lucide-react";

const focusAreas = [
  {
    icon: Leaf,
    title: "Sustainable Energy",
    subtitle: "Renewable Power Generation",
    description: "Advancing solar, wind, hydro, and biomass energy solutions across Africa with focus on grid integration and energy storage.",
    initiatives: [
      "Large-scale solar installations",
      "Wind energy development",
      "Hydroelectric projects",
      "Biomass and biogas systems"
    ],
    progress: 75,
    investment: "$2.3B",
    projects: "85+ Projects",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Zap,
    title: "Oil & Gas Transition",
    subtitle: "Clean Energy Integration", 
    description: "Supporting traditional energy sectors in adopting cleaner technologies and transitioning to sustainable operations.",
    initiatives: [
      "Carbon capture technologies",
      "Natural gas optimization",
      "Renewable energy integration",
      "Green hydrogen production"
    ],
    progress: 60,
    investment: "$1.8B",
    projects: "42+ Projects",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: Building,
    title: "Agriculture & Infrastructure",
    subtitle: "Smart Agricultural Systems",
    description: "Developing climate-smart agriculture and sustainable infrastructure that supports food security and economic growth.",
    initiatives: [
      "Solar-powered irrigation",
      "Smart farming technologies",
      "Cold storage solutions",
      "Rural electrification"
    ],
    progress: 68,
    investment: "$950M",
    projects: "120+ Projects",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Recycle,
    title: "Carbon Offsetting",
    subtitle: "Climate Action Programs",
    description: "Implementing large-scale carbon sequestration and offset programs to support Africa's climate commitments.",
    initiatives: [
      "Reforestation projects",
      "Carbon credit development",
      "Wetland restoration",
      "Sustainable land management"
    ],
    progress: 55,
    investment: "$680M",
    projects: "65+ Projects",
    color: "text-earth",
    bgColor: "bg-earth/10",
  },
  {
    icon: Factory,
    title: "Circular Economy",
    subtitle: "Waste-to-Value Systems",
    description: "Creating circular economy models that transform waste into valuable resources while reducing environmental impact.",
    initiatives: [
      "Waste-to-energy plants",
      "Recycling technologies",
      "Industrial symbiosis",
      "Sustainable manufacturing"
    ],
    progress: 45,
    investment: "$420M",
    projects: "35+ Projects",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Lightbulb,
    title: "Energy Innovation",
    subtitle: "Technology Development",
    description: "Fostering innovation in energy technologies through research, development, and deployment of cutting-edge solutions.",
    initiatives: [
      "Energy storage systems",
      "Smart grid technologies",
      "IoT energy management",
      "AI-powered optimization"
    ],
    progress: 70,
    investment: "$340M",
    projects: "28+ Projects",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
];

const agenda2063Aspirations = [
  {
    number: "1",
    title: "Prosperous Africa",
    description: "Economic transformation and inclusive growth",
    status: "In Progress",
  },
  {
    number: "2", 
    title: "Integrated Continent",
    description: "Political unity and regional integration",
    status: "Active",
  },
  {
    number: "3",
    title: "Good Governance",
    description: "Democratic values and institutions",
    status: "Supporting",
  },
  {
    number: "4",
    title: "Peaceful & Secure",
    description: "Conflict prevention and peace building",
    status: "Contributing",
  },
  {
    number: "5",
    title: "Strong Cultural Identity",
    description: "African values and heritage",
    status: "Promoting",
  },
  {
    number: "6",
    title: "People-Driven",
    description: "Youth and women empowerment",
    status: "Advancing",
  },
  {
    number: "7",
    title: "Global Powerhouse",
    description: "Influential global partner",
    status: "Building",
  },
];

export default function StrategicFocus() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero african-pattern">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6 animate-fade-in">
            Strategic{" "}
            <span className="text-accent">
              Focus Areas
            </span>
          </h1>
          <p className="text-xl leading-relaxed animate-fade-in delay-200">
            Six pillars driving Africa's comprehensive approach to sustainable development 
            and energy transformation.
          </p>
        </div>
      </section>

      {/* Focus Areas Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
              Six Pillars of Transformation
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive strategies addressing every aspect of Africa's sustainable future
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {focusAreas.map((area, index) => {
              const Icon = area.icon;
              return (
                <Card 
                  key={area.title}
                  className="group hover:shadow-strong transition-all duration-300 border-0 shadow-medium"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 ${area.bgColor} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <Icon className={`h-8 w-8 ${area.color}`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl font-heading font-bold mb-1">
                          {area.title}
                        </CardTitle>
                        <div className="text-sm font-medium text-primary mb-3">
                          {area.subtitle}
                        </div>
                        <CardDescription className="text-base leading-relaxed">
                          {area.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* Initiatives */}
                    <div>
                      <h4 className="font-semibold mb-3">Key Initiatives:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {area.initiatives.map((initiative) => (
                          <div key={initiative} className="text-sm text-muted-foreground">
                            • {initiative}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Progress and Stats */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Implementation Progress</span>
                          <span className="font-medium text-primary">{area.progress}%</span>
                        </div>
                        <Progress value={area.progress} className="h-2" />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-center">
                          <div className="text-lg font-bold text-primary">{area.investment}</div>
                          <div className="text-xs text-muted-foreground">Investment</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-secondary">{area.projects}</div>
                          <div className="text-xs text-muted-foreground">Active</div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Growing
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Agenda 2063 Aspirations */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
              Agenda 2063 Aspirations
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Aligning our strategic focus with Africa's long-term development goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {agenda2063Aspirations.map((aspiration, index) => (
              <Card 
                key={aspiration.number}
                className="text-center hover:shadow-medium transition-all duration-300 transform hover:scale-105 border-0 shadow-soft"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-heading font-bold text-lg">
                      {aspiration.number}
                    </span>
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">
                    {aspiration.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                    {aspiration.description}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {aspiration.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary african-pattern">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <Target className="h-16 w-16 mx-auto mb-6 text-accent animate-float" />
          <h2 className="text-4xl font-heading font-bold mb-6">
            Accelerate Africa's Transformation
          </h2>
          <p className="text-xl leading-relaxed mb-8 text-white/90">
            Our strategic focus areas provide the roadmap for Africa's sustainable future. 
            Partner with us to drive meaningful change across the continent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="cta" size="lg" asChild>
              <Link to="/partnerships">
                Strategic Partnerships
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              asChild
            >
              <Link to="/initiatives">View Initiatives</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}