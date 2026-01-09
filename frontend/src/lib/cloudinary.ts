import api from '@/services/api';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

interface UploadSignatureResponse {
    timestamp: number;
    signature: string;
    folder: string;
    apiKey: string;
    cloudName: string;
    eager?: string;
    eager_async?: string;
}

interface UploadOptions {
    type: 'image' | 'video';
    folder?: string;
    onProgress?: (percent: number) => void;
}

interface UploadResult {
    publicId: string;
    url: string;
    format: string;
    width?: number;
    height?: number;
    duration?: number;
}

/**
 * Upload a file directly to Cloudinary using signed upload
 * The signature is generated on the backend to keep API secret secure
 */
export async function uploadToCloudinary(
    file: File,
    options: UploadOptions
): Promise<UploadResult> {
    // 1. Get signature from backend
    const endpoint = options.type === 'video'
        ? '/upload/signature/video'
        : '/upload/signature/image';

    const { data: sigResponse } = await api.post(endpoint, {
        folder: options.folder || `e-learning/${options.type}s`,
    });

    const sigData: UploadSignatureResponse = sigResponse.data;

    // 2. Build form data for Cloudinary upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', sigData.apiKey);
    formData.append('timestamp', String(sigData.timestamp));
    formData.append('signature', sigData.signature);
    formData.append('folder', sigData.folder);

    // For videos, include eager transformation
    if (options.type === 'video' && sigData.eager) {
        formData.append('eager', sigData.eager);
        formData.append('eager_async', 'true');
    }

    // 3. Upload directly to Cloudinary
    const resourceType = options.type === 'video' ? 'video' : 'image';
    const uploadUrl = `https://api.cloudinary.com/v1_1/${sigData.cloudName}/${resourceType}/upload`;

    return new Promise<UploadResult>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Track upload progress
        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable && options.onProgress) {
                const percent = Math.round((e.loaded / e.total) * 100);
                options.onProgress(percent);
            }
        };

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                const result = JSON.parse(xhr.responseText);
                resolve({
                    publicId: result.public_id,
                    url: result.secure_url,
                    format: result.format,
                    width: result.width,
                    height: result.height,
                    duration: result.duration,
                });
            } else {
                reject(new Error(`Upload failed with status ${xhr.status}`));
            }
        };

        xhr.onerror = () => reject(new Error('Upload failed - network error'));
        xhr.open('POST', uploadUrl);
        xhr.send(formData);
    });
}

/**
 * Generate optimized image URL from Cloudinary
 */
export function getCloudinaryImageUrl(
    publicId: string,
    options?: { width?: number; height?: number; crop?: string }
): string {
    if (!CLOUD_NAME || !publicId) return '';

    const transformations: string[] = ['q_auto', 'f_auto'];

    if (options?.width) transformations.push(`w_${options.width}`);
    if (options?.height) transformations.push(`h_${options.height}`);
    if (options?.crop) transformations.push(`c_${options.crop}`);

    const transformString = transformations.join(',');
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformString}/${publicId}`;
}

/**
 * Generate video thumbnail URL from Cloudinary
 */
export function getVideoThumbnailUrl(publicId: string, width = 400): string {
    if (!CLOUD_NAME || !publicId) return '';
    return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/w_${width},c_scale,so_0/${publicId}.jpg`;
}

/**
 * Fetch signed video URL for secure playback
 */
export async function getSignedVideoUrl(courseId: string, lessonId: string): Promise<string> {
    const { data } = await api.get(`/upload/video/${courseId}/${lessonId}`);
    return data.data.url;
}
