import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import type { User, Session } from '@supabase/supabase-js';
import { Leaf, Zap, Users } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            navigate("/");
          }, 0);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("signup-email") as string;
    const password = formData.get("signup-password") as string;
    const fullName = formData.get("full-name") as string;

    const redirectUrl = `${window.location.origin}/`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Account created successfully!");
    }
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("signin-email") as string;
    const password = formData.get("signin-password") as string;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Signed in successfully!");
    }
  };

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("reset-email") as string;

    const redirectUrl = `${window.location.origin}/auth`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password reset link sent to your email!");
      setShowResetPassword(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("new-password") as string;

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated successfully!");
    }
  };

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 african-pattern opacity-20" />
        <div className="relative z-10 flex flex-col justify-center px-12 py-16 text-white">
          <Link to="/" className="mb-12">
            <h1 className="text-4xl font-display mb-2">AESC</h1>
            <p className="text-lg text-white/80">African Energy & Sustainability Consortium</p>
          </Link>
          
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-heading mb-4">
                Join Africa's Energy Revolution
              </h2>
              <p className="text-lg text-white/90 leading-relaxed">
                Be part of the consortium driving sustainable energy solutions across the African continent.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <Leaf className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading text-lg mb-1">Sustainability Focus</h3>
                  <p className="text-white/80">Access cutting-edge renewable energy initiatives and resources</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading text-lg mb-1">Innovation Network</h3>
                  <p className="text-white/80">Connect with industry leaders and innovative projects</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading text-lg mb-1">Collaborative Community</h3>
                  <p className="text-white/80">Join a community dedicated to Africa's energy future</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <Link to="/">
              <h1 className="text-3xl font-display text-primary mb-1">AESC</h1>
              <p className="text-sm text-muted-foreground">African Energy & Sustainability Consortium</p>
            </Link>
          </div>

          <Card className="border-2 shadow-medium">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-heading text-center">
                {showResetPassword ? "Reset Password" : "Welcome"}
              </CardTitle>
              <CardDescription className="text-center">
                {showResetPassword 
                  ? "Enter your email to receive a password reset link" 
                  : "Sign in to your account or create a new one"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {showResetPassword ? (
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email Address</Label>
                    <Input
                      id="reset-email"
                      name="reset-email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      className="h-11"
                    />
                  </div>
                  <Button type="submit" className="w-full h-11" disabled={loading}>
                    {loading ? "Sending..." : "Send Reset Link"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => setShowResetPassword(false)}
                  >
                    Back to Sign In
                  </Button>
                </form>
              ) : (
                <Tabs defaultValue="signin" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="signin" className="space-y-4">
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signin-email">Email Address</Label>
                        <Input
                          id="signin-email"
                          name="signin-email"
                          type="email"
                          placeholder="you@example.com"
                          required
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="signin-password">Password</Label>
                        </div>
                        <Input
                          id="signin-password"
                          name="signin-password"
                          type="password"
                          placeholder="••••••••"
                          required
                          className="h-11"
                        />
                      </div>
                      <Button type="submit" className="w-full h-11" disabled={loading}>
                        {loading ? "Signing in..." : "Sign In"}
                      </Button>
                      <div className="text-center">
                        <Button
                          type="button"
                          variant="link"
                          className="text-sm text-muted-foreground hover:text-primary"
                          onClick={() => setShowResetPassword(true)}
                        >
                          Forgot your password?
                        </Button>
                      </div>
                    </form>
                  </TabsContent>
            
                  <TabsContent value="signup" className="space-y-4">
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="full-name">Full Name</Label>
                        <Input
                          id="full-name"
                          name="full-name"
                          type="text"
                          placeholder="John Doe"
                          required
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email Address</Label>
                        <Input
                          id="signup-email"
                          name="signup-email"
                          type="email"
                          placeholder="you@example.com"
                          required
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <Input
                          id="signup-password"
                          name="signup-password"
                          type="password"
                          placeholder="••••••••"
                          required
                          minLength={6}
                          className="h-11"
                        />
                        <p className="text-xs text-muted-foreground">
                          Must be at least 6 characters
                        </p>
                      </div>
                      <Button type="submit" className="w-full h-11" disabled={loading}>
                        {loading ? "Creating account..." : "Create Account"}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="reset">
                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input
                          id="new-password"
                          name="new-password"
                          type="password"
                          placeholder="••••••••"
                          required
                          minLength={6}
                          className="h-11"
                        />
                      </div>
                      <Button type="submit" className="w-full h-11" disabled={loading}>
                        {loading ? "Updating..." : "Update Password"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-6">
            By continuing, you agree to AESC's Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
