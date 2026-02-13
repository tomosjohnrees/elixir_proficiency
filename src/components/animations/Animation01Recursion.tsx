'use client';

import React from 'react';
import { motion } from 'motion/react';

// ─── Timing constants ──────────────────────────
const T = {
  headers: 0.4,
  call: 0.8,
  // Stack frames / state updates (synchronized left & right)
  s1: 1.5,
  s2: 4.0,
  s3: 6.5,
  s4: 9.0,       // base case
  reuse: 4.5,    // "BEAM reuses" label (right side)
  depth: 10.5,   // stack depth labels
  result: 12.0,  // result labels
  verdict: 14.0, // bottom O(n) / O(1) comparison
};

// ─── Colors ────────────────────────────────────
const C = {
  body: '#7c3aed',
  bodyBg: 'rgba(124, 58, 237, 0.10)',
  tail: '#2563eb',
  tailBg: 'rgba(37, 99, 235, 0.10)',
  green: '#059669',
  greenBg: 'rgba(5, 150, 105, 0.12)',
  muted: 'var(--text-secondary, #94a3b8)',
  text: 'var(--text, #1a1a2e)',
  surface: 'var(--surface, #fff)',
  border: 'var(--border, #e2e8f0)',
};

// ─── Animation presets ─────────────────────────
const fade = (delay: number, duration = 0.5) => ({
  initial: { opacity: 0 } as const,
  animate: { opacity: 1 } as const,
  transition: { delay, duration, ease: 'easeOut' as const },
});

