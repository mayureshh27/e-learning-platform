import { v2 as cloudinary } from 'cloudinary';
import logger from '../utils/logger';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

/**
 * Generate signed upload signature for direct client uploads
 * This allows the client to upload directly to Cloudinary without exposing API secret
 */
export function generateUploadSignature(folder: string, resourceType: 'image' | 'video' = 'image') {
    const timestamp = Math.round(Date.now() / 1000);
    const params: Record<string, string | number> = {
        timestamp,
        folder,
    };

    // For videos, add eager transformation for HLS streaming
    if (resourceType === 'video') {
        params.eager = 'sp_auto/m3u8';
        params.eager_async = 'true';
        params.resource_type = 'video';
    }

    const signature = cloudinary.utils.api_sign_request(
        params,
        process.env.CLOUDINARY_API_SECRET!
    );

    logger.debug({ msg: 'Generated upload signature', folder, resourceType });

    return {
        timestamp,
        signature,
        folder,
        apiKey: process.env.CLOUDINARY_API_KEY,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        ...(resourceType === 'video' && { eager: params.eager, eager_async: params.eager_async }),
    };
}

/**
 * Generate signed URL for secure video playback
 * URLs expire after the specified duration (default 1 hour)
 * Returns HLS streaming URL for adaptive quality
 */
export function getSignedVideoUrl(publicId: string, expiresInSeconds = 3600): string {
    const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;

    logger.info({
        msg: 'Generating signed video URL',
        publicId,
        expiresAt,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME
    });

    // Generate HLS streaming URL with signature
    // Note: Using 'upload' type since videos were uploaded normally, not to authenticated folder
    const url = cloudinary.url(publicId, {
        resource_type: 'video',
        type: 'upload', // Changed from 'authenticated' to 'upload'
        sign_url: true,
        expires_at: expiresAt,
        format: 'm3u8',
        streaming_profile: 'auto',
    });

    logger.info({ msg: 'Generated signed video URL', url });
    return url;
}

/**
 * Generate optimized image URL with automatic format and quality
 */
export function getImageUrl(
    publicId: string,
    options?: { width?: number; height?: number; crop?: string }
): string {
    const transformations: object[] = [
        { quality: 'auto', fetch_format: 'auto' },
    ];

    if (options?.width || options?.height) {
        transformations.push({
            width: options.width,
            height: options.height,
            crop: options.crop || 'scale',
        });
    }

    return cloudinary.url(publicId, {
        resource_type: 'image',
        transformation: transformations,
        secure: true,
    });
}

/**
 * Delete a file from Cloudinary
 */
export async function deleteFile(publicId: string, resourceType: 'image' | 'video' = 'image') {
    try {
        const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
        logger.info({ msg: 'Deleted file from Cloudinary', publicId, result });
        return result;
    } catch (error) {
        logger.error({ msg: 'Failed to delete file from Cloudinary', publicId, error });
        throw error;
    }
}

export default cloudinary;
