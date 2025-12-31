import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Edit, Trash2, ThumbsUp } from "lucide-react";
import { formatDate } from "@/utils/dateUtils";
import MetaTags from "@/components/MetaTags";
import { useBlogs, useDeleteBlog } from "@/hooks/useBlogs";
import { useTags } from "@/hooks/useTags";

const BlogListPage = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedTagId, setSelectedTagId] = useState<number | null>(null);
	const [selectedDate, setSelectedDate] = useState("");

	// Fetch blogs and tags using react-query
	const {
		data: blogs = [],
		isLoading: blogsLoading,
		error: blogsError,
	} = useBlogs();
	const { data: tags = [], isLoading: tagsLoading } = useTags();
	const deleteBlogMutation = useDeleteBlog();

	const handleDeleteBlog = async (id: number) => {
		if (!confirm("Are you sure you want to delete this blog?")) return;

		try {
			await deleteBlogMutation.mutateAsync(id);
			alert("Blog deleted successfully!");
		} catch (error) {
			alert(error instanceof Error ? error.message : "Failed to delete blog");
		}
	};

	const filteredBlogs = useMemo(() => {
		return blogs.filter((blog) => {
			const matchesSearch =
				blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				blog.author.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesTag = !selectedTagId || blog.tag_id === selectedTagId;
			const matchesDate =
				!selectedDate || blog.created_at.startsWith(selectedDate);

			return matchesSearch && matchesTag && matchesDate;
		});
	}, [blogs, searchTerm, selectedTagId, selectedDate]);

	const isLoading = blogsLoading || tagsLoading;
	const error = blogsError
		? blogsError instanceof Error
			? blogsError.message
			: "Failed to fetch blogs"
		: null;

	return (
		<div className="p-8">
			<MetaTags
				title="Kelola Blog - Admin Dashboard Inkubator IT"
				description="Kelola dan atur semua artikel blog website Inkubator IT dengan mudah"
				keywords="blog management, artikel, konten, inkubator it, admin"
			/>
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">Blogs</h1>
				<p className="text-gray-600">Welcome back, Admin!</p>
			</div>

			<div className="flex justify-between items-center mb-6">
				<div className="flex gap-4">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
						<input
							type="text"
							placeholder="Search Article"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>

					<select
						value={selectedTagId || ""}
						onChange={(e) =>
							setSelectedTagId(e.target.value ? Number(e.target.value) : null)
						}
						className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					>
						<option value="">All Tags</option>
						{tags.map((tag) => (
							<option key={tag.tag_id} value={tag.tag_id}>
								{tag.tag_name}
							</option>
						))}
					</select>

					<select
						value={selectedDate}
						onChange={(e) => setSelectedDate(e.target.value)}
						className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					>
						<option value="">All Dates</option>
						<option value="2024">2024</option>
						<option value="2023">2023</option>
					</select>
				</div>

				<Link
					to="/blogs/create"
					className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
				>
					<Plus className="w-4 h-4" />
					Create Blog
				</Link>
			</div>

			{error && (
				<div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
					{error}
				</div>
			)}

			{isLoading ? (
				<div className="flex justify-center items-center py-12">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
				</div>
			) : (
				<div className="bg-white rounded-lg shadow-sm border">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50 border-b">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Title
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Author
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Tag
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Date Created
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{filteredBlogs.length === 0 ? (
									<tr>
										<td
											colSpan={5}
											className="px-6 py-8 text-center text-gray-500"
										>
											No blogs found
										</td>
									</tr>
								) : (
									filteredBlogs.map((blog) => {
										const blogTag = tags.find((t) => t.tag_id === blog.tag_id);
										return (
											<tr key={blog.id} className="hover:bg-gray-50">
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm font-medium text-gray-900">
														{blog.title}
													</div>
													{blog.excerpt && (
														<div className="text-sm text-gray-500 truncate max-w-xs">
															{blog.excerpt}
														</div>
													)}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													{blog.author}
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													{blogTag ? (
														<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
															{blogTag.tag_name}
														</span>
													) : (
														<span className="text-sm text-gray-400">
															No tag
														</span>
													)}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													{formatDate(blog.created_at)}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
													<div className="flex items-center gap-2">
														{/* <button className="text-gray-400 hover:text-gray-600 transition-colors">
                              <Eye className="w-4 h-4" />
                            </button> */}
														<span className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600">
															<ThumbsUp className="w-4 h-auto" />
															{blog.like_count ?? 0}
														</span>
														<Link
															to={`/blogs/${blog.id}/edit`}
															className="text-gray-400 hover:text-gray-600 transition-colors"
														>
															<Edit className="w-4 h-4" />
														</Link>
														<button
															onClick={() => handleDeleteBlog(blog.id)}
															className="text-gray-400 hover:text-red-600 transition-colors"
														>
															<Trash2 className="w-4 h-4" />
														</button>
													</div>
												</td>
											</tr>
										);
									})
								)}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	);
};

export default BlogListPage;
