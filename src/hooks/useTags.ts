import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api";

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
