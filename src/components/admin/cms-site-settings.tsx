import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ImagePlus } from "lucide-react";

export function CmsSiteSettings() {
  const [logoUrl, setLogoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("cms_site_settings")
        .select("*")
        .eq("setting_key", "site_logo")
        .single();

      if (error) throw error;
      setLogoUrl(data?.setting_value || "");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from("cms_site_settings")
        .upsert({ setting_key: "site_logo", setting_value: logoUrl });

      if (error) throw error;
      toast({ title: "Success", description: "Logo updated successfully" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Site Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logo">Site Logo URL</Label>
              <Input
                id="logo"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="/logo.png or https://..."
                required
              />
              <p className="text-sm text-muted-foreground">
                Enter the path to your logo file (e.g., /logo.png) or a full URL
              </p>
            </div>

            {logoUrl && (
              <div className="space-y-2">
                <Label>Logo Preview</Label>
                <div className="border rounded-lg p-4 bg-muted/50 flex items-center justify-center">
                  <img
                    src={logoUrl}
                    alt="Site logo preview"
                    className="max-h-24 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full">
            <ImagePlus className="w-4 h-4 mr-2" />
            Update Logo
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
