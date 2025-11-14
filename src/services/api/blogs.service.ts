import { ApiClient, type ApiResponse } from "./client";
import type { Blog, CreateBlogRequest, UpdateBlogRequest } from "./types";

class BlogsApiService extends ApiClient {
  async getAllBlogs(): Promise<ApiResponse<Blog[]>> {
    return this.request<Blog[]>("/api/blogs");
  }

  async getBlogById(id: number): Promise<ApiResponse<Blog>> {
    return this.request<Blog>(`/api/blogs/${id}`);
  }

  async getBlogBySlug(slug: string): Promise<ApiResponse<Blog>> {
    return this.request<Blog>(`/api/blogs/slug/${slug}`);
  }

  async createBlog(data: CreateBlogRequest): Promise<ApiResponse<Blog>> {
    return this.request<Blog>("/api/blogs", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateBlog(id: number, data: UpdateBlogRequest): Promise<ApiResponse<Blog>> {
    return this.request<Blog>(`/api/blogs/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteBlog(id: number): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/api/blogs/${id}`, {
      method: "DELETE",
    });
  }
}

export const blogsApi = new BlogsApiService();
