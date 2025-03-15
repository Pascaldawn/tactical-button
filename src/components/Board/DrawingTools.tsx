
import React from 'react';
import { Pencil, Eraser, Move, Trash2 } from 'lucide-react';

interface DrawingToolsProps {
  isDrawingMode: boolean;
  onToggleDrawingMode: () => void;
  activeDrawingTool: string;
  setActiveDrawingTool: (tool: string) => void;
  drawingColor: string;
  setDrawingColor: (color: string) => void;
  drawingWidth: number;
  setDrawingWidth: (width: number) => void;
  onClearCanvas: () => void;
}

const DrawingTools: React.FC<DrawingToolsProps> = ({
  isDrawingMode,
  onToggleDrawingMode,
  activeDrawingTool,
  setActiveDrawingTool,
  drawingColor,
  setDrawingColor,
  drawingWidth,
  setDrawingWidth,
  onClearCanvas
}) => {
  const colors = ['#FFFFFF', '#FF0000', '#0000FF', '#FFFF00', '#000000'];
  
  return (
    <div className="bg-background/80 backdrop-blur-sm border border-border rounded-lg p-3 md:p-4 flex flex-wrap gap-2 md:gap-4 items-center">
      <div className="flex gap-2">
        <button
          className={`p-2 rounded ${!isDrawingMode ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
          onClick={() => {
            onToggleDrawingMode();
            setActiveDrawingTool('move');
          }}
          title="Move Players"
        >
          <Move size={20} />
        </button>
        
        <button
          className={`p-2 rounded ${isDrawingMode && activeDrawingTool === 'pen' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
          onClick={() => {
            if (!isDrawingMode) onToggleDrawingMode();
            setActiveDrawingTool('pen');
          }}
          title="Draw"
        >
          <Pencil size={20} />
        </button>
        
        <button
          className={`p-2 rounded ${isDrawingMode && activeDrawingTool === 'eraser' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
          onClick={() => {
            if (!isDrawingMode) onToggleDrawingMode();
            setActiveDrawingTool('eraser');
          }}
          title="Eraser"
        >
          <Eraser size={20} />
        </button>
      </div>
      
      {isDrawingMode && activeDrawingTool === 'pen' && (
        <>
          <div className="h-6 border-l border-border mx-1"></div>
          
          <div className="flex gap-1">
            {colors.map((color) => (
              <button
                key={color}
                className={`w-6 h-6 rounded-full ${
                  drawingColor === color ? 'ring-2 ring-primary ring-offset-2' : ''
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setDrawingColor(color)}
                title={`Color: ${color}`}
              />
            ))}
          </div>
          
          <div className="h-6 border-l border-border mx-1"></div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Size:</span>
            <input
              type="range"
              min="1"
              max="20"
              value={drawingWidth}
              onChange={(e) => setDrawingWidth(parseInt(e.target.value))}
              className="w-20 md:w-24"
            />
          </div>
        </>
      )}
      
      <div className="h-6 border-l border-border mx-1"></div>
      
      <button
        className="p-2 rounded bg-destructive text-destructive-foreground"
        onClick={onClearCanvas}
        title="Clear Canvas"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
};

export default DrawingTools;
