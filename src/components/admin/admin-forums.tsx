import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Eye, EyeOff } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

interface Forum {
  id: string;
  title: string;
  description: string;
  category: string;
  is_public: boolean;
  created_at: string;
}

export function AdminForums() {
  const [forums, setForums] = useState<Forum[]>([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return <div className="text-center py-12">Loading forums...</div>;
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Forum Management</CardTitle>
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
      </CardContent>
    </Card>
  );
}
