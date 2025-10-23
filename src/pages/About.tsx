import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Target, Eye, Award, Users, ArrowRight, Lightbulb, Globe, Leaf, BarChart2, HeartHandshake, Building2, DollarSign, Scale, UserCheck, Zap, Cpu, Sun, Network, Construction, Gauge, Flame } from "lucide-react";
import aboutHero from "@/assets/about-hero.jpg";
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

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

export default function About() {
  const [stats, setStats] = useState([
    { value: 0, max: 125, label: 'Projects Completed', suffix: '+' },
    { value: 0, max: 45, label: 'Countries Reached', suffix: '+' },
    { value: 0, max: 1, label: 'Million Lives Impacted', suffix: 'M+' },
    { value: 0, max: 85, label: 'Success Rate', suffix: '%' }
  ]);
  const [heroData, setHeroData] = useState<any>(null);
  const [pageContent, setPageContent] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [heroResult, contentResult] = await Promise.all([
      supabase.from('cms_hero_sections').select('*').eq('page', 'about').eq('is_active', true).maybeSingle(),
      supabase.from('cms_page_content').select('*').eq('page_slug', 'about').eq('is_published', true).maybeSingle()
    ]);
    
    if (heroResult.data) setHeroData(heroResult.data);
    if (contentResult.data) setPageContent(contentResult.data.content);
  };

  useEffect(() => {
    // Animate stats counting
    const intervals = stats.map((stat, i) => {
      const increment = stat.max / 20; // Adjust speed of counting
      return setInterval(() => {
        setStats(prev => {
          const newStats = [...prev];
          if (newStats[i].value < stat.max) {
            newStats[i].value = Math.ceil(newStats[i].value + increment);
            if (newStats[i].value > stat.max) newStats[i].value = stat.max;
          }
          return newStats;
        });
      }, 50);
    });

    return () => intervals.forEach(interval => clearInterval(interval));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Parallax */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-110"
          style={{
            backgroundImage: `url(${aboutHero})`,
            backgroundAttachment: 'fixed',
            willChange: 'transform',
            transition: 'transform 0.3s ease-out'
          }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-6xl px-6 text-center">
          <motion.h1 
            className="text-5xl md:text-7xl font-display font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {heroData?.title || "About AE&SC"}
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {heroData?.subtitle || "Powering Africa's sustainable future through innovation and collaboration"}
          </motion.p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <AnimatedCard key={stat.label} delay={index * 0.1}>
                <Card className="border-0 shadow-md hover:shadow-lg transition-shadow h-full">
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-2">
                      {stat.value}{stat.suffix}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              {pageContent?.introduction?.badge || "Our Mission"}
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
              {pageContent?.introduction?.heading || "Leading Africa's Green Revolution"}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {pageContent?.introduction?.description || "The African Energy and Sustainability Consortium (AE&SC) is at the forefront of Africa's transition to sustainable energy. We're a dynamic non-profit organization committed to driving innovation, fostering collaboration, and delivering impactful solutions across the continent."}
            </p>
            <div className="space-y-4 pt-4">
              {(pageContent?.introduction?.highlights || [
                { icon: "Globe", text: 'Pan-African presence in 45+ countries' },
                { icon: "Leaf", text: '100+ renewable energy projects completed' },
                { icon: "HeartHandshake", text: '500+ strategic partnerships' },
              ]).map((item: any, i: number) => (
                <div key={i} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {item.icon === "Globe" && <Globe className="h-6 w-6 text-primary" />}
                    {item.icon === "Leaf" && <Leaf className="h-6 w-6 text-primary" />}
                    {item.icon === "HeartHandshake" && <HeartHandshake className="h-6 w-6 text-primary" />}
                  </div>
                  <p className="text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
              <Button variant="hero" size="lg" className="mt-6" asChild>
                <Link to="/initiatives">
                  Explore Our Work
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50, rotate: 2 }}
              whileInView={{ opacity: 1, x: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl group"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-accent/5 -z-10" />
              <div className="absolute inset-4 border-2 border-primary/20 rounded-2xl group-hover:border-primary/40 transition-all duration-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80')] bg-cover bg-center scale-110 group-hover:scale-100 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </div>
              </div>
              <div className="absolute inset-0 flex items-end p-8">
                <div className="bg-gradient-to-r from-primary to-accent p-6 rounded-2xl w-full max-w-md">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-white/10 rounded-lg">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{pageContent?.vision?.title || "Our Vision"}</h3>
                  </div>
                  <p className="text-white/90">
                    {pageContent?.vision?.description || "A prosperous Africa powered by clean, sustainable energy that drives economic growth, improves lives, and preserves our environment for future generations."}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="shadow-medium border-0 hover:shadow-strong transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl font-heading font-bold">{pageContent?.mission?.title || "Our Mission"}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {pageContent?.mission?.description || "To accelerate Africa's energy transition by fostering innovation, building strategic partnerships, and implementing sustainable solutions that address the continent's unique challenges while creating lasting economic and environmental benefits for all African communities."}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="shadow-medium border-0 hover:shadow-strong transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4">
                  <Eye className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-2xl font-heading font-bold">{pageContent?.vision?.title || "Our Vision"}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {pageContent?.vision?.description || "To see Africa emerge as a global leader in sustainable energy and environmental stewardship, where every African has access to clean, affordable energy that powers economic growth while preserving our continent's natural heritage for future generations."}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 6 Pillars Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Our Framework
              </div>
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
                The 6 Pillars of <span className="text-primary">AE&SC</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Moving Africa/Nigeria to Sustainability through a comprehensive foundational framework
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {[
              {
                icon: Building2,
                number: "1",
                title: "Readiness: Institutional and Governance Stability",
                description: "At the foundation of Africa's sustainability transition lies institutional readiness and governance stability. AE&SC promotes the strengthening of governance systems, transparent leadership, and efficient institutional coordination to ensure policies are implemented effectively and sustainably. This pillar emphasizes building stable frameworks, clear mandates, and inter-agency collaboration mechanisms that can drive long-term sustainability initiatives beyond political cycles. By fostering institutional maturity and accountability, AE&SC ensures that sustainability efforts are strategically anchored, well-coordinated, and resilient to change.",
                color: "text-primary",
                bgColor: "bg-primary/10",
              },
              {
                icon: DollarSign,
                number: "2",
                title: "Investment and Capital Availability",
                description: "The sustainability transition requires massive capital inflows and innovative financing mechanisms. AE&SC focuses on bridging the gap between investors, financiers, and sustainable project developers, ensuring that credible, bankable projects attract the funding they need. This pillar promotes green finance instruments, public–private partnerships (PPPs), climate funds, and carbon markets that mobilize both domestic and international investment. AE&SC works to de-risk projects, improve financial transparency, and create investment-ready frameworks that make Africa's clean energy and sustainability sectors attractive and scalable.",
                color: "text-secondary",
                bgColor: "bg-secondary/10",
              },
              {
                icon: Scale,
                number: "3",
                title: "Regulation and Political Commitments",
                description: "A successful energy transition depends on strong regulatory foundations and political will. Under this pillar, AE&SC engages with policymakers and regulators to design and advocate for progressive sustainability policies, energy transition frameworks, and compliance mechanisms. The consortium also supports governments in translating political commitments such as net-zero targets and energy access goals into actionable, enforceable regulations. By aligning national policy with regional and global climate ambitions, AE&SC helps ensure that Africa's sustainability journey is policy-driven, transparent, and credible to investors and international partners.",
                color: "text-accent",
                bgColor: "bg-accent/10",
              },
              {
                icon: UserCheck,
                number: "4",
                title: "Human Capital and Consumer Participation",
                description: "People are central to Africa's sustainable transformation. This pillar focuses on empowering individuals, communities, and institutions with the knowledge, skills, and motivation to drive change. AE&SC invests in capacity-building programs, technical training, and leadership development to create a skilled sustainability workforce. Additionally, it promotes public awareness and consumer engagement encouraging energy efficiency, responsible consumption, and local ownership of sustainability initiatives. The goal is to cultivate a culture where citizens, professionals, and industries actively participate in shaping a cleaner and more inclusive future.",
                color: "text-earth",
                bgColor: "bg-earth/10",
              },
              {
                icon: Zap,
                number: "5",
                title: "Integrated Energy Systems Structure",
                description: "AE&SC advocates for a holistic, integrated approach to energy development combining renewables, natural gas, and emerging technologies into cohesive, resilient systems. This pillar emphasizes the interconnection of generation, transmission, distribution, and consumption systems, leveraging data, digitalization, and cross-sector integration to enhance efficiency and reliability. Through system planning and interregional cooperation, AE&SC supports the creation of flexible, inclusive energy ecosystems capable of delivering sustainable power to both urban and rural communities.",
                color: "text-primary",
                bgColor: "bg-primary/10",
              },
              {
                icon: Cpu,
                number: "6",
                title: "Technology Infrastructure and Innovative Business Environment",
                description: "Sustainability in Africa depends on technological advancement and an enabling business ecosystem that supports innovation. This pillar promotes digital transformation, smart infrastructure, and research-driven innovation, creating pathways for emerging technologies such as green hydrogen, AI-driven energy management, and circular economy models to thrive. AE&SC also works to streamline business regulations, support startups and innovators, and encourage local manufacturing and technology transfer. By cultivating a tech-enabled business environment, AE&SC accelerates Africa's ability to compete globally, localize solutions, and sustain growth through innovation.",
                color: "text-secondary",
                bgColor: "bg-secondary/10",
              },
            ].map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <AnimatedCard key={pillar.number} delay={index * 0.1}>
                  <Card className="h-full group hover:shadow-strong transition-all duration-300 border-0 shadow-medium">
                    <CardHeader>
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
                          <CardTitle className="text-xl font-heading font-bold mb-3">
                            {pillar.title}
                          </CardTitle>
                          <CardDescription className="text-base leading-relaxed">
                            {pillar.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </AnimatedCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Key Deliverables Section */}
      <section className="py-20 bg-gradient-to-b from-muted/50 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                Our Impact
              </div>
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
                AE&SC Key <span className="text-primary">Deliverables</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Concrete outcomes driving Africa's sustainable energy transformation
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: Zap,
                title: "Universal Access to Electricity",
                description: "AE&SC is committed to achieving universal, reliable, and affordable access to electricity across Africa, in alignment with SDG 7 (Affordable and Clean Energy). This deliverable focuses on closing the access gap, especially in rural and underserved communities through off-grid and mini-grid solutions, distributed renewable systems, and policy reforms that attract investment into electrification. By collaborating with governments, utilities, and private developers, AE&SC supports the creation of inclusive energy access models that empower communities, stimulate local economies, and improve quality of life.",
                gradient: "from-amber-500 to-orange-500",
              },
              {
                icon: Sun,
                title: "Expansion of Renewable Energy",
                description: "The Consortium drives the scaling up of renewable energy generation across the continent, positioning clean energy as the backbone of Africa's growth. This involves promoting solar, wind, hydro, geothermal, and bioenergy projects through enabling policies, bankable project design, and public–private partnerships. AE&SC also facilitates knowledge exchange and technology transfer to accelerate renewable adoption, while ensuring energy security and resilience. The goal is to create a diversified energy mix that reduces carbon emissions, lowers generation costs, and supports sustainable industrialization.",
                gradient: "from-yellow-500 to-amber-500",
              },
              {
                icon: Network,
                title: "African Single Electricity Market (AfSEM)",
                description: "In support of the African Union's AfSEM initiative, AE&SC advocates for the integration of African power markets into a unified, interconnected electricity system. This focuses on harmonizing regulations, grid codes, and trading mechanisms to allow electricity to flow freely across borders. By fostering regional power pools and interconnection projects, AE&SC enables countries to share surplus capacity, reduce generation costs, and enhance grid stability. Through technical cooperation and policy alignment, AE&SC contributes to building an integrated continental electricity market that supports economic growth and energy equity.",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                icon: Construction,
                title: "Modern Energy Infrastructure",
                description: "AE&SC promotes the development of modern, resilient, and climate-smart energy infrastructure that can meet Africa's growing demand sustainably. This includes upgrading generation plants, transmission lines, and distribution networks with advanced technologies that improve efficiency and reliability. The consortium also supports smart grid systems, energy storage, and digital monitoring tools that optimize performance and reduce losses. By championing infrastructure modernization, AE&SC ensures Africa's energy systems are future-ready, adaptable, and supportive of low-carbon industrialization.",
                gradient: "from-slate-500 to-zinc-600",
              },
              {
                icon: Gauge,
                title: "Energy Efficiency Programs",
                description: "Energy efficiency is one of the fastest and most cost-effective ways to advance sustainability. AE&SC develops and supports programs that reduce energy waste across industries, buildings, and transportation. This includes promoting efficient appliances and lighting, industrial process optimization, green building standards, and awareness campaigns that encourage responsible energy use. By embedding efficiency into national energy plans, AE&SC helps governments and businesses save costs, reduce emissions, and enhance competitiveness while conserving valuable resources.",
                gradient: "from-green-500 to-emerald-600",
              },
              {
                icon: Flame,
                title: "Clean Cooking Solutions",
                description: "Millions of African households still rely on traditional biomass for cooking, leading to deforestation, indoor air pollution, and health risks. AE&SC prioritizes clean cooking access as a core sustainability objective. The consortium supports the adoption of LPG, biogas, ethanol, and electric cookstoves, coupled with financing models that make them affordable and accessible. Through partnerships with innovators and NGOs, AE&SC promotes community-driven programs, local manufacturing, and policy incentives to accelerate clean cooking adoption. This initiative directly improves public health, gender equity, and environmental protection, while reducing pressure on natural ecosystems.",
                gradient: "from-red-500 to-rose-600",
              },
            ].map((deliverable, index) => {
              const Icon = deliverable.icon;
              return (
                <AnimatedCard key={deliverable.title} delay={index * 0.1}>
                  <Card className="h-full group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-medium overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${deliverable.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                    <CardHeader className="relative pb-4">
                      <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${deliverable.gradient} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <CardTitle className="text-xl font-heading font-bold">
                        {deliverable.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                      <CardDescription className="text-sm leading-relaxed">
                        {deliverable.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </AnimatedCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission and Values */}
      <section className="py-20 bg-gradient-to-b from-muted/10 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                Our Principles
              </div>
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
                Core Values That <span className="text-primary">Drive Us</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                The foundation of our work and the compass that guides our decisions
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {(pageContent?.values || [
              {
                icon: "Lightbulb",
                title: "Innovation",
                description: "We champion cutting-edge solutions to Africa's energy challenges.",
                color: "from-blue-500 to-blue-600"
              },
              {
                icon: "Users",
                title: "Collaboration",
                description: "Stronger together through strategic partnerships.",
                color: "from-green-500 to-green-600"
              },
              {
                icon: "BarChart2",
                title: "Impact",
                description: "Measurable, sustainable change is our benchmark for success.",
                color: "from-purple-500 to-purple-600"
              },
              {
                icon: "Eye",
                title: "Transparency",
                description: "Openness and accountability in all our endeavors.",
                color: "from-amber-500 to-amber-600"
              },
              {
                icon: "Award",
                title: "Excellence",
                description: "Pursuing the highest standards in every project.",
                color: "from-rose-500 to-rose-600"
              },
              {
                icon: "Leaf",
                title: "Sustainability",
                description: "Solutions that last, for people and the planet.",
                color: "from-emerald-500 to-emerald-600"
              }
            ]).map((value: any, index: number) => (
              <AnimatedCard key={value.title} delay={index * 0.1}>
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                  <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  <CardHeader className="relative">
                    <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center text-white mb-4`}>
                      {value.icon === "Lightbulb" && <Lightbulb className="h-6 w-6" />}
                      {value.icon === "Users" && <Users className="h-6 w-6" />}
                      {value.icon === "BarChart2" && <BarChart2 className="h-6 w-6" />}
                      {value.icon === "Eye" && <Eye className="h-6 w-6" />}
                      {value.icon === "Award" && <Award className="h-6 w-6" />}
                      {value.icon === "Leaf" && <Leaf className="h-6 w-6" />}
                    </div>
                    <CardTitle className="text-2xl font-bold text-foreground">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-primary african-pattern">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl font-heading font-bold mb-6">
            {pageContent?.cta?.title || "Join Our Mission"}
          </h2>
          <p className="text-xl leading-relaxed mb-8 text-white/90">
            {pageContent?.cta?.description || "Be part of Africa's sustainable energy transformation. Together, we can build a cleaner, more prosperous future for all Africans."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="cta" size="lg" asChild>
              <Link to={pageContent?.cta?.primaryButton?.link || "/partnerships"}>
                {pageContent?.cta?.primaryButton?.text || "Become a Partner"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              asChild
            >
              <Link to={pageContent?.cta?.secondaryButton?.link || "/contact"}>
                {pageContent?.cta?.secondaryButton?.text || "Get Involved"}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}