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
                <div className="mt-4">
                    <Label>Jersey Color</Label>
                    <div className="grid grid-cols-5 gap-2 mt-2">
                        {teamColors.map((color) => (
                            <button
                                key={color}
                                type="button"
                                className="w-8 h-8 rounded-full border-2"
                                style={{
                                    backgroundColor: color,
                                    borderColor: activeTeam.color === color ? (color === "#ffffff" ? "#000000" : "transparent") : "transparent",
                                }}
                                onClick={() => updateActiveTeam({ color })}
                            />
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
