import { researchNodes, ResearchNode } from '@/data/researchContent';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ResearchContentPanelProps {
  activeNodeId: string;
  onNavigate: (nodeId: string) => void;
}

const ResearchContentPanel = ({ activeNodeId, onNavigate }: ResearchContentPanelProps) => {
  const node = researchNodes[activeNodeId];

  if (!node) {
    return (
      <div className="text-center py-12">
        <p className="text-foreground/60">Select a research area to explore</p>
      </div>
    );
  }

  const Icon = node.icon;

  // Get navigation order (only 4 nodes now)
  const nodeOrder = ['overview', 'graph-ml', 'network-science', 'federated-learning'];
  const currentIndex = nodeOrder.indexOf(activeNodeId);
  const prevNode = currentIndex > 0 ? nodeOrder[currentIndex - 1] : null;
  const nextNode = currentIndex < nodeOrder.length - 1 ? nodeOrder[currentIndex + 1] : null;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fadeIn">
        <div className="flex items-start gap-6 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 ring-4 ring-primary/5">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-3xl font-bold text-foreground mb-2">
              {node.title}
            </h3>
            <p className="text-lg text-foreground/60">
              {node.tagline}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6 text-foreground/80 leading-relaxed animate-fadeIn">
        {node.content.paragraphs.map((paragraph, index) => (
          <div key={index}>{paragraph}</div>
        ))}

        {/* Personal Insight */}
        {node.content.personalInsight && (
          <div className="animate-fadeIn" style={{ animationDelay: '200ms' }}>
            {node.content.personalInsight}
          </div>
        )}

        {/* Applications */}
        {node.content.applications && (
          <div className="animate-fadeIn" style={{ animationDelay: '300ms' }}>
            <p>
              <strong>Where this matters:</strong> {node.content.applications}
            </p>
          </div>
        )}

        {/* Community Links */}
        {node.content.communityLinks && node.content.communityLinks.length > 0 && (
          <div className="space-y-4 animate-fadeIn" style={{ animationDelay: '400ms' }}>
            {node.content.communityLinks.map((link, index) => {
              const LinkIcon = link.icon;
              return (
                <div key={index} className="bg-accent/5 border border-accent/20 rounded-lg p-5">
                  <p className="text-foreground/80 mb-3">
                    {link.description}
                  </p>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                  >
                    {LinkIcon && <LinkIcon className="w-4 h-4" />}
                    {link.title} →
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-12 pt-8 border-t border-border">
        {prevNode ? (
          <Button
            variant="outline"
            onClick={() => onNavigate(prevNode)}
            className="group"
          >
            <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Previous: {researchNodes[prevNode].title}
          </Button>
        ) : (
          <div />
        )}

        {nextNode ? (
          <Button
            variant="outline"
            onClick={() => onNavigate(nextNode)}
            className="group"
          >
            Next: {researchNodes[nextNode].title}
            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};

export default ResearchContentPanel;
