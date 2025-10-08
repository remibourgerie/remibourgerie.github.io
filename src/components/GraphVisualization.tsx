import React, { useEffect, useRef } from 'react';

interface Node {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Edge {
  source: number;
  target: number;
}

const GraphVisualization: React.FC<{ 
  width?: number; 
  height?: number; 
  nodes?: number;
  className?: string;
}> = ({ 
  width = 400, 
  height = 300, 
  nodes = 15,
  className = ""
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const nodesRef = useRef<Node[]>([]);
  const edgesRef = useRef<Edge[]>([]);

  useEffect(() => {
    // Initialize nodes and edges
    const nodeArray: Node[] = Array.from({ length: nodes }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    }));

    const edgeArray: Edge[] = [];
    for (let i = 0; i < nodes - 1; i++) {
      if (Math.random() > 0.6) {
        edgeArray.push({
          source: i,
          target: Math.floor(Math.random() * nodes)
        });
      }
    }

    nodesRef.current = nodeArray;
    edgesRef.current = edgeArray;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Update node positions
      nodesRef.current.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off walls
        if (node.x <= 5 || node.x >= width - 5) node.vx *= -1;
        if (node.y <= 5 || node.y >= height - 5) node.vy *= -1;

        // Keep within bounds
        node.x = Math.max(5, Math.min(width - 5, node.x));
        node.y = Math.max(5, Math.min(height - 5, node.y));
      });

      // Draw edges
      ctx.strokeStyle = 'hsl(220 13% 91% / 0.6)';
      ctx.lineWidth = 1;
      edgesRef.current.forEach(edge => {
        const source = nodesRef.current[edge.source];
        const target = nodesRef.current[edge.target];
        if (source && target) {
          ctx.beginPath();
          ctx.moveTo(source.x, source.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
        }
      });

      // Draw nodes
      nodesRef.current.forEach((node, i) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, i === 0 ? 6 : 4, 0, 2 * Math.PI);
        ctx.fillStyle = i === 0 ? 'hsl(207 90% 54%)' : 'hsl(206 100% 70%)';
        ctx.fill();
        
        // Add subtle glow for main node
        if (i === 0) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, 8, 0, 2 * Math.PI);
          ctx.fillStyle = 'hsl(207 90% 54% / 0.3)';
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
  }, [width, height, nodes]);

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

export default GraphVisualization;
