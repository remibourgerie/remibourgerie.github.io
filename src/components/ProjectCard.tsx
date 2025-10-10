import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Github, ExternalLink, Star, Download } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  stars?: number;
  delay?: number;
  latestRelease?: {
    version: string;
    url: string;
  };
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  technologies,
  githubUrl,
  liveUrl,
  stars,
  delay = 0,
  latestRelease,
}) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible
          ? 'opacity-100 translate-x-0'
          : 'opacity-0 translate-x-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <Card className="h-full shadow-material-2 hover:shadow-material-3 transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-0">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-lg font-semibold text-foreground">
                  {title}
                </CardTitle>
                {latestRelease && (
                  <a
                    href={latestRelease.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 hover:bg-primary/20 transition-colors"
                    title={`Download ${latestRelease.version}`}
                  >
                    <Download className="w-3 h-3 text-primary" />
                    <span className="text-xs font-medium text-primary">{latestRelease.version}</span>
                  </a>
                )}
              </div>
              {stars !== undefined && (
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-4 h-4 text-accent fill-accent" />
                  <span className="text-sm text-muted-foreground">{stars}</span>
                </div>
              )}
            </div>
          </div>
          <CardDescription className="text-sm text-foreground/70 leading-relaxed">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs border-primary/30 text-primary hover:bg-primary/10"
              >
                {tech}
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-2 pt-2">
            {githubUrl && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground"
                asChild
              >
                <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4" />
                  Code
                </a>
              </Button>
            )}
            {liveUrl && (
              <Button 
                size="sm" 
                className="flex items-center gap-2 bg-primary hover:bg-primary-dark"
                asChild
              >
                <a href={liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectCard;