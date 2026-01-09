import { useState, useCallback } from 'react';
import { X, Loader2, Video, Film } from 'lucide-react';
import { uploadToCloudinary, getVideoThumbnailUrl } from '@/lib/cloudinary';

interface VideoUploadProps {
    value?: string; // Cloudinary public_id
    onChange: (publicId: string) => void;
    className?: string;
}

export function VideoUpload({ value, onChange, className = '' }: VideoUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            // Validate file type
            if (!file.type.startsWith('video/')) {
                setError('Please select a video file');
                return;
            }

            // Validate file size (512MB max)
            if (file.size > 512 * 1024 * 1024) {
                setError('Video must be less than 512MB');
                return;
            }

            setError(null);
            setIsUploading(true);
            setProgress(0);

            try {
                const result = await uploadToCloudinary(file, {
                    type: 'video',
                    onProgress: setProgress,
                });
                onChange(result.publicId);
            } catch (err) {
                console.error('Video upload failed:', err);
                setError('Upload failed. Please try again.');
            } finally {
                setIsUploading(false);
                setProgress(0);
            }
        },
        [onChange]
    );

    const handleRemove = useCallback(() => {
        onChange('');
        setError(null);
    }, [onChange]);

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLLabelElement>) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) {
                const input = document.createElement('input');
                input.type = 'file';
                input.files = e.dataTransfer.files;
                const event = { target: input } as React.ChangeEvent<HTMLInputElement>;
                handleFileChange(event);
            }
        },
        [handleFileChange]
    );

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
    };

    return (
        <div className={className}>
            {value ? (
                <div className="relative aspect-video overflow-hidden rounded-lg bg-zinc-800">
                    <img
                        src={getVideoThumbnailUrl(value)}
                        alt="Video thumbnail"
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <div className="rounded-full bg-violet-500 p-4">
                            <Film className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute right-2 top-2 rounded-full bg-red-500/80 p-1.5 text-white transition-colors hover:bg-red-500"
                    >
                        <X className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1 text-xs text-white">
                        Video uploaded ✓
                    </div>
                </div>
            ) : (
                <label
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="flex aspect-video cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-700 bg-zinc-900/50 transition-colors hover:border-violet-500 hover:bg-zinc-800/50"
                >
                    {isUploading ? (
                        <div className="flex flex-col items-center">
                            <Loader2 className="h-12 w-12 animate-spin text-violet-500" />
                            <span className="mt-4 text-sm font-medium text-zinc-300">
                                Uploading video... {progress}%
                            </span>
                            <div className="mt-3 h-2 w-48 overflow-hidden rounded-full bg-zinc-700">
                                <div
                                    className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <span className="mt-2 text-xs text-zinc-500">
                                This may take a few minutes for large files
                            </span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <div className="rounded-full bg-zinc-800 p-4">
                                <Video className="h-8 w-8 text-zinc-400" />
                            </div>
                            <span className="mt-4 text-sm font-medium text-zinc-300">
                                Drop video here or click to upload
                            </span>
                            <span className="mt-1 text-xs text-zinc-500">
                                MP4, WebM, MOV up to 512MB
                            </span>
                        </div>
                    )}
                    <input
                        type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={isUploading}
                    />
                </label>
            )}

            {error && (
                <p className="mt-2 text-sm text-red-400">{error}</p>
            )}
        </div>
    );
}
