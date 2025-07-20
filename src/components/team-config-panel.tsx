"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useTacticsBoardWithContext } from "@/hooks/use-tactics-board"
import { useState } from "react"
import { FormationSelector } from "@/components/formation-selector"

const teamColors = [
    "#ef4444", // red
    "#3b82f6", // blue
    "#22c55e", // green
    "#f59e0b", // yellow
    "#8b5cf6", // purple
    "#06b6d4", // cyan
    "#f97316", // orange
    "#84cc16", // lime
]

export function TeamConfigPanel() {
    const { homeTeam, awayTeam, updateHomeTeam, updateAwayTeam, isHomeTeamActive, setActiveTeam } = useTacticsBoardWithContext()
    const [tab, setTab] = useState(isHomeTeamActive ? "home" : "away")

    // Keep context in sync with tab
    const handleTabChange = (team: "home" | "away") => {
        setTab(team)
        setActiveTeam(team)
    }

    const activeTeam = tab === "home" ? homeTeam : awayTeam
    const updateActiveTeam = tab === "home" ? updateHomeTeam : updateAwayTeam

    return (
        <div className="space-y-4">
            {/* Team Tabs */}
            <div className="flex space-x-2 mb-2">
                <Button variant={tab === "home" ? "default" : "outline"} size="sm" onClick={() => handleTabChange("home")}>Home Team</Button>
                <Button variant={tab === "away" ? "default" : "outline"} size="sm" onClick={() => handleTabChange("away")}>Away Team</Button>
            </div>
            {/* Active Team Configuration */}
            <div className="space-y-3">
                <div>
                    <Label htmlFor="teamName" className="text-sm font-medium">
                        Team Name
                    </Label>
                    <Input
                        id="teamName"
                        value={activeTeam.name}
                        onChange={(e) => updateActiveTeam({ name: e.target.value })}
                        placeholder="Enter team name"
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label className="text-sm font-medium">Jersey Color</Label>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                        {teamColors.map((color) => (
                            <Button
                                key={color}
                                variant="outline"
                                size="sm"
                                className="w-8 h-8 p-0 rounded-full bg-transparent"
                                style={{ backgroundColor: color }}
                                onClick={() => updateActiveTeam({ color })}
                            >
                                {activeTeam.color === color && (
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                )}
                            </Button>
                        ))}
                    </div>
                </div>
                <div>
                    <Label className="text-sm font-medium">Formation</Label>
                    <FormationSelector />
                </div>
            </div>
        </div>
    )
}
