"use client"

import React, { useState, useRef } from "react"
import { useEffect } from "react"

import { useTacticsBoardWithContext } from "@/hooks/use-tactics-board"

export const TacticsBoard = React.memo(function TacticsBoard() {
    const svgRef = useRef<SVGSVGElement>(null)
    const [draggedPlayer, setDraggedPlayer] = useState<string | null>(null)
    // Drawing state
    const [isDrawing, setIsDrawing] = useState(false)
    const [drawingPoints, setDrawingPoints] = useState<{ x: number; y: number }[]>([])
    const drawingPointsRef = useRef<{ x: number; y: number }[]>([])
    const {
        players,
        updatePlayerPosition,
        homeTeam,
        awayTeam,
        drawingMode,
        drawings,
        addDrawing,
        removeDrawing,
        isHomeTeamActive // <-- add this
    } = useTacticsBoardWithContext()

    // Add state to track current drawing color
    const [currentDrawColor, setCurrentDrawColor] = useState<string>(homeTeam.color);
    const [playerRadius, setPlayerRadius] = useState(1.4);
    useEffect(() => {
        function updateRadius() {
            if (window.innerWidth < 640) {
                setPlayerRadius(2.6); // Slightly above original for mobile
            } else {
                setPlayerRadius(1.8); // Slightly above original for desktop
            }
        }
        updateRadius();
        window.addEventListener('resize', updateRadius);
        return () => window.removeEventListener('resize', updateRadius);
    }, []);

    const getSvgCoordinates = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!svgRef.current) return { x: 0, y: 0 }
        const rect = svgRef.current.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 105
        const y = ((e.clientY - rect.top) / rect.height) * 68
        return { x, y }
    }

    const distanceToLineSegment = (point: { x: number; y: number }, p1: { x: number; y: number }, p2: { x: number; y: number }) => {
        const A = point.x - p1.x
        const B = point.y - p1.y
        const C = p2.x - p1.x
        const D = p2.y - p1.y

        const dot = A * C + B * D
        const lenSq = C * C + D * D
        let param = -1

        if (lenSq !== 0) param = dot / lenSq

        let xx, yy

        if (param < 0) {
            xx = p1.x
            yy = p1.y
        } else if (param > 1) {
            xx = p2.x
            yy = p2.y
        } else {
            xx = p1.x + param * C
            yy = p1.y + param * D
        }

        const dx = point.x - xx
        const dy = point.y - yy

        return Math.sqrt(dx * dx + dy * dy)
    }

    // Helper: minimum distance between points (in % of board width)
    const MIN_DIST = 0.25; // Lowered for smoother drawing
    function shouldAddPoint(newPoint: { x: number; y: number }, lastPoint?: { x: number; y: number }) {
        if (!lastPoint) return true
        const dx = newPoint.x - lastPoint.x
        const dy = newPoint.y - lastPoint.y
        return Math.sqrt(dx * dx + dy * dy) > MIN_DIST
    }

    const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
        if (drawingMode === "move") {
            // Handle player dragging (existing logic)
            const target = e.target as SVGElement
            const playerGroup = target.closest('g[data-player-id]')
            if (playerGroup) {
                const playerId = playerGroup.getAttribute('data-player-id')
                if (playerId) {
                    setDraggedPlayer(playerId)
                }
            }
        } else if (drawingMode === "draw") {
            // Start drawing
            const coords = getSvgCoordinates(e);
            // Determine color based on starting x
            const color = coords.x < 52.5 ? homeTeam.color : awayTeam.color;
            setCurrentDrawColor(color);
            setIsDrawing(true);
            drawingPointsRef.current = [coords];
            setDrawingPoints([coords]);
        } else if (drawingMode === "erase") {
            // Handle erasing
            const coords = getSvgCoordinates(e)
            const clickedDrawing = drawings.find(drawing => {
                if (drawing.type === "arrow" && drawing.points.length >= 2) {
                    // Check if click is near the arrow line
                    for (let i = 0; i < drawing.points.length - 1; i++) {
                        const p1 = drawing.points[i]
                        const p2 = drawing.points[i + 1]
                        const distance = distanceToLineSegment(coords, p1, p2)
                        if (distance < 3) { // 3% tolerance
                            return true
                        }
                    }
                }
                return false
            })

            if (clickedDrawing) {
                removeDrawing(clickedDrawing.id)
            }
        }
    }

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (drawingMode === "move" && draggedPlayer) {
            const coords = getSvgCoordinates(e)
            // Keep players within bounds
            const boundedX = Math.max(2, Math.min(98, coords.x))
            const boundedY = Math.max(2, Math.min(98, coords.y))
            updatePlayerPosition(draggedPlayer, boundedX, boundedY)
        } else if (drawingMode === "draw" && isDrawing) {
            const coords = getSvgCoordinates(e)
            const last = drawingPointsRef.current[drawingPointsRef.current.length - 1]
            if (shouldAddPoint(coords, last)) {
                drawingPointsRef.current.push(coords)
                setDrawingPoints([...drawingPointsRef.current])
            }
        }
    }

    const handleMouseUp = (e: React.MouseEvent<SVGSVGElement>) => {
        if (drawingMode === "move") {
            setDraggedPlayer(null)
        } else if (drawingMode === "draw" && isDrawing) {
            const coords = getSvgCoordinates(e)
            const last = drawingPointsRef.current[drawingPointsRef.current.length - 1]
            if (shouldAddPoint(coords, last)) {
                drawingPointsRef.current.push(coords)
            }
            const finalPoints = [...drawingPointsRef.current]

            if (finalPoints.length >= 2) {
                // Determine color by direction: left-to-right = home, right-to-left = away
                const start = finalPoints[0]
                const end = finalPoints[finalPoints.length - 1]
                const color = end.x > start.x ? homeTeam.color : awayTeam.color
                addDrawing({
                    type: "arrow",
                    points: finalPoints,
                    color,
                    strokeWidth: 0.3,
                })
            }

            setIsDrawing(false)
            setDrawingPoints([])
            drawingPointsRef.current = []
        }
    }

    const handleMouseLeave = () => {
        setDraggedPlayer(null)
        if (isDrawing) {
            setIsDrawing(false)
            setDrawingPoints([])
        }
    }

    // Erase handler for drawings
    const handleEraseDrawing = (drawingId: string) => {
        if (drawingMode === "erase") {
            removeDrawing(drawingId)
        }
    }

    const renderLine = (drawing: { id?: string; type: string; points: { x: number; y: number }[]; color: string; strokeWidth: number }, idx: number) => {
        const points = drawing.points
        if (points.length < 2) return null
        const pathData = points.map((point: { x: number; y: number }, index: number) =>
            `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
        ).join(' ')

        return (
            <g
                key={drawing.id || idx}
                style={drawingMode === "erase" ? { cursor: "pointer" } : {}}
                onClick={() => handleEraseDrawing(drawing.id || '')}
            >
                <path
                    d={pathData}
                    stroke={drawing.color}
                    strokeWidth={drawing.strokeWidth}
                    fill="none"
                    markerEnd="url(#arrowhead)"
                    style={{ color: drawing.color }}
                />
            </g>
        )
    }

    // Filter players to only show the active team
    const activeTeam = isHomeTeamActive ? "home" : "away"

    // Add touch coordinate helper
    const getSvgTouchCoordinates = (e: React.TouchEvent<SVGSVGElement>) => {
        if (!svgRef.current) return { x: 0, y: 0 }
        const rect = svgRef.current.getBoundingClientRect()
        const touch = e.touches[0] || e.changedTouches[0]
        const x = ((touch.clientX - rect.left) / rect.width) * 105
        const y = ((touch.clientY - rect.top) / rect.height) * 68
        return { x, y }
    }

    // Touch event handlers
    const handleTouchStart = (e: React.TouchEvent<SVGSVGElement>) => {
        // Prevent accidental tap on player when drawing/erasing
        const touch = e.target as SVGElement;
        const playerGroup = touch.closest('g[data-player-id]');
        if (playerGroup) {
            if (drawingMode === "move") {
                const playerId = playerGroup.getAttribute('data-player-id');
                if (playerId) {
                    setDraggedPlayer(playerId);
                }
            }
            // Do not start drawing/erasing if tap is on a player
            e.preventDefault();
            return;
        }
        if (drawingMode === "draw") {
            const coords = getSvgTouchCoordinates(e);
            const color = coords.x < 52.5 ? homeTeam.color : awayTeam.color;
            setCurrentDrawColor(color);
            setIsDrawing(true);
            drawingPointsRef.current = [coords];
            setDrawingPoints([coords]);
        } else if (drawingMode === "erase") {
            const coords = getSvgTouchCoordinates(e);
            const clickedDrawing = drawings.find(drawing => {
                if (drawing.type === "arrow" && drawing.points.length >= 2) {
                    for (let i = 0; i < drawing.points.length - 1; i++) {
                        const p1 = drawing.points[i];
                        const p2 = drawing.points[i + 1];
                        const distance = distanceToLineSegment(coords, p1, p2);
                        if (distance < 3) {
                            return true;
                        }
                    }
                }
                return false;
            });
            if (clickedDrawing) {
                removeDrawing(clickedDrawing.id);
            }
        }
        e.preventDefault();
    };

    const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
        if (drawingMode === "move" && draggedPlayer) {
            const coords = getSvgTouchCoordinates(e)
            const boundedX = Math.max(2, Math.min(98, coords.x))
            const boundedY = Math.max(2, Math.min(98, coords.y))
            updatePlayerPosition(draggedPlayer, boundedX, boundedY)
        } else if (drawingMode === "draw" && isDrawing) {
            const coords = getSvgTouchCoordinates(e)
            const last = drawingPointsRef.current[drawingPointsRef.current.length - 1]
            if (shouldAddPoint(coords, last)) {
                drawingPointsRef.current.push(coords)
                setDrawingPoints([...drawingPointsRef.current])
            }
        }
        e.preventDefault()
    }

    const handleTouchEnd = (e: React.TouchEvent<SVGSVGElement>) => {
        if (drawingMode === "move") {
            setDraggedPlayer(null)
        } else if (drawingMode === "draw" && isDrawing) {
            const coords = getSvgTouchCoordinates(e)
            const last = drawingPointsRef.current[drawingPointsRef.current.length - 1]
            if (shouldAddPoint(coords, last)) {
                drawingPointsRef.current.push(coords)
            }
            const finalPoints = [...drawingPointsRef.current]
            if (finalPoints.length >= 2) {
                // Determine color by direction: left-to-right = home, right-to-left = away
                const start = finalPoints[0]
                const end = finalPoints[finalPoints.length - 1]
                const color = end.x > start.x ? homeTeam.color : awayTeam.color
                addDrawing({
                    type: "arrow",
                    points: finalPoints,
                    color,
                    strokeWidth: 0.3,
                })
            }
            setIsDrawing(false)
            setDrawingPoints([])
            drawingPointsRef.current = []
        }
        e.preventDefault()
    }

    const handleTouchCancel = () => {
        setDraggedPlayer(null)
        if (isDrawing) {
            setIsDrawing(false)
            setDrawingPoints([])
            drawingPointsRef.current = []
        }
    }

    return (
        <div className="w-full min-w-0 min-h-[180px] sm:min-h-[260px] md:min-h-[340px] lg:min-h-[420px] xl:min-h-[520px] h-full flex items-center justify-center rounded-lg overflow-hidden relative" data-tactics-board style={{ touchAction: 'none' }}>
            <svg
                ref={svgRef}
                viewBox="0 0 105 68"
                className={`w-full h-auto aspect-[105/68] max-h-full ${drawingMode === "draw" ? "cursor-crosshair" :
                    drawingMode === "erase" ? "cursor-pointer" :
                        "cursor-default"
                    }`}
                style={{ touchAction: 'none' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchCancel}
            >
                {/* Arrowhead marker definition */}
                <defs>
                    <marker
                        id="arrowhead"
                        markerWidth="6"
                        markerHeight="6"
                        refX="5"
                        refY="3"
                        orient="auto"
                        markerUnits="strokeWidth"
                    >
                        <path d="M0,0 L6,3 L0,6 Z" fill="currentColor" />
                    </marker>
                </defs>
                {/* Pitch Background */}
                <rect x="0" y="0" width="105" height="68" fill="#22a745" />

                {/* Pitch Lines - all inside the pitch, sharp corners, correct proportions */}
                <g stroke="white" strokeWidth="0.8" fill="none">
                    {/* Outer boundary */}
                    <rect x="0.5" y="0.5" width="104" height="67" />

                    {/* Center line */}
                    <line x1="52.5" y1="0.5" x2="52.5" y2="67.5" />

                    {/* Center circle */}
                    <circle cx="52.5" cy="34" r="9.15" />
                    {/* Center spot */}
                    <circle cx="52.5" cy="34" r="0.3" fill="white" />

                    {/* Penalty areas */}
                    {/* Left */}
                    <rect x="0.5" y="13.84" width="16.5" height="40.32" />
                    {/* Right */}
                    <rect x="88" y="13.84" width="16.5" height="40.32" />

                    {/* 6-yard boxes */}
                    {/* Left */}
                    <rect x="0.5" y="25.34" width="5.5" height="17.32" />
                    {/* Right */}
                    <rect x="99" y="25.34" width="5.5" height="17.32" />

                    {/* Penalty spots */}
                    {/* Left */}
                    <circle cx="11" cy="34" r="0.3" fill="white" />
                    {/* Right */}
                    <circle cx="94" cy="34" r="0.3" fill="white" />

                    {/* Penalty arcs */}
                    {/* Left: arc outside the box, tangent to the penalty area line, like |) */}
                    <path d="M 16.5 24.85 A 9.15 9.15 0 0 1 16.5 43.15" />
                    {/* Right: arc outside the box, tangent to the penalty area line, like (| */}
                    <path d="M 88 24.85 A 9.15 9.15 0 0 0 88 43.15" />
                </g>

                {/* Goals (outside the pitch) */}
                <g stroke="#bbb" strokeWidth="0.8" fill="none">
                    {/* Left goal */}
                    <rect x="-2" y="30.5" width="2.5" height="7" />
                    {/* Right goal */}
                    <rect x="104.5" y="30.5" width="2.5" height="7" />
                </g>

                {/* Rendered drawings */}
                {drawings.map((drawing, idx) => renderLine(drawing, idx))}

                {/* Current drawing preview */}
                {isDrawing && drawingPoints.length >= 2 && (
                    (() => {
                        const start = drawingPoints[0];
                        const end = drawingPoints[drawingPoints.length - 1];
                        const previewColor = end.x > start.x ? homeTeam.color : awayTeam.color;
                        return renderLine({ type: "arrow", points: drawingPoints, color: previewColor, strokeWidth: 0.3 }, -1);
                    })()
                )}

                {/* Players: show both home and away */}
                {players.map((player, idx) => (
                    <g
                        key={player.id + '-' + idx}
                        data-player-id={player.id}
                        transform={`translate(${player.x}, ${player.y})`}
                        className={drawingMode === "move" ? "cursor-move" : "cursor-default"}
                    >
                        {/* Larger transparent hit area for touch */}
                        <circle
                            r={playerRadius * 1.3}
                            fill="transparent"
                            style={{ pointerEvents: 'all' }}
                        />
                        <circle
                            r={playerRadius}
                            fill={player.team === "home" ? homeTeam.color : awayTeam.color}
                            stroke="white"
                            strokeWidth="0.2"
                            className="hover:r-2.5 transition-all"
                        />
                        <text
                            textAnchor="middle"
                            dominantBaseline="middle"
                            alignmentBaseline="middle"
                            dy={0}
                            fontSize={playerRadius * 1.0}
                            fill={
                                (player.team === "home" && homeTeam.color === "#ffffff") ||
                                    (player.team === "away" && awayTeam.color === "#ffffff")
                                    ? "#222"
                                    : "white"
                            }
                            className="pointer-events-none select-none font-bold"
                        >
                            {player.number}
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    )
})

