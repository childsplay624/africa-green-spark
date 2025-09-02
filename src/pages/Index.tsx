import { HeroSection } from "@/components/hero-section";
import { InitiativesSection } from "@/components/initiatives-section";
import { ImpactStatsSection } from "@/components/impact-stats-section";
import { AnimatedSection } from "@/hooks/use-scroll-animation";
import { NewsInsightsSection } from "@/components/news-insights-section";
import { PartnersSection } from "@/components/partners-section";
import { NewsletterSection } from "@/components/newsletter-section";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <AnimatedSection animation="fade-in">
        <HeroSection />
      </AnimatedSection>
      
      <AnimatedSection animation="fade-up" delay={200}>
        <InitiativesSection />
      </AnimatedSection>
      
      <AnimatedSection animation="fade-up" delay={300}>
        <ImpactStatsSection />
      </AnimatedSection>
      
      <AnimatedSection animation="fade-up" delay={400}>
        <NewsInsightsSection />
      </AnimatedSection>
      
      <AnimatedSection animation="fade-up" delay={500}>
        <PartnersSection />
      </AnimatedSection>
      
      <AnimatedSection animation="fade-up" delay={600}>
        <NewsletterSection />
      </AnimatedSection>
    </div>
  );
};

export default Index;
