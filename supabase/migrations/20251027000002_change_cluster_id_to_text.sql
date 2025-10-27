-- Change scholar_cluster_id from BIGINT to TEXT to handle very large cluster IDs
-- Google Scholar cluster IDs can exceed PostgreSQL BIGINT max value (9,223,372,036,854,775,807)
-- Example: 11472371484488809260 is larger than BIGINT can handle

-- Change the column type from BIGINT to TEXT
-- PostgreSQL will automatically convert existing BIGINT values to TEXT
ALTER TABLE public.publications
ALTER COLUMN scholar_cluster_id TYPE TEXT
USING scholar_cluster_id::TEXT;

-- Update the comment to reflect the new type
COMMENT ON COLUMN public.publications.scholar_cluster_id IS 'Google Scholar cluster_id (stored as TEXT to handle large numbers) - groups different versions of the same paper';
