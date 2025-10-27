-- Add Google Scholar tracking columns to publications table
-- This allows us to sync publications from Google Scholar while preserving manually curated data

-- Add scholar_id column (SerpAPI result_id - Google Scholar's unique identifier for this publication)
ALTER TABLE public.publications
ADD COLUMN IF NOT EXISTS scholar_id TEXT UNIQUE;

-- Add cluster_id column (Google Scholar's cluster ID - groups different versions of same paper)
ALTER TABLE public.publications
ADD COLUMN IF NOT EXISTS scholar_cluster_id BIGINT;

-- Add last_synced_at column to track when citations were last updated from Scholar
ALTER TABLE public.publications
ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMPTZ;

-- Create index on scholar_id for fast lookups during sync
CREATE INDEX IF NOT EXISTS idx_publications_scholar_id ON public.publications(scholar_id);

-- Create composite index on (title, year) for fallback matching when scholar_id is not available
CREATE INDEX IF NOT EXISTS idx_publications_title_year ON public.publications(title, year);

-- Add comments to explain the columns
COMMENT ON COLUMN public.publications.scholar_id IS 'SerpAPI result_id - Google Scholar unique identifier for this publication';
COMMENT ON COLUMN public.publications.scholar_cluster_id IS 'Google Scholar cluster_id - groups different versions of the same paper';
COMMENT ON COLUMN public.publications.last_synced_at IS 'Timestamp of last citation count sync from Google Scholar';
