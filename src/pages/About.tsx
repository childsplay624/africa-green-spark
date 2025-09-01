import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Target, Eye, Award, Users, ArrowRight, Lightbulb } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-subtle african-pattern">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-heading font-bold text-foreground mb-6 animate-fade-in">
            About{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              AE&SC
            </span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed animate-fade-in delay-200">
            Driving Africa's transformation towards a sustainable energy future through 
            innovation, collaboration, and strategic partnerships.
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
                Leading Africa's Energy Transition
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                The African Energy and Sustainability Consortium (AE&SC) is a dynamic non-profit 
                organization dedicated to accelerating Africa's journey towards energy security, 
                environmental sustainability, and economic prosperity.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Founded on the principles of innovation, collaboration, and impact, we work 
                tirelessly to bridge the gap between Africa's current energy landscape and 
                its sustainable future aspirations.
              </p>
              <Button variant="hero" size="lg" asChild>
                <Link to="/initiatives">
                  Explore Our Work
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="relative animate-scale-in">
              <div className="bg-gradient-primary rounded-2xl p-8 text-white shadow-strong">
                <Lightbulb className="h-12 w-12 mb-6 text-accent" />
                <h3 className="text-2xl font-heading font-bold mb-4">Our Impact</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-3xl font-bold text-accent">50+</div>
                    <div className="text-sm opacity-90">Projects Initiated</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-accent">25+</div>
                    <div className="text-sm opacity-90">Partner Organizations</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-accent">15</div>
                    <div className="text-sm opacity-90">African Countries</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-accent">1M+</div>
                    <div className="text-sm opacity-90">Lives Impacted</div>
                  </div>
                </div>
              </div>
            </div>
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

      {/* Leadership */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
              Leadership Team
            </h2>
            <p className="text-xl text-muted-foreground">
              Guided by visionary leaders committed to Africa's sustainable future
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="shadow-strong border-0 bg-gradient-to-r from-white to-muted/20">
              <CardHeader className="text-center">
                <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-12 w-12 text-white" />
                </div>
                <CardTitle className="text-3xl font-heading font-bold">
                  Dr. Daere Akobo
                </CardTitle>
                <CardDescription className="text-lg font-medium text-primary">
                  Founder & Chief Executive Officer
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  Dr. Daere Akobo brings decades of experience in energy policy, 
                  sustainable development, and African economic development. His vision 
                  and leadership have been instrumental in positioning AE&SC as a 
                  catalyst for Africa's energy transformation.
                </p>
                <div className="flex justify-center">
                  <Button variant="outline" asChild>
                    <Link to="/contact">Connect with Leadership</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Card className="inline-block shadow-medium border-0 bg-accent/10">
              <CardContent className="p-6">
                <Award className="h-8 w-8 text-accent mx-auto mb-4" />
                <h3 className="font-heading font-semibold text-lg mb-2">Governance Structure</h3>
                <p className="text-muted-foreground">
                  Committed to transparency, accountability, and ethical leadership in all our initiatives
                </p>
              </CardContent>
            </Card>
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