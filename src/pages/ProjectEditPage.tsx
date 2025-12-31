import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X } from "lucide-react";
import MetaTags from "@/components/MetaTags";
import { useProject, useUpdateProject } from "@/hooks/useProjects";
import { sanitizeText } from "@/utils/sanitizeInput";
import { handleImageUpload } from "@/utils/imageUpload";

const ProjectEditPage = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const projectId = id ? parseInt(id) : 0;

	const {
		data: project,
		isLoading: projectLoading,
		error: projectError,
	} = useProject(projectId);
	const updateProjectMutation = useUpdateProject();

	const [formData, setFormData] = useState({
		title: "",
		description: "",
		owner: "",
		url: "",
		category: "",
		scope: "",
		thumbnail: "",
		images: [] as string[],
		testimonial: "",
		tech_stack_ids: [] as number[],
	});

	const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
	const [imagePreviews, setImagePreviews] = useState<string[]>([]);
	const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
	const [isUploadingImages, setIsUploadingImages] = useState(false);

	// Update form data when project is loaded
	useEffect(() => {
		if (project) {
			setFormData({
				title: project.title,
				description: project.description,
				owner: project.owner,
				url: project.url || "",
				category: project.category,
				scope: project.scope,
				thumbnail: project.thumbnail || "",
				images: project.images || [],
				testimonial: project.testimonial || "",
				tech_stack_ids: project.techStacks?.map((ts) => ts.tech_stack_id) || [],
			});

			setThumbnailPreview(project.thumbnail || "");
			setImagePreviews(project.images || []);
		}
	}, [project]);

	// Handle project load error
	useEffect(() => {
		if (projectError) {
			alert(
				projectError instanceof Error
					? projectError.message
					: "Failed to fetch project",
			);
			navigate("/projects");
		}
	}, [projectError, navigate]);

	const handleThumbnailChange = async (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
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

		setIsUploadingThumbnail(true);
		try {
			const { url } = await handleImageUpload(file);
			setFormData((prev) => ({ ...prev, thumbnail: url }));
			setThumbnailPreview(url);
		} catch (error) {
			alert(error instanceof Error ? error.message : "Failed to upload image");
		} finally {
			setIsUploadingThumbnail(false);
		}
	};

	const handleImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		// Validate files
		for (const file of Array.from(files)) {
			if (!file.type.startsWith("image/")) {
				alert("Please select only image files");
				return;
			}
			if (file.size > 10 * 1024 * 1024) {
				alert("Each image should be less than 10MB");
				return;
			}
		}

		setIsUploadingImages(true);
		try {
			const uploadedImages: string[] = [];

			for (const file of Array.from(files)) {
				const { url } = await handleImageUpload(file);
				uploadedImages.push(url);
			}

			setFormData((prev) => ({
				...prev,
				images: [...prev.images, ...uploadedImages],
			}));
			setImagePreviews((prev) => [...prev, ...uploadedImages]);
		} catch (error) {
			alert(error instanceof Error ? error.message : "Failed to upload images");
		} finally {
			setIsUploadingImages(false);
		}
	};

	const removeImage = (index: number) => {
		setFormData((prev) => ({
			...prev,
			images: prev.images.filter((_, i) => i !== index),
		}));
		setImagePreviews((prev) => prev.filter((_, i) => i !== index));
	};

	const validateForm = () => {
		if (!formData.title.trim()) {
			alert("Please enter a project title");
			return false;
		}
		if (!formData.description.trim()) {
			alert("Please enter a project description");
			return false;
		}
		if (!formData.owner.trim()) {
			alert("Please enter the project owner");
			return false;
		}
		if (!formData.category.trim()) {
			alert("Please select a category");
			return false;
		}
		if (!formData.scope.trim()) {
			alert("Please select a scope");
			return false;
		}
		return true;
	};

	const handleUpdateProject = async () => {
		if (!validateForm() || !id) return;

		try {
			await updateProjectMutation.mutateAsync({
				id: parseInt(id),
				data: {
					title: sanitizeText(formData.title),
					description: sanitizeText(formData.description),
					owner: sanitizeText(formData.owner),
					url: formData.url.trim() ? sanitizeText(formData.url) : undefined,
					category: formData.category,
					scope: formData.scope,
					thumbnail: formData.thumbnail,
					images: formData.images,
					testimonial: sanitizeText(formData.testimonial),
					tech_stack_ids: formData.tech_stack_ids,
				},
			});
			alert("Project updated successfully!");
			navigate("/projects");
		} catch (error) {
			alert(
				error instanceof Error ? error.message : "Failed to update project",
			);
		}
	};

	const isLoading = projectLoading;
	const isSaving = updateProjectMutation.isPending;

	return (
		<div className="p-8">
			<MetaTags
				title="Edit Project - Admin Dashboard Inkubator IT"
				description="Edit dan perbarui portfolio project website Inkubator IT"
				keywords="edit project, update portfolio, inkubator it, admin"
			/>
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Project</h1>
				<p className="text-gray-600">Update existing project</p>
			</div>

			<div className="w-full">
				{isLoading ? (
					<div className="flex justify-center items-center py-12">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
					</div>
				) : (
					<div className="space-y-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Project Title <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								value={formData.title}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, title: e.target.value }))
								}
								placeholder="Enter project title"
								className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Owner <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									value={formData.owner}
									onChange={(e) =>
										setFormData((prev) => ({ ...prev, owner: e.target.value }))
									}
									placeholder="Enter project owner"
									className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Project URL <span className="text-gray-400">(Optional)</span>
								</label>
								<input
									type="url"
									value={formData.url}
									onChange={(e) =>
										setFormData((prev) => ({ ...prev, url: e.target.value }))
									}
									placeholder="https://example.com"
									className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
								/>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Category <span className="text-red-500">*</span>
								</label>
								<select
									value={formData.category}
									onChange={(e) =>
										setFormData((prev) => ({
											...prev,
											category: e.target.value,
										}))
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
								>
									<option value="">Select category</option>
									<option value="web">Web</option>
									<option value="app">App</option>
									<option value="games">Games</option>
									<option value="ai">AI</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Scope <span className="text-red-500">*</span>
								</label>
								<select
									value={formData.scope}
									onChange={(e) =>
										setFormData((prev) => ({ ...prev, scope: e.target.value }))
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
								>
									<option value="">Select scope</option>
									<option value="internal">Internal</option>
									<option value="external">External</option>
								</select>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Description <span className="text-red-500">*</span>
							</label>
							<textarea
								value={formData.description}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										description: e.target.value,
									}))
								}
								placeholder="Describe the project..."
								rows={4}
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
								onChange={handleThumbnailChange}
								disabled={isUploadingThumbnail}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
							/>
							{isUploadingThumbnail && (
								<p className="text-sm text-blue-600 mt-2">
									Uploading thumbnail...
								</p>
							)}
							{thumbnailPreview && !isUploadingThumbnail && (
								<div className="mt-4">
									<p className="text-sm text-gray-600 mb-2">Preview:</p>
									<img
										src={thumbnailPreview}
										alt="Thumbnail preview"
										className="max-w-full h-auto max-h-64 rounded-lg border border-gray-300"
									/>
								</div>
							)}
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Project Images (Multiple)
							</label>
							<input
								type="file"
								accept="image/*"
								multiple
								onChange={handleImagesChange}
								disabled={isUploadingImages}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
							/>
							{isUploadingImages && (
								<p className="text-sm text-blue-600 mt-2">
									Uploading images...
								</p>
							)}
							{imagePreviews.length > 0 && !isUploadingImages && (
								<div className="mt-4">
									<p className="text-sm text-gray-600 mb-2">
										Images ({imagePreviews.length})
									</p>
									<div className="grid grid-cols-4 gap-4">
										{imagePreviews.map((preview, index) => (
											<div key={index} className="relative group">
												<img
													src={preview}
													alt={`Preview ${index + 1}`}
													className="w-full h-32 object-cover rounded-lg border border-gray-300"
												/>
												<button
													type="button"
													onClick={() => removeImage(index)}
													className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
												>
													<X className="w-4 h-4" />
												</button>
											</div>
										))}
									</div>
								</div>
							)}
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Testimonial (Optional)
							</label>
							<textarea
								value={formData.testimonial}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										testimonial: e.target.value,
									}))
								}
								placeholder="Client testimonial..."
								rows={3}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Tech Stack IDs (comma-separated)
							</label>
							<input
								type="text"
								value={formData.tech_stack_ids.join(", ")}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										tech_stack_ids: e.target.value
											.split(",")
											.map((id) => parseInt(id.trim()))
											.filter((id) => !isNaN(id)),
									}))
								}
								placeholder="1, 2, 3"
								className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
							/>
							<p className="text-xs text-gray-500 mt-1">
								Enter tech stack IDs separated by commas
							</p>
						</div>

						<div className="flex justify-end gap-4 pt-6">
							<button
								onClick={() => navigate("/projects")}
								disabled={isSaving}
								className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Cancel
							</button>
							<button
								onClick={handleUpdateProject}
								disabled={isSaving}
								className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<span>✓</span>
								{isSaving ? "Updating..." : "Update Project"}
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ProjectEditPage;
