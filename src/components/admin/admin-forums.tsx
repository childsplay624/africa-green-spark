import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Eye, EyeOff, Plus, Pencil } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface Forum {
  id: string;
  title: string;
  description: string;
  category: string;
  is_public: boolean;
  created_at: string;
  icon?: string;
}

const lucideIcons = [
  "Users", "Zap", "Leaf", "DollarSign", "Globe", "Lightbulb", "TrendingUp",
  "Battery", "Sun", "Wind", "Droplet", "Recycle", "Shield", "Target",
  "Rocket", "Award", "Book", "Briefcase", "Building", "Heart"
];

export function AdminForums() {
  const [forums, setForums] = useState<Forum[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingForum, setEditingForum] = useState<Forum | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    is_public: true,
    icon: "Users",
  });
  const { toast } = useToast();

  useEffect(() => {
    loadForums();
  }, []);

  const loadForums = async () => {
    try {
      const { data, error } = await supabase
        .from("forums")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setForums(data || []);
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

  const toggleVisibility = async (forumId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("forums")
        .update({ is_public: !currentStatus })
        .eq("id", forumId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Forum visibility updated",
      });

      loadForums();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteForum = async (forumId: string) => {
    try {
      const { error } = await supabase.from("forums").delete().eq("id", forumId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Forum deleted successfully",
      });

      loadForums();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCreateForum = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("forums").insert({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        is_public: formData.is_public,
        icon: formData.icon,
        creator_id: user.id,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Forum created successfully",
      });

      setShowCreateDialog(false);
      setFormData({ title: "", description: "", category: "", is_public: true, icon: "Users" });
      loadForums();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditForum = async () => {
    if (!editingForum) return;

    try {
      const { error } = await supabase
        .from("forums")
        .update({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          is_public: formData.is_public,
          icon: formData.icon,
        })
        .eq("id", editingForum.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Forum updated successfully",
      });

      setShowEditDialog(false);
      setEditingForum(null);
      setFormData({ title: "", description: "", category: "", is_public: true, icon: "Users" });
      loadForums();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (forum: Forum) => {
    setEditingForum(forum);
    setFormData({
      title: forum.title,
      description: forum.description,
      category: forum.category,
      is_public: forum.is_public,
      icon: forum.icon || "Users",
    });
    setShowEditDialog(true);
  };

  if (loading) {
    return <div className="text-center py-12">Loading forums...</div>;
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Forum Management</CardTitle>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Forum
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Forum</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter forum title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter forum description"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., General, Technical, etc."
                />
              </div>
              <div>
                <Label htmlFor="icon">Icon</Label>
                <Select
                  value={formData.icon}
                  onValueChange={(value) => setFormData({ ...formData, icon: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {lucideIcons.map((icon) => (
                      <SelectItem key={icon} value={icon}>
                        {icon}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_public"
                  checked={formData.is_public}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_public: checked })}
                />
                <Label htmlFor="is_public">Public forum</Label>
              </div>
              <Button onClick={handleCreateForum} className="w-full">
                Create Forum
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {forums.map((forum) => (
              <TableRow key={forum.id}>
                <TableCell className="font-medium">{forum.title}</TableCell>
                <TableCell>
                  <Badge variant="outline">{forum.category}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={forum.is_public ? "secondary" : "outline"}>
                    {forum.is_public ? "Public" : "Private"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(forum.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(forum)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleVisibility(forum.id, forum.is_public)}
                    >
                      {forum.is_public ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Forum</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will delete all posts and replies in this forum. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteForum(forum.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Forum</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter forum title"
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter forum description"
                />
              </div>
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Input
                  id="edit-category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., General, Technical, etc."
                />
              </div>
              <div>
                <Label htmlFor="edit-icon">Icon</Label>
                <Select
                  value={formData.icon}
                  onValueChange={(value) => setFormData({ ...formData, icon: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {lucideIcons.map((icon) => (
                      <SelectItem key={icon} value={icon}>
                        {icon}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-is_public"
                  checked={formData.is_public}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_public: checked })}
                />
                <Label htmlFor="edit-is_public">Public forum</Label>
              </div>
              <Button onClick={handleEditForum} className="w-full">
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
