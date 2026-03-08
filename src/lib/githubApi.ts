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
