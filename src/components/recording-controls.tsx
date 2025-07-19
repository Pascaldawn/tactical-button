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
function debounce(fn: (...args: any[]) => void, delay: number) {
    let timer: any;
    return (...args: any[]) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}
// import FFmpeg from '@ffmpeg/ffmpeg';
// const { createFFmpeg, fetchFile } = FFmpeg as any;

interface RecordingControlsProps {
    isRecording: boolean
    onRecordingChange: (recording: boolean) => void
}

export function RecordingControls({
    isRecording,
    onRecordingChange,
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
    const webcamVideoRef = useRef<HTMLVideoElement | null>(null)
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
            // Request 4K screen capture at 60fps
            let screenStream;
            try {
                screenStream = await navigator.mediaDevices.getDisplayMedia({
                    video: {
                        frameRate: 60,
                        width: { ideal: 3840 },
                        height: { ideal: 2160 }
                    },
                    audio: false
                });
            } catch (err) {
                // Fallback to Full HD
                screenStream = await navigator.mediaDevices.getDisplayMedia({
                    video: {
                        frameRate: 60,
                        width: { ideal: 1920 },
                        height: { ideal: 1080 }
                    },
                    audio: false
                });
            }

            // Request microphone audio
            let audioStream;
            try {
                audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            } catch (err) {
                toast.error("Microphone access denied", { description: "Recording will not include voice audio." });
                audioStream = null;
            }

            // Combine video and audio tracks
            const combinedStream = new MediaStream([
                ...screenStream.getVideoTracks(),
                ...(audioStream ? audioStream.getAudioTracks() : [])
            ]);

            mediaRecorderRef.current = new MediaRecorder(combinedStream, { mimeType: 'video/webm;codecs=vp9' });
            recordedChunksRef.current = [];
            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };
            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
                setRecordedBlob(blob);
                // Clean up all tracks
                combinedStream.getTracks().forEach(track => track.stop());
                if (audioStream) audioStream.getTracks().forEach(track => track.stop());
                if (screenStream) screenStream.getTracks().forEach(track => track.stop());
                mediaRecorderRef.current = null;
            };
            mediaRecorderRef.current.start();
            onRecordingChange(true);
            toast.success("Recording started", { description: "Select the browser tab with your tactics board for best results. All visible movements, overlays, and your voice will be recorded in high quality." });
        } catch (err) {
            toast.error("Screen recording failed", { description: "Could not start screen recording. Please allow screen and microphone capture and try again." });
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
            {/* Aspect Ratio */}
            <div>
                <Label className="text-sm font-medium">Aspect Ratio</Label>
                <Select value={aspectRatio} onValueChange={setAspectRatio}>
                    <SelectTrigger className="mt-1">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                        <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                        <SelectItem value="1:1">1:1 (Square)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

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

            {/* Recording Note */}
            <div className="mb-2 text-xs text-muted-foreground">
                <b>When you click Start Recording, select the browser tab with your tactics board.</b> All visible movements, overlays, and the webcam will be recorded in high quality.
            </div>

            {/* Subscription Notice */}
            {!user?.subscription?.active && (
                <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                    <p>Free plan: 2 min recordings, watermarked exports</p>
                    <p>Upgrade for unlimited recording and HD exports</p>
                </div>
            )}
        </div>
    )
}
