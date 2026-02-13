'use client';

import React from 'react';
import { motion } from 'motion/react';

// ─── Timing constants ──────────────────────────
const T = {
  // Phase 1: Original list appears
  prependLabel: 0.5,
  original: 1.2,
  stagger: 0.2,

  // Phase 2: Prepend operation
  newNode: 3.0,
  newArrow: 3.5,
  shared: 4.3,
  prependBadge: 5.0,

  // Phase 3: Append operation
  appendLabel: 7.0,
  fadedOriginal: 7.5,
  copyStart: 8.5,
  copyGap: 0.8,
  appendNode: 10.9,
  appendBadge: 11.8,
};

// ─── Colors ────────────────────────────────────
const C = {
  blue: '#3b82f6',
  green: '#059669',
  red: '#dc2626',
  amber: '#d97706',
  muted: 'var(--text-secondary, #94a3b8)',
  text: 'var(--text, #1a1a2e)',
};

// ─── Animation presets ─────────────────────────
const drop = (delay: number) => ({
  initial: { opacity: 0, y: -8 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { delay, duration: 0.45, ease: 'easeOut' as const },
});

const fade = (delay: number, dur = 0.4) => ({
  initial: { opacity: 0 } as const,
  animate: { opacity: 1 } as const,
  transition: { delay, duration: dur, ease: 'easeOut' as const },
});

const slideLeft = (delay: number) => ({
  initial: { opacity: 0, x: -16 } as const,
  animate: { opacity: 1, x: 0 } as const,
  transition: { delay, duration: 0.5, ease: 'easeOut' as const },
});

// ─── Sub-components ────────────────────────────
function NodeBox({
  value,
  bg,
  delay,
  label,
  labelColor,
}: {
  value: number;
  bg: string;
  delay: number;
  label?: string;
  labelColor?: string;
}) {
  return (
    <motion.div className="flex flex-col items-center gap-0.5" {...drop(delay)}>
      <div
        className="w-10 h-10 rounded-lg font-mono text-sm text-white flex items-center justify-center shrink-0 font-bold"
        style={{ backgroundColor: bg }}
      >
        {value}
      </div>
      {label && (
        <span
          className="text-[10px] font-medium"
          style={{ color: labelColor || C.muted }}
        >
          {label}
        </span>
      )}
    </motion.div>
  );
}

function Arr({ delay }: { delay: number }) {
  return (
    <motion.span
      className="text-sm font-mono shrink-0"
      style={{ color: C.muted }}
      {...fade(delay, 0.3)}
    >
      →
    </motion.span>
  );
}

// ─── Main component ────────────────────────────
const ORIG = [1, 2, 3];

export default function Animation08StructuralSharing() {
  return (
    <div
      className="w-full flex flex-col gap-5 select-none overflow-hidden px-2 py-2"
      role="img"
      aria-label="Linked list prepending is O(1) via structural sharing — only one new node is created and the rest is shared. Appending is O(n) because every node must be copied."
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {/* ═══ PREPEND SECTION ═══ */}
      <div className="flex flex-col items-center gap-2.5">
        <motion.div
          className="text-sm font-semibold font-mono"
          style={{ color: C.text }}
          {...fade(T.prependLabel)}
        >
          <span style={{ color: C.green }}>Prepend</span>{' '}
          <span className="font-normal" style={{ color: C.muted }}>
            [0 | list]
          </span>
        </motion.div>

        <div className="flex items-center gap-1.5">
          {/* New [0] node slides in */}
          <motion.div
            className="flex flex-col items-center gap-0.5"
            {...slideLeft(T.newNode)}
          >
            <div
              className="w-10 h-10 rounded-lg font-mono text-sm text-white flex items-center justify-center shrink-0 font-bold"
              style={{
                backgroundColor: C.green,
                boxShadow: `0 0 0 2px ${C.green}33`,
              }}
            >
              0
            </div>
            <span
              className="text-[10px] font-semibold"
              style={{ color: C.green }}
            >
              new
            </span>
          </motion.div>

          <Arr delay={T.newArrow} />

          {/* Shared chain [1] → [2] → [3] with highlight border */}
          <motion.div
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
            style={{ borderWidth: 2, borderStyle: 'dashed' }}
            initial={{
              borderColor: 'rgba(59,130,246,0)',
              backgroundColor: 'rgba(59,130,246,0)',
            }}
            animate={{
              borderColor: 'rgba(59,130,246,0.35)',
              backgroundColor: 'rgba(59,130,246,0.05)',
            }}
            transition={{ delay: T.shared, duration: 0.6, ease: 'easeOut' }}
          >
            {ORIG.map((v, i) => (
              <React.Fragment key={v}>
                <NodeBox
                  value={v}
                  bg={C.blue}
                  delay={T.original + i * T.stagger}
                />
                {i < ORIG.length - 1 && (
                  <Arr delay={T.original + (i + 1) * T.stagger} />
                )}
              </React.Fragment>
            ))}
          </motion.div>
        </div>

        <motion.span
          className="text-[11px]"
          style={{ color: C.blue }}
          {...fade(T.shared)}
        >
          ↑ shared — no copies made
        </motion.span>

        <motion.div
          className="px-3 py-1 rounded-full text-xs font-bold text-white"
          style={{ backgroundColor: C.green }}
          {...drop(T.prependBadge)}
        >
          O(1) — 1 allocation
        </motion.div>
      </div>

      {/* ═══ DIVIDER ═══ */}
      <div
        className="w-full h-px shrink-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to right, var(--border, #e2e8f0) 0px 4px, transparent 4px 8px)',
        }}
      />

      {/* ═══ APPEND SECTION ═══ */}
      <div className="flex flex-col items-center gap-2.5">
        <motion.div
          className="text-sm font-semibold font-mono"
          style={{ color: C.text }}
          {...fade(T.appendLabel)}
        >
          <span style={{ color: C.red }}>Append</span>{' '}
          <span className="font-normal" style={{ color: C.muted }}>
            list ++ [4]
          </span>
        </motion.div>

        {/* Original list shown faded/dashed */}
        <motion.div
          className="flex items-center gap-1.5"
          {...fade(T.fadedOriginal)}
        >
          {ORIG.map((v, i) => (
            <React.Fragment key={v}>
              <div className="flex flex-col items-center gap-0.5 opacity-30">
                <div
                  className="w-10 h-10 rounded-lg font-mono text-sm flex items-center justify-center shrink-0 border-2 border-dashed"
                  style={{ borderColor: C.blue, color: C.blue }}
                >
                  {v}
                </div>
              </div>
              {i < ORIG.length - 1 && (
                <span
                  className="text-sm font-mono opacity-30"
                  style={{ color: C.muted }}
                >
                  →
                </span>
              )}
            </React.Fragment>
          ))}
          <span
            className="text-[10px] ml-1.5"
            style={{ color: C.muted, opacity: 0.6 }}
          >
            original
          </span>
        </motion.div>

        {/* Copied chain + new [4] node */}
        <div className="flex items-center gap-1.5">
          {ORIG.map((v, i) => (
            <React.Fragment key={v}>
              <NodeBox
                value={v}
                bg={C.amber}
                delay={T.copyStart + i * T.copyGap}
                label="copy"
                labelColor={C.amber}
              />
              <Arr delay={T.copyStart + (i + 1) * T.copyGap - 0.3} />
            </React.Fragment>
          ))}

          <motion.div
            className="flex flex-col items-center gap-0.5"
            {...drop(T.appendNode)}
          >
            <div
              className="w-10 h-10 rounded-lg font-mono text-sm text-white flex items-center justify-center shrink-0 font-bold"
              style={{
                backgroundColor: C.red,
                boxShadow: `0 0 0 2px ${C.red}33`,
              }}
            >
              4
            </div>
            <span
              className="text-[10px] font-semibold"
              style={{ color: C.red }}
            >
              new
            </span>
          </motion.div>
        </div>

        <motion.div
          className="px-3 py-1 rounded-full text-xs font-bold text-white"
          style={{ backgroundColor: C.red }}
          {...drop(T.appendBadge)}
        >
          O(n) — 3 copies + 1 new
        </motion.div>
      </div>
    </div>
  );
}
