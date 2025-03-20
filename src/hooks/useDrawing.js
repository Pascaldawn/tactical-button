
import { useState, useRef, useCallback, useEffect } from 'react';

const useDrawing = (options = {}) => {
  const {
    defaultColor = '#FFFFFF',
    defaultWidth = 3,
    defaultTool = 'pen'
  } = options;
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState(defaultColor);
  const [width, setWidth] = useState(defaultWidth);
  const [tool, setTool] = useState(defaultTool);
  
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const lastPositionRef = useRef({ x: 0, y: 0 });
  
  const initializeCanvas = useCallback((canvas) => {
    if (!canvas) return;
    
    canvasRef.current = canvas;
    
    // Set up the canvas for high DPI displays
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    
    const context = canvas.getContext('2d');
    context.scale(2, 2); // Scale for high DPI
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = color;
    context.lineWidth = width;
    contextRef.current = context;
  }, [color, width]);
  
  const startDrawing = useCallback((x, y) => {
    if (!contextRef.current) return;
    
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    lastPositionRef.current = { x, y };
    setIsDrawing(true);
  }, []);
  
  const draw = useCallback((x, y) => {
    if (!isDrawing || !contextRef.current) return;
    
    if (tool === 'pen') {
      contextRef.current.lineTo(x, y);
      contextRef.current.stroke();
    } else if (tool === 'line') {
      // For line tool, we need to redraw on canvas
      const canvas = canvasRef.current;
      const context = contextRef.current;
      
      // Clear the canvas and redraw
      context.clearRect(0, 0, canvas.width / 2, canvas.height / 2);
      context.beginPath();
      context.moveTo(lastPositionRef.current.x, lastPositionRef.current.y);
      context.lineTo(x, y);
      context.stroke();
    } else if (tool === 'arrow') {
      // For arrow tool, similar to line but with an arrowhead
      const canvas = canvasRef.current;
      const context = contextRef.current;
      
      // Clear the canvas and redraw
      context.clearRect(0, 0, canvas.width / 2, canvas.height / 2);
      
      // Draw the line
      context.beginPath();
      context.moveTo(lastPositionRef.current.x, lastPositionRef.current.y);
      context.lineTo(x, y);
      context.stroke();
      
      // Draw the arrowhead
      const angle = Math.atan2(y - lastPositionRef.current.y, x - lastPositionRef.current.x);
      const headlen = 10; // Length of arrowhead
      
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(
        x - headlen * Math.cos(angle - Math.PI / 6),
        y - headlen * Math.sin(angle - Math.PI / 6)
      );
      context.lineTo(
        x - headlen * Math.cos(angle + Math.PI / 6),
        y - headlen * Math.sin(angle + Math.PI / 6)
      );
      context.closePath();
      context.fill();
    }
  }, [isDrawing, tool]);
  
  const endDrawing = useCallback(() => {
    if (!contextRef.current) return;
    
    contextRef.current.closePath();
    setIsDrawing(false);
    
    // For tools that require mouse move to preview (like line, arrow)
    // We need to commit the final drawing to the permanent layer
    if (tool === 'line' || tool === 'arrow') {
      // In a real implementation, we would copy from a temporary canvas to a permanent one
    }
  }, [tool]);
  
  const clearCanvas = useCallback(() => {
    if (!canvasRef.current || !contextRef.current) return;
    
    contextRef.current.clearRect(
      0, 
      0, 
      canvasRef.current.width / 2, 
      canvasRef.current.height / 2
    );
  }, []);
  
  useEffect(() => {
    if (!contextRef.current) return;
    
    contextRef.current.strokeStyle = color;
    contextRef.current.lineWidth = width;
  }, [color, width]);
  
  return {
    canvasRef,
    isDrawing,
    color,
    setColor,
    width,
    setWidth,
    tool,
    setTool,
    initializeCanvas,
    startDrawing,
    draw,
    endDrawing,
    clearCanvas
  };
};

export default useDrawing;
