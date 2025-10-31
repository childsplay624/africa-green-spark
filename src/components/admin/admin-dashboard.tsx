import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, CreditCard, TrendingUp, DollarSign, Activity, FileText } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalForums: 0,
    totalPosts: 0,
    activeMemberships: 0,
    totalRevenue: 0,
    recentActivity: 0,
    totalVisits: 0,
  });
  const [userGrowth, setUserGrowth] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);

  useEffect(() => {
    loadStats();
    loadUserGrowth();
    loadRevenueData();
  }, []);

  const loadStats = async () => {
    const [users, forums, posts, memberships, revenue, activity, visits] = await Promise.all([
      supabase.from("aesc_profiles").select("id", { count: "exact", head: true }),
      supabase.from("forums").select("id", { count: "exact", head: true }),
      supabase.from("forum_posts").select("id", { count: "exact", head: true }),
      supabase.from("aesc_user_memberships").select("id", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("payment_records").select("amount").eq("status", "completed"),
      supabase.from("user_activities").select("id", { count: "exact", head: true })
        .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
      // Count unique sessions, excluding bots
      supabase.from("site_visits")
        .select("session_id", { count: "exact", head: true })
        .eq("is_bot", false)
        .not("session_id", "is", null)
    ]);

    const totalRevenue = revenue.data?.reduce((sum, record) => sum + Number(record.amount), 0) || 0;

    setStats({
      totalUsers: users.count || 0,
      totalForums: forums.count || 0,
      totalPosts: posts.count || 0,
      activeMemberships: memberships.count || 0,
      totalRevenue,
      recentActivity: activity.count || 0,
      totalVisits: visits.count || 0,
    });
  };

  const loadUserGrowth = async () => {
    const { data } = await supabase
      .from("aesc_profiles")
      .select("created_at")
      .order("created_at", { ascending: true });

    if (data) {
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split('T')[0];
      });

      const growthData = last7Days.map(date => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        users: data.filter(u => u.created_at.startsWith(date)).length
      }));

      setUserGrowth(growthData);
    }
  };

  const loadRevenueData = async () => {
    const { data } = await supabase
      .from("payment_records")
      .select("amount, created_at")
      .eq("status", "completed")
      .order("created_at", { ascending: true });

    if (data) {
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split('T')[0];
      });

      const revenueByDay = last7Days.map(date => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: data
          .filter(r => r.created_at.startsWith(date))
          .reduce((sum, r) => sum + Number(r.amount), 0)
      }));

      setRevenueData(revenueByDay);
    }
  };

  const statCards = [
    { title: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-500" },
    { title: "Total Forums", value: stats.totalForums, icon: MessageSquare, color: "text-green-500" },
    { title: "Total Posts", value: stats.totalPosts, icon: FileText, color: "text-purple-500" },
    { title: "Active Memberships", value: stats.activeMemberships, icon: CreditCard, color: "text-orange-500" },
    { title: "Total Revenue", value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: "text-emerald-500" },
    { title: "Recent Activity (7d)", value: stats.recentActivity, icon: Activity, color: "text-pink-500" },
    { title: "Unique Visitors", value: stats.totalVisits, icon: TrendingUp, color: "text-cyan-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {typeof stat.value === 'string' ? stat.value : stat.value.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              User Growth (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-500" />
              Revenue (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Bar dataKey="revenue" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
