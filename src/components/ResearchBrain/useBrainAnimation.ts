import { useState, useRef, useEffect, useCallback } from 'react';

interface UseBrainAnimationOptions {
  totalSteps: number;
  stepInterval?: number;
  pauseAtEnd?: number;
  isVisible?: boolean;
}

interface UseBrainAnimationReturn {
  currentStep: number;
  isRestarting: boolean;
  reset: () => void;
}

export function useBrainAnimation({
  totalSteps,
  stepInterval = 200,
  pauseAtEnd = 3000,
  isVisible = true,
}: UseBrainAnimationOptions): UseBrainAnimationReturn {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRestarting, setIsRestarting] = useState(false);
  const rafRef = useRef<number>(0);
  const stepRef = useRef(0);
  const lastTimeRef = useRef(0);
  const pausingRef = useRef(false);

  useEffect(() => {
    if (totalSteps <= 0 || !isVisible) {
      cancelAnimationFrame(rafRef.current);
      return;
    }

    lastTimeRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - lastTimeRef.current;

      if (pausingRef.current) {
        // Waiting at end before restarting
        if (elapsed >= pauseAtEnd) {
          pausingRef.current = false;
          stepRef.current = 0;
          lastTimeRef.current = now;
          setCurrentStep(0);
          setIsRestarting(false);
        }
      } else if (elapsed >= stepInterval) {
        stepRef.current += 1;
        lastTimeRef.current = now;

        if (stepRef.current >= totalSteps) {
          // Reached end — start pause
          stepRef.current = totalSteps - 1;
          pausingRef.current = true;
          setCurrentStep(totalSteps - 1);
          setIsRestarting(true);
        } else {
          setCurrentStep(stepRef.current);
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafRef.current);
  }, [totalSteps, stepInterval, pauseAtEnd, isVisible]);

  const reset = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    stepRef.current = 0;
    pausingRef.current = false;
    setCurrentStep(0);
    setIsRestarting(false);
  }, []);

  return { currentStep, isRestarting, reset };
}
