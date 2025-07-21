"use client"

import { useState, useCallback } from "react"
import React, { createContext, useContext } from "react"

interface Player {
    id: string
    x: number
    y: number
    team: "home" | "away"
    number: number
}

interface Team {
    name: string
    color: string
}

interface DrawingElement {
    id: string
    type: "arrow" | "line" | "circle"
    points: { x: number; y: number }[]
    color: string
    strokeWidth: number
}

// All player positions in every formation are now scaled for a 105x68 pitch (x * 1.05, y * 0.68)
const defaultFormations: Record<string, { home: Player[]; away: Player[] }> = {
    // 4-3-3
    "4-3-3": {
        home: [
            { id: "h1", x: 7.35, y: 34, number: 1, team: "home" },
            { id: "h2", x: 21, y: 12.24, number: 2, team: "home" },
            { id: "h3", x: 21, y: 25.84, number: 3, team: "home" },
            { id: "h4", x: 21, y: 42.16, number: 4, team: "home" },
            { id: "h5", x: 21, y: 55.76, number: 5, team: "home" },
            { id: "h6", x: 42, y: 20.4, number: 6, team: "home" },
            { id: "h7", x: 42, y: 34, number: 7, team: "home" },
            { id: "h8", x: 42, y: 47.6, number: 8, team: "home" },
            { id: "h9", x: 68.25, y: 13.6, number: 9, team: "home" },
            { id: "h10", x: 78.75, y: 34, number: 10, team: "home" },
            { id: "h11", x: 68.25, y: 54.4, number: 11, team: "home" },
        ],
        away: [
            { id: "a1", x: 97.65, y: 34, number: 1, team: "away" },
            { id: "a2", x: 84, y: 12.24, number: 2, team: "away" },
            { id: "a3", x: 84, y: 25.84, number: 3, team: "away" },
            { id: "a4", x: 84, y: 42.16, number: 4, team: "away" },
            { id: "a5", x: 84, y: 55.76, number: 5, team: "away" },
            { id: "a6", x: 63, y: 20.4, number: 6, team: "away" },
            { id: "a7", x: 63, y: 34, number: 7, team: "away" },
            { id: "a8", x: 63, y: 47.6, number: 8, team: "away" },
            { id: "a9", x: 36.75, y: 13.6, number: 9, team: "away" },
            { id: "a10", x: 26.25, y: 34, number: 10, team: "away" },
            { id: "a11", x: 36.75, y: 54.4, number: 11, team: "away" },
        ],
    },
    // 4-4-2
    "4-4-2": {
        home: [
            { id: "h1", x: 7.35, y: 34, number: 1, team: "home" },
            { id: "h2", x: 21, y: 12.24, number: 2, team: "home" },
            { id: "h3", x: 21, y: 25.84, number: 3, team: "home" },
            { id: "h4", x: 21, y: 42.16, number: 4, team: "home" },
            { id: "h5", x: 21, y: 55.76, number: 5, team: "home" },
            { id: "h6", x: 42, y: 13.6, number: 6, team: "home" },
            { id: "h7", x: 42, y: 27.2, number: 7, team: "home" },
            { id: "h8", x: 42, y: 40.8, number: 8, team: "home" },
            { id: "h9", x: 42, y: 54.4, number: 9, team: "home" },
            { id: "h10", x: 73.5, y: 23.8, number: 10, team: "home" },
            { id: "h11", x: 73.5, y: 44.2, number: 11, team: "home" },
        ],
        away: [
            { id: "a1", x: 97.65, y: 34, number: 1, team: "away" },
            { id: "a2", x: 84, y: 12.24, number: 2, team: "away" },
            { id: "a3", x: 84, y: 25.84, number: 3, team: "away" },
            { id: "a4", x: 84, y: 42.16, number: 4, team: "away" },
            { id: "a5", x: 84, y: 55.76, number: 5, team: "away" },
            { id: "a6", x: 63, y: 13.6, number: 6, team: "away" },
            { id: "a7", x: 63, y: 27.2, number: 7, team: "away" },
            { id: "a8", x: 63, y: 40.8, number: 8, team: "away" },
            { id: "a9", x: 63, y: 54.4, number: 9, team: "away" },
            { id: "a10", x: 31.5, y: 23.8, number: 10, team: "away" },
            { id: "a11", x: 31.5, y: 44.2, number: 11, team: "away" },
        ],
    },
    // 3-5-2
    "3-5-2": {
        home: [
            { id: "h1", x: 7.35, y: 34, number: 1, team: "home" },
            { id: "h2", x: 23.1, y: 17, number: 2, team: "home" },
            { id: "h3", x: 23.1, y: 34, number: 3, team: "home" },
            { id: "h4", x: 23.1, y: 51, number: 4, team: "home" },
            { id: "h5", x: 42, y: 10.2, number: 5, team: "home" },
            { id: "h6", x: 42, y: 23.8, number: 6, team: "home" },
            { id: "h7", x: 42, y: 34, number: 7, team: "home" },
            { id: "h8", x: 42, y: 44.2, number: 8, team: "home" },
            { id: "h9", x: 42, y: 57.8, number: 9, team: "home" },
            { id: "h10", x: 73.5, y: 27.2, number: 10, team: "home" },
            { id: "h11", x: 73.5, y: 40.8, number: 11, team: "home" },
        ],
        away: [
            { id: "a1", x: 97.65, y: 34, number: 1, team: "away" },
            { id: "a2", x: 81.9, y: 17, number: 2, team: "away" },
            { id: "a3", x: 81.9, y: 34, number: 3, team: "away" },
            { id: "a4", x: 81.9, y: 51, number: 4, team: "away" },
            { id: "a5", x: 63, y: 10.2, number: 5, team: "away" },
            { id: "a6", x: 63, y: 23.8, number: 6, team: "away" },
            { id: "a7", x: 63, y: 34, number: 7, team: "away" },
            { id: "a8", x: 63, y: 44.2, number: 8, team: "away" },
            { id: "a9", x: 63, y: 57.8, number: 9, team: "away" },
            { id: "a10", x: 31.5, y: 27.2, number: 10, team: "away" },
            { id: "a11", x: 31.5, y: 40.8, number: 11, team: "away" },
        ],
    },
    // 4-2-3-1
    "4-2-3-1": {
        home: [
            { id: "h1", x: 7.35, y: 34, number: 1, team: "home" },
            { id: "h2", x: 21, y: 12.24, number: 2, team: "home" },
            { id: "h3", x: 21, y: 25.84, number: 3, team: "home" },
            { id: "h4", x: 21, y: 42.16, number: 4, team: "home" },
            { id: "h5", x: 21, y: 55.76, number: 5, team: "home" },
            { id: "h6", x: 39.9, y: 27.2, number: 6, team: "home" },
            { id: "h7", x: 39.9, y: 40.8, number: 7, team: "home" },
            { id: "h8", x: 57.75, y: 20.4, number: 8, team: "home" },
            { id: "h9", x: 57.75, y: 34, number: 9, team: "home" },
            { id: "h10", x: 57.75, y: 47.6, number: 10, team: "home" },
            { id: "h11", x: 84, y: 34, number: 11, team: "home" },
        ],
        away: [
            { id: "a1", x: 97.65, y: 34, number: 1, team: "away" },
            { id: "a2", x: 84, y: 12.24, number: 2, team: "away" },
            { id: "a3", x: 84, y: 25.84, number: 3, team: "away" },
            { id: "a4", x: 84, y: 42.16, number: 4, team: "away" },
            { id: "a5", x: 84, y: 55.76, number: 5, team: "away" },
            { id: "a6", x: 65.1, y: 27.2, number: 6, team: "away" },
            { id: "a7", x: 65.1, y: 40.8, number: 7, team: "away" },
            { id: "a8", x: 47.25, y: 20.4, number: 8, team: "away" },
            { id: "a9", x: 47.25, y: 34, number: 9, team: "away" },
            { id: "a10", x: 47.25, y: 47.6, number: 10, team: "away" },
            { id: "a11", x: 21, y: 34, number: 11, team: "away" },
        ],
    },
    // 5-3-2
    "5-3-2": {
        home: [
            { id: "h1", x: 7.35, y: 34, number: 1, team: "home" },
            { id: "h2", x: 18.9, y: 8.16, number: 2, team: "home" },
            { id: "h3", x: 18.9, y: 21.76, number: 3, team: "home" },
            { id: "h4", x: 18.9, y: 34, number: 4, team: "home" },
            { id: "h5", x: 18.9, y: 46.24, number: 5, team: "home" },
            { id: "h6", x: 18.9, y: 59.84, number: 6, team: "home" },
            { id: "h7", x: 42, y: 20.4, number: 7, team: "home" },
            { id: "h8", x: 42, y: 34, number: 8, team: "home" },
            { id: "h9", x: 42, y: 47.6, number: 9, team: "home" },
            { id: "h10", x: 73.5, y: 27.2, number: 10, team: "home" },
            { id: "h11", x: 73.5, y: 40.8, number: 11, team: "home" },
        ],
        away: [
            { id: "a1", x: 97.65, y: 34, number: 1, team: "away" },
            { id: "a2", x: 86.1, y: 8.16, number: 2, team: "away" },
            { id: "a3", x: 86.1, y: 21.76, number: 3, team: "away" },
            { id: "a4", x: 86.1, y: 34, number: 4, team: "away" },
            { id: "a5", x: 86.1, y: 46.24, number: 5, team: "away" },
            { id: "a6", x: 86.1, y: 59.84, number: 6, team: "away" },
            { id: "a7", x: 63, y: 20.4, number: 7, team: "away" },
            { id: "a8", x: 63, y: 34, number: 8, team: "away" },
            { id: "a9", x: 63, y: 47.6, number: 9, team: "away" },
            { id: "a10", x: 31.5, y: 27.2, number: 10, team: "away" },
            { id: "a11", x: 31.5, y: 40.8, number: 11, team: "away" },
        ],
    },
    // 4-1-4-1
    "4-1-4-1": {
        home: [
            { id: "h1", x: 7.35, y: 34, number: 1, team: "home" },
            { id: "h2", x: 21, y: 12.24, number: 2, team: "home" },
            { id: "h3", x: 21, y: 25.84, number: 3, team: "home" },
            { id: "h4", x: 21, y: 42.16, number: 4, team: "home" },
            { id: "h5", x: 21, y: 55.76, number: 5, team: "home" },
            { id: "h6", x: 39.9, y: 34, number: 6, team: "home" },
            { id: "h7", x: 57.75, y: 13.6, number: 7, team: "home" },
            { id: "h8", x: 57.75, y: 23.8, number: 8, team: "home" },
            { id: "h9", x: 57.75, y: 44.2, number: 9, team: "home" },
            { id: "h10", x: 57.75, y: 54.4, number: 10, team: "home" },
            { id: "h11", x: 84, y: 34, number: 11, team: "home" },
        ],
        away: [
            { id: "a1", x: 97.65, y: 34, number: 1, team: "away" },
            { id: "a2", x: 84, y: 12.24, number: 2, team: "away" },
            { id: "a3", x: 84, y: 25.84, number: 3, team: "away" },
            { id: "a4", x: 84, y: 42.16, number: 4, team: "away" },
            { id: "a5", x: 84, y: 55.76, number: 5, team: "away" },
            { id: "a6", x: 65.1, y: 34, number: 6, team: "away" },
            { id: "a7", x: 47.25, y: 13.6, number: 7, team: "away" },
            { id: "a8", x: 47.25, y: 23.8, number: 8, team: "away" },
            { id: "a9", x: 47.25, y: 44.2, number: 9, team: "away" },
            { id: "a10", x: 47.25, y: 54.4, number: 10, team: "away" },
            { id: "a11", x: 21, y: 34, number: 11, team: "away" },
        ],
    },
    // 3-4-3
    "3-4-3": {
        home: [
            { id: "h1", x: 7.35, y: 34, number: 1, team: "home" },
            { id: "h2", x: 23.1, y: 20.4, number: 2, team: "home" },
            { id: "h3", x: 23.1, y: 34, number: 3, team: "home" },
            { id: "h4", x: 23.1, y: 47.6, number: 4, team: "home" },
            { id: "h5", x: 42, y: 13.6, number: 5, team: "home" },
            { id: "h6", x: 42, y: 27.2, number: 6, team: "home" },
            { id: "h7", x: 42, y: 40.8, number: 7, team: "home" },
            { id: "h8", x: 42, y: 54.4, number: 8, team: "home" },
            { id: "h9", x: 68.25, y: 20.4, number: 9, team: "home" },
            { id: "h10", x: 78.75, y: 34, number: 10, team: "home" },
            { id: "h11", x: 68.25, y: 47.6, number: 11, team: "home" },
        ],
        away: [
            { id: "a1", x: 97.65, y: 34, number: 1, team: "away" },
            { id: "a2", x: 81.9, y: 20.4, number: 2, team: "away" },
            { id: "a3", x: 81.9, y: 34, number: 3, team: "away" },
            { id: "a4", x: 81.9, y: 47.6, number: 4, team: "away" },
            { id: "a5", x: 63, y: 13.6, number: 5, team: "away" },
            { id: "a6", x: 63, y: 27.2, number: 6, team: "away" },
            { id: "a7", x: 63, y: 40.8, number: 7, team: "away" },
            { id: "a8", x: 63, y: 54.4, number: 8, team: "away" },
            { id: "a9", x: 36.75, y: 20.4, number: 9, team: "away" },
            { id: "a10", x: 26.25, y: 34, number: 10, team: "away" },
            { id: "a11", x: 36.75, y: 47.6, number: 11, team: "away" },
        ],
    },
    // 4-5-1
    "4-5-1": {
        home: [
            { id: "h1", x: 7.35, y: 34, number: 1, team: "home" },
            { id: "h2", x: 21, y: 12.24, number: 2, team: "home" },
            { id: "h3", x: 21, y: 23.8, number: 3, team: "home" },
            { id: "h4", x: 21, y: 44.2, number: 4, team: "home" },
            { id: "h5", x: 21, y: 55.76, number: 5, team: "home" },
            { id: "h6", x: 39.9, y: 17, number: 6, team: "home" },
            { id: "h7", x: 39.9, y: 27.2, number: 7, team: "home" },
            { id: "h8", x: 39.9, y: 34, number: 8, team: "home" },
            { id: "h9", x: 39.9, y: 40.8, number: 9, team: "home" },
            { id: "h10", x: 39.9, y: 51, number: 10, team: "home" },
            { id: "h11", x: 73.5, y: 34, number: 11, team: "home" },
        ],
        away: [
            { id: "a1", x: 97.65, y: 34, number: 1, team: "away" },
            { id: "a2", x: 84, y: 12.24, number: 2, team: "away" },
            { id: "a3", x: 84, y: 23.8, number: 3, team: "away" },
            { id: "a4", x: 84, y: 44.2, number: 4, team: "away" },
            { id: "a5", x: 84, y: 55.76, number: 5, team: "away" },
            { id: "a6", x: 65.1, y: 17, number: 6, team: "away" },
            { id: "a7", x: 65.1, y: 27.2, number: 7, team: "away" },
            { id: "a8", x: 65.1, y: 34, number: 8, team: "away" },
            { id: "a9", x: 65.1, y: 40.8, number: 9, team: "away" },
            { id: "a10", x: 65.1, y: 51, number: 10, team: "away" },
            { id: "a11", x: 31.5, y: 34, number: 11, team: "away" },
        ],
    },
}

