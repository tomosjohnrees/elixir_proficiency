"use client";

import Link from "next/link";
import { motion } from "motion/react";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function SiteHeader() {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm"
      initial={{ y: -56 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <span className="text-accent">&#9670;</span>
          <span>Code Proficiency</span>
        </Link>
        <ThemeToggle />
      </div>
    </motion.header>
  );
}
