import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { formatDate } from "@/utils/dateUtils";
import MetaTags from "@/components/MetaTags";
import {
	useTestimonials,
	useDeleteTestimonial,
} from "@/hooks/useTestimonials";

const TestimonialListPage = () => {
	const [searchTerm, setSearchTerm] = useState("");

	const {
		data: testimonials = [],
		isLoading,
		error,
	} = useTestimonials();
	const deleteTestimonialMutation = useDeleteTestimonial();

	const handleDeleteTestimonial = async (id: number) => {
		if (!confirm("Are you sure you want to delete this testimonial?")) return;

		try {
			await deleteTestimonialMutation.mutateAsync(id);
			alert("Testimonial deleted successfully!");
		} catch (error) {
			alert(
				error instanceof Error
					? error.message
					: "Failed to delete testimonial",
			);
		}
	};

	const filteredTestimonials = useMemo(() => {
		return testimonials.filter((testimonial) => {
			const matchesSearch =
				testimonial.full_name
					.toLowerCase()
					.includes(searchTerm.toLowerCase()) ||
				testimonial.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
				testimonial.description
					.toLowerCase()
					.includes(searchTerm.toLowerCase());
			return matchesSearch;
		});
	}, [testimonials, searchTerm]);

	if (isLoading) {
		return (
			<div className="p-8">
				<div className="text-center">Loading testimonials...</div>
			</div>
		);
	}

	return (
		<div className="p-8">
			<MetaTags
				title="Kelola Testimonials - Admin Dashboard Inkubator IT"
				description="Kelola testimonial klien untuk website Inkubator IT"
				keywords="testimonial management, client testimonials, inkubator it, admin"
			/>
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Testimonials
					</h1>
					<p className="text-gray-600">
						Manage client testimonials • Total: {testimonials.length}
					</p>
				</div>
				<Link
					to="/testimonials/create"
					className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
				>
					<Plus className="w-4 h-4" />
					Add Testimonial
				</Link>
			</div>

			{error && (
				<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
					Error loading testimonials:{" "}
					{error instanceof Error ? error.message : "Unknown error"}
				</div>
			)}

			<div className="mb-6">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
					<input
						type="text"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder="Search testimonials..."
						className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
				</div>
			</div>

			<div className="bg-white rounded-lg shadow-sm border">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50 border-b">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Full Name
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Role / Position
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Description
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Created At
								</th>
								<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{filteredTestimonials.length === 0 ? (
								<tr>
									<td
										colSpan={5}
										className="px-6 py-8 text-center text-gray-500"
									>
										{searchTerm
											? "No testimonials match your search."
											: "No testimonials yet. Add your first testimonial!"}
									</td>
								</tr>
							) : (
								filteredTestimonials.map((testimonial) => (
									<tr key={testimonial.id} className="hover:bg-gray-50">
										<td className="px-6 py-4 whitespace-nowrap">
											<span className="text-sm font-medium text-gray-900">
												{testimonial.full_name}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span className="text-sm text-gray-600">
												{testimonial.role}
											</span>
										</td>
										<td className="px-6 py-4">
											<span className="text-sm text-gray-600 line-clamp-2">
												{testimonial.description}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span className="text-sm text-gray-500">
												{formatDate(testimonial.created_at)}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-right">
											<div className="flex items-center justify-end gap-4">
												<Link
													to={`/testimonials/${testimonial.id}/edit`}
													className="flex items-center gap-1 text-gray-600 hover:text-gray-800 transition-colors"
												>
													<Edit className="w-4 h-4" />
													Edit
												</Link>
												<button
													type="button"
													onClick={() =>
														handleDeleteTestimonial(testimonial.id)
													}
													disabled={deleteTestimonialMutation.isPending}
													className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
												>
													<Trash2 className="w-4 h-4" />
													{deleteTestimonialMutation.isPending
														? "Deleting..."
														: "Delete"}
												</button>
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default TestimonialListPage;
