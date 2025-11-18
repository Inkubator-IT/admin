import { ApiClient, type ApiResponse } from "./client";
import type {
	ClientInformation,
	CreateClientInformationRequest,
	UpdateClientInformationRequest,
} from "./types";

class ClientInformationApiService extends ApiClient {
	async getAllClientInformation(): Promise<ApiResponse<ClientInformation[]>> {
		return this.request<ClientInformation[]>("/api/client-information");
	}

	async getClientInformationById(
		id: number,
	): Promise<ApiResponse<ClientInformation>> {
		return this.request<ClientInformation>(`/api/client-information/${id}`);
	}

	async createClientInformation(
		data: CreateClientInformationRequest,
	): Promise<ApiResponse<ClientInformation>> {
		return this.request<ClientInformation>("/api/client-information", {
			method: "POST",
			body: JSON.stringify(data),
		});
	}

	async updateClientInformation(
		id: number,
		data: UpdateClientInformationRequest,
	): Promise<ApiResponse<ClientInformation>> {
		return this.request<ClientInformation>(`/api/client-information/${id}`, {
			method: "PUT",
			body: JSON.stringify(data),
		});
	}

	async deleteClientInformation(
		id: number,
	): Promise<ApiResponse<{ message: string }>> {
		return this.request<{ message: string }>(`/api/client-information/${id}`, {
			method: "DELETE",
		});
	}
}

export const clientInformationApi = new ClientInformationApiService();
