import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download, BookOpen, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Publication {
  title: string;
  authors: string[];
  journal: string;
  year: number;
  citations: number;
  abstract: string;
  url?: string;
  tags: string[];
}

interface GoogleScholarIntegrationProps {
  onPublicationsUpdate: (publications: Publication[]) => void;
  currentPublications: Publication[];
}

const GoogleScholarIntegration: React.FC<GoogleScholarIntegrationProps> = ({
  onPublicationsUpdate,
  currentPublications
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const { toast } = useToast();

  const fetchGoogleScholarPublications = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('fetch-scholar-publications', {
        body: {
          scholarId: 'T3J6BMcAAAAJ', // Replace with actual Scholar ID
          maxResults: 50
        }
      });

      if (error) {
        throw error;
      }
      const publications: Publication[] = data.publications.map((pub: any) => ({
        title: pub.title,
        authors: pub.authors || ['Rémi Bourgerie'],
        journal: pub.venue || 'Unknown Journal',
        year: pub.year || new Date().getFullYear(),
        citations: pub.citations || 0,
        abstract: pub.snippet || 'Abstract not available',
        url: pub.link,
        tags: extractTagsFromTitle(pub.title)
      }));

      onPublicationsUpdate(publications);
      setLastSync(new Date());
      
      toast({
        title: "Publications Updated",
        description: `Successfully imported ${publications.length} publications from Google Scholar`,
      });
    } catch (error) {
      console.error('Error fetching Google Scholar data:', error);
      toast({
        title: "Sync Failed",
        description: "Unable to fetch publications. Please check your API configuration.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const extractTagsFromTitle = (title: string): string[] => {
    const keywords = [
      'Graph Neural Networks', 'GNN', 'Machine Learning', 'Deep Learning',
      'Social Networks', 'Network Analysis', 'Attention', 'Sheaf Theory',
      'Opinion Dynamics', 'Pooling', 'Multimodal', 'Classification'
    ];
    
    return keywords.filter(keyword => 
      title.toLowerCase().includes(keyword.toLowerCase())
    ).slice(0, 4);
  };

  const importToCurrentList = () => {
    // This would merge Scholar data with manually curated publications
    toast({
      title: "Import Scheduled", 
      description: "Publications will be imported and merged with existing data"
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-primary" />
          <div>
            <h3 className="text-lg font-semibold">Google Scholar Integration</h3>
            <p className="text-sm text-muted-foreground">
              Automatically sync publications from your Google Scholar profile
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchGoogleScholarPublications}
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Sync Now
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={importToCurrentList}
          >
            <Download className="w-4 h-4 mr-2" />
            Import
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground">
            Current publications: {currentPublications.length}
          </span>
          {lastSync && (
            <span className="text-muted-foreground">
              Last sync: {lastSync.toLocaleDateString()}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-amber-600">
          <AlertCircle className="w-4 h-4" />
          <span className="text-xs">Requires API setup</span>
        </div>
      </div>
    </div>
  );
};

export default GoogleScholarIntegration;