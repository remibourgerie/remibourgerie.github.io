-- Create publications table
CREATE TABLE IF NOT EXISTS public.publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  authors TEXT[] NOT NULL,
  journal TEXT NOT NULL,
  year INTEGER NOT NULL,
  citations INTEGER DEFAULT 0,
  abstract TEXT NOT NULL,
  url TEXT,
  pdf_url TEXT,
  poster_url TEXT,
  code_url TEXT,
  tags TEXT[] DEFAULT '{}',
  publication_type TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (since this is a public portfolio website)
CREATE POLICY "Publications are publicly readable"
  ON public.publications
  FOR SELECT
  USING (true);

-- Insert the first publication
INSERT INTO public.publications (
  title,
  authors,
  journal,
  year,
  citations,
  abstract,
  url,
  pdf_url,
  tags,
  publication_type
) VALUES (
  'Fault Detection in Telecom Networks Using Bi-Level Federated Graph Neural Networks',
  ARRAY['Rémi Bourgerie', 'Tahar Zanouda'],
  '2023 IEEE International Conference on Data Mining Workshops (ICDMW) - The 2nd International Workshop on Federated Learning with Graph Data',
  2023,
  0,
  '5G and Beyond Networks become increasingly complex and heterogeneous, with diversified and high requirements from a wide variety of emerging applications. The complexity and diversity of Telecom networks place an increasing strain on maintenance and operation efforts. Moreover, the strict security and privacy requirements present a challenge for mobile operators to leverage network data. To detect network faults, and mitigate future failures, prior work focused on leveraging traditional ML/DL methods to locate anomalies in networks. The current approaches, although powerful, do not consider the intertwined nature of embedded and software-intensive Radio Access Network systems. In this paper, we propose a Bi-level Federated Graph Neural Network anomaly detection and diagnosis model that is able to detect anomalies in Telecom networks in a privacy-preserving manner, while minimizing communication costs. Our method revolves around conceptualizing Telecom data as a bi-level temporal Graph Neural Networks. The first graph captures the interactions between different RAN nodes that are exposed to different deployment scenarios in the network, while each individual Radio Access Network node is further elaborated into its software (SW) execution graph. Additionally, we use Federated Learning to address privacy and security limitations. Furthermore, we study the performance of anomaly detection model under three settings: (1) Centralized (2) Federated Learning and (3) Personalized Federated Learning using real-world data from an operational network. Our comprehensive experiments showed that Personalized Federated Temporal Graph Neural Networks method outperforms the most commonly used techniques for Anomaly Detection.',
  'https://ieeexplore.ieee.org/document/10449399/',
  'https://arxiv.org/abs/2311.14469',
  ARRAY['TelcoAI', 'Federated Learning', 'Graph Neural Networks', 'Graph-based Federated Learning', 'Anomaly Detection'],
  'Workshop paper'
);