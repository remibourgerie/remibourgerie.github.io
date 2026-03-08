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
    const { repos } = await req.json() as { repos: string[] };

    if (!repos || !Array.isArray(repos) || repos.length === 0) {
      return new Response(
        JSON.stringify({ error: 'repos must be a non-empty array of "owner/repo" strings' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = Deno.env.get('GITHUB_TOKEN');
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const results = await Promise.all(repos.map(async (repoFullName: string) => {
      try {
        const [repoRes, releaseRes] = await Promise.all([
          fetch(`https://api.github.com/repos/${repoFullName}`, { headers }),
          fetch(`https://api.github.com/repos/${repoFullName}/releases/latest`, { headers }),
        ]);

        const repo = repoRes.ok ? await repoRes.json() : null;
        const release = releaseRes.ok ? await releaseRes.json() : null;

        return { repoFullName, repo, release };
      } catch (err) {
        console.error(`Failed to fetch ${repoFullName}:`, err);
        return { repoFullName, repo: null, release: null };
      }
    }));

    return new Response(
      JSON.stringify({ results }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in fetch-github-repos:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to fetch repos' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
