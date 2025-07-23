"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useTacticsBoardWithContext } from "@/hooks/use-tactics-board"
import { Pen, Eraser, RotateCcw, Move } from "lucide-react"

export function DrawingTools({ onAnyChange }: { onAnyChange?: () => void } = {}) {
    const { drawingMode, changeDrawingMode, resetBoard } = useTacticsBoardWithContext()

    const tools = [
        { id: "move", label: "Move", icon: Move, description: "Drag players" },
        { id: "draw", label: "Draw", icon: Pen, description: "Draw arrows" },
        { id: "erase", label: "Erase", icon: Eraser, description: "Remove drawings" },
    ]

    return (
        <div className="flex flex-row gap-2 items-center justify-center">
            {tools.map((tool) => (
                <Button
                    key={tool.id}
                    variant={drawingMode === tool.id ? "default" : "outline"}
                    size="icon"
                    onClick={() => {
                        changeDrawingMode(tool.id as 'move' | 'draw' | 'erase');
                        if (onAnyChange) onAnyChange();
                    }}
                    className="h-10 w-10 flex items-center justify-center"
                    title={tool.description}
                >
                    <tool.icon className="w-5 h-5" />
                </Button>
            ))}
            <Button
                variant="outline"
                size="icon"
                onClick={() => { resetBoard(); if (onAnyChange) onAnyChange(); }}
                className="h-10 w-10 flex items-center justify-center"
                title="Reset Board"
            >
                <RotateCcw className="w-5 h-5" />
            </Button>
        </div>
    )
}
