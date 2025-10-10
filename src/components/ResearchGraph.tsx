import { useCallback, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { researchNodes, researchEdges } from '@/data/researchContent';

interface ResearchGraphProps {
  onNodeClick: (nodeId: string) => void;
  activeNodeId: string;
}

const ResearchGraph = ({ onNodeClick, activeNodeId }: ResearchGraphProps) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Define node positions and styling
  const initialNodes: Node[] = [
    {
      id: 'overview',
      position: { x: 400, y: 300 },
      data: {
        label: (
          <div className="text-center">
            <div className="text-sm font-semibold">My Research</div>
            <div className="text-xs text-foreground/60">Click to explore</div>
          </div>
        ),
      },
      type: 'default',
      style: {
        background: 'hsl(var(--primary))',
        color: 'white',
        border: '3px solid hsl(var(--primary))',
        borderRadius: '50%',
        width: 120,
        height: 120,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontWeight: 600,
        boxShadow: '0 8px 16px hsl(var(--primary) / 0.3)',
        cursor: 'pointer',
      },
    },
    {
      id: 'graph-ml',
      position: { x: 400, y: 80 },
      data: {
        label: (
          <div className="text-center px-2">
            <div className="text-sm font-semibold">Graph ML</div>
          </div>
        ),
      },
      type: 'default',
      style: {
        background: 'hsl(var(--card))',
        border: '2px solid hsl(var(--primary) / 0.3)',
        borderRadius: '50%',
        width: 100,
        height: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      },
    },
    {
      id: 'network-science',
      position: { x: 180, y: 220 },
      data: {
        label: (
          <div className="text-center px-2">
            <div className="text-sm font-semibold">Network Science</div>
          </div>
        ),
      },
      type: 'default',
      style: {
        background: 'hsl(var(--card))',
        border: '2px solid hsl(var(--primary) / 0.3)',
        borderRadius: '50%',
        width: 100,
        height: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      },
    },
    {
      id: 'federated-learning',
      position: { x: 620, y: 220 },
      data: {
        label: (
          <div className="text-center px-2">
            <div className="text-sm font-semibold">Federated Learning</div>
          </div>
        ),
      },
      type: 'default',
      style: {
        background: 'hsl(var(--card))',
        border: '2px solid hsl(var(--primary) / 0.3)',
        borderRadius: '50%',
        width: 100,
        height: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      },
    },
    {
      id: 'applications',
      position: { x: 400, y: 480 },
      data: {
        label: (
          <div className="text-center px-2">
            <div className="text-sm font-semibold">Applications</div>
          </div>
        ),
      },
      type: 'default',
      style: {
        background: 'hsl(var(--card))',
        border: '2px solid hsl(var(--accent) / 0.3)',
        borderRadius: '50%',
        width: 90,
        height: 90,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      },
    },
  ];

  const initialEdges: Edge[] = researchEdges.map((edge, index) => ({
    id: `edge-${index}`,
    source: edge.source,
    target: edge.target,
    type: 'smoothstep',
    animated: false,
    style: {
      stroke: 'hsl(var(--primary) / 0.2)',
      strokeWidth: 2,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: 'hsl(var(--primary) / 0.3)',
      width: 20,
      height: 20,
    },
    label: edge.label,
    labelStyle: {
      fontSize: '10px',
      fill: 'hsl(var(--foreground) / 0.5)',
      fontWeight: 500,
    },
    labelBgStyle: {
      fill: 'hsl(var(--background))',
      fillOpacity: 0.8,
    },
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update node styling based on active and hover states
  const updateNodeStyles = useCallback((activeId: string, hoverId: string | null) => {
    setNodes((nds) =>
      nds.map((node) => {
        const isActive = node.id === activeId;
        const isHovered = node.id === hoverId;
        const isOverview = node.id === 'overview';

        let newStyle = { ...node.style };

        if (isActive) {
          newStyle = {
            ...newStyle,
            border: isOverview
              ? '4px solid hsl(var(--primary))'
              : '3px solid hsl(var(--primary))',
            boxShadow: '0 12px 24px hsl(var(--primary) / 0.4)',
            transform: 'scale(1.05)',
          };
        } else if (isHovered) {
          newStyle = {
            ...newStyle,
            border: isOverview
              ? '4px solid hsl(var(--primary) / 0.6)'
              : '3px solid hsl(var(--primary) / 0.5)',
            boxShadow: '0 8px 16px hsl(var(--primary) / 0.3)',
            transform: 'scale(1.02)',
          };
        } else {
          newStyle = {
            ...newStyle,
            border: isOverview
              ? '3px solid hsl(var(--primary))'
              : node.id === 'applications'
              ? '2px solid hsl(var(--accent) / 0.3)'
              : '2px solid hsl(var(--primary) / 0.3)',
            boxShadow: isOverview ? '0 8px 16px hsl(var(--primary) / 0.3)' : 'none',
            transform: 'scale(1)',
          };
        }

        return { ...node, style: newStyle };
      })
    );

    // Update edge styling
    setEdges((eds) =>
      eds.map((edge) => {
        const isConnectedToActive = edge.source === activeId || edge.target === activeId;
        const isConnectedToHover = hoverId && (edge.source === hoverId || edge.target === hoverId);

        return {
          ...edge,
          animated: isConnectedToActive,
          style: {
            ...edge.style,
            stroke: isConnectedToActive
              ? 'hsl(var(--primary) / 0.8)'
              : isConnectedToHover
              ? 'hsl(var(--primary) / 0.4)'
              : 'hsl(var(--primary) / 0.2)',
            strokeWidth: isConnectedToActive ? 3 : 2,
          },
        };
      })
    );
  }, [setNodes, setEdges]);

  // Handle node click
  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      onNodeClick(node.id);
    },
    [onNodeClick]
  );

  // Handle node hover
  const handleNodeMouseEnter = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      setHoveredNode(node.id);
    },
    []
  );

  const handleNodeMouseLeave = useCallback(() => {
    setHoveredNode(null);
  }, []);

  // Update styles when active node or hovered node changes
  useState(() => {
    updateNodeStyles(activeNodeId, hoveredNode);
  });

  // Re-run effect when activeNodeId or hoveredNode changes
  const _ = [activeNodeId, hoveredNode]; // Dependency tracker
  updateNodeStyles(activeNodeId, hoveredNode);

  return (
    <div className="w-full h-[600px] bg-muted/30 rounded-lg border border-border overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onNodeMouseEnter={handleNodeMouseEnter}
        onNodeMouseLeave={handleNodeMouseLeave}
        fitView
        minZoom={0.5}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnScroll={false}
        panOnScroll={false}
        panOnDrag={true}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="hsl(var(--primary) / 0.1)" />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
};

export default ResearchGraph;
