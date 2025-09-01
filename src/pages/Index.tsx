import { HeroSection } from "@/components/hero-section";
import { InitiativesSection } from "@/components/initiatives-section";
import { ImpactStatsSection } from "@/components/impact-stats-section";
import { NewsInsightsSection } from "@/components/news-insights-section";
import { PartnersSection } from "@/components/partners-section";
import { NewsletterSection } from "@/components/newsletter-section";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <InitiativesSection />
      <ImpactStatsSection />
      <NewsInsightsSection />
      <PartnersSection />
      <NewsletterSection />
    </div>
  );
};

export default Index;
