"use client"

import { useState, useRef } from "react"
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
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { BoardActions } from "@/components/board-actions"
import { useIsMobile } from "@/hooks/use-mobile"

export default function RecordPage() {
    const [isRecording, setIsRecording] = useState(false)
    const [showWebcam, setShowWebcam] = useState(true)
    const [openFormation, setOpenFormation] = useState(false)
    const [openMovement, setOpenMovement] = useState(false)

    // Webcam video ref for compositing
    const webcamVideoRef = useRef<HTMLVideoElement>(null)

    // For each DropdownMenu, add local open state and setOpen
    const [openTeamsDropdown, setOpenTeamsDropdown] = useState(false);
    const [openMovementDropdown, setOpenMovementDropdown] = useState(false);

    const isMobile = useIsMobile();

    return (
        <TacticsBoardProvider>
            {isRecording && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    border: '6px solid #e11d48',
                    boxSizing: 'border-box',
                    zIndex: 9999,
                    pointerEvents: 'none',
                }} />
            )}
            <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto w-full min-h-screen py-8 px-4">
                {isMobile ? (
                    // Mobile Layout
                    <div className="flex flex-col w-full gap-4">
                        {/* Tactics Board (at the top) */}
                        <div className="w-full bg-[#22a745] rounded-lg p-2 flex items-center justify-center" style={{ boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)' }}>
                            <TacticsBoard />
                        </div>
                        {/* Options Buttons (Teams, Movement) now below tactics board */}
                        <div className="flex flex-wrap gap-3 w-full justify-end">
                            <DropdownMenu open={openTeamsDropdown} onOpenChange={setOpenTeamsDropdown}>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="lg" className="min-w-[120px]">Teams</Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <div className="p-2 min-w-[220px]">
                                        <TeamConfigPanel />
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DropdownMenu open={openMovementDropdown} onOpenChange={setOpenMovementDropdown}>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="lg" className="min-w-[120px]">Movement</Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <div className="p-2 min-w-[220px]">
                                        <DrawingTools onAnyChange={() => setOpenMovementDropdown(false)} />
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        {/* Webcam Card (smaller on mobile, now below options) */}
                        <div className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden bg-white flex items-center justify-center mx-auto">
                            <WebcamOverlay isRecording={isRecording} videoRef={webcamVideoRef} />
                        </div>
                        {/* Recording Controls */}
                        <div className="w-full">
                            <RecordingControls isRecording={isRecording} onRecordingChange={setIsRecording} webcamVideoRef={webcamVideoRef} />
                        </div>
                    </div>
                ) : (
                    // Desktop Layout
                    <>
                        <div className="flex flex-col items-center flex-1 min-w-0">
                            <div className="w-full bg-[#22a745] rounded-lg p-2 flex items-center justify-center" style={{ boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)' }}>
                                <TacticsBoard />
                            </div>
                        </div>
                        <div className="flex flex-col items-center w-full max-w-xs gap-6">
                            {/* Webcam Card at the top */}
                            <div className="w-56 h-56 rounded-full overflow-hidden bg-white flex items-center justify-center">
                                <WebcamOverlay isRecording={isRecording} videoRef={webcamVideoRef} />
                            </div>
                            {/* Teams and Movement Buttons below webcam */}
                            <div className="flex flex-wrap gap-3 w-full justify-center mt-4">
                                <DropdownMenu open={openTeamsDropdown} onOpenChange={setOpenTeamsDropdown}>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="lg" className="min-w-[120px]">Teams</Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <div className="p-2 min-w-[220px]">
                                            <TeamConfigPanel />
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <DropdownMenu open={openMovementDropdown} onOpenChange={setOpenMovementDropdown}>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="lg" className="min-w-[120px]">Movement</Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <div className="p-2 min-w-[220px]">
                                            <DrawingTools onAnyChange={() => setOpenMovementDropdown(false)} />
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            {/* Recording Controls below buttons */}
                            <div className="w-full mt-2">
                                <RecordingControls isRecording={isRecording} onRecordingChange={setIsRecording} webcamVideoRef={webcamVideoRef} />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </TacticsBoardProvider>
    )
}
