import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf, Zap, Handshake, Recycle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const initiatives = [
  {
    icon: Leaf,
    title: "Clean Energy",
    description: "Promoting renewable energy solutions across Africa through innovative solar, wind, and hydroelectric projects.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Zap,
    title: "Decarbonization",
    description: "Reducing carbon footprint through strategic initiatives and sustainable energy transition pathways.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: Handshake,
    title: "Partnerships",
    description: "Building strategic alliances with governments, academia, and private sector for sustainable development.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Recycle,
    title: "Circular Economy",
    description: "Implementing circular economy principles to maximize resource efficiency and minimize waste.",
    color: "text-earth",
    bgColor: "bg-earth/10",
  },
];

export function InitiativesSection() {
  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Featured{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Initiatives
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Driving sustainable change through strategic initiatives that transform 
            Africa's energy landscape and environmental future.
          </p>
        </div>

        {/* Initiatives Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {initiatives.map((initiative, index) => {
            const Icon = initiative.icon;
            return (
              <Card 
                key={initiative.title}
                className="group hover:shadow-medium transition-all duration-300 transform hover:scale-105 border-0 shadow-soft bg-white/80 backdrop-blur-sm"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 ${initiative.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`h-8 w-8 ${initiative.color}`} />
                  </div>
                  <CardTitle className="font-heading font-semibold text-xl">
                    {initiative.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-muted-foreground leading-relaxed">
                    {initiative.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button variant="hero" size="lg" className="px-8 py-4" asChild>
            <Link to="/initiatives">
              Explore All Initiatives
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}