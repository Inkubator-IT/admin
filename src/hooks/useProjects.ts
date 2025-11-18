import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import type {
	CreateProjectRequest,
	UpdateProjectRequest,
} from "@/services/api";

// Query keys
export const projectKeys = {
	all: ["projects"] as const,
	lists: () => [...projectKeys.all, "list"] as const,
	details: () => [...projectKeys.all, "detail"] as const,
	detail: (id: number) => [...projectKeys.details(), id] as const,
};

// Fetch all projects
export const useProjects = () => {
	return useQuery({
		queryKey: projectKeys.lists(),
		queryFn: async () => {
			const response = await apiService.getAllProjects();
			if (!response.success) {
				throw new Error(response.error || "Failed to fetch projects");
			}
			return response.data || [];
		},
	});
};

// Fetch single project
export const useProject = (id: number) => {
	return useQuery({
		queryKey: projectKeys.detail(id),
		queryFn: async () => {
			const response = await apiService.getProjectById(id);
			if (!response.success) {
				throw new Error(response.error || "Failed to fetch project");
			}
			return response.data;
		},
		enabled: !!id && id > 0,
	});
};

// Create project mutation
export const useCreateProject = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreateProjectRequest) => {
			const response = await apiService.createProject(data);
			if (!response.success) {
				throw new Error(response.error || "Failed to create project");
			}
			return response.data;
		},
		onSuccess: () => {
			// Invalidate and refetch projects list
			queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
		},
	});
};

// Update project mutation
export const useUpdateProject = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: number;
			data: UpdateProjectRequest;
		}) => {
			const response = await apiService.updateProject(id, data);
			if (!response.success) {
				throw new Error(response.error || "Failed to update project");
			}
			return response.data;
		},
		onSuccess: (_, variables) => {
			// Invalidate both the list and the specific project detail
			queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
			queryClient.invalidateQueries({
				queryKey: projectKeys.detail(variables.id),
			});
		},
	});
};

// Delete project mutation
export const useDeleteProject = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: number) => {
			const response = await apiService.deleteProject(id);
			if (!response.success) {
				throw new Error(response.error || "Failed to delete project");
			}
			return response.data;
		},
		onSuccess: () => {
			// Invalidate projects list
			queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
		},
	});
};
