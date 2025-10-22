import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
  Factory,
  Droplet,
  Sprout,
  MapPin,
  Trees,
  Handshake,
  Mountain,
  Shield,
  Waves,
  Wind,
  Bird
} from "lucide-react";
import strategicHero from "@/assets/strategic-hero.jpg";

const focusAreas = [
  {
    icon: Droplet,
    title: "Sustainable Energy and Petroleum Resources",
    description: "AE&SC seeks to advance a balanced and sustainable approach to Africa's energy mix integrating renewable energy expansion with the responsible management of petroleum resources. This focus area promotes cleaner extraction practices, energy efficiency, and the gradual decarbonization of fossil-based operations through technology adoption, emissions monitoring, and policy reform. The goal is to ensure that Africa's oil and gas wealth is leveraged to fund and facilitate the transition toward renewable energy systems that deliver inclusive, long-term energy security.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Sprout,
    title: "Sustainable Agriculture",
    description: "Recognizing agriculture's central role in Africa's economy and emissions profile, AE&SC promotes climate-smart and energy-efficient agricultural systems. This involves advancing renewable-powered irrigation, bioenergy from agricultural waste, and low-carbon food production techniques that enhance resilience and food security. By connecting farmers to sustainable technologies and green finance, AE&SC supports a transformation that makes agriculture both profitable and environmentally responsible, reducing rural poverty while protecting natural ecosystems.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: Building,
    title: "Sustainable Infrastructure",
    description: "AE&SC drives the development of green, resilient, and inclusive infrastructure that underpins Africa's sustainability agenda. This includes promoting energy-efficient buildings, low-emission transport systems, climate-resilient urban planning, and smart infrastructure networks. Through partnerships with governments, investors, and technology providers, the consortium facilitates infrastructure projects that support sustainable cities and communities, reduce environmental impact, and enable economic growth in line with Africa's industrialization goals.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Target,
    title: "Decarbonization Pathways",
    description: "AE&SC supports governments and industries in defining clear, data-driven decarbonization pathways aligned with net-zero commitments and the Paris Agreement. This entails mapping out practical steps to reduce greenhouse gas emissions from energy system reforms and industrial process optimization to carbon capture and storage (CCS) and renewable energy integration. The focus is on designing context-specific transition frameworks that protect livelihoods while advancing Africa's role in the global low-carbon economy.",
    color: "text-earth",
    bgColor: "bg-earth/10",
  },
  {
    icon: Trees,
    title: "Carbon Offsetting Projects",
    description: "AE&SC promotes the development of high-integrity carbon offset projects that generate measurable environmental and socio-economic value. These include reforestation, clean cookstove distribution, renewable electrification, and waste-to-energy initiatives that reduce emissions and create community benefits. The consortium ensures projects meet international standards (such as Verra and Gold Standard) while facilitating carbon credit trading mechanisms that attract climate finance into Africa.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Recycle,
    title: "Circular Economy Integration",
    description: "AE&SC works to embed circular economy principles across industries encouraging waste reduction, resource recovery, and product lifecycle innovation. This focus promotes initiatives such as recycling and upcycling programs, industrial symbiosis, and sustainable materials management. By shifting from a linear \"take–make–dispose\" model to a circular one, AE&SC helps industries unlock efficiency gains, reduce pollution, and create green jobs across the value chain.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: Lightbulb,
    title: "Energy Innovations",
    description: "AE&SC serves as a catalyst for technological advancement and innovation in the energy sector. The consortium facilitates the introduction and localization of emerging technologies such as green hydrogen, smart grids, energy storage, digital twins, and AI-driven energy management systems. By providing a platform for pilots, partnerships, and knowledge sharing, AE&SC accelerates the adoption of cutting-edge solutions that enhance reliability, affordability, and sustainability in Africa's energy landscape.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Handshake,
    title: "Collaborative Partnership",
    description: "At the heart of AE&SC's mission is collaboration. The consortium acts as a strategic convening hub, uniting governments, private sector leaders, financial institutions, academia, and development partners. AE&SC drives joint initiatives, harmonizes policy efforts, and pools resources to maximize collective impact. This collaborative model ensures that Africa's sustainability transition is not fragmented but coordinated, inclusive, and anchored on shared responsibility.",
    color: "text-earth",
    bgColor: "bg-earth/10",
  },
];

