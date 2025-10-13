import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useForumEmailNotifications() {
  useEffect(() => {
    // Subscribe to new notifications to trigger email sending
    const channel = supabase
      .channel("notification-emails")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        async (payload) => {
          console.log("New notification created:", payload.new);
          
          // Call edge function to send email
          try {
            const { error } = await supabase.functions.invoke("send-forum-email", {
              body: { notificationId: payload.new.id },
            });

            if (error) {
              console.error("Error sending notification email:", error);
            } else {
              console.log("Notification email sent for:", payload.new.id);
            }
          } catch (err) {
            console.error("Failed to invoke email function:", err);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
}
