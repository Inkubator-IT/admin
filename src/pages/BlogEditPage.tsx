import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RichTextEditor from "@/components/editor/RichTextEditor";
import TagDropdown from "@/components/ui/TagDropdown";
import MetaTags from "@/components/MetaTags";

const BlogEditPage = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const [formData, setFormData] = useState({
		title: "",
		author: "",
		excerpt: "",
		content: {} as any,
		tagIds: [] as number[]
	});

	const mockTags = [
		{ id: 1, name: "Technology", color: "#3B82F6" },
		{ id: 2, name: "Lifestyle", color: "#10B981" },
		{ id: 3, name: "Design", color: "#8B5CF6" },
		{ id: 4, name: "Marketing", color: "#F59E0B" },
		{ id: 5, name: "Health", color: "#EF4444" },
		{ id: 6, name: "Travel", color: "#06B6D4" }
	];

	useEffect(() => {
		const mockBlog = {
			id: parseInt(id || "1"),
			title: "Exploring the art of minimalist design",
			author: "Marzuli Suhada M",
			excerpt: "Discover the principles of minimalist design...",
			content: {
				type: "doc",
				content: [
					{
						type: "heading",
						attrs: { level: 1 },
						content: [{ type: "text", text: "Welcome to InkubatorIT Text Editor!" }]
					},
					{
						type: "paragraph",
						content: [
							{ type: "text", text: "Lorem ipsum dolor sit amet consectetur adipiscing elit..." }
						]
					}
				]
			},
			tagIds: [1, 2]
		};

		setFormData({
			title: mockBlog.title,
			author: mockBlog.author,
			excerpt: mockBlog.excerpt,
			content: mockBlog.content,
			tagIds: mockBlog.tagIds
		});
	}, [id]);

	const handleContentChange = (content: any) => {
		setFormData(prev => ({ ...prev, content }));
	};

	const handleTagChange = (tagIds: number[]) => {
		setFormData(prev => ({ ...prev, tagIds }));
	};

	const handleSaveDraft = () => {
		console.log("Saving draft:", formData);
	};

	const handleUpdateBlog = () => {
		console.log("Updating blog:", formData);
		navigate("/blogs");
	};

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
				<div className="space-y-6">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Blog Title
						</label>
						<input
							type="text"
							value={formData.title}
							onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
							placeholder="Enter blog title"
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
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
						<TagDropdown
							tags={mockTags}
							selectedTagIds={formData.tagIds}
							onTagChange={handleTagChange}
							placeholder="Select tags for your blog..."
						/>
					</div>

					<div className="flex justify-end gap-4 pt-6">
						<button
							onClick={handleSaveDraft}
							className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
						>
							Save Draft
						</button>
						<button
							onClick={handleUpdateBlog}
							className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
						>
							<span>✓</span>
							Update Blog
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BlogEditPage;
