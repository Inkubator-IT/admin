import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import type { CreateTagRequest, UpdateTagRequest } from "@/services/api/types";

// Query keys
export const tagKeys = {
	all: ["tags"] as const,
	lists: () => [...tagKeys.all, "list"] as const,
	details: () => [...tagKeys.all, "detail"] as const,
	detail: (id: number) => [...tagKeys.details(), id] as const,
};

// Fetch all tags
export const useTags = () => {
	return useQuery({
		queryKey: tagKeys.lists(),
		queryFn: async () => {
			const response = await apiService.getAllTags();
			if (!response.success) {
				throw new Error(response.error || "Failed to fetch tags");
			}
			return response.data || [];
		},
	});
};

// Fetch single tag
export const useTag = (id: number) => {
	return useQuery({
		queryKey: tagKeys.detail(id),
		queryFn: async () => {
			const response = await apiService.getTagById(id);
			if (!response.success) {
				throw new Error(response.error || "Failed to fetch tag");
			}
			return response.data;
		},
		enabled: !!id && id > 0,
	});
};

// Create tag mutation
export const useCreateTag = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreateTagRequest) => {
			const response = await apiService.createTag(data);
			if (!response.success) {
				throw new Error(response.error || "Failed to create tag");
			}
			return response.data!;
		},
		onSuccess: () => {
			// Invalidate tags list to refetch
			queryClient.invalidateQueries({ queryKey: tagKeys.lists() });
		},
	});
};

// Update tag mutation
export const useUpdateTag = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: number;
			data: UpdateTagRequest;
		}) => {
			const response = await apiService.updateTag(id, data);
			if (!response.success) {
				throw new Error(response.error || "Failed to update tag");
			}
			return response.data!;
		},
		onSuccess: (data) => {
			// Invalidate tags list and specific tag
			queryClient.invalidateQueries({ queryKey: tagKeys.lists() });
			queryClient.invalidateQueries({ queryKey: tagKeys.detail(data.tag_id) });
		},
	});
};

// Delete tag mutation
export const useDeleteTag = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: number) => {
			const response = await apiService.deleteTag(id);
			if (!response.success) {
				throw new Error(response.error || "Failed to delete tag");
			}
			return response.data!;
		},
		onSuccess: () => {
			// Invalidate tags list to refetch
			queryClient.invalidateQueries({ queryKey: tagKeys.lists() });
		},
	});
};
