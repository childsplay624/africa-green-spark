import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, DollarSign, Scale, UserCheck, Zap, Cpu } from "lucide-react";
import strategicHero from "@/assets/strategic-hero.jpg";
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const AnimatedCard = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
  >
    {children}
  </motion.div>
);

export default function Pillars() {
  const pillars = [
    {
      icon: Building2,
      number: "1",
      title: "Readiness: Institutional and Governance Stability",
      description: "At the foundation of Africa's sustainability transition lies institutional readiness and governance stability.",
      fullDescription: "AE&SC promotes the strengthening of governance systems, transparent leadership, and efficient institutional coordination to ensure policies are implemented effectively and sustainably. This pillar emphasizes building stable frameworks, clear mandates, and inter-agency collaboration mechanisms that can drive long-term sustainability initiatives beyond political cycles. By fostering institutional maturity and accountability, AE&SC ensures that sustainability efforts are strategically anchored, well-coordinated, and resilient to change.",
      color: "text-primary",
      bgColor: "bg-primary/10",
      gradient: "from-primary to-primary-glow"
    },
    {
      icon: DollarSign,
      number: "2",
      title: "Investment and Capital Availability",
      description: "The sustainability transition requires massive capital inflows and innovative financing mechanisms.",
      fullDescription: "AE&SC focuses on bridging the gap between investors, financiers, and sustainable project developers, ensuring that credible, bankable projects attract the funding they need. This pillar promotes green finance instruments, public–private partnerships (PPPs), climate funds, and carbon markets that mobilize both domestic and international investment. AE&SC works to de-risk projects, improve financial transparency, and create investment-ready frameworks that make Africa's clean energy and sustainability sectors attractive and scalable.",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      gradient: "from-secondary to-accent"
    },
    {
      icon: Scale,
      number: "3",
      title: "Regulation and Political Commitments",
      description: "A successful energy transition depends on strong regulatory foundations and political will.",
      fullDescription: "Under this pillar, AE&SC engages with policymakers and regulators to design and advocate for progressive sustainability policies, energy transition frameworks, and compliance mechanisms. The consortium also supports governments in translating political commitments such as net-zero targets and energy access goals into actionable, enforceable regulations. By aligning national policy with regional and global climate ambitions, AE&SC helps ensure that Africa's sustainability journey is policy-driven, transparent, and credible to investors and international partners.",
      color: "text-accent",
      bgColor: "bg-accent/10",
      gradient: "from-accent to-primary"
    },
    {
      icon: UserCheck,
      number: "4",
      title: "Human Capital and Consumer Participation",
      description: "People are central to Africa's sustainable transformation.",
      fullDescription: "This pillar focuses on empowering individuals, communities, and institutions with the knowledge, skills, and motivation to drive change. AE&SC invests in capacity-building programs, technical training, and leadership development to create a skilled sustainability workforce. Additionally, it promotes public awareness and consumer engagement encouraging energy efficiency, responsible consumption, and local ownership of sustainability initiatives. The goal is to cultivate a culture where citizens, professionals, and industries actively participate in shaping a cleaner and more inclusive future.",
      color: "text-earth",
      bgColor: "bg-earth/10",
      gradient: "from-earth to-secondary"
    },
    {
      icon: Zap,
      number: "5",
      title: "Integrated Energy Systems Structure",
      description: "AE&SC advocates for a holistic, integrated approach to energy development.",
      fullDescription: "This pillar emphasizes combining renewables, natural gas, and emerging technologies into cohesive, resilient systems. The focus is on interconnection of generation, transmission, distribution, and consumption systems, leveraging data, digitalization, and cross-sector integration to enhance efficiency and reliability. Through system planning and interregional cooperation, AE&SC supports the creation of flexible, inclusive energy ecosystems capable of delivering sustainable power to both urban and rural communities.",
      color: "text-primary",
      bgColor: "bg-primary/10",
      gradient: "from-primary to-accent"
    },
    {
      icon: Cpu,
      number: "6",
      title: "Technology Infrastructure and Innovative Business Environment",
      description: "Sustainability in Africa depends on technological advancement and an enabling business ecosystem.",
      fullDescription: "This pillar promotes digital transformation, smart infrastructure, and research-driven innovation, creating pathways for emerging technologies such as green hydrogen, AI-driven energy management, and circular economy models to thrive. AE&SC also works to streamline business regulations, support startups and innovators, and encourage local manufacturing and technology transfer. By cultivating a tech-enabled business environment, AE&SC accelerates Africa's ability to compete globally, localize solutions, and sustain growth through innovation.",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      gradient: "from-secondary to-primary"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${strategicHero})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-background" />
        <div className="relative z-10 max-w-6xl px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-sm text-white text-sm font-medium mb-4">
              Our Framework
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-white mb-4 sm:mb-6">
              The 6 Pillars of <span className="text-primary">AE&SC</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto">
              Moving Africa to Sustainability through a comprehensive foundational framework
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pillars Grid */}
      <section className="py-12 sm:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <AnimatedCard key={pillar.number} delay={index * 0.1}>
                  <Card className="h-full group hover:shadow-strong transition-all duration-300 border-0 shadow-medium overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${pillar.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                    <CardHeader className="relative">
                      <div className="flex items-start gap-4">
                        <div className={`w-16 h-16 ${pillar.bgColor} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform relative`}>
                          <Icon className={`h-8 w-8 ${pillar.color}`} />
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center shadow-md">
                            <span className="text-white font-heading font-bold text-sm">
                              {pillar.number}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl font-heading font-bold mb-2">
                            {pillar.title}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="relative">
                      <CardDescription className="text-base leading-relaxed mb-4">
                        {pillar.description}
                      </CardDescription>
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="details">
                          <AccordionTrigger className="text-sm font-medium text-primary hover:text-primary/80 py-3">
                            Learn more about this pillar
                          </AccordionTrigger>
                          <AccordionContent>
                            <CardDescription className="text-base leading-relaxed pt-2">
                              {pillar.fullDescription}
                            </CardDescription>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                </AnimatedCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-background to-muted/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
              Building Africa's Sustainable Future
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              These six pillars form the foundation of our comprehensive approach to transforming Africa's energy landscape
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
