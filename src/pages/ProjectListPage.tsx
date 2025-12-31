import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Edit, Trash2, Star } from "lucide-react";
import { formatDate } from "@/utils/dateUtils";
import MetaTags from "@/components/MetaTags";
import {
	useProjects,
	useDeleteProject,
	useUpdateProject,
} from "@/hooks/useProjects";

const ProjectListPage = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

	// Fetch projects using react-query
	const {
		data: projects = [],
		isLoading: projectsLoading,
		error: projectsError,
	} = useProjects();
	const deleteProjectMutation = useDeleteProject();
	const updateProjectMutation = useUpdateProject();

	const handleDeleteProject = async (id: number) => {
		if (!confirm("Are you sure you want to delete this project?")) return;

		try {
			await deleteProjectMutation.mutateAsync(id);
			alert("Project deleted successfully!");
		} catch (error) {
			alert(
				error instanceof Error ? error.message : "Failed to delete project",
			);
		}
	};

	const handleToggleFeatured = async (
		projectId: number,
		currentFeatured: boolean,
	) => {
		const featuredProjects = projects.filter((p) => p.featured);

		// If trying to feature and already have 3 featured projects
		if (!currentFeatured && featuredProjects.length >= 3) {
			alert(
				"You can only have 3 featured projects at a time. Please unfeature another project first.",
			);
			return;
		}

		try {
			await updateProjectMutation.mutateAsync({
				id: projectId,
				data: {
					featured: !currentFeatured,
				},
			});
		} catch (error) {
			alert(
				error instanceof Error ? error.message : "Failed to update project",
			);
		}
	};

	const filteredProjects = useMemo(() => {
		return projects.filter((project) => {
			const matchesSearch =
				project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				project.owner.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesCategory =
				!selectedCategory || project.category === selectedCategory;

			return matchesSearch && matchesCategory;
		});
	}, [projects, searchTerm, selectedCategory]);

	const featuredCount = projects.filter((p) => p.featured).length;

	const isLoading = projectsLoading;
	const error = projectsError
		? projectsError instanceof Error
			? projectsError.message
			: "Failed to fetch projects"
		: null;

	return (
		<div className="p-8">
			<MetaTags
				title="Kelola Projects - Admin Dashboard Inkubator IT"
				description="Kelola dan atur semua portfolio proyek website Inkubator IT dengan mudah"
				keywords="project management, portfolio, inkubator it, admin"
			/>
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
				<p className="text-gray-600">
					Manage your portfolio projects • Featured: {featuredCount}/3
				</p>
			</div>

			<div className="flex justify-between items-center mb-6">
				<div className="flex gap-4">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
						<input
							type="text"
							placeholder="Search Project"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>

					<select
						value={selectedCategory || ""}
						onChange={(e) =>
							setSelectedCategory(e.target.value ? e.target.value : null)
						}
						className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					>
						<option value="">All Categories</option>
						<option value="web">Web</option>
						<option value="app">App</option>
						<option value="games">Games</option>
						<option value="ai">AI</option>
					</select>
				</div>

				<Link
					to="/projects/create"
					className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
				>
					<Plus className="w-4 h-4" />
					Create Project
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
										Featured
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Title
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Owner
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Category
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Scope
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
								{filteredProjects.length === 0 ? (
									<tr>
										<td
											colSpan={7}
											className="px-6 py-8 text-center text-gray-500"
										>
											No projects found
										</td>
									</tr>
								) : (
									filteredProjects.map((project) => {
										return (
											<tr key={project.id} className="hover:bg-gray-50">
												<td className="px-6 py-4 whitespace-nowrap">
													<button
														onClick={() =>
															handleToggleFeatured(project.id, project.featured)
														}
														className={`transition-colors ${
															project.featured
																? "text-yellow-500 hover:text-yellow-600"
																: "text-gray-300 hover:text-gray-400"
														}`}
														title={
															project.featured
																? "Remove from featured"
																: "Mark as featured"
														}
													>
														<Star
															className="w-5 h-5"
															fill={project.featured ? "currentColor" : "none"}
														/>
													</button>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm font-medium text-gray-900">
														{project.title}
													</div>
													{project.description && (
														<div className="text-sm text-gray-500 truncate max-w-xs">
															{project.description}
														</div>
													)}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													{project.owner}
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
														{project.category}
													</span>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<span
														className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
															project.scope === "internal"
																? "bg-green-100 text-green-800"
																: "bg-purple-100 text-purple-800"
														}`}
													>
														{project.scope}
													</span>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													{formatDate(project.created_at)}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
													<div className="flex items-center gap-2">
														<Link
															to={`/projects/${project.id}/edit`}
															className="text-gray-400 hover:text-gray-600 transition-colors"
														>
															<Edit className="w-4 h-4" />
														</Link>
														<button
															onClick={() => handleDeleteProject(project.id)}
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

export default ProjectListPage;
