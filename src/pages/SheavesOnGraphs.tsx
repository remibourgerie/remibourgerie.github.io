import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SheavesOnGraphs = () => {
  const navigate = useNavigate();
  const svg1Ref = useRef<SVGSVGElement>(null);
  const svg2Ref = useRef<SVGSVGElement>(null);
  const animationRef = useRef<number>();
  const [animationActive, setAnimationActive] = useState(false);

  const initializeGraphs = () => {
    drawSimpleGraph();
    drawComplexGraph();
  };

  const drawSimpleGraph = () => {
    const svg = svg1Ref.current;
    if (!svg) return;
    
    svg.innerHTML = '';
    const width = 600;
    const height = 300;
    
    // Create nodes
    const nodes = [
      {id: 'A', x: 80, y: height/2, opinion: [0.8, -0.3, 0.5]},
      {id: 'B', x: width-80, y: height/2, opinion: [-0.2, 0.9, -0.1]}
    ];
    
    // Draw edge
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', nodes[0].x.toString());
    line.setAttribute('y1', nodes[0].y.toString());
    line.setAttribute('x2', nodes[1].x.toString());
    line.setAttribute('y2', nodes[1].y.toString());
    line.setAttribute('stroke', 'hsl(var(--primary))');
    line.setAttribute('stroke-width', '8');
    line.setAttribute('opacity', '0.7');
    svg.appendChild(line);
    
    // Draw edge stalk (middle rectangle)
    const edgeStalk = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    edgeStalk.setAttribute('x', ((width/2) - 25).toString());
    edgeStalk.setAttribute('y', ((height/2) - 15).toString());
    edgeStalk.setAttribute('width', '50');
    edgeStalk.setAttribute('height', '30');
    edgeStalk.setAttribute('fill', 'hsl(var(--primary))');
    edgeStalk.setAttribute('stroke', 'hsl(var(--background))');
    edgeStalk.setAttribute('stroke-width', '2');
    edgeStalk.setAttribute('rx', '5');
    svg.appendChild(edgeStalk);
    
    // Add edge label
    const edgeLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    edgeLabel.setAttribute('x', (width/2).toString());
    edgeLabel.setAttribute('y', (height/2 + 5).toString());
    edgeLabel.setAttribute('text-anchor', 'middle');
    edgeLabel.setAttribute('fill', 'hsl(var(--primary-foreground))');
    edgeLabel.setAttribute('font-weight', 'bold');
    edgeLabel.textContent = 'F(e)';
    svg.appendChild(edgeLabel);
    
    // Draw nodes and their stalks
    nodes.forEach(node => {
      // Node circle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', node.x.toString());
      circle.setAttribute('cy', node.y.toString());
      circle.setAttribute('r', '25');
      circle.setAttribute('fill', 'hsl(var(--accent))');
      circle.setAttribute('stroke', 'hsl(var(--background))');
      circle.setAttribute('stroke-width', '3');
      svg.appendChild(circle);
      
      // Node label
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', node.x.toString());
      label.setAttribute('y', (node.y + 5).toString());
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('fill', 'hsl(var(--accent-foreground))');
      label.setAttribute('font-weight', 'bold');
      label.textContent = `F(${node.id})`;
      svg.appendChild(label);
      
      // Opinion dimensions (small rectangles above)
      for(let i = 0; i < 3; i++) {
        const dim = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        dim.setAttribute('x', (node.x - 30 + i * 20).toString());
        dim.setAttribute('y', (node.y - 60).toString());
        dim.setAttribute('width', '15');
        dim.setAttribute('height', (Math.abs(node.opinion[i]) * 30 + 5).toString());
        dim.setAttribute('fill', node.opinion[i] > 0 ? 'hsl(var(--primary))' : 'hsl(var(--destructive))');
        dim.setAttribute('opacity', '0.8');
        dim.setAttribute('rx', '2');
        svg.appendChild(dim);
      }
    });
  };

  const drawComplexGraph = () => {
    const svg = svg2Ref.current;
    if (!svg) return;
    
    svg.innerHTML = '';
    const width = 600;
    const height = 300;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 80;
    
    // Create nodes in a pentagon
    const nodes = [];
    const nodeCount = 5;
    for(let i = 0; i < nodeCount; i++) {
      const angle = (2 * Math.PI * i) / nodeCount - Math.PI / 2;
      nodes.push({
        id: String.fromCharCode(65 + i), // A, B, C, D, E
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        opinion: [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1]
      });
    }
    
    // Draw edges (connect each node to next two)
    for(let i = 0; i < nodeCount; i++) {
      for(let j = i + 1; j < nodeCount; j++) {
        if(j - i <= 2 || (i === 0 && j === nodeCount - 1)) {
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', nodes[i].x.toString());
          line.setAttribute('y1', nodes[i].y.toString());
          line.setAttribute('x2', nodes[j].x.toString());
          line.setAttribute('y2', nodes[j].y.toString());
          line.setAttribute('stroke', 'hsl(var(--primary))');
          line.setAttribute('stroke-width', '4');
          line.setAttribute('opacity', '0.6');
          svg.appendChild(line);
          
          // Edge stalk (small rectangle at midpoint)
          const midX = (nodes[i].x + nodes[j].x) / 2;
          const midY = (nodes[i].y + nodes[j].y) / 2;
          
          const edgeStalk = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          edgeStalk.setAttribute('x', (midX - 8).toString());
          edgeStalk.setAttribute('y', (midY - 8).toString());
          edgeStalk.setAttribute('width', '16');
          edgeStalk.setAttribute('height', '16');
          edgeStalk.setAttribute('fill', 'hsl(var(--primary))');
          edgeStalk.setAttribute('stroke', 'hsl(var(--background))');
          edgeStalk.setAttribute('stroke-width', '1');
          edgeStalk.setAttribute('rx', '3');
          svg.appendChild(edgeStalk);
        }
      }
    }
    
    // Draw nodes and their multidimensional stalks
    nodes.forEach(node => {
      // Node circle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', node.x.toString());
      circle.setAttribute('cy', node.y.toString());
      circle.setAttribute('r', '20');
      circle.setAttribute('fill', 'hsl(var(--accent))');
      circle.setAttribute('stroke', 'hsl(var(--background))');
      circle.setAttribute('stroke-width', '2');
      svg.appendChild(circle);
      
      // Node label
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', node.x.toString());
      label.setAttribute('y', (node.y + 4).toString());
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('fill', 'hsl(var(--accent-foreground))');
      label.setAttribute('font-weight', 'bold');
      label.setAttribute('font-size', '12');
      label.textContent = node.id;
      svg.appendChild(label);
      
      // Multidimensional stalk representation (3D box projection)
      const stalkGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      stalkGroup.setAttribute('transform', `translate(${node.x - 15}, ${node.y - 45})`);
      
      // Draw 3D box faces
      const faces = [
        {points: '0,20 15,15 30,20 15,25', fill: 'hsl(var(--accent) / 0.8)'},
        {points: '15,5 30,0 30,20 15,25', fill: 'hsl(var(--accent) / 0.6)'},
        {points: '0,0 15,5 15,25 0,20', fill: 'hsl(var(--accent) / 0.4)'}
      ];
      
      faces.forEach(face => {
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygon.setAttribute('points', face.points);
        polygon.setAttribute('fill', face.fill);
        polygon.setAttribute('stroke', 'hsl(var(--border))');
        polygon.setAttribute('stroke-width', '1');
        svg.appendChild(polygon);
      });
      
      svg.appendChild(stalkGroup);
    });
  };

  const animateOpinionFlow = () => {
    if (animationActive) return;
    setAnimationActive(true);
    
    const svgs = [svg1Ref.current, svg2Ref.current];
    
    svgs.forEach(svg => {
      if (!svg) return;
      for(let i = 0; i < 5; i++) {
        setTimeout(() => {
          createFlowParticle(svg);
        }, i * 200);
      }
    });
    
    setTimeout(() => {
      setAnimationActive(false);
    }, 2000);
  };

  const createFlowParticle = (svg: SVGSVGElement) => {
    const particle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    particle.setAttribute('r', '4');
    particle.setAttribute('fill', 'hsl(var(--warning))');
    particle.setAttribute('opacity', '0');
    
    const animateMotion = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
    animateMotion.setAttribute('dur', '1.5s');
    animateMotion.setAttribute('repeatCount', '1');
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    if(svg === svg1Ref.current) {
      path.setAttribute('d', 'M 80 150 L 520 150');
    } else {
      path.setAttribute('d', 'M 300 70 L 380 130 L 380 220 L 220 220 L 220 130 Z');
    }
    
    animateMotion.appendChild(path);
    particle.appendChild(animateMotion);
    
    const animateOpacity = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
    animateOpacity.setAttribute('attributeName', 'opacity');
    animateOpacity.setAttribute('values', '0;1;1;0');
    animateOpacity.setAttribute('dur', '1.5s');
    particle.appendChild(animateOpacity);
    
    svg.appendChild(particle);
    
    setTimeout(() => {
      if(svg.contains(particle)) {
        svg.removeChild(particle);
      }
    }, 1600);
  };

  const showConsensus = () => {
    const circles = document.querySelectorAll('circle[fill*="--accent"]');
    const rects = document.querySelectorAll('rect[fill*="--primary"]');
    
    circles.forEach(circle => {
      circle.setAttribute('fill', 'hsl(var(--warning))');
    });
    
    rects.forEach(rect => {
      rect.setAttribute('fill', 'hsl(var(--success))');
    });
    
    setTimeout(() => {
      initializeGraphs();
    }, 2000);
  };

  useEffect(() => {
    initializeGraphs();
    
    const handleResize = () => {
      initializeGraphs();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-card rounded-2xl shadow-material-3 overflow-hidden">
          <div className="bg-gradient-primary p-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Sheaves on Graphs: Opinion Dynamics
            </h1>
            <p className="text-white/90 text-lg">
              Interactive visualization of how private opinions can reach consensus through public discourse
            </p>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Simple Graph Section */}
              <div className="bg-muted/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-center mb-4 text-warning">
                  Simple Edge (1D Stalks)
                </h3>
                <div className="bg-background/50 rounded-lg p-4 mb-4">
                  <svg
                    ref={svg1Ref}
                    width="100%"
                    height="300"
                    viewBox="0 0 600 300"
                    className="w-full"
                  />
                </div>
                <div className="text-sm text-center opacity-80 space-y-1">
                  <p><strong>F(v):</strong> Private opinion spaces</p>
                  <p><strong>F(e):</strong> Public discourse space</p>
                </div>
              </div>

              {/* Complex Graph Section */}
              <div className="bg-muted/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-center mb-4 text-warning">
                  Complex Network (Multi-dimensional Stalks)
                </h3>
                <div className="bg-background/50 rounded-lg p-4 mb-4">
                  <svg
                    ref={svg2Ref}
                    width="100%"
                    height="300"
                    viewBox="0 0 600 300"
                    className="w-full"
                  />
                </div>
                <div className="text-sm text-center opacity-80 space-y-1">
                  <p><strong>Nodes:</strong> Individuals with multi-faceted opinions</p>
                  <p><strong>Edges:</strong> Shared discourse dimensions</p>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              <Button
                onClick={animateOpinionFlow}
                disabled={animationActive}
                className="bg-gradient-to-r from-destructive to-destructive/80 hover:from-destructive/90 hover:to-destructive/70"
              >
                Animate Opinion Flow
              </Button>
              <Button
                onClick={showConsensus}
                variant="secondary"
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                Show Consensus Formation
              </Button>
              <Button
                onClick={initializeGraphs}
                variant="outline"
              >
                Reset Views
              </Button>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-6 justify-center mb-8">
              <div className="flex items-center gap-2 bg-muted/30 px-4 py-2 rounded-full">
                <div className="w-5 h-5 rounded-full bg-accent border-2 border-background"></div>
                <span className="text-sm">Private Opinion Space (Vertex Stalk)</span>
              </div>
              <div className="flex items-center gap-2 bg-muted/30 px-4 py-2 rounded-full">
                <div className="w-5 h-5 rounded-full bg-primary border-2 border-background"></div>
                <span className="text-sm">Public Discourse Space (Edge Stalk)</span>
              </div>
              <div className="flex items-center gap-2 bg-muted/30 px-4 py-2 rounded-full">
                <div className="w-5 h-5 rounded-full bg-warning border-2 border-background"></div>
                <span className="text-sm">Consensus Opinion</span>
              </div>
            </div>

            {/* Explanation */}
            <div className="bg-muted/30 rounded-xl p-6 border-l-4 border-warning">
              <h3 className="text-xl font-bold text-warning mb-4">Mathematical Interpretation</h3>
              
              <div className="space-y-4 text-foreground/90">
                <p>
                  <strong>Sheaf Structure:</strong> A sheaf on a graph assigns vector spaces (stalks) to vertices and edges, with linear maps (restrictions) connecting them.
                </p>
                
                <div>
                  <p className="font-semibold mb-2">Opinion Dynamics Model:</p>
                  <ul className="space-y-2 list-disc list-inside ml-4">
                    <li><strong>Vertex Stalks F(v):</strong> Private opinion spaces where individuals hold complex, multi-dimensional views</li>
                    <li><strong>Edge Stalks F(e):</strong> Public discourse spaces where opinions are expressed and conformity pressures operate</li>
                    <li><strong>Restriction Maps:</strong> How private opinions are projected into public discourse</li>
                    <li><strong>Consensus:</strong> Global sections that satisfy local consistency conditions across all discourse spaces</li>
                  </ul>
                </div>
                
                <p>
                  <strong>Key Insight:</strong> Even when individuals have divergent private opinions, they can reach consensus in public discourse through the sheaf's consistency conditions, modeling how social conformity enables agreement despite underlying disagreement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SheavesOnGraphs;