import { ApiClient, type ApiResponse } from "./client";
import type { TechStack, CreateTechStackRequest, UpdateTechStackRequest } from "./types";

class TechStackApiService extends ApiClient {
  async getAllTechStacks(): Promise<ApiResponse<TechStack[]>> {
    return this.request<TechStack[]>("/api/tech-stack");
  }

  async getTechStackById(techStackId: number): Promise<ApiResponse<TechStack>> {
    return this.request<TechStack>(`/api/tech-stack/${techStackId}`);
  }

  async createTechStack(data: CreateTechStackRequest): Promise<ApiResponse<TechStack>> {
    return this.request<TechStack>("/api/tech-stack", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateTechStack(techStackId: number, data: UpdateTechStackRequest): Promise<ApiResponse<TechStack>> {
    return this.request<TechStack>(`/api/tech-stack/${techStackId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteTechStack(techStackId: number): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/api/tech-stack/${techStackId}`, {
      method: "DELETE",
    });
  }
}

export const techStackApi = new TechStackApiService();
