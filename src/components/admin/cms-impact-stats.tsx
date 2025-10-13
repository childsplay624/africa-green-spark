import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, ArrowUp, ArrowDown } from "lucide-react";

interface ImpactStat {
  id: string;
  label: string;
  value: string;
  icon: string | null;
  display_order: number;
  is_active: boolean;
}

export function CmsImpactStats() {
  const [stats, setStats] = useState<ImpactStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    label: "",
    value: "",
    icon: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data, error } = await supabase
        .from("cms_impact_stats")
        .select("*")
        .order("display_order");

      if (error) throw error;
      setStats(data || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const { error } = await supabase
          .from("cms_impact_stats")
          .update(formData)
          .eq("id", editingId);
        if (error) throw error;
      } else {
        const maxOrder = Math.max(...stats.map(s => s.display_order), -1);
        const { error } = await supabase
          .from("cms_impact_stats")
          .insert([{ ...formData, display_order: maxOrder + 1 }]);
        if (error) throw error;
      }

      toast({ title: "Success", description: `Stat ${editingId ? "updated" : "created"}` });
      setDialogOpen(false);
      resetForm();
      loadStats();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleEdit = (stat: ImpactStat) => {
    setEditingId(stat.id);
    setFormData({
      label: stat.label,
      value: stat.value,
      icon: stat.icon || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("cms_impact_stats").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Success", description: "Stat deleted" });
      loadStats();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const moveItem = async (id: string, direction: "up" | "down") => {
    const index = stats.findIndex(s => s.id === id);
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === stats.length - 1)
    ) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const temp = [...stats];
    [temp[index], temp[newIndex]] = [temp[newIndex], temp[index]];

    try {
      await Promise.all(
        temp.map((stat, idx) =>
          supabase.from("cms_impact_stats").update({ display_order: idx }).eq("id", stat.id)
        )
      );
      loadStats();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ label: "", value: "", icon: "" });
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Impact Stats</CardTitle>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Stat
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit" : "Add"} Impact Stat</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Label</Label>
                <Input value={formData.label} onChange={(e) => setFormData({ ...formData, label: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Value</Label>
                <Input value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Icon (emoji or lucide icon name)</Label>
                <Input value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} placeholder="⚡ or Zap" />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit">{editingId ? "Update" : "Create"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Label</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Icon</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.map((stat, index) => (
              <TableRow key={stat.id}>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => moveItem(stat.id, "up")} disabled={index === 0}>
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => moveItem(stat.id, "down")} disabled={index === stats.length - 1}>
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{stat.label}</TableCell>
                <TableCell>{stat.value}</TableCell>
                <TableCell>{stat.icon}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(stat)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(stat.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
