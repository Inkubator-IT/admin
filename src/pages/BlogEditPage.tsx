import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StructuredContentEditor from "@/components/editor/StructuredContentEditor";
import TagDropdown from "@/components/ui/TagDropdown";
import MetaTags from "@/components/MetaTags";
import { useBlog, useUpdateBlog } from "@/hooks/useBlogs";
import { useTags } from "@/hooks/useTags";
import type { ContentBlock } from "@/services/api/types";

const BlogEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const blogId = id ? parseInt(id) : 0;

  const { data: blog, isLoading: blogLoading, error: blogError } = useBlog(blogId);
  const { data: tags = [], isLoading: tagsLoading } = useTags();
  const updateBlogMutation = useUpdateBlog();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    excerpt: "",
    content: [] as ContentBlock[],
    thumbnail: "",
    slug: "",
    tag_id: 0,
  });

  // Update form data when blog is loaded
  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title,
        author: blog.author,
        excerpt: blog.excerpt || "",
        content: blog.content,
        thumbnail: blog.thumbnail || "",
        slug: blog.slug,
        tag_id: blog.tag_id,
      });
    }
  }, [blog]);

  // Handle blog load error
  useEffect(() => {
    if (blogError) {
      alert(blogError instanceof Error ? blogError.message : "Failed to fetch blog");
      navigate("/blogs");
    }
  }, [blogError, navigate]);

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

  const handleContentChange = (content: ContentBlock[]) => {
    setFormData((prev) => ({ ...prev, content }));
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
    if (!formData.content || formData.content.length === 0) {
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
    if (!validateForm() || !id) return;

    try {
      await updateBlogMutation.mutateAsync({
        id: parseInt(id),
        data: {
          title: formData.title,
          author: formData.author,
          slug: formData.slug,
          excerpt: formData.excerpt,
          thumbnail: formData.thumbnail,
          content: formData.content,
          tag_id: formData.tag_id,
        },
      });
      alert("Draft saved successfully!");
      navigate("/blogs");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save draft");
    }
  };

  const handleUpdateBlog = async () => {
    if (!validateForm() || !id) return;

    try {
      await updateBlogMutation.mutateAsync({
        id: parseInt(id),
        data: {
          title: formData.title,
          author: formData.author,
          slug: formData.slug,
          excerpt: formData.excerpt,
          thumbnail: formData.thumbnail,
          content: formData.content,
          tag_id: formData.tag_id,
        },
      });
      alert("Blog updated successfully!");
      navigate("/blogs");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to update blog");
    }
  };

  const isLoading = blogLoading || tagsLoading;
  const isSaving = updateBlogMutation.isPending;

  return (
    <div className="p-8">
      <MetaTags
        title="Edit Blog - Admin Dashboard Inkubator IT"
        description="Edit dan perbarui artikel blog website Inkubator IT"
        keywords="edit blog, update artikel, content editing, inkubator it, admin"
      />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Blog</h1>
        <p className="text-gray-600">Edit existing blog</p>
      </div>

      <div className="w-full">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
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
              <StructuredContentEditor content={formData.content} onChange={handleContentChange} />
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
                disabled={isSaving}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Saving..." : "Save Draft"}
              </button>
              <button
                onClick={handleUpdateBlog}
                disabled={isSaving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>✓</span>
                {isSaving ? "Updating..." : "Update Blog"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogEditPage;
