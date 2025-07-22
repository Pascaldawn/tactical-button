"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Video, VideoOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface WebcamOverlayProps {
    isRecording: boolean
    className?: string
    videoRef?: React.RefObject<HTMLVideoElement>
}

export function WebcamOverlay({ isRecording, className, videoRef }: WebcamOverlayProps) {
    const [isWebcamOn, setIsWebcamOn] = useState(true) // default ON
    const [hasPermission, setHasPermission] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const internalVideoRef = useRef<HTMLVideoElement>(null)
    const streamRef = useRef<MediaStream | null>(null)

    // Move startWebcam above useEffect
    const startWebcam = async () => {
        setError(null)
        try {
            if (streamRef.current) {
                stopWebcam()
            }
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                setHasPermission(false)
                setIsWebcamOn(false)
                setError('Camera/microphone not supported in this browser or device.')
                return
            }
            console.log('Requesting default/internal webcam...')
            const constraints: MediaStreamConstraints = {
                video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
                audio: true,
            }
            const stream = await navigator.mediaDevices.getUserMedia(constraints)
            console.log('Webcam stream obtained:', stream)
            streamRef.current = stream
            setHasPermission(true)
        } catch (err: unknown) {
            let userMessage = ''
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                userMessage = 'Camera/microphone not supported in this browser or device.\n\nTry the following:\n- Use Chrome/Safari, avoid in-app browsers, ensure HTTPS, and check permissions.'
            } else if (err instanceof Error) {
                userMessage = (err.message || 'Could not access webcam') + '\n\nTroubleshooting tips:\n- Use Chrome (Android) or Safari (iOS)\n- Avoid in-app browsers (Facebook, Instagram, Twitter, etc.)\n- Make sure you are using HTTPS (not HTTP)\n- Check your browser and OS permissions.'
            } else {
                userMessage = 'Unknown error accessing camera/microphone.\n\nTry using Chrome (Android) or Safari (iOS), avoid in-app browsers, and check permissions.'
            }
            setHasPermission(false)
            setIsWebcamOn(false)
            setError(userMessage)
            if (err instanceof Error) {
                console.error('Error accessing webcam:', err)
            }
        }
    }

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
        const ref = videoRef ? videoRef.current : internalVideoRef.current;
        if (hasPermission && ref && streamRef.current) {
            ref.srcObject = streamRef.current
            ref.play().catch(console.error)
            const videoTrack = streamRef.current.getVideoTracks()[0]
            if (videoTrack) {
                console.log('Video track state:', videoTrack)
            } else {
                console.log('No video track')
            }
            console.log('Webcam stream attached to video element (effect)')
        }
    }, [hasPermission, isWebcamOn, startWebcam, videoRef])

    const stopWebcam = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop())
            streamRef.current = null
        }
        if (internalVideoRef.current) {
            internalVideoRef.current.srcObject = null
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
                        ref={videoRef ? videoRef : internalVideoRef}
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
                        <p className="text-sm">Webcam Off</p>
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
