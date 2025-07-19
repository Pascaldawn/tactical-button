"use client"

import { TacticsBoard } from "@/components/tactics-board"
import { TeamConfigPanel } from "@/components/team-config-panel"
import { FormationSelector } from "@/components/formation-selector"
import { DrawingTools } from "@/components/drawing-tools"
import { BoardActions } from "@/components/board-actions"
import { Card } from "@/components/ui/card"
import { TacticsBoardProvider } from "@/hooks/use-tactics-board"

export default function AnalyzePage() {
    return (
        <TacticsBoardProvider>
            <div className="space-y-4 md:space-y-6 w-full max-w-none mx-auto relative min-h-screen flex flex-col">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">Tactics Analyzer</h1>
                        <p className="text-muted-foreground text-sm md:text-base">
                            Create and analyze tactical formations and movements
                        </p>
                    </div>
                    <BoardActions />
                </div>

                <div className="flex flex-1 flex-col-reverse md:flex-row gap-4 md:gap-6 w-full min-h-0">
                    {/* Control Panel */}
                    <div className="w-full md:max-w-xs lg:max-w-sm xl:max-w-[320px] space-y-4 md:order-1 flex-shrink-0">
                        <Card className="p-3 md:p-4">
                            <h3 className="font-semibold mb-3 text-sm md:text-base">Drawing Tools</h3>
                            <DrawingTools />
                        </Card>
                        <Card className="p-3 md:p-4">
                            <h3 className="font-semibold mb-3 text-sm md:text-base">Team Configuration</h3>
                            <TeamConfigPanel />
                        </Card>
                    </div>

                    {/* Tactics Board */}
                    <div className="flex-1 md:order-2 min-h-[300px] h-full px-0 flex items-center justify-center">
                        <TacticsBoard />
                    </div>
                </div>
            </div>
        </TacticsBoardProvider>
    )
}
