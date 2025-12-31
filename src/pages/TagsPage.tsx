import { useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import MetaTags from "@/components/MetaTags";
import {
	useTags,
	useCreateTag,
	useUpdateTag,
	useDeleteTag,
} from "@/hooks/useTags";
import type { Tag as ApiTag } from "@/services/api/types";
import { sanitizeTagName, sanitizeTagDescription } from "@/utils/sanitizeInput";

const TagsPage = () => {
	const [newTagName, setNewTagName] = useState("");
	const [newTagDescription, setNewTagDescription] = useState("");
	const [editingTag, setEditingTag] = useState<ApiTag | null>(null);
	const [editTagName, setEditTagName] = useState("");
	const [editTagDescription, setEditTagDescription] = useState("");

	// Fetch tags from API
	const { data: tags = [], isLoading, error } = useTags();
	const createTagMutation = useCreateTag();
	const updateTagMutation = useUpdateTag();
	const deleteTagMutation = useDeleteTag();

	const handleAddTag = async () => {
		if (!newTagName.trim()) {
			alert("Please enter a tag name");
			return;
		}

		try {
			await createTagMutation.mutateAsync({
				tag_name: sanitizeTagName(newTagName),
				tag_description: sanitizeTagDescription(newTagDescription) || "",
			});
			setNewTagName("");
			setNewTagDescription("");
			alert("Tag created successfully!");
		} catch (error) {
			alert(error instanceof Error ? error.message : "Failed to create tag");
		}
	};

	const handleEditTag = (tag: ApiTag) => {
		setEditingTag(tag);
		setEditTagName(tag.tag_name);
		setEditTagDescription(tag.tag_description);
	};

	const handleUpdateTag = async () => {
		if (!editingTag || !editTagName.trim()) {
			alert("Please enter a tag name");
			return;
		}

		try {
			await updateTagMutation.mutateAsync({
				id: editingTag.tag_id,
				data: {
					tag_name: sanitizeTagName(editTagName),
					tag_description: sanitizeTagDescription(editTagDescription) || "",
				},
			});
			setEditingTag(null);
			setEditTagName("");
			setEditTagDescription("");
			alert("Tag updated successfully!");
		} catch (error) {
			alert(error instanceof Error ? error.message : "Failed to update tag");
		}
	};

	const handleDeleteTag = async (tagId: number) => {
		if (!window.confirm("Are you sure you want to delete this tag?")) {
			return;
		}

		try {
			await deleteTagMutation.mutateAsync(tagId);
			alert("Tag deleted successfully!");
		} catch (error) {
			alert(error instanceof Error ? error.message : "Failed to delete tag");
		}
	};

	const handleCancelEdit = () => {
		setEditingTag(null);
		setEditTagName("");
		setEditTagDescription("");
	};

	if (isLoading) {
		return (
			<div className="p-8">
				<div className="text-center">Loading tags...</div>
			</div>
		);
	}

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

			{error && (
				<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
					Error loading tags:{" "}
					{error instanceof Error ? error.message : "Unknown error"}
				</div>
			)}

			<div className="w-full space-y-8">
				<div className="bg-white rounded-lg shadow-sm border p-6">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">
						Add New Tags
					</h2>
					<div className="space-y-4">
						<div className="flex-1 relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
							<input
								type="text"
								value={newTagName}
								onChange={(e) => setNewTagName(e.target.value)}
								placeholder="Tag name, e.g., 'Productivity'"
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
							/>
						</div>
						<div>
							<input
								type="text"
								value={newTagDescription}
								onChange={(e) => setNewTagDescription(e.target.value)}
								placeholder="Tag description (optional)"
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
							/>
						</div>
						<button
							onClick={handleAddTag}
							disabled={createTagMutation.isPending}
							className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<Plus className="w-4 h-4" />
							{createTagMutation.isPending ? "Creating..." : "Add Category"}
						</button>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow-sm border">
					<div className="p-6 border-b border-gray-200">
						<h2 className="text-xl font-semibold text-gray-900">
							Existing Tags
						</h2>
					</div>
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50 border-b">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Tag Name
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Description
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{tags.length === 0 ? (
									<tr>
										<td
											colSpan={3}
											className="px-6 py-8 text-center text-gray-500"
										>
											No tags available. Create your first tag above.
										</td>
									</tr>
								) : (
									tags.map((tag) => (
										<tr key={tag.tag_id} className="hover:bg-gray-50">
											<td className="px-6 py-4 whitespace-nowrap">
												{editingTag?.tag_id === tag.tag_id ? (
													<input
														type="text"
														value={editTagName}
														onChange={(e) => setEditTagName(e.target.value)}
														className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
														onKeyPress={(e) =>
															e.key === "Enter" && handleUpdateTag()
														}
														autoFocus
													/>
												) : (
													<span className="text-sm font-medium text-gray-900">
														{tag.tag_name}
													</span>
												)}
											</td>
											<td className="px-6 py-4">
												{editingTag?.tag_id === tag.tag_id ? (
													<input
														type="text"
														value={editTagDescription}
														onChange={(e) =>
															setEditTagDescription(e.target.value)
														}
														className="px-2 py-1 w-full border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
													/>
												) : (
													<span className="text-sm text-gray-600">
														{tag.tag_description || "-"}
													</span>
												)}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-right">
												{editingTag?.tag_id === tag.tag_id ? (
													<div className="flex items-center justify-end gap-2">
														<button
															onClick={handleUpdateTag}
															disabled={updateTagMutation.isPending}
															className="text-green-600 hover:text-green-800 transition-colors disabled:opacity-50"
														>
															{updateTagMutation.isPending
																? "Saving..."
																: "Save"}
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
															onClick={() => handleDeleteTag(tag.tag_id)}
															disabled={deleteTagMutation.isPending}
															className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
														>
															<Trash2 className="w-4 h-4" />
															{deleteTagMutation.isPending
																? "Deleting..."
																: "Delete"}
														</button>
													</div>
												)}
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TagsPage;
