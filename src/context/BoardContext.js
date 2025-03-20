
import React, { createContext, useContext, useState, useEffect } from 'react';

const BoardContext = createContext();

export const BoardProvider = ({ children }) => {
  const [players, setPlayers] = useState([]);
  const [activeTactic, setActiveTactic] = useState(null);
  const [savedTactics, setSavedTactics] = useState([]);
  const [fieldType, setFieldType] = useState('soccer');
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [drawings, setDrawings] = useState([]);
  
  // Load saved tactics from localStorage
  useEffect(() => {
    const loadSavedTactics = () => {
      try {
        const savedTacticsJson = localStorage.getItem('savedTactics');
        if (savedTacticsJson) {
          setSavedTactics(JSON.parse(savedTacticsJson));
        }
      } catch (error) {
        console.error('Error loading saved tactics:', error);
      }
    };
    
    loadSavedTactics();
  }, []);
  
  // Save tactics to localStorage when they change
  useEffect(() => {
    if (savedTactics.length > 0) {
      try {
        localStorage.setItem('savedTactics', JSON.stringify(savedTactics));
      } catch (error) {
        console.error('Error saving tactics:', error);
      }
    }
  }, [savedTactics]);
  
  const saveTactic = (tacticData) => {
    const newTactic = {
      id: Date.now().toString(),
      name: tacticData.name || `Tactic ${savedTactics.length + 1}`,
      createdAt: new Date().toISOString(),
      fieldType,
      players: [...players],
      drawings: [...drawings],
      ...tacticData
    };
    
    setSavedTactics(prev => [...prev, newTactic]);
    setActiveTactic(newTactic);
    return newTactic;
  };
  
  const updateTactic = (tacticId, tacticData) => {
    setSavedTactics(prev => prev.map(tactic => 
      tactic.id === tacticId 
        ? { ...tactic, ...tacticData, updatedAt: new Date().toISOString() } 
        : tactic
    ));
  };
  
  const deleteTactic = (tacticId) => {
    setSavedTactics(prev => prev.filter(tactic => tactic.id !== tacticId));
    if (activeTactic && activeTactic.id === tacticId) {
      setActiveTactic(null);
    }
  };
  
  const loadTactic = (tacticId) => {
    const tactic = savedTactics.find(t => t.id === tacticId);
    if (tactic) {
      setActiveTactic(tactic);
      setPlayers(tactic.players || []);
      setDrawings(tactic.drawings || []);
      setFieldType(tactic.fieldType || 'soccer');
    }
  };
  
  const clearBoard = () => {
    setPlayers([]);
    setDrawings([]);
    setActiveTactic(null);
  };
  
  const addDrawing = (drawing) => {
    setDrawings(prev => [...prev, drawing]);
  };
  
  const clearDrawings = () => {
    setDrawings([]);
  };
  
  const updatePlayer = (playerId, updates) => {
    setPlayers(prev => prev.map(player => 
      player.id === playerId ? { ...player, ...updates } : player
    ));
  };
  
  const addPlayer = (player) => {
    setPlayers(prev => [...prev, {
      id: Date.now().toString(),
      position: { x: 300, y: 300 },
      ...player
    }]);
  };
  
  const removePlayer = (playerId) => {
    setPlayers(prev => prev.filter(player => player.id !== playerId));
  };
  
  const value = {
    players,
    setPlayers,
    activeTactic,
    setActiveTactic,
    savedTactics,
    fieldType,
    setFieldType,
    isDrawingMode,
    setIsDrawingMode,
    drawings,
    
    // Methods
    saveTactic,
    updateTactic,
    deleteTactic,
    loadTactic,
    clearBoard,
    addDrawing,
    clearDrawings,
    updatePlayer,
    addPlayer,
    removePlayer
  };
  
  return (
    <BoardContext.Provider value={value}>
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (context === undefined) {
    throw new Error('useBoard must be used within a BoardProvider');
  }
  return context;
};

export default BoardContext;
