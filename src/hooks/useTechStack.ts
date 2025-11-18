import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import type {
	CreateTechStackRequest,
	UpdateTechStackRequest,
} from "@/services/api";

// Query keys
export const techStackKeys = {
	all: ["techStacks"] as const,
	lists: () => [...techStackKeys.all, "list"] as const,
	details: () => [...techStackKeys.all, "detail"] as const,
	detail: (id: number) => [...techStackKeys.details(), id] as const,
};

// Fetch all tech stacks
export const useTechStacks = () => {
	return useQuery({
		queryKey: techStackKeys.lists(),
		queryFn: async () => {
			const response = await apiService.getAllTechStacks();
			if (!response.success) {
				throw new Error(response.error || "Failed to fetch tech stacks");
			}
			return response.data || [];
		},
	});
};

// Fetch single tech stack
export const useTechStack = (id: number) => {
	return useQuery({
		queryKey: techStackKeys.detail(id),
		queryFn: async () => {
			const response = await apiService.getTechStackById(id);
			if (!response.success) {
				throw new Error(response.error || "Failed to fetch tech stack");
			}
			return response.data;
		},
		enabled: !!id && id > 0,
	});
};

// Create tech stack mutation
export const useCreateTechStack = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreateTechStackRequest) => {
			const response = await apiService.createTechStack(data);
			if (!response.success) {
				throw new Error(response.error || "Failed to create tech stack");
			}
			return response.data;
		},
		onSuccess: () => {
			// Invalidate and refetch tech stacks list
			queryClient.invalidateQueries({ queryKey: techStackKeys.lists() });
		},
	});
};

// Update tech stack mutation
export const useUpdateTechStack = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: number;
			data: UpdateTechStackRequest;
		}) => {
			const response = await apiService.updateTechStack(id, data);
			if (!response.success) {
				throw new Error(response.error || "Failed to update tech stack");
			}
			return response.data;
		},
		onSuccess: (_, variables) => {
			// Invalidate both the list and the specific tech stack detail
			queryClient.invalidateQueries({ queryKey: techStackKeys.lists() });
			queryClient.invalidateQueries({
				queryKey: techStackKeys.detail(variables.id),
			});
		},
	});
};

// Delete tech stack mutation
export const useDeleteTechStack = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: number) => {
			const response = await apiService.deleteTechStack(id);
			if (!response.success) {
				throw new Error(response.error || "Failed to delete tech stack");
			}
			return response.data;
		},
		onSuccess: () => {
			// Invalidate tech stacks list
			queryClient.invalidateQueries({ queryKey: techStackKeys.lists() });
		},
	});
};
