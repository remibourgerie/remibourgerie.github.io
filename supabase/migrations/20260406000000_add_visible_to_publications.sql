-- Add visible column to publications
-- Default true for existing rows, but we'll set non-first-author papers to false below
ALTER TABLE public.publications ADD COLUMN IF NOT EXISTS visible boolean NOT NULL DEFAULT true;

-- Hide publications where Bourgerie is not the first author
UPDATE public.publications
SET visible = false
WHERE authors[1] NOT ILIKE '%Bourgerie%';
