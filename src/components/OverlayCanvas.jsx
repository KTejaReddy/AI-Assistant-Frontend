import React, { useEffect, useRef } from 'react';

const OverlayCanvas = ({ highlights }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Clear previous highlights
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (highlights && highlights.length > 0) {
      highlights.forEach(h => {
        // Draw highlight (e.g., a pulsing red rectangle/circle)
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 4;
        ctx.strokeRect(h.x, h.y, h.width, h.height);
        
        ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
        ctx.fillRect(h.x, h.y, h.width, h.height);

        // Draw label
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 16px Inter';
        ctx.fillText(h.label, h.x, h.y - 10);
      });
    }
  }, [highlights]);

  return (
    <canvas 
      ref={canvasRef} 
      className="canvas-overlay"
      style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  );
};

export default OverlayCanvas;
