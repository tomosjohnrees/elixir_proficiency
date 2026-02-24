"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { fadeUp, stagger } from "@/lib/motion";
import ConceptMap from "@/components/concept-map/ConceptMap";
import type { CourseMeta, TopicMeta } from "@/lib/types";

interface CoursePageContentProps {
  course: CourseMeta;
  courseSlug: string;
  topicRegistry: TopicMeta[];
}

export default function CoursePageContent({ course, courseSlug, topicRegistry }: CoursePageContentProps) {
  const [view, setView] = useState<"grid" | "map">("grid");

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <motion.div
        className="text-center mb-12"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <h1 className="text-4xl font-bold mb-3">
          <span className="text-accent">{course.icon}</span> {course.title}
        </h1>
        <p className="text-lg text-muted max-w-2xl mx-auto">
          {course.description}. Each topic builds on the last with
          5 learning stages: ELI5, Visuals, Deep Dive, Quiz, and Practice.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      >
        <Link
          href={`/${courseSlug}/quiz`}
          className="block rounded-xl border-2 border-accent bg-accent-faint p-6 mb-8 hover:shadow-lg transition-all group"
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl">&#9889;</span>
            <div>
              <h2 className="text-lg font-bold group-hover:text-accent transition-colors">
                Random Quiz
              </h2>
              <p className="text-sm text-muted mt-0.5">
                Test yourself with 10 random questions from across all {course.topicCount} topics
              </p>
            </div>
          </div>
        </Link>
      </motion.div>

      <div className="flex items-center justify-end gap-2 mb-4">
        <span className="text-sm text-muted">View:</span>
        <button
          onClick={() => setView("grid")}
          className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
            view === "grid"
              ? "border-accent text-accent bg-accent-faint"
              : "border-border text-muted hover:border-accent/50"
          }`}
        >
          Grid
        </button>
        <button
          onClick={() => setView("map")}
          className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
            view === "map"
              ? "border-accent text-accent bg-accent-faint"
              : "border-border text-muted hover:border-accent/50"
          }`}
        >
          Concept Map
        </button>
      </div>

      {view === "map" ? (
        <ConceptMap courseSlug={courseSlug} />
      ) : (
        <motion.div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          {topicRegistry.map((topic) => (
            <motion.div key={topic.slug} variants={fadeUp} className="h-full">
              {topic.active ? (
                <motion.div
                  className="h-full"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Link
                    href={`/${courseSlug}/topics/${topic.slug}`}
                    className="block h-full rounded-xl border border-border p-5 hover:border-accent hover:shadow-md transition-all bg-surface group"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-sm font-mono text-accent font-bold mt-0.5">
                        {String(topic.number).padStart(2, "0")}
                      </span>
                      <div>
                        <h2 className="font-semibold group-hover:text-accent transition-colors">
                          {topic.title}
                        </h2>
                        <p className="text-sm text-muted mt-1">{topic.description}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ) : (
                <div className="block h-full rounded-xl border border-border p-5 opacity-50 bg-surface">
                  <div className="flex items-start gap-3">
                    <span className="text-sm font-mono text-muted font-bold mt-0.5">
                      {String(topic.number).padStart(2, "0")}
                    </span>
                    <div>
                      <h2 className="font-semibold">{topic.title}</h2>
                      <p className="text-sm text-muted mt-1">{topic.description}</p>
                      <span className="inline-block text-xs font-medium text-muted mt-2 px-2 py-0.5 rounded-full bg-surface-2">
                        Coming Soon
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </main>
  );
}
