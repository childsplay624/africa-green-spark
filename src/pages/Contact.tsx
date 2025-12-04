import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send,
  MessageCircle,
  Calendar,
  ArrowRight,
  Globe,
  Building,
  Loader2
} from "lucide-react";
import contactHero from "@/assets/contact-hero.jpg";

const contactMethods = [
  {
    icon: Building,
    title: "Headquarters",
    details: [
      "AE&SC House",
      "Victoria Island, Lagos",
      "Nigeria"
    ],
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Phone,
    title: "Phone",
    details: [
      "+234 (0) 901 234 5678",
      "+234 (0) 901 234 5679",
      "Available 9am - 5pm WAT"
    ],
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: Mail,
    title: "Email",
    details: [
      "info@aesc-africa.org",
      "partnerships@aesc-africa.org",
      "research@aesc-africa.org"
    ],
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Globe,
    title: "Regional Offices",
    details: [
      "Accra, Ghana",
      "Nairobi, Kenya",
      "Cape Town, South Africa"
    ],
    color: "text-earth",
    bgColor: "bg-earth/10",
  },
];

const teamMembers = [
  {
    name: "Dr. Daere Akobo",
    title: "Founder & CEO",
    email: "daere.akobo@aesc-africa.org",
    focus: "Strategic Leadership & Policy",
  },
  {
    name: "Sarah Ndombe",
    title: "Director of Partnerships",
    email: "sarah.ndombe@aesc-africa.org",
    focus: "Stakeholder Engagement",
  },
  {
    name: "Prof. James Okello",
    title: "Head of Research",
    email: "james.okello@aesc-africa.org",
    focus: "Sustainability Research",
  },
  {
    name: "Amina Hassan",
    title: "Program Director",
    email: "amina.hassan@aesc-africa.org",
    focus: "Project Implementation",
  },
];

const socialLinks = [
  { name: "LinkedIn", url: "#", icon: "🔗" },
  { name: "Twitter", url: "#", icon: "🐦" },
  { name: "Facebook", url: "#", icon: "📘" },
  { name: "YouTube", url: "#", icon: "📺" },
];

