import { ApiClient, type ApiResponse } from "./client";
import type { Service, CreateServiceRequest, UpdateServiceRequest } from "./types";

class ServicesApiService extends ApiClient {
  async getAllServices(): Promise<ApiResponse<Service[]>> {
    return this.request<Service[]>("/api/services");
  }

  async getServiceById(serviceId: number): Promise<ApiResponse<Service>> {
    return this.request<Service>(`/api/services/${serviceId}`);
  }

  async createService(data: CreateServiceRequest): Promise<ApiResponse<Service>> {
    return this.request<Service>("/api/services", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateService(serviceId: number, data: UpdateServiceRequest): Promise<ApiResponse<Service>> {
    return this.request<Service>(`/api/services/${serviceId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteService(serviceId: number): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/api/services/${serviceId}`, {
      method: "DELETE",
    });
  }
}

export const servicesApi = new ServicesApiService();
