import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useAnalytics() {
  const sessionIdRef = useRef(generateSessionId());
  const enteredAtRef = useRef(Date.now());
  const rowIdRef = useRef<string | null>(null);

  // Insert page view on mount
  useEffect(() => {
    const insertPageView = async () => {
      const { data } = await supabase
        .from('page_views')
        .insert({
          session_id: sessionIdRef.current,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent || null,
        })
        .select('id')
        .single();

      if (data) rowIdRef.current = data.id;
    };

    insertPageView();
  }, []);

  // Update duration on leave
  useEffect(() => {
    const updateDuration = () => {
      if (!rowIdRef.current) return;

      const duration = Math.round((Date.now() - enteredAtRef.current) / 1000);
      const body = JSON.stringify({
        left_at: new Date().toISOString(),
        duration_seconds: duration,
      });

      // Use sendBeacon for reliability on page unload
      const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/page_views?id=eq.${rowIdRef.current}`;
      navigator.sendBeacon(
        url,
        new Blob([body], { type: 'application/json' })
      );
    };

    // sendBeacon doesn't support PATCH with auth headers reliably,
    // so fall back to a regular update on visibilitychange
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden' && rowIdRef.current) {
        const duration = Math.round((Date.now() - enteredAtRef.current) / 1000);
        supabase
          .from('page_views')
          .update({
            left_at: new Date().toISOString(),
            duration_seconds: duration,
          })
          .eq('id', rowIdRef.current)
          .then(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('beforeunload', updateDuration);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('beforeunload', updateDuration);
    };
  }, []);

  const trackClick = useCallback((element: string, metadata?: Record<string, unknown>) => {
    supabase
      .from('click_events')
      .insert({
        session_id: sessionIdRef.current,
        element,
        metadata: metadata || {},
      })
      .then(() => {});
  }, []);

  return { trackClick };
}
