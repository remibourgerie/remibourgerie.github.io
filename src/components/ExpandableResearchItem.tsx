import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ResearchVisualization from './ResearchVisualization';

interface ExpandableResearchItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  expandedContent: string;
  visualizationType: 'graph-structures' | 'collaborative' | 'network-science';
  delay?: number;
}

export const ExpandableResearchItem: React.FC<ExpandableResearchItemProps> = ({
  icon,
  title,
  description,
  expandedContent,
  visualizationType,
  delay = 0
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className="group animate-fade-in-up bg-card rounded-lg shadow-material-2 hover:shadow-material-3 transition-all duration-300"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`grid ${isExpanded ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-6 p-6 transition-all duration-300`}>
        {/* Content Section */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-2">{title}</h3>
            <p className="text-foreground/70 mb-4">{description}</p>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="border-primary/30 hover:bg-primary/10 transition-colors"
            >
              Learn more
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 ml-2" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-2" />
              )}
            </Button>

            {/* Expandable Content */}
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isExpanded 
                  ? 'max-h-96 opacity-100 mt-4' 
                  : 'max-h-0 opacity-0'
              }`}
            >
              <div className="border-t border-border pt-4">
                <p className="text-foreground/80 leading-relaxed">
                  {expandedContent}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Visualization Section */}
        <div className={`flex items-center justify-center transition-all duration-300 ${
          isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 md:hidden'
        }`}>
          {isExpanded && (
            <ResearchVisualization 
              type={visualizationType}
              width={300}
              height={200}
              className="shadow-material-1"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpandableResearchItem;