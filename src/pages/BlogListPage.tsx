import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Eye, Edit, Trash2 } from "lucide-react";
import { formatDate } from "@/utils/dateUtils";
import MetaTags from "@/components/MetaTags";

interface Blog {
	id: number;
	title: string;
	author: string;
	slug: string;
	excerpt?: string;
	thumbnail?: string;
	status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
	publishedAt?: string;
	createdAt: string;
	tags: Array<{
		tag: {
			id: number;
			name: string;
			color: string;
		};
	}>;
}

const BlogListPage = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedTag, setSelectedTag] = useState("");
	const [selectedDate, setSelectedDate] = useState("");

	const mockBlogs: Blog[] = [
		{
			id: 1,
			title: "Exploring the art of minimalist design",
			author: "Marzuli Suhada M",
			slug: "exploring-minimalist-design",
			excerpt: "Discover the principles of minimalist design...",
			status: "PUBLISHED",
			publishedAt: "2023-08-15",
			createdAt: "2023-08-15T10:00:00Z",
			tags: [
				{ tag: { id: 1, name: "Lifestyle", color: "#3B82F6" } },
				{ tag: { id: 2, name: "Design", color: "#10B981" } }
			]
		},
		{
			id: 2,
			title: "The future of digital marketing",
			author: "Marzuli Suhada M",
			slug: "future-digital-marketing",
			excerpt: "How AI is transforming digital marketing...",
			status: "PUBLISHED",
			publishedAt: "2023-08-15",
			createdAt: "2023-08-15T10:00:00Z",
			tags: [
				{ tag: { id: 3, name: "Technology", color: "#8B5CF6" } },
				{ tag: { id: 4, name: "Marketing", color: "#F59E0B" } }
			]
		}
	];

	const filteredBlogs = mockBlogs.filter(blog => {
		const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			blog.author.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesTag = !selectedTag || blog.tags.some(t => t.tag.name === selectedTag);
		const matchesDate = !selectedDate || blog.publishedAt?.startsWith(selectedDate);
		
		return matchesSearch && matchesTag && matchesDate;
	});

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
						value={selectedTag}
						onChange={(e) => setSelectedTag(e.target.value)}
						className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					>
						<option value="">Tag</option>
						<option value="Lifestyle">Lifestyle</option>
						<option value="Technology">Technology</option>
						<option value="Design">Design</option>
						<option value="Marketing">Marketing</option>
					</select>
					
					<select
						value={selectedDate}
						onChange={(e) => setSelectedDate(e.target.value)}
						className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					>
						<option value="">Date</option>
						<option value="2023-08">August 2023</option>
						<option value="2023-09">September 2023</option>
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
									Date Published
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{filteredBlogs.map((blog) => (
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
										<div className="flex flex-wrap gap-1">
											{blog.tags.map(({ tag }) => (
												<span
													key={tag.id}
													className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
													style={{ backgroundColor: tag.color }}
												>
													{tag.name}
												</span>
											))}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{blog.publishedAt ? formatDate(blog.publishedAt) : "Draft"}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										<div className="flex items-center gap-2">
											<button className="text-gray-400 hover:text-gray-600 transition-colors">
												<Eye className="w-4 h-4" />
											</button>
											<Link
												to={`/blogs/${blog.id}/edit`}
												className="text-gray-400 hover:text-gray-600 transition-colors"
											>
												<Edit className="w-4 h-4" />
											</Link>
											<button className="text-gray-400 hover:text-red-600 transition-colors">
												<Trash2 className="w-4 h-4" />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default BlogListPage;
