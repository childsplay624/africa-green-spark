import { useAdminCheck } from "@/hooks/use-admin-check";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, MessageSquare, CreditCard, Shield, Bell, LayoutDashboard, FileText, Key } from "lucide-react";
import { AdminUsers } from "@/components/admin/admin-users";
import { AdminForums } from "@/components/admin/admin-forums";
import { AdminPosts } from "@/components/admin/admin-posts";
import { AdminMemberships } from "@/components/admin/admin-memberships";
import { AdminNotifications } from "@/components/admin/admin-notifications";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { CmsHeroSections } from "@/components/admin/cms-hero-sections";
import { CmsNewsArticles } from "@/components/admin/cms-news-articles";
import { CmsImpactStats } from "@/components/admin/cms-impact-stats";
import { CmsInitiatives } from "@/components/admin/cms-initiatives";
import { CmsPartners } from "@/components/admin/cms-partners";
import { AdminApiKeys } from "@/components/admin/admin-api-keys";

export default function Admin() {
  const { loading } = useAdminCheck();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="bg-gradient-primary border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary-foreground" />
            <div>
              <h1 className="text-3xl font-display font-bold text-primary-foreground">Admin Dashboard</h1>
              <p className="text-primary-foreground/80 mt-1">Manage your entire platform</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="w-full justify-start bg-card border border-border mb-6 h-auto p-1 flex-wrap">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-background">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-background">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="forums" className="data-[state=active]:bg-background">
              <MessageSquare className="w-4 h-4 mr-2" />
              Forums
            </TabsTrigger>
            <TabsTrigger value="posts" className="data-[state=active]:bg-background">
              <MessageSquare className="w-4 h-4 mr-2" />
              Posts
            </TabsTrigger>
            <TabsTrigger value="memberships" className="data-[state=active]:bg-background">
              <CreditCard className="w-4 h-4 mr-2" />
              Memberships
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-background">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="cms" className="data-[state=active]:bg-background">
              <FileText className="w-4 h-4 mr-2" />
              CMS
            </TabsTrigger>
            <TabsTrigger value="api-keys" className="data-[state=active]:bg-background">
              <Key className="w-4 h-4 mr-2" />
              API Keys
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AdminDashboard />
          </TabsContent>

          <TabsContent value="users">
            <AdminUsers />
          </TabsContent>

          <TabsContent value="forums">
            <AdminForums />
          </TabsContent>

          <TabsContent value="posts">
            <AdminPosts />
          </TabsContent>

          <TabsContent value="memberships">
            <AdminMemberships />
          </TabsContent>

          <TabsContent value="notifications">
            <AdminNotifications />
          </TabsContent>

          <TabsContent value="cms" className="space-y-6">
            <CmsHeroSections />
            <CmsImpactStats />
            <CmsInitiatives />
            <CmsPartners />
            <CmsNewsArticles />
          </TabsContent>

          <TabsContent value="api-keys">
            <AdminApiKeys />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
