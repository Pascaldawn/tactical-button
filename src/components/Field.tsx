
import React, { useState, useRef, useEffect } from 'react';
import PlayerIcon from './PlayerIcon';

interface Player {
  id: string;
  number: number;
  team: 'team1' | 'team2' | 'neutral';
  position: { x: number; y: number };
}

interface FieldProps {
  players: Player[];
  onPlayersChange: (players: Player[]) => void;
  drawingMode: boolean;
  drawingColor: string;
  drawingWidth: number;
  activeDrawingTool: string;
}

const Field: React.FC<FieldProps> = ({
  players,
  onPlayersChange,
  drawingMode,
  drawingColor,
  drawingWidth,
  activeDrawingTool
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fieldRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState<{ x: number; y: number } | null>(null);
  const [fieldSize, setFieldSize] = useState({ width: 0, height: 0 });
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state on component mount
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (fieldRef.current) {
        setFieldSize({
          width: fieldRef.current.offsetWidth,
          height: fieldRef.current.offsetHeight
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize canvas when component mounts or field size changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Set canvas dimensions
    canvas.width = fieldSize.width;
    canvas.height = fieldSize.height;

    // Clear previous drawings
    context.clearRect(0, 0, canvas.width, canvas.height);
  }, [fieldSize]);

  // Handle position change of a player
  const handlePositionChange = (id: string, newPosition: { x: number; y: number }) => {
    const updatedPlayers = players.map((player) =>
      player.id === id ? { ...player, position: newPosition } : player
    );
    onPlayersChange(updatedPlayers);
  };

  // Drawing functions
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawingMode) return;
    setIsDrawing(true);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) 
      ? e.touches[0].clientX - rect.left
      : e.clientX - rect.left;
    const y = ('touches' in e)
      ? e.touches[0].clientY - rect.top
      : e.clientY - rect.top;

    setLastPosition({ x, y });

    // For single dots
    if (activeDrawingTool === 'pen' || activeDrawingTool === 'eraser') {
      const context = canvas.getContext('2d');
      if (!context) return;

      context.beginPath();
      context.arc(x, y, drawingWidth / 2, 0, Math.PI * 2);
      context.fillStyle = activeDrawingTool === 'eraser' ? '#4BB543' : drawingColor;
      context.fill();
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !drawingMode || !lastPosition) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e)
      ? e.touches[0].clientX - rect.left
      : e.clientX - rect.left;
    const y = ('touches' in e)
      ? e.touches[0].clientY - rect.top
      : e.clientY - rect.top;

    if (activeDrawingTool === 'pen' || activeDrawingTool === 'eraser') {
      context.beginPath();
      context.moveTo(lastPosition.x, lastPosition.y);
      context.lineTo(x, y);
      context.strokeStyle = activeDrawingTool === 'eraser' ? '#4BB543' : drawingColor;
      context.lineWidth = drawingWidth;
      context.lineJoin = 'round';
      context.lineCap = 'round';
      context.stroke();
    }

    setLastPosition({ x, y });
  };

  const endDrawing = () => {
    setIsDrawing(false);
    setLastPosition(null);
  };

  // Soccer field markup
  const SoccerFieldMarkup = () => (
    <>
      {/* Center circle */}
      <div className="absolute top-1/2 left-1/2 w-1/5 h-1/10 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-field-lines opacity-70"></div>
      
      {/* Center line */}
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-field-lines opacity-70 transform -translate-y-1/2"></div>
      
      {/* Center spot */}
      <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-field-lines rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
      
      {/* Goal boxes */}
      <div className="absolute top-0 left-1/4 w-1/2 h-1/10 border-2 border-t-0 border-field-lines opacity-70"></div>
      <div className="absolute bottom-0 left-1/4 w-1/2 h-1/10 border-2 border-b-0 border-field-lines opacity-70"></div>
      
      {/* Penalty boxes */}
      <div className="absolute top-0 left-1/6 w-2/3 h-1/6 border-2 border-t-0 border-field-lines opacity-70"></div>
      <div className="absolute bottom-0 left-1/6 w-2/3 h-1/6 border-2 border-b-0 border-field-lines opacity-70"></div>
      
      {/* Penalty spots */}
      <div className="absolute top-1/8 left-1/2 w-2 h-2 bg-field-lines rounded-full transform -translate-x-1/2"></div>
      <div className="absolute bottom-1/8 left-1/2 w-2 h-2 bg-field-lines rounded-full transform -translate-x-1/2"></div>
      
      {/* Corner arcs */}
      <div className="absolute top-0 left-0 w-4 h-4 border-r-2 border-field-lines opacity-70 rounded-br-full"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-l-2 border-field-lines opacity-70 rounded-bl-full"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-r-2 border-field-lines opacity-70 rounded-tr-full"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-l-2 border-field-lines opacity-70 rounded-tl-full"></div>
    </>
  );

  return (
    <div 
      ref={fieldRef}
      className="field-container relative select-none"
    >
      {/* Field pattern */}
      <div className="field-pattern"></div>
      
      {/* Field markings */}
      <div className="absolute inset-0">
        <SoccerFieldMarkup />
      </div>
      
      {/* Drawing canvas */}
      <canvas
        ref={canvasRef}
        className={`drawing-canvas ${drawingMode ? 'cursor-crosshair' : 'pointer-events-none'}`}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={endDrawing}
      />
      
      {/* Only render players when component is mounted */}
      {isMounted && players.map((player) => (
        <PlayerIcon
          key={player.id}
          id={player.id}
          number={player.number}
          team={player.team}
          position={player.position}
          onPositionChange={handlePositionChange}
        />
      ))}
    </div>
  );
};

export default Field;
