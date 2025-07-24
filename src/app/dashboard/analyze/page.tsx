"use client"

import { useState } from "react"
import { TacticsBoard } from "@/components/tactics-board"
import { TeamConfigPanel } from "@/components/team-config-panel"
import { DrawingTools } from "@/components/drawing-tools"
import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"
import { TacticsBoardProvider } from "@/hooks/use-tactics-board"
import { useIsMobile } from "@/hooks/use-mobile"

export default function AnalyzePage() {
    const [showTeamsPanel, setShowTeamsPanel] = useState(false);
    const isMobile = useIsMobile();

    return (
        <TacticsBoardProvider>
            <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto w-full min-h-screen py-8 px-4">
                {isMobile ? (
                    // Mobile Layout
                    <div className="flex flex-col w-full gap-4">
                        {/* Tactics Board at the top */}
                        <div className="w-full bg-[#22a745] rounded-lg p-2 flex items-center justify-center" style={{ boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)' }}>
                            <TacticsBoard />
                        </div>
                        {/* Drawing Tools and Teams icon row below tactics board */}
                        <div className="w-full flex justify-center mt-2 gap-2">
                            <DrawingTools />
                            <Button variant="outline" size="icon" className="min-w-[40px] h-10 w-10 flex items-center justify-center" onClick={() => setShowTeamsPanel((v) => !v)} title="Teams">
                                <Users className="w-5 h-5" />
                            </Button>
                        </div>
                        {showTeamsPanel && (
                            <div className="w-full flex justify-end mt-2">
                                <div className="p-2 min-w-[220px] bg-background rounded-md shadow border max-h-[60vh] overflow-y-auto">
                                    <TeamConfigPanel />
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    // Desktop Layout
                    <>
                        <div className="flex flex-col items-center flex-1 min-w-0">
                            <div className="w-full bg-[#22a745] rounded-lg p-2 flex items-center justify-center" style={{ boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)' }}>
                                <TacticsBoard />
                            </div>
                            {/* Drawing Tools and Teams icon row below tactics board */}
                            <div className="w-full flex justify-center mt-2 gap-2">
                                <DrawingTools />
                                <Button variant="outline" size="icon" className="min-w-[40px] h-10 w-10 flex items-center justify-center" onClick={() => setShowTeamsPanel((v) => !v)} title="Teams">
                                    <Users className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-col items-center w-full max-w-xs gap-6">
                            {showTeamsPanel && (
                                <div className="w-full flex justify-center mt-2">
                                    <div className="p-2 min-w-[220px] bg-background rounded-md shadow border max-h-[60vh] overflow-y-auto">
                                        <TeamConfigPanel />
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </TacticsBoardProvider>
    )
}
