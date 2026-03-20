import { useState, useRef, useEffect, useCallback } from 'react';

interface UseBrainAnimationOptions {
  totalSteps: number;
  stepInterval?: number;   // ms between steps, default 400
  pauseAtEnd?: number;     // ms to pause before restarting, default 2000
  isVisible?: boolean;     // only animate when visible
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
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (totalSteps <= 0 || !isVisible) {
      clearTimer();
      return;
    }

    const advance = () => {
      setCurrentStep(prev => {
        const next = prev + 1;
        if (next >= totalSteps) {
          // Reached end — pause then restart
          setIsRestarting(true);
          timerRef.current = setTimeout(() => {
            setIsRestarting(false);
            setCurrentStep(0);
            // Schedule next tick after reset
            timerRef.current = setTimeout(advance, stepInterval);
          }, pauseAtEnd);
          return prev;
        }
        timerRef.current = setTimeout(advance, stepInterval);
        return next;
      });
    };

    timerRef.current = setTimeout(advance, stepInterval);
    return clearTimer;
  }, [totalSteps, stepInterval, pauseAtEnd, clearTimer, isVisible]);

  const reset = useCallback(() => {
    clearTimer();
    setCurrentStep(0);
    setIsRestarting(false);
  }, [clearTimer]);

  return { currentStep, isRestarting, reset };
}
