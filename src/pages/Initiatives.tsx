import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Lightbulb, 
  Users, 
  Target, 
  Briefcase, 
  ArrowRight, 
  CheckCircle,
  Leaf,
  Zap,
  Globe,
  Handshake
} from "lucide-react";

const keyInitiatives = [
  {
    icon: Lightbulb,
    title: "Co-creation of Strategies",
    description: "Collaborative development of sustainable energy strategies with stakeholders across the continent.",
    features: [
      "Multi-stakeholder workshops",
      "Policy framework development", 
      "Strategic roadmap creation",
      "Implementation planning"
    ],
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Zap,
    title: "Technology & Innovation Support",
    description: "Advancing clean energy technologies through research, development, and deployment initiatives.",
    features: [
      "Technology assessment",
      "Innovation labs",
      "Pilot project support",
      "Knowledge transfer"
    ],
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: Briefcase,
    title: "Investor Engagement",
    description: "Connecting sustainable energy projects with funding sources and investment opportunities.",
    features: [
      "Investment facilitation",
      "Project packaging",
      "Due diligence support",
      "Risk assessment"
    ],
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Globe,
    title: "Climate Advocacy & Policy Alignment",
    description: "Promoting policy frameworks that support Africa's climate goals and energy transition.",
    features: [
      "Policy advocacy",
      "Regulatory support",
      "Climate alignment",
      "International cooperation"
    ],
    color: "text-earth",
    bgColor: "bg-earth/10",
  },
];

const focusAreas = [
  {
    title: "Clean Energy Deployment",
    description: "Large-scale renewable energy projects",
    projects: "45+ Active Projects",
    status: "Expanding",
  },
  {
    title: "Energy Access Programs", 
    description: "Rural and urban electrification initiatives",
    projects: "32+ Communities",
    status: "Growing",
  },
  {
    title: "Capacity Building",
    description: "Training and skills development programs",
    projects: "15+ Training Centers",
    status: "Scaling",
  },
  {
    title: "Research & Development",
    description: "Innovation in sustainable energy solutions",
    projects: "8+ Research Labs",
    status: "Active",
  },
];

export default function Initiatives() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-primary african-pattern">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6 animate-fade-in">
            Our{" "}
            <span className="text-accent">
              Key Initiatives
            </span>
          </h1>
          <p className="text-xl leading-relaxed animate-fade-in delay-200">
            Strategic programs driving Africa's energy transition through innovation, 
            collaboration, and sustainable development.
          </p>
        </div>
      </section>

      {/* Key Initiatives */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
              Strategic Focus Areas
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Four core initiatives that form the foundation of our work across the continent
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {keyInitiatives.map((initiative, index) => {
              const Icon = initiative.icon;
              return (
                <Card 
                  key={initiative.title}
                  className="group hover:shadow-strong transition-all duration-300 border-0 shadow-medium"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <CardHeader>
                    <div className={`w-16 h-16 ${initiative.bgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-8 w-8 ${initiative.color}`} />
                    </div>
                    <CardTitle className="text-2xl font-heading font-bold">
                      {initiative.title}
                    </CardTitle>
                    <CardDescription className="text-lg leading-relaxed">
                      {initiative.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      {initiative.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Focus Areas */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
              Implementation Focus
            </h2>
            <p className="text-xl text-muted-foreground">
              Where we're making the biggest impact across Africa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {focusAreas.map((area, index) => (
              <Card 
                key={area.title}
                className="text-center hover:shadow-medium transition-all duration-300 transform hover:scale-105 border-0 shadow-soft"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <h3 className="font-heading font-semibold text-lg mb-3">
                    {area.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {area.description}
                  </p>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-primary">
                      {area.projects}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {area.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Highlights */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-heading font-bold text-foreground mb-8">
            Measurable Impact
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-4xl font-heading font-bold text-primary mb-2">
                850MW
              </div>
              <p className="text-muted-foreground">
                Clean energy capacity facilitated
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-heading font-bold text-secondary mb-2">
                2.1M
              </div>
              <p className="text-muted-foreground">
                People with improved energy access
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-heading font-bold text-accent mb-2">
                $750M
              </div>
              <p className="text-muted-foreground">
                Investment mobilized for projects
              </p>
            </div>
          </div>

          <div className="bg-gradient-primary rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-heading font-bold mb-4">
              Partner With Our Initiatives
            </h3>
            <p className="text-lg leading-relaxed mb-6 text-white/90">
              Join us in driving Africa's energy transition. Together, we can create 
              lasting impact across the continent.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="cta" size="lg" asChild>
                <Link to="/partnerships">
                  Partnership Opportunities
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                asChild
              >
                <Link to="/contact">Get Involved</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}