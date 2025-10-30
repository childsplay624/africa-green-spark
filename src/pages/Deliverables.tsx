import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Sun, Network, Construction, Gauge, Flame } from "lucide-react";
import initiativesHero from "@/assets/initiatives-hero.jpg";
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

export default function Deliverables() {
  const deliverables = [
    {
      icon: Zap,
      title: "Universal Access to Electricity",
      summary: "Achieving reliable and affordable electricity access across Africa, aligned with SDG 7.",
      description: "AE&SC is committed to achieving universal, reliable, and affordable access to electricity across Africa, in alignment with SDG 7 (Affordable and Clean Energy). This deliverable focuses on closing the access gap, especially in rural and underserved communities through off-grid and mini-grid solutions, distributed renewable systems, and policy reforms that attract investment into electrification. By collaborating with governments, utilities, and private developers, AE&SC supports the creation of inclusive energy access models that empower communities, stimulate local economies, and improve quality of life.",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      icon: Sun,
      title: "Expansion of Renewable Energy",
      summary: "Scaling clean energy generation to power Africa's sustainable growth.",
      description: "The Consortium drives the scaling up of renewable energy generation across the continent, positioning clean energy as the backbone of Africa's growth. This involves promoting solar, wind, hydro, geothermal, and bioenergy projects through enabling policies, bankable project design, and public–private partnerships. AE&SC also facilitates knowledge exchange and technology transfer to accelerate renewable adoption, while ensuring energy security and resilience. The goal is to create a diversified energy mix that reduces carbon emissions, lowers generation costs, and supports sustainable industrialization.",
      gradient: "from-yellow-500 to-amber-500",
    },
    {
      icon: Network,
      title: "African Single Electricity Market (AfSEM)",
      summary: "Integrating African power markets for cross-border electricity trading.",
      description: "In support of the African Union's AfSEM initiative, AE&SC advocates for the integration of African power markets into a unified, interconnected electricity system. This focuses on harmonizing regulations, grid codes, and trading mechanisms to allow electricity to flow freely across borders. By fostering regional power pools and interconnection projects, AE&SC enables countries to share surplus capacity, reduce generation costs, and enhance grid stability. Through technical cooperation and policy alignment, AE&SC contributes to building an integrated continental electricity market that supports economic growth and energy equity.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Construction,
      title: "Modern Energy Infrastructure",
      summary: "Building resilient, climate-smart energy systems for the future.",
      description: "AE&SC promotes the development of modern, resilient, and climate-smart energy infrastructure that can meet Africa's growing demand sustainably. This includes upgrading generation plants, transmission lines, and distribution networks with advanced technologies that improve efficiency and reliability. The consortium also supports smart grid systems, energy storage, and digital monitoring tools that optimize performance and reduce losses. By championing infrastructure modernization, AE&SC ensures Africa's energy systems are future-ready, adaptable, and supportive of low-carbon industrialization.",
      gradient: "from-slate-500 to-zinc-600",
    },
    {
      icon: Gauge,
      title: "Energy Efficiency Programs",
      summary: "Reducing energy waste and maximizing conservation across all sectors.",
      description: "Energy efficiency is one of the fastest and most cost-effective ways to advance sustainability. AE&SC develops and supports programs that reduce energy waste across industries, buildings, and transportation. This includes promoting efficient appliances and lighting, industrial process optimization, green building standards, and awareness campaigns that encourage responsible energy use. By embedding efficiency into national energy plans, AE&SC helps governments and businesses save costs, reduce emissions, and enhance competitiveness while conserving valuable resources.",
      gradient: "from-green-500 to-emerald-600",
    },
    {
      icon: Flame,
      title: "Clean Cooking Solutions",
      summary: "Transforming household cooking with clean, affordable, and sustainable solutions.",
      description: "Millions of African households still rely on traditional biomass for cooking, leading to deforestation, indoor air pollution, and health risks. AE&SC prioritizes clean cooking access as a core sustainability objective. The consortium supports the adoption of LPG, biogas, ethanol, and electric cookstoves, coupled with financing models that make them affordable and accessible. Through partnerships with innovators and NGOs, AE&SC promotes community-driven programs, local manufacturing, and policy incentives to accelerate clean cooking adoption. This initiative directly improves public health, gender equity, and environmental protection, while reducing pressure on natural ecosystems.",
      gradient: "from-red-500 to-rose-600",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${initiativesHero})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-background" />
        <div className="relative z-10 max-w-6xl px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-accent/20 backdrop-blur-sm text-white text-sm font-medium mb-4">
              Our Impact
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-white mb-4 sm:mb-6">
              AE&SC Key <span className="text-primary">Deliverables</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto">
              Concrete outcomes driving Africa's sustainable energy transformation
            </p>
          </motion.div>
        </div>
      </section>

      {/* Deliverables Grid */}
      <section className="py-12 sm:py-20 bg-gradient-to-b from-background to-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {deliverables.map((deliverable, index) => {
              const Icon = deliverable.icon;
              return (
                <AnimatedCard key={deliverable.title} delay={index * 0.1}>
                  <Card className="h-full group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-medium overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${deliverable.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    <CardHeader className="relative pb-4">
                      <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${deliverable.gradient} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <CardTitle className="text-xl font-heading font-bold mb-2">
                        {deliverable.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="details" className="border-0">
                          <AccordionTrigger className="text-muted-foreground hover:text-foreground py-2 hover:no-underline">
                            <span className="text-sm">{deliverable.summary}</span>
                          </AccordionTrigger>
                          <AccordionContent>
                            <CardDescription className="text-sm leading-relaxed pt-2">
                              {deliverable.description}
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
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
              Delivering Real Impact Across Africa
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              These key deliverables represent our commitment to tangible, measurable change in Africa's energy sector
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
