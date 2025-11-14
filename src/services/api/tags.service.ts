import { ApiClient, type ApiResponse } from "./client";
import type { Tag, CreateTagRequest, UpdateTagRequest } from "./types";

class TagsApiService extends ApiClient {
  async getAllTags(): Promise<ApiResponse<Tag[]>> {
    return this.request<Tag[]>("/api/tags");
  }

  async getTagById(tagId: number): Promise<ApiResponse<Tag>> {
    return this.request<Tag>(`/api/tags/${tagId}`);
  }

  async createTag(data: CreateTagRequest): Promise<ApiResponse<Tag>> {
    return this.request<Tag>("/api/tags", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateTag(tagId: number, data: UpdateTagRequest): Promise<ApiResponse<Tag>> {
    return this.request<Tag>(`/api/tags/${tagId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteTag(tagId: number): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/api/tags/${tagId}`, {
      method: "DELETE",
    });
  }
}

export const tagsApi = new TagsApiService();
