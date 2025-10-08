import React, { useEffect, useRef } from 'react';
import EnhancedGraphVisualization from './EnhancedGraphVisualization';

interface ResearchVisualizationProps {
  type: 'graph-structures' | 'collaborative' | 'network-science';
  width?: number;
  height?: number;
  className?: string;
}

const ResearchVisualization: React.FC<ResearchVisualizationProps> = ({
  type,
  width = 300,
  height = 200,
  className = ""
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.02;

      if (type === 'graph-structures') {
        // Molecular-like rigid graph structures
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = 40;
        
        // Main structure
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI * 2) / 6 + time * 0.5;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          
          // Draw connections to center
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(x, y);
          ctx.strokeStyle = 'hsl(207 90% 54% / 0.4)';
          ctx.lineWidth = 2;
          ctx.stroke();
          
          // Draw nodes
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, 2 * Math.PI);
          ctx.fillStyle = 'hsl(207 90% 54%)';
          ctx.fill();
          
          // Secondary structure
          if (i % 2 === 0) {
            const secondX = x + Math.cos(angle + Math.PI/2) * 20;
            const secondY = y + Math.sin(angle + Math.PI/2) * 20;
            
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(secondX, secondY);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.arc(secondX, secondY, 4, 0, 2 * Math.PI);
            ctx.fillStyle = 'hsl(206 100% 70%)';
            ctx.fill();
          }
        }
        
        // Center node
        ctx.beginPath();
        ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
        ctx.fillStyle = 'hsl(210 79% 46%)';
        ctx.fill();
        
      } else if (type === 'collaborative') {
        // Network-style collaborative learning
        const nodes = [
          { x: width * 0.2, y: height * 0.3, phase: 0 },
          { x: width * 0.8, y: height * 0.3, phase: Math.PI / 3 },
          { x: width * 0.5, y: height * 0.7, phase: Math.PI * 2 / 3 },
          { x: width * 0.2, y: height * 0.7, phase: Math.PI },
          { x: width * 0.8, y: height * 0.7, phase: Math.PI * 4 / 3 },
        ];
        
        // Draw connections with data flow
        nodes.forEach((node, i) => {
          nodes.forEach((otherNode, j) => {
            if (i !== j && Math.random() > 0.6) {
              const progress = (Math.sin(time * 2 + i + j) + 1) / 2;
              const x = node.x + (otherNode.x - node.x) * progress;
              const y = node.y + (otherNode.y - node.y) * progress;
              
              // Connection line
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(otherNode.x, otherNode.y);
              ctx.strokeStyle = 'hsl(207 90% 54% / 0.2)';
              ctx.lineWidth = 1;
              ctx.stroke();
              
              // Data packet
              if (progress > 0.1 && progress < 0.9) {
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, 2 * Math.PI);
                ctx.fillStyle = 'hsl(206 100% 70%)';
                ctx.fill();
              }
            }
          });
        });
        
        // Draw nodes with pulsing effect
        nodes.forEach((node, i) => {
          const pulseSize = 6 + Math.sin(time * 3 + node.phase) * 2;
          ctx.beginPath();
          ctx.arc(node.x, node.y, pulseSize, 0, 2 * Math.PI);
          ctx.fillStyle = 'hsl(207 90% 54%)';
          ctx.fill();
          
          // Outer glow
          ctx.beginPath();
          ctx.arc(node.x, node.y, pulseSize + 4, 0, 2 * Math.PI);
          ctx.fillStyle = 'hsl(207 90% 54% / 0.3)';
          ctx.fill();
        });
        
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [type, width, height]);

  if (type === 'network-science') {
    return (
      <EnhancedGraphVisualization 
        width={width} 
        height={height} 
        nodes={15} 
        className={`opacity-70 ${className}`} 
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`rounded-lg ${className}`}
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
};

export default ResearchVisualization;