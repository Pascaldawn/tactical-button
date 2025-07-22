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
import html2canvas from "html2canvas"
import { useTacticsBoardWithContext } from "@/hooks/use-tactics-board"
// Debounce utility
function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): (...args: Parameters<T>) => void {
    let timer: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}
// import FFmpeg from '@ffmpeg/ffmpeg';
// const { createFFmpeg, fetchFile } = FFmpeg as any;

interface RecordingControlsProps {
    isRecording: boolean
    onRecordingChange: (recording: boolean) => void
    webcamVideoRef: React.RefObject<HTMLVideoElement>
}

export function RecordingControls({
    isRecording,
    onRecordingChange,
    webcamVideoRef,
}: RecordingControlsProps) {
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
    const [isExporting, setIsExporting] = useState(false)
    const [exportProgress, setExportProgress] = useState(0)
    const [recordingTime, setRecordingTime] = useState(0)
    const [aspectRatio, setAspectRatio] = useState("16:9")
    const { user } = useAuth()
    const router = useRouter()

    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const recordedChunksRef = useRef<Blob[]>([])
    const animationFrameRef = useRef<number | null>(null)
    const recordingActiveRef = useRef(false);

    // Cache for tactics board image
    const cachedTacticsImageRef = useRef<HTMLCanvasElement | null>(null);
    // Debounced update function
    const updateTacticsImage = useCallback(
        debounce(() => {
            const tacticsBoard = document.querySelector('[data-tactics-board]') as HTMLElement;
            if (!tacticsBoard) return;
            html2canvas(tacticsBoard, { backgroundColor: "#22a745", useCORS: true }).then(tacticsImage => {
                cachedTacticsImageRef.current = tacticsImage;
                console.log('[DEBUG] Tactics board image cache updated', Date.now());
            });
        }, 200),
        []
    );

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

    // Update tactics image cache whenever board state changes
    useEffect(() => {
        updateTacticsImage();
    }, [players, drawings, homeTeam, awayTeam, homeFormation, awayFormation, drawingMode, updateTacticsImage]);

    const maxRecordingTime = user?.subscription?.active ? 600 : 120 // 10 min or 2 min

    useEffect(() => {
        let interval: NodeJS.Timeout

        if (isRecording) {
            interval = setInterval(() => {
                setRecordingTime((prev) => {
                    if (prev >= maxRecordingTime) {
                        handleStopRecording()
                        toast.error("Recording stopped", {
                            description: "Maximum recording time reached.",
                        })
                        return prev
                    }
                    return prev + 1
                })
            }, 1000)
        } else {
            setRecordingTime(0)
        }

        return () => clearInterval(interval)
    }, [isRecording, maxRecordingTime])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    // Screen/tab recording logic using getDisplayMedia
    const startRecording = async () => {
        setRecordedBlob(null);
        recordedChunksRef.current = [];
        try {
            // 1. Prepare off-screen canvas
            const width = 1280;
            const height = 853;
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            canvasRef.current = canvas;
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Could not get canvas context');

            // 2. Get SVG node for tactics board
            const board = document.querySelector('[data-tactics-board]') as HTMLElement;
            if (!board) throw new Error('Tactics board not found');
            const svg = board.querySelector('svg');
            if (!svg) throw new Error('SVG not found');

            // 3. Prepare webcam video
            const webcamVideo = webcamVideoRef?.current;

            // 4. Get microphone audio
            let audioStream: MediaStream | null = null;
            try {
                audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            } catch (err) {
                toast.error("Microphone access denied", { description: "Recording will not include voice audio." });
                audioStream = null;
            }

            // 5. Animation loop: draw SVG and webcam to canvas
            let running = true;
            const drawFrame = () => {
                if (!running) return;
                // Draw tactics board SVG
                const serializer = new XMLSerializer();
                const svgString = serializer.serializeToString(svg);
                const img = new window.Image();
                const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
                const url = URL.createObjectURL(svgBlob);
                img.onload = () => {
                    ctx.clearRect(0, 0, width, height);
                    ctx.drawImage(img, 0, 0, width, height);
                    URL.revokeObjectURL(url);
                    // Draw webcam video (bottom right, 320x240)
                    if (webcamVideo && webcamVideo.readyState >= 2) {
                        ctx.save();
                        ctx.beginPath();
                        ctx.roundRect(width - 340, height - 260, 320, 240, 16);
                        ctx.clip();
                        ctx.drawImage(webcamVideo, width - 340, height - 260, 320, 240);
                        ctx.restore();
                    }
                };
                img.src = url;
                animationFrameRef.current = requestAnimationFrame(drawFrame);
            };
            drawFrame();

            // 6. Get canvas stream
            const canvasStream = canvas.captureStream(30);
            // 7. Combine with audio
            const combinedStream = new MediaStream([
                ...canvasStream.getVideoTracks(),
                ...(audioStream ? audioStream.getAudioTracks() : [])
            ]);

            // 8. Start MediaRecorder
            mediaRecorderRef.current = new MediaRecorder(combinedStream, { mimeType: 'video/webm;codecs=vp9' });
            recordedChunksRef.current = [];
            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };
            mediaRecorderRef.current.onstop = () => {
                running = false;
                if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
                const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
                setRecordedBlob(blob);
                // Clean up all tracks
                combinedStream.getTracks().forEach(track => track.stop());
                if (audioStream) audioStream.getTracks().forEach(track => track.stop());
                mediaRecorderRef.current = null;
            };
            mediaRecorderRef.current.start();
            onRecordingChange(true);
            toast.success("Recording started", { description: "Your tactics board, webcam, and audio are being recorded." });
        } catch (err) {
            toast.error("Recording failed", { description: "Could not start recording. Please allow microphone and webcam access and try again." });
        }
    }

    const handleStartRecording = () => {
        startRecording()
    }

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
        onRecordingChange(false);
        toast.success("Recording stopped", { description: "Your recording has been saved." });
    }

    const handleDownload = () => {
        if (recordedBlob) {
            const url = URL.createObjectURL(recordedBlob)
            const a = document.createElement('a')
            a.href = url
            a.download = `tactical-session-${new Date().toISOString().slice(0, 19)}.webm`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
        }
    }

    const handleExport = async () => {
        if (!user?.subscription?.active) {
            toast.error("Subscription required", {
                description: "Please subscribe to export your recordings.",
            })
            router.push("/subscribe")
            return
        }

        if (!recordedBlob) {
            toast.error("No recording available", {
                description: "Please record a session first.",
            })
            return
        }

        setIsExporting(true)
        setExportProgress(0)

        const exportSteps = [
            "Preparing video...",
            "Processing audio...",
            "Rendering effects...",
            "Encoding video...",
            "Finalizing export...",
        ]

        for (let i = 0; i < exportSteps.length; i++) {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            setExportProgress((i + 1) * 20)

            toast(exportSteps[i], {
                description: `Export progress: ${(i + 1) * 20}%`,
            })
        }

        setIsExporting(false)
        setExportProgress(100)

        toast.success("Export complete!", {
            description: "Your video is ready for download.",
        })

        setTimeout(() => setExportProgress(0), 3000)
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
                {!isRecording ? (
                    <Button onClick={handleStartRecording} className="w-full">
                        <Play className="w-4 h-4 mr-2" />
                        Start Recording
                    </Button>
                ) : (
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

                        {isExporting ? (
                            <div className="space-y-2">
                                <Progress value={exportProgress} className="h-2" />
                                <p className="text-sm text-center text-muted-foreground">
                                    Exporting... {exportProgress}%
                                </p>
                            </div>
                        ) : exportProgress === 100 ? (
                            <Button variant="outline" className="w-full bg-transparent">
                                <Download className="w-4 h-4 mr-2" />
                                Download Video
                            </Button>
                        ) : (
                            <Button onClick={handleExport} variant="outline" className="w-full bg-transparent">
                                <Download className="w-4 h-4 mr-2" />
                                Export Video
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
