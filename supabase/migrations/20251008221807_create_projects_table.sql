-- Create projects table for GitHub repository showcase
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  github_repo TEXT NOT NULL UNIQUE, -- Format: "owner/repo" e.g., "remibourgerie/pyg_rocm_hpc"
  display_order INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Projects are publicly readable"
  ON public.projects
  FOR SELECT
  USING (true);

-- Create index on display_order for efficient sorting
CREATE INDEX idx_projects_display_order ON public.projects(display_order);

-- Insert initial project
INSERT INTO public.projects (github_repo, display_order, featured)
VALUES ('remibourgerie/pyg_rocm_hpc', 1, true);

-- Add comment
COMMENT ON TABLE public.projects IS 'Stores GitHub repository names to be displayed on the portfolio website';
