import { StorageService } from "@/services/api/storage.service";

/**
 * Upload an image file and return the S3 key
 */
export async function uploadImage(file: File): Promise<string> {
	return StorageService.uploadImage(file);
}

/**
 * Get a presigned URL for displaying an image from S3
 * This gets a presigned URL valid for 1 hour
 */
export async function getImageUrl(key: string): Promise<string> {
	const { url } = await StorageService.getDownloadUrl(key);
	return url;
}

/**
 * Handle image file selection and upload
 * Returns the S3 key and a preview URL
 */
export async function handleImageUpload(
	file: File,
): Promise<{ key: string; previewUrl: string }> {
	// Upload to S3 and get the key
	const key = await uploadImage(file);

	// Get presigned URL for preview
	const previewUrl = await getImageUrl(key);

	return { key, previewUrl };
}
