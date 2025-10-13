import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";

export function CmsInitiatives() {
  const [initiatives, setInitiatives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "Leaf",
    category: "",
    display_order: 0,
    is_active: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    loadInitiatives();
  }, []);

  const loadInitiatives = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("cms_initiatives")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load initiatives",
        variant: "destructive",
      });
    } else {
      setInitiatives(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      const { error } = await supabase
        .from("cms_initiatives")
        .update(formData)
        .eq("id", editingId);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update initiative",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Initiative updated successfully",
        });
        resetForm();
        loadInitiatives();
      }
    } else {
      const { error } = await supabase
        .from("cms_initiatives")
        .insert([formData]);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create initiative",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Initiative created successfully",
        });
        resetForm();
        loadInitiatives();
      }
    }
  };

  const handleEdit = (initiative: any) => {
    setEditingId(initiative.id);
    setFormData({
      title: initiative.title,
      description: initiative.description,
      icon: initiative.icon || "Leaf",
      category: initiative.category || "",
      display_order: initiative.display_order || 0,
      is_active: initiative.is_active,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this initiative?")) return;

    const { error } = await supabase
      .from("cms_initiatives")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete initiative",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Initiative deleted successfully",
      });
      loadInitiatives();
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      icon: "Leaf",
      category: "",
      display_order: 0,
      is_active: true,
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Initiatives</CardTitle>
        <CardDescription>Create and manage initiatives displayed on the homepage</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-muted/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="icon">Icon</Label>
              <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Leaf">Leaf</SelectItem>
                  <SelectItem value="Zap">Zap</SelectItem>
                  <SelectItem value="Handshake">Handshake</SelectItem>
                  <SelectItem value="Recycle">Recycle</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="category">Category (optional)</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={3}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label htmlFor="is_active">Active</Label>
          </div>
          <div className="flex gap-2">
            <Button type="submit">
              {editingId ? "Update" : <><Plus className="w-4 h-4 mr-2" /> Create</>}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>

        {/* List */}
        <div className="space-y-4">
          <h3 className="font-semibold">Existing Initiatives</h3>
          {initiatives.map((initiative) => (
            <Card key={initiative.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{initiative.title}</h4>
                      {!initiative.is_active && (
                        <span className="text-xs bg-muted px-2 py-1 rounded">Inactive</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{initiative.description}</p>
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Icon: {initiative.icon}</span>
                      {initiative.category && <span>Category: {initiative.category}</span>}
                      <span>Order: {initiative.display_order}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(initiative)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(initiative.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
