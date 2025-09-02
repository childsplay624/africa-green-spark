import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Target, Eye, Award, Users, ArrowRight, Lightbulb, Globe, Leaf, BarChart2, HeartHandshake } from "lucide-react";
import aboutHero from "@/assets/about-hero.jpg";
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

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
            About <span className="text-accent">AE&SC</span>
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Powering Africa's sustainable future through innovation and collaboration
          </motion.p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <AnimatedCard key={stat.label} delay={index * 0.1}>
                <Card className="border-0 shadow-md hover:shadow-lg transition-shadow h-full">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                      {stat.value}{stat.suffix}
                    </div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
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
                Our Mission
              </div>
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
                Leading Africa's <span className="text-primary">Green Revolution</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                The African Energy and Sustainability Consortium (AE&SC) is at the forefront of Africa's 
                transition to sustainable energy. We're a dynamic non-profit organization committed to 
                driving innovation, fostering collaboration, and delivering impactful solutions across 
                the continent.
              </p>
              <div className="space-y-4 pt-4">
                {[
                  { icon: <Globe className="h-6 w-6 text-primary" />, text: 'Pan-African presence in 45+ countries' },
                  { icon: <Leaf className="h-6 w-6 text-primary" />, text: '100+ renewable energy projects completed' },
                  { icon: <HeartHandshake className="h-6 w-6 text-primary" />, text: '500+ strategic partnerships' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {item.icon}
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
                    <h3 className="text-2xl font-bold text-white">Our Vision</h3>
                  </div>
                  <p className="text-white/90">
                    A prosperous Africa powered by clean, sustainable energy that drives economic growth, 
                    improves lives, and preserves our environment for future generations.
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
                <CardTitle className="text-2xl font-heading font-bold">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  To accelerate Africa's energy transition by fostering innovation, 
                  building strategic partnerships, and implementing sustainable solutions 
                  that address the continent's unique challenges while creating lasting 
                  economic and environmental benefits for all African communities.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="shadow-medium border-0 hover:shadow-strong transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4">
                  <Eye className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-2xl font-heading font-bold">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  To see Africa emerge as a global leader in sustainable energy and 
                  environmental stewardship, where every African has access to clean, 
                  affordable energy that powers economic growth while preserving our 
                  continent's natural heritage for future generations.
                </CardDescription>
              </CardContent>
            </Card>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Lightbulb className="h-6 w-6" />,
                title: "Innovation",
                description: "We champion cutting-edge solutions to Africa's energy challenges.",
                color: "from-blue-500 to-blue-600"
              },
              {
                icon: <Users className="h-6 w-6" />,
                title: "Collaboration",
                description: "Stronger together through strategic partnerships.",
                color: "from-green-500 to-green-600"
              },
              {
                icon: <BarChart2 className="h-6 w-6" />,
                title: "Impact",
                description: "Measurable, sustainable change is our benchmark for success.",
                color: "from-purple-500 to-purple-600"
              },
              {
                icon: <Eye className="h-6 w-6" />,
                title: "Transparency",
                description: "Openness and accountability in all our endeavors.",
                color: "from-amber-500 to-amber-600"
              },
              {
                icon: <Award className="h-6 w-6" />,
                title: "Excellence",
                description: "Pursuing the highest standards in every project.",
                color: "from-rose-500 to-rose-600"
              },
              {
                icon: <Leaf className="h-6 w-6" />,
                title: "Sustainability",
                description: "Solutions that last, for people and the planet.",
                color: "from-emerald-500 to-emerald-600"
              }
            ].map((value, index) => (
              <AnimatedCard key={value.title} delay={index * 0.1}>
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                  <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  <CardHeader className="relative">
                    <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center text-white mb-4`}>
                      {value.icon}
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
            Join Our Mission
          </h2>
          <p className="text-xl leading-relaxed mb-8 text-white/90">
            Be part of Africa's sustainable energy transformation. Together, we can build 
            a cleaner, more prosperous future for all Africans.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="cta" size="lg" asChild>
              <Link to="/partnerships">
                Become a Partner
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
      </section>
    </div>
  );
}