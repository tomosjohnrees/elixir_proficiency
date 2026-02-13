"use client";

import { useState } from "react";
import { motion } from "motion/react";

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function Collapsible({
  title,
  children,
  defaultOpen = false,
}: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-surface hover:bg-surface-2 transition-colors text-left font-medium"
      >
        <span>{title}</span>
        <motion.svg
          className="w-5 h-5 text-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </motion.svg>
      </button>
      <motion.div
        initial={defaultOpen ? { height: "auto" } : { height: 0 }}
        animate={{ height: open ? "auto" : 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden"
      >
        <div className="px-4 py-3">{children}</div>
      </motion.div>
    </div>
  );
}
