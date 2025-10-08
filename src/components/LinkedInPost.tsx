import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, MessageCircle, Share2, ExternalLink } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface LinkedInPostProps {
  content: string;
  date: string;
  likes: number;
  comments: number;
  shares: number;
  url?: string;
  delay?: number;
}

const LinkedInPost: React.FC<LinkedInPostProps> = ({
  content,
  date,
  likes,
  comments,
  shares,
  url,
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
      <Card className="shadow-material-2 hover:shadow-material-3 transition-all duration-300 bg-gradient-card border-0">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                  RB
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-foreground">Rémi Bourgerie</h3>
                <p className="text-sm text-muted-foreground">PhD Researcher • Graph Neural Networks</p>
                <p className="text-xs text-muted-foreground">{date}</p>
              </div>
            </div>
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-primary/10 transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-primary" />
              </a>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
            {content}
          </p>
          
          <div className="flex items-center gap-6 pt-2 border-t border-border">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ThumbsUp className="w-4 h-4" />
              <span className="text-sm">{likes}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{comments}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Share2 className="w-4 h-4" />
              <span className="text-sm">{shares}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LinkedInPost;