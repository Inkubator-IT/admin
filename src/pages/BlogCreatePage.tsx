import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RichTextEditor from "@/components/editor/RichTextEditor";
import TagDropdown from "@/components/ui/TagDropdown";
import MetaTags from "@/components/MetaTags";

const BlogCreatePage = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		title: "",
		author: "Marzuli Suhada M",
		excerpt: "",
		content: null,
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

	const handleContentChange = (content: any) => {
		setFormData(prev => ({ ...prev, content }));
	};

	const handleTagChange = (tagIds: number[]) => {
		setFormData(prev => ({ ...prev, tagIds }));
	};

	const handleSaveDraft = () => {
		console.log("Saving draft:", formData);
	};

	const handleCreateBlog = () => {
		console.log("Creating blog:", formData);
		navigate("/blogs");
	};

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
							onClick={handleCreateBlog}
							className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
						>
							<span>+</span>
							Create Blog
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BlogCreatePage;
