import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MetaTags from "@/components/MetaTags";
import { useCreateTestimonial } from "@/hooks/useTestimonials";
import { sanitizeText } from "@/utils/sanitizeInput";

const TestimonialCreatePage = () => {
	const navigate = useNavigate();
	const createTestimonialMutation = useCreateTestimonial();

	const [formData, setFormData] = useState({
		full_name: "",
		role: "",
		description: "",
	});

	const validateForm = () => {
		if (!formData.full_name.trim()) {
			alert("Please enter the full name");
			return false;
		}
		if (formData.full_name.length > 100) {
			alert("Full name cannot exceed 100 characters");
			return false;
		}

		if (!formData.role.trim()) {
			alert("Please enter the role/position");
			return false;
		}
		if (formData.role.length > 100) {
			alert("Role/Position cannot exceed 100 characters");
			return false;
		}

		if (!formData.description.trim()) {
			alert("Please enter the description");
			return false;
		}
		if (formData.description.length > 500) {
			alert("Description cannot exceed 500 characters");
			return false;
		}

		return true;
	};

	const handleCreateTestimonial = async () => {
		if (!validateForm()) return;

		try {
			await createTestimonialMutation.mutateAsync({
				full_name: sanitizeText(formData.full_name),
				role: sanitizeText(formData.role),
				description: sanitizeText(formData.description),
			});
			alert("Testimonial created successfully!");
			navigate("/testimonials");
		} catch (error) {
			alert(
				error instanceof Error
					? error.message
					: "Failed to create testimonial",
			);
		}
	};

	const isLoading = createTestimonialMutation.isPending;

	return (
		<div className="p-8">
			<MetaTags
				title="Buat Testimonial Baru - Admin Dashboard Inkubator IT"
				description="Tambahkan testimonial klien baru untuk website Inkubator IT"
				keywords="buat testimonial, client review, inkubator it, admin"
			/>
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">
					Create Testimonial
				</h1>
				<p className="text-gray-600">Add a new client testimonial</p>
			</div>

			<div className="w-full max-w-2xl">
				<div className="space-y-6">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Full Name <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							value={formData.full_name}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									full_name: e.target.value,
								}))
							}
							placeholder="e.g., John Doe"
							maxLength={100}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
						<p className="mt-1 text-xs text-gray-500">
							{formData.full_name.length}/100 characters
						</p>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Role / Position <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							value={formData.role}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, role: e.target.value }))
							}
							placeholder="e.g., CEO at Company"
							maxLength={100}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
						<p className="mt-1 text-xs text-gray-500">
							{formData.role.length}/100 characters
						</p>
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
							placeholder="What the client said about your service..."
							maxLength={500}
							rows={5}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
						/>
						<p className="mt-1 text-xs text-gray-500">
							{formData.description.length}/500 characters
						</p>
					</div>

					<div className="flex items-center gap-4 pt-4">
						<button
							type="button"
							onClick={handleCreateTestimonial}
							disabled={isLoading}
							className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isLoading ? "Creating..." : "Create Testimonial"}
						</button>
						<button
							type="button"
							onClick={() => navigate("/testimonials")}
							className="text-gray-600 hover:text-gray-800 transition-colors"
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TestimonialCreatePage;
