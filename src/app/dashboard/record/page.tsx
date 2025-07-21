"use client"

import { useState } from "react"
import { TacticsBoard } from "@/components/tactics-board"
import { TeamConfigPanel } from "@/components/team-config-panel"
import { FormationSelector } from "@/components/formation-selector"
import { DrawingTools } from "@/components/drawing-tools"
import { WebcamOverlay } from "@/components/webcam-overlay"
import { RecordingControls } from "@/components/recording-controls"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Video } from "lucide-react"
import { TacticsBoardProvider } from "@/hooks/use-tactics-board"

export default function RecordPage() {
    const [isRecording, setIsRecording] = useState(false)
    const [showWebcam, setShowWebcam] = useState(true)

    return (
        <TacticsBoardProvider>
            {isRecording && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    border: '6px solid #e11d48', // Tailwind's red-600
                    boxSizing: 'border-box',
                    zIndex: 9999,
                    pointerEvents: 'none',
                }} />
            )}
            <div className="space-y-4 md:space-y-6 max-w-7xl mx-auto relative">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">Record Session</h1>
                        <p className="text-muted-foreground text-sm md:text-base">Record tactical explanations with webcam overlay</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        {isRecording && (
                            <Badge variant="destructive" className="animate-pulse">
                                <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                                Recording
                            </Badge>
                        )}
                        <Button variant="outline" size="sm" onClick={() => setShowWebcam(!showWebcam)}>
                            <Video className="w-4 h-4 mr-2" />
                            {showWebcam ? "Hide" : "Show"} Webcam
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 md:gap-6">
                    {/* Control Panel */}
                    <div className="xl:col-span-1 space-y-4 order-2 xl:order-1">
                        <Card className="p-3 md:p-4">
                            <h3 className="font-semibold mb-3 text-sm md:text-base">Drawing Tools</h3>
                            <DrawingTools />
                        </Card>

                        <Card className="p-3 md:p-4">
                            <h3 className="font-semibold mb-3 text-sm md:text-base">Recording Settings</h3>
                            <RecordingControls isRecording={isRecording} onRecordingChange={setIsRecording} />
                        </Card>

                        <Card className="p-3 md:p-4">
                            <h3 className="font-semibold mb-3 text-sm md:text-base">Team Configuration</h3>
                            <TeamConfigPanel />
                        </Card>
                    </div>

                    {/* Recording Area */}
                    <div className="xl:col-span-3 order-1 xl:order-2">
                        <Card className="p-3 md:p-4 relative">
                            {/* Recording Note */}
                            <div className="mb-2 text-xs text-muted-foreground">
                                For best results, <b>select the browser tab</b> when prompted for screen recording. This will include the webcam overlay in your video.
                            </div>
                            <TacticsBoard />
                        </Card>
                    </div>
                </div>
                {/* Webcam overlay fixed at top right */}
                {showWebcam && (
                    <div className="fixed top-20 right-6 z-50 w-64 h-auto shadow-lg rounded-lg overflow-hidden">
                        <WebcamOverlay isRecording={isRecording} />
                    </div>
                )}
            </div>
        </TacticsBoardProvider>
    )
}
