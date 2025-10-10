import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { fetchProject, type ProjectData } from '@/lib/githubApi';

interface Project {
  id: string;
  github_repo: string;
  display_order: number;
  featured: boolean;
}

interface UseGithubProjectsResult {
  projects: ProjectData[];
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook to fetch projects from Supabase and enrich with GitHub data
 * @returns Projects with live GitHub stats, loading state, and error state
 */
export function useGithubProjects(): UseGithubProjectsResult {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch project list from Supabase
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

        // 2. Fetch GitHub data for each project
        const projectPromises = projectList.map(async (project: Project) => {
          const projectData = await fetchProject(project.github_repo);
          return projectData;
        });

        const fetchedProjects = await Promise.all(projectPromises);

        // 3. Filter out any failed fetches (null values)
        const validProjects = fetchedProjects.filter(
          (project): project is ProjectData => project !== null
        );

        setProjects(validProjects);
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
