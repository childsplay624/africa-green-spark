import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Building2, GraduationCap, Globe, Users, ArrowRight } from "lucide-react";

const partnerCategories = [
  {
    icon: Building2,
    title: "Government & Public Sector",
    description: "Collaborating with national governments and international bodies",
    count: "25+ Partners",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: GraduationCap,
    title: "Academic Institutions",
    description: "Research partnerships with leading African universities",
    count: "18+ Universities",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: Globe,
    title: "International Organizations",
    description: "Strategic alliances with global development agencies",
    count: "12+ Organizations",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Users,
    title: "Private Sector & NGOs",
    description: "Innovation partnerships with industry leaders and civil society",
    count: "30+ Partners",
    color: "text-earth",
    bgColor: "bg-earth/10",
  },
];

const testimonials = [
  {
    quote: "AE&SC's strategic approach to energy transition has been instrumental in shaping our national renewable energy policy.",
    author: "Dr. Amina Hassan",
    title: "Minister of Energy, Ghana",
    organization: "Government of Ghana",
  },
  {
    quote: "The consortium's research on circular economy models has provided actionable insights for our sustainability initiatives.",
    author: "Prof. James Okello",
    title: "Director of Sustainability",
    organization: "University of Nairobi",
  },
  {
    quote: "Our partnership with AE&SC has accelerated our clean energy investments across the continent.",
    author: "Sarah Ndombe",
    title: "Regional Director",
    organization: "African Development Bank",
  },
];

export function PartnersSection() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Our{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Partners
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Building a sustainable future through strategic partnerships across 
            government, academia, and the private sector.
          </p>
        </div>

        {/* Partner Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {partnerCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card 
                key={category.title}
                className="group hover:shadow-medium transition-all duration-300 transform hover:scale-105 border-0 shadow-soft text-center"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className={`w-16 h-16 ${category.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`h-8 w-8 ${category.color}`} />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">
                    {category.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                    {category.description}
                  </p>
                  <div className={`text-sm font-medium ${category.color}`}>
                    {category.count}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h3 className="text-3xl font-heading font-bold text-center text-foreground mb-12">
            What Our Partners Say
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={testimonial.author}
                className="border-0 shadow-medium bg-white hover:shadow-strong transition-shadow"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardContent className="p-6">
                  <blockquote className="text-muted-foreground leading-relaxed mb-6 italic">
                    "{testimonial.quote}"
                  </blockquote>
                  <div>
                    <div className="font-heading font-semibold text-foreground">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-primary font-medium">
                      {testimonial.title}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.organization}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-primary rounded-2xl p-12 text-white african-pattern">
          <h3 className="text-3xl font-heading font-bold mb-4">
            Become Our Partner
          </h3>
          <p className="text-xl leading-relaxed mb-8 text-white/90 max-w-2xl mx-auto">
            Join leading organizations across Africa in building a sustainable 
            energy future. Together, we can achieve more.
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
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}