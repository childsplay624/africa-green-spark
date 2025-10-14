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
  Upload,
  Briefcase,
  Award,
  TrendingUp,
  Edit2,
  Eye,
  Plus,
  Trash2,
  Link as LinkIcon
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface UserActivity {
  id: string;
  user_id: string;
  type: string;
  title: string;
  description: string | null;
  link: string | null;
  created_at: string;
  metadata: any;
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
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [isActivityDialogOpen, setIsActivityDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<UserActivity | null>(null);
  const [activityForm, setActivityForm] = useState({
    type: "achievement",
    title: "",
    description: "",
    link: "",
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
      
      await loadActivities(userId);
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

  const loadActivities = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_activities")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setActivities(data || []);
    } catch (error: any) {
      console.error("Error loading activities:", error);
    }
  };

  const handleSaveActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    try {
      if (editingActivity) {
        // Update existing activity
        const { error } = await supabase
          .from("user_activities")
          .update({
            type: activityForm.type,
            title: activityForm.title,
            description: activityForm.description || null,
            link: activityForm.link || null,
          })
          .eq("id", editingActivity.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Activity updated successfully",
        });
      } else {
        // Create new activity
        const { error } = await supabase
          .from("user_activities")
          .insert({
            user_id: profile.id,
            type: activityForm.type,
            title: activityForm.title,
            description: activityForm.description || null,
            link: activityForm.link || null,
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Activity added successfully",
        });
      }

      await loadActivities(profile.id);
      setIsActivityDialogOpen(false);
      setActivityForm({ type: "achievement", title: "", description: "", link: "" });
      setEditingActivity(null);
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

  const handleEditActivity = (activity: UserActivity) => {
    setEditingActivity(activity);
    setActivityForm({
      type: activity.type,
      title: activity.title,
      description: activity.description || "",
      link: activity.link || "",
    });
    setIsActivityDialogOpen(true);
  };

  const handleDeleteActivity = async (activityId: string) => {
    if (!profile) return;
    if (!confirm("Are you sure you want to delete this activity?")) return;

    try {
      const { error } = await supabase
        .from("user_activities")
        .delete()
        .eq("id", activityId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Activity deleted successfully",
      });

      await loadActivities(profile.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
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

  // Calculate profile completeness
  const calculateProfileCompletion = () => {
    let score = 0;
    if (profile.full_name) score += 20;
    if (profile.bio) score += 20;
    if (profile.location) score += 15;
    if (profile.organization) score += 15;
    if (profile.website) score += 15;
    if (profile.avatar_url) score += 15;
    return score;
  };

  const profileCompletion = calculateProfileCompletion();

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Hero Banner Section - LinkedIn Style */}
      <div className="relative h-48 md:h-64 bg-gradient-primary group">
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
              <Camera className="h-4 w-4" />
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

      {/* Main Container with Two Column Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header Card */}
            <Card className="shadow-lg overflow-visible">
              <CardContent className="p-6 md:p-8 pb-6">
                <div className="flex flex-col sm:flex-row gap-6 items-start relative">
                  {/* Avatar - Overlapping Header */}
                  <div className="relative -mt-20 group">
                    <Avatar className="w-40 h-40 border-4 border-background shadow-xl">
                      <AvatarImage src={profile.avatar_url || undefined} />
                      <AvatarFallback className="text-5xl bg-gradient-primary text-primary-foreground font-bold">
                        {profile.full_name?.split(' ').map(n => n[0]).join('') || profile.email[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <Label htmlFor="avatar-upload" className="absolute bottom-2 right-2 cursor-pointer">
                      <div className="p-2.5 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors">
                        <Camera className="h-5 w-5" />
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
                  <div className="flex-1 min-w-0 sm:mt-12">
                    <div className="mb-4">
                      <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
                        {profile.full_name || "User Profile"}
                      </h1>
                      {profile.bio && (
                        <p className="text-lg text-foreground/80 mb-2 font-medium">{profile.bio}</p>
                      )}
                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        {profile.organization && (
                          <span className="flex items-center gap-1.5">
                            <Building className="w-4 h-4" />
                            {profile.organization}
                          </span>
                        )}
                        {profile.location && (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            {profile.location}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {profile.payment_status === "active" && (
                        <Badge variant="secondary">
                          <Award className="w-3 h-3 mr-1" />
                          Premium Member
                        </Badge>
                      )}
                      {isTrialActive && (
                        <Badge variant="outline" className="border-accent text-accent">
                          <Calendar className="w-3 h-3 mr-1" />
                          {trialDaysRemaining} days trial
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About Section */}
            <Card className="shadow-sm">
              <CardHeader className="border-b flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">About</CardTitle>
                  <CardDescription>Professional summary and background</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {profile.bio ? (
                  <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
                ) : (
                  <p className="text-muted-foreground italic">Add a professional headline to help others understand your expertise.</p>
                )}
              </CardContent>
            </Card>

            {/* Experience Section */}
            <Card className="shadow-sm">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      Experience
                    </CardTitle>
                    <CardDescription>Your professional journey</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {profile.organization ? (
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Building className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{profile.organization}</h3>
                        <p className="text-sm text-muted-foreground">{profile.bio || "Professional"}</p>
                        {profile.location && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {profile.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">Add your organization to showcase your professional experience.</p>
                )}
              </CardContent>
            </Card>

            {/* Activity Section */}
            <Card className="shadow-sm">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Activity
                    </CardTitle>
                    <CardDescription>Your recent engagement and contributions</CardDescription>
                  </div>
                  <Dialog open={isActivityDialogOpen} onOpenChange={setIsActivityDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" onClick={() => {
                        setEditingActivity(null);
                        setActivityForm({ type: "achievement", title: "", description: "", link: "" });
                      }}>
                        <Plus className="w-4 h-4 mr-1.5" />
                        Add Activity
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>{editingActivity ? "Edit Activity" : "Add Activity"}</DialogTitle>
                        <DialogDescription>
                          Share your professional achievements and contributions
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSaveActivity} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="type">Activity Type</Label>
                          <Select
                            value={activityForm.type}
                            onValueChange={(value) => setActivityForm({ ...activityForm, type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="achievement">Achievement</SelectItem>
                              <SelectItem value="post">Post</SelectItem>
                              <SelectItem value="forum_post">Forum Post</SelectItem>
                              <SelectItem value="comment">Comment</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="title">Title *</Label>
                          <Input
                            id="title"
                            value={activityForm.title}
                            onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })}
                            placeholder="e.g., Published research paper on renewable energy"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={activityForm.description}
                            onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
                            placeholder="Add more details about this activity..."
                            rows={3}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="link">Link (optional)</Label>
                          <Input
                            id="link"
                            type="url"
                            value={activityForm.link}
                            onChange={(e) => setActivityForm({ ...activityForm, link: e.target.value })}
                            placeholder="https://..."
                          />
                        </div>
                        
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => setIsActivityDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" disabled={saving}>
                            {saving ? "Saving..." : editingActivity ? "Update" : "Add Activity"}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {activities.length > 0 ? (
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex gap-4 p-4 rounded-lg border hover:border-primary/50 transition-colors">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            {activity.type === "achievement" && <Award className="w-5 h-5 text-primary" />}
                            {activity.type === "post" && <TrendingUp className="w-5 h-5 text-primary" />}
                            {activity.type === "forum_post" && <Briefcase className="w-5 h-5 text-primary" />}
                            {activity.type === "comment" && <Eye className="w-5 h-5 text-primary" />}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-base mb-1">{activity.title}</h4>
                          {activity.description && (
                            <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(activity.created_at).toLocaleDateString()}
                            </span>
                            {activity.link && (
                              <a 
                                href={activity.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:text-primary transition-colors"
                              >
                                <LinkIcon className="w-3 h-3" />
                                View Link
                              </a>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditActivity(activity)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteActivity(activity.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic text-center py-8">
                    No activities yet. Add your first achievement or contribution!
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Edit Profile Section */}
            <Card className="shadow-sm">
              <CardHeader className="border-b">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Edit2 className="w-5 h-5" />
                  Edit Profile
                </CardTitle>
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
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Strength Card */}
            <Card className="shadow-sm border-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Profile Strength
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {profileCompletion < 50 ? "Beginner" : profileCompletion < 80 ? "Intermediate" : "All-Star"}
                      </span>
                      <span className="text-sm font-bold text-primary">{profileCompletion}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${profileCompletion}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Complete your profile to increase visibility and networking opportunities.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info Card */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
                      <p className="text-sm break-all">{profile.email}</p>
                    </div>
                  </div>

                  {profile.location && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Location</p>
                        <p className="text-sm">{profile.location}</p>
                      </div>
                    </div>
                  )}

                  {profile.organization && (
                    <div className="flex items-start gap-3">
                      <Building className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Organization</p>
                        <p className="text-sm">{profile.organization}</p>
                      </div>
                    </div>
                  )}

                  {profile.website && (
                    <div className="flex items-start gap-3">
                      <Globe className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Website</p>
                        <a 
                          href={profile.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline break-all"
                        >
                          {profile.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Membership Status Card */}
            {isTrialActive && (
              <Card className="shadow-sm border-accent/50">
                <CardHeader className="pb-3 border-b border-accent/20">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-accent" />
                    Trial Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <div>
                      <p className="text-2xl font-bold text-accent">{trialDaysRemaining}</p>
                      <p className="text-sm text-muted-foreground">Days Remaining</p>
                    </div>
                    
                    {profile.trial_expires_at && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Expires on</p>
                        <p className="text-sm font-medium">
                          {new Date(profile.trial_expires_at).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    )}

                    <Button 
                      className="w-full" 
                      variant="default"
                      onClick={() => navigate("/membership")}
                    >
                      Upgrade Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notifications Settings */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-3">
                  Subscribe to forums to receive updates about new posts and replies.
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full"
                  onClick={() => navigate("/forum")}
                >
                  Manage Subscriptions
                </Button>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Account
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Account Status</p>
                  <Badge variant={isTrialActive ? "outline" : "secondary"} className="text-sm">
                    {profile.payment_status === "active" ? "Premium Member" : "Trial Period"}
                  </Badge>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    navigate("/");
                  }}
                >
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}