export function useTacticsBoard() {
    const [players, setPlayers] = useState<Player[]>(() => [
        ...defaultFormations["4-3-3"].home.map((p) => ({ ...p, team: "home" as const })),
        ...defaultFormations["4-3-3"].away.map((p) => ({ ...p, team: "away" as const })),
    ])
    const [homeTeam, setHomeTeam] = useState<Team>({ name: "Home Team", color: "#ef4444" })
    const [awayTeam, setAwayTeam] = useState<Team>({ name: "Away Team", color: "#3b82f6" })
    const [homeFormation, setHomeFormation] = useState<string>("4-3-3")
    const [awayFormation, setAwayFormation] = useState<string>("4-3-3")
    const [drawingMode, setDrawingMode] = useState<"move" | "draw" | "erase">("move")
    const [drawings, setDrawings] = useState<DrawingElement[]>([])
    const [isHomeTeamActive, setIsHomeTeamActive] = useState<boolean>(true)

    const updatePlayerPosition = useCallback((playerId: string, x: number, y: number) => {
        setPlayers((prev) => prev.map((player) => (player.id === playerId ? { ...player, x, y } : player)))
    }, [])

    const updateHomeTeam = useCallback((updates: Partial<Team>) => {
        setHomeTeam((prev) => ({ ...prev, ...updates }))
    }, [])

    const updateAwayTeam = useCallback((updates: Partial<Team>) => {
        setAwayTeam((prev) => ({ ...prev, ...updates }))
    }, [])

    const setFormation = useCallback((formation: string, team?: "home" | "away") => {
        const formationData = defaultFormations[formation as keyof typeof defaultFormations]
        if (formationData) {
            const unique = () => `-${Date.now()}-${Math.floor(Math.random() * 10000)}`
            if (team === "home") {
                setHomeFormation(formation)
                setPlayers((prev) => {
                    const awayPlayers = prev.filter((p) => p.team === "away")
                    return [
                        ...formationData.home.map((p) => ({ ...p, id: p.id + unique(), team: "home" as const })),
                        ...awayPlayers,
                    ]
                })
            } else if (team === "away") {
                setAwayFormation(formation)
                setPlayers((prev) => {
                    const homePlayers = prev.filter((p) => p.team === "home")
                    return [
                        ...homePlayers,
                        ...formationData.away.map((p) => ({ ...p, id: p.id + unique(), team: "away" as const })),
                    ]
                })
            } else {
                setHomeFormation(formation)
                setAwayFormation(formation)
                setPlayers([
                    ...formationData.home.map((p) => ({ ...p, id: p.id + unique(), team: "home" as const })),
                    ...formationData.away.map((p) => ({ ...p, id: p.id + unique(), team: "away" as const })),
                ])
            }
        }
    }, [])

    const changeDrawingMode = useCallback((mode: "move" | "draw" | "erase") => {
        setDrawingMode(mode)
    }, [])

    const addDrawing = useCallback((drawing: Omit<DrawingElement, "id" | "color">) => {
        const newDrawing: DrawingElement = {
            ...drawing,
            id: `drawing-${Date.now()}-${Math.random()}`,
            color: isHomeTeamActive ? homeTeam.color : awayTeam.color,
        }
        setDrawings((prev) => [...prev, newDrawing])
    }, [isHomeTeamActive, homeTeam.color, awayTeam.color])

    const removeDrawing = useCallback((drawingId: string) => {
        setDrawings((prev) => prev.filter((d) => d.id !== drawingId))
    }, [])

    const clearDrawings = useCallback(() => {
        setDrawings([])
    }, [])

    const saveBoard = useCallback(() => {
        localStorage.setItem("tactical_button_board", JSON.stringify({
            players,
            homeTeam,
            awayTeam,
            homeFormation,
            awayFormation,
            drawingMode,
            drawings,
        }))
    }, [players, homeTeam, awayTeam, homeFormation, awayFormation, drawingMode, drawings])

    const loadBoard = useCallback(() => {
        const saved = localStorage.getItem("tactical_button_board")
        if (saved) {
            try {
                const state = JSON.parse(saved)
                setPlayers(state.players || [])
                setHomeTeam(state.homeTeam || { name: "Home Team", color: "#ef4444" })
                setAwayTeam(state.awayTeam || { name: "Away Team", color: "#3b82f6" })
                setHomeFormation(state.homeFormation || "4-3-3")
                setAwayFormation(state.awayFormation || "4-3-3")
                setDrawingMode(state.drawingMode || "move")
                setDrawings(state.drawings || [])
            } catch (error) {
                console.error("Failed to load board:", error)
            }
        }
    }, [])

    const setActiveTeam = useCallback((team: "home" | "away") => {
        setIsHomeTeamActive(team === "home")
    }, [])

    // Add a resetBoard function
    const resetBoard = useCallback(() => {
        setPlayers([
            ...defaultFormations["4-3-3"].home.map((p) => ({ ...p, team: "home" as const })),
            ...defaultFormations["4-3-3"].away.map((p) => ({ ...p, team: "away" as const })),
        ])
        setHomeTeam({ name: "Home Team", color: "#ef4444" })
        setAwayTeam({ name: "Away Team", color: "#3b82f6" })
        setHomeFormation("4-3-3")
        setAwayFormation("4-3-3")
        setDrawingMode("move")
        setDrawings([])
        setIsHomeTeamActive(true)
    }, [])

    return {
        players,
        homeTeam,
        awayTeam,
        homeFormation,
        awayFormation,
        drawingMode,
        drawings,
        isHomeTeamActive,
        updatePlayerPosition,
        updateHomeTeam,
        updateAwayTeam,
        setFormation,
        changeDrawingMode,
        addDrawing,
        removeDrawing,
        clearDrawings,
        saveBoard,
        loadBoard,
        setActiveTeam,
        resetBoard,
    }
}

const TacticsBoardContext = createContext<ReturnType<typeof useTacticsBoard> | null>(null)

export function TacticsBoardProvider({ children }: { children: React.ReactNode }) {
    const value = useTacticsBoard()
    return <TacticsBoardContext.Provider value={value}>{children}</TacticsBoardContext.Provider>
}

export function useTacticsBoardContext() {
    const ctx = useContext(TacticsBoardContext)
    if (!ctx) throw new Error("useTacticsBoardContext must be used within a TacticsBoardProvider")
    return ctx
}

// Update the default export to use context if available
export function useTacticsBoardWithContext() {
    const ctx = useContext(TacticsBoardContext)
    if (ctx) return ctx
    return useTacticsBoard()
}
