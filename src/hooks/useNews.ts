import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface NewsItem {
  id: string;
  date: string; // YYYY-MM-DD format
  title?: string;
  content: string;
  link_url?: string;
  link_text?: string;
  link_internal?: boolean;
  display_order: number;
}

interface UseNewsResult {
  news: NewsItem[];
  loading: boolean;
  error: string | null;
}

export function useNews(limit: number = 4): UseNewsResult {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: supabaseError } = await supabase
          .from('news')
          .select('*')
          .eq('published', true)
          .order('date', { ascending: false })
          .order('display_order', { ascending: true })
          .limit(limit);

        if (supabaseError) {
          throw new Error(`Failed to fetch news: ${supabaseError.message}`);
        }

        setNews(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch news');
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, [limit]);

  return { news, loading, error };
}
