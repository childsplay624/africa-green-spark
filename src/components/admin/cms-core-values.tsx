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

interface CoreValue {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  color: string | null;
  display_order: number;
  is_active: boolean;
}

export function CmsCoreValues() {
  const [values, setValues] = useState<CoreValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "",
    color: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    loadValues();
  }, []);

  const loadValues = async () => {
    try {
      const { data, error } = await supabase
        .from("cms_core_values")
        .select("*")
        .order("display_order");

      if (error) throw error;
      setValues(data || []);
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
          .from("cms_core_values")
          .update(formData)
          .eq("id", editingId);
        if (error) throw error;
      } else {
        const maxOrder = Math.max(...values.map(v => v.display_order), -1);
        const { error } = await supabase
          .from("cms_core_values")
          .insert([{ ...formData, display_order: maxOrder + 1 }]);
        if (error) throw error;
      }

      toast({ title: "Success", description: `Value ${editingId ? "updated" : "created"}` });
      setDialogOpen(false);
      resetForm();
      loadValues();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleEdit = (value: CoreValue) => {
    setEditingId(value.id);
    setFormData({
      title: value.title,
      description: value.description,
      icon: value.icon || "",
      color: value.color || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("cms_core_values").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Success", description: "Value deleted" });
      loadValues();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const moveItem = async (id: string, direction: "up" | "down") => {
    const index = values.findIndex(v => v.id === id);
    if ((direction === "up" && index === 0) || (direction === "down" && index === values.length - 1)) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const temp = [...values];
    [temp[index], temp[newIndex]] = [temp[newIndex], temp[index]];

    try {
      await Promise.all(
        temp.map((value, idx) =>
          supabase.from("cms_core_values").update({ display_order: idx }).eq("id", value.id)
        )
      );
      loadValues();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ title: "", description: "", icon: "", color: "" });
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Core Values</CardTitle>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Value
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit" : "Add"} Core Value</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Icon (Lucide icon name)</Label>
                <Input value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} placeholder="Lightbulb" />
              </div>
              <div className="space-y-2">
                <Label>Color (gradient classes)</Label>
                <Input value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} placeholder="from-blue-500 to-blue-600" />
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
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Icon</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {values.map((value, index) => (
              <TableRow key={value.id}>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => moveItem(value.id, "up")} disabled={index === 0}>
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => moveItem(value.id, "down")} disabled={index === values.length - 1}>
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{value.title}</TableCell>
                <TableCell className="max-w-md truncate">{value.description}</TableCell>
                <TableCell>{value.icon}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(value)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(value.id)}>
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
