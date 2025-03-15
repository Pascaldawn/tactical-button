import React, { useRef, useState } from 'react';
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

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: any, info: any) => {
    setIsDragging(false);
    onPositionChange(id, { x: info.point.x, y: info.point.y });
  };

  return (
    <motion.div
      className={`player-icon ${TeamColors[team]} ${isDragging ? 'player-dragging' : ''}`}
      initial={{ x: position.x, y: position.y }}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', damping: 20 }}
      drag
      dragMomentum={false}
      dragConstraints={constraintsRef}
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
