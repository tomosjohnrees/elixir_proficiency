'use client';

import React from 'react';
import { motion } from 'motion/react';

// ─── Timing ────────────────────────────────────
const T = {
  // Phase 1: Multi-element split
  title: 0.5,
  code1: 1.2,
  nodes: 2.2,
  STAGGER: 0.18,
  split: 5.0,
  headLabel: 6.5,
  tailLabel: 6.8,
  // Phase 2: Single element
  divider: 8.5,
  code2: 9.0,
  node2: 9.8,
  colorChange: 11.5,
  headLabel2: 12.5,
  empty: 12.8,
};

// ─── Colors ────────────────────────────────────
const C = {
  blue: '#3b82f6',
  green: '#059669',
  muted: 'var(--text-secondary, #94a3b8)',
  text: 'var(--text, #1a1a2e)',
};

// ─── Presets ───────────────────────────────────
const fade = (delay: number, duration = 0.4) => ({
  initial: { opacity: 0 } as const,
  animate: { opacity: 1 } as const,
  transition: { delay, duration, ease: 'easeOut' as const },
});

const drop = (delay: number) => ({
  initial: { opacity: 0, y: -8 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { delay, duration: 0.4, ease: 'easeOut' as const },
});

const pop = (delay: number) => ({
  initial: { opacity: 0, scale: 0.5 } as const,
  animate: { opacity: 1, scale: 1 } as const,
  transition: { delay, duration: 0.35, ease: 'easeOut' as const },
});

// ─── Sub-components ────────────────────────────
function Node({ value, delay }: { value: number; delay: number }) {
  return (
    <motion.div
      className="w-10 h-10 rounded-full font-mono text-sm font-bold text-white
        flex items-center justify-center shrink-0"
      style={{ backgroundColor: C.blue }}
      {...pop(delay)}
    >
      {value}
    </motion.div>
  );
}

function NodeArrow({ delay }: { delay: number }) {
  return (
    <motion.span
      className="font-mono text-base leading-none"
      style={{ color: C.muted }}
      {...fade(delay, 0.3)}
    >
      →
    </motion.span>
  );
}

// ─── Main ──────────────────────────────────────
export default function Animation13HeadTail() {
  const nd = (i: number) => T.nodes + i * T.STAGGER;
  const ad = (i: number) => T.nodes + (i + 0.5) * T.STAGGER;

  return (
    <div
      className="w-full flex flex-col items-center gap-6 select-none overflow-hidden py-3"
      role="img"
      aria-label="Animation showing [head | tail] list destructuring: the first element detaches as head while remaining elements form the tail. Also shows a single-element list where tail becomes empty."
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {/* ═══ Phase 1: Multi-element split ═══ */}
      <div className="flex flex-col items-center gap-3">
        <motion.div
          className="text-sm font-semibold tracking-wide"
          style={{ color: C.text }}
          {...drop(T.title)}
        >
          [head | tail] Destructuring
        </motion.div>

        <motion.code
          className="text-xs px-3 py-1 rounded"
          style={{ color: C.muted, backgroundColor: 'rgba(0,0,0,0.04)' }}
          {...fade(T.code1)}
        >
          [head | tail] = [1, 2, 3, 4]
        </motion.code>

        {/* Linked list with split animation */}
        <div className="pt-14 pb-7">
          <div className="flex items-center gap-2">
            {/* Node 1: detaches upward as head */}
            <motion.div
              className="relative"
              animate={{ y: -48 }}
              transition={{ delay: T.split, duration: 0.7, ease: 'easeInOut' }}
            >
              <motion.div
                className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap
                  font-mono text-xs font-bold"
                style={{ color: C.green }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: T.headLabel, duration: 0.4, ease: 'easeOut' }}
              >
                head = 1
              </motion.div>
              <motion.div
                className="w-10 h-10 rounded-full font-mono text-sm font-bold text-white
                  flex items-center justify-center shrink-0"
                initial={{ opacity: 0, scale: 0.5, backgroundColor: C.blue }}
                animate={{ opacity: 1, scale: 1, backgroundColor: C.green }}
                transition={{
                  opacity: { delay: nd(0), duration: 0.35, ease: 'easeOut' },
                  scale: { delay: nd(0), duration: 0.35, ease: 'easeOut' },
                  backgroundColor: { delay: T.split, duration: 0.5, ease: 'easeOut' },
                }}
              >
                1
              </motion.div>
            </motion.div>

            {/* Arrow 1→2: fades on split */}
            <motion.div
              animate={{ opacity: 0 }}
              transition={{ delay: T.split, duration: 0.3 }}
            >
              <NodeArrow delay={ad(0)} />
            </motion.div>

            {/* Tail: nodes 2, 3, 4 */}
            <div className="relative flex items-center gap-2">
              <Node value={2} delay={nd(1)} />
              <NodeArrow delay={ad(1)} />
              <Node value={3} delay={nd(2)} />
              <NodeArrow delay={ad(2)} />
              <Node value={4} delay={nd(3)} />
              <motion.div
                className="absolute -bottom-6 left-0 right-0 text-center
                  whitespace-nowrap font-mono text-xs font-bold"
                style={{ color: C.blue }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: T.tailLabel, duration: 0.4, ease: 'easeOut' }}
              >
                tail = [2, 3, 4]
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Divider ─── */}
      <motion.div
        className="w-3/4 h-px"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to right, var(--border, #e2e8f0) 0px 6px, transparent 6px 12px)',
        }}
        {...fade(T.divider, 0.5)}
      />

      {/* ═══ Phase 2: Single element — tail = [] ═══ */}
      <div className="flex flex-col items-center gap-3">
        <motion.code
          className="text-xs px-3 py-1 rounded"
          style={{ color: C.muted, backgroundColor: 'rgba(0,0,0,0.04)' }}
          {...fade(T.code2)}
        >
          [head | tail] = [42]
        </motion.code>

        <div className="flex items-start justify-center gap-8 pt-1">
          {/* Head */}
          <div className="flex flex-col items-center gap-1.5">
            <motion.div
              className="w-10 h-10 rounded-full font-mono text-sm font-bold text-white
                flex items-center justify-center shrink-0"
              initial={{ opacity: 0, scale: 0.5, backgroundColor: C.blue }}
              animate={{ opacity: 1, scale: 1, backgroundColor: C.green }}
              transition={{
                opacity: { delay: T.node2, duration: 0.35, ease: 'easeOut' },
                scale: { delay: T.node2, duration: 0.35, ease: 'easeOut' },
                backgroundColor: { delay: T.colorChange, duration: 0.5, ease: 'easeOut' },
              }}
            >
              42
            </motion.div>
            <motion.span
              className="font-mono text-xs font-bold"
              style={{ color: C.green }}
              {...fade(T.headLabel2)}
            >
              head = 42
            </motion.span>
          </div>

          {/* Tail: empty list */}
          <motion.div
            className="flex flex-col items-center gap-1.5"
            {...fade(T.empty)}
          >
            <div
              className="w-10 h-10 rounded-lg border-2 border-dashed
                flex items-center justify-center font-mono text-xs font-bold"
              style={{ borderColor: C.muted, color: C.muted }}
            >
              [ ]
            </div>
            <span className="font-mono text-xs font-bold" style={{ color: C.muted }}>
              tail = [ ]
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
