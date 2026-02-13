'use client';

import React from 'react';
import { motion } from 'motion/react';

// ─── Timing constants ──────────────────────────────────
const T = {
  input: 1.2,
  // Eager: column-by-column
  eMap: 3.5,
  eFilter: 6,
  eTake: 8.5,
  eCounter: 10,
  // Lazy: row-by-row
  lR1Map: 3,
  lR1Filter: 4.2,
  lR1Take: 5.3,
  lR2Map: 6.6,
  lR2Filter: 7.7,
  lR2Take: 8.8,
  lDone: 9.2,
  lStop: 9.8,
  lCounter: 10.8,
};

const STAGGER = 0.06;

// ─── Colors ─────────────────────────────────────────────
const C = {
  blue: '#3b82f6',
  violet: '#8b5cf6',
  green: '#059669',
  red: '#dc2626',
  muted: 'var(--text-secondary, #94a3b8)',
  text: 'var(--text, #1a1a2e)',
};

// ─── Animation presets ──────────────────────────────────
const drop = (delay: number) => ({
  initial: { opacity: 0, y: -6 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { delay, duration: 0.4, ease: 'easeOut' as const },
});

const fade = (delay: number, duration = 0.4) => ({
  initial: { opacity: 0 } as const,
  animate: { opacity: 1 } as const,
  transition: { delay, duration },
});

// ─── Reusable components ────────────────────────────────
function Dot({ value, bg, delay }: { value: React.ReactNode; bg: string; delay: number }) {
  return (
    <motion.div
      className="w-6.5 h-6.5 rounded-full text-[11px] font-mono text-white
        flex items-center justify-center shrink-0 leading-none"
      style={{ backgroundColor: bg }}
      {...drop(delay)}
    >
      {value}
    </motion.div>
  );
}

function FailDot({ value, delay }: { value: React.ReactNode; delay: number }) {
  return (
    <motion.div
      className="w-6.5 h-6.5 rounded-full text-[10px] font-mono
        flex items-center justify-center shrink-0 leading-none relative"
      style={{ border: `2px solid ${C.red}`, color: C.red }}
      {...drop(delay)}
    >
      <span className="relative z-10">{value}</span>
      <span
        className="absolute w-4 h-0.5 rounded"
        style={{ backgroundColor: C.red, opacity: 0.7 }}
      />
    </motion.div>
  );
}

function SkipDot({ delay }: { delay: number }) {
  return (
    <motion.div
      className="w-6.5 h-6.5 rounded-full text-[13px] font-mono
        flex items-center justify-center shrink-0 leading-none"
      style={{
        border: '1.5px dashed var(--text-secondary, #94a3b8)',
        color: C.muted,
      }}
      {...drop(delay)}
    />
  );
}

function DashSlot({ delay }: { delay: number }) {
  return (
    <motion.div
      className="w-6.5 h-6.5 text-sm font-mono flex items-center justify-center shrink-0"
      style={{ color: C.muted }}
      {...fade(delay)}
    >
      –
    </motion.div>
  );
}

function ColArrow() {
  return (
    <div className="flex items-start pt-0.5 px-0.5 shrink-0">
      <span className="text-[10px]" style={{ color: C.muted, opacity: 0.6 }}>→</span>
    </div>
  );
}

interface ColProps {
  header: string;
  children: React.ReactNode;
  label?: { text: string; delay: number };
  highlight?: { color: string; delay: number; height?: string };
}

function Col({ header, children, label, highlight }: ColProps) {
  return (
    <div className="flex flex-col gap-1.5 items-center relative min-w-6.5">
      {highlight && (
        <motion.div
          className="absolute -inset-x-[5px] rounded-2xl"
          style={{
            backgroundColor: highlight.color,
            top: '18px',
            height: highlight.height ?? 'calc(100% - 18px)',
          }}
          {...fade(highlight.delay)}
        />
      )}
      <span
        className="text-[10px] font-mono relative z-10 h-[14px] flex items-center
          whitespace-nowrap leading-none"
        style={{ color: C.muted }}
      >
        {header}
      </span>
      <div className="flex flex-col gap-1.5 items-center relative z-10">
        {children}
      </div>
      {label && (
        <motion.span
          className="text-[9px] relative z-10 mt-[2px]"
          style={{ color: C.muted }}
          {...fade(label.delay)}
        >
          {label.text}
        </motion.span>
      )}
    </div>
  );
}

function Counter({ ops, lists, delay }: { ops: string; lists: string; delay: number }) {
  return (
    <motion.div className="flex flex-col items-center mt-4" {...fade(delay, 0.5)}>
      <span className="text-[13px] font-mono font-semibold" style={{ color: C.text }}>
        {ops} operations
      </span>
      <span className="text-[11px]" style={{ color: C.muted }}>
        {lists} intermediate lists
      </span>
    </motion.div>
  );
}

// ─── Main component ─────────────────────────────────────
export default function Animation02EagerVsLazy() {
  return (
    <div
      className="w-full flex select-none overflow-hidden"
      role="img"
      aria-label="Eager (Enum) vs Lazy (Stream) pipeline comparison: Enum processes all items through each stage as batches, while Stream processes each item through all stages individually."
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {/* ════ EAGER SIDE ════ */}
      <div className="flex-1 flex flex-col items-center min-w-0 px-1">
        <motion.h3
          className="text-[14px] font-semibold mb-3"
          style={{ color: C.text }}
          {...fade(0.3, 0.5)}
        >
          Eager (Enum)
        </motion.h3>

        <div className="flex gap-1.5 items-start">
          <Col header="input">
            {[1, 2, 3, 4, 5, 6].map((v, i) => (
              <Dot key={v} value={v} bg={C.blue} delay={T.input + i * STAGGER} />
            ))}
          </Col>

          <ColArrow />

          <Col
            header="map ×2"
            highlight={{ color: 'rgba(139,92,246,0.07)', delay: T.eMap - 0.2 }}
            label={{ text: 'List 1', delay: T.eMap + 0.8 }}
          >
            {[2, 4, 6, 8, 10, 12].map((v, i) => (
              <Dot key={v} value={v} bg={C.violet} delay={T.eMap + i * STAGGER} />
            ))}
          </Col>

          <ColArrow />

          <Col
            header="filter <10"
            highlight={{
              color: 'rgba(5,150,105,0.07)',
              delay: T.eFilter - 0.2,
              height: `${4 * 32 + 2}px`,
            }}
            label={{ text: 'List 2', delay: T.eFilter + 0.8 }}
          >
            {[2, 4, 6, 8].map((v, i) => (
              <Dot key={v} value={v} bg={C.green} delay={T.eFilter + i * STAGGER} />
            ))}
            {[10, 12].map((v, i) => (
              <FailDot key={v} value={v} delay={T.eFilter + (4 + i) * STAGGER} />
            ))}
          </Col>

          <ColArrow />

          <Col header="take(2)">
            {[2, 4].map((v, i) => (
              <Dot key={v} value={v} bg={C.green} delay={T.eTake + i * STAGGER} />
            ))}
            <SkipDot delay={T.eTake + 2 * STAGGER} />
            <SkipDot delay={T.eTake + 3 * STAGGER} />
          </Col>
        </div>

        <Counter ops="10" lists="2" delay={T.eCounter} />
      </div>

      {/* ════ DIVIDER ════ */}
      <div
        className="w-px shrink-0 mx-1 self-stretch"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to bottom, var(--border, #e2e8f0) 0px 4px, transparent 4px 7px)',
        }}
      />

      {/* ════ LAZY SIDE ════ */}
      <div className="flex-1 flex flex-col items-center min-w-0 px-1">
        <motion.h3
          className="text-[14px] font-semibold mb-3"
          style={{ color: C.text }}
          {...fade(0.3, 0.5)}
        >
          Lazy (Stream)
        </motion.h3>

        <div className="flex gap-1.5 items-start">
          <Col header="input">
            {[1, 2, 3, 4, 5, 6].map((v, i) => (
              <Dot key={v} value={v} bg={C.blue} delay={T.input + i * STAGGER} />
            ))}
          </Col>

          <ColArrow />

          <Col header="map ×2">
            <Dot value={2} bg={C.violet} delay={T.lR1Map} />
            <Dot value={4} bg={C.violet} delay={T.lR2Map} />
            {[0, 1, 2, 3].map(i => (
              <DashSlot key={i} delay={T.lStop + i * 0.05} />
            ))}
          </Col>

          <ColArrow />

          <Col header="filter <10">
            <Dot value={2} bg={C.green} delay={T.lR1Filter} />
            <Dot value={4} bg={C.green} delay={T.lR2Filter} />
            {[0, 1, 2, 3].map(i => (
              <DashSlot key={i} delay={T.lStop + i * 0.05} />
            ))}
          </Col>

          <ColArrow />

          <Col header="take(2)">
            <Dot value="✓" bg={C.green} delay={T.lR1Take} />
            <Dot value="✓" bg={C.green} delay={T.lR2Take} />
            {[0, 1, 2, 3].map(i => (
              <DashSlot key={i} delay={T.lStop + i * 0.05} />
            ))}
          </Col>
        </div>

        {/* Pipeline stopped label */}
        <motion.div
          className="text-[10px] italic mt-3 text-center"
          style={{ color: C.muted }}
          {...fade(T.lDone)}
        >
          <span style={{ color: C.green, fontWeight: 700, fontStyle: 'normal' }}>
            DONE
          </span>
          {' — pipeline stopped, items 3–6 never processed'}
        </motion.div>

        <Counter ops="4" lists="0" delay={T.lCounter} />
      </div>
    </div>
  );
}
