import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Handshake, 
  Building2, 
  GraduationCap, 
  Globe, 
  Users, 
  Target,
  ArrowRight,
  CheckCircle,
  Star,
  DollarSign,
  Loader2
} from "lucide-react";
import partnershipsHero from "@/assets/partnerships-hero.jpg";

const partnershipTypes = [
  {
    icon: Building2,
    title: "Government & Public Sector",
    description: "Strategic partnerships with national governments, ministries, and public institutions.",
    benefits: [
      "Policy advocacy support",
      "Regulatory framework development",
      "Capacity building programs",
      "Technical assistance"
    ],
    examples: "Energy Ministries, Development Agencies, Regional Bodies",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: GraduationCap,
    title: "Academic & Research",
    description: "Collaborative research partnerships with universities and research institutions.",
    benefits: [
      "Joint research projects",
      "Knowledge sharing platforms",
      "Student exchange programs",
      "Innovation labs"
    ],
    examples: "Universities, Research Centers, Think Tanks",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: Globe,
    title: "International Organizations",
    description: "Strategic alliances with global development organizations and multilateral institutions.",
    benefits: [
      "Funding opportunities",
      "Technical expertise",
      "Global network access",
      "Best practice sharing"
    ],
    examples: "UN Agencies, World Bank, AfDB, Development Partners",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Users,
    title: "Private Sector & NGOs",
    description: "Innovation partnerships with businesses, civil society, and development organizations.",
    benefits: [
      "Investment facilitation",
      "Technology transfer",
      "Market access",
      "Impact scaling"
    ],
    examples: "Energy Companies, Tech Firms, Impact Investors, NGOs",
    color: "text-earth",
    bgColor: "bg-earth/10",
  },
];

const partnershipLevels = [
  {
    level: "Strategic Partner",
    investment: "$1M+",
    duration: "3-5 Years",
    benefits: [
      "Board representation",
      "Co-branded initiatives",
      "Exclusive access to research",
      "Joint fundraising opportunities",
      "Strategic planning participation"
    ],
    icon: Star,
    color: "text-yellow-600",
  },
  {
    level: "Implementation Partner",
    investment: "$250K+",
    duration: "1-3 Years",
    benefits: [
      "Project co-implementation",
      "Technical collaboration",
      "Capacity building support",
      "Network access",
      "Knowledge sharing"
    ],
    icon: Target,
    color: "text-primary",
  },
  {
    level: "Supporting Partner",
    investment: "$50K+",
    duration: "1-2 Years",
    benefits: [
      "Event collaboration",
      "Research participation",
      "Training programs",
      "Networking opportunities",
      "Resource sharing"
    ],
    icon: Handshake,
    color: "text-secondary",
  },
];

const currentPartners = [
  { name: "African Development Bank", type: "Financial Institution", since: "2019" },
  { name: "University of Cape Town", type: "Academic", since: "2020" },
  { name: "UN Environment Programme", type: "International", since: "2018" },
  { name: "Sustainable Energy Fund", type: "Investment", since: "2021" },
  { name: "Green Africa Initiative", type: "NGO", since: "2020" },
  { name: "Ministry of Energy, Ghana", type: "Government", since: "2019" },
];

