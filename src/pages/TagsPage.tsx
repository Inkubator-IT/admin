import { useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import MetaTags from "@/components/MetaTags";

interface Tag {
	id: number;
	name: string;
	description?: string;
	color: string;
	createdAt: string;
}

const TagsPage = () => {
	const [newTagName, setNewTagName] = useState("");
	const [editingTag, setEditingTag] = useState<Tag | null>(null);
	const [editTagName, setEditTagName] = useState("");

	const [tags, setTags] = useState<Tag[]>([
		{ id: 1, name: "Technology", color: "#3B82F6", createdAt: "2023-08-15T10:00:00Z" },
		{ id: 2, name: "Travel", color: "#10B981", createdAt: "2023-08-15T10:00:00Z" },
		{ id: 3, name: "Food", color: "#F59E0B", createdAt: "2023-08-15T10:00:00Z" },
		{ id: 4, name: "Lifestyle", color: "#8B5CF6", createdAt: "2023-08-15T10:00:00Z" }
	]);

	const filteredTags = tags;

	const handleAddTag = () => {
		if (newTagName.trim()) {
			const newTag: Tag = {
				id: Date.now(),
				name: newTagName.trim(),
				color: "#3B82F6",
				createdAt: new Date().toISOString()
			};
			setTags(prev => [...prev, newTag]);
			setNewTagName("");
		}
	};

	const handleEditTag = (tag: Tag) => {
		setEditingTag(tag);
		setEditTagName(tag.name);
	};

	const handleUpdateTag = () => {
		if (editingTag && editTagName.trim()) {
			setTags(prev => prev.map(tag =>
				tag.id === editingTag.id
					? { ...tag, name: editTagName.trim() }
					: tag
			));
			setEditingTag(null);
			setEditTagName("");
		}
	};

	const handleDeleteTag = (tagId: number) => {
		if (window.confirm("Are you sure you want to delete this tag?")) {
			setTags(prev => prev.filter(tag => tag.id !== tagId));
		}
	};

	const handleCancelEdit = () => {
		setEditingTag(null);
		setEditTagName("");
	};

	return (
		<div className="p-8">
			<MetaTags 
				title="Kelola Tags - Admin Dashboard Inkubator IT"
				description="Kelola kategori dan tags untuk blog website Inkubator IT"
				keywords="tag management, kategori blog, content organization, inkubator it, admin"
			/>
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">Blog</h1>
				<p className="text-gray-600">Manage tags for blogs</p>
			</div>

			<div className="w-full space-y-8">
				<div className="bg-white rounded-lg shadow-sm border p-6">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Tags</h2>
					<div className="flex gap-4">
						<div className="flex-1 relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
							<input
								type="text"
								value={newTagName}
								onChange={(e) => setNewTagName(e.target.value)}
								placeholder="Add new tags, e.g., 'Productivity'"
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
							/>
						</div>
						<button
							onClick={handleAddTag}
							className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
						>
							<Plus className="w-4 h-4" />
							Add Category
						</button>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow-sm border">
					<div className="p-6 border-b border-gray-200">
						<h2 className="text-xl font-semibold text-gray-900">Existing Tags</h2>
					</div>
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50 border-b">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Tag Name
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{filteredTags.map((tag) => (
									<tr key={tag.id} className="hover:bg-gray-50">
										<td className="px-6 py-4 whitespace-nowrap">
											{editingTag?.id === tag.id ? (
												<input
													type="text"
													value={editTagName}
													onChange={(e) => setEditTagName(e.target.value)}
													className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
													onKeyPress={(e) => e.key === "Enter" && handleUpdateTag()}
													autoFocus
												/>
											) : (
												<div className="flex items-center gap-3">
													<div
														className="w-4 h-4 rounded-full"
														style={{ backgroundColor: tag.color }}
													/>
													<span className="text-sm font-medium text-gray-900">
														{tag.name}
													</span>
												</div>
											)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-right">
											{editingTag?.id === tag.id ? (
												<div className="flex items-center justify-end gap-2">
													<button
														onClick={handleUpdateTag}
														className="text-green-600 hover:text-green-800 transition-colors"
													>
														Save
													</button>
													<button
														onClick={handleCancelEdit}
														className="text-gray-600 hover:text-gray-800 transition-colors"
													>
														Cancel
													</button>
												</div>
											) : (
												<div className="flex items-center justify-end gap-4">
													<button
														onClick={() => handleEditTag(tag)}
														className="flex items-center gap-1 text-gray-600 hover:text-gray-800 transition-colors"
													>
														<Edit className="w-4 h-4" />
														Edit
													</button>
													<button
														onClick={() => handleDeleteTag(tag.id)}
														className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors"
													>
														<Trash2 className="w-4 h-4" />
														Delete
													</button>
												</div>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TagsPage;
