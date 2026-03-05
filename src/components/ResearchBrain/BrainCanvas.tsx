import { useRef, useEffect, useCallback } from 'react';
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  forceRadial,
  type Simulation,
  type SimulationLinkDatum,
} from 'd3-force';
import type {
  ResearchBrainData,
  GraphNode,
  SimNode,
  SimLink,
} from '@/types/researchBrain';

const CATEGORY_COLORS: Record<string, string> = {
  'Graph Learning': '#283593',         // indigo-800 (darkest)
  'Federated Learning': '#3F51B5',     // indigo-600 (mid)
  'Decentralized Learning': '#5C6BC0', // indigo-400 (lightest)
};
const DEFAULT_COLOR = '#7986CB';
const OWN_PAPER_COLOR = '#673AB7'; // purple accent for user's papers

// Fixed triangle positions for category nodes (offsets from center)
// Graph Learning top-center (largest), FL bottom-left, DL bottom-right
const CATEGORY_POSITIONS: Record<string, { dx: number; dy: number }> = {
  'Graph Learning': { dx: 0, dy: -0.3 },
  'Federated Learning': { dx: -0.35, dy: 0.25 },
  'Decentralized Learning': { dx: 0.35, dy: 0.25 },
};

function getColor(node: GraphNode): string {
  if (node.type === 'paper' && node.isOwn) return OWN_PAPER_COLOR;
  return CATEGORY_COLORS[node.category] || node.color || DEFAULT_COLOR;
}

function getRadius(node: GraphNode, visiblePapers?: number): number {
  if (node.type === 'category') return 12;
  if (node.type === 'collection') {
    const pc = visiblePapers ?? 0;
    return 3 + Math.log2(1 + pc) * 1.8;
  }
  return node.isOwn ? 3.5 : 2;
}

interface BrainCanvasProps {
  data: ResearchBrainData;
  currentStep: number;
  isRestarting: boolean;
  width: number;
  height: number;
  onHover: (info: { node?: GraphNode; x: number; y: number } | null) => void;
  onClick: (node?: GraphNode) => void;
}

