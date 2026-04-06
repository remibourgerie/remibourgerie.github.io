-- Rename conference_url → venue_url
ALTER TABLE public.publications RENAME COLUMN conference_url TO venue_url;

-- Migrate proceeding_url into url where url is empty
UPDATE public.publications
SET url = proceeding_url
WHERE proceeding_url IS NOT NULL AND (url IS NULL OR url = '');

-- Drop proceeding_url
ALTER TABLE public.publications DROP COLUMN IF EXISTS proceeding_url;
