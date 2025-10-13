import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface SubscriptionToggleProps {
  forumId: string;
  isSubscribed: boolean;
  onToggle: () => void;
  preferences?: {
    notify_on_post: boolean;
    notify_on_reply: boolean;
  };
  onUpdatePreferences?: (prefs: {
    notify_on_post?: boolean;
    notify_on_reply?: boolean;
  }) => void;
}

export function SubscriptionToggle({
  forumId,
  isSubscribed,
  onToggle,
  preferences,
  onUpdatePreferences,
}: SubscriptionToggleProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={isSubscribed ? "default" : "outline"}
          size="sm"
          className="gap-2"
        >
          {isSubscribed ? (
            <>
              <Bell className="h-4 w-4" />
              Subscribed
            </>
          ) : (
            <>
              <BellOff className="h-4 w-4" />
              Subscribe
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Forum Notifications</h4>
            <p className="text-sm text-muted-foreground">
              {isSubscribed
                ? "Manage your notification preferences"
                : "Subscribe to get notified about new activity"}
            </p>
          </div>

          {!isSubscribed ? (
            <Button onClick={onToggle} className="w-full">
              Subscribe to Forum
            </Button>
          ) : (
            <>
              {preferences && onUpdatePreferences && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-posts" className="text-sm">
                      New posts
                    </Label>
                    <Switch
                      id="notify-posts"
                      checked={preferences.notify_on_post}
                      onCheckedChange={(checked) =>
                        onUpdatePreferences({ notify_on_post: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-replies" className="text-sm">
                      New replies
                    </Label>
                    <Switch
                      id="notify-replies"
                      checked={preferences.notify_on_reply}
                      onCheckedChange={(checked) =>
                        onUpdatePreferences({ notify_on_reply: checked })
                      }
                    />
                  </div>
                </div>
              )}
              <Button
                onClick={onToggle}
                variant="outline"
                className="w-full"
              >
                Unsubscribe
              </Button>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
