"use client";

import { useMemo, useEffect, useState } from "react";
import { motion } from "motion/react";

const BASE_SECTIONS = [
  { id: "eli5", label: "ELI5" },
  { id: "visuals", label: "Visuals" },
  { id: "deep-dive", label: "Deep Dive" },
];

const POST_SECTIONS = [
  { id: "quiz", label: "Quiz" },
  { id: "practice", label: "Practice" },
];

interface SectionNavProps {
  hasGotchas?: boolean;
}

export default function SectionNav({ hasGotchas }: SectionNavProps) {
  const SECTIONS = useMemo(() => {
    const sections = [...BASE_SECTIONS];
    if (hasGotchas) {
      sections.push({ id: "gotchas", label: "Gotchas" });
    }
    sections.push(...POST_SECTIONS);
    return sections;
  }, [hasGotchas]);
  const [active, setActive] = useState("eli5");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActive(id);
          }
        },
        { rootMargin: "-20% 0px -70% 0px" }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <nav className="sticky top-14 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 flex gap-1 overflow-x-auto">
        {SECTIONS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className={`relative px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
              active === id
                ? "text-accent"
                : "text-muted hover:text-foreground"
            }`}
          >
            {label}
            {active === id && (
              <motion.div
                layoutId="section-underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
