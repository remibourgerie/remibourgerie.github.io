import React, { useEffect, useRef } from 'react';

interface Node {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  blinkTimer: number;
  isBlinking: boolean;
}

interface Edge {
  source: number;
  target: number;
  signalProgress: number;
  hasSignal: boolean;
  signalTimer: number;
}

interface EnhancedGraphVisualizationProps {
  width?: number;
  height?: number;
  nodes?: number;
  className?: string;
  enableExtendedEffects?: boolean;
}

const EnhancedGraphVisualization: React.FC<EnhancedGraphVisualizationProps> = ({ 
  width = 400, 
  height = 300, 
  nodes = 15,
  className = "",
  enableExtendedEffects = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const nodesRef = useRef<Node[]>([]);
  const edgesRef = useRef<Edge[]>([]);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    // Initialize nodes with blinking properties
    const nodeArray: Node[] = Array.from({ length: nodes }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      blinkTimer: Math.random() * 200,
      isBlinking: false,
    }));

    // Initialize edges with signal properties
    const edgeArray: Edge[] = [];
    for (let i = 0; i < nodes; i++) {
      const connections = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < connections; j++) {
        if (Math.random() > 0.4) {
          const target = Math.floor(Math.random() * nodes);
          if (target !== i) {
            edgeArray.push({
              source: i,
              target: target,
              signalProgress: 0,
              hasSignal: false,
              signalTimer: Math.random() * 300
            });
          }
        }
      }
    }

    nodesRef.current = nodeArray;
    edgesRef.current = edgeArray;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      timeRef.current += 1;
      ctx.clearRect(0, 0, width, height);

      // Update node positions and blinking
      nodesRef.current.forEach(node => {
        // Update position
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off walls with some randomness
        if (node.x <= 8 || node.x >= width - 8) {
          node.vx *= -0.9;
          node.vx += (Math.random() - 0.5) * 0.2;
        }
        if (node.y <= 8 || node.y >= height - 8) {
          node.vy *= -0.9;
          node.vy += (Math.random() - 0.5) * 0.2;
        }

        // Keep within bounds
        node.x = Math.max(8, Math.min(width - 8, node.x));
        node.y = Math.max(8, Math.min(height - 8, node.y));

        // Update blinking
        node.blinkTimer--;
        if (node.blinkTimer <= 0) {
          node.isBlinking = !node.isBlinking;
          node.blinkTimer = node.isBlinking ? 20 + Math.random() * 10 : 80 + Math.random() * 120;
        }
      });

      // Update edge signals
      edgesRef.current.forEach(edge => {
        edge.signalTimer--;
        if (edge.signalTimer <= 0 && !edge.hasSignal && Math.random() > 0.98) {
          edge.hasSignal = true;
          edge.signalProgress = 0;
          edge.signalTimer = 200 + Math.random() * 300;
        }

        if (edge.hasSignal) {
          edge.signalProgress += 0.03 + Math.random() * 0.02;
          if (edge.signalProgress >= 1) {
            edge.hasSignal = false;
            edge.signalProgress = 0;
          }
        }
      });

      // Draw edges with extended effects
      edgesRef.current.forEach(edge => {
        const source = nodesRef.current[edge.source];
        const target = nodesRef.current[edge.target];
        if (source && target) {
          // Calculate edge path
          const dx = target.x - source.x;
          const dy = target.y - source.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Extend edge beyond canvas if enabled
          let endX = target.x;
          let endY = target.y;
          
          if (enableExtendedEffects && Math.random() > 0.995) {
            const extendFactor = 1.5 + Math.random() * 0.5;
            endX = source.x + dx * extendFactor;
            endY = source.y + dy * extendFactor;
          }

          // Draw main edge
          ctx.strokeStyle = edge.hasSignal 
            ? 'hsl(207 90% 54% / 0.8)' 
            : 'hsl(220 13% 91% / 0.4)';
          ctx.lineWidth = edge.hasSignal ? 2 : 1;
          ctx.beginPath();
          ctx.moveTo(source.x, source.y);
          ctx.lineTo(endX, endY);
          ctx.stroke();

          // Draw communication signal
          if (edge.hasSignal) {
            const signalX = source.x + dx * edge.signalProgress;
            const signalY = source.y + dy * edge.signalProgress;
            
            // Signal glow
            ctx.beginPath();
            ctx.arc(signalX, signalY, 4, 0, 2 * Math.PI);
            ctx.fillStyle = 'hsl(206 100% 70% / 0.8)';
            ctx.fill();
            
            // Signal core
            ctx.beginPath();
            ctx.arc(signalX, signalY, 2, 0, 2 * Math.PI);
            ctx.fillStyle = 'hsl(207 90% 54%)';
            ctx.fill();
          }
        }
      });

      // Draw nodes with blinking effects
      nodesRef.current.forEach((node, i) => {
        const isMainNode = i === 0;
        const baseSize = isMainNode ? 7 : 5;
        const glowSize = isMainNode ? 12 : 8;
        
        // Determine opacity based on blinking
        let opacity = 1;
        if (node.isBlinking) {
          opacity = 0.3 + Math.sin(timeRef.current * 0.3) * 0.3;
        }

        // Draw glow effect
        ctx.beginPath();
        ctx.arc(node.x, node.y, glowSize, 0, 2 * Math.PI);
        ctx.fillStyle = isMainNode 
          ? `hsl(207 90% 54% / ${0.2 * opacity})` 
          : `hsl(206 100% 70% / ${0.15 * opacity})`;
        ctx.fill();

        // Draw main node
        ctx.beginPath();
        ctx.arc(node.x, node.y, baseSize, 0, 2 * Math.PI);
        ctx.fillStyle = isMainNode 
          ? `hsl(207 90% 54% / ${opacity})` 
          : `hsl(206 100% 70% / ${opacity})`;
        ctx.fill();

        // Add extra glow for blinking nodes
        if (node.isBlinking) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, baseSize + 3, 0, 2 * Math.PI);
          ctx.fillStyle = `hsl(206 100% 70% / ${0.3 * opacity})`;
          ctx.fill();
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height, nodes, enableExtendedEffects]);

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

export default EnhancedGraphVisualization;
