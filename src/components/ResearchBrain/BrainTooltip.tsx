import type { GraphNode } from '@/types/researchBrain';

interface BrainTooltipProps {
  node?: GraphNode;
  x: number;
  y: number;
  visible: boolean;
}

export default function BrainTooltip({ node, x, y, visible }: BrainTooltipProps) {
  if (!visible || !node) return null;

  return (
    <div
      className="absolute pointer-events-none z-10 bg-white/95 backdrop-blur-md border border-slate-200 rounded-lg shadow-lg px-3 py-2 max-w-[260px] transition-opacity duration-150"
      style={{
        left: x + 12,
        top: y - 8,
        opacity: visible ? 1 : 0,
      }}
    >
      {node.type === 'paper' && (
        <>
          {node.isOwn && (
            <span className="text-[10px] font-semibold text-purple-600 uppercase tracking-wide">
              Your paper
            </span>
          )}
          <p className="text-sm font-semibold text-slate-800 leading-tight line-clamp-2">
            {node.title}
          </p>
          {node.authors && node.authors.length > 0 && (
            <p className="text-xs text-slate-500 mt-1 line-clamp-1">
              {node.authors.join(', ')}
            </p>
          )}
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
            {node.year && node.year > 0 && <span>{node.year}</span>}
            {node.dateAdded && (
              <span>{new Date(node.dateAdded + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
            )}
          </div>
        </>
      )}
      {(node.type === 'collection' || node.type === 'category') && (
        <>
          <div className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: node.color }}
            />
            <p className="text-sm font-semibold text-slate-800">
              {node.label}
            </p>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {node.paperCount ?? 0} paper{(node.paperCount ?? 0) !== 1 ? 's' : ''} · {node.category}
          </p>
        </>
      )}
    </div>
  );
}
