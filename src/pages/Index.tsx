import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Github, Linkedin, Mail, ExternalLink, BookOpen, Briefcase, Brain, Users, Network, ArrowDown, MapPin, GraduationCap, Music, History } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import Header from '@/components/Header';
import EnhancedGraphVisualization from '@/components/EnhancedGraphVisualization';
import ExpandableResearchItem from '@/components/ExpandableResearchItem';
import NewsletterSubscription from '@/components/NewsletterSubscription';
import ResearchPaper from '@/components/ResearchPaper';
import PublicationManager from '@/components/PublicationManager';
import ProjectCard from '@/components/ProjectCard';
import LinkedInPost from '@/components/LinkedInPost';
import InfoCard from '@/components/InfoCard';
import heroImage from '@/assets/hero-graph.jpg';

const Index = () => {
  const heroRef = useScrollAnimation();
  const aboutRef = useScrollAnimation();
  const papersRef = useScrollAnimation();
  const projectsRef = useScrollAnimation();
  const postsRef = useScrollAnimation();

  // Mock data - replace with real data integration

  const projects = [
    {
      title: "GraphLearn Toolkit",
      description: "An open-source Python library for graph neural network research, featuring implementations of state-of-the-art GNN architectures and evaluation benchmarks.",
      technologies: ["Python", "PyTorch", "NetworkX", "Scikit-learn"],
      githubUrl: "https://github.com",
      stars: 234
    },
    {
      title: "Neural Citation Explorer",
      description: "Interactive web application for exploring citation networks using graph neural networks to recommend related papers and identify research trends.",
      technologies: ["React", "D3.js", "FastAPI", "Neo4j"],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      stars: 89
    },
    {
      title: "GNN Benchmark Suite",
      description: "Comprehensive benchmarking framework for evaluating graph neural networks across various datasets and tasks with standardized metrics.",
      technologies: ["Python", "Docker", "MLflow", "PostgreSQL"],
      githubUrl: "https://github.com",
      stars: 156
    }
  ];

  const linkedinPosts = [
    {
      content: "Excited to share that our paper on hierarchical graph pooling has been accepted at NeurIPS 2023! 🎉\n\nThis work addresses one of the key challenges in graph neural networks: scalability. By introducing a novel hierarchical pooling mechanism, we can now apply GNNs to graphs with millions of nodes while maintaining representation quality.\n\nGrateful to my amazing collaborators and looking forward to presenting at the conference. The future of graph learning is bright! 🚀\n\n#GraphNeuralNetworks #MachineLearning #Research #NeurIPS2023",
      date: "2 weeks ago",
      likes: 127,
      comments: 23,
      shares: 15,
      url: "https://linkedin.com/in/remi-bourgerie"
    },
    {
      content: "Just finished implementing a new attention mechanism for graph neural networks that captures both local neighborhood and global graph structure. 🧠\n\nEarly results are promising - we're seeing 15-20% improvement on node classification tasks across multiple benchmarks. The key insight is that nodes need context at different scales to be properly understood.\n\nCode will be open-sourced soon! Always excited to contribute to the #OpenScience community.\n\n#GraphML #AI #Research #OpenSource",
      date: "1 month ago", 
      likes: 89,
      comments: 12,
      shares: 8,
      url: "https://linkedin.com/in/remi-bourgerie"
    }
  ];

  const scrollToResearch = () => {
    const element = document.getElementById('research');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
         <div 
           className="absolute inset-0 bg-cover bg-no-repeat"
           style={{ 
             backgroundImage: `url(${heroImage})`,
             filter: 'blur(2px)',
             transform: 'scale(1.1)',
             backgroundPosition: 'center 0%'
           }}
         >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        {/* Enhanced Moving Graph Background */}
        <div className="absolute inset-0 overflow-hidden">
          <EnhancedGraphVisualization 
            width={1920} 
            height={1080} 
            nodes={35} 
            className="absolute top-0 left-0 opacity-25" 
            enableExtendedEffects={true}
          />
        </div>
        

        <div 
          ref={heroRef.ref}
          className={`relative z-10 text-center max-w-4xl mx-auto px-6 transition-all duration-1000 ease-out ${
            heroRef.isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-12'
          }`}
        >
          {/* Name */}
          <div className="flex justify-center">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-2xl leading-tight mb-8 text-center">
              Rémi Bourgerie
            </h1>
          </div>
          
          {/* Badge Row */}
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <Badge className="bg-primary/20 text-white border-primary/30 hover:bg-primary/30 text-base px-4 py-2 backdrop-blur-md">
              <MapPin className="w-4 h-4 mr-2" />
              Stockholm
            </Badge>
            <Badge className="bg-primary/20 text-white border-primary/30 hover:bg-primary/30 text-base px-4 py-2 backdrop-blur-md">
              <GraduationCap className="w-4 h-4 mr-2" />
              PhD Student
            </Badge>
            <Badge className="bg-primary/20 text-white border-primary/30 hover:bg-primary/30 text-base px-4 py-2 backdrop-blur-md">
              <Brain className="w-4 h-4 mr-2" />
              Graph ML
            </Badge>
          </div>
          
          {/* Learn More Button */}
          <div className="mb-8">
            <Button 
              size="lg" 
              onClick={scrollToResearch}
              className="bg-primary hover:bg-primary-dark shadow-material-3 text-lg px-8 py-3 rounded-full"
            >
              Learn more about my research
              <ArrowDown className="w-5 h-5 ml-2" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <Button variant="outline" size="sm" className="border-white/50 hover:bg-white/20 text-white backdrop-blur-sm bg-white/10" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </a>
            </Button>
            <Button variant="outline" size="sm" className="border-white/50 hover:bg-white/20 text-white backdrop-blur-sm bg-white/10" asChild>
              <a href="https://www.linkedin.com/in/remi-bourgerie/" target="_blank" rel="noopener noreferrer">
                <Linkedin className="w-4 h-4 mr-2" />
                LinkedIn
              </a>
            </Button>
            <Button variant="outline" size="sm" className="border-white/50 hover:bg-white/20 text-white backdrop-blur-sm bg-white/10" asChild>
              <a href="https://scholar.google.com/citations?user=T3J6BMcAAAAJ&hl=en" target="_blank" rel="noopener noreferrer">
                <BookOpen className="w-4 h-4 mr-2" />
                Google Scholar
              </a>
            </Button>
            <Button variant="outline" size="sm" className="border-white/50 hover:bg-white/20 text-white backdrop-blur-sm bg-white/10" asChild>
              <a href="mailto:remibo@kth.se">
                <Mail className="w-4 h-4 mr-2" />
                Contact
              </a>
            </Button>
            <Button variant="outline" size="sm" className="border-white/50 hover:bg-white/20 text-white backdrop-blur-sm bg-white/10">
              <Download className="w-4 h-4 mr-2" />
              Download CV
            </Button>
          </div>

          <div className="flex justify-center">
            <EnhancedGraphVisualization width={200} height={150} nodes={15} className="opacity-50" />
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section id="about" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div 
            ref={aboutRef.ref}
            className={`text-center mb-16 transition-all duration-700 ease-out ${
              aboutRef.isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-4xl font-bold mb-6 text-foreground">About Me</h2>
            <p className="text-lg text-foreground/70 max-w-3xl mx-auto leading-relaxed">
              I am PhD student in Computer Sciences at the division of Network and System Engineering (NSE). 
              My work is supervised by Viktoria Fodor (main supervisor) and Sarunas Girdzijauskas (assistant supervisor). 
              My research interest lies at the intersection of Network and Machine Learning, with a current focus on the applications of Graph Neural Networks.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {/* Profile Photo Placeholder */}
              <div className="w-64 h-64 bg-gradient-primary rounded-2xl mx-auto md:mx-0 shadow-material-3 flex items-center justify-center">
                <div className="text-white text-6xl font-bold">RB</div>
              </div>
            </div>
            
            <div className="space-y-6">
              <InfoCard icon={MapPin} title="Location" timeline="2020 - Present">
                <p>Stockholm, Sweden</p>
              </InfoCard>
              
              <InfoCard icon={BookOpen} title="Education" timeline="2015 - 2019">
                <div className="space-y-1">
                  <p><strong>MSc in General Engineering</strong>, Ecole Centrale de Lyon (ECL), 2019</p>
                  <p><strong>MSc thesis</strong> at Ericsson AB, Global AI Accelerator</p>
                  <p>Thesis publication: <a href="https://arxiv.org/pdf/2311.14469" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">arxiv.org/pdf/2311.14469</a></p>
                  <p><strong>Undergraduate degree</strong> in Mathematics and Physics</p>
                </div>
              </InfoCard>
              
              <InfoCard icon={Briefcase} title="Current Position" timeline="2020 - Present">
                <p>PhD Student at Division of Network and Systems Engineering, KTH Royal Institute of Technology</p>
                <p className="mt-1">Supervisors: Viktoria Fodor and Sarunas Girdzijauskas</p>
              </InfoCard>

              <InfoCard icon={Music} title="Hobbies">
                <p>History, Music</p>
              </InfoCard>
            </div>
          </div>
        </div>
      </section>

      {/* Research Section */}
      <section id="research" className="py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div 
            ref={aboutRef.ref}
            className={`text-center mb-16 transition-all duration-700 ease-out ${
              aboutRef.isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-4xl font-bold mb-6 text-foreground">About my research</h2>
            <p className="text-lg text-foreground/70 max-w-3xl mx-auto leading-relaxed">
              My research focuses on Graph Neural Networks at the intersection of Network and Machine Learning, developing novel architectures for large-scale network analysis.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <ExpandableResearchItem
              icon={<Brain className="w-6 h-6 text-primary" />}
              title="Machine Learning on Graph-Structured Data"
              description="Building models able to learn effectively from graph data."
              expandedContent="My work focuses on developing advanced neural architectures that can effectively process and learn from complex graph structures. This includes novel attention mechanisms, hierarchical pooling strategies, and scalable approaches for handling large-scale networks. I explore how different graph properties affect learning and develop methods to capture both local neighborhood information and global graph context. Recent work includes exploring sheaf theory applications to opinion dynamics on graphs."
              visualizationType="graph-structures"
              delay={0}
            />
            <ExpandableResearchItem
              icon={<Users className="w-6 h-6 text-primary" />}
              title="Collaborative Learning"
              description="Learning in contexts where agents collaborate to solve a common task."
              expandedContent="I investigate how multiple learning agents can effectively collaborate and share knowledge to solve complex tasks. This research area encompasses federated learning on graphs, multi-agent systems, and distributed optimization strategies. The work has applications in social network analysis, recommendation systems, and decentralized AI systems."
              visualizationType="collaborative"
              delay={150}
            />
            <ExpandableResearchItem
              icon={<Network className="w-6 h-6 text-primary" />}
              title="Network Science"
              description="Understanding how networked systems process information."
              expandedContent="This research direction explores the fundamental principles of how information flows and processes within complex networked systems. I study network topology effects on learning, information diffusion patterns, and how network structure influences computational capabilities. The insights from this work inform the design of more effective graph neural network architectures."
              visualizationType="network-science"
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* Publications Section */}
      <section id="publications" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div 
            ref={papersRef.ref}
            className={`text-center mb-16 transition-all duration-700 ease-out ${
              papersRef.isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-4xl font-bold mb-6 text-foreground">Recent Publications</h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Latest research contributions to top-tier conferences and journals in machine learning and graph neural networks.
            </p>
          </div>

          <PublicationManager />

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="border-primary/30 hover:bg-primary/10" asChild>
              <a href="https://scholar.google.com/citations?user=T3J6BMcAAAAJ&hl=en" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-5 h-5 mr-2" />
                View All Publications on Google Scholar
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div 
            ref={projectsRef.ref}
            className={`text-center mb-16 transition-all duration-700 ease-out ${
              projectsRef.isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-4xl font-bold mb-6 text-foreground">Open Source Projects</h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Tools and frameworks I've developed to advance graph neural network research and make it more accessible.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard 
                key={index} 
                {...project} 
                delay={index * 150}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6 text-foreground">Stay Connected</h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Subscribe to receive updates about my latest research, publications, and insights from the world of graph neural networks.
            </p>
          </div>
          
          <NewsletterSubscription />
        </div>
      </section>

      {/* LinkedIn Posts Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div 
            ref={postsRef.ref}
            className={`text-center mb-16 transition-all duration-700 ease-out ${
              postsRef.isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-4xl font-bold mb-6 text-foreground">Recent Updates</h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Follow my research journey and insights from the world of graph neural networks.
            </p>
          </div>

          <div className="space-y-6">
            {linkedinPosts.map((post, index) => (
              <LinkedInPost 
                key={index} 
                {...post} 
                delay={index * 200}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="border-primary/30 hover:bg-primary/10" asChild>
              <a href="https://www.linkedin.com/in/remi-bourgerie/" target="_blank" rel="noopener noreferrer">
                <Linkedin className="w-5 h-5 mr-2" />
                Follow on LinkedIn
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* CV Section */}
      <section id="cv" className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-foreground">Curriculum Vitae</h2>
          <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
            Download my complete CV to learn more about my academic background, research experience, and publications.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary-dark shadow-material-3">
            <Download className="w-5 h-5 mr-2" />
            Download CV (PDF)
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground mb-4">
            © 2024 Rémi Bourgerie. Advancing Graph Neural Networks Research.
          </p>
          <div className="flex justify-center gap-6">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://www.linkedin.com/in/remi-bourgerie/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="mailto:remibo@kth.se" className="text-muted-foreground hover:text-primary transition-colors">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;