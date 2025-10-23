import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Users } from "lucide-react";
import { toast } from "sonner";
import { usePayment } from "@/hooks/use-payment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { User } from '@supabase/supabase-js';
import type { Tables } from "@/integrations/supabase/types";
import membershipHero from "@/assets/membership-hero.jpg";

type MembershipPlanRow = Tables<"aesc_membership_plans">;

interface MembershipPlan {
  id: string;
  name: string;
  tier: string;
  description: string;
  price: number;
  billing_period: string;
  features: string[];
}

interface UserMembership {
  id: string;
  plan_id: string;
  status: string;
  started_at: string;
  expires_at: string | null;
}

const Membership = () => {
  const navigate = useNavigate();
  const { initializeFlutterwave, initializePaystack, isProcessing } = usePayment();
  const [user, setUser] = useState<User | null>(null);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [userMembership, setUserMembership] = useState<UserMembership | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("flutterwave");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session?.user) {
          navigate("/auth");
        } else {
          setUser(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchPlans();
      fetchUserMembership();
    }
  }, [user]);

  const fetchPlans = async () => {
    const { data, error } = await supabase
      .from("aesc_membership_plans")
      .select("*")
      .eq("is_active", true)
      .order("price", { ascending: true });

    if (error) {
      toast.error("Failed to load membership plans");
    } else {
      const mappedPlans: MembershipPlan[] = (data || []).map(plan => ({
        ...plan,
        features: Array.isArray(plan.features) ? plan.features as string[] : [],
      }));
      setPlans(mappedPlans);
    }
    setLoading(false);
  };

  const fetchUserMembership = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("aesc_user_memberships")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (!error && data) {
      setUserMembership(data);
    }
  };

  const handleSubscribe = async (planId: string, planPrice: number) => {
    if (!user) return;

    // Get user profile for email and name
    const { data: profile } = await supabase
      .from("aesc_profiles")
      .select("email, full_name")
      .eq("id", user.id)
      .single();

    if (!profile) {
      toast.error("Profile not found");
      return;
    }

    const paymentConfig = {
      publicKey: "dummy_key", // This would be replaced with actual keys
      amount: planPrice,
      currency: "USD",
      customerEmail: profile.email,
      customerName: profile.full_name || profile.email,
      planId: planId,
    };

    let result;
    if (selectedPaymentMethod === "flutterwave") {
      result = await initializeFlutterwave(paymentConfig);
    } else {
      result = await initializePaystack(paymentConfig);
    }

    if (result.success) {
      // Create membership record
      const { error } = await supabase
        .from("aesc_user_memberships")
        .insert({
          user_id: user.id,
          plan_id: planId,
          status: "active",
        });

      if (error) {
        if (error.code === "23505") {
          toast.error("You already have this membership plan");
        } else {
          toast.error("Failed to subscribe to plan");
        }
      } else {
        toast.success("Successfully subscribed to plan!");
        fetchUserMembership();
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading membership plans...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section 
        className="py-20 relative bg-cover bg-center bg-no-repeat african-pattern"
        style={{ backgroundImage: `linear-gradient(rgba(19, 50, 44, 0.8), rgba(19, 50, 44, 0.8)), url(${membershipHero})` }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <Users className="h-16 w-16 mx-auto mb-6 text-accent animate-float" />
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 animate-fade-in text-white">
            Membership Plans
          </h1>
          <p className="text-xl leading-relaxed animate-fade-in delay-200">
            Join AE&SC and be part of Africa's sustainable energy transformation. Select the perfect plan for your needs.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold text-foreground mb-4">Choose Your Plan</h2>
          <p className="text-muted-foreground text-lg mb-6">
            Flexible membership options to match your goals
          </p>
          
          <div className="max-w-xs mx-auto">
            <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flutterwave">Flutterwave</SelectItem>
                <SelectItem value="paystack">Paystack</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {plans.map((plan) => {
            const isCurrentPlan = userMembership?.plan_id === plan.id;
            
            return (
              <Card key={plan.id} className={isCurrentPlan ? "border-primary shadow-lg" : ""}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle>{plan.name}</CardTitle>
                    {isCurrentPlan && <Badge variant="default">Current Plan</Badge>}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">/{plan.billing_period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    onClick={() => handleSubscribe(plan.id, plan.price)}
                    disabled={isCurrentPlan || isProcessing}
                    variant={isCurrentPlan ? "outline" : "default"}
                  >
                    {isProcessing ? "Processing..." : isCurrentPlan ? "Subscribed" : "Subscribe Now"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Membership;
