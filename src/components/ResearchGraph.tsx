import { useCallback, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { researchNodes, researchEdges } from '@/data/researchContent';

interface ResearchGraphProps {
  onNodeClick: (nodeId: string) => void;
  activeNodeId: string;
}

const ResearchGraph = ({ onNodeClick, activeNodeId }: ResearchGraphProps) => {
  // Generate nodes with simpler, more reliable positioning
  // Normalize positions to work in a 0-800 x 0-500 coordinate system
  const initialNodes: Node[] = Object.values(researchNodes).map((node) => {
    const isCenter = node.isCenter || false;

    return {
      id: node.id,
      position: node.position,
      data: {
        label: node.title,
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
        fontSize: isCenter ? '13px' : '11px',
        fontWeight: 600,
        cursor: 'pointer',
        border: isCenter ? '3px solid' : '2px solid',
      },
    };
  });

  // Generate edges
  const initialEdges: Edge[] = researchEdges.map((edge, index) => ({
    id: `edge-${index}`,
    source: edge.source,
    target: edge.target,
    type: 'default',
    animated: false,
    style: {
      strokeWidth: 2,
    },
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update node styling based on active state
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        const nodeData = researchNodes[node.id];
        const isActive = node.id === activeNodeId;
        const isCenter = nodeData?.isCenter || false;

        return {
          ...node,
          className: isActive
            ? (isCenter ? 'research-node-center active' : 'research-node active')
            : (isCenter ? 'research-node-center' : 'research-node'),
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
  }, [activeNodeId, setNodes, setEdges]);

  // Handle node click
  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      onNodeClick(node.id);
    },
    [onNodeClick]
  );

  return (
    <div className="w-full min-h-[300px] aspect-[4/3] bg-background rounded-lg border border-border overflow-hidden">
      <style>{`
        @keyframes subtlePulse {
          0%, 100% {
            box-shadow: 0 4px 12px hsl(var(--primary) / 0.15);
          }
          50% {
            box-shadow: 0 4px 16px hsl(var(--primary) / 0.35);
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

        .research-node {
          background: hsl(var(--card));
          color: hsl(var(--foreground));
          border-color: hsl(var(--primary) / 0.3);
          transition: all 0.3s ease;
          animation: subtlePulse 2s ease-in-out infinite;
        }

        .research-node:hover {
          border-color: hsl(var(--primary) / 0.6);
          box-shadow: 0 4px 12px hsl(var(--primary) / 0.2);
          transform: scale(1.05);
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

        .research-node-center {
          background: hsl(var(--primary));
          color: white;
          border-color: hsl(var(--primary));
          box-shadow: 0 6px 16px hsl(var(--primary) / 0.3);
          transition: all 0.3s ease;
        }

        .research-node-center:hover {
          box-shadow: 0 8px 20px hsl(var(--primary) / 0.4);
          transform: scale(1.05);
        }

        .research-node-center.active {
          border-width: 4px;
          transform: scale(1.12);
          animation: activeCenterGlow 1.5s ease-in-out infinite;
          z-index: 100 !important;
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
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        fitView
        fitViewOptions={{ padding: 0.2, maxZoom: 1 }}
        minZoom={0.5}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        zoomOnScroll={true}
        panOnScroll={false}
        panOnDrag={true}
        preventScrolling={false}
      >
        <Panel position="top-right" className="text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
          Scroll to zoom
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default ResearchGraph;
