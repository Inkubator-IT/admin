const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

export interface PresignUploadResponse {
	url: string;
	key: string;
	publicUrl: string;
	contentType: string;
}

export interface PresignDownloadResponse {
	url: string;
}

export interface UploadedImage {
	key: string;
	url: string;
}

export class StorageService {
	/**
	 * Get a presigned URL for uploading a file
	 */
	static async getUploadUrl(fileName: string): Promise<PresignUploadResponse> {
		const response = await fetch(`${API_BASE_URL}/api/storage`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ fileName }),
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || "Failed to get upload URL");
		}

		return response.json();
	}

	/**
	 * Upload a file to S3 using the presigned URL
	 */
	static async uploadFile(
		presignedUrl: string,
		file: File,
		contentType: string,
	): Promise<void> {
		const response = await fetch(presignedUrl, {
			method: "PUT",
			headers: {
				"Content-Type": contentType,
			},
			body: file,
		});

		if (!response.ok) {
			throw new Error("Failed to upload file to S3");
		}
	}

	/**
	 * Get a presigned URL for downloading/viewing a file
	 */
	static isPublicUrl(value: string | null | undefined) {
		return !!value && /^https?:\/\//i.test(value);
	}

	static async getDownloadUrl(key: string): Promise<PresignDownloadResponse> {
		if (this.isPublicUrl(key)) {
			return { url: key };
		}

		const response = await fetch(
			`${API_BASE_URL}/api/storage?key=${encodeURIComponent(key)}`,
		);

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || "Failed to get download URL");
		}

		return response.json();
	}

	/**
	 * Complete upload flow: get presigned URL and upload file
	 * Returns the S3 key that should be stored in the database
	 */
	static async uploadImage(file: File): Promise<UploadedImage> {
		// Validate file
		if (!file.type.startsWith("image/")) {
			throw new Error("Please select a valid image file");
		}

		if (file.size > 10 * 1024 * 1024) {
			throw new Error("Image size should be less than 10MB");
		}

		// Get presigned URL
		const { url, key, publicUrl, contentType } = await this.getUploadUrl(
			file.name,
		);

		// Upload file to S3
		await this.uploadFile(url, file, contentType);

		return { key, url: publicUrl };
	}
}
