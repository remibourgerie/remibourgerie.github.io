import { useCallback, useEffect, useRef, useMemo, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  Panel,
  NodeDragHandler,
  NodeTypes,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { researchNodes, researchEdges } from '@/data/researchContent';
import * as d3 from 'd3-force';
import ResearchNodeComponent from './ResearchNodeComponent';
import NodeConnectionAnimation from './NodeConnectionAnimation';

interface ResearchGraphProps {
  onNodeClick: (nodeId: string) => void;
  activeNodeId: string;
}

// Custom hook for force-directed layout
const useForceLayout = (initialNodes: Node[], initialEdges: Edge[]) => {
  const simulationRef = useRef<d3.Simulation<any, any> | null>(null);

  useEffect(() => {
    // Create simulation nodes with positions
    const simNodes = initialNodes.map(node => ({
      id: node.id,
      x: node.position.x,
      y: node.position.y,
      fx: researchNodes[node.id]?.isCenter ? 400 : null, // Fix center node X position
      fy: researchNodes[node.id]?.isCenter ? 250 : null, // Fix center node Y position
    }));

    // Create simulation links
    const simLinks = initialEdges.map(edge => ({
      source: edge.source,
      target: edge.target,
    }));

    // Create force simulation
    const simulation = d3.forceSimulation(simNodes)
      .force('link', d3.forceLink(simLinks)
        .id((d: any) => d.id)
        .distance(150) // Distance between connected nodes
        .strength(0.5)
      )
      .force('charge', d3.forceManyBody()
        .strength(-800) // Repulsion force (negative = repel)
      )
      .force('center', d3.forceCenter(400, 250)) // Center of the graph
      .force('collision', d3.forceCollide()
        .radius(80) // Collision radius (node size / 2 + padding)
      )
      .alphaDecay(0.02) // How quickly the simulation cools down
      .velocityDecay(0.3); // Friction

    simulationRef.current = simulation;

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [initialNodes.length, initialEdges.length]);

  return simulationRef;
};

const ResearchGraph = ({ onNodeClick, activeNodeId }: ResearchGraphProps) => {
  // Generate nodes with initial positioning (filter out hidden nodes)
  const initialNodes: Node[] = Object.values(researchNodes)
    .filter((node) => !node.hidden)
    .map((node) => {
      const isCenter = node.isCenter || false;

      return {
        id: node.id,
        type: 'custom',
        position: node.position, // Use as initial position
        data: {
          label: node.title,
          tagline: node.tagline,
          icon: node.icon,
          isCenter: isCenter,
        },
        className: isCenter ? 'research-node-center' : 'research-node',
        style: {
          width: isCenter ? 140 : 120,
          height: isCenter ? 140 : 120,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '10px',
          cursor: 'pointer',
          border: isCenter ? '3px solid' : '2px solid',
        },
      };
    });

  // Generate edges with smooth Bezier curves (filter out edges to hidden nodes)
  const initialEdges: Edge[] = researchEdges
    .filter((edge) => !researchNodes[edge.source]?.hidden && !researchNodes[edge.target]?.hidden)
    .map((edge, index) => ({
      id: `edge-${index}`,
      source: edge.source,
      target: edge.target,
      type: 'simplebezier',
      animated: false,
      style: {
        strokeWidth: 2,
        stroke: 'hsl(var(--primary) / 0.3)',
        strokeLinecap: 'round',
      },
    }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Animation state for connection line
  const [animatingFrom, setAnimatingFrom] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Dragging state to disable animations during drag
  const [isDragging, setIsDragging] = useState(false);

  // Initialize force simulation
  const simulationRef = useForceLayout(initialNodes, initialEdges);

  // Run the simulation and update node positions - ONLY on initial layout
  useEffect(() => {
    const simulation = simulationRef.current;
    if (!simulation) return;

    simulation.on('tick', () => {
      setNodes((nds) =>
        nds.map((node) => {
          const simNode = simulation.nodes().find((n: any) => n.id === node.id);
          if (simNode) {
            return {
              ...node,
              position: {
                x: simNode.x || node.position.x,
                y: simNode.y || node.position.y,
              },
            };
          }
          return node;
        })
      );
    });

    // Start the simulation for initial layout
    simulation.alpha(1).restart();

    // Stop simulation after it settles (about 1 second)
    const stopTimer = setTimeout(() => {
      simulation.stop();
    }, 1000);

    return () => clearTimeout(stopTimer);
  }, [simulationRef, setNodes]);

  // Update node styling based on active state and drag state
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        const nodeData = researchNodes[node.id];
        const isActive = node.id === activeNodeId;
        const isCenter = nodeData?.isCenter || false;

        let className = isCenter ? 'research-node-center' : 'research-node';
        if (isActive) className += ' active';
        if (isDragging) className += ' dragging';

        return {
          ...node,
          className,
        };
      })
    );

    // Keep edges static - no animation
    setEdges((eds) =>
      eds.map((edge) => {
        const isConnected = edge.source === activeNodeId || edge.target === activeNodeId;
        return {
          ...edge,
          animated: false,
          className: isConnected ? 'research-edge-active' : 'research-edge',
        };
      })
    );
  }, [activeNodeId, isDragging, setNodes, setEdges]);

  // Handle node click
  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      // Trigger connection animation
      const nodePosition = {
        x: node.position.x,
        y: node.position.y,
      };
      setAnimatingFrom(nodePosition);

      // Clear animation after completion
      setTimeout(() => setAnimatingFrom(null), 500);

      // Call parent's onClick handler
      onNodeClick(node.id);
    },
    [onNodeClick]
  );

  // Handle node drag start - Disable animations and update simulation state
  const onNodeDragStart: NodeDragHandler = useCallback((_event, node) => {
    setIsDragging(true);

    const simulation = simulationRef.current;
    if (!simulation) return;

    // Fix the dragged node's position in simulation
    const simNode = simulation.nodes().find((n: any) => n.id === node.id);
    if (simNode) {
      simNode.fx = simNode.x;
      simNode.fy = simNode.y;
    }
  }, [simulationRef]);

  // Handle node drag - Let ReactFlow handle updates natively
  const onNodeDrag: NodeDragHandler = useCallback((_event, node) => {
    const simulation = simulationRef.current;
    if (!simulation) return;

    // Update simulation node position (but don't restart simulation)
    const simNode = simulation.nodes().find((n: any) => n.id === node.id);
    if (simNode) {
      simNode.fx = node.position.x;
      simNode.fy = node.position.y;
      simNode.x = node.position.x;
      simNode.y = node.position.y;
    }
  }, [simulationRef]);

  // Handle node drag stop - Re-enable animations and brief physics adjustment
  const onNodeDragStop: NodeDragHandler = useCallback((_event, node) => {
    setIsDragging(false);

    const simulation = simulationRef.current;
    if (!simulation) return;

    // Update node positions in simulation from current ReactFlow positions
    setNodes((currentNodes) => {
      simulation.nodes().forEach((simNode: any) => {
        const rfNode = currentNodes.find(n => n.id === simNode.id);
        if (rfNode) {
          simNode.x = rfNode.position.x;
          simNode.y = rfNode.position.y;
        }
      });
      return currentNodes;
    });

    // Unfix the dragged node (unless it's center)
    const simNode = simulation.nodes().find((n: any) => n.id === node.id);
    if (simNode && !researchNodes[node.id]?.isCenter) {
      simNode.fx = null;
      simNode.fy = null;
    }

    // Physics adjustment for connected nodes with smoother settling
    simulation.alpha(0.5).restart();

    // Let simulation run longer for smoother settling (1000ms)
    setTimeout(() => {
      // Gradually reduce alpha for smooth stop
      simulation.alpha(0.1);
      setTimeout(() => simulation.stop(), 200);
    }, 800);
  }, [simulationRef, setNodes]);

  // Define custom node types
  const nodeTypes: NodeTypes = useMemo(() => ({
    custom: ResearchNodeComponent,
  }), []);

  return (
    <div
      ref={containerRef}
      className="w-full min-h-[300px] aspect-[4/3] bg-background rounded-lg border border-border overflow-hidden relative"
    >
      {/* Connection animation overlay */}
      {animatingFrom && containerRef.current && (
        <NodeConnectionAnimation
          startPos={animatingFrom}
          endX={containerRef.current.offsetWidth}
          onComplete={() => setAnimatingFrom(null)}
        />
      )}

      <style>{`
        @keyframes subtlePulse {
          0%, 100% {
            box-shadow: 0 4px 12px hsl(var(--primary) / 0.15);
          }
          50% {
            box-shadow: 0 6px 20px hsl(var(--primary) / 0.4);
          }
        }

        @keyframes activeGlow {
          0%, 100% {
            box-shadow:
              0 0 0 0 hsl(var(--primary) / 0.4),
              0 12px 32px hsl(var(--primary) / 0.4);
          }
          50% {
            box-shadow:
              0 0 0 8px hsl(var(--primary) / 0),
              0 12px 32px hsl(var(--primary) / 0.6);
          }
        }

        @keyframes activeCenterGlow {
          0%, 100% {
            box-shadow:
              0 0 0 0 hsl(var(--primary) / 0.5),
              0 14px 36px hsl(var(--primary) / 0.5);
          }
          50% {
            box-shadow:
              0 0 0 10px hsl(var(--primary) / 0),
              0 14px 36px hsl(var(--primary) / 0.7);
          }
        }

        @keyframes centerPulse {
          0%, 100% {
            box-shadow: 0 6px 16px hsl(var(--primary) / 0.3);
          }
          50% {
            box-shadow: 0 8px 24px hsl(var(--primary) / 0.5);
          }
        }

        .research-node {
          background: hsl(var(--card));
          color: hsl(var(--foreground));
          border-color: hsl(var(--primary) / 0.3);
          transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
          animation: subtlePulse 2.5s ease-in-out infinite;
        }

        .research-node:hover {
          border-color: hsl(var(--primary) / 0.6);
          box-shadow: 0 4px 12px hsl(var(--primary) / 0.2);
          transform: scale(1.05);
          transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
          animation: none;
        }

        .research-node.active {
          border-color: hsl(var(--primary));
          border-width: 3px;
          background: hsl(var(--card));
          transform: scale(1.12);
          animation: activeGlow 1.5s ease-in-out infinite;
          z-index: 100 !important;
        }

        .research-node.dragging {
          animation: none !important;
          transition: none !important;
        }

        .research-node-center {
          background: hsl(var(--primary));
          color: white;
          border-color: hsl(var(--primary));
          box-shadow: 0 6px 16px hsl(var(--primary) / 0.3);
          transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
          animation: centerPulse 2.5s ease-in-out infinite;
        }

        .research-node-center:hover {
          box-shadow: 0 8px 20px hsl(var(--primary) / 0.4);
          transform: scale(1.05);
          transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
        }

        .research-node-center.active {
          border-width: 4px;
          transform: scale(1.12);
          animation: activeCenterGlow 1.5s ease-in-out infinite;
          z-index: 100 !important;
        }

        .research-node-center.dragging {
          animation: none !important;
          transition: none !important;
        }

        .research-edge {
          stroke: hsl(var(--primary) / 0.2);
        }

        .research-edge-active {
          stroke: hsl(var(--primary) / 0.6);
          stroke-width: 3px;
        }

        .react-flow__node {
          z-index: 10;
        }

        .react-flow__edge {
          z-index: 5;
        }
      `}</style>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onNodeDragStart={onNodeDragStart}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        fitView
        fitViewOptions={{ padding: 0.2, maxZoom: 1 }}
        minZoom={0.5}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
        zoomOnScroll={true}
        panOnScroll={false}
        panOnDrag={true}
        preventScrolling={false}
        proOptions={{ hideAttribution: true }}
      >
        <Panel position="top-right" className="text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
          Scroll to zoom • Drag nodes to reposition
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default ResearchGraph;
