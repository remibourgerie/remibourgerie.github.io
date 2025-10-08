import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Users, Calendar, FileText, Image, Code } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface ResearchPaperProps {
  title: string;
  authors: string[];
  journal: string;
  year: number;
  citations: number;
  abstract: string;
  url?: string;
  pdfUrl?: string;
  posterUrl?: string;
  codeUrl?: string;
  tags: string[];
  delay?: number;
}

const ResearchPaper: React.FC<ResearchPaperProps> = ({
  title,
  authors,
  journal,
  year,
  citations,
  abstract,
  url,
  pdfUrl,
  posterUrl,
  codeUrl,
  tags,
  delay = 0,
}) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <Card className="shadow-material-2 hover:shadow-material-3 transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-0">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold leading-tight text-foreground hover:text-primary transition-colors">
                {title}
              </CardTitle>
              <CardDescription className="flex items-center gap-4 mt-2 text-sm">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {authors.length} authors
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {year}
                </span>
                <span className="font-medium text-primary">
                  {citations} citations
                </span>
              </CardDescription>
            </div>
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-primary/10 transition-colors"
              >
                <ExternalLink className="w-5 h-5 text-primary" />
              </a>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-1">Authors</h4>
            <p className="text-sm text-foreground">{authors.join(', ')}</p>
          </div>
          
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-1">Published in</h4>
            <p className="text-sm font-medium text-foreground">{journal}</p>
          </div>

          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Abstract</h4>
            <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3">
              {abstract}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs bg-primary/10 text-primary hover:bg-primary/20"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Action buttons for PDF, Poster, Code */}
          {(pdfUrl || posterUrl || codeUrl) && (
            <div className="flex flex-wrap gap-3 pt-4 border-t border-border/50">
              {pdfUrl && (
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors text-sm font-medium"
                >
                  <FileText className="w-4 h-4" />
                  PDF
                </a>
              )}
              {posterUrl && (
                <a
                  href={posterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors text-sm font-medium"
                >
                  <Image className="w-4 h-4" />
                  Poster
                </a>
              )}
              {codeUrl && (
                <a
                  href={codeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors text-sm font-medium"
                >
                  <Code className="w-4 h-4" />
                  Code
                </a>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResearchPaper;