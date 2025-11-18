import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RichTextEditor from "@/components/editor/RichTextEditor";
import TagDropdown from "@/components/ui/TagDropdown";
import MetaTags from "@/components/MetaTags";
import { useCreateBlog } from "@/hooks/useBlogs";
import { useTags } from "@/hooks/useTags";
import type { TipTapJSON } from "@/services/api";
import { sanitizeRichText, sanitizeText } from "@/utils/sanitizeInput";
import { handleImageUpload } from "@/utils/imageUpload";

const BlogCreatePage = () => {
	const navigate = useNavigate();
	const {
		data: tags = [],
		isLoading: tagsLoading,
		error: tagsError,
		isError: tagsIsError,
	} = useTags();
	const createBlogMutation = useCreateBlog();

	const [formData, setFormData] = useState({
		title: "",
		author: "",
		excerpt: "",
		content: { type: "doc" as const, content: [] } as TipTapJSON,
		thumbnail: "",
		slug: "",
		time_read: "",
		tag_id: 0,
	});

	const [imagePreview, setImagePreview] = useState<string>("");
	const [isUploadingImage, setIsUploadingImage] = useState(false);

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

	const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (!file.type.startsWith("image/")) {
			alert("Please select a valid image file");
			return;
		}

		if (file.size > 10 * 1024 * 1024) {
			alert("Image size should be less than 10MB");
			return;
		}

		setIsUploadingImage(true);
		try {
			// Upload image and get the public URL
			const { url } = await handleImageUpload(file);
			setFormData((prev) => ({ ...prev, thumbnail: url }));
			setImagePreview(url);
		} catch (error) {
			alert(error instanceof Error ? error.message : "Failed to upload image");
		} finally {
			setIsUploadingImage(false);
		}
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
		if (
			!formData.content ||
			!formData.content.content ||
			formData.content.content.length === 0
		) {
			alert("Please add content to your blog");
			return false;
		}
		if (!formData.thumbnail) {
			alert("Please upload a thumbnail image");
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
				title: sanitizeText(formData.title),
				author: sanitizeText(formData.author),
				excerpt: sanitizeText(formData.excerpt),
				content: sanitizeRichText(formData.content!),
				slug: formData.slug,
				thumbnail: formData.thumbnail,
				time_read: formData.time_read,
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
				title: sanitizeText(formData.title),
				author: sanitizeText(formData.author),
				excerpt: sanitizeText(formData.excerpt),
				content: sanitizeRichText(formData.content!),
				slug: formData.slug,
				thumbnail: formData.thumbnail,
				time_read: formData.time_read,
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
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Blog Title
						</label>
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

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Author
							</label>
							<input
								type="text"
								value={formData.author}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, author: e.target.value }))
								}
								placeholder="Enter author name"
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Reading Time (minutes)
							</label>
							<input
								type="text"
								value={formData.time_read}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										time_read: e.target.value,
									}))
								}
								placeholder="Input a number of minutes..."
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Excerpt (Optional)
						</label>
						<textarea
							value={formData.excerpt}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
							}
							placeholder="Brief description of your blog..."
							rows={3}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
							disabled={isUploadingImage}
							className="w-full px-3 py-2 border border-gray-300"
						/>
						{isUploadingImage && (
							<p className="text-sm text-blue-600 mt-2">Uploading image...</p>
						)}
						{imagePreview && !isUploadingImage && (
							<div className="mt-4">
								<p className="text-sm text-gray-600 mb-2">Preview</p>
								<img
									src={imagePreview}
									alt="Thumbnail Preview"
									className="max-w-full h-auto max-h-64 rounded-lg border border-gray-300"
								/>
							</div>
						)}
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Content
						</label>
						<RichTextEditor
							content={formData.content}
							onChange={handleContentChange}
							placeholder="Start writing your blog content..."
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Select Tag
						</label>
						{tagsIsError && (
							<div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
								Error loading tags:{" "}
								{tagsError instanceof Error
									? tagsError.message
									: "Unknown error"}
								<br />
								<span className="text-xs">
									Check console and ensure API server is running on port 3000
								</span>
							</div>
						)}
						{tagsLoading && (
							<div className="mb-2 text-sm text-gray-500">Loading tags...</div>
						)}
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
