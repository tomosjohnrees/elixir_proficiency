"use client";

import Link from "next/link";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import {
  getNextTopics,
  getTopicBySlug,
  getTopicCategory,
  getEdgeStrength,
  categoryMeta,
} from "@/data/courses/elixir/topic-relationships";
import { fadeUp, stagger } from "@/lib/motion";

interface TopicNextUpProps {
  slug: string;
  courseSlug: string;
}

export default function TopicNextUp({ slug, courseSlug }: TopicNextUpProps) {
  const nextSlugs = getNextTopics(slug);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  if (nextSlugs.length === 0) return null;

  const strongNext = nextSlugs.filter(
    (s) => getEdgeStrength(slug, s) === "strong"
  );
  const otherNext = nextSlugs.filter(
    (s) => getEdgeStrength(slug, s) !== "strong"
  );

  return (
    <section ref={ref} className="mt-16 pt-8 border-t border-border">
      <motion.h2
        className="text-xl font-bold mb-4"
        initial={{ opacity: 0, y: 8 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="text-accent mr-2">&#8594;</span>
        Next Up
      </motion.h2>

      {strongNext.length > 0 && (
        <motion.div
          className="grid gap-3 sm:grid-cols-2 mb-4"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
        >
          {strongNext.map((nextSlug) => {
            const topic = getTopicBySlug(nextSlug);
            if (!topic) return null;
            const cat = getTopicCategory(nextSlug);
            const color = cat ? categoryMeta[cat].color : "var(--accent)";

            return (
              <motion.div key={nextSlug} variants={fadeUp}>
                <Link
                  href={`/${courseSlug}/topics/${nextSlug}`}
                  className="block rounded-xl border border-border p-4 hover:border-accent hover:shadow-md transition-all bg-surface group"
                  style={{ borderLeftColor: color, borderLeftWidth: 3 }}
                >
                  <div className="flex items-start gap-2">
                    <span
                      className="text-xs font-mono font-bold mt-0.5"
                      style={{ color }}
                    >
                      {String(topic.number).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-semibold group-hover:text-accent transition-colors text-sm">
                        {topic.title}
                      </h3>
                      <p className="text-xs text-muted mt-1">
                        {topic.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {otherNext.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <p className="text-xs text-muted mb-2 uppercase tracking-wider font-medium">
            Also related
          </p>
          <div className="flex flex-wrap gap-2">
            {otherNext.map((nextSlug) => {
              const topic = getTopicBySlug(nextSlug);
              if (!topic) return null;

              return (
                <Link
                  key={nextSlug}
                  href={`/${courseSlug}/topics/${nextSlug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-border hover:border-accent bg-surface transition-colors"
                >
                  <span className="font-mono font-bold text-accent">
                    {String(topic.number).padStart(2, "0")}
                  </span>
                  {topic.title}
                </Link>
              );
            })}
          </div>
        </motion.div>
      )}
    </section>
  );
}
