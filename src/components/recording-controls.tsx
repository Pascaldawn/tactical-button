"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/store/auth-context"
import { toast } from "sonner"
import { Play, Square, Download, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTacticsBoardWithContext } from "@/hooks/use-tactics-board"
import html2canvas from "html2canvas"
import { saveRecordingBlob, loadRecordingBlob, deleteRecordingBlob } from "@/lib/utils";

interface RecordingControlsProps {
    isRecording: boolean
    onRecordingChange: (recording: boolean) => void
    webcamVideoRef: React.RefObject<HTMLVideoElement>
}

const maxRecordingTime = 180 // 3 minutes in seconds
const RECORDING_KEY = "latest-recording";

export function RecordingControls({
    isRecording,
    onRecordingChange,
    webcamVideoRef,
}: RecordingControlsProps) {
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
    const [isExporting, setIsExporting] = useState(false)
    const [exportProgress, setExportProgress] = useState(0)
    const [recordingTime, setRecordingTime] = useState(0)
    const { user } = useAuth()
    const router = useRouter()

    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const recordedChunksRef = useRef<Blob[]>([])
    const recordingActiveRef = useRef(false)
    const recordingStartTimeRef = useRef<number>(0)
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const animationFrameRef = useRef<number | null>(null)

    // Access board state for dependency tracking
    const {
        players,
        drawings,
        homeTeam,
        awayTeam,
        homeFormation,
        awayFormation,
        drawingMode,
    } = useTacticsBoardWithContext();

    // Detect if device is mobile
    const isMobile = () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth <= 768;
    }

    // Recording timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRecording && recordingActiveRef.current) {
            interval = setInterval(() => {
                const elapsed = Math.floor((Date.now() - recordingStartTimeRef.current) / 1000);
                setRecordingTime(elapsed);
                
                if (elapsed >= maxRecordingTime) {
                    handleStopRecording();
                    toast.info("Recording stopped", { description: "Maximum recording time reached.", duration: 2000 });
                }
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRecording]);

    useEffect(() => {
        // On mount, try to restore recording from IndexedDB
        loadRecordingBlob(RECORDING_KEY).then(blob => {
            if (blob) setRecordedBlob(blob);
        });
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // Mobile screen recording with camera overlay
    const startMobileRecording = async () => {
        try {
            // 1. Get camera stream for overlay
            const cameraStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 320 },
                    height: { ideal: 240 },
                    frameRate: { ideal: 15 }
                },
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    sampleRate: 48000
                }
            });

            // 2. Create canvas for compositing
            const canvas = document.createElement('canvas');
            canvas.width = 1280;
            canvas.height = 720;
            canvasRef.current = canvas;
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Could not get canvas context');

            // 3. Create video element for camera stream
            const cameraVideo = document.createElement('video');
            cameraVideo.srcObject = cameraStream;
            cameraVideo.muted = true;
            cameraVideo.playsInline = true;
            await cameraVideo.play();

            // 4. Get the record page container
            const recordPage = document.querySelector('[data-record-page]') as HTMLElement;
            if (!recordPage) {
                throw new Error('Record page not found');
            }

            // 5. Frame capture and composition loop
            let running = true;
            const captureFrame = async () => {
                if (!running) return;

                try {
                    // Capture the record page
                    const screenshot = await html2canvas(recordPage, {
                        backgroundColor: null,
                        scale: 1,
                        useCORS: true,
                        allowTaint: true,
                        logging: false,
                        width: recordPage.offsetWidth,
                        height: recordPage.offsetHeight,
                        scrollX: 0,
                        scrollY: 0,
                        windowWidth: window.innerWidth,
                        windowHeight: window.innerHeight,
                    });

                    // Clear canvas
                    ctx.clearRect(0, 0, 1280, 720);

                    // Scale and center the screenshot
                    const scaleX = 1280 / screenshot.width;
                    const scaleY = 720 / screenshot.height;
                    const scale = Math.min(scaleX, scaleY);
                    
                    const scaledWidth = screenshot.width * scale;
                    const scaledHeight = screenshot.height * scale;
                    const offsetX = (1280 - scaledWidth) / 2;
                    const offsetY = (720 - scaledHeight) / 2;

                    // Draw the record page screenshot
                    ctx.drawImage(screenshot, offsetX, offsetY, scaledWidth, scaledHeight);

                    // Draw camera overlay in bottom-right corner
                    const cameraWidth = 200;
                    const cameraHeight = 150;
                    const cameraX = 1280 - cameraWidth - 20;
                    const cameraY = 720 - cameraHeight - 20;

                    // Add rounded corner effect for camera
                    ctx.save();
                    ctx.beginPath();
                    ctx.roundRect(cameraX, cameraY, cameraWidth, cameraHeight, 10);
                    ctx.clip();
                    ctx.drawImage(cameraVideo, cameraX, cameraY, cameraWidth, cameraHeight);
                    ctx.restore();

                    // Add border around camera
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 3;
                    ctx.strokeRect(cameraX, cameraY, cameraWidth, cameraHeight);

                } catch (error) {
                    console.error('Frame capture error:', error);
                }

                // Continue at 10 FPS for mobile (better performance)
                setTimeout(captureFrame, 1000 / 10);
            };

            captureFrame();

            // 6. Get canvas stream
            const canvasStream = canvas.captureStream(10);

            // 7. Start MediaRecorder
            const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') 
                ? 'video/webm;codecs=vp9' 
                : MediaRecorder.isTypeSupported('video/webm;codecs=vp8')
                ? 'video/webm;codecs=vp8'
                : 'video/webm';
                
            mediaRecorderRef.current = new MediaRecorder(canvasStream, { 
                mimeType,
                videoBitsPerSecond: 3000000, // 3 Mbps for mobile (better performance)
            });

            recordedChunksRef.current = [];
            
            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                running = false;
                recordingActiveRef.current = false;
                
                if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current);
                }
                
                const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
                setRecordedBlob(blob);
                
                // Clean up
                cameraStream.getTracks().forEach(track => track.stop());
                mediaRecorderRef.current = null;
            };

            mediaRecorderRef.current.start(1000);
            onRecordingChange(true);
            
            toast.success("Mobile screen recording started", { 
                description: "Recording screen with camera overlay. Please wait for first frame...", 
                duration: 3000 
            });
            
        } catch (err) {
            console.error('Mobile recording error:', err);
            recordingActiveRef.current = false;
            
            if (err instanceof Error && err.name === 'NotAllowedError') {
                toast.error("Camera access denied", { 
                    description: "Please allow camera and microphone access to record on mobile.", 
                    duration: 4000 
                });
            } else {
                toast.error("Mobile recording failed", { 
                    description: "Please try again or use desktop for better quality.", 
                    duration: 3000 
                });
            }
        }
    }

    // Desktop recording using getDisplayMedia
    const startDesktopRecording = async () => {
        try {
            // 1. Get screen capture with audio
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    frameRate: { ideal: 30 }
                },
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    sampleRate: 48000
                }
            });

            // 2. Get microphone audio separately for better quality
            let microphoneStream: MediaStream | null = null;
            try {
                microphoneStream = await navigator.mediaDevices.getUserMedia({ 
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true,
                        sampleRate: 48000
                    } 
                });
            } catch (err) {
                console.log('Microphone not available, using screen audio only');
            }

            // 3. Combine screen and microphone audio
            const audioTracks = [
                ...screenStream.getAudioTracks(),
                ...(microphoneStream ? microphoneStream.getAudioTracks() : [])
            ];

            const combinedStream = new MediaStream([
                ...screenStream.getVideoTracks(),
                ...audioTracks
            ]);

            // 4. Start MediaRecorder with high quality settings
            const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') 
                ? 'video/webm;codecs=vp9' 
                : MediaRecorder.isTypeSupported('video/webm;codecs=vp8')
                ? 'video/webm;codecs=vp8'
                : 'video/webm';
                
            mediaRecorderRef.current = new MediaRecorder(combinedStream, { 
                mimeType,
                videoBitsPerSecond: 8000000, // 8 Mbps for high quality
            });

            recordedChunksRef.current = [];
            
            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                recordingActiveRef.current = false;
                
                const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
                setRecordedBlob(blob);
                
                // Clean up all tracks
                combinedStream.getTracks().forEach(track => track.stop());
                if (microphoneStream) {
                    microphoneStream.getTracks().forEach(track => track.stop());
                }
                
                mediaRecorderRef.current = null;
            };

            mediaRecorderRef.current.start(1000); // 1-second chunks for better handling
            onRecordingChange(true);
            
            toast.success("Desktop recording started", { 
                description: "Select the record page tab/window to capture. Make sure to include the entire page.", 
                duration: 3000 
            });
            
        } catch (err) {
            console.error('Desktop recording error:', err);
            recordingActiveRef.current = false;
            
            if (err instanceof Error && err.name === 'NotAllowedError') {
                toast.error("Permission denied", { 
                    description: "Please allow screen sharing and microphone access to record.", 
                    duration: 4000 
                });
            } else {
                toast.error("Desktop recording failed", { 
                    description: "Could not start recording. Please try again.", 
                    duration: 3000 
                });
            }
        }
    }

    // Main recording function that detects device type
    const startRecording = async () => {
        setRecordedBlob(null);
        recordedChunksRef.current = [];
        recordingActiveRef.current = true;
        recordingStartTimeRef.current = Date.now();
        
        if (isMobile()) {
            await startMobileRecording();
        } else {
            await startDesktopRecording();
        }
    }

    const handleStartRecording = () => {
        startRecording();
    }

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && recordingActiveRef.current) {
            mediaRecorderRef.current.stop();
            onRecordingChange(false);
            toast.success("Recording stopped", { 
                description: "Your video is ready for download.", 
                duration: 2000 
            });
        }
    }

    useEffect(() => {
        // Save to IndexedDB when a new recording is available
        if (recordedBlob) {
            saveRecordingBlob(RECORDING_KEY, recordedBlob);
        }
    }, [recordedBlob]);

    const handleDownload = () => {
        if (user?.subscriptionStatus !== 'active') {
            toast.error("Subscription required", {
                description: "Please subscribe to download your recordings.",
                duration: 2000,
            })
            router.push("/subscribe")
            return
        }
        if (!recordedBlob) {
            toast.error("No recording available", { 
                description: "Please record a session first.", 
                duration: 2000 
            });
            return;
        }
        const url = URL.createObjectURL(recordedBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tactics-recording-${Date.now()}.webm`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success("Download started", { 
            description: "Your recording is being downloaded.", 
            duration: 2000 
        });
        setRecordedBlob(null); // Only clear after successful download
        deleteRecordingBlob(RECORDING_KEY); // Remove from IndexedDB
    }

    return (
        <div className="space-y-4">
            {/* Recording Timer */}
            <div className="flex items-center space-x-2 text-sm">
                <Clock className="w-4 h-4" />
                <span>
                    {formatTime(recordingTime)} / {formatTime(maxRecordingTime)}
                </span>
            </div>
            {/* Recording Progress */}
            <Progress value={(recordingTime / maxRecordingTime) * 100} className="h-2" />
            {/* Recording Controls */}
            <div className="space-y-2">
                {!isRecording && !recordedBlob && (
                    <Button onClick={handleStartRecording} className="w-full">
                        <Play className="w-4 h-4 mr-2" />
                        Start Recording
                    </Button>
                )}
                {isRecording && (
                    <Button onClick={handleStopRecording} variant="destructive" className="w-full">
                        <Square className="w-4 h-4 mr-2" />
                        Stop Recording
                    </Button>
                )}
                {recordedBlob && !isRecording && (
                    <div className="space-y-2">
                        <Button onClick={handleDownload} variant="outline" className="w-full bg-transparent">
                            <Download className="w-4 h-4 mr-2" />
                            Download Recording
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
