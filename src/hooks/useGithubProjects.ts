import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { ProjectData } from '@/lib/githubApi';

interface UseGithubProjectsResult {
  projects: ProjectData[];
  loading: boolean;
  error: string | null;
}

export function useGithubProjects(): UseGithubProjectsResult {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        setError(null);

        const { data: projectList, error: supabaseError } = await supabase
          .from('projects')
          .select('*')
          .eq('featured', true)
          .order('display_order', { ascending: true });

        if (supabaseError) {
          throw new Error(`Supabase error: ${supabaseError.message}`);
        }

        if (!projectList || projectList.length === 0) {
          setProjects([]);
          setLoading(false);
          return;
        }

        // Read cached GitHub data directly from the projects table
        const result: ProjectData[] = [];
        for (const p of projectList) {
          if (!p.cached_name) continue; // Not yet synced

          const technologies: string[] = [];
          if (p.cached_topics?.length > 0) {
            technologies.push(...p.cached_topics.slice(0, 4));
          }
          if (p.cached_language && !technologies.includes(p.cached_language)) {
            technologies.unshift(p.cached_language);
          }

          result.push({
            title: p.cached_name
              .replace(/-/g, ' ')
              .replace(/_/g, ' ')
              .split(' ')
              .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' '),
            description: p.cached_description || 'No description available',
            technologies: technologies.length > 0 ? technologies : ['Open Source'],
            githubUrl: p.cached_html_url || `https://github.com/${p.github_repo}`,
            liveUrl: p.cached_homepage || undefined,
            stars: p.cached_stars ?? 0,
            language: p.cached_language || undefined,
            latestRelease: p.cached_release_tag
              ? { version: p.cached_release_tag, url: p.cached_release_url || '' }
              : undefined,
          });
        }

        setProjects(result);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return { projects, loading, error };
}