const drop = (delay: number) => ({
  initial: { opacity: 0, y: -8 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { delay, duration: 0.4, ease: 'easeOut' as const },
});

const slideUp = (delay: number) => ({
  initial: { opacity: 0, y: 12 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { delay, duration: 0.5, ease: 'easeOut' as const },
});

// ─── Sub-components ────────────────────────────

/** A stack frame on the body recursion side */
function BodyFrame({
  call, detail, frameNum, delay, isBase,
}: {
  call: string; detail?: string; frameNum: number; delay: number; isBase?: boolean;
}) {
  return (
    <motion.div
      className="rounded-lg border-2 px-3 py-2 font-mono text-xs leading-snug"
      style={{
        borderColor: isBase ? C.green : C.body,
        backgroundColor: isBase ? C.greenBg : C.bodyBg,
      }}
      {...slideUp(delay)}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-bold" style={{ color: isBase ? C.green : C.body }}>
          {call}
        </span>
        <span className="text-[10px] opacity-40" style={{ color: C.text }}>
          frame {frameNum}
        </span>
      </div>
      {detail && (
        <div className="mt-0.5 opacity-55" style={{ color: C.text }}>
          {detail}
        </div>
      )}
    </motion.div>
  );
}

/** The single tail-recursion frame showing a state transition */
function TailState({
  list, acc, delay, isBase,
}: {
  list: string; acc: string; delay: number; isBase?: boolean;
}) {
  // Each state fades in and stays visible briefly, then the next replaces it.
  // The last state (base case) stays visible permanently.
  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-center px-3 font-mono text-xs leading-snug"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
    >
      <div style={{ color: C.text }}>
        list: <span className="font-bold">{list}</span>
      </div>
      <div className="mt-0.5" style={{ color: isBase ? C.green : C.text }}>
        acc: <span className="font-bold">{acc}</span>
      </div>
    </motion.div>
  );
}

// ─── Main component ────────────────────────────
export default function Animation01Recursion() {
  // Tail state fade schedule: each state is visible from its start to the next state's start
  const tailStates = [
    { list: '[1, 2, 3]', acc: '0', delay: T.s1, until: T.s2 },
    { list: '[2, 3]', acc: '1', delay: T.s2, until: T.s3 },
    { list: '[3]', acc: '3', delay: T.s3, until: T.s4 },
    { list: '[]', acc: '6', delay: T.s4, until: null, isBase: true },
  ];

  return (
    <div
      className="w-full flex select-none overflow-hidden"
      role="img"
      aria-label="Side-by-side comparison of body recursion (stack grows to 4 frames then unwinds) vs tail recursion (single frame reused with accumulator) for sum([1,2,3])"
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {/* ═══ Left: Body Recursion ═══ */}
      <div className="flex-1 flex flex-col items-center min-w-0 px-2">
        <motion.h3
          className="text-sm font-bold"
          style={{ color: C.body }}
          {...drop(T.headers)}
        >
          Body Recursion
        </motion.h3>
        <motion.p
          className="text-[11px] mb-3"
          style={{ color: C.muted }}
          {...fade(T.headers + 0.2)}
        >
          Stack grows &amp; unwinds
        </motion.p>

        {/* Function call */}
        <motion.code
          className="text-xs mb-3 opacity-70"
          style={{ color: C.text }}
          {...fade(T.call)}
        >
          sum([1, 2, 3])
        </motion.code>

        {/* Stack frames — grow downward */}
        <div className="w-full max-w-65 flex flex-col gap-1.5">
          <BodyFrame call="sum([1, 2, 3])" detail="= 1 + sum([2, 3])" frameNum={1} delay={T.s1} />
          <BodyFrame call="sum([2, 3])" detail="= 2 + sum([3])" frameNum={2} delay={T.s2} />
          <BodyFrame call="sum([3])" detail="= 3 + sum([])" frameNum={3} delay={T.s3} />
          <BodyFrame call="sum([]) = 0" frameNum={4} delay={T.s4} isBase />
        </div>

        {/* Stack depth */}
        <motion.div
          className="mt-3 text-xs font-semibold"
          style={{ color: C.text }}
          {...fade(T.depth)}
        >
          4 stack frames
        </motion.div>

        {/* Result */}
        <motion.div
          className="mt-2 font-mono text-sm font-bold px-3 py-1 rounded-md"
          style={{ color: C.green, backgroundColor: C.greenBg }}
          {...drop(T.result)}
        >
          Result: 6
        </motion.div>

        {/* Verdict */}
        <motion.div className="mt-3 text-center" {...fade(T.verdict)}>
          <div className="text-xs font-semibold" style={{ color: C.text }}>O(n) stack space</div>
          <div className="text-[10px]" style={{ color: C.muted }}>
            Risk of stack overflow on large lists
          </div>
        </motion.div>
      </div>

      {/* ─── Dashed divider ─── */}
      <div
        className="w-px shrink-0 mx-1 self-stretch"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to bottom, var(--border, #e2e8f0) 0px 4px, transparent 4px 7px)',
        }}
      />

      {/* ═══ Right: Tail Recursion ═══ */}
      <div className="flex-1 flex flex-col items-center min-w-0 px-2">
        <motion.h3
          className="text-sm font-bold"
          style={{ color: C.tail }}
          {...drop(T.headers)}
        >
          Tail Recursion
        </motion.h3>
        <motion.p
          className="text-[11px] mb-3"
          style={{ color: C.muted }}
          {...fade(T.headers + 0.2)}
        >
          Single frame reused
        </motion.p>

        {/* Function call */}
        <motion.code
          className="text-xs mb-3 opacity-70"
          style={{ color: C.text }}
          {...fade(T.call)}
        >
          tail_sum([1, 2, 3], 0)
        </motion.code>

        {/* Single frame with state transitions */}
        <div className="w-full max-w-65">
          <motion.div
            className="relative rounded-lg border-2 overflow-hidden"
            style={{
              borderColor: C.tail,
              backgroundColor: C.tailBg,
              height: '52px',
            }}
            {...fade(T.s1)}
          >
            {/* Frame label */}
            <div
              className="absolute top-1 right-2 text-[10px] opacity-40"
              style={{ color: C.text }}
            >
              frame 1
            </div>

            {/* State layers — each fades in at its time, out at the next */}
            {tailStates.map((st, i) => (
              <React.Fragment key={i}>
                {/* Blue flash on state transition (not on first state) */}
                {i > 0 && (
                  <motion.div
                    className="absolute inset-0 rounded-md"
                    style={{ backgroundColor: C.tail }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.15, 0] }}
                    transition={{ delay: st.delay, duration: 0.6 }}
                  />
                )}
                {/* Green flash on base case */}
                {st.isBase && (
                  <motion.div
                    className="absolute inset-0 rounded-md"
                    style={{ backgroundColor: C.green }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.2, 0] }}
                    transition={{ delay: st.delay, duration: 0.8 }}
                  />
                )}
                {/* Fade previous state out */}
                {st.until && (
                  <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ delay: st.until, duration: 0.3 }}
                  >
                    <TailState list={st.list} acc={st.acc} delay={st.delay} isBase={st.isBase} />
                  </motion.div>
                )}
                {/* Last state stays visible */}
                {!st.until && (
                  <TailState list={st.list} acc={st.acc} delay={st.delay} isBase={st.isBase} />
                )}
              </React.Fragment>
            ))}
          </motion.div>

          {/* "BEAM reuses" label */}
          <motion.div
            className="mt-2 text-center text-xs font-semibold px-3 py-1 rounded-full"
            style={{ color: C.tail, backgroundColor: C.tailBg }}
            {...fade(T.reuse)}
          >
            BEAM reuses the same frame
          </motion.div>
        </div>

        {/* Stack depth */}
        <motion.div
          className="mt-3 text-xs font-semibold"
          style={{ color: C.text }}
          {...fade(T.depth)}
        >
          1 stack frame (constant)
        </motion.div>

        {/* Result */}
        <motion.div
          className="mt-2 font-mono text-sm font-bold px-3 py-1 rounded-md"
          style={{ color: C.green, backgroundColor: C.greenBg }}
          {...drop(T.result)}
        >
          Result: 6
        </motion.div>

        {/* Verdict */}
        <motion.div className="mt-3 text-center" {...fade(T.verdict)}>
          <div className="text-xs font-semibold" style={{ color: C.text }}>O(1) stack space</div>
          <div className="text-[10px]" style={{ color: C.muted }}>
            Handles any list size efficiently
          </div>
        </motion.div>
      </div>
    </div>
  );
}
