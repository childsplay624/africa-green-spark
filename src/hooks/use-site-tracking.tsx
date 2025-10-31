import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// Generate or retrieve session ID
const getSessionId = () => {
  let sessionId = sessionStorage.getItem("visitor_session_id");
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem("visitor_session_id", sessionId);
  }
  return sessionId;
};

// Detect if user agent is a bot
const isBot = (userAgent: string): boolean => {
  const botPatterns = [
    /bot/i, /crawl/i, /spider/i, /slurp/i, /mediapartners/i,
    /lighthouse/i, /headless/i, /phantom/i, /selenium/i,
    /googlebot/i, /bingbot/i, /yandex/i, /baidu/i, /duckduck/i
  ];
  return botPatterns.some(pattern => pattern.test(userAgent));
};

export function useSiteTracking() {
  const location = useLocation();

  useEffect(() => {
    const trackVisit = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const userAgent = navigator.userAgent;
        const sessionId = getSessionId();
        const botDetected = isBot(userAgent);
        
        // Try to insert, but ignore if this session already visited this page
        await supabase.from("site_visits").insert({
          page_path: location.pathname,
          user_id: user?.id || null,
          user_agent: userAgent,
          referrer: document.referrer || null,
          session_id: sessionId,
          is_bot: botDetected,
        }).select();
      } catch (error) {
        // Silently fail to not disrupt user experience (includes duplicate session+page)
        console.error("Error tracking visit:", error);
      }
    };

    trackVisit();
  }, [location.pathname]);
}
