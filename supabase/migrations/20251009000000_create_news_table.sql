-- Create news/updates table for homepage timeline
CREATE TABLE IF NOT EXISTS public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  link_url TEXT,
  link_text TEXT,
  link_internal BOOLEAN DEFAULT false, -- true for #publications, false for external URLs
  display_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Public read access for published news
CREATE POLICY "News items are publicly readable"
  ON public.news FOR SELECT
  USING (published = true);

-- Admin write access (reuse admin_users table from publications system)
CREATE POLICY "Admins can manage news"
  ON public.news FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Index for efficient querying
CREATE INDEX idx_news_date ON public.news(date DESC);
CREATE INDEX idx_news_display_order ON public.news(display_order);
CREATE INDEX idx_news_published ON public.news(published);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_news_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_news_timestamp
  BEFORE UPDATE ON public.news
  FOR EACH ROW
  EXECUTE FUNCTION update_news_updated_at();

-- Add some example data structure comments
COMMENT ON TABLE public.news IS 'News and updates for homepage timeline. Shows last 4 by default.';
COMMENT ON COLUMN public.news.date IS 'Display date in YYYY-MM-DD format';
COMMENT ON COLUMN public.news.title IS 'Optional title/heading for the news item';
COMMENT ON COLUMN public.news.content IS 'Main text content (supports inline HTML links)';
COMMENT ON COLUMN public.news.link_url IS 'Optional standalone link URL';
COMMENT ON COLUMN public.news.link_text IS 'Text for the standalone link';
COMMENT ON COLUMN public.news.link_internal IS 'true for anchor links (#publications), false for external URLs';
COMMENT ON COLUMN public.news.display_order IS 'Manual ordering (lower = appears first). Date is primary sort.';
