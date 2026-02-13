"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  topicGraph,
  categoryMeta,
  categoryOrder,
  getNextTopics,
  getTopicBySlug,
} from "@/data/topic-relationships";
import { fadeUp, stagger } from "@/lib/motion";

export default function ConceptMapList() {
  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      {categoryOrder.map((cat) => {
        const meta = categoryMeta[cat];
        const nodes = topicGraph.nodes.filter((n) => n.category === cat);
        if (nodes.length === 0) return null;

        return (
          <motion.div key={cat} variants={fadeUp}>
            <h3
              className="text-sm font-bold mb-2 uppercase tracking-wider"
              style={{ color: meta.color }}
            >
              {meta.label}
            </h3>
            <div className="space-y-1.5">
              {nodes.map((node) => {
                const topic = getTopicBySlug(node.slug);
                if (!topic) return null;
                const nextCount = getNextTopics(node.slug).length;

                return (
                  <Link
                    key={node.slug}
                    href={`/topics/${node.slug}`}
                    className="flex items-center gap-2 p-2.5 rounded-lg border border-border hover:border-accent bg-surface transition-colors group"
                  >
                    <span
                      className="text-xs font-mono font-bold min-w-[1.5rem]"
                      style={{ color: meta.color }}
                    >
                      {String(topic.number).padStart(2, "0")}
                    </span>
                    <span className="text-sm font-medium flex-1 group-hover:text-accent transition-colors">
                      {topic.title}
                    </span>
                    {nextCount > 0 && (
                      <span className="text-xs text-muted">
                        &#8594; {nextCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
