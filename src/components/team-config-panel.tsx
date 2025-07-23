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
        <div className="flex flex-row items-end gap-2 text-xs min-w-[320px] flex-wrap">
            {/* Team Tabs */}
            <div className="flex space-x-1">
                <Button variant={tab === "home" ? "default" : "outline"} size="sm" className="px-2 py-1 text-xs h-7" onClick={() => handleTabChange("home")}>Home</Button>
                <Button variant={tab === "away" ? "default" : "outline"} size="sm" className="px-2 py-1 text-xs h-7" onClick={() => handleTabChange("away")}>Away</Button>
            </div>
            {/* Team Name */}
            <div className="flex flex-col">
                <Label htmlFor="teamName" className="text-xs font-medium mb-1">Team Name</Label>
                <Input
                    id="teamName"
                    value={activeTeam.name}
                    onChange={(e) => updateActiveTeam({ name: e.target.value })}
                    placeholder="Enter team name"
                    className="h-7 text-xs px-2 py-1 w-[100px]"
                />
            </div>
            {/* Jersey Colors */}
            <div className="flex flex-col">
                <Label className="text-xs mb-1">Jersey Color</Label>
                <div className="flex flex-row gap-1">
                    {teamColors.map((color) => (
                        <button
                            key={color}
                            type="button"
                            className="w-6 h-6 rounded-full border"
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
            <div className="flex flex-col">
                <Label className="text-xs font-medium mb-1">Formation</Label>
                <div>
                    <FormationSelector />
                </div>
            </div>
        </div>
    )
}
