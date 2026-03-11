import { useState, useEffect, useRef, useCallback } from 'react';
import type { ResearchBrainData, GraphNode } from '@/types/researchBrain';
import { useBrainAnimation } from './useBrainAnimation';
import BrainCanvas from './BrainCanvas';
import BrainTooltip from './BrainTooltip';

export default function ResearchBrain() {
  const [data, setData] = useState<ResearchBrainData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [isVisible, setIsVisible] = useState(false);
  const [tooltip, setTooltip] = useState<{
    node?: GraphNode;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    fetch('/research-brain.json')
      .then(res => {
        if (!res.ok) throw new Error('Research brain data not found');
        return res.json();
      })
      .then((d: ResearchBrainData) => setData(d))
      .catch(e => setError(e.message));
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = Math.min(w * 0.6, window.innerHeight * 0.65);
        setDimensions({ width: w, height: Math.max(300, h) });
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.5 }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const animation = useBrainAnimation({
    totalSteps: data?.meta.timeSteps ?? 0,
    stepInterval: 400,
    pauseAtEnd: 5000,
    isVisible,
  });

  const currentDate = data
    ? data.nodes.find(n => n.type === 'paper' && n.timeStep === animation.currentStep)?.dateAdded ?? ''
    : '';

  const formattedDate = currentDate
    ? new Date(currentDate + 'T00:00:00').toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    : '';

  const visiblePapers = data
    ? data.nodes.filter(n => n.type === 'paper' && n.timeStep <= animation.currentStep).length
    : 0;

  const handleHover = useCallback(
    (info: { node?: GraphNode; x: number; y: number } | null) => {
      setTooltip(info);
    },
    []
  );

  const handleClick = useCallback((node?: GraphNode) => {
    if (node?.url) {
      window.open(node.url, '_blank', 'noopener,noreferrer');
    }
  }, []);

  if (error) {
    return (
      <div className="text-center py-12 text-foreground/50">
        <p className="text-sm">Research evolution data not available yet.</p>
        <p className="text-xs mt-1">Run the preprocessing script to generate it.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="animate-pulse rounded-xl bg-slate-100" style={{ height: 400 }} />
    );
  }

  return (
    <div ref={containerRef} className="relative w-full rounded-xl border border-border/40 bg-card/30">
      <BrainCanvas
        data={data}
        currentStep={animation.currentStep}
        isRestarting={animation.isRestarting}
        width={dimensions.width}
        height={dimensions.height}
        onHover={handleHover}
        onClick={handleClick}
      />
      <BrainTooltip
        node={tooltip?.node}
        x={tooltip?.x ?? 0}
        y={tooltip?.y ?? 0}
        visible={tooltip !== null}
      />

      {/* Paper counter */}
      <span className="absolute bottom-3 left-4 text-xs text-foreground/40 pointer-events-none">
        {visiblePapers} / {data.meta.totalPapers} papers
      </span>

      {/* Date label */}
      {formattedDate && (
        <span className="absolute bottom-3 right-4 text-xs font-mono text-foreground/40 pointer-events-none">
          {formattedDate}
        </span>
      )}
    </div>
  );
}
