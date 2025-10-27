import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';
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

interface ScholarPublication {
  title: string;
  authors: string[];
  venue: string;
  year: number;
  citations: number;
  snippet: string;
  link: string | null;
  scholarId: string | null;
  clusterID: string | null;
}

interface SyncStats {
  newPublications: number;
  updatedCitations: number;
  skipped: number;
  errors: number;
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
  const [syncStats, setSyncStats] = useState<SyncStats | null>(null);
  const { toast } = useToast();

  const fetchGoogleScholarPublications = async () => {
    setIsLoading(true);
    const stats: SyncStats = {
      newPublications: 0,
      updatedCitations: 0,
      skipped: 0,
      errors: 0
    };

    try {
      // Step 1: Fetch publications from Google Scholar via SerpAPI
      const { data, error } = await supabase.functions.invoke('fetch-scholar-publications', {
        body: {
          scholarId: 'T3J6BMcAAAAJ', // Replace with actual Scholar ID
          maxResults: 50
        }
      });

      if (error) {
        throw error;
      }

      const scholarPublications: ScholarPublication[] = data.publications;
      console.log(`Fetched ${scholarPublications.length} publications from Google Scholar`);
      console.log('Sample publication data:', scholarPublications[0]);

      // Step 2: Process each publication with smart upsert logic
      for (const scholarPub of scholarPublications) {
        try {
          console.log(`Processing: "${scholarPub.title}" - scholarId: ${scholarPub.scholarId}, clusterId: ${scholarPub.clusterID}`);

          // Validate publication data
          if (!scholarPub.title || !scholarPub.year) {
            console.warn(`Skipping publication with missing title or year:`, scholarPub);
            stats.skipped++;
            continue;
          }

          // Try to find existing publication by scholar_id first
          let existingPub = null;

          if (scholarPub.scholarId) {
            const { data: byScholarId } = await supabase
              .from('publications')
              .select('*')
              .eq('scholar_id', scholarPub.scholarId)
              .maybeSingle();

            existingPub = byScholarId;
          }

          // Fallback: Try to find by (title, year) if not found by scholar_id
          if (!existingPub) {
            const { data: byTitleYear } = await supabase
              .from('publications')
              .select('*')
              .eq('title', scholarPub.title)
              .eq('year', scholarPub.year)
              .maybeSingle();

            existingPub = byTitleYear;
          }

          const now = new Date().toISOString();

          if (existingPub) {
            // Publication exists - ONLY update citations and scholar tracking fields
            const updateData = {
              citations: scholarPub.citations,
              scholar_id: scholarPub.scholarId,
              scholar_cluster_id: scholarPub.clusterID || null,
              last_synced_at: now,
            };

            console.log(`Updating publication ID ${existingPub.id} with:`, updateData);

            const { error: updateError } = await supabase
              .from('publications')
              .update(updateData)
              .eq('id', existingPub.id);

            if (updateError) {
              console.error('Error updating publication:', {
                title: scholarPub.title,
                existingId: existingPub.id,
                updateData,
                error: updateError,
                errorCode: updateError.code,
                errorMessage: updateError.message,
                errorDetails: updateError.details
              });
              stats.errors++;
            } else {
              console.log(`✓ Updated: "${scholarPub.title}"`);
              stats.updatedCitations++;
            }
          } else {
            // New publication - insert with all data
            const insertData = {
              title: scholarPub.title,
              authors: scholarPub.authors,
              journal: scholarPub.venue,
              year: scholarPub.year,
              citations: scholarPub.citations,
              abstract: scholarPub.snippet,
              url: scholarPub.link || undefined,
              scholar_id: scholarPub.scholarId,
              scholar_cluster_id: scholarPub.clusterID || null,
              last_synced_at: now,
              tags: extractTagsFromTitle(scholarPub.title),
            };

            console.log(`Inserting new publication:`, insertData);

            const { error: insertError } = await supabase
              .from('publications')
              .insert(insertData);

            if (insertError) {
              console.error('Error inserting publication:', {
                title: scholarPub.title,
                insertData,
                error: insertError,
                errorCode: insertError.code,
                errorMessage: insertError.message,
                errorDetails: insertError.details
              });
              stats.errors++;
            } else {
              console.log(`✓ Inserted: "${scholarPub.title}"`);
              stats.newPublications++;
            }
          }
        } catch (pubError) {
          console.error('Error processing publication:', scholarPub.title, pubError);
          stats.errors++;
        }
      }

      // Update state
      setSyncStats(stats);
      setLastSync(new Date());

      // Refresh the publications list
      onPublicationsUpdate([]);

      toast({
        title: "Sync Complete",
        description: `New: ${stats.newPublications}, Updated: ${stats.updatedCitations}, Skipped: ${stats.skipped}, Errors: ${stats.errors}`,
        variant: stats.errors > 0 ? "destructive" : "default",
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

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">
              Current publications: {currentPublications.length}
            </span>
            {lastSync && (
              <span className="text-muted-foreground">
                Last sync: {lastSync.toLocaleDateString()} at {lastSync.toLocaleTimeString()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-amber-600">
            <AlertCircle className="w-4 h-4" />
            <span className="text-xs">Requires API setup</span>
          </div>
        </div>

        {syncStats && (
          <div className="flex items-center gap-4 text-sm bg-secondary/30 rounded-md p-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-foreground">
                <strong>{syncStats.newPublications}</strong> new
              </span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-blue-600" />
              <span className="text-foreground">
                <strong>{syncStats.updatedCitations}</strong> updated
              </span>
            </div>
            {syncStats.errors > 0 && (
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-foreground">
                  <strong>{syncStats.errors}</strong> errors
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleScholarIntegration;