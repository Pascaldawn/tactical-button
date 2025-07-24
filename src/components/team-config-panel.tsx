"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useTacticsBoardWithContext } from "@/hooks/use-tactics-board"
import { useState } from "react"
import { FormationSelector } from "@/components/formation-selector"
import { teamColors } from "@/lib/constants"

export function TeamConfigPanel({ onAnyChange }: { onAnyChange?: () => void } = {}) {
    const { homeTeam, awayTeam, updateHomeTeam, updateAwayTeam, isHomeTeamActive, setActiveTeam } = useTacticsBoardWithContext()
    const [tab, setTab] = useState(isHomeTeamActive ? "home" : "away")

    // Keep context in sync with tab
    const handleTabChange = (team: "home" | "away") => {
        setTab(team)
        setActiveTeam(team)
        if (onAnyChange) onAnyChange();
    }

    const activeTeam = tab === "home" ? homeTeam : awayTeam
    const updateActiveTeam = (update: Partial<typeof homeTeam>) => {
        if (tab === "home") updateHomeTeam(update)
        else updateAwayTeam(update)
        if (onAnyChange) onAnyChange();
    }

    return (
        <div className="flex flex-col gap-3 min-w-[220px] max-w-[260px] overflow-x-hidden">
            {/* Team Tabs */}
            <div className="flex justify-center mb-2">
                <div className="flex space-x-2">
                    <Button variant={tab === "home" ? "default" : "outline"} size="sm" className="px-4 py-1 text-xs h-8 rounded-md" onClick={() => handleTabChange("home")}>Home</Button>
                    <Button variant={tab === "away" ? "default" : "outline"} size="sm" className="px-4 py-1 text-xs h-8 rounded-md" onClick={() => handleTabChange("away")}>Away</Button>
                </div>
            </div>
            {/* Team Name */}
            <div className="flex items-center gap-2">
                <Label htmlFor="teamName" className="text-xs font-medium min-w-[90px]">Team Name</Label>
                <Input
                    id="teamName"
                    value={activeTeam.name}
                    onChange={(e) => updateActiveTeam({ name: e.target.value })}
                    placeholder="Enter team name"
                    className="h-8 text-xs px-2 py-1 w-[120px] max-w-[120px]"
                />
            </div>
            {/* Jersey Colors */}
            <div className="flex items-center gap-2">
                <Label className="text-xs min-w-[90px]">Jersey Color</Label>
                <div className="grid grid-cols-5 gap-1">
                    {teamColors.map((color) => (
                        <button
                            key={color}
                            type="button"
                            className="w-6 h-6 rounded-full border flex-shrink-0"
                            style={{
                                backgroundColor: color,
                                borderColor: activeTeam.color === color ? (color === "#ffffff" ? "#000000" : "#222") : "#ccc",
                            }}
                            onClick={() => updateActiveTeam({ color })}
                        />
                    ))}
                </div>
            </div>
            {/* Formation Selector */}
            <div className="flex items-center gap-2">
                <Label className="text-xs font-medium min-w-[90px]">Formation</Label>
                <div className="w-full max-w-[180px]">
                    <FormationSelector />
                </div>
            </div>
        </div>
    )
}
