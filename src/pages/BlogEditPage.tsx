import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RichTextEditor from "@/components/editor/RichTextEditor";
import TagDropdown from "@/components/ui/TagDropdown";
import MetaTags from "@/components/MetaTags";
import { useBlog, useUpdateBlog } from "@/hooks/useBlogs";
import { useTags } from "@/hooks/useTags";
import type { TipTapJSON } from "@/services/api/types";

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
    content: undefined as TipTapJSON | undefined,
    thumbnail: "",
    slug: "",
    time_read: "",
    tag_id: 0,
  });

  const [imagePreview, setImagePreview] = useState<string>("");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasLoadedFromCacheRef = useRef(false);

  // Load from cache on mount
  useEffect(() => {
    if (!blogId) return;
    
    try {
      const cached = localStorage.getItem(`blog-edit-cache-${blogId}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        setFormData(parsed.formData);
        setImagePreview(parsed.imagePreview || "");
        hasLoadedFromCacheRef.current = true;
      }
    } catch (error) {
      console.error("Error loading cache:", error);
    }
  }, [blogId]);

  // Update form data when blog is loaded
  useEffect(() => {
    if (blog && !hasLoadedFromCacheRef.current) {
      setFormData({
        title: blog.title,
        author: blog.author,
        excerpt: blog.excerpt || "",
        content: blog.content,
        thumbnail: blog.thumbnail || "",
        slug: blog.slug,
        time_read: blog.time_read || "",
        tag_id: blog.tag_id,
      });
      setImagePreview(blog.thumbnail || "");
    }
  }, [blog]);

  // Save to cache whenever formData or imagePreview changes
  useEffect(() => {
    if (!blogId) return; 

    if (!hasLoadedFromCacheRef.current && !blog) return;
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(
          `blog-edit-cache-${blogId}`,
          JSON.stringify({ formData, imagePreview })
        );
      } catch (error) {
        console.error("Error saving cache:", error);
      }
    }, 500);
  }, [formData, imagePreview, blogId, blog]);

  // Handle blog load error
  useEffect(() => {
    if (blogError) {
      alert(blogError instanceof Error ? blogError.message : "Failed to fetch blog");
      navigate("/blogs");
    }
  }, [blogError, navigate]);

  // Clear cache on unmount if save was successful
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

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

  const handleContentChange = (content: TipTapJSON) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const handleTagChange = (tagIds: number[]) => {
    setFormData((prev) => ({ ...prev, tag_id: tagIds[0] || 0 }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData((prev) => ({ ...prev, thumbnail: base64String }));
      setImagePreview(base64String);
    };
    reader.onerror = () => {
      alert("Failed to read image file");
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      alert("Please enter a blog title");
      return false;
    }
    if (!formData.author.trim()) {
      alert("Please enter the author name");
      return false;
    }
    if (!formData.time_read.trim()) {
      alert("Please enter the reading time");
      return false;
    }
    if (!formData.content || !formData.content.content || formData.content.content.length === 0) {
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
          time_read: formData.time_read,
          tag_id: formData.tag_id,
        },
      });
      // Clear cache on successful save
      if (blogId) {
        localStorage.removeItem(`blog-edit-cache-${blogId}`);
      }
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
          time_read: formData.time_read,
          tag_id: formData.tag_id,
        },
      });
      // Clear cache on successful update
      if (blogId) {
        localStorage.removeItem(`blog-edit-cache-${blogId}`);
      }
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
              />
              {formData.slug && (
                <p className="mt-1 text-sm text-gray-500">
                  Slug: <span className="font-mono">{formData.slug}</span>
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                  placeholder="Enter author name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reading Time (minutes)</label>
                <input
                  type="text"
                  value={formData.time_read}
                  onChange={(e) => setFormData((prev) => ({ ...prev, time_read: e.target.value }))}
                  placeholder="Input a number of minutes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt (Optional)</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Brief description of your blog..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
              />
              {imagePreview && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <img
                    src={imagePreview}
                    alt="Thumbnail preview"
                    className="max-w-full h-auto max-h-64 rounded-lg border border-gray-300"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <RichTextEditor 
                content={formData.content}
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
