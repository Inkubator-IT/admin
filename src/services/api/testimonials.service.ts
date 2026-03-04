import { ApiClient, type ApiResponse } from "./client";
import type {
	Testimonial,
	CreateTestimonialRequest,
	UpdateTestimonialRequest,
} from "./types";

class TestimonialsApiService extends ApiClient {
	async getAllTestimonials(): Promise<ApiResponse<Testimonial[]>> {
		return this.request<Testimonial[]>("/api/testimonials");
	}

	async getTestimonialById(id: number): Promise<ApiResponse<Testimonial>> {
		return this.request<Testimonial>(`/api/testimonials/${id}`);
	}

	async createTestimonial(
		data: CreateTestimonialRequest,
	): Promise<ApiResponse<Testimonial>> {
		return this.request<Testimonial>("/api/testimonials", {
			method: "POST",
			body: JSON.stringify(data),
		});
	}

	async updateTestimonial(
		id: number,
		data: UpdateTestimonialRequest,
	): Promise<ApiResponse<Testimonial>> {
		return this.request<Testimonial>(`/api/testimonials/${id}`, {
			method: "PUT",
			body: JSON.stringify(data),
		});
	}

	async deleteTestimonial(
		id: number,
	): Promise<ApiResponse<{ message: string }>> {
		return this.request<{ message: string }>(`/api/testimonials/${id}`, {
			method: "DELETE",
		});
	}
}

export const testimonialsApi = new TestimonialsApiService();
