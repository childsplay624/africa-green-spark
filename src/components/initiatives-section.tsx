import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf, Zap, Handshake, Recycle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function InitiativesSection() {
  const [initiatives, setInitiatives] = useState<any[]>([]);

  useEffect(() => {
    loadInitiatives();
  }, []);

  const loadInitiatives = async () => {
    const { data } = await supabase
      .from("cms_initiatives")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });
    
    if (data) setInitiatives(data);
  };

  const getIconComponent = (iconName?: string) => {
    const iconMap: Record<string, any> = {
      Leaf, Zap, Handshake, Recycle
    };
    return iconMap[iconName || "Leaf"] || Leaf;
  };

  if (initiatives.length === 0) return null;

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
            const Icon = getIconComponent(initiative.icon);
            return (
              <Card 
                key={initiative.id}
                className="group hover:shadow-medium transition-all duration-300 transform hover:scale-105 border-0 shadow-soft bg-white/80 backdrop-blur-sm"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="h-8 w-8 text-primary" />
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