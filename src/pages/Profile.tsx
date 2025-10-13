import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Mail, 
  MapPin, 
  Building, 
  Globe, 
  Calendar, 
  CreditCard,
  Bell,
  Settings,
  Camera,
  Upload
} from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  bio: string | null;
  location: string | null;
  organization: string | null;
  website: string | null;
  avatar_url: string | null;
  header_image_url: string | null;
  trial_started_at: string | null;
  trial_expires_at: string | null;
  payment_status: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    bio: "",
    location: "",
    organization: "",
    website: "",
  });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    await loadProfile(session.user.id);
  };

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("aesc_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      setProfile(data);
      setFormData({
        full_name: data.full_name || "",
        bio: data.bio || "",
        location: data.location || "",
        organization: data.organization || "",
        website: data.website || "",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("aesc_profiles")
        .update({
          full_name: formData.full_name,
          bio: formData.bio,
          location: formData.location,
          organization: formData.organization,
          website: formData.website,
        })
        .eq("id", profile.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      await loadProfile(profile.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file: File, type: 'avatar' | 'header') => {
    if (!profile) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}/${Math.random()}.${fileExt}`;
      const bucket = type === 'avatar' ? 'avatars' : 'header-images';

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      const updateField = type === 'avatar' ? 'avatar_url' : 'header_image_url';
      const { error: updateError } = await supabase
        .from('aesc_profiles')
        .update({ [updateField]: publicUrl })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      setProfile({ ...profile, [updateField]: publicUrl });
      toast({
        title: "Success",
        description: `${type === 'avatar' ? 'Profile picture' : 'Header image'} updated successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const calculateTrialDaysRemaining = () => {
    if (!profile?.trial_expires_at) return 0;
    const expiryDate = new Date(profile.trial_expires_at);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) return null;

  const trialDaysRemaining = calculateTrialDaysRemaining();
  const isTrialActive = profile.payment_status === "trial" && trialDaysRemaining > 0;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Hero Banner Section */}
      <div className="relative h-64 bg-gradient-primary group">
        {profile?.header_image_url ? (
          <img 
            src={profile.header_image_url} 
            alt="Header" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        )}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <Label htmlFor="header-upload" className="cursor-pointer">
            <div className="bg-background/90 backdrop-blur-sm p-2 rounded-lg shadow-lg hover:bg-background transition-colors">
              <Upload className="h-5 w-5" />
            </div>
            <Input
              id="header-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file, 'header');
              }}
              disabled={uploading}
            />
          </Label>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-12">
        {/* Profile Card */}
        <Card className="mb-6 shadow-elegant overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Avatar */}
              <div className="relative group">
                <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
                  <AvatarImage src={profile.avatar_url || undefined} />
                  <AvatarFallback className="text-4xl bg-gradient-primary text-primary-foreground font-bold">
                    {profile.full_name?.split(' ').map(n => n[0]).join('') || profile.email[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Label htmlFor="avatar-upload" className="absolute bottom-0 right-0 cursor-pointer">
                  <div className="p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors">
                    <Camera className="h-4 w-4" />
                  </div>
                  <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, 'avatar');
                    }}
                    disabled={uploading}
                  />
                </Label>
              </div>

              {/* Profile Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
                      {profile.full_name || "User Profile"}
                    </h1>
                    {profile.bio && (
                      <p className="text-muted-foreground text-lg mb-3">{profile.bio}</p>
                    )}
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-4 h-4" />
                        {profile.email}
                      </span>
                      {profile.location && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          {profile.location}
                        </span>
                      )}
                      {profile.organization && (
                        <span className="flex items-center gap-1.5">
                          <Building className="w-4 h-4" />
                          {profile.organization}
                        </span>
                      )}
                      {profile.website && (
                        <a 
                          href={profile.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 hover:text-primary transition-smooth"
                        >
                          <Globe className="w-4 h-4" />
                          Website
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Membership Badge */}
                  <div className="flex flex-col gap-2">
                    {profile.payment_status === "active" && (
                      <Badge variant="secondary" className="w-fit">
                        <CreditCard className="w-3 h-3 mr-1" />
                        Premium Member
                      </Badge>
                    )}
                    {isTrialActive && (
                      <Badge variant="outline" className="w-fit border-accent text-accent">
                        <Calendar className="w-3 h-3 mr-1" />
                        Trial: {trialDaysRemaining}d left
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Trial Alert */}
                {isTrialActive && trialDaysRemaining < 7 && (
                  <div className="flex items-center gap-3 p-4 bg-accent/10 border border-accent/20 rounded-lg">
                    <Calendar className="w-5 h-5 text-accent flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">Your trial expires soon!</p>
                      <p className="text-xs text-muted-foreground">
                        Upgrade to continue accessing premium features
                      </p>
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => navigate("/membership")}>
                      Upgrade
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="w-full justify-start bg-card border border-border mb-6 h-auto p-1">
            <TabsTrigger value="profile" className="data-[state=active]:bg-background">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-background">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-background">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Edit Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="border-b">
                <CardTitle className="text-xl">Edit Profile</CardTitle>
                <CardDescription>
                  Update your profile information to help others connect with you
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="text-base font-semibold">
                      Full Name *
                    </Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder="e.g., John Doe"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-base font-semibold">
                      Professional Headline
                    </Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="e.g., Energy Consultant | Sustainability Advocate | Climate Action Leader"
                      rows={3}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      A brief description of your professional role and interests
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-base font-semibold">
                        <MapPin className="w-4 h-4 inline mr-1.5" />
                        Location
                      </Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="City, Country"
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="organization" className="text-base font-semibold">
                        <Building className="w-4 h-4 inline mr-1.5" />
                        Organization
                      </Label>
                      <Input
                        id="organization"
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        placeholder="Your company or institution"
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-base font-semibold">
                      <Globe className="w-4 h-4 inline mr-1.5" />
                      Website
                    </Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://yourwebsite.com"
                      className="h-11"
                    />
                  </div>

                  <div className="flex justify-end pt-4 border-t">
                    <Button type="submit" disabled={saving} size="lg" className="min-w-32">
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="shadow-sm">
              <CardHeader className="border-b">
                <CardTitle className="text-xl">Notification Preferences</CardTitle>
                <CardDescription>
                  Manage how you receive updates from forums and discussions
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 p-6 bg-muted/50 rounded-lg border border-border">
                  <Bell className="w-8 h-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium mb-1">Forum Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Subscribe to specific forums to receive notifications about new posts and replies.
                      Visit the forum page to manage your subscriptions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            {/* Account Status Card */}
            <Card className="shadow-sm">
              <CardHeader className="border-b">
                <CardTitle className="text-xl">Account Status</CardTitle>
                <CardDescription>
                  View your membership details and trial information
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Status</p>
                      <Badge variant={isTrialActive ? "outline" : "secondary"} className="text-sm">
                        {profile.payment_status === "active" ? "Premium Member" : "Trial Period"}
                      </Badge>
                    </div>
                    
                    {profile.trial_started_at && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Trial Started</p>
                        <p className="text-base">
                          {new Date(profile.trial_started_at).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {isTrialActive && profile.trial_expires_at && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Trial Expires</p>
                        <p className="text-base">
                          {new Date(profile.trial_expires_at).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {isTrialActive && (
                  <div className="mt-6 p-5 bg-gradient-subtle border border-primary/20 rounded-lg">
                    <div className="flex items-start gap-4">
                      <CreditCard className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">Unlock Premium Features</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Get unlimited access to all forums, exclusive content, and priority support
                        </p>
                        <Button 
                          onClick={() => navigate("/membership")}
                          className="w-full md:w-auto"
                        >
                          View Membership Plans
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Actions Card */}
            <Card className="shadow-sm">
              <CardHeader className="border-b">
                <CardTitle className="text-xl">Account Actions</CardTitle>
                <CardDescription>
                  Manage your account security and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-smooth">
                    <div>
                      <p className="font-medium">Sign Out</p>
                      <p className="text-sm text-muted-foreground">
                        End your current session
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={async () => {
                        await supabase.auth.signOut();
                        navigate("/");
                      }}
                    >
                      Sign Out
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}