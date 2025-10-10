/**
 * GitHub REST API utility functions
 * Fetches repository information without authentication (60 requests/hour limit)
 */

export interface GitHubRepo {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
}

export interface GitHubRelease {
  tag_name: string;
  name: string | null;
  html_url: string;
  assets: Array<{
    name: string;
    browser_download_url: string;
  }>;
}

export interface ProjectData {
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  stars: number;
  language?: string;
  latestRelease?: {
    version: string;
    url: string;
  };
}

/**
 * Fetches repository data from GitHub REST API
 * @param repoFullName - Format: "owner/repo" (e.g., "remibourgerie/pyg_rocm_hpc")
 * @returns Repository data or null if error
 */
export async function fetchGitHubRepo(repoFullName: string): Promise<GitHubRepo | null> {
  try {
    const response = await fetch(`https://api.github.com/repos/${repoFullName}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      console.error(`GitHub API error for ${repoFullName}:`, response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    return data as GitHubRepo;
  } catch (error) {
    console.error(`Failed to fetch GitHub repo ${repoFullName}:`, error);
    return null;
  }
}

/**
 * Fetches the latest release for a repository
 * @param repoFullName - Format: "owner/repo"
 * @returns Latest release data or null if no releases or error
 */
export async function fetchLatestRelease(repoFullName: string): Promise<GitHubRelease | null> {
  try {
    const response = await fetch(`https://api.github.com/repos/${repoFullName}/releases/latest`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      // 404 means no releases, which is fine
      if (response.status === 404) {
        return null;
      }
      console.error(`GitHub API error for ${repoFullName} releases:`, response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    return data as GitHubRelease;
  } catch (error) {
    console.error(`Failed to fetch releases for ${repoFullName}:`, error);
    return null;
  }
}

/**
 * Transforms GitHub repo data into ProjectCard format
 * @param repo - GitHub repository data
 * @param release - Latest release data (optional)
 * @returns Formatted project data for display
 */
export function transformRepoToProject(repo: GitHubRepo, release?: GitHubRelease | null): ProjectData {
  // Use topics as technologies, fallback to language
  const technologies: string[] = [];

  if (repo.topics && repo.topics.length > 0) {
    technologies.push(...repo.topics.slice(0, 4)); // Limit to 4 topics
  }

  // Always add language if available
  if (repo.language && !technologies.includes(repo.language)) {
    technologies.unshift(repo.language);
  }

  const projectData: ProjectData = {
    title: repo.name.replace(/-/g, ' ').replace(/_/g, ' ').split(' ').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '), // Convert kebab-case to Title Case
    description: repo.description || 'No description available',
    technologies: technologies.length > 0 ? technologies : ['Open Source'],
    githubUrl: repo.html_url,
    liveUrl: repo.homepage || undefined,
    stars: repo.stargazers_count,
    language: repo.language || undefined,
  };

  // Add release info if available
  if (release) {
    projectData.latestRelease = {
      version: release.tag_name,
      url: release.html_url,
    };
  }

  return projectData;
}

/**
 * Fetches and transforms a GitHub repository into project data
 * @param repoFullName - Format: "owner/repo"
 * @returns Formatted project data or null if error
 */
export async function fetchProject(repoFullName: string): Promise<ProjectData | null> {
  const [repo, release] = await Promise.all([
    fetchGitHubRepo(repoFullName),
    fetchLatestRelease(repoFullName),
  ]);

  if (!repo) return null;
  return transformRepoToProject(repo, release);
}
