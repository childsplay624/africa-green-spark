import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
  Handshake,
  FileText,
  Rocket,
  DollarSign,
  GraduationCap
} from "lucide-react";

const keyInitiatives = [
  {
    icon: Lightbulb,
    title: "Co-create Future-Fit Strategies",
    description: "The AE&SC works collaboratively with governments, private sector players, research institutions, and civil society to design forward-looking energy and sustainability strategies. By co-creating these frameworks, the consortium ensures that energy transition plans are locally relevant yet globally competitive, integrating innovation, data-driven insights, and inclusive policy design to secure Africa's sustainable energy future.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Target,
    title: "Support Effective Implementation",
    description: "Beyond strategy development, AE&SC provides hands-on technical, policy, and operational support to ensure that sustainability initiatives move from planning to measurable results. This involves developing implementation roadmaps, monitoring frameworks, and capacity-building programs that strengthen institutions and project teams. AE&SC acts as an implementation partner bridging the gap between vision and execution to accelerate energy transition outcomes.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: FileText,
    title: "Provide Strategic Advice on Key Issues",
    description: "AE&SC serves as a trusted advisor to governments, corporations, and development agencies on pressing issues such as energy transition policy, carbon management, renewable integration, and ESG compliance. The consortium leverages deep sector expertise and data insights to shape evidence-based recommendations, enabling stakeholders to make informed decisions that balance energy security, sustainability, and economic growth.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Handshake,
    title: "Convene Multi-Stakeholder Collaborations",
    description: "Recognizing that sustainability challenges are interconnected, AE&SC functions as a neutral convening platform that brings together stakeholders from government, academia, industry, finance, and civil society. Through forums, roundtables, and collaborative projects, AE&SC fosters dialogue, aligns priorities, and facilitates joint initiatives that unlock innovation and shared value across the energy ecosystem.",
    color: "text-earth",
    bgColor: "bg-earth/10",
  },
  {
    icon: Rocket,
    title: "Provide Platform for Emerging Technologies to Enter Nigeria",
    description: "AE&SC offers a landing platform for clean and emerging energy technologies such as green hydrogen, smart grids, carbon capture, and digital energy management tools to gain access to the Nigerian and wider African market. The consortium creates pathways for technology validation, regulatory alignment, and pilot deployment, serving as a bridge between innovators and local stakeholders to ensure successful adoption and scale-up.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: DollarSign,
    title: "Bring Investors and Financiers to Accelerate Sustainable Energy Transition in Africa",
    description: "To unlock Africa's vast energy potential, AE&SC actively engages investors, financiers, and development partners to mobilize capital for sustainable energy projects. By curating bankable projects, facilitating public–private partnerships, and providing investment readiness support, the consortium helps attract both domestic and international funding that drives renewable energy expansion and decarbonization initiatives.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: GraduationCap,
    title: "Equipping People to Drive the Change",
    description: "AE&SC believes people are the engine of Africa's sustainability transition. The consortium invests in capacity building, leadership development, and technical training to empower energy professionals, policymakers, and community leaders. Through targeted programs, AE&SC nurtures a generation of skilled, sustainability-minded changemakers capable of leading the continent's transition toward cleaner, inclusive, and resilient energy systems.",
    color: "text-accent",
    bgColor: "bg-accent/10",
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
  const [heroData, setHeroData] = useState<any>(null);
  const [initiatives, setInitiatives] = useState<any[]>([]);
  const [pageContent, setPageContent] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [heroResult, initiativesResult, contentResult] = await Promise.all([
      supabase.from('cms_hero_sections').select('*').eq('page', 'initiatives').eq('is_active', true).maybeSingle(),
      supabase.from('cms_initiatives').select('*').eq('is_active', true).order('display_order'),
      supabase.from('cms_page_content').select('*').eq('page_slug', 'initiatives').eq('is_published', true).maybeSingle()
    ]);
    
    if (heroResult.data) setHeroData(heroResult.data);
    if (initiativesResult.data) setInitiatives(initiativesResult.data);
    if (contentResult.data) setPageContent(contentResult.data.content);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-primary african-pattern">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6 animate-fade-in">
            {heroData?.title || "Our Key Initiatives"}
          </h1>
          <p className="text-xl leading-relaxed animate-fade-in delay-200">
            {heroData?.subtitle || pageContent?.subtitle || "Strategic programs driving Africa's energy transition through innovation, collaboration, and sustainable development."}
          </p>
        </div>
      </section>

      {/* Key Initiatives */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
              Our Seven Key Initiatives
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive programs that drive Africa's energy transition through collaboration, innovation, and sustainable development
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {(pageContent?.keyInitiatives || keyInitiatives).map((initiative: any, index: number) => {
              const iconName = typeof initiative.icon === 'string' ? initiative.icon : 'Lightbulb';
              let Icon = Lightbulb;
              if (iconName === 'Lightbulb') Icon = Lightbulb;
              if (iconName === 'Target') Icon = Target;
              if (iconName === 'FileText') Icon = FileText;
              if (iconName === 'Handshake') Icon = Handshake;
              if (iconName === 'Rocket') Icon = Rocket;
              if (iconName === 'DollarSign') Icon = DollarSign;
              if (iconName === 'GraduationCap') Icon = GraduationCap;
              if (iconName === 'Zap') Icon = Zap;
              if (iconName === 'Briefcase') Icon = Briefcase;
              if (iconName === 'Globe') Icon = Globe;
              
              return (
                <Card 
                  key={initiative.title}
                  className="group hover:shadow-strong transition-all duration-300 border-0 shadow-medium animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
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
            {(pageContent?.focusAreas || focusAreas).map((area: any, index: number) => (
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
            {(pageContent?.impact?.stats || [
              {value: "850MW", label: "Clean energy capacity facilitated"},
              {value: "2.1M", label: "People with improved energy access"},
              {value: "$750M", label: "Investment mobilized for projects"}
            ]).map((stat: any, idx: number) => (
              <div key={idx} className="text-center">
                <div className={`text-4xl font-heading font-bold mb-2 ${idx === 0 ? 'text-primary' : idx === 1 ? 'text-secondary' : 'text-accent'}`}>
                  {stat.value}
                </div>
                <p className="text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
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