export default function Contact() {
  const [heroData, setHeroData] = useState<any>(null);
  const [pageContent, setPageContent] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    organization: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [heroResult, contentResult] = await Promise.all([
      supabase.from('cms_hero_sections').select('*').eq('page', 'contact').eq('is_active', true).maybeSingle(),
      supabase.from('cms_page_content').select('*').eq('page_slug', 'contact').eq('is_published', true).maybeSingle()
    ]);
    
    if (heroResult.data) setHeroData(heroResult.data);
    if (contentResult.data) setPageContent(contentResult.data.content);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.firstName || !formData.message) {
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
          formType: "contact",
          ...formData,
        },
      });

      if (error) throw error;

      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        organization: "",
        subject: "",
        message: "",
      });
    } catch (error: any) {
      console.error("Error sending contact form:", error);
      toast({
        title: "Error",
        description: "Failed to send your message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section 
        className="py-20 relative bg-cover bg-center bg-no-repeat african-pattern"
        style={{ backgroundImage: `linear-gradient(rgba(19, 50, 44, 0.8), rgba(19, 50, 44, 0.8)), url(${contactHero})` }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <MessageCircle className="h-16 w-16 mx-auto mb-6 text-accent animate-float" />
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 animate-fade-in text-white">
            {heroData?.title || "Get In Touch"}
          </h1>
          <p className="text-xl leading-relaxed animate-fade-in delay-200">
            {heroData?.subtitle || pageContent?.subtitle || "Ready to partner with us or learn more about our work? We'd love to hear from you."}
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
              How to Reach Us
            </h2>
            <p className="text-xl text-muted-foreground">
              Multiple ways to connect with our team across Africa
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {(pageContent?.contactMethods || contactMethods).map((method: any, index: number) => {
              const iconName = typeof method.icon === 'string' ? method.icon : 'Building';
              let Icon = Building;
              if (iconName === 'Building') Icon = Building;
              if (iconName === 'Phone') Icon = Phone;
              if (iconName === 'Mail') Icon = Mail;
              if (iconName === 'Globe') Icon = Globe;
              return (
                <Card 
                  key={method.title}
                  className="text-center hover:shadow-medium transition-all duration-300 transform hover:scale-105 border-0 shadow-soft"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 ${method.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4`}>
                      <Icon className={`h-6 w-6 sm:h-8 sm:w-8 ${method.color}`} />
                    </div>
                    <h3 className="font-heading font-semibold text-base sm:text-lg mb-3 sm:mb-4">
                      {method.title}
                    </h3>
                    <div className="space-y-2">
                      {method.details.map((detail, i) => (
                        <p key={i} className="text-muted-foreground text-sm">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-heading font-bold text-foreground mb-6">
                Send Us a Message
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Whether you're interested in partnerships, research collaboration, 
                or have questions about our initiatives, we're here to help.
              </p>

              <Card className="border-0 shadow-medium">
                <CardContent className="p-8">
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">First Name *</label>
                        <Input 
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="Your first name" 
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Last Name</label>
                        <Input 
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Your last name" 
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address *</label>
                      <Input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com" 
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Organization</label>
                      <Input 
                        name="organization"
                        value={formData.organization}
                        onChange={handleInputChange}
                        placeholder="Your organization (optional)" 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Subject</label>
                      <Input 
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Brief subject of your message" 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Message *</label>
                      <Textarea 
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us about your inquiry, partnership interest, or how we can help..."
                        className="min-h-[150px]"
                        required
                      />
                    </div>

                    <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Additional Info */}
            <div className="space-y-8">
              {/* Office Hours */}
              <Card className="border-0 shadow-medium">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Office Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span className="font-medium">{pageContent?.officeHours?.weekdays || "9:00 AM - 5:00 PM WAT"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span className="font-medium">{pageContent?.officeHours?.saturday || "10:00 AM - 2:00 PM WAT"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span className="text-muted-foreground">{pageContent?.officeHours?.sunday || "Closed"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-0 shadow-medium bg-gradient-primary text-white">
                <CardContent className="p-6">
                  <h3 className="font-heading font-bold text-xl mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20"
                      asChild
                    >
                      <a href="mailto:partnerships@aesc-africa.org">
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule a Partnership Meeting
                      </a>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20"
                      asChild
                    >
                      <a href="mailto:research@aesc-africa.org">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Research Collaboration
                      </a>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20"
                      asChild
                    >
                      <a href="mailto:info@aesc-africa.org">
                        <Send className="mr-2 h-4 w-4" />
                        General Inquiry
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card className="border-0 shadow-medium">
                <CardHeader>
                  <CardTitle>Connect With Us</CardTitle>
                  <CardDescription>
                    Follow our journey on social media
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    {socialLinks.map((social) => (
                      <a
                        key={social.name}
                        href={social.url}
                        className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform"
                        title={social.name}
                      >
                        <span className="text-lg">{social.icon}</span>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map and Location */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
              Visit Our Offices
            </h2>
            <p className="text-xl text-muted-foreground">
              We're located across key African cities to serve you better
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center border-0 shadow-medium">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">Lagos</h3>
                <p className="text-muted-foreground text-sm">
                  Headquarters<br />
                  Victoria Island
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-medium">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">Accra</h3>
                <p className="text-muted-foreground text-sm">
                  West Africa Hub<br />
                  Airport City
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-medium">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">Nairobi</h3>
                <p className="text-muted-foreground text-sm">
                  East Africa Hub<br />
                  Westlands
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-medium">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-earth/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-earth" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">Cape Town</h3>
                <p className="text-muted-foreground text-sm">
                  Southern Africa Hub<br />
                  V&A Waterfront
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}