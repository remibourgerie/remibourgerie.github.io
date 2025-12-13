import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Github, Linkedin, Mail, BookOpen, Briefcase, ArrowDown, MapPin, GraduationCap, History, Coffee, Compass } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useGithubProjects } from '@/hooks/useGithubProjects';
import { useNews } from '@/hooks/useNews';
import Header from '@/components/Header';
import PublicationManager from '@/components/PublicationManager';
import ProjectCard from '@/components/ProjectCard';
import ResearchGraph from '@/components/ResearchGraph';
import ResearchContentPanel from '@/components/ResearchContentPanel';
import profileImage from '@/assets/profile.jpg';
import { getCoffeeChatMailto, CONTACT_CONFIG } from '@/config/contact';
import { ReactFlowProvider } from 'reactflow';


const Index = () => {
  const heroRef = useScrollAnimation();
  const aboutRef = useScrollAnimation();
  const researchRef = useScrollAnimation();
  const papersRef = useScrollAnimation();
  const projectsRef = useScrollAnimation();
  const postsRef = useScrollAnimation();

  // State for interactive research graph
  const [activeResearchNode, setActiveResearchNode] = useState('overview');


  // Fetch projects from GitHub API via Supabase
  const { projects, loading: projectsLoading, error: projectsError } = useGithubProjects();

  // Fetch all news/updates
  const { news, loading: newsLoading, error: newsError } = useNews(100);

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
      
      {/* Hero Section - Side-by-Side Personal */}
      <section id="home" className="pt-24 pb-16 px-6 border-b border-border">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-[280px_1fr] gap-12 items-center justify-center">
            {/* Left: Profile Photo */}
            <div className="mx-auto md:mx-0">
              <img
                src={profileImage}
                alt="Rémi Bourgerie"
                className="w-64 h-64 md:w-full md:h-auto rounded-2xl object-cover shadow-lg"
              />
            </div>

            {/* Right: Content */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
                  Rémi Bourgerie
                </h1>
                <p className="text-xl text-foreground/70">
                  PhD Student
                </p>
                <p className="text-base text-foreground/60">
                  <a href="https://www.kth.se" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                    KTH Royal Institute of Technology
                  </a>
                  <span className="mx-2">•</span>
                  Stockholm
                </p>
              </div>

              <p className="text-lg text-foreground/80 leading-relaxed max-w-xl">
                I work at the intersection of <strong>Machine Learning</strong>, <strong>graphs</strong>, and <strong>Networks</strong>, building systems that learn from connected data.
              </p>

              <div className="flex flex-wrap gap-4 items-center">
                <Button
                  size="lg"
                  onClick={scrollToResearch}
                  className="bg-primary hover:bg-primary-dark text-primary-foreground"
                >
                  Research
                  <ArrowDown className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="coffee-button"
                  asChild
                >
                  <a href={getCoffeeChatMailto()}>
                    <Coffee className="w-4 h-4 mr-2 coffee-icon" />
                    Grab a Coffee?
                  </a>
                </Button>
                <a href={`mailto:${CONTACT_CONFIG.email}`} className="text-foreground/60 hover:text-primary transition-colors" title="Email">
                  <Mail className="w-5 h-5" />
                </a>
                <a href="https://www.linkedin.com/in/remi-bourgerie/" target="_blank" rel="noopener noreferrer" className="text-foreground/60 hover:text-primary transition-colors" title="LinkedIn">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="https://scholar.google.com/citations?user=T3J6BMcAAAAJ&hl=en" target="_blank" rel="noopener noreferrer" className="text-foreground/60 hover:text-primary transition-colors" title="Google Scholar">
                  <BookOpen className="w-5 h-5" />
                </a>
                <a href="https://github.com/remibourgerie" target="_blank" rel="noopener noreferrer" className="text-foreground/60 hover:text-primary transition-colors" title="GitHub">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News & Updates Section */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-foreground">News & Updates</h2>

          {newsLoading ? (
            <div className="text-center py-8">
              <p className="text-foreground/60">Loading updates...</p>
            </div>
          ) : newsError ? (
            <div className="text-center py-8">
              <p className="text-destructive">Failed to load news: {newsError}</p>
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-foreground/60">No updates yet. Check back soon!</p>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg p-6 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/40">
              <div className="space-y-4 pr-2">
                {news.map((item) => {
                  // Format date as "MMM YYYY" (e.g., "Oct 2024")
                  const date = new Date(item.date);
                  const formattedDate = date.toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric'
                  });

                  return (
                    <div key={item.id} className="flex gap-6 items-start group pb-4 border-b border-border/50 last:border-0 last:pb-0">
                      <div className="text-sm font-mono text-primary/60 min-w-[80px] mt-1">
                        {formattedDate}
                      </div>
                      <div className="flex-1">
                        {item.title && (
                          <h3 className="text-base font-semibold text-foreground mb-1">
                            {item.title}
                          </h3>
                        )}
                        <div
                          className="text-foreground/80 leading-relaxed [&_a]:text-primary [&_a]:underline [&_a:hover]:text-primary/80"
                          dangerouslySetInnerHTML={{ __html: item.content }}
                        />
                        {item.link_url && item.link_text && (
                          <a
                            href={item.link_url}
                            target={item.link_internal ? undefined : "_blank"}
                            rel={item.link_internal ? undefined : "noopener noreferrer"}
                            className="text-primary hover:underline text-sm mt-2 inline-block"
                          >
                            {item.link_text} →
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* About Me Section */}
      <section id="about" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div
            ref={aboutRef.ref}
            className={`transition-all duration-700 ease-out ${
              aboutRef.isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-4xl font-bold mb-12 text-foreground">About Me</h2>

            <div className="grid md:grid-cols-[300px_1fr] gap-12 items-start">
              {/* Left Sidebar - Photo and Quick Info */}
              <div className="space-y-5 sticky top-24">
                {/* Profile Photo */}
                <div className="w-full aspect-square rounded-2xl shadow-material-3 overflow-hidden">
                  <img
                    src={profileImage}
                    alt="Rémi Bourgerie"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Quick Info Cards */}
                <div className="space-y-3.5">
                  <div>
                    <h3 className="text-xs font-semibold text-foreground/60 uppercase tracking-wide mb-2">Current</h3>
                    <div className="flex items-start gap-2.5 text-sm">
                      <Briefcase className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                      <div className="leading-tight">
                        <p className="font-semibold text-foreground text-sm">PhD Student • KTH</p>
                        <p className="text-foreground/60 text-xs mt-0.5">Network & Systems Eng. • 2023-Present</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-foreground/60 uppercase tracking-wide mb-2">Education</h3>
                    <div className="space-y-1.5">
                      <div className="flex items-start gap-2.5 text-sm">
                        <GraduationCap className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                        <p className="leading-tight">
                          <span className="font-semibold text-foreground text-sm">MSc. Machine Learning</span>
                          <span className="text-foreground/60 text-xs"> • KTH 2021-2023</span>
                        </p>
                      </div>
                      <div className="flex items-start gap-2.5 text-sm">
                        <GraduationCap className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                        <p className="leading-tight">
                          <span className="font-semibold text-foreground text-sm">Engineering Degree</span>
                          <span className="text-foreground/60 text-xs"> • ECL 2019-2023</span>
                        </p>
                      </div>
                      <div className="flex items-start gap-2.5 text-sm">
                        <History className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                        <p className="leading-tight">
                          <span className="font-semibold text-foreground text-sm">Prépa MP*</span>
                          <span className="text-foreground/60 text-xs"> • 2016-2019</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-foreground/60 uppercase tracking-wide mb-2">Location</h3>
                    <div className="flex items-start gap-2.5 text-sm">
                      <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                      <p className="leading-tight">
                        <span className="font-semibold text-foreground text-sm">Stockholm, Sweden</span>
                        <span className="text-foreground/60 text-xs"> • Since 2021</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Download CV Button */}
                <Button size="lg" className="w-full bg-primary hover:bg-primary-dark shadow-material-2">
                  <Download className="w-4 h-4 mr-2" />
                  Download CV
                </Button>

                {/* Book a Coffee Button */}
                <Button size="lg" variant="outline" className="w-full coffee-button" asChild>
                  <a href={getCoffeeChatMailto()}>
                    <Coffee className="w-4 h-4 mr-2 coffee-icon" />
                    Curious? book a <em>coffee</em>with me
                  </a>
                </Button>
              </div>

              {/* Right Content - Biography */}
              <div className="space-y-6 text-foreground/80 leading-relaxed">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">In Short</h3>
                  <p>
                    I am a PhD student in Computer Science at <a href="https://www.kth.se" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">KTH Royal Institute of Technology</a>, in the <a href="https://www.kth.se/cs/nse/division-of-network-and-systems-engineering-1.790377" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Division of Network and Systems Engineering</a>. I am under the supervision of <a href="https://www.kth.se/profile/vjfodor/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Viktoria Fodor</a> (main supervisor) and <a href="https://www.kth.se/profile/sarunasg/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Sarunas Girdzijauskas</a> (assistant supervisor). My research explores how networked systems and machine learning intersect, with a particular interest in <strong>graph neural networks</strong>. I am particularly interested in how topological structure shapes information flow and learning in networked systems, and how these insights can help design more robust and efficient distributed intelligence.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Bio</h3>
                  <div className="space-y-4">
                    <p>
                      I studied mathematics and physics in the <a href="https://en.wikipedia.org/wiki/Classe_pr%C3%A9paratoire_aux_grandes_%C3%A9coles" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Classe Préparatoire aux Grandes Écoles</a> (MP*) at Lycée Fénelon Sainte-Marie in Paris, France. I then joined <a href="https://www.ec-lyon.fr/en" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">École Centrale de Lyon</a> in 2019, where I studied general engineering.
                    </p>

                    <p>
                      In 2021, I moved to Sweden for a double degree through the <a href="https://timeassociation.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">T.I.M.E.</a> program between <a href="https://www.ec-lyon.fr/en" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">École Centrale de Lyon</a> and <a href="https://www.kth.se" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">KTH Royal Institute of Technology</a>, specializing in <strong>Machine Learning</strong>. During this time, I conducted my <a href="#publications" className="text-primary hover:underline">master's thesis</a> in the industry at <a href="https://www.ericsson.com/en/ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Ericsson Global AI Accelerator</a>, where I worked on applied machine learning using Graph Neural Networks and Federated Learning for software anomaly detection. I graduated in 2023 with both an Engineering degree from ECL and a MSc. in Machine Learning from KTH. Since then, I am pursuing a PhD degree in Computer Science at KTH under the supervision of <a href="https://www.kth.se/profile/vjfodor/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Viktoria Fodor</a> and <a href="https://www.kth.se/profile/sarunasg/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Sarunas Girdzijauskas</a>.
                    </p>
                  </div>
                </div>

                <p className="text-foreground/70 italic border-l-2 border-primary/30 pl-4">
                  I have been living in Stockholm since 2021 where I have discovered the enjoyment of a shared <em><a href="https://visitsweden.com/what-to-do/food-drink/swedish-kitchen/all-about-swedish-fika/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline"> fika </a></em>, the virtues of <em><a href="https://en.wikipedia.org/wiki/Lagom" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">lagom</a></em>, and the meaning of <em><a href="https://en.wikipedia.org/wiki/Freedom_to_roam" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">allemansrätten</a></em>. Between shared fika and long northern evenings, Sweden has become both a place to live and a way to think, innovate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research Section - Interactive Graph */}
      <section id="research" className="py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div
            ref={researchRef.ref}
            className={`transition-all duration-700 ease-out ${
              researchRef.isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-4xl font-bold mb-12 text-foreground">About my research</h2>

            <div className="grid md:grid-cols-[300px_1fr] gap-12 items-start">
              {/* Left Column - Interactive Graph (Sticky) */}
              <div className="sticky top-24 space-y-5">
                <div>
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-foreground">
                      Research Areas
                    </h3>
                  </div>
                  <ReactFlowProvider>
                    <ResearchGraph
                      onNodeClick={setActiveResearchNode}
                      activeNodeId={activeResearchNode}
                    />
                  </ReactFlowProvider>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-primary font-semibold flex items-center justify-center gap-2">
                      <Compass className="w-4 h-4" />
                      Click any node to explore
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column - Content (Scrollable) */}
              <div className="space-y-8">
                {/* Research Content Panel */}
                <ResearchContentPanel
                  activeNodeId={activeResearchNode}
                  onNavigate={setActiveResearchNode}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Publications Section */}
      <section id="publications" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div
            ref={papersRef.ref}
            className={`transition-all duration-700 ease-out ${
              papersRef.isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-baseline gap-3 mb-3 flex-wrap">
                <h2 className="text-4xl font-bold text-foreground">Publications</h2>
                <a
                  href="https://scholar.google.com/citations?user=T3J6BMcAAAAJ&hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1.5 text-sm font-medium"
                >
                  <BookOpen className="w-4 h-4" />
                  Google Scholar →
                </a>
              </div>
              <p className="text-foreground/80 leading-relaxed">
                Here you can find the publications related to my research in peer-reviewed venues.
              </p>
            </div>

            {/* Publication List - Full Width */}
            <PublicationManager />
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div
            ref={projectsRef.ref}
            className={`transition-all duration-700 ease-out ${
              projectsRef.isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="grid md:grid-cols-[300px_1fr] gap-12 items-start">
              {/* Left Sidebar - Title and Introduction */}
              <div className="space-y-6 sticky top-24">
                <div>
                  <h2 className="text-4xl font-bold mb-6 text-foreground">Open Source</h2>
                  <p className="text-foreground/80 leading-relaxed">
                    Tools that I have developed to advance research and make it more accessible to the community. Feel free to use them and star them if they were useful to you.
                  </p>
                </div>
              </div>

              {/* Right Content - Project Tiles */}
              <div>
                {projectsLoading ? (
                  <div className="text-center py-12">
                    <p className="text-foreground/70">Loading projects...</p>
                  </div>
                ) : projectsError ? (
                  <div className="text-center py-12">
                    <p className="text-destructive">Failed to load projects: {projectsError}</p>
                  </div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-foreground/70">No projects to display yet.</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {projects.map((project, index) => (
                      <ProjectCard
                        key={index}
                        {...project}
                        delay={index * 150}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground mb-4">
            Rémi Bourgerie
          </p>
          <div className="flex justify-center gap-6">
            <a href={`mailto:${CONTACT_CONFIG.email}`} className="text-muted-foreground hover:text-primary transition-colors" title="Email">
              <Mail className="w-5 h-5" />
            </a>
            <a href="https://www.linkedin.com/in/remi-bourgerie/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="LinkedIn">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="https://scholar.google.com/citations?user=T3J6BMcAAAAJ&hl=en" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="Google Scholar">
              <BookOpen className="w-5 h-5" />
            </a>
            <a href="https://github.com/remibourgerie" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="GitHub">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;