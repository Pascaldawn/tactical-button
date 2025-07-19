"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTacticsBoardWithContext } from "@/hooks/use-tactics-board"

const formations = [
    { value: "4-3-3", label: "4-3-3 (Attack)" },
    { value: "4-4-2", label: "4-4-2 (Balanced)" },
    { value: "3-5-2", label: "3-5-2 (Wing Play)" },
    { value: "4-2-3-1", label: "4-2-3-1 (Modern)" },
    { value: "5-3-2", label: "5-3-2 (Defensive)" },
    { value: "4-1-4-1", label: "4-1-4-1 (Compact)" },
    { value: "3-4-3", label: "3-4-3 (Wide)" },
    { value: "4-5-1", label: "4-5-1 (Counter)" },
]

export function FormationSelector() {
    const { homeFormation, awayFormation, setFormation, isHomeTeamActive } = useTacticsBoardWithContext()
    const value = isHomeTeamActive ? homeFormation : awayFormation
    return (
        <Select value={value} onValueChange={(formation) => setFormation(formation, isHomeTeamActive ? "home" : "away")}>
            <SelectTrigger>
                <SelectValue placeholder="Select formation" />
            </SelectTrigger>
            <SelectContent>
                {formations.map((formation) => (
                    <SelectItem key={formation.value} value={formation.value}>
                        {formation.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
