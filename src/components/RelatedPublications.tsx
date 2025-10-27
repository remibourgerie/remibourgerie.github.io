import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FileText, ExternalLink } from 'lucide-react';
import { Publication } from './PublicationManager';

interface RelatedPublicationsProps {
  researchAreaId: string;
}

const RelatedPublications = ({ researchAreaId }: RelatedPublicationsProps) => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedPublications = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('publications')
          .select('*')
          .contains('research_areas', [researchAreaId])
          .order('year', { ascending: false })
          .order('citations', { ascending: false });

        if (error) throw error;

        const formattedPublications: Publication[] = (data || []).map(pub => ({
          id: pub.id,
          title: pub.title,
          authors: pub.authors,
          journal: pub.journal,
          year: pub.year,
          citations: pub.citations || 0,
          abstract: pub.abstract,
          url: pub.url || undefined,
          pdfUrl: pub.pdf_url || undefined,
          tags: pub.tags || [],
          publicationType: pub.publication_type || undefined,
          researchAreas: pub.research_areas || [],
        }));

        setPublications(formattedPublications);
      } catch (error) {
        console.error('Error fetching related publications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedPublications();
  }, [researchAreaId]);

  if (loading) {
    return (
      <div className="py-4">
        <p className="text-sm text-foreground/60">Loading related publications...</p>
      </div>
    );
  }

  if (publications.length === 0) {
    return null;
  }

  const scrollToPublications = (publicationId?: string) => {
    const publicationsSection = document.getElementById('publications');
    if (publicationsSection) {
      publicationsSection.scrollIntoView({ behavior: 'smooth' });

      // Highlight the specific publication if ID is provided
      if (publicationId) {
        setTimeout(() => {
          const publicationElement = document.getElementById(`pub-${publicationId}`);
          if (publicationElement) {
            publicationElement.classList.add('highlight-publication');
            setTimeout(() => {
              publicationElement.classList.remove('highlight-publication');
            }, 2000);
          }
        }, 500);
      }
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-base font-semibold text-foreground flex items-center gap-2">
        <FileText className="w-5 h-5 text-primary" />
        Related Publications
      </h4>
      <div className="space-y-3">
        {publications.map((pub) => (
          <div
            key={pub.id}
            onClick={() => scrollToPublications(pub.id)}
            className="group p-4 bg-accent/5 hover:bg-accent/10 border border-border hover:border-primary/50 rounded-lg transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h5 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
                  {pub.title}
                </h5>
                <div className="flex items-center gap-3 text-xs text-foreground/60">
                  <span>{pub.journal}</span>
                  <span>•</span>
                  <span>{pub.year}</span>
                  {pub.publicationType && (
                    <>
                      <span>•</span>
                      <span className="text-primary">{pub.publicationType}</span>
                    </>
                  )}
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-foreground/40 group-hover:text-primary transition-colors flex-shrink-0" />
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes highlightPulse {
          0%, 100% {
            box-shadow: 0 0 0 0 hsl(var(--primary) / 0.4);
            border-color: hsl(var(--primary));
          }
          50% {
            box-shadow: 0 0 0 8px hsl(var(--primary) / 0);
            border-color: hsl(var(--primary) / 0.6);
          }
        }

        .highlight-publication {
          animation: highlightPulse 0.6s ease-out 2;
        }
      `}</style>
    </div>
  );
};

export default RelatedPublications;
