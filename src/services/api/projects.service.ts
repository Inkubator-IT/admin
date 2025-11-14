import { ApiClient, type ApiResponse } from "./client";
import type { Project, CreateProjectRequest, UpdateProjectRequest } from "./types";

class ProjectsApiService extends ApiClient {
  async getAllProjects(): Promise<ApiResponse<Project[]>> {
    return this.request<Project[]>("/api/projects");
  }

  async getProjectById(id: number): Promise<ApiResponse<Project>> {
    return this.request<Project>(`/api/projects/${id}`);
  }

  async createProject(data: CreateProjectRequest): Promise<ApiResponse<Project>> {
    return this.request<Project>("/api/projects", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateProject(id: number, data: UpdateProjectRequest): Promise<ApiResponse<Project>> {
    return this.request<Project>(`/api/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id: number): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/api/projects/${id}`, {
      method: "DELETE",
    });
  }
}

export const projectsApi = new ProjectsApiService();
