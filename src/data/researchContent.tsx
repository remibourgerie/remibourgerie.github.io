import { Brain, Network, Users, Compass } from 'lucide-react';
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
  position: GraphPosition;
  content: {
    paragraphs: JSX.Element[];
    personalInsight?: JSX.Element;
    applications?: string | string[];
    communityLinks?: Array<{
      title: string;
      description: string;
      url: string;
      icon?: LucideIcon;
    }>;
  };
}

export const researchNodes: Record<string, ResearchNode> = {
  overview: {
    id: 'overview',
    title: 'My Research',
    tagline: 'Networked Intelligence',
    icon: Compass,
    category: 'overview',
    isCenter: true,
    position: { x: 400, y: 250 },
    content: {
      paragraphs: [
        <>
          My research lies at the intersection of Machine Learning, graph, and networks, building systems that learn from connected data.
        </>,
      ],
      communityLinks: [
        {
          title: 'Join GLOW - Graph Learning on Wednesdays',
          description: 'Interested in graph learning? Join our weekly reading group where researchers discuss the latest papers and ideas in this field.',
          url: 'https://sites.google.com/view/graph-learning-on-weds/home-page?authuser=0',
          icon: Users,
        },
      ],
    },
  },

  'graph-ml': {
    id: 'graph-ml',
    title: 'Machine Learning on Graph-Structured Data',
    tagline: 'Where relations matter as much as data', // When learning meets relational structure. Learning in the presence of structure and dependency. Understanding the world through its connections.
    icon: Brain,
    category: 'core',
    position: { x: 400, y: 50 },
    content: {
      paragraphs: [
        <>
          Think about your friends on social media. You know people who know people, forming a web of relationships. Or consider how molecules work—atoms bonded together in specific patterns that determine whether something is medicine or poison. These are <strong>graphs</strong>: data where connections matter as much as the data points themselves.
        </>,
        <>
          The challenge? Most AI expects neat rows and columns, like a spreadsheet. But the real world is messy and interconnected. My research develops new ways for machines to learn from this interconnected reality—teaching them to understand not just individual pieces, but how everything fits together.
        </>,
      ],
      personalInsight: (
        <blockquote className="border-l-2 border-primary/30 pl-4 my-4">
          <p className="text-foreground/70 italic text-sm leading-relaxed">
            "What fascinates me is that current approaches, are based on the mechanism of <em>message passing</em> hit a fundamental wall. Nodes can only 'see' information from immediate neighbors, like trying to understand a city by only talking to people next door. I'm working on methods that let AI grasp both local patterns and global structure simultaneously."
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
    icon: Network,
    category: 'core',
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

  'federated-learning': {
    id: 'federated-learning',
    title: 'Collaborative & Federated Learning',
    tagline: 'Learning Together, Without Sharing Everything',
    icon: Users,
    category: 'core',
    position: { x: 650, y: 350 },
    content: {
      paragraphs: [
        <>
          Imagine three hospitals that want to build a better cancer detection AI. Each has valuable patient data, but they can't legally share it with each other. How do they collaborate? This is the puzzle I work on: teaching machines to learn together while keeping sensitive data private.
        </>,
        <>
          My research explores <strong>federated learning on graphs</strong>—using the network topology itself as a resource. Instead of sending all data to one place, I develop methods where nodes (hospitals, phones, organizations) share insights while keeping their data local. The connections between them become part of the solution.
        </>,
        <>
          During my master's thesis at <strong>Ericsson's AI Accelerator</strong>, I discovered how messy real-world collaboration can be: some nodes have tons of data, others have little; some are well-connected, others isolated. Making this work efficiently is both a technical and a design challenge.
        </>,
      ],
      personalInsight: (
        <blockquote className="border-l-2 border-primary/30 pl-4 my-4">
          <p className="text-foreground/70 italic text-sm leading-relaxed">
            "The challenge: How do we train powerful AI models when data can't leave its source? And how does the network structure between these sources affect learning? During my thesis at Ericsson, I saw this tension firsthand—powerful algorithms that couldn't work because data privacy walls made collaboration impossible."
          </p>
        </blockquote>
      ),
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
];
