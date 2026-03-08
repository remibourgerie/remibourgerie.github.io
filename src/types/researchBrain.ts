export interface ResearchBrainData {
  meta: {
    generatedAt: string;
    totalPapers: number;
    totalCollections: number;
    totalNodes: number;
    timeRange: { start: string; end: string };
    timeSteps: number;
  };
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface GraphNode {
  id: string;
  type: 'category' | 'collection' | 'paper';
  label?: string;
  title?: string;
  authors?: string[];
  dateAdded?: string;
  year?: number;
  abstract?: string;
  url?: string;
  category: string;
  color: string;
  paperCount?: number;
  depth: number;
  timeStep: number;
  isOwn?: boolean;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: 'hierarchy' | 'contains';
}

// D3-force simulation node
export interface SimNode {
  id: string;
  nodeData: GraphNode;
  radius: number;
  appearScale: number;
  appearProgress: number;
  glowIntensity: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface SimLink {
  source: string | SimNode;
  target: string | SimNode;
  edgeType: 'hierarchy' | 'contains';
}
