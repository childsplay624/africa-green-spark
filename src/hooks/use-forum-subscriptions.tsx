import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Subscription {
  id: string;
  forum_id: string;
  notify_on_post: boolean;
  notify_on_reply: boolean;
}

export function useForumSubscriptions(userId: string | undefined) {
  const [subscriptions, setSubscriptions] = useState<Map<string, Subscription>>(new Map());
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      loadSubscriptions();
    }
  }, [userId]);

  const loadSubscriptions = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from("forum_subscriptions")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;

      const subMap = new Map<string, Subscription>();
      data?.forEach((sub) => {
        subMap.set(sub.forum_id, sub as Subscription);
      });
      setSubscriptions(subMap);
    } catch (error) {
      console.error("Error loading subscriptions:", error);
    }
  };

  const toggleSubscription = async (forumId: string) => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to subscribe to forums",
        variant: "destructive",
      });
      return false;
    }

    const existingSub = subscriptions.get(forumId);

    try {
      if (existingSub) {
        const { error } = await supabase
          .from("forum_subscriptions")
          .delete()
          .eq("id", existingSub.id);

        if (error) throw error;

        setSubscriptions((prev) => {
          const newMap = new Map(prev);
          newMap.delete(forumId);
          return newMap;
        });

        toast({
          title: "Unsubscribed",
          description: "You will no longer receive notifications from this forum",
        });
      } else {
        const { data, error } = await supabase
          .from("forum_subscriptions")
          .insert({
            forum_id: forumId,
            user_id: userId,
            notify_on_post: true,
            notify_on_reply: true,
          })
          .select()
          .single();

        if (error) throw error;

        setSubscriptions((prev) => new Map(prev).set(forumId, data as Subscription));

        toast({
          title: "Subscribed",
          description: "You will receive notifications for new posts in this forum",
        });
      }

      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update subscription",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateSubscriptionPreferences = async (
    forumId: string,
    preferences: { notify_on_post?: boolean; notify_on_reply?: boolean }
  ) => {
    if (!userId) return false;

    const existingSub = subscriptions.get(forumId);
    if (!existingSub) return false;

    try {
      const { data, error } = await supabase
        .from("forum_subscriptions")
        .update(preferences)
        .eq("id", existingSub.id)
        .select()
        .single();

      if (error) throw error;

      setSubscriptions((prev) => new Map(prev).set(forumId, data as Subscription));

      toast({
        title: "Preferences Updated",
        description: "Your notification preferences have been updated",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update preferences",
        variant: "destructive",
      });
      return false;
    }
  };

  const isSubscribed = (forumId: string) => subscriptions.has(forumId);

  return {
    subscriptions,
    isSubscribed,
    toggleSubscription,
    updateSubscriptionPreferences,
  };
}
