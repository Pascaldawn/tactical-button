"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useTacticsBoardWithContext } from "@/hooks/use-tactics-board"
import { Pen, Eraser, RotateCcw, Move } from "lucide-react"

export function DrawingTools() {
    const { drawingMode, changeDrawingMode, resetBoard } = useTacticsBoardWithContext()

    const tools = [
        { id: "move", label: "Move", icon: Move, description: "Drag players" },
        { id: "draw", label: "Draw", icon: Pen, description: "Draw arrows" },
        { id: "erase", label: "Erase", icon: Eraser, description: "Remove drawings" },
    ]

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
                {tools.map((tool) => (
                    <Button
                        key={tool.id}
                        variant={drawingMode === tool.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => changeDrawingMode(tool.id as 'move' | 'draw' | 'erase')}
                        className="flex flex-col items-center space-y-1 h-auto py-2"
                        title={tool.description}
                    >
                        <tool.icon className="w-4 h-4" />
                        <span className="text-xs">{tool.label}</span>
                    </Button>
                ))}
            </div>

            <Separator />

            <Button variant="outline" size="sm" onClick={resetBoard} className="w-full bg-transparent">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Board
            </Button>
        </div>
    )
}
