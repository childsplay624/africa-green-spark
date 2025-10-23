import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Building2, GraduationCap, Globe, Users, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import React from "react";

export function PartnersSection() {
  const [partners, setPartners] = useState<any[]>([]);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    const { data } = await supabase
      .from("cms_partners")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });
    
    if (data) setPartners(data);
  };

  const getIconComponent = (iconName?: string) => {
    const iconMap: Record<string, any> = {
      Building2, GraduationCap, Globe, Users
    };
    return iconMap[iconName || "Users"] || Users;
  };

  if (partners.length === 0) return null;

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

        {/* Partners Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
          {partners.map((partner, index) => (
            <Card 
              key={partner.id}
              className="group hover:shadow-medium transition-all duration-300 transform hover:scale-105 border-0 shadow-soft text-center"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                {partner.logo_url ? (
                  <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                    <img 
                      src={partner.logo_url} 
                      alt={partner.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    {React.createElement(getIconComponent(partner.category), { className: "h-8 w-8 text-primary" })}
                  </div>
                )}
                <h3 className="font-heading font-semibold text-sm sm:text-base lg:text-lg mb-2">
                  {partner.name}
                </h3>
                {partner.description && (
                  <p className="text-muted-foreground text-sm mb-3 leading-relaxed line-clamp-2">
                    {partner.description}
                  </p>
                )}
                {partner.category && (
                  <div className="text-xs text-primary font-medium">
                    {partner.category}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-primary rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-12 text-white african-pattern">
          <h3 className="text-2xl sm:text-3xl font-heading font-bold mb-3 sm:mb-4">
            Become Our Partner
          </h3>
          <p className="text-base sm:text-lg lg:text-xl leading-relaxed mb-6 sm:mb-8 text-white/90 max-w-2xl mx-auto">
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
