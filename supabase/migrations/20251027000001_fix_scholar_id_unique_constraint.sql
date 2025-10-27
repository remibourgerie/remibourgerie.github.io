-- Fix the UNIQUE constraint on scholar_id to allow multiple NULL values
-- PostgreSQL UNIQUE constraints allow multiple NULLs by default, but we want to be explicit
-- and use a partial unique index for better clarity and performance

-- First, drop the UNIQUE constraint if it exists (it was added as a column constraint)
ALTER TABLE public.publications
DROP CONSTRAINT IF EXISTS publications_scholar_id_key;

-- Create a partial unique index that only applies to non-NULL scholar_id values
-- This ensures that:
-- 1. Multiple publications can have NULL scholar_id (manually added publications)
-- 2. No two publications can have the same non-NULL scholar_id (no duplicates from Scholar)
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_scholar_id
ON public.publications(scholar_id)
WHERE scholar_id IS NOT NULL;

-- Add comment to explain the constraint
COMMENT ON INDEX public.idx_unique_scholar_id IS 'Ensures scholar_id uniqueness only for non-NULL values, allowing multiple manually-added publications without scholar_id';
