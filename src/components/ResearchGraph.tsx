import { useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
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

  // Generate nodes dynamically from data
  const initialNodes: Node[] = Object.values(researchNodes).map((node) => {
    const Icon = node.icon;
    const isCenter = node.isCenter || false;

    return {
      id: node.id,
      position: node.position,
      data: {
        label: (
          <div className="text-center px-2">
            <div className={`${isCenter ? 'text-sm' : 'text-xs'} font-semibold`}>
              {node.title}
            </div>
          </div>
        ),
      },
      type: 'default',
      style: {
        background: isCenter ? 'hsl(var(--primary))' : 'hsl(var(--card))',
        color: isCenter ? 'white' : 'hsl(var(--foreground))',
        border: isCenter
          ? '3px solid hsl(var(--primary))'
          : '2px solid hsl(var(--primary) / 0.3)',
        borderRadius: '50%',
        width: isCenter ? 120 : 100,
        height: isCenter ? 120 : 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: isCenter ? '14px' : '12px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: isCenter ? '0 8px 16px hsl(var(--primary) / 0.3)' : 'none',
      },
    };
  });

  // Generate edges dynamically from data (no labels)
  const initialEdges: Edge[] = researchEdges.map((edge, index) => ({
    id: `edge-${index}`,
    source: edge.source,
    target: edge.target,
    type: 'straight',
    animated: false,
    style: {
      stroke: 'hsl(var(--primary) / 0.2)',
      strokeWidth: 2,
    },
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update node styling based on active and hover states
  const updateNodeStyles = useCallback((activeId: string, hoverId: string | null) => {
    setNodes((nds) =>
      nds.map((node) => {
        const nodeData = researchNodes[node.id];
        const isActive = node.id === activeId;
        const isHovered = node.id === hoverId;
        const isCenter = nodeData?.isCenter || false;

        let newStyle = { ...node.style };

        if (isActive) {
          newStyle = {
            ...newStyle,
            border: isCenter
              ? '4px solid hsl(var(--primary))'
              : '3px solid hsl(var(--primary))',
            boxShadow: '0 12px 24px hsl(var(--primary) / 0.4)',
            transform: 'scale(1.05)',
          };
        } else if (isHovered) {
          newStyle = {
            ...newStyle,
            border: isCenter
              ? '3px solid hsl(var(--primary))'
              : '2px solid hsl(var(--primary) / 0.5)',
            boxShadow: '0 8px 16px hsl(var(--primary) / 0.2)',
            transform: 'scale(1.02)',
          };
        } else {
          newStyle = {
            ...newStyle,
            border: isCenter
              ? '3px solid hsl(var(--primary))'
              : '2px solid hsl(var(--primary) / 0.3)',
            boxShadow: isCenter ? '0 8px 16px hsl(var(--primary) / 0.3)' : 'none',
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
              ? 'hsl(var(--primary) / 0.6)'
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
  useEffect(() => {
    updateNodeStyles(activeNodeId, hoveredNode);
  }, [activeNodeId, hoveredNode, updateNodeStyles]);

  return (
    <div className="w-full h-[500px] bg-muted/30 rounded-lg border border-border overflow-hidden">
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
