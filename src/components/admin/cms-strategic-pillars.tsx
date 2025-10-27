import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, ArrowUp, ArrowDown } from "lucide-react";

interface StrategicPillar {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: string | null;
  color: string | null;
  bg_color: string | null;
  display_order: number;
  is_active: boolean;
}

export function CmsStrategicPillars() {
  const [pillars, setPillars] = useState<StrategicPillar[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    number: "",
    title: "",
    description: "",
    icon: "",
    color: "",
    bg_color: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    loadPillars();
  }, []);

  const loadPillars = async () => {
    try {
      const { data, error } = await supabase
        .from("cms_strategic_pillars")
        .select("*")
        .order("display_order");

      if (error) throw error;
      setPillars(data || []);
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
          .from("cms_strategic_pillars")
          .update(formData)
          .eq("id", editingId);
        if (error) throw error;
      } else {
        const maxOrder = Math.max(...pillars.map(p => p.display_order), -1);
        const { error } = await supabase
          .from("cms_strategic_pillars")
          .insert([{ ...formData, display_order: maxOrder + 1 }]);
        if (error) throw error;
      }

      toast({ title: "Success", description: `Pillar ${editingId ? "updated" : "created"}` });
      setDialogOpen(false);
      resetForm();
      loadPillars();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleEdit = (pillar: StrategicPillar) => {
    setEditingId(pillar.id);
    setFormData({
      number: pillar.number,
      title: pillar.title,
      description: pillar.description,
      icon: pillar.icon || "",
      color: pillar.color || "",
      bg_color: pillar.bg_color || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("cms_strategic_pillars").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Success", description: "Pillar deleted" });
      loadPillars();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const moveItem = async (id: string, direction: "up" | "down") => {
    const index = pillars.findIndex(p => p.id === id);
    if ((direction === "up" && index === 0) || (direction === "down" && index === pillars.length - 1)) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const temp = [...pillars];
    [temp[index], temp[newIndex]] = [temp[newIndex], temp[index]];

    try {
      await Promise.all(
        temp.map((pillar, idx) =>
          supabase.from("cms_strategic_pillars").update({ display_order: idx }).eq("id", pillar.id)
        )
      );
      loadPillars();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ number: "", title: "", description: "", icon: "", color: "", bg_color: "" });
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Strategic Pillars</CardTitle>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Pillar
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit" : "Add"} Strategic Pillar</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Number</Label>
                <Input value={formData.number} onChange={(e) => setFormData({ ...formData, number: e.target.value })} required placeholder="1" />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required rows={5} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Icon</Label>
                  <Input value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} placeholder="Building2" />
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <Input value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} placeholder="text-primary" />
                </div>
                <div className="space-y-2">
                  <Label>BG Color</Label>
                  <Input value={formData.bg_color} onChange={(e) => setFormData({ ...formData, bg_color: e.target.value })} placeholder="bg-primary/10" />
                </div>
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
              <TableHead>#</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pillars.map((pillar, index) => (
              <TableRow key={pillar.id}>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => moveItem(pillar.id, "up")} disabled={index === 0}>
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => moveItem(pillar.id, "down")} disabled={index === pillars.length - 1}>
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{pillar.number}</TableCell>
                <TableCell className="font-medium">{pillar.title}</TableCell>
                <TableCell className="max-w-xs truncate">{pillar.description}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(pillar)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(pillar.id)}>
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
