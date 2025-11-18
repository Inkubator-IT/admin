import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MetaTags from "@/components/MetaTags";
import { useTechStack, useUpdateTechStack } from "@/hooks/useTechStack";
import { sanitizeText } from "@/utils/sanitizeInput";
import { handleImageUpload } from "@/utils/imageUpload";

const TechStackEditPage = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const techStackId = id ? parseInt(id) : 0;

	const {
		data: techStack,
		isLoading: techStackLoading,
		error: techStackError,
	} = useTechStack(techStackId);
	const updateTechStackMutation = useUpdateTechStack();

	const [formData, setFormData] = useState({
		tech_stack_name: "",
		tech_stack_description: "",
		icon_url: "",
	});

	const [iconPreview, setIconPreview] = useState<string>("");
	const [isUploadingIcon, setIsUploadingIcon] = useState(false);

	// Update form data when tech stack is loaded
	useEffect(() => {
		if (techStack) {
			setFormData({
				tech_stack_name: techStack.tech_stack_name,
				tech_stack_description: techStack.tech_stack_description || "",
				icon_url: techStack.icon_url || "",
			});

			// Load icon preview
			setIconPreview(techStack.icon_url || "");
		}
	}, [techStack]);

	// Handle tech stack load error
	useEffect(() => {
		if (techStackError) {
			alert(
				techStackError instanceof Error
					? techStackError.message
					: "Failed to fetch tech stack",
			);
			navigate("/tech-stack");
		}
	}, [techStackError, navigate]);

	const handleIconChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (!file.type.startsWith("image/")) {
			alert("Please select a valid image file");
			return;
		}

		if (file.size > 5 * 1024 * 1024) {
			alert("Icon size should be less than 5MB");
			return;
		}

		setIsUploadingIcon(true);
		try {
			const { url } = await handleImageUpload(file);
			setFormData((prev) => ({ ...prev, icon_url: url }));
			setIconPreview(url);
		} catch (error) {
			alert(error instanceof Error ? error.message : "Failed to upload icon");
		} finally {
			setIsUploadingIcon(false);
		}
	};

	const validateForm = () => {
		if (!formData.tech_stack_name.trim()) {
			alert("Please enter a tech stack name");
			return false;
		}
		return true;
	};

	const handleUpdateTechStack = async () => {
		if (!validateForm() || !id) return;

		try {
			await updateTechStackMutation.mutateAsync({
				id: parseInt(id),
				data: {
					tech_stack_name: sanitizeText(formData.tech_stack_name),
					tech_stack_description: sanitizeText(formData.tech_stack_description),
					icon_url: formData.icon_url,
				},
			});
			alert("Tech stack updated successfully!");
			navigate("/tech-stack");
		} catch (error) {
			alert(
				error instanceof Error ? error.message : "Failed to update tech stack",
			);
		}
	};

	const isLoading = techStackLoading;
	const isSaving = updateTechStackMutation.isPending;

	return (
		<div className="p-8">
			<MetaTags
				title="Edit Tech Stack - Admin Dashboard Inkubator IT"
				description="Edit dan perbarui teknologi stack website Inkubator IT"
				keywords="edit tech stack, update teknologi, inkubator it, admin"
			/>
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">
					Edit Tech Stack
				</h1>
				<p className="text-gray-600">Update existing technology stack</p>
			</div>

			<div className="w-full max-w-2xl">
				{isLoading ? (
					<div className="flex justify-center items-center py-12">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
					</div>
				) : (
					<div className="space-y-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Tech Stack Name <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								value={formData.tech_stack_name}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										tech_stack_name: e.target.value,
									}))
								}
								placeholder="Enter tech stack name"
								className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Icon
							</label>
							<input
								type="file"
								accept="image/*"
								onChange={handleIconChange}
								disabled={isUploadingIcon}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
							/>
							{isUploadingIcon && (
								<p className="text-sm text-blue-600 mt-2">Uploading icon...</p>
							)}
							{iconPreview && !isUploadingIcon && (
								<div className="mt-4">
									<p className="text-sm text-gray-600 mb-2">Preview:</p>
									<img
										src={iconPreview}
										alt="Icon preview"
										className="w-16 h-16 object-contain rounded-lg border border-gray-300 bg-white p-2"
									/>
								</div>
							)}
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Description
							</label>
							<textarea
								value={formData.tech_stack_description}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										tech_stack_description: e.target.value,
									}))
								}
								placeholder="Describe the technology..."
								rows={4}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
							/>
						</div>

						<div className="flex justify-end gap-4 pt-6">
							<button
								onClick={() => navigate("/tech-stack")}
								disabled={isSaving}
								className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Cancel
							</button>
							<button
								onClick={handleUpdateTechStack}
								disabled={isSaving}
								className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<span>✓</span>
								{isSaving ? "Updating..." : "Update Tech Stack"}
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default TechStackEditPage;
