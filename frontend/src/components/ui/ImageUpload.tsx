import { useState, useCallback } from 'react';
import { X, Loader2, Image as ImageIcon } from 'lucide-react';
import { uploadToCloudinary, getCloudinaryImageUrl } from '@/lib/cloudinary';

interface ImageUploadProps {
    value?: string; // Cloudinary public_id
    onChange: (publicId: string) => void;
    className?: string;
    aspectRatio?: 'square' | 'video' | 'banner';
}

const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    banner: 'aspect-[3/1]',
};

export function ImageUpload({
    value,
    onChange,
    className = '',
    aspectRatio = 'video',
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError('Please select an image file');
                return;
            }

            // Validate file size (4MB max)
            if (file.size > 4 * 1024 * 1024) {
                setError('Image must be less than 4MB');
                return;
            }

            setError(null);
            setIsUploading(true);
            setProgress(0);

            try {
                const result = await uploadToCloudinary(file, {
                    type: 'image',
                    onProgress: setProgress,
                });
                onChange(result.publicId);
            } catch (err) {
                console.error('Upload failed:', err);
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
                <div className={`relative ${aspectRatioClasses[aspectRatio]} overflow-hidden rounded-lg bg-zinc-800`}>
                    <img
                        src={getCloudinaryImageUrl(value, { width: 800 })}
                        alt="Uploaded"
                        className="h-full w-full object-cover"
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute right-2 top-2 rounded-full bg-red-500/80 p-1.5 text-white transition-colors hover:bg-red-500"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ) : (
                <label
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className={`flex cursor-pointer flex-col items-center justify-center ${aspectRatioClasses[aspectRatio]} rounded-lg border-2 border-dashed border-zinc-700 bg-zinc-900/50 transition-colors hover:border-violet-500 hover:bg-zinc-800/50`}
                >
                    {isUploading ? (
                        <div className="flex flex-col items-center">
                            <Loader2 className="h-10 w-10 animate-spin text-violet-500" />
                            <span className="mt-3 text-sm font-medium text-zinc-300">
                                Uploading... {progress}%
                            </span>
                            <div className="mt-2 h-1.5 w-32 overflow-hidden rounded-full bg-zinc-700">
                                <div
                                    className="h-full bg-violet-500 transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <div className="rounded-full bg-zinc-800 p-3">
                                <ImageIcon className="h-6 w-6 text-zinc-400" />
                            </div>
                            <span className="mt-3 text-sm font-medium text-zinc-300">
                                Drop image here or click to upload
                            </span>
                            <span className="mt-1 text-xs text-zinc-500">
                                PNG, JPG, WebP up to 4MB
                            </span>
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
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
