import { researchNodes, ResearchNode } from '@/data/researchContent';
import RelatedPublications from './RelatedPublications';

interface ResearchContentPanelProps {
  activeNodeId: string;
  onNavigate: (nodeId: string) => void;
}

const ResearchContentPanel = ({ activeNodeId, onNavigate }: ResearchContentPanelProps) => {
  const node = researchNodes[activeNodeId];

  // If overview node is selected, show overview content
  if (activeNodeId === 'overview') {
    // Get all non-overview research nodes dynamically
    const researchAreaNodes = Object.values(researchNodes).filter(
      n => n.category === 'core'
    );

    return (
      <div className="space-y-6 text-foreground/80 leading-relaxed">
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-4">
            {node.title}
          </h3>
          <p className="text-lg text-foreground/70 mb-6">
            {node.tagline}
          </p>
        </div>

        <div className="space-y-4">
          {node.content.paragraphs.map((paragraph, index) => (
            <div key={index} className="text-base">{paragraph}</div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {researchAreaNodes.map((areaNode) => (
            <button
              key={areaNode.id}
              onClick={() => onNavigate(areaNode.id)}
              className="p-4 bg-card hover:bg-accent/10 border border-border rounded-lg transition-all hover:border-primary/50 text-left"
            >
              <h4 className="font-semibold text-foreground mb-2">{areaNode.title}</h4>
              <p className="text-sm text-foreground/60">{areaNode.tagline}</p>
            </button>
          ))}
        </div>

        {/* Community Link - GLOW */}
        {node.content.communityLinks && node.content.communityLinks.length > 0 && (
          <div className="mt-8 pt-6 border-t border-border/50">
            {node.content.communityLinks.map((link, index) => {
              const LinkIcon = link.icon;
              return (
                <div key={index} className="text-center">
                  <p className="text-sm text-foreground/60 mb-3">
                    {link.description}
                  </p>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:underline font-medium text-sm"
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
    );
  }

  if (!node) {
    return (
      <div className="text-center py-12">
        <p className="text-foreground/60">Select a research area to explore</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-foreground/80 leading-relaxed">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-3">
          {node.title}
        </h3>
        <p className="text-base text-foreground/70 mb-4 italic">
          {node.tagline}
        </p>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {node.content.paragraphs.map((paragraph, index) => (
          <div key={index}>{paragraph}</div>
        ))}

        {/* Personal Insight */}
        {node.content.personalInsight && (
          <div>
            {node.content.personalInsight}
          </div>
        )}

        {/* Applications - Compact Highlighted Section */}
        {node.content.applications && (
          <div className="rounded-lg p-5 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border-l-4 border-primary">
            <h4 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wide">
              Real-World Applications
            </h4>
            {Array.isArray(node.content.applications) ? (
              <ul className="space-y-1.5">
                {node.content.applications.map((app, index) => (
                  <li key={index} className="text-sm text-foreground/80 flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{app}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-foreground/80 leading-relaxed">
                {node.content.applications}
              </p>
            )}
          </div>
        )}

        {/* Related Publications */}
        <RelatedPublications researchAreaId={activeNodeId} />

        {/* Community Links */}
        {node.content.communityLinks && node.content.communityLinks.length > 0 && (
          <div className="space-y-4">
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
    </div>
  );
};

export default ResearchContentPanel;
