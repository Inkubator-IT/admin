import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { formatDate } from "@/utils/dateUtils";
import MetaTags from "@/components/MetaTags";
import { useTechStacks, useDeleteTechStack } from "@/hooks/useTechStack";

const TechStackListPage = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [iconUrls, setIconUrls] = useState<Record<number, string>>({});

	// Fetch tech stacks using react-query
	const {
		data: techStacks = [],
		isLoading: techStacksLoading,
		error: techStacksError,
	} = useTechStacks();
	const deleteTechStackMutation = useDeleteTechStack();

	// Load icon URLs
	useEffect(() => {
		const urls: Record<number, string> = {};
		for (const techStack of techStacks) {
			if (techStack.icon_url) {
				urls[techStack.tech_stack_id] = techStack.icon_url;
			}
		}
		setIconUrls(urls);
	}, [techStacks]);

	const handleDeleteTechStack = async (id: number) => {
		if (!confirm("Are you sure you want to delete this tech stack?")) return;

		try {
			await deleteTechStackMutation.mutateAsync(id);
			alert("Tech stack deleted successfully!");
		} catch (error) {
			alert(
				error instanceof Error ? error.message : "Failed to delete tech stack",
			);
		}
	};

	const filteredTechStacks = useMemo(() => {
		return techStacks.filter((techStack) => {
			const matchesSearch = techStack.tech_stack_name
				.toLowerCase()
				.includes(searchTerm.toLowerCase());

			return matchesSearch;
		});
	}, [techStacks, searchTerm]);

	const isLoading = techStacksLoading;
	const error = techStacksError
		? techStacksError instanceof Error
			? techStacksError.message
			: "Failed to fetch tech stacks"
		: null;

	return (
		<div className="p-8">
			<MetaTags
				title="Kelola Tech Stack - Admin Dashboard Inkubator IT"
				description="Kelola dan atur semua teknologi stack website Inkubator IT dengan mudah"
				keywords="tech stack management, technologies, inkubator it, admin"
			/>
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">Tech Stack</h1>
				<p className="text-gray-600">Manage your technology stacks</p>
			</div>

			<div className="flex justify-between items-center mb-6">
				<div className="flex gap-4">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
						<input
							type="text"
							placeholder="Search Tech Stack"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>
				</div>

				<Link
					to="/tech-stack/create"
					className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
				>
					<Plus className="w-4 h-4" />
					Create Tech Stack
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
										Icon
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Name
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Description
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
								{filteredTechStacks.length === 0 ? (
									<tr>
										<td
											colSpan={5}
											className="px-6 py-8 text-center text-gray-500"
										>
											No tech stacks found
										</td>
									</tr>
								) : (
									filteredTechStacks.map((techStack) => {
										return (
											<tr
												key={techStack.tech_stack_id}
												className="hover:bg-gray-50"
											>
												<td className="px-6 py-4 whitespace-nowrap">
													{iconUrls[techStack.tech_stack_id] ? (
														<img
															src={iconUrls[techStack.tech_stack_id]}
															alt={techStack.tech_stack_name}
															className="w-8 h-8 object-contain"
														/>
													) : (
														<div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
															No icon
														</div>
													)}
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm font-medium text-gray-900">
														{techStack.tech_stack_name}
													</div>
												</td>
												<td className="px-6 py-4">
													<div className="text-sm text-gray-500 max-w-md truncate">
														{techStack.tech_stack_description ||
															"No description"}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													{formatDate(techStack.created_at)}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
													<div className="flex items-center gap-2">
														<Link
															to={`/tech-stack/${techStack.tech_stack_id}/edit`}
															className="text-gray-400 hover:text-gray-600 transition-colors"
														>
															<Edit className="w-4 h-4" />
														</Link>
														<button
															onClick={() =>
																handleDeleteTechStack(techStack.tech_stack_id)
															}
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

export default TechStackListPage;
