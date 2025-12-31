import {
	StorageService,
	type UploadedImage,
} from "@/services/api/storage.service";

export async function uploadImage(file: File): Promise<UploadedImage> {
	return StorageService.uploadImage(file);
}

export async function handleImageUpload(
	file: File,
): Promise<{ key: string; url: string }> {
	const { key, url } = await uploadImage(file);
	return { key, url };
}
