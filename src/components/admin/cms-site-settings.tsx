import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ImagePlus, Upload } from "lucide-react";

export function CmsSiteSettings() {
  const [logoUrl, setLogoUrl] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [primaryColor, setPrimaryColor] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("cms_site_settings")
        .select("*")
        .in("setting_key", ["site_logo", "primary_color", "secondary_color"]);

      if (error) throw error;
      
      data?.forEach((setting) => {
        if (setting.setting_key === "site_logo") setLogoUrl(setting.setting_value || "");
        if (setting.setting_key === "primary_color") setPrimaryColor(setting.setting_value || "");
        if (setting.setting_key === "secondary_color") setSecondaryColor(setting.setting_value || "");
      });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };


  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({ title: "Error", description: "Please upload an image file", variant: "destructive" });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "Error", description: "File size must be less than 2MB", variant: "destructive" });
      return;
    }

    setLogoFile(file);
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setLogoUrl(previewUrl);
  };

  const uploadLogoToStorage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `logo-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from('header-images')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('header-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      let finalLogoUrl = logoUrl;

      // Upload logo if a new file was selected
      if (logoFile) {
        finalLogoUrl = await uploadLogoToStorage(logoFile);
      }

      const updates = [
        { setting_key: "site_logo", setting_value: finalLogoUrl },
        { setting_key: "primary_color", setting_value: primaryColor },
        { setting_key: "secondary_color", setting_value: secondaryColor },
      ];

      const { error } = await supabase
        .from("cms_site_settings")
        .upsert(updates, { onConflict: 'setting_key' });

      if (error) throw error;
      
      setLogoUrl(finalLogoUrl);
      setLogoFile(null);
      toast({ title: "Success", description: "Brand settings updated successfully" });
      
      // Reload page to refresh navigation logo
      setTimeout(() => window.location.reload(), 1000);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Brand Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logoUpload">Site Logo</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="logoUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="flex-1"
                />
                <Upload className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                Upload your logo image (max 2MB, PNG, JPG, or SVG recommended)
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Brand Color (HSL)</Label>
                <Input
                  id="primaryColor"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  placeholder="e.g., 142 76% 36%"
                />
                <p className="text-sm text-muted-foreground">
                  HSL format without hsl() wrapper
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Secondary Brand Color (HSL)</Label>
                <Input
                  id="secondaryColor"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  placeholder="e.g., 45 93% 47%"
                />
                <p className="text-sm text-muted-foreground">
                  HSL format without hsl() wrapper
                </p>
              </div>
            </div>

            {(primaryColor || secondaryColor) && (
              <div className="space-y-2 pt-2">
                <Label>Color Preview</Label>
                <div className="flex gap-4">
                  {primaryColor && (
                    <div className="flex-1 space-y-1">
                      <div 
                        className="h-16 rounded-lg border"
                        style={{ backgroundColor: `hsl(${primaryColor})` }}
                      />
                      <p className="text-xs text-center text-muted-foreground">Primary</p>
                    </div>
                  )}
                  {secondaryColor && (
                    <div className="flex-1 space-y-1">
                      <div 
                        className="h-16 rounded-lg border"
                        style={{ backgroundColor: `hsl(${secondaryColor})` }}
                      />
                      <p className="text-xs text-center text-muted-foreground">Secondary</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={uploading}>
            <ImagePlus className="w-4 h-4 mr-2" />
            {uploading ? "Uploading..." : "Update Brand Settings"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
