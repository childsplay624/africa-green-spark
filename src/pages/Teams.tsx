import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Mail, 
  Linkedin, 
  Users,
  Award,
  Target,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";

const teamMembers = [
  {
    name: "Dr. Daere Akobo",
    title: "Founder & CEO",
    email: "daere.akobo@aesc-africa.org",
    focus: "Strategic Leadership & Policy",
    bio: "A visionary leader with over 20 years of experience in energy policy and sustainable development across Africa.",
    avatar: "",
    color: "from-primary to-primary-glow"
  },
  {
    name: "Sarah Ndombe",
    title: "Director of Partnerships",
    email: "sarah.ndombe@aesc-africa.org",
    focus: "Stakeholder Engagement",
    bio: "Expert in building strategic partnerships and fostering collaboration between governments, private sector, and civil society.",
    avatar: "",
    color: "from-secondary to-accent"
  },
  {
    name: "Prof. James Okello",
    title: "Head of Research",
    email: "james.okello@aesc-africa.org",
    focus: "Sustainability Research",
    bio: "Leading researcher in renewable energy technologies and sustainable development with numerous publications in top-tier journals.",
    avatar: "",
    color: "from-accent to-earth"
  },
  {
    name: "Amina Hassan",
    title: "Program Director",
    email: "amina.hassan@aesc-africa.org",
    focus: "Project Implementation",
    bio: "Skilled in managing large-scale energy projects and ensuring successful implementation of sustainability initiatives.",
    avatar: "",
    color: "from-earth to-primary"
  },
];

const departments = [
  {
    name: "Leadership Team",
    icon: Award,
    description: "Providing strategic direction and vision",
    count: 4
  },
  {
    name: "Research Division",
    icon: Target,
    description: "Driving innovation and evidence-based solutions",
    count: 12
  },
  {
    name: "Partnerships Unit",
    icon: Sparkles,
    description: "Building collaborative networks across Africa",
    count: 8
  },
  {
    name: "Programs Team",
    icon: Users,
    description: "Implementing impactful initiatives on the ground",
    count: 15
  }
];

export default function Teams() {
  const [heroData, setHeroData] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data } = await supabase
      .from('cms_hero_sections')
      .select('*')
      .eq('page', 'teams')
      .eq('is_active', true)
      .maybeSingle();
    
    if (data) setHeroData(data);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, hsl(var(--primary) / 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 80% 80%, hsl(var(--accent) / 0.1) 0%, transparent 50%)`
        }}></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Users className="h-16 w-16 mx-auto mb-6 text-primary animate-float" />
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              {heroData?.title || "Meet Our Team"}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {heroData?.subtitle || "Dedicated experts driving Africa's sustainable energy transformation"}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Departments Overview */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.map((dept, index) => (
              <motion.div
                key={dept.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center border-0 shadow-soft hover:shadow-medium transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <dept.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-heading font-semibold text-lg mb-2">{dept.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{dept.description}</p>
                    <div className="text-2xl font-bold text-primary">{dept.count}</div>
                    <p className="text-xs text-muted-foreground">Team Members</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
                Leadership Team
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Visionary leaders committed to transforming Africa's energy landscape
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <Card className="overflow-hidden border-0 shadow-medium hover:shadow-elegant transition-all duration-300 group">
                  <div className={`h-2 bg-gradient-to-r ${member.color}`}></div>
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <Avatar className="h-24 w-24 ring-4 ring-background shadow-glow group-hover:scale-110 transition-transform duration-300">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="bg-gradient-primary text-white text-2xl font-bold">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <h3 className="font-heading font-bold text-2xl mb-1">
                          {member.name}
                        </h3>
                        <p className="text-primary font-semibold mb-2">
                          {member.title}
                        </p>
                        <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                          <Target className="h-4 w-4" />
                          <span>{member.focus}</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed mb-6">
                          {member.bio}
                        </p>
                        
                        <div className="flex gap-3">
                          <Button 
                            variant="outline" 
                            size="sm"
                            asChild
                            className="group/btn"
                          >
                            <a href={`mailto:${member.email}`}>
                              <Mail className="h-4 w-4 mr-2 group-hover/btn:text-primary transition-colors" />
                              Email
                            </a>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="group/btn"
                          >
                            <Linkedin className="h-4 w-4 mr-2 group-hover/btn:text-primary transition-colors" />
                            LinkedIn
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Our Team CTA */}
      <section className="py-20 bg-gradient-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 african-pattern opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Sparkles className="h-16 w-16 mx-auto mb-6 animate-float" />
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Join Our Mission
            </h2>
            <p className="text-xl mb-8 opacity-90 leading-relaxed">
              We're always looking for talented individuals who share our passion for 
              sustainable energy and Africa's development.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:scale-105 transition-all"
                asChild
              >
                <a href="mailto:careers@aesc-africa.org">
                  View Open Positions
                </a>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:scale-105 transition-all"
                asChild
              >
                <a href="/contact">
                  Get In Touch
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