export default function Partnerships() {
  const [heroData, setHeroData] = useState<any>(null);
  const [partners, setPartners] = useState<any[]>([]);
  const [pageContent, setPageContent] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Form state
  const [formData, setFormData] = useState({
    organization: "",
    organizationType: "",
    name: "",
    email: "",
    partnershipInterest: "",
    preferredLevel: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.organization) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.functions.invoke("send-contact-form", {
        body: {
          formType: "partnership",
          ...formData,
        },
      });

      if (error) throw error;

      toast({
        title: "Partnership Request Submitted!",
        description: "Thank you for your interest. Our team will review your request and get back to you soon.",
      });
      
      // Reset form
      setFormData({
        organization: "",
        organizationType: "",
        name: "",
        email: "",
        partnershipInterest: "",
        preferredLevel: "",
      });
    } catch (error: any) {
      console.error("Error sending partnership form:", error);
      toast({
        title: "Error",
        description: "Failed to submit your request. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadData = async () => {
    const [heroResult, partnersResult, contentResult] = await Promise.all([
      supabase.from('cms_hero_sections').select('*').eq('page', 'partnerships').eq('is_active', true).maybeSingle(),
      supabase.from('cms_partners').select('*').eq('is_active', true).order('display_order'),
      supabase.from('cms_page_content').select('*').eq('page_slug', 'partnerships').eq('is_published', true).maybeSingle()
    ]);
    
    if (heroResult.data) setHeroData(heroResult.data);
    if (partnersResult.data) setPartners(partnersResult.data);
    if (contentResult.data) setPageContent(contentResult.data.content);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section 
        className="py-20 relative bg-cover bg-center bg-no-repeat african-pattern"
        style={{ backgroundImage: `linear-gradient(rgba(19, 50, 44, 0.8), rgba(19, 50, 44, 0.8)), url(${partnershipsHero})` }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <Handshake className="h-16 w-16 mx-auto mb-6 text-accent animate-float" />
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 animate-fade-in text-white">
            {heroData?.title || "Strategic Partnerships"}
          </h1>
          <p className="text-xl leading-relaxed animate-fade-in delay-200">
            {heroData?.subtitle || pageContent?.subtitle || "Building collaborative networks that amplify our impact across Africa's energy and sustainability landscape."}
          </p>
        </div>
      </section>

      {/* Partnership Types */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
              Partnership Categories
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We work with diverse organizations to create comprehensive solutions 
              for Africa's sustainable development.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {(pageContent?.partnershipTypes || partnershipTypes).map((type: any, index: number) => {
              const iconName = typeof type.icon === 'string' ? type.icon : 'Building2';
              let Icon = Building2;
              if (iconName === 'Building2') Icon = Building2;
              if (iconName === 'GraduationCap') Icon = GraduationCap;
              if (iconName === 'Globe') Icon = Globe;
              if (iconName === 'Users') Icon = Users;
              return (
                <Card 
                  key={type.title}
                  className="group hover:shadow-strong transition-all duration-300 border-0 shadow-medium"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 ${type.bgColor} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <Icon className={`h-8 w-8 ${type.color}`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl font-heading font-bold mb-2">
                          {type.title}
                        </CardTitle>
                        <CardDescription className="text-base leading-relaxed">
                          {type.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Partnership Benefits:</h4>
                      <div className="space-y-2">
                        {type.benefits.map((benefit) => (
                          <div key={benefit} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Examples:</h4>
                      <p className="text-sm text-muted-foreground italic">
                        {type.examples}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partnership Levels */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
              Partnership Levels
            </h2>
            <p className="text-xl text-muted-foreground">
              Flexible partnership models designed to match your organization's capacity and goals
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {(pageContent?.partnershipLevels || partnershipLevels).map((level: any, index: number) => {
              const iconName = typeof level.icon === 'string' ? level.icon : 'Star';
              let Icon = Star;
              if (iconName === 'Star') Icon = Star;
              if (iconName === 'Target') Icon = Target;
              if (iconName === 'Handshake') Icon = Handshake;
              return (
                <Card 
                  key={level.level}
                  className="text-center hover:shadow-strong transition-all duration-300 transform hover:scale-105 border-0 shadow-medium"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon className={`h-8 w-8 text-white`} />
                    </div>
                    <CardTitle className="text-2xl font-heading font-bold">
                      {level.level}
                    </CardTitle>
                    <div className="flex justify-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {level.investment}
                      </div>
                      <div>
                        {level.duration}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      {level.benefits.map((benefit) => (
                        <div key={benefit} className="flex items-center gap-2 text-left">
                          <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{benefit}</span>
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

      {/* Current Partners */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
              Our Current Partners
            </h2>
            <p className="text-xl text-muted-foreground">
              Trusted organizations working alongside us to transform Africa's energy future
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {(partners.length > 0 ? partners : currentPartners).map((partner, index) => (
              <Card 
                key={partner.name}
                className="hover:shadow-medium transition-all duration-300 border-0 shadow-soft"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 text-center">
                  {partner.logo_url && (
                    <img src={partner.logo_url} alt={partner.name} className="w-16 h-16 object-contain mx-auto mb-3" />
                  )}
                  <h3 className="font-heading font-semibold text-lg mb-2">
                    {partner.name}
                  </h3>
                  <Badge variant="secondary" className="mb-2">
                    {partner.category || partner.type}
                  </Badge>
                  {partner.description && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {partner.description}
                    </p>
                  )}
                  {partner.since && (
                    <p className="text-sm text-muted-foreground">
                      Partner since {partner.since}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Form */}
      <section className="py-20 bg-gradient-subtle">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
              Become Our Partner
            </h2>
            <p className="text-xl text-muted-foreground">
              Ready to join Africa's energy transformation? Let's explore partnership opportunities.
            </p>
          </div>

          <Card className="border-0 shadow-strong">
            <CardContent className="p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Organization Name *</label>
                    <Input 
                      name="organization"
                      value={formData.organization}
                      onChange={handleInputChange}
                      placeholder="Your organization name" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Organization Type</label>
                    <Input 
                      name="organizationType"
                      value={formData.organizationType}
                      onChange={handleInputChange}
                      placeholder="Government, NGO, Private, Academic, etc." 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Contact Name</label>
                    <Input 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Primary contact person" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address *</label>
                    <Input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="contact@organization.com" 
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Partnership Interest</label>
                  <Textarea 
                    name="partnershipInterest"
                    value={formData.partnershipInterest}
                    onChange={handleInputChange}
                    placeholder="Describe your organization's goals and how you envision partnering with AE&SC..."
                    className="min-h-[120px]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Preferred Partnership Level</label>
                  <Input 
                    name="preferredLevel"
                    value={formData.preferredLevel}
                    onChange={handleInputChange}
                    placeholder="Strategic, Implementation, or Supporting Partner" 
                  />
                </div>

                <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Partnership Request
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary african-pattern">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl font-heading font-bold mb-6">
            {pageContent?.cta?.title || "Let's Transform Africa Together"}
          </h2>
          <p className="text-xl leading-relaxed mb-8 text-white/90">
            {pageContent?.cta?.description || "Partner with us to create lasting impact across Africa's energy and sustainability landscape."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="cta" size="lg" asChild>
              <Link to="/contact">
                Schedule a Meeting
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              asChild
            >
              <Link to="/about">Learn More About Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}