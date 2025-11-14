import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import type { CreateBlogRequest, UpdateBlogRequest } from "@/services/api";

// Query keys
export const blogKeys = {
  all: ["blogs"] as const,
  lists: () => [...blogKeys.all, "list"] as const,
  list: (filters?: { search?: string; tagId?: number; date?: string }) => [...blogKeys.lists(), filters] as const,
  details: () => [...blogKeys.all, "detail"] as const,
  detail: (id: number) => [...blogKeys.details(), id] as const,
};

// Fetch all blogs
export const useBlogs = () => {
  return useQuery({
    queryKey: blogKeys.lists(),
    queryFn: async () => {
      const response = await apiService.getAllBlogs();
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch blogs");
      }
      return response.data || [];
    },
  });
};

// Fetch single blog
export const useBlog = (id: number) => {
  return useQuery({
    queryKey: blogKeys.detail(id),
    queryFn: async () => {
      const response = await apiService.getBlogById(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch blog");
      }
      return response.data;
    },
    enabled: !!id && id > 0,
  });
};

// Create blog mutation
export const useCreateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateBlogRequest) => {
      const response = await apiService.createBlog(data);
      if (!response.success) {
        throw new Error(response.error || "Failed to create blog");
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch blogs list
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
    },
  });
};

// Update blog mutation
export const useUpdateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateBlogRequest }) => {
      const response = await apiService.updateBlog(id, data);
      if (!response.success) {
        throw new Error(response.error || "Failed to update blog");
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate both the list and the specific blog detail
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
      queryClient.invalidateQueries({ queryKey: blogKeys.detail(variables.id) });
    },
  });
};

// Delete blog mutation
export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiService.deleteBlog(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to delete blog");
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate blogs list
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
    },
  });
};
