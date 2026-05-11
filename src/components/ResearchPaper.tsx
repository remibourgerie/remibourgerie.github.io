import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, FileText, Image, Code, Video, Presentation, Trophy, Quote, Check } from 'lucide-react';
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
  presentationUrl?: string;
  venueUrl?: string;
  videoUrl?: string;
  illustrationUrl?: string;
  publicationType?: string;
  award?: string;
  tags: string[];
  citationKey?: string;
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
  presentationUrl,
  venueUrl,
  videoUrl,
  illustrationUrl,
  publicationType,
  award,
  tags,
  citationKey,
  delay = 0,
}) => {
  const { ref, isVisible } = useScrollAnimation();
  const [isAbstractExpanded, setIsAbstractExpanded] = useState(false);
  const [cited, setCited] = useState(false);

  const generateBibTeX = () => {
    if (citationKey) return citationKey;
    const entryType = publicationType === 'Journal' ? 'article'
      : (publicationType === 'Conference' || publicationType === 'Workshop') ? 'inproceedings'
      : 'misc';
    const lastName = (authors[0] ?? '').split(' ').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') ?? 'unknown';
    const key = `${lastName}${year}${title.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    const venueField = publicationType === 'Journal' ? 'journal' : 'booktitle';
    return `@${entryType}{${key},\n  author = {${authors.join(' and ')}},\n  title = {${title}},\n  ${venueField} = {${journal}},\n  year = {${year}},\n}`;
  };

  const handleCite = async () => {
    await navigator.clipboard.writeText(generateBibTeX());
    setCited(true);
    setTimeout(() => setCited(false), 2000);
  };

  return (
    <div
      id={id ? `pub-${id}` : undefined}
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <Card className="shadow-material-2 hover:shadow-material-3 transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-0">
        <CardContent className="pt-5 pb-5 flex flex-col gap-3">

          {/* Full-width: title + badge */}
          <div className="flex items-start gap-2 flex-wrap">
            {url ? (
              <a href={url} target="_blank" rel="noopener noreferrer" className="group inline-flex items-start gap-1">
                <h3 className="text-base font-semibold leading-snug text-foreground group-hover:text-primary transition-colors cursor-pointer">
                  {title}
                </h3>
                <ExternalLink className="w-3.5 h-3.5 mt-0.5 shrink-0 text-foreground/60 group-hover:text-primary transition-colors" />
              </a>
            ) : (
              <h3 className="text-base font-semibold leading-snug text-foreground">{title}</h3>
            )}
            {publicationType && (
              <Badge variant="outline" className="text-xs shrink-0 bg-secondary/50 self-center">
                {publicationType}
              </Badge>
            )}
            {award && (
              <Badge className="award-badge text-xs shrink-0 bg-amber-100 text-amber-800 border border-amber-300 gap-1 self-center hover:bg-amber-100 hover:text-amber-800">
                <Trophy className="trophy-icon w-3 h-3" /> {award}
              </Badge>
            )}
          </div>

          {/* Full-width: metadata row */}
          <p className="text-xs text-foreground/60 leading-relaxed">
            {authors.map((author, i) => (
              <span key={i}>
                {i > 0 && ', '}
                {author.includes('Bourgerie') ? <strong>{author}</strong> : author}
              </span>
            ))}
            <span className="mx-1.5 opacity-40">·</span>
            {venueUrl ? (
              <a href={venueUrl} target="_blank" rel="noopener noreferrer" className="italic hover:text-primary transition-colors">
                {journal}<ExternalLink className="w-3 h-3 inline ml-1 opacity-60" />
              </a>
            ) : (
              <span className="italic">{journal}</span>
            )}
            <span className="mx-1.5 opacity-40">·</span>
            {year}
            {citations > 0 && (
              <>
                <span className="mx-1.5 opacity-40">·</span>
                <span className="text-primary font-medium">{citations} citations</span>
              </>
            )}
          </p>

          {/* Abstract + illustration */}
          <div onClick={() => setIsAbstractExpanded(!isAbstractExpanded)} className="cursor-pointer group">
            {/* Collapsed: side by side, height-matched */}
            {!isAbstractExpanded && (
              <div className={illustrationUrl ? 'grid md:grid-cols-[1fr_224px] gap-5 items-start' : ''}>
                <div className="overflow-hidden" style={{ maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)' }}>
                  <p className="text-sm text-foreground/75 leading-relaxed line-clamp-6">
                    {abstract}
                  </p>
                </div>
                {illustrationUrl && (
                  <img
                    src={illustrationUrl}
                    alt={`Illustration for ${title}`}
                    className="hidden md:block w-56 object-contain rounded-lg"
                    loading="lazy"
                  />
                )}
              </div>
            )}

            {/* Expanded: full abstract, then illustration centered below */}
            {isAbstractExpanded && (
              <div>
                <p className="text-sm text-foreground/75 leading-relaxed">
                  {abstract}
                </p>
                {illustrationUrl && (
                  <div className="mt-4 flex justify-center animate-in fade-in zoom-in-95 duration-300">
                    <a
                      href={illustrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                    >
                      <img
                        src={illustrationUrl}
                        alt={`Illustration for ${title}`}
                        className="max-w-sm w-full object-contain rounded-lg"
                        loading="lazy"
                      />
                    </a>
                  </div>
                )}
              </div>
            )}

            <span className="text-xs text-primary mt-1 inline-block group-hover:underline">
              {isAbstractExpanded ? '← Show less' : 'Read more →'}
            </span>
          </div>

          {/* Full-width: tags */}
          <div className="flex flex-wrap gap-1.5">
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

          {/* Full-width: action buttons */}
          <div className="flex flex-wrap gap-2 pt-1 border-t border-border/40">
            <button
              onClick={handleCite}
              className="cite-button flex items-center gap-1.5 px-2.5 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors text-xs font-medium">
              {cited ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Quote className="quote-icon w-3 h-3" /> Cite</>}
            </button>
            {pdfUrl && (
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors text-xs font-medium">
                <FileText className="w-3.5 h-3.5" /> PDF
              </a>
            )}
            {codeUrl && (
              <a href={codeUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors text-xs font-medium">
                <Code className="w-3.5 h-3.5" /> Code
              </a>
            )}
            {posterUrl && (
              <a href={posterUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors text-xs font-medium">
                <Image className="w-3.5 h-3.5" /> Poster
              </a>
            )}
            {presentationUrl && (
              <a href={presentationUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors text-xs font-medium">
                <Presentation className="w-3.5 h-3.5" /> Slides
              </a>
            )}
            {videoUrl && (
              <a href={videoUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors text-xs font-medium">
                <Video className="w-3.5 h-3.5" /> Video
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResearchPaper;
