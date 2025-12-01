import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function CmsSocialMedia() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
    youtube: "",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("cms_site_settings")
        .select("setting_key, setting_value")
        .in("setting_key", [
          "social_facebook",
          "social_twitter",
          "social_linkedin",
          "social_instagram",
          "social_youtube",
        ]);

      if (error) throw error;

      if (data) {
        const links: any = {};
        data.forEach((item) => {
          const key = item.setting_key.replace("social_", "");
          links[key] = item.setting_value || "";
        });
        setSocialLinks(links);
      }
    } catch (error) {
      console.error("Error loading social media settings:", error);
      toast({
        title: "Error",
        description: "Failed to load social media settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updates = Object.entries(socialLinks).map(([key, value]) => ({
        setting_key: `social_${key}`,
        setting_value: value,
      }));

      const { error } = await supabase
        .from("cms_site_settings")
        .upsert(updates, { onConflict: "setting_key" });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Social media links updated successfully",
      });
    } catch (error) {
      console.error("Error updating social media settings:", error);
      toast({
        title: "Error",
        description: "Failed to update social media settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media Links</CardTitle>
        <CardDescription>
          Manage social media links that appear in the navigation bar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook URL</Label>
            <Input
              id="facebook"
              type="url"
              placeholder="https://facebook.com/yourpage"
              value={socialLinks.facebook}
              onChange={(e) =>
                setSocialLinks({ ...socialLinks, facebook: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitter">Twitter/X URL</Label>
            <Input
              id="twitter"
              type="url"
              placeholder="https://twitter.com/yourhandle"
              value={socialLinks.twitter}
              onChange={(e) =>
                setSocialLinks({ ...socialLinks, twitter: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn URL</Label>
            <Input
              id="linkedin"
              type="url"
              placeholder="https://linkedin.com/company/yourcompany"
              value={socialLinks.linkedin}
              onChange={(e) =>
                setSocialLinks({ ...socialLinks, linkedin: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram URL</Label>
            <Input
              id="instagram"
              type="url"
              placeholder="https://instagram.com/yourhandle"
              value={socialLinks.instagram}
              onChange={(e) =>
                setSocialLinks({ ...socialLinks, instagram: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="youtube">YouTube URL</Label>
            <Input
              id="youtube"
              type="url"
              placeholder="https://youtube.com/@yourchannel"
              value={socialLinks.youtube}
              onChange={(e) =>
                setSocialLinks({ ...socialLinks, youtube: e.target.value })
              }
            />
          </div>

          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Social Media Links
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
