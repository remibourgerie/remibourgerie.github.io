import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const githubToken = Deno.env.get('GITHUB_TOKEN');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
    };
    if (githubToken) {
      headers['Authorization'] = `Bearer ${githubToken}`;
    }

    // Fetch all featured projects from DB
    const { data: projects, error: dbError } = await supabase
      .from('projects')
      .select('id, github_repo')
      .eq('featured', true);

    if (dbError) throw new Error(`DB error: ${dbError.message}`);
    if (!projects || projects.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No projects to sync' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let updated = 0;
    let errors = 0;

    for (const project of projects) {
      try {
        const [repoRes, releaseRes] = await Promise.all([
          fetch(`https://api.github.com/repos/${project.github_repo}`, { headers }),
          fetch(`https://api.github.com/repos/${project.github_repo}/releases/latest`, { headers }),
        ]);

        const repo = repoRes.ok ? await repoRes.json() : null;
        const release = releaseRes.ok ? await releaseRes.json() : null;

        if (!repo) {
          console.error(`Failed to fetch repo ${project.github_repo}`);
          errors++;
          continue;
        }

        const { error: updateError } = await supabase
          .from('projects')
          .update({
            cached_name: repo.name,
            cached_description: repo.description,
            cached_stars: repo.stargazers_count,
            cached_language: repo.language,
            cached_topics: repo.topics || [],
            cached_html_url: repo.html_url,
            cached_homepage: repo.homepage,
            cached_release_tag: release?.tag_name || null,
            cached_release_url: release?.html_url || null,
            last_synced_at: new Date().toISOString(),
          })
          .eq('id', project.id);

        if (updateError) {
          console.error(`Update error for ${project.github_repo}:`, updateError.message);
          errors++;
        } else {
          updated++;
        }
      } catch (err) {
        console.error(`Error syncing ${project.github_repo}:`, err);
        errors++;
      }
    }

    console.log(`GitHub sync complete: ${updated} updated, ${errors} errors`);

    return new Response(
      JSON.stringify({ success: true, updated, errors }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Sync failed:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
