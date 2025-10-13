import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Users, Calendar, FileText, Image, Code, BookOpen, Video, Presentation } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface ResearchPaperProps {
  id?: string;
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
  proceedingUrl?: string;
  presentationUrl?: string;
  conferenceUrl?: string;
  videoUrl?: string;
  illustrationUrl?: string;
  publicationType?: string;
  tags: string[];
  delay?: number;
}

const ResearchPaper: React.FC<ResearchPaperProps> = ({
  id,
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
  proceedingUrl,
  presentationUrl,
  conferenceUrl,
  videoUrl,
  illustrationUrl,
  publicationType,
  tags,
  delay = 0,
}) => {
  const { ref, isVisible } = useScrollAnimation();
  const [isAbstractExpanded, setIsAbstractExpanded] = useState(false);

  return (
    <div
      id={id ? `pub-${id}` : undefined}
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
              <div className="flex items-start gap-2 flex-wrap">
                {url ? (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <CardTitle className="text-lg font-semibold leading-tight text-foreground group-hover:text-primary transition-colors cursor-pointer">
                      {title}
                    </CardTitle>
                  </a>
                ) : (
                  <CardTitle className="text-lg font-semibold leading-tight text-foreground">
                    {title}
                  </CardTitle>
                )}
                {publicationType && (
                  <Badge variant="outline" className="text-xs mt-0.5 bg-secondary/50">
                    {publicationType}
                  </Badge>
                )}
              </div>
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
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-1">Authors</h4>
            <p className="text-sm text-foreground">{authors.join(', ')}</p>
          </div>
          
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-1">Published in</h4>
            <div className="flex items-center gap-1.5">
              <p className="text-sm text-foreground">{journal}</p>
              {conferenceUrl && (
                <a
                  href={conferenceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  title="Conference website"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* Abstract with optional illustration */}
          <div className={illustrationUrl ? "grid md:grid-cols-[2fr,1fr] gap-6" : ""}>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Abstract</h4>
              <div
                className="cursor-pointer group"
                onClick={() => setIsAbstractExpanded(!isAbstractExpanded)}
              >
                <p className={`text-sm text-foreground/80 leading-relaxed transition-all ${
                  isAbstractExpanded
                    ? ''
                    : (illustrationUrl ? 'line-clamp-4' : 'line-clamp-3')
                }`}>
                  {abstract}
                </p>
                <span className="text-xs text-primary mt-1 inline-block group-hover:underline">
                  {isAbstractExpanded ? '← Show less' : 'Read more →'}
                </span>
              </div>
            </div>
            {illustrationUrl && (
              <a
                href={illustrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="order-first md:order-last"
              >
                <img
                  src={illustrationUrl}
                  alt={`Illustration for ${title}`}
                  className="w-full h-auto max-h-[250px] object-contain rounded-lg border border-border hover:border-primary transition-colors cursor-pointer"
                  loading="lazy"
                />
              </a>
            )}
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

          {/* Action buttons for PDF, Proceeding, Presentation, Video, Poster, Code */}
          {(pdfUrl || posterUrl || codeUrl || proceedingUrl || presentationUrl || videoUrl) && (
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
              {proceedingUrl && (
                <a
                  href={proceedingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors text-sm font-medium"
                >
                  <BookOpen className="w-4 h-4" />
                  Proceeding
                </a>
              )}
              {presentationUrl && (
                <a
                  href={presentationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors text-sm font-medium"
                >
                  <Presentation className="w-4 h-4" />
                  Presentation
                </a>
              )}
              {videoUrl && (
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors text-sm font-medium"
                >
                  <Video className="w-4 h-4" />
                  Video
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