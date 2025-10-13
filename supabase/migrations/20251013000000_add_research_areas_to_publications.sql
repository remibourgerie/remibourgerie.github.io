-- Add research_areas column to publications table
ALTER TABLE public.publications
ADD COLUMN IF NOT EXISTS research_areas TEXT[] DEFAULT '{}';

-- Add comment to explain the column
COMMENT ON COLUMN public.publications.research_areas IS 'Array of research node IDs (e.g., graph-ml, network-science, federated-learning) that this publication relates to';

-- Update existing publication to link to research areas
UPDATE public.publications
SET research_areas = ARRAY['graph-ml', 'network-science', 'federated-learning']
WHERE title = 'Fault Detection in Telecom Networks Using Bi-Level Federated Graph Neural Networks';
