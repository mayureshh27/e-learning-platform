import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Loader2, AlertCircle } from 'lucide-react';
import { getSignedVideoUrl } from '@/lib/cloudinary';

interface VideoPlayerProps {
    courseId: string;
    lessonId: string;
    className?: string;
    onEnded?: () => void;
    autoPlay?: boolean;
}

export function VideoPlayer({
    courseId,
    lessonId,
    className = '',
    onEnded,
    autoPlay = false,
}: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const hlsRef = useRef<Hls | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);

    // Fetch signed URL when lesson changes
    useEffect(() => {
        let cancelled = false;

        async function fetchVideoUrl() {
            setIsLoading(true);
            setError(null);

            try {
                const url = await getSignedVideoUrl(courseId, lessonId);
                if (!cancelled) {
                    setVideoUrl(url);
                }
            } catch (err) {
                if (!cancelled) {
                    console.error('Failed to fetch video URL:', err);
                    setError('Unable to load video. Please try again.');
                }
            }
        }

        fetchVideoUrl();

        return () => {
            cancelled = true;
        };
    }, [courseId, lessonId]);

    // Initialize HLS player when URL is available
    useEffect(() => {
        if (!videoUrl || !videoRef.current) return;

        const video = videoRef.current;

        // Cleanup previous HLS instance
        if (hlsRef.current) {
            hlsRef.current.destroy();
            hlsRef.current = null;
        }

        // Check if HLS is needed (for .m3u8 streams)
        const isHlsStream = videoUrl.includes('.m3u8') || videoUrl.includes('f_m3u8');

        if (isHlsStream && Hls.isSupported()) {
            const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: false,
            });

            hls.loadSource(videoUrl);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                setIsLoading(false);
                if (autoPlay) {
                    video.play().catch(() => {
                        // Autoplay blocked by browser
                    });
                }
            });

            hls.on(Hls.Events.ERROR, (_, data) => {
                if (data.fatal) {
                    console.error('HLS fatal error:', data);
                    setError('Video playback error. Please refresh.');
                }
            });

            hlsRef.current = hls;
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // Safari native HLS support
            video.src = videoUrl;
            video.addEventListener('loadedmetadata', () => {
                setIsLoading(false);
                if (autoPlay) {
                    video.play().catch(() => { });
                }
            });
        } else {
            // Fallback for non-HLS URLs
            video.src = videoUrl;
            video.addEventListener('loadedmetadata', () => {
                setIsLoading(false);
            });
        }

        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
        };
    }, [videoUrl, autoPlay]);

    // Handle video end
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !onEnded) return;

        const handleEnded = () => onEnded();
        video.addEventListener('ended', handleEnded);

        return () => {
            video.removeEventListener('ended', handleEnded);
        };
    }, [onEnded]);

    if (error) {
        return (
            <div className={`flex aspect-video items-center justify-center rounded-lg bg-zinc-900 ${className}`}>
                <div className="flex flex-col items-center text-center">
                    <AlertCircle className="h-12 w-12 text-red-400" />
                    <p className="mt-3 text-sm text-zinc-400">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative aspect-video overflow-hidden rounded-lg bg-black ${className}`}>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                    <div className="flex flex-col items-center">
                        <Loader2 className="h-10 w-10 animate-spin text-violet-500" />
                        <span className="mt-3 text-sm text-zinc-400">Loading video...</span>
                    </div>
                </div>
            )}

            <video
                ref={videoRef}
                className="h-full w-full"
                controls
                playsInline
                controlsList="nodownload"
                onContextMenu={(e) => e.preventDefault()} // Discourage right-click download
            />
        </div>
    );
}
