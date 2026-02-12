'use client';

import { useEffect, useRef, useState, useCallback, type ReactNode } from 'react';

interface AnimationContainerProps {
  cycleDuration: number;
  aspectRatio?: string;
  className?: string;
  children: ReactNode;
}

export default function AnimationContainer({
  cycleDuration,
  aspectRatio = '800 / 460',
  className,
  children,
}: AnimationContainerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [cycleKey, setCycleKey] = useState(0);
  const [fading, setFading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (fadeTimerRef.current) {
      clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
  }, []);

  const startCycleTimer = useCallback(() => {
    clearTimers();
    const fadeStart = (cycleDuration - 0.5) * 1000;
    fadeTimerRef.current = setTimeout(() => {
      setFading(true);
    }, fadeStart);
    timerRef.current = setTimeout(() => {
      setFading(false);
      setCycleKey((k) => k + 1);
    }, cycleDuration * 1000);
  }, [cycleDuration, clearTimers]);

  // IntersectionObserver for scroll-triggered visibility
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Start/reset cycle timer when visible or cycleKey changes
  useEffect(() => {
    if (isVisible) {
      startCycleTimer();
    } else {
      clearTimers();
      setFading(false);
      // Reset to fresh cycle for next scroll-in
      setCycleKey((k) => k + 1);
    }
    return clearTimers;
  }, [isVisible, cycleKey, startCycleTimer, clearTimers]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ aspectRatio, width: '100%', maxWidth: '800px', margin: '0 auto' }}
    >
      {isVisible && (
        <div
          key={cycleKey}
          style={{
            opacity: fading ? 0 : 1,
            transition: 'opacity 0.5s ease-in-out',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
