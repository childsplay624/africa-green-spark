import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('subscribe-mailchimp', {
        body: { email }
      });

      if (error) throw error;

      setIsSubscribed(true);
      toast({
        title: "Successfully subscribed!",
        description: data.message || "You'll receive updates on Africa's sustainability journey.",
      });
      setEmail("");
      
      // Reset after animation
      setTimeout(() => setIsSubscribed(false), 3000);
    } catch (error: any) {
      console.error("Subscription error:", error);
      toast({
        title: "Subscription failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-gradient-primary african-pattern">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-6 sm:mb-8">
          <Mail className="h-10 w-10 sm:h-12 sm:w-12 text-white mx-auto mb-3 sm:mb-4 animate-float" />
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-white mb-3 sm:mb-4">
            Stay Connected
          </h3>
          <p className="text-base sm:text-lg lg:text-xl text-white/90 leading-relaxed px-4">
            Get the latest insights on Africa's energy transition and sustainability initiatives
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
            required
          />
          <Button 
            type="submit" 
            variant="cta"
            className="bg-white text-primary hover:bg-white/90 min-w-[120px]"
            disabled={isSubscribed || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Subscribing...
              </>
            ) : isSubscribed ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Subscribed!
              </>
            ) : (
              "Subscribe"
            )}
          </Button>
        </form>

        <p className="text-xs sm:text-sm text-white/70 mt-3 sm:mt-4 px-4">
          No spam, unsubscribe at any time. We respect your privacy.
        </p>
      </div>
    </section>
  );
}