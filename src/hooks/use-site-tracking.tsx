import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function useSiteTracking() {
  const location = useLocation();

  useEffect(() => {
    const trackVisit = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        await supabase.from("site_visits").insert({
          page_path: location.pathname,
          user_id: user?.id || null,
          user_agent: navigator.userAgent,
          referrer: document.referrer || null,
        });
      } catch (error) {
        // Silently fail to not disrupt user experience
        console.error("Error tracking visit:", error);
      }
    };

    trackVisit();
  }, [location.pathname]);
}