const agenda2063Deliverables = [
  {
    number: "1",
    icon: Mountain,
    title: "Sustainable Natural Resource Management",
    description: "Africa's vast natural resources are managed responsibly, equitably, and transparently to support long-term development while preventing exploitation and promoting inclusive growth.",
    color: "text-primary",
  },
  {
    number: "2",
    icon: Shield,
    title: "Climate Resilience",
    description: "Building adaptive capacity through climate-smart agriculture, resilient infrastructure, and early-warning systems that strengthen Africa's ability to withstand climate shocks.",
    color: "text-secondary",
  },
  {
    number: "3",
    icon: Factory,
    title: "Green Industrialization",
    description: "Sustainable, low-carbon industries creating jobs without degrading the environment through clean manufacturing and renewable-powered production systems.",
    color: "text-accent",
  },
  {
    number: "4",
    icon: Trees,
    title: "Afforestation & Land Restoration",
    description: "Large-scale reforestation and land restoration programs combating deforestation and desertification while creating green jobs and restoring biodiversity.",
    color: "text-earth",
  },
  {
    number: "5",
    icon: Recycle,
    title: "Circular and Cross Economy",
    description: "Replacing linear models with circular approaches focused on reuse, recycling, and regeneration while fostering cross-sector resource efficiency.",
    color: "text-primary",
  },
  {
    number: "6",
    icon: Waves,
    title: "Blue Economy Development",
    description: "Responsible use of marine and freshwater resources for fisheries, shipping, renewable ocean energy, and coastal tourism while protecting ocean ecosystems.",
    color: "text-secondary",
  },
  {
    number: "7",
    icon: Bird,
    title: "Biodiversity Conservation",
    description: "Protection, restoration, and sustainable use of Africa's rich biodiversity through expanded protected areas and community-based conservation models.",
    color: "text-accent",
  },
  {
    number: "8",
    icon: Wind,
    title: "Reduction of Carbon Emissions",
    description: "Decisive shift toward low-carbon development through renewable energy, clean transport, and sustainable agriculture while participating in global carbon markets.",
    color: "text-earth",
  },
];

export default function StrategicFocus() {
  const [heroData, setHeroData] = useState<any>(null);
  const [pageContent, setPageContent] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [heroResult, contentResult] = await Promise.all([
      supabase.from('cms_hero_sections').select('*').eq('page', 'strategic-focus').eq('is_active', true).maybeSingle(),
      supabase.from('cms_page_content').select('*').eq('page_slug', 'strategic-focus').eq('is_published', true).maybeSingle()
    ]);
    
    if (heroResult.data) setHeroData(heroResult.data);
    if (contentResult.data) setPageContent(contentResult.data.content);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section 
        className="py-20 relative bg-cover bg-center bg-no-repeat african-pattern"
        style={{ backgroundImage: `linear-gradient(rgba(19, 50, 44, 0.8), rgba(19, 50, 44, 0.8)), url(${strategicHero})` }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 animate-fade-in text-white">
            {heroData?.title || "Strategic Focus Areas"}
          </h1>
          <p className="text-xl leading-relaxed animate-fade-in delay-200">
            {heroData?.subtitle || pageContent?.subtitle || "Eight strategic pillars driving Africa's comprehensive approach to sustainable development and energy transformation."}
          </p>
        </div>
      </section>

      {/* Focus Areas Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
              Eight Strategic Pillars
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive strategies addressing every aspect of Africa's sustainable future
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {focusAreas.map((area: any, index: number) => {
              const iconName = typeof area.icon === 'string' ? area.icon : 'Leaf';
              let Icon = Leaf;
              if (iconName === 'Leaf') Icon = Leaf;
              if (iconName === 'Droplet') Icon = Droplet;
              if (iconName === 'Sprout') Icon = Sprout;
              if (iconName === 'Building') Icon = Building;
              if (iconName === 'Target') Icon = Target;
              if (iconName === 'Trees') Icon = Trees;
              if (iconName === 'Recycle') Icon = Recycle;
              if (iconName === 'Lightbulb') Icon = Lightbulb;
              if (iconName === 'Handshake') Icon = Handshake;
              
              return (
                <Card 
                  key={area.title}
                  className="group hover:shadow-strong transition-all duration-300 border-0 shadow-medium animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 ${area.bgColor} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <Icon className={`h-8 w-8 ${area.color}`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl font-heading font-bold mb-3">
                          {area.title}
                        </CardTitle>
                        <CardDescription className="text-base leading-relaxed">
                          {area.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Agenda 2063 Sustainability & Environmental Deliverables */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-primary text-white border-0">African Union Agenda 2063</Badge>
            <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
              Sustainability & Environmental Deliverables
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Eight critical deliverables driving Africa's environmental sustainability and climate action agenda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(pageContent?.agenda2063 || agenda2063Deliverables).map((deliverable: any, index: number) => {
              const Icon = deliverable.icon || Mountain;
              
              return (
                <Card 
                  key={deliverable.number}
                  className="group hover:shadow-strong transition-all duration-300 border-0 shadow-medium animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 ${deliverable.color === 'text-primary' ? 'bg-primary/10' : deliverable.color === 'text-secondary' ? 'bg-secondary/10' : deliverable.color === 'text-accent' ? 'bg-accent/10' : 'bg-earth/10'} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-7 w-7 ${deliverable.color}`} />
                    </div>
                    <div className="text-center mb-3">
                      <Badge variant="outline" className="text-xs font-semibold">
                        Deliverable {deliverable.number}
                      </Badge>
                    </div>
                    <h3 className="font-heading font-bold text-lg mb-3 text-center leading-tight">
                      {deliverable.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed text-center">
                      {deliverable.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
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