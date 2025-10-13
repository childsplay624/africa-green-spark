import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Pencil, Trash2, Plus, Save, X } from "lucide-react";
import { toast } from "sonner";

interface PageContent {
  id: string;
  page_slug: string;
  title: string;
  content: any;
  meta_description: string | null;
  is_published: boolean;
}

export const CmsPageContent = () => {
  const [pages, setPages] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<PageContent | null>(null);
  const [editingSections, setEditingSections] = useState<{ [key: string]: boolean }>({});
  const [sectionValues, setSectionValues] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    page_slug: "",
    title: "",
    content: "",
    meta_description: "",
    is_published: true,
  });

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      const { data, error } = await supabase
        .from("cms_page_content")
        .select("*")
        .order("page_slug");

      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      console.error("Error loading pages:", error);
      toast.error("Failed to load page content");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const contentData = {
        page_slug: formData.page_slug,
        title: formData.title,
        content: { body: formData.content },
        meta_description: formData.meta_description,
        is_published: formData.is_published,
      };

      if (editingPage) {
        const { error } = await supabase
          .from("cms_page_content")
          .update(contentData)
          .eq("id", editingPage.id);

        if (error) throw error;
        toast.success("Page content updated successfully");
      } else {
        const { error } = await supabase
          .from("cms_page_content")
          .insert([contentData]);

        if (error) throw error;
        toast.success("Page content created successfully");
      }

      setOpen(false);
      resetForm();
      loadPages();
    } catch (error) {
      console.error("Error saving page content:", error);
      toast.error("Failed to save page content");
    }
  };

  const handleEdit = (page: PageContent) => {
    setEditingPage(page);
    setFormData({
      page_slug: page.page_slug,
      title: page.title,
      content: page.content?.body || "",
      meta_description: page.meta_description || "",
      is_published: page.is_published,
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this page content?")) return;

    try {
      const { error } = await supabase
        .from("cms_page_content")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Page content deleted successfully");
      loadPages();
    } catch (error) {
      console.error("Error deleting page content:", error);
      toast.error("Failed to delete page content");
    }
  };

  const resetForm = () => {
    setEditingPage(null);
    setFormData({
      page_slug: "",
      title: "",
      content: "",
      meta_description: "",
      is_published: true,
    });
  };

  const handleSectionEdit = (pageId: string, sectionKey: string, currentValue: any) => {
    const key = `${pageId}-${sectionKey}`;
    setEditingSections({ ...editingSections, [key]: true });
    setSectionValues({ ...sectionValues, [key]: JSON.stringify(currentValue, null, 2) });
  };

  const handleSectionCancel = (pageId: string, sectionKey: string) => {
    const key = `${pageId}-${sectionKey}`;
    const newEditingSections = { ...editingSections };
    delete newEditingSections[key];
    setEditingSections(newEditingSections);
  };

  const handleSectionSave = async (pageId: string, sectionKey: string) => {
    const key = `${pageId}-${sectionKey}`;
    try {
      const parsedValue = JSON.parse(sectionValues[key]);
      const page = pages.find(p => p.id === pageId);
      if (!page) return;

      const updatedContent = {
        ...page.content,
        [sectionKey]: parsedValue
      };

      const { error } = await supabase
        .from('cms_page_content')
        .update({ content: updatedContent })
        .eq('id', pageId);

      if (error) throw error;

      toast.success("Section updated successfully");
      loadPages();
      handleSectionCancel(pageId, sectionKey);
    } catch (error: any) {
      console.error("Error saving section:", error);
      toast.error(error.message || "Failed to save section");
    }
  };

  const renderSectionEditor = (page: PageContent, sectionKey: string, sectionValue: any) => {
    const key = `${page.id}-${sectionKey}`;
    const isEditing = editingSections[key];
    const editValue = sectionValues[key] || JSON.stringify(sectionValue, null, 2);

    return (
      <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <Label className="text-sm font-semibold capitalize">
            {sectionKey.replace(/([A-Z])/g, ' $1').trim()}
          </Label>
          {!isEditing ? (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => handleSectionEdit(page.id, sectionKey, sectionValue)}
            >
              <Pencil className="h-3 w-3 mr-1" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleSectionCancel(page.id, sectionKey)}
              >
                <X className="h-3 w-3 mr-1" />
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={() => handleSectionSave(page.id, sectionKey)}
              >
                <Save className="h-3 w-3 mr-1" />
                Save
              </Button>
            </div>
          )}
        </div>
        {isEditing ? (
          <Textarea
            value={editValue}
            onChange={(e) => setSectionValues({ ...sectionValues, [key]: e.target.value })}
            rows={10}
            className="font-mono text-sm"
          />
        ) : (
          <pre className="text-xs bg-background p-3 rounded border overflow-x-auto max-h-60">
            {JSON.stringify(sectionValue, null, 2)}
          </pre>
        )}
      </div>
    );
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Page Content Management</CardTitle>
            <CardDescription>Manage content for all pages and their sections</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Page Content
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingPage ? "Edit Page Content" : "Add Page Content"}
                </DialogTitle>
                <DialogDescription>
                  Configure the basic page settings and metadata
                </DialogDescription>
              </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="page_slug">Page Slug</Label>
                <Input
                  id="page_slug"
                  value={formData.page_slug}
                  onChange={(e) =>
                    setFormData({ ...formData, page_slug: e.target.value })
                  }
                  placeholder="e.g., about, contact, initiatives"
                  required
                />
              </div>
              <div>
                <Label htmlFor="title">Page Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  rows={10}
                  required
                />
              </div>
              <div>
                <Label htmlFor="meta_description">Meta Description (SEO)</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) =>
                    setFormData({ ...formData, meta_description: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_published: checked })
                  }
                />
                <Label htmlFor="is_published">Published</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingPage ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="list" className="w-full">
          <TabsList>
            <TabsTrigger value="list">Pages List</TabsTrigger>
            <TabsTrigger value="sections">Edit Sections</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page Slug</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell className="font-mono">{page.page_slug}</TableCell>
                    <TableCell>{page.title}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          page.is_published
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {page.is_published ? "Published" : "Draft"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(page)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(page.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="sections" className="mt-4">
            <div className="space-y-4">
              {pages.map((page) => (
                <Card key={page.id}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span className="capitalize">{page.page_slug} Page</span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          page.is_published
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {page.is_published ? "Published" : "Draft"}
                      </span>
                    </CardTitle>
                    <CardDescription>{page.title}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="multiple" className="w-full">
                      {Object.entries(page.content || {}).map(([key, value]) => (
                        <AccordionItem key={key} value={key}>
                          <AccordionTrigger className="capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </AccordionTrigger>
                          <AccordionContent>
                            {renderSectionEditor(page, key, value)}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
