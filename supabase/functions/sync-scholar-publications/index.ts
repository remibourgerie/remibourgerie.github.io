import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SCHOLAR_ID = 'T3J6BMcAAAAJ';
const MAX_RESULTS = 50;


serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const stats = { newPublications: 0, updatedCitations: 0, skipped: 0, errors: 0 };

  try {
    const serpApiKey = Deno.env.get('SERPAPI_API_KEY');
    if (!serpApiKey) {
      throw new Error('SERPAPI_API_KEY not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch publications from Google Scholar via SerpAPI
    const serpUrl = `https://serpapi.com/search.json?engine=google_scholar_author&author_id=${SCHOLAR_ID}&api_key=${serpApiKey}&num=${MAX_RESULTS}`;
    const serpRes = await fetch(serpUrl);

    if (!serpRes.ok) {
      throw new Error(`SerpAPI request failed: ${serpRes.statusText}`);
    }

    const serpData = await serpRes.json();
    if (serpData.error) {
      throw new Error(`SerpAPI error: ${serpData.error}`);
    }

    const articles = serpData.articles || [];
    console.log(`Fetched ${articles.length} publications from Google Scholar`);

    // Upsert each publication
    for (const article of articles) {
      try {
        const scholarId = article.citation_id || null;
        let clusterId = null;
        if (article.cited_by?.link) {
          const match = article.cited_by.link.match(/cites=(\d+)/);
          if (match) clusterId = match[1];
        }

        const title = article.title;
        const year = article.year;
        if (!title || !year) {
          stats.skipped++;
          continue;
        }

        // Look up existing: by scholar_id first, then by (title, year)
        let existingPub = null;

        if (scholarId) {
          const { data } = await supabase
            .from('publications')
            .select('id')
            .eq('scholar_id', scholarId)
            .maybeSingle();
          existingPub = data;
        }

        if (!existingPub) {
          const { data } = await supabase
            .from('publications')
            .select('id')
            .eq('title', title)
            .eq('year', year)
            .maybeSingle();
          existingPub = data;
        }

        const now = new Date().toISOString();

        if (existingPub) {
          const { error } = await supabase
            .from('publications')
            .update({
              citations: article.cited_by?.value || 0,
              scholar_id: scholarId,
              scholar_cluster_id: clusterId,
              last_synced_at: now,
            })
            .eq('id', existingPub.id);

          if (error) {
            console.error(`Update error for "${title}":`, error.message);
            stats.errors++;
          } else {
            stats.updatedCitations++;
          }
        } else {
          // Skip new papers — they must be added manually via admin
          stats.skipped++;
        }
      } catch (err) {
        console.error(`Error processing article:`, err);
        stats.errors++;
      }
    }

    console.log('Sync complete:', stats);

    return new Response(
      JSON.stringify({ success: true, stats }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Sync failed:', error);
    return new Response(
      JSON.stringify({ error: error.message, stats }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
