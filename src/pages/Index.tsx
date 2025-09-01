import { HeroSection } from "@/components/hero-section";
import { InitiativesSection } from "@/components/initiatives-section";
import { NewsletterSection } from "@/components/newsletter-section";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <InitiativesSection />
      <NewsletterSection />
    </div>
  );
};

export default Index;
