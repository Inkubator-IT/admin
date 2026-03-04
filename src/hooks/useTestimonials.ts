import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import type {
	CreateTestimonialRequest,
	UpdateTestimonialRequest,
} from "@/services/api/types";

// Query keys
export const testimonialKeys = {
	all: ["testimonials"] as const,
	lists: () => [...testimonialKeys.all, "list"] as const,
	details: () => [...testimonialKeys.all, "detail"] as const,
	detail: (id: number) => [...testimonialKeys.details(), id] as const,
};

// Fetch all testimonials
export const useTestimonials = () => {
	return useQuery({
		queryKey: testimonialKeys.lists(),
		queryFn: async () => {
			const response = await apiService.getAllTestimonials();
			if (!response.success) {
				throw new Error(response.error || "Failed to fetch testimonials");
			}
			return response.data || [];
		},
	});
};

// Fetch single testimonial
export const useTestimonial = (id: number) => {
	return useQuery({
		queryKey: testimonialKeys.detail(id),
		queryFn: async () => {
			const response = await apiService.getTestimonialById(id);
			if (!response.success) {
				throw new Error(response.error || "Failed to fetch testimonial");
			}
			return response.data;
		},
		enabled: !!id && id > 0,
	});
};

// Create testimonial mutation
export const useCreateTestimonial = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreateTestimonialRequest) => {
			const response = await apiService.createTestimonial(data);
			if (!response.success) {
				throw new Error(response.error || "Failed to create testimonial");
			}
			return response.data!;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: testimonialKeys.lists() });
		},
	});
};

// Update testimonial mutation
export const useUpdateTestimonial = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: number;
			data: UpdateTestimonialRequest;
		}) => {
			const response = await apiService.updateTestimonial(id, data);
			if (!response.success) {
				throw new Error(response.error || "Failed to update testimonial");
			}
			return response.data!;
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: testimonialKeys.lists() });
			queryClient.invalidateQueries({
				queryKey: testimonialKeys.detail(variables.id),
			});
		},
	});
};

// Delete testimonial mutation
export const useDeleteTestimonial = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: number) => {
			const response = await apiService.deleteTestimonial(id);
			if (!response.success) {
				throw new Error(response.error || "Failed to delete testimonial");
			}
			return response.data!;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: testimonialKeys.lists() });
		},
	});
};
