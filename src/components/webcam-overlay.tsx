"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Video, VideoOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface WebcamOverlayProps {
    isRecording: boolean
    className?: string
}

export function WebcamOverlay({ isRecording, className }: WebcamOverlayProps) {
    const [isWebcamOn, setIsWebcamOn] = useState(true) // default ON
    const [hasPermission, setHasPermission] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [trackState, setTrackState] = useState<string>("")
    // Remove device selection logic
    const videoRef = useRef<HTMLVideoElement>(null)
    const streamRef = useRef<MediaStream | null>(null)

    // No device selection effect
    useEffect(() => {
        if (isWebcamOn) {
            // Always try to start webcam when toggled on
            setHasPermission(false)
            setError(null)
            startWebcam()
        } else if (!isWebcamOn && streamRef.current) {
            stopWebcam()
            setHasPermission(false)
        }
        return () => {
            if (streamRef.current) {
                stopWebcam()
            }
        }
    }, [isWebcamOn])

    // Assign stream to video element after both are available
    useEffect(() => {
        if (hasPermission && videoRef.current && streamRef.current) {
            videoRef.current.srcObject = streamRef.current
            videoRef.current.play().catch(console.error)
            const videoTrack = streamRef.current.getVideoTracks()[0]
            if (videoTrack) {
                setTrackState(`enabled=${videoTrack.enabled}, readyState=${videoTrack.readyState}`)
                console.log('Video track state:', videoTrack)
            } else {
                setTrackState('No video track')
            }
            console.log('Webcam stream attached to video element (effect)')
        }
    }, [hasPermission, isWebcamOn])

    const startWebcam = async () => {
        setError(null)
        try {
            if (streamRef.current) {
                stopWebcam()
            }
            console.log('Requesting default/internal webcam...')
            const constraints: MediaStreamConstraints = {
                video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
                audio: false,
            }
            const stream = await navigator.mediaDevices.getUserMedia(constraints)
            console.log('Webcam stream obtained:', stream)
            streamRef.current = stream
            setHasPermission(true)
        } catch (err: any) {
            setHasPermission(false)
            setIsWebcamOn(false)
            setError(err?.message || 'Could not access webcam')
            console.error('Error accessing webcam:', err)
        }
    }

    const stopWebcam = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop())
            streamRef.current = null
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null
        }
        setHasPermission(false)
        setError(null)
    }

    return (
        <div
            className={cn(
                "relative w-full h-full bg-neutral-100 border border-neutral-300 overflow-hidden",
                className
            )}
            style={{ borderRadius: 12, boxShadow: "0 2px 8px 0 rgba(0,0,0,0.10)" }}
        >
            {isWebcamOn && hasPermission ? (
                <>
                    <video
                        ref={videoRef}
                        className="webcam-overlay-video w-full h-full object-cover"
                        autoPlay
                        muted
                        playsInline
                        style={{ background: '#222', width: '100%', height: '100%' }}
                    />
                    {isRecording && (
                        <div className="absolute top-2 left-2">
                            <div className="flex items-center space-x-1 bg-red-600 text-white px-2 py-1 rounded text-xs shadow">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                <span className="text-xs font-bold">REC</span>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                    <div className="text-center">
                        <VideoOff className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">Webcam Off</p>
                        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                    </div>
                </div>
            )}
            {/* Camera toggle button as floating icon in top right */}
            <div className="absolute top-2 right-2 z-10">
                <Button
                    size="icon"
                    variant={isWebcamOn ? "destructive" : "secondary"}
                    onClick={() => setIsWebcamOn(!isWebcamOn)}
                    className="h-8 w-8 p-0 rounded-full shadow"
                    aria-label={isWebcamOn ? "Turn off webcam" : "Turn on webcam"}
                >
                    {isWebcamOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </Button>
            </div>
        </div>
    )
}
