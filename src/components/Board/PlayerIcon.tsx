
import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PlayerIconProps {
  id: string;
  number: number;
  team: 'team1' | 'team2' | 'neutral';
  position: { x: number; y: number };
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
}

const TeamColors = {
  team1: 'bg-players-team1',
  team2: 'bg-players-team2',
  neutral: 'bg-players-neutral',
};

const PlayerIcon: React.FC<PlayerIconProps> = ({ id, number, team, position, onPositionChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const constraintsRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  // Set mounted state after component is mounted to ensure DOM is ready
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: any, info: any) => {
    setIsDragging(false);
    onPositionChange(id, { x: info.point.x, y: info.point.y });
  };

  // Only render motion.div when component is mounted
  if (!mounted) {
    return null; // Return null during SSR or before component is mounted
  }

  return (
    <motion.div
      className={`player-icon ${TeamColors[team]} ${isDragging ? 'player-dragging' : ''}`}
      initial={{ x: position.x, y: position.y }}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', damping: 20 }}
      drag
      dragMomentum={false}
      dragElastic={0} // Disable elasticity for more precise positioning
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 1.1 }}
      style={{ position: 'absolute', touchAction: 'none' }}
    >
      {number}
    </motion.div>
  );
};

export default PlayerIcon;
