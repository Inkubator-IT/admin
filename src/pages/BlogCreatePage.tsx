import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RichTextEditor from "@/components/editor/RichTextEditor";
import TagDropdown from "@/components/ui/TagDropdown";
import MetaTags from "@/components/MetaTags";
import { useCreateBlog } from "@/hooks/useBlogs";
import { useTags } from "@/hooks/useTags";

const BlogCreatePage = () => {
  const navigate = useNavigate();
  const { data: tags = [], isLoading: tagsLoading } = useTags();
  const createBlogMutation = useCreateBlog();

  const [formData, setFormData] = useState({
    title: "",
    author: "Marzuli Suhada M",
    excerpt: "",
    content: "",
    thumbnail: "",
    slug: "",
    tag_id: 0,
  });

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const handleContentChange = (content: any) => {
    // Convert Tiptap JSON to HTML string for API
    const contentString = JSON.stringify(content);
    setFormData((prev) => ({ ...prev, content: contentString }));
  };

  const handleTagChange = (tagIds: number[]) => {
    // Since API expects single tag_id, take the first one
    setFormData((prev) => ({ ...prev, tag_id: tagIds[0] || 0 }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      alert("Please enter a blog title");
      return false;
    }
    if (!formData.content) {
      alert("Please add content to your blog");
      return false;
    }
    if (!formData.tag_id) {
      alert("Please select a tag");
      return false;
    }
    return true;
  };

  const handleSaveDraft = async () => {
    if (!validateForm()) return;

    try {
      await createBlogMutation.mutateAsync({
        title: formData.title,
        author: formData.author,
        slug: formData.slug,
        excerpt: formData.excerpt,
        thumbnail: formData.thumbnail,
        content: formData.content,
        tag_id: formData.tag_id,
      });
      alert("Draft saved successfully!");
      navigate("/blogs");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save draft");
    }
  };

  const handleCreateBlog = async () => {
    if (!validateForm()) return;

    try {
      await createBlogMutation.mutateAsync({
        title: formData.title,
        author: formData.author,
        slug: formData.slug,
        excerpt: formData.excerpt,
        thumbnail: formData.thumbnail,
        content: formData.content,
        tag_id: formData.tag_id,
      });
      alert("Blog created successfully!");
      navigate("/blogs");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to create blog");
    }
  };

  const isLoading = tagsLoading || createBlogMutation.isPending;

  return (
    <div className="p-8">
      <MetaTags
        title="Buat Blog Baru - Admin Dashboard Inkubator IT"
        description="Buat artikel blog baru untuk website Inkubator IT dengan editor yang mudah digunakan"
        keywords="buat blog, artikel baru, content creation, inkubator it, admin"
      />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Blog</h1>
        <p className="text-gray-600">Create new blog</p>
      </div>

      <div className="w-full">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Blog Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter blog title"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {formData.slug && (
              <p className="mt-1 text-sm text-gray-500">
                Slug: <span className="font-mono">{formData.slug}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt (Optional)</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
              placeholder="Brief description of your blog..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <RichTextEditor
              content={formData.content ? JSON.parse(formData.content) : null}
              onChange={handleContentChange}
              placeholder="Start writing your blog content..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Tag</label>
            <TagDropdown
              tags={tags.map((tag) => ({
                id: tag.tag_id,
                name: tag.tag_name,
                color: "#3B82F6",
              }))}
              selectedTagIds={formData.tag_id ? [formData.tag_id] : []}
              onTagChange={handleTagChange}
              placeholder="Select a tag for your blog..."
            />
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <button
              onClick={handleSaveDraft}
              disabled={isLoading}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createBlogMutation.isPending ? "Saving..." : "Save Draft"}
            </button>
            <button
              onClick={handleCreateBlog}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>+</span>
              {createBlogMutation.isPending ? "Creating..." : "Create Blog"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCreatePage;
