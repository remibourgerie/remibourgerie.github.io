import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { scholarId, maxResults = 50 } = await req.json();
    const serpApiKey = Deno.env.get('SERPAPI_API_KEY');

    if (!serpApiKey) {
      console.error('SERPAPI_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching publications for scholar ID: ${scholarId}`);

    // Fetch Google Scholar profile using SerpAPI
    const serpApiUrl = `https://serpapi.com/search.json?engine=google_scholar_author&author_id=${scholarId}&api_key=${serpApiKey}&num=${maxResults}`;
    
    const response = await fetch(serpApiUrl);
    
    if (!response.ok) {
      console.error('SerpAPI request failed:', response.status, response.statusText);
      throw new Error(`SerpAPI request failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('SerpAPI Response:', JSON.stringify(data, null, 2));
    
    // Check for API errors or issues
    if (data.error) {
      console.error('SerpAPI Error:', data.error);
      throw new Error(`SerpAPI Error: ${data.error}`);
    }
    
    if (!data.articles && !data.author) {
      console.warn('No articles or author data in response - possible API credit issue or profile privacy settings');
    }
    
    console.log(`Received ${data.articles?.length || 0} publications from SerpAPI`);

    // Log first article structure to help debug field names
    if (data.articles && data.articles.length > 0) {
      console.log('First article structure:', JSON.stringify(data.articles[0], null, 2));
    }

    // Transform SerpAPI response to our publication format
    const publications = (data.articles || []).map((article: any) => {
      // Extract scholar IDs
      // citation_id format: "LSsXyncAAAAJ:2osOgNQ5qMEC" (author_id:article_id)
      const scholarId = article.citation_id || null;

      // Extract cluster ID from cited_by.link or cited_by.cites_id
      // The cites parameter in the URL is the cluster ID
      let clusterId = null;
      if (article.cited_by?.link) {
        const citesMatch = article.cited_by.link.match(/cites=(\d+)/);
        if (citesMatch) {
          clusterId = citesMatch[1];
        }
      }

      console.log('Processing article:', {
        title: article.title,
        scholarId,
        clusterId,
        citations: article.cited_by?.value || 0,
        year: article.year
      });

      return {
        title: article.title,
        authors: article.authors ? article.authors.split(',').map((a: string) => a.trim()) : ['Rémi Bourgerie'],
        venue: article.publication || 'Unknown Journal',
        year: article.year || new Date().getFullYear(),
        citations: article.cited_by?.value || 0,
        snippet: article.snippet || 'Abstract not available',
        link: article.link || null,
        // Google Scholar identifiers for deduplication
        scholarId,
        clusterID: clusterId,
      };
    });

    return new Response(
      JSON.stringify({ publications }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in fetch-scholar-publications:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to fetch publications',
        details: error.toString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
