import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MetaTags from "@/components/MetaTags";
import { useCreateTechStack } from "@/hooks/useTechStack";
import { sanitizeText } from "@/utils/sanitizeInput";
import { handleImageUpload } from "@/utils/imageUpload";

const TechStackCreatePage = () => {
	const navigate = useNavigate();
	const createTechStackMutation = useCreateTechStack();

	const [formData, setFormData] = useState({
		tech_stack_name: "",
		tech_stack_description: "",
		icon_url: "",
	});

	const [iconPreview, setIconPreview] = useState<string>("");
	const [isUploadingIcon, setIsUploadingIcon] = useState(false);

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

	const handleCreateTechStack = async () => {
		if (!validateForm()) return;

		try {
			await createTechStackMutation.mutateAsync({
				tech_stack_name: sanitizeText(formData.tech_stack_name),
				tech_stack_description: sanitizeText(formData.tech_stack_description),
				icon_url: formData.icon_url,
			});
			alert("Tech stack created successfully!");
			navigate("/tech-stack");
		} catch (error) {
			alert(
				error instanceof Error ? error.message : "Failed to create tech stack",
			);
		}
	};

	const isLoading = createTechStackMutation.isPending;

	return (
		<div className="p-8">
			<MetaTags
				title="Buat Tech Stack Baru - Admin Dashboard Inkubator IT"
				description="Buat teknologi stack baru untuk website Inkubator IT"
				keywords="buat tech stack, teknologi, inkubator it, admin"
			/>
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">
					Create Tech Stack
				</h1>
				<p className="text-gray-600">Add new technology stack</p>
			</div>

			<div className="w-full max-w-2xl">
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
							placeholder="Enter tech stack name (e.g., React, Node.js)"
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
							className="w-full px-3 py-2 border border-gray-300 rounded-lg"
						/>
						{isUploadingIcon && (
							<p className="text-sm text-blue-600 mt-2">Uploading icon...</p>
						)}
						{iconPreview && !isUploadingIcon && (
							<div className="mt-4">
								<p className="text-sm text-gray-600 mb-2">Preview</p>
								<img
									src={iconPreview}
									alt="Icon Preview"
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
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>

					<div className="flex justify-end gap-4 pt-6">
						<button
							onClick={() => navigate("/tech-stack")}
							disabled={isLoading}
							className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Cancel
						</button>
						<button
							onClick={handleCreateTechStack}
							disabled={isLoading}
							className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<span>+</span>
							{createTechStackMutation.isPending
								? "Creating..."
								: "Create Tech Stack"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TechStackCreatePage;
