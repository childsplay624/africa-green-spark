import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, CreditCard, TrendingUp } from "lucide-react";

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalForums: 0,
    totalPosts: 0,
    activeMemberships: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const [users, forums, posts, memberships] = await Promise.all([
      supabase.from("aesc_profiles").select("id", { count: "exact", head: true }),
      supabase.from("forums").select("id", { count: "exact", head: true }),
      supabase.from("forum_posts").select("id", { count: "exact", head: true }),
      supabase.from("aesc_user_memberships").select("id", { count: "exact", head: true }).eq("status", "active"),
    ]);

    setStats({
      totalUsers: users.count || 0,
      totalForums: forums.count || 0,
      totalPosts: posts.count || 0,
      activeMemberships: memberships.count || 0,
    });
  };

  const statCards = [
    { title: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-500" },
    { title: "Total Forums", value: stats.totalForums, icon: MessageSquare, color: "text-green-500" },
    { title: "Total Posts", value: stats.totalPosts, icon: TrendingUp, color: "text-purple-500" },
    { title: "Active Memberships", value: stats.activeMemberships, icon: CreditCard, color: "text-orange-500" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => (
        <Card key={stat.title} className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stat.value.toLocaleString()}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
