"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  getPrerequisites,
  getTopicBySlug,
  getTopicCategory,
  categoryMeta,
} from "@/data/topic-relationships";

interface TopicPrerequisitesProps {
  slug: string;
}

export default function TopicPrerequisites({ slug }: TopicPrerequisitesProps) {
  const prereqs = getPrerequisites(slug);
  if (prereqs.length === 0) return null;

  return (
    <motion.div
      className="mt-3 flex flex-wrap items-center gap-2"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="text-xs text-muted font-medium uppercase tracking-wider">
        Prerequisites:
      </span>
      {prereqs.map((prereqSlug) => {
        const topic = getTopicBySlug(prereqSlug);
        if (!topic) return null;
        const cat = getTopicCategory(prereqSlug);
        const color = cat ? categoryMeta[cat].color : "var(--muted)";

        return (
          <Link
            key={prereqSlug}
            href={`/topics/${prereqSlug}`}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-border hover:border-accent bg-surface transition-colors"
          >
            <span className="font-mono font-bold" style={{ color }}>
              {String(topic.number).padStart(2, "0")}
            </span>
            <span>{topic.title}</span>
          </Link>
        );
      })}
    </motion.div>
  );
}
