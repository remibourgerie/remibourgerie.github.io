import { Button } from '@/components/ui/button';
import { Download, Github, Linkedin, Mail, BookOpen, Briefcase, Brain, Users, Network, ArrowDown, MapPin, GraduationCap, History, Coffee } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useGithubProjects } from '@/hooks/useGithubProjects';
import { useNews } from '@/hooks/useNews';
import Header from '@/components/Header';
import PublicationManager from '@/components/PublicationManager';
import ProjectCard from '@/components/ProjectCard';
import profileImage from '@/assets/profile.jpg';
import { getCoffeeChatMailto, CONTACT_CONFIG } from '@/config/contact';


const Index = () => {
  const heroRef = useScrollAnimation();
  const aboutRef = useScrollAnimation();
  const researchArea1Ref = useScrollAnimation();
  const researchArea2Ref = useScrollAnimation();
  const researchArea3Ref = useScrollAnimation();
  const papersRef = useScrollAnimation();
  const projectsRef = useScrollAnimation();
  const postsRef = useScrollAnimation();


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
          <div className="grid md:grid-cols-[280px_1fr] gap-12 items-center">
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
                I work at the intersection of <strong>graphs</strong>, <strong>networks</strong>, and <strong>Machine Learning</strong>, building systems that learn from connected data.
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
        <div className="max-w-5xl mx-auto">
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
                    Curious? book a<em>fika</em>with me
                  </a>
                </Button>
              </div>

              {/* Right Content - Biography */}
              <div className="space-y-6 text-foreground/80 leading-relaxed">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">In Short</h3>
                  <p>
                    I'm a PhD student in Computer Science at <a href="https://www.kth.se" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">KTH Royal Institute of Technology</a>, in the <a href="https://www.kth.se/cs/nse/division-of-network-and-systems-engineering-1.790377" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Division of Network and Systems Engineering</a>. I am under the supervision of <a href="https://www.kth.se/profile/vjfodor/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Viktoria Fodor</a> (main supervisor) and <a href="https://www.kth.se/profile/sarunasg/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Sarunas Girdzijauskas</a> (assistant supervisor). My research explores how networked systems and machine learning intersect, with a particular interest in <strong>graph neural networks</strong>. I am particularly interested in how topological structure shapes information flow and learning in networked systems, and how these insights can help design more robust and efficient distributed intelligence.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Bio</h3>
                  <div className="space-y-4">
                    <p>
                      I studied mathematics and physics in the <a href="https://en.wikipedia.org/wiki/Classe_pr%C3%A9paratoire_aux_grandes_%C3%A9coles" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Classe Préparatoire aux Grandes Écoles</a> (MP*) at Lycée Fénelon Sainte-Marie in Paris, France. Three intense years aiming for excellence. I then joined <a href="https://www.ec-lyon.fr/en" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">École Centrale de Lyon</a> in 2019, where I studied general engineering.
                    </p>

                    <p>
                      In 2021, I moved to Sweden for a double degree through the <a href="https://www.time-top-industrial-managers-for-europe.eu/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">T.I.M.E.</a> program between <a href="https://www.ec-lyon.fr/en" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">École Centrale de Lyon</a> and <a href="https://www.kth.se" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">KTH Royal Institute of Technology</a>, specializing in <strong>Machine Learning</strong>. During this time, I conducted my <a href="#publications" className="text-primary hover:underline">master's thesis</a> in the industry at <a href="https://www.ericsson.com/en/ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Ericsson Global AI Accelerator</a>, where I worked on applied machine learning using Graph Neural Networks and Federated Learning for software anomaly detection. I graduated in 2023 with both an Engineering degree from ECL and a MSc. in Machine Learning from KTH. Since then, I am pursuing a PhD degree in Computer Science at KTH under the supervision of Viktoria Fodor and Sarunas Girdzijauskas.
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

      {/* Research Section - Vertical Timeline */}
      <section id="research" className="py-20 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
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
              I teach computers to understand connections—whether they're social networks, molecules, or communication systems. My work combines machine learning with the messy, interconnected reality of the world around us.
            </p>
          </div>

          <div className="space-y-8 relative">
            {/* Vertical timeline line */}
            <div className="absolute left-[29px] top-12 bottom-12 w-0.5 bg-primary/20 hidden md:block" />

            {/* Research Area 1: ML on Graphs */}
            <div
              ref={researchArea1Ref.ref}
              className={`relative transition-all duration-700 ease-out ${
                researchArea1Ref.isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="bg-card border border-border rounded-lg p-8 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 relative z-10 ring-4 ring-background">
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      Machine Learning on Graph-Structured Data
                    </h3>
                    <p className="text-base text-foreground/60">
                      When learning aided by relation data becomes non trivial
                    </p>
                  </div>
                </div>

                <div className="space-y-4 text-foreground/80 leading-relaxed">
                  <p>
                    Think about your friends on social media. You know people who know people, forming a web of relationships. Or consider how molecules work—atoms bonded together in specific patterns that determine whether something is medicine or poison. These are <strong>graphs</strong>: data where connections matter as much as the data points themselves.
                  </p>

                  <p>
                    The challenge? Most AI expects neat rows and columns, like a spreadsheet. But the real world is messy and interconnected. My research develops new ways for machines to learn from this interconnected reality—teaching them to understand not just individual pieces, but how everything fits together.
                  </p>

                  {/* Personal insight */}
                  <div className="bg-primary/5 border-l-4 border-primary/40 p-5 rounded-r-lg my-6">
                    <p className="text-foreground/80 italic leading-relaxed">
                      "What fascinates me is that current approaches, are based on the mechanism of <emp>message passing</emp> hit a fundamental wall. Nodes can only 'see' information from immediate neighbors, like trying to understand a city by only talking to people next door. I'm working on methods that let AI grasp both local patterns and global structure simultaneously."
                    </p>
                  </div>

                  <p>
                    <strong>Where this matters:</strong> Discovering new drugs by understanding molecular structures, detecting fraud in financial networks, recommending content based on social connections, or predicting traffic patterns in transportation systems.
                  </p>

                  {/* GLOW Community Link */}
                  <div className="bg-accent/5 border border-accent/20 rounded-lg p-5 mt-6">
                    <p className="text-foreground/80 mb-3">
                      💡 <strong>Interested in graph learning?</strong> Join our weekly reading group where researchers discuss the latest papers and ideas in this field.
                    </p>
                    <a
                      href="https://sites.google.com/view/graph-learning-on-weds/home-page?authuser=0"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                    >
                      <Users className="w-4 h-4" />
                      Join GLOW - Graph Learning on Wednesdays →
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Research Area 2: Network Science & Topology */}
            <div
              ref={researchArea2Ref.ref}
              className={`relative transition-all duration-700 ease-out ${
                researchArea2Ref.isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '150ms' }}
            >
              <div className="bg-card border border-border rounded-lg p-8 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 relative z-10 ring-4 ring-background">
                    <Network className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      Network Science & Topology
                    </h3>
                    <p className="text-base text-foreground/60">
                      Why Network Shape Matters?
                    </p>
                  </div>
                </div>

                <div className="space-y-4 text-foreground/80 leading-relaxed">
                  <p>
                    Not all networks are created equal. Compare a highway system (few main routes, many branches) to the internet (highly interconnected mesh). Their different shapes fundamentally change how information, diseases, or even ideas flow through them. This is what network science studies: how structure shapes behavior.
                  </p>

                  <p>
                    My research investigates how these structural properties affect machine learning. Does your social network's clustering make recommendations harder or easier? Does the way telecommunication networks are organized impact how well AI can detect anomalies? These aren't just theoretical questions—they determine whether our methods work in practice.
                  </p>

                  {/* Personal insight from Ericsson */}
                  <div className="bg-primary/5 border-l-4 border-accent/40 p-5 rounded-r-lg my-6">
                    <p className="text-foreground/80 italic leading-relaxed">
                      "Working at Ericsson taught me that real networks rarely behave like the clean graphs in textbooks. They're messy, dynamic, and full of hidden patterns. A method that works beautifully on toy data can completely fail on real infrastructure—and understanding <em>why</em> is what drives this research."
                    </p>
                  </div>

                  <p>
                    I develop methods that embrace this messiness rather than fight it. By understanding how network topology influences learning dynamics, we can design AI systems that are more robust, efficient, and practical for real-world deployment.
                  </p>

                  <p>
                    <strong>Where this matters:</strong> Optimizing telecommunications infrastructure, predicting epidemic spread and designing interventions, understanding supply chain vulnerabilities, or improving power grid resilience.
                  </p>
                </div>
              </div>
            </div>

            {/* Research Area 3: Collaborative Learning */}
            <div
              ref={researchArea3Ref.ref}
              className={`relative transition-all duration-700 ease-out ${
                researchArea3Ref.isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <div className="bg-card border border-border rounded-lg p-8 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 relative z-10 ring-4 ring-background">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      Collaborative & Federated Learning
                    </h3>
                    <p className="text-base text-foreground/60">
                      Learning Together, Without Sharing Everything
                    </p>
                  </div>
                </div>

                <div className="space-y-4 text-foreground/80 leading-relaxed">
                  <p>
                    Imagine three hospitals that want to build a better cancer detection AI. Each has valuable patient data, but they can't legally share it with each other. How do they collaborate? This is the puzzle I work on: teaching machines to learn together while keeping sensitive data private.
                  </p>

                  {/* Key challenge callout */}
                  <div className="bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-lg p-5 my-6">
                    <p className="text-foreground/80 leading-relaxed">
                      <span className="text-xl mr-2">💡</span> <strong>The Challenge:</strong> How do we train powerful AI models when data can't leave its source? And how does the network structure between these sources affect learning?
                    </p>
                  </div>

                  <p>
                    My research explores <strong>federated learning on graphs</strong>—using the network topology itself as a resource. Instead of sending all data to one place, I develop methods where nodes (hospitals, phones, organizations) share insights while keeping their data local. The connections between them become part of the solution.
                  </p>

                  <p>
                    During my master's thesis at <strong>Ericsson's AI Accelerator</strong>, I discovered how messy real-world collaboration can be: some nodes have tons of data, others have little; some are well-connected, others isolated. Making this work efficiently is both a technical and a design challenge.
                  </p>

                  <p>
                    <strong>Where this matters:</strong> Privacy-preserving healthcare AI, smartphone keyboard predictions that don't spy on you, collaborative fraud detection across banks, or training models across IoT devices without draining their batteries.
                  </p>
                </div>
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
            <div className="mb-6">
              <h2 className="text-4xl font-bold text-foreground mb-3">Publications</h2>
              <p className="text-foreground/80 leading-relaxed">
                Here you can find the publications related to my research in peer-reviewed venues.
              </p>
            </div>

            {/* Google Scholar Button */}
            <div className="mb-8">
              <Button size="lg" className="bg-primary hover:bg-primary-dark shadow-material-2" asChild>
                <a href="https://scholar.google.com/citations?user=T3J6BMcAAAAJ&hl=en" target="_blank" rel="noopener noreferrer">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Follow me on Scholar
                </a>
              </Button>
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
                    Tools that I have developed to advance research and make it more accessible to the community. Feel free to star them.
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