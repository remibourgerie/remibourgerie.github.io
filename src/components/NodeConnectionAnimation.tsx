import { useEffect, useState } from 'react';

interface NodeConnectionAnimationProps {
  startPos: { x: number; y: number };
  endX: number;
  onComplete?: () => void;
}

const NodeConnectionAnimation = ({ startPos, endX, onComplete }: NodeConnectionAnimationProps) => {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // Complete animation after line drawing + fade out
    const timer = setTimeout(() => {
      setIsAnimating(false);
      onComplete?.();
    }, 400);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isAnimating) return null;

  // Calculate path from node center to panel left edge
  // The panel is typically on the right side of the screen
  const startX = startPos.x;
  const startY = startPos.y;
  const endY = startPos.y; // Keep line horizontal-ish for better visual

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1000 }}
    >
      <defs>
        <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <path
        d={`M ${startX} ${startY} L ${endX} ${endY}`}
        stroke="url(#connectionGradient)"
        strokeWidth="2"
        strokeDasharray="8 4"
        fill="none"
        className="animate-draw-line"
        style={{
          strokeDashoffset: 1000,
          animation: 'drawLine 300ms ease-out forwards, fadeOut 100ms 300ms ease-out forwards',
        }}
      />
      <style>{`
        @keyframes drawLine {
          to {
            strokeDashoffset: 0;
          }
        }

        @keyframes fadeOut {
          to {
            opacity: 0;
          }
        }
      `}</style>
    </svg>
  );
};

export default NodeConnectionAnimation;
