import { BrainCircuit, Waypoints, Users, Compass, GitMerge } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface GraphPosition {
  x: number;
  y: number;
}

export interface ResearchNode {
  id: string;
  title: string;
  tagline: string;
  icon: LucideIcon;
  category: 'overview' | 'core';
  isCenter?: boolean;
  hidden?: boolean;
  position: GraphPosition;
  content: {
    paragraphs: JSX.Element[];
    personalInsight?: JSX.Element;
    applications?: string | string[];
    communityLinks?: Array<{
      title: string;
      description: string;
      url?: string;
      nodeId?: string;
      icon?: LucideIcon;
    }>;
  };
}

export const researchNodes: Record<string, ResearchNode> = {
  overview: {
    id: 'overview',
    title: 'My Research',
    tagline: '',
    icon: Compass,
    category: 'overview',
    isCenter: true,
    position: { x: 400, y: 250 },
    content: {
      paragraphs: [
        <>
          My research lies at the intersection of <strong>Machine Learning</strong>, <strong>Graphs</strong> and <strong>networks</strong>, building systems that learn from connected data.
        </>,
      ],
      communityLinks: [
        {
          title: 'Join GLOW - Graph Learning on Wednesdays',
          description: 'Interested in graph learning? Join the monthly reading group where researchers discuss the latest papers and ideas in this field.',
          url: 'https://sites.google.com/view/graph-learning-on-weds/home-page?authuser=0',
          icon: Users,
        },
      ],
    },
  },

  'graph-ml': {
    id: 'graph-ml',
    title: 'Machine Learning on Graph-Structured Data',
    tagline: 'When geometry meets learning',
    icon: BrainCircuit,
    category: 'core',
    position: { x: 400, y: 50 },
    content: {
      paragraphs: [
        <>
          Think about your friends on social media. You know people who know people, forming a web of relationships. Or consider how molecules work—atoms bonded together in specific patterns that determine whether something is medicine or poison. These are <strong>graphs</strong>: data where connections matter as much as the data points themselves.
        </>,
        <>
          The challenge? The techniques behind breakthrough AI systems (vision models, language models) rely on data having regular, grid-like structure. These regularities let models exploit regular patterns efficiently. But graphs have no such structure. A single network can contain millions of irregular patterns overlapping and intertwining at different scales.
        </>,
      ],
      personalInsight: (
        <blockquote className="border-l-2 border-primary/30 pl-4 my-4">
          <p className="text-foreground/70 italic text-sm leading-relaxed">
            "What fascinates me is that current approaches, are based on the mechanism of <em>message passing</em> hit a fundamental wall. Nodes can only 'see' information from immediate neighbors, like trying to understand a city by only talking to people next door. Adding layers to see farther causes information to get compressed through bottlenecks and node features to become indistinguishable, limiting network depth and expressiveness."
          </p>
        </blockquote>
      ),
      applications: [
        'Drug discovery through molecular structure analysis',
        'Fraud detection in financial networks',
        'Social network-based content recommendation',
        'Traffic pattern prediction in transportation systems'
      ],
    },
  },

  'network-science': {
    id: 'network-science',
    title: 'Network Science & Topology',
    tagline: 'Why Network Shape Matters?',
    icon: Waypoints,
    category: 'core',
    hidden: true,
    position: { x: 150, y: 350 },
    content: {
      paragraphs: [
        <>
          Not all networks are created equal. Compare a highway system (few main routes, many branches) to the internet (highly interconnected mesh). Their different shapes fundamentally change how information, diseases, or even ideas flow through them. This is what network science studies: how structure shapes behavior.
        </>,
        <>
          My research investigates how these structural properties affect machine learning. Does your social network's clustering make recommendations harder or easier? Does the way telecommunication networks are organized impact how well AI can detect anomalies? These aren't just theoretical questions—they determine whether our methods work in practice.
        </>,
      ],
      personalInsight: (
        <blockquote className="border-l-2 border-primary/30 pl-4 my-4">
          <p className="text-foreground/70 italic text-sm leading-relaxed">
            "Working at Ericsson taught me that real networks rarely behave like the clean graphs in textbooks. They're messy, dynamic, and full of hidden patterns. A method that works beautifully on toy data can completely fail on real infrastructure—and understanding <em>why</em> is what drives this research."
          </p>
        </blockquote>
      ),
      applications: [
        'Telecommunications infrastructure optimization',
        'Epidemic spread prediction and intervention design',
        'Supply chain vulnerability analysis',
        'Power grid resilience improvement'
      ],
    },
  },

  'collaborative-graph-learning': {
    id: 'collaborative-graph-learning',
    title: 'Collaborative Learning on Graph Data',
    tagline: 'Distributed Learning Meets Network Structure',
    icon: GitMerge,
    category: 'core',
    hidden: true,
    position: { x: 400, y: 450 },
    content: {
      paragraphs: [
        <>
          What happens when you combine collaborative learning with graph-structured data? You get a powerful new paradigm where multiple entities can jointly learn from interconnected information while preserving privacy and leveraging network topology.
        </>,
        <>
          My research explores how graph neural networks can be trained in a federated manner across distributed nodes. This means each participant (a hospital, organization, or device) can contribute to learning a shared model without exposing their private graph data, while the network structure itself guides the collaboration.
        </>,
        <>
          The challenge is unique: unlike traditional federated learning where data points are independent, graph data has dependencies between nodes. How do we split a social network for training? How do we handle edges that cross organizational boundaries? These questions drive my current research.
        </>,
      ],
      personalInsight: (
        <blockquote className="border-l-2 border-primary/30 pl-4 my-4">
          <p className="text-foreground/70 italic text-sm leading-relaxed">
            "During my master's thesis at <strong>Ericsson's AI Accelerator</strong>,
            I discovered how messy real-world collaboration can be: some nodes have tons of data, others have little; some are well-connected, others isolated.
            Making this work efficiently is both a technical and a design challenge."
          </p>
        </blockquote>
      ),
      applications: [
        'Cross-hospital patient network analysis without data sharing',
        'Distributed fraud detection across financial institutions',
        'Privacy-preserving social network analysis',
        'Collaborative learning on knowledge graphs'
      ],
    },
  },

  'federated-learning': {
    id: 'federated-learning',
    title: 'Collaborative Learning',
    tagline: 'Learning Together, Without Sharing Everything',
    icon: Users,
    category: 'core',
    position: { x: 650, y: 350 },
    content: {
      paragraphs: [
        <>
          Imagine three hospitals that want to build a better cancer detection AI. Each has valuable patient data, but they can't legally share it with each other. How do they collaborate? This is the problem collaborative learning aims to solve, building systems that make agents collaborate while keeping sensitive data private to its holder.
        </>,
        <>
          <blockquote className="border-l-2 border-primary/30 pl-4 my-4">
            <p className="text-foreground/70 italic text-sm leading-relaxed">
              "<strong>So we have trained on the entire web, now what?</strong> To get real improvements and march forward, we really have to tap on new sources of data. That is data that belongs to entities like end users, smartphone users, patient data, institutional data. This captures nuances you would not find in open web data."
            </p>
            <footer className="text-xs text-foreground/60 mt-2">
              — Peter Kairouz, Google Research,{' '}
              <a
                href="https://www.youtube.com/watch?v=Xh89Kp4jM60"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                source
              </a>
            </footer>
          </blockquote>
        </>,
        <>
         My <strong>TMLR survey</strong> analyzes <strong>400+ papers</strong> on collaborative learning, from <em>Euclidean domains</em> (vision, language, time series) to <em>graph domains</em> (social networks, molecular systems, IoT). But graph domains introduce a fundamental challenge: graph neural networks rely on message passing, requiring nodes to exchange information not just during training but also during inference.  When graphs are distributed across agents, this becomes cross-agent communication, demanding continuous collaboration. I am the first to systematically characterize the resulting <strong>trilemma</strong> of <em>effectiveness</em>, <em>efficiency</em>, and <em>privacy</em>, providing a roadmap for practitioners navigating these constraints.
        </>,
      ],

      applications: [
        'Privacy-preserving healthcare AI',
        'Private smartphone keyboard predictions',
        'Collaborative fraud detection across banks',
        'Energy-efficient IoT device training'
      ],
    },
  },
};

// Graph structure: nodes and edges
export interface GraphEdge {
  source: string;
  target: string;
}

export const researchEdges: GraphEdge[] = [
  // Center connects to all main topics
  { source: 'overview', target: 'graph-ml' },
  { source: 'overview', target: 'network-science' },
  { source: 'overview', target: 'federated-learning' },
  // Collaborative Graph Learning connects to its parent topics
  { source: 'graph-ml', target: 'collaborative-graph-learning' },
  { source: 'federated-learning', target: 'collaborative-graph-learning' },
];