export default function BrainCanvas({
  data,
  currentStep,
  isRestarting,
  width,
  height,
  onHover,
  onClick,
}: BrainCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simRef = useRef<Simulation<SimNode, SimLink> | null>(null);
  const simNodesRef = useRef<SimNode[]>([]);
  const simLinksRef = useRef<SimLink[]>([]);
  const rafRef = useRef<number>(0);
  const prevStepRef = useRef(-1);
  const nodeMapRef = useRef<Map<string, SimNode>>(new Map());

  // Build SimNodes for all nodes, but only add to simulation incrementally
  const allSimNodesRef = useRef<Map<string, SimNode>>(new Map());
  const edgesByStepRef = useRef<Map<number, { source: string; target: string; edgeType: 'hierarchy' | 'contains' }[]>>(new Map());
  // Track visible paper count per collection for dynamic sizing
  const collectionPaperCountRef = useRef<Map<string, number>>(new Map());

  // Pre-build all SimNode objects on data load
  useEffect(() => {
    const allNodes = new Map<string, SimNode>();
    for (const node of data.nodes) {
      allNodes.set(node.id, {
        id: node.id,
        nodeData: node,
        radius: getRadius(node),
        appearScale: 0,
        appearProgress: 0,
        glowIntensity: 0,
      });
    }
    allSimNodesRef.current = allNodes;

    // Group edges by the timeStep of their target node
    const edgeMap = new Map<number, { source: string; target: string; edgeType: 'hierarchy' | 'contains' }[]>();
    const nodeTimeSteps = new Map<string, number>();
    for (const node of data.nodes) {
      nodeTimeSteps.set(node.id, node.timeStep);
    }
    for (const edge of data.edges) {
      const targetStep = nodeTimeSteps.get(edge.target) ?? 0;
      if (!edgeMap.has(targetStep)) edgeMap.set(targetStep, []);
      edgeMap.get(targetStep)!.push({
        source: edge.source,
        target: edge.target,
        edgeType: edge.type,
      });
    }
    edgesByStepRef.current = edgeMap;
  }, [data]);

  const initSim = useCallback(() => {
    simRef.current?.stop();
    simNodesRef.current = [];
    simLinksRef.current = [];
    nodeMapRef.current = new Map();
    collectionPaperCountRef.current = new Map();

    // Reset all SimNode states
    for (const simNode of allSimNodesRef.current.values()) {
      simNode.appearScale = 0;
      simNode.appearProgress = 0;
      simNode.glowIntensity = 0;
      simNode.x = undefined;
      simNode.y = undefined;
      simNode.vx = undefined;
      simNode.vy = undefined;
      simNode.fx = undefined;
      simNode.fy = undefined;
    }

    const sim = forceSimulation<SimNode>(simNodesRef.current)
      .force('link', forceLink<SimNode, SimulationLinkDatum<SimNode>>()
        .id(d => d.id)
        .distance(d => {
          const link = d as unknown as SimLink;
          return link.edgeType === 'hierarchy' ? 40 : 25;
        })
        .strength(d => {
          const link = d as unknown as SimLink;
          return link.edgeType === 'hierarchy' ? 0.4 : 0.2;
        }))
      .force('charge', forceManyBody<SimNode>()
        .strength(d => {
          if (d.nodeData.type === 'category') return -200;
          if (d.nodeData.type === 'collection') return -30 - (d.nodeData.paperCount ?? 0) * 0.5;
          return -3;
        }))
      .force('center', forceCenter(width / 2, height / 2).strength(0.02))
      .force('collide', forceCollide<SimNode>()
        .radius(d => d.radius + 2)
        .strength(0.5))
      .alphaDecay(0.006)
      .velocityDecay(0.35)
      .on('tick', () => {});

    // Radial force — soft circular containment
    const maxRadius = Math.min(width, height) / 2 - 30;
    sim.force('radial', forceRadial<SimNode>(maxRadius * 0.5, width / 2, height / 2)
      .strength(d => {
        const cx = width / 2, cy = height / 2;
        const dx = (d.x ?? cx) - cx, dy = (d.y ?? cy) - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > maxRadius * 0.6) return 0.12;
        return 0;
      }));

    simRef.current = sim;
    prevStepRef.current = -1;
  }, [width, height]);

  useEffect(() => {
    initSim();
    return () => {
      simRef.current?.stop();
      cancelAnimationFrame(rafRef.current);
    };
  }, [initSim]);

  useEffect(() => {
    if (isRestarting) initSim();
  }, [isRestarting, initSim]);

  // Add nodes when currentStep advances
  useEffect(() => {
    const sim = simRef.current;
    if (!sim || currentStep <= prevStepRef.current) return;

    let addedAny = false;

    // Helper: ensure a collection/category node is in the simulation,
    // recursively adding its parent chain if needed
    const ensureNode = (nodeId: string) => {
      if (nodeMapRef.current.has(nodeId)) return;
      const simNode = allSimNodesRef.current.get(nodeId);
      if (!simNode) return;

      // First ensure parent exists
      const parentEdge = data.edges.find(e => e.target === nodeId);
      if (parentEdge) ensureNode(parentEdge.source);

      const parent = parentEdge ? nodeMapRef.current.get(parentEdge.source) : null;
      const px = parent?.x ?? width / 2;
      const py = parent?.y ?? height / 2;

      // Place category nodes at triangle positions (initial only, not pinned)
      const catPos = simNode.nodeData.type === 'category'
        ? CATEGORY_POSITIONS[simNode.nodeData.label ?? '']
        : null;
      if (catPos) {
        simNode.x = width / 2 + catPos.dx * width;
        simNode.y = height / 2 + catPos.dy * height;
      } else {
        simNode.x = px + (Math.random() - 0.5) * 40;
        simNode.y = py + (Math.random() - 0.5) * 40;
      }
      simNode.appearScale = 0;
      simNode.appearProgress = 0;
      simNode.glowIntensity = 0.6;

      simNodesRef.current.push(simNode);
      nodeMapRef.current.set(nodeId, simNode);
      addedAny = true;

      // Add hierarchy edge to parent
      if (parentEdge && nodeMapRef.current.has(parentEdge.source)) {
        simLinksRef.current.push({
          source: parentEdge.source,
          target: nodeId,
          edgeType: 'hierarchy',
        });
      }
    };

    for (let step = prevStepRef.current + 1; step <= currentStep; step++) {
      // Only add paper nodes at their scheduled timeStep
      for (const node of data.nodes) {
        if (node.timeStep !== step || node.type !== 'paper') continue;
        const simNode = allSimNodesRef.current.get(node.id);
        if (!simNode || nodeMapRef.current.has(node.id)) continue;

        // Find ALL parent collections and ensure they exist
        const parentEdges = data.edges.filter(e => e.target === node.id && e.type === 'contains');
        for (const pe of parentEdges) ensureNode(pe.source);

        // Position near the first parent
        const firstParent = parentEdges.length > 0 ? nodeMapRef.current.get(parentEdges[0].source) : null;
        const px = firstParent?.x ?? width / 2;
        const py = firstParent?.y ?? height / 2;

        simNode.x = px + (Math.random() - 0.5) * 40;
        simNode.y = py + (Math.random() - 0.5) * 40;
        simNode.appearScale = 0;
        simNode.appearProgress = 0;
        simNode.glowIntensity = 1;

        simNodesRef.current.push(simNode);
        nodeMapRef.current.set(node.id, simNode);
        addedAny = true;

        // Add contains edges to ALL parent collections and update their radii
        for (const pe of parentEdges) {
          if (nodeMapRef.current.has(pe.source)) {
            simLinksRef.current.push({
              source: pe.source,
              target: node.id,
              edgeType: 'contains',
            });
            const parentSimNode = nodeMapRef.current.get(pe.source);
            if (parentSimNode && parentSimNode.nodeData.type !== 'paper') {
              const count = (collectionPaperCountRef.current.get(pe.source) ?? 0) + 1;
              collectionPaperCountRef.current.set(pe.source, count);
              parentSimNode.radius = getRadius(parentSimNode.nodeData, count);
            }
          }
        }
      }
    }

    if (addedAny) {
      sim.nodes(simNodesRef.current);
      const linkForce = sim.force('link') as ReturnType<typeof forceLink<SimNode, SimulationLinkDatum<SimNode>>> | undefined;
      if (linkForce) {
        linkForce.links(simLinksRef.current as SimulationLinkDatum<SimNode>[]);
      }
      sim.alpha(Math.min(0.5, 0.1 + simNodesRef.current.length * 0.0003)).restart();
    }

    prevStepRef.current = currentStep;
  }, [currentStep, data, width, height]);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    function render() {
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.scale(dpr, dpr);
      ctx!.clearRect(0, 0, width, height);

      const nodes = simNodesRef.current;
      const links = simLinksRef.current;

      // Update animations — ease-out-back for size pulse
      for (const n of nodes) {
        if (n.appearProgress < 1) {
          n.appearProgress = Math.min(1, n.appearProgress + 0.04);
          const t = n.appearProgress;
          const c1 = 1.70158;
          const c3 = c1 + 1;
          n.appearScale = 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
        }
        if (n.glowIntensity > 0) n.glowIntensity = Math.max(0, n.glowIntensity - 0.012);
      }

      // Draw edges
      ctx!.globalAlpha = 0.12;
      ctx!.strokeStyle = '#94a3b8';
      ctx!.lineWidth = 0.5;
      for (const link of links) {
        const src = typeof link.source === 'string' ? nodeMapRef.current.get(link.source) : link.source;
        const tgt = typeof link.target === 'string' ? nodeMapRef.current.get(link.target) : link.target;
        if (!src || !tgt || src.x == null || src.y == null || tgt.x == null || tgt.y == null) continue;
        if (src.appearScale < 0.3 || tgt.appearScale < 0.3) continue;

        ctx!.beginPath();
        ctx!.moveTo(src.x, src.y);
        ctx!.lineTo(tgt.x, tgt.y);

        if (link.edgeType === 'hierarchy') {
          ctx!.lineWidth = 0.6;
          ctx!.globalAlpha = 0.15;
        } else {
          ctx!.lineWidth = 0.5;
          ctx!.globalAlpha = 0.12;
        }
        ctx!.stroke();
      }
      ctx!.globalAlpha = 1;

      // Draw nodes (papers first, then collections on top)
      const papers = nodes.filter(n => n.nodeData.type === 'paper');
      const collections = nodes.filter(n => n.nodeData.type !== 'paper');

      // Papers
      for (const n of papers) {
        if (n.appearScale <= 0 || n.x == null || n.y == null) continue;
        const r = n.radius * n.appearScale;
        const color = getColor(n.nodeData);

        if (n.glowIntensity > 0.01) {
          ctx!.save();
          ctx!.globalAlpha = n.glowIntensity * 0.3;
          ctx!.shadowColor = color;
          ctx!.shadowBlur = 10 * n.glowIntensity;
          ctx!.beginPath();
          ctx!.arc(n.x, n.y, r + 4 * n.glowIntensity, 0, Math.PI * 2);
          ctx!.fillStyle = color;
          ctx!.fill();
          ctx!.restore();
        }

        ctx!.beginPath();
        ctx!.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx!.fillStyle = color;
        ctx!.globalAlpha = 0.7;
        ctx!.fill();
        ctx!.globalAlpha = 1;
      }

      // Collections & categories
      for (const n of collections) {
        if (n.appearScale <= 0 || n.x == null || n.y == null) continue;
        const r = n.radius * n.appearScale;
        const color = getColor(n.nodeData);

        // Glow
        if (n.glowIntensity > 0.01) {
          ctx!.save();
          ctx!.globalAlpha = n.glowIntensity * 0.25;
          ctx!.shadowColor = color;
          ctx!.shadowBlur = 15 * n.glowIntensity;
          ctx!.beginPath();
          ctx!.arc(n.x, n.y, r + 5, 0, Math.PI * 2);
          ctx!.fillStyle = color;
          ctx!.fill();
          ctx!.restore();
        }

        // Fill
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx!.fillStyle = color;
        ctx!.globalAlpha = n.nodeData.type === 'category' ? 0.9 : 0.6;
        ctx!.fill();
        ctx!.globalAlpha = 1;

        // Stroke
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx!.strokeStyle = color;
        ctx!.lineWidth = n.nodeData.type === 'category' ? 2 : 1;
        ctx!.globalAlpha = 0.5;
        ctx!.stroke();
        ctx!.globalAlpha = 1;

        // Label for categories and larger collections
        const label = n.nodeData.label ?? '';
        if (label && (n.nodeData.type === 'category' || r > 10)) {
          const fontSize = n.nodeData.type === 'category' ? 12 : 9;
          ctx!.font = `600 ${fontSize}px Inter, system-ui, sans-serif`;
          ctx!.textAlign = 'center';
          ctx!.textBaseline = 'middle';
          ctx!.fillStyle = '#334155';
          ctx!.globalAlpha = 0.8;
          ctx!.fillText(label, n.x, n.y - r - 8);
          ctx!.globalAlpha = 1;
        }
      }

      rafRef.current = requestAnimationFrame(render);
    }

    rafRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafRef.current);
  }, [width, height]);

  // Hit testing
  const hitTest = useCallback(
    (sx: number, sy: number) => {
      const nodes = simNodesRef.current;
      // Check collections first (bigger targets)
      for (let i = nodes.length - 1; i >= 0; i--) {
        const n = nodes[i];
        if (n.nodeData.type === 'paper' || n.x == null || n.y == null || n.appearScale < 0.5) continue;
        const dist = Math.sqrt((sx - n.x) ** 2 + (sy - n.y) ** 2);
        if (dist <= n.radius + 6) return { node: n.nodeData };
      }
      // Then papers
      for (let i = nodes.length - 1; i >= 0; i--) {
        const n = nodes[i];
        if (n.nodeData.type !== 'paper' || n.x == null || n.y == null || n.appearScale < 0.5) continue;
        const dist = Math.sqrt((sx - n.x) ** 2 + (sy - n.y) ** 2);
        if (dist <= n.radius + 4) return { node: n.nodeData };
      }
      return null;
    },
    []
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const hit = hitTest(sx, sy);

      if (hit) {
        onHover({ node: hit.node, x: sx, y: sy });
        (canvasRef.current as HTMLCanvasElement).style.cursor = 'pointer';
      } else {
        onHover(null);
        (canvasRef.current as HTMLCanvasElement).style.cursor = 'default';
      }
    },
    [hitTest, onHover]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const hit = hitTest(sx, sy);
      if (hit) onClick(hit.node);
    },
    [hitTest, onClick]
  );

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height }}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      onMouseLeave={() => onHover(null)}
    />
  );
}
