"use client";

import { motion } from "motion/react";
import SectionNav from "./SectionNav";
import TopicPrerequisites from "@/components/topic-sections/TopicPrerequisites";

interface TopicLayoutProps {
  title: string;
  description: string;
  slug?: string;
  courseSlug?: string;
  hasGotchas?: boolean;
  children: React.ReactNode;
}

export default function TopicLayout({
  title,
  description,
  slug,
  courseSlug,
  hasGotchas,
  children,
}: TopicLayoutProps) {
  return (
    <>
      <SectionNav hasGotchas={hasGotchas} />
      <main className="max-w-5xl mx-auto px-4 pt-8 pb-24">
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-muted text-lg">{description}</p>
          {slug && <TopicPrerequisites slug={slug} courseSlug={courseSlug || ""} />}
        </motion.div>
        <div className="space-y-16">{children}</div>
      </main>
    </>
  );
}
