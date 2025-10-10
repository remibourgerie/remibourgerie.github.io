import React, { useState, useEffect } from 'react';
import ResearchPaper from '@/components/ResearchPaper';
import { RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Publication {
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
  tags: string[];
  publicationType?: string;
}

const PublicationManager: React.FC = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const { toast } = useToast();

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('publications')
        .select('*')
        .order('year', { ascending: false });

      if (error) throw error;

      const formattedPublications: Publication[] = (data || []).map(pub => ({
        title: pub.title,
        authors: pub.authors,
        journal: pub.journal,
        year: pub.year,
        citations: pub.citations || 0,
        abstract: pub.abstract,
        url: pub.url || undefined,
        pdfUrl: pub.pdf_url || undefined,
        posterUrl: pub.poster_url || undefined,
        codeUrl: pub.code_url || undefined,
        proceedingUrl: pub.proceeding_url || undefined,
        presentationUrl: pub.presentation_url || undefined,
        conferenceUrl: pub.conference_url || undefined,
        videoUrl: pub.video_url || undefined,
        illustrationUrl: pub.illustration_url || undefined,
        tags: pub.tags || [],
        publicationType: pub.publication_type || undefined,
      }));

      setPublications(formattedPublications);
    } catch (error) {
      console.error('Error fetching publications:', error);
      toast({
        title: "Error loading publications",
        description: "Failed to load publications from database.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterTypes = ['All', 'Journal', 'Conference', 'Workshop', 'Others'];

  const filteredPublications = publications.filter(paper => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Others') {
      return !paper.publicationType ||
             !['Journal', 'Conference', 'Workshop'].includes(paper.publicationType);
    }
    return paper.publicationType === selectedFilter;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter buttons */}
      <div className="flex flex-wrap gap-3 pb-4 border-b border-border/50">
        {filterTypes.map(type => (
          <button
            key={type}
            onClick={() => setSelectedFilter(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedFilter === type
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-secondary/50 text-foreground hover:bg-secondary'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Publications list */}
      {filteredPublications.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          No publications found {selectedFilter !== 'All' && `for type "${selectedFilter}"`}.
        </p>
      ) : (
        filteredPublications.map((paper, index) => (
            <ResearchPaper
              key={index}
              title={paper.title}
              authors={paper.authors}
              journal={paper.journal}
              year={paper.year}
              citations={paper.citations}
              abstract={paper.abstract}
              url={paper.url}
              pdfUrl={paper.pdfUrl}
              posterUrl={paper.posterUrl}
              codeUrl={paper.codeUrl}
              proceedingUrl={paper.proceedingUrl}
              presentationUrl={paper.presentationUrl}
              conferenceUrl={paper.conferenceUrl}
              videoUrl={paper.videoUrl}
              illustrationUrl={paper.illustrationUrl}
              publicationType={paper.publicationType}
              tags={paper.tags}
              delay={index * 100}
            />
          ))
        )}
    </div>
  );
};

export default PublicationManager;
