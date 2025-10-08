import React, { useState, useEffect } from 'react';
import ResearchPaper from '@/components/ResearchPaper';
import GoogleScholarIntegration from '@/components/GoogleScholarIntegration';
import { Button } from './ui/button';
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
  tags: string[];
}

const PublicationManager: React.FC = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [showGoogleScholar, setShowGoogleScholar] = useState(false);
  const [loading, setLoading] = useState(true);
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
        tags: pub.tags || [],
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

  const handlePublicationsUpdate = (newPublications: Publication[]) => {
    // Merge with existing publications, avoiding duplicates
    const merged = [...publications];
    
    newPublications.forEach(newPub => {
      const exists = merged.some(existing => 
        existing.title.toLowerCase() === newPub.title.toLowerCase()
      );
      
      if (!exists) {
        merged.push({
          ...newPub,
          // Add placeholder URLs for consistent display
          pdfUrl: newPub.url ? `${newPub.url}&output=pdf` : undefined,
          posterUrl: undefined,
          codeUrl: undefined
        });
      }
    });
    
    // Sort by year (most recent first)
    merged.sort((a, b) => b.year - a.year);
    setPublications(merged);
  };

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
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-foreground">Publications</h3>
        <Button
          variant="outline"
          onClick={() => setShowGoogleScholar(!showGoogleScholar)}
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          {showGoogleScholar ? 'Hide' : 'Update from'} Google Scholar
        </Button>
      </div>

      {showGoogleScholar && (
        <div className="mb-6">
          <GoogleScholarIntegration 
            onPublicationsUpdate={handlePublicationsUpdate}
            currentPublications={publications}
          />
        </div>
      )}

      <div className="grid gap-6">
        {publications.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No publications found.</p>
        ) : (
          publications.map((paper, index) => (
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
              tags={paper.tags}
              delay={index * 100}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PublicationManager;
