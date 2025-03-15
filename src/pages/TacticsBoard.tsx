
import React, { useState, useRef, useEffect } from 'react';
import Field from '../components/Field';
import DrawingTools from '../components/DrawingTools';
import { Plus, Save, Download, Share2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Player {
  id: string;
  number: number;
  team: 'team1' | 'team2' | 'neutral';
  position: { x: number; y: number };
}

// Initial players setup
const initialPlayers: Player[] = [
  // Team 1 (blue)
  { id: 't1-1', number: 1, team: 'team1', position: { x: 100, y: 50 } },
  { id: 't1-2', number: 2, team: 'team1', position: { x: 50, y: 150 } },
  { id: 't1-3', number: 3, team: 'team1', position: { x: 100, y: 200 } },
  { id: 't1-4', number: 4, team: 'team1', position: { x: 150, y: 150 } },
  { id: 't1-5', number: 5, team: 'team1', position: { x: 100, y: 100 } },
  
  // Team 2 (red)
  { id: 't2-1', number: 1, team: 'team2', position: { x: 300, y: 50 } },
  { id: 't2-2', number: 2, team: 'team2', position: { x: 250, y: 150 } },
  { id: 't2-3', number: 3, team: 'team2', position: { x: 300, y: 200 } },
  { id: 't2-4', number: 4, team: 'team2', position: { x: 350, y: 150 } },
  { id: 't2-5', number: 5, team: 'team2', position: { x: 300, y: 100 } },
  
  // Neutral (coach/ball)
  { id: 'n-1', number: 0, team: 'neutral', position: { x: 200, y: 250 } },
];

const TacticsBoard: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [drawingMode, setDrawingMode] = useState(false);
  const [drawingColor, setDrawingColor] = useState('#FFFFFF');
  const [drawingWidth, setDrawingWidth] = useState(3);
  const [activeDrawingTool, setActiveDrawingTool] = useState('move');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tacticName, setTacticName] = useState('Untitled Tactic');
  const [isEditing, setIsEditing] = useState(false);
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  const toggleDrawingMode = () => {
    setDrawingMode(!drawingMode);
  };

  const clearCanvas = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const handleSave = () => {
    // In a real app, this would save to the backend
    toast.success('Tactic saved successfully');
  };

  const handleExport = () => {
    if (!fieldRef.current) return;
    
    // In a real app, this would generate an image for download
    toast.success('Tactic exported as image');
  };

  const handleShare = () => {
    // In a real app, this would generate a shareable link
    toast.success('Shareable link copied to clipboard');
  };

  const addPlayer = (team: 'team1' | 'team2' | 'neutral') => {
    const teamPlayers = players.filter(p => p.team === team);
    const newNumber = team === 'neutral' ? 0 : teamPlayers.length + 1;
    
    const newPlayer: Player = {
      id: `${team}-${Date.now()}`,
      number: newNumber,
      team,
      position: { x: 200, y: 200 },
    };
    
    setPlayers([...players, newPlayer]);
  };

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          {isEditing ? (
            <input
              type="text"
              value={tacticName}
              onChange={(e) => setTacticName(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
              className="bg-transparent text-2xl md:text-3xl font-bold border-b-2 border-primary focus:outline-none"
              autoFocus
            />
          ) : (
            <h1 
              className="text-2xl md:text-3xl font-bold cursor-pointer hover:text-primary transition-colors"
              onClick={() => setIsEditing(true)}
            >
              {tacticName}
            </h1>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handleSave}
            className="btn-secondary flex items-center gap-1"
          >
            <Save size={18} />
            <span className="hidden sm:inline">Save</span>
          </button>
          
          <button 
            onClick={handleExport}
            className="btn-secondary flex items-center gap-1"
          >
            <Download size={18} />
            <span className="hidden sm:inline">Export</span>
          </button>
          
          <button 
            onClick={handleShare}
            className="btn-primary flex items-center gap-1"
          >
            <Share2 size={18} />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>
      
      <div className="mb-4 flex flex-wrap gap-2">
        <button 
          onClick={() => addPlayer('team1')}
          className="btn-secondary flex items-center gap-1 py-2 bg-players-team1 text-white"
        >
          <Plus size={16} />
          <span>Add Blue Player</span>
        </button>
        
        <button 
          onClick={() => addPlayer('team2')}
          className="btn-secondary flex items-center gap-1 py-2 bg-players-team2 text-white"
        >
          <Plus size={16} />
          <span>Add Red Player</span>
        </button>
        
        <button 
          onClick={() => addPlayer('neutral')}
          className="btn-secondary flex items-center gap-1 py-2 bg-players-neutral text-white"
        >
          <Plus size={16} />
          <span>Add Neutral</span>
        </button>
      </div>
      
      <div ref={fieldRef} className="relative mb-4">
        <Field
          players={players}
          onPlayersChange={setPlayers}
          drawingMode={drawingMode}
          drawingColor={drawingColor}
          drawingWidth={drawingWidth}
          activeDrawingTool={activeDrawingTool}
        />
      </div>
      
      <div className="flex justify-center">
        <DrawingTools
          isDrawingMode={drawingMode}
          onToggleDrawingMode={toggleDrawingMode}
          activeDrawingTool={activeDrawingTool}
          setActiveDrawingTool={setActiveDrawingTool}
          drawingColor={drawingColor}
          setDrawingColor={setDrawingColor}
          drawingWidth={drawingWidth}
          setDrawingWidth={setDrawingWidth}
          onClearCanvas={clearCanvas}
        />
      </div>
    </div>
  );
};

export default TacticsBoard;
