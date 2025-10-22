import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationCenter } from "@/components/notification-center";
import { supabase } from "@/integrations/supabase/client";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Initiatives", href: "/initiatives" },
  { name: "Strategic Focus", href: "/strategic-focus" },
  { name: "Partnerships", href: "/partnerships" },
  { name: "Resources", href: "/resources" },
  { name: "Forum", href: "/forum" },
  { name: "Contact", href: "/contact" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [logoUrl, setLogoUrl] = useState("/logo.png");
  const location = useLocation();

  useEffect(() => {
    checkAuth();
    loadLogo();
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const loadLogo = async () => {
    try {
      const { data, error } = await supabase
        .from("cms_site_settings")
        .select("setting_value")
        .eq("setting_key", "site_logo")
        .single();

      if (data?.setting_value) {
        setLogoUrl(data.setting_value);
      }
    } catch (error) {
      console.error("Error loading logo:", error);
    }
  };

  const checkAuth = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-soft">
      <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20">
          {/* Logo - Extreme left */}
          <div className="flex-shrink-0 mr-auto">
            <Link to="/" className="group">
              <img
                src={logoUrl}
                alt="Site Logo"
                className="h-20 object-contain transition-transform group-hover:scale-105"
              />
            </Link>
          </div>

          {/* Centered Navigation */}
          <div className="hidden md:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary relative",
                    isActive(item.href) ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {item.name}
                  {isActive(item.href) && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-primary rounded-full" />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Right-aligned Buttons */}
          <div className="hidden md:flex items-center space-x-4 ml-auto">
            {isAuthenticated ? (
              <>
                <NotificationCenter />
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/profile">
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/auth">Join Us</Link>
                </Button>
                <Button asChild>
                  <Link to="/partnerships">Partner With Us</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t border-border">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                    isActive(item.href)
                      ? "text-primary bg-accent"
                      : "text-muted-foreground hover:text-primary hover:bg-accent",
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 space-y-2">
                {isAuthenticated ? (
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/profile" onClick={() => setIsOpen(false)}>
                      <User className="mr-2 h-4 w-4" />
                      My Profile
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/partnerships" onClick={() => setIsOpen(false)}>
                        Partner With Us
                      </Link>
                    </Button>
                    <Button variant="hero" className="w-full" asChild>
                      <Link to="/auth" onClick={() => setIsOpen(false)}>
                        Join Us
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
