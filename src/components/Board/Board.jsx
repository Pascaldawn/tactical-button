
import React, { useState, useEffect } from 'react';
import Field from './Field';
import DrawingTools from './DrawingTools';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Sample data for players
const initialPlayers = [
  // Team 1 (blue) players
  { id: 'team1-1', number: 1, team: 'team1', position: { x: 300, y: 500 } },
  { id: 'team1-2', number: 2, team: 'team1', position: { x: 200, y: 400 } },
  { id: 'team1-3', number: 3, team: 'team1', position: { x: 400, y: 400 } },
  { id: 'team1-4', number: 4, team: 'team1', position: { x: 300, y: 300 } },
  { id: 'team1-5', number: 5, team: 'team1', position: { x: 200, y: 200 } },
  { id: 'team1-6', number: 6, team: 'team1', position: { x: 400, y: 200 } },
  { id: 'team1-7', number: 7, team: 'team1', position: { x: 300, y: 100 } },
  
  // Team 2 (red) players
  { id: 'team2-1', number: 1, team: 'team2', position: { x: 700, y: 100 } },
  { id: 'team2-2', number: 2, team: 'team2', position: { x: 600, y: 200 } },
  { id: 'team2-3', number: 3, team: 'team2', position: { x: 800, y: 200 } },
  { id: 'team2-4', number: 4, team: 'team2', position: { x: 700, y: 300 } },
  { id: 'team2-5', number: 5, team: 'team2', position: { x: 600, y: 400 } },
  { id: 'team2-6', number: 6, team: 'team2', position: { x: 800, y: 400 } },
  { id: 'team2-7', number: 7, team: 'team2', position: { x: 700, y: 500 } },
  
  // Ball (neutral)
  { id: 'ball', number: 0, team: 'neutral', position: { x: 500, y: 300 } },
];

const Board = () => {
  const [players, setPlayers] = useState(initialPlayers);
  const [drawingMode, setDrawingMode] = useState(false);
  const [drawingColor, setDrawingColor] = useState('#FFFFFF');
  const [drawingWidth, setDrawingWidth] = useState(3);
  const [activeDrawingTool, setActiveDrawingTool] = useState('move');
  
  const handlePlayersChange = (updatedPlayers) => {
    setPlayers(updatedPlayers);
  };
  
  const handleToggleDrawingMode = () => {
    setDrawingMode(!drawingMode);
  };
  
  const handleClearCanvas = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };
  
  const handleSaveTactic = () => {
    toast.success('Tactic saved successfully!');
    // In a real application, this would save to the backend
  };
  
  const handleExportImage = () => {
    toast.success('Exporting tactic as image...');
    // In a real application, this would generate and download an image
  };
  
  return (
    <div className="flex flex-col w-full h-full">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Tactics Board</h1>
        
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleSaveTactic}
            variant="default"
          >
            Save Tactic
          </Button>
          
          <Button
            onClick={handleExportImage}
            variant="secondary"
          >
            Export as Image
          </Button>
        </div>
      </div>
      
      <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-1 mb-4">
        <DrawingTools
          isDrawingMode={drawingMode}
          onToggleDrawingMode={handleToggleDrawingMode}
          activeDrawingTool={activeDrawingTool}
          setActiveDrawingTool={setActiveDrawingTool}
          drawingColor={drawingColor}
          setDrawingColor={setDrawingColor}
          drawingWidth={drawingWidth}
          setDrawingWidth={setDrawingWidth}
          onClearCanvas={handleClearCanvas}
        />
      </div>
      
      <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-1 aspect-[16/9] w-full overflow-hidden flex-grow">
        <Field
          players={players}
          onPlayersChange={handlePlayersChange}
          drawingMode={drawingMode}
          drawingColor={drawingColor}
          drawingWidth={drawingWidth}
          activeDrawingTool={activeDrawingTool}
        />
      </div>
      
      <div className="mt-6 text-sm text-muted-foreground">
        <p>Tip: Use the drawing tools to illustrate plays and formations. Drag players to position them on the field.</p>
      </div>
    </div>
  );
};

export default Board;
