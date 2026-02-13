'use client';

import React from 'react';
import { motion } from 'motion/react';

// ─── Timing constants ──────────────────────────
const T = {
  // Phase 1: Successful match
  title1: 0.5,
  code1: 1.0,
  left1: 1.8,
  eq1: 2.5,
  right1: 3.0,
  match: 5.0,
  bind: 7.0,
  result: 8.2,
  // Phase 2: Failed match
  divider: 9.5,
  title2: 10.0,
  code2: 10.5,
  left2: 11.2,
  eq2: 11.8,
  right2: 12.2,
  fail: 14.0,
  error: 15.2,
};

// ─── Colors ────────────────────────────────────
const C = {
  blue: '#3b82f6',
  violet: '#8b5cf6',
  green: '#059669',
  red: '#dc2626',
  muted: 'var(--text-secondary, #94a3b8)',
  text: 'var(--text, #1a1a2e)',
};

// ─── Animation presets ─────────────────────────
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

const slideFrom = (delay: number, x: number) => ({
  initial: { opacity: 0, x } as const,
  animate: { opacity: 1, x: 0 } as const,
  transition: { delay, duration: 0.5, ease: 'easeOut' as const },
});

// ─── Sub-components ────────────────────────────
function Brace({ children }: { children: string }) {
  return (
    <span className="font-mono text-base leading-none" style={{ color: C.muted }}>
      {children}
    </span>
  );
}

function Comma() {
  return (
    <span className="font-mono text-sm leading-none" style={{ color: C.muted }}>
      ,
    </span>
  );
}

// ─── Main component ────────────────────────────
export default function Animation05PatternMatch() {
  return (
    <div
      className="w-full flex flex-col items-center gap-6 select-none overflow-hidden py-3"
      role="img"
      aria-label="Animation showing Elixir's match operator: {:ok, value} = {:ok, 42} successfully binds value to 42, while {:error, _} = {:ok, 42} raises a MatchError because :error does not match :ok"
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {/* ═══ Phase 1: Successful Match ═══ */}
      <div className="flex flex-col items-center gap-3">
        <motion.div
          className="text-sm font-semibold tracking-wide"
          style={{ color: C.green }}
          {...drop(T.title1)}
        >
          Successful Match
        </motion.div>

        {/* Code preview */}
        <motion.code
          className="text-xs px-3 py-1 rounded"
          style={{ color: C.muted, backgroundColor: 'rgba(0,0,0,0.04)' }}
          {...fade(T.code1)}
        >
          {'{'}:ok, value{'}'} = {'{'}:ok, 42{'}'}
        </motion.code>

        {/* Visual: tuple elements matching */}
        <div className="flex items-center gap-3">
          {/* Left: pattern {:ok, value} */}
          <motion.div className="flex items-center gap-1.5" {...slideFrom(T.left1, -30)}>
            <Brace>{'{'}</Brace>
            <motion.div
              className="px-3 py-1.5 rounded-lg font-mono text-[13px] font-semibold text-white leading-none"
              initial={{ backgroundColor: C.violet }}
              animate={{ backgroundColor: C.green, scale: [1, 1, 1.15, 1] }}
              transition={{
                backgroundColor: { delay: T.match, duration: 0.5, ease: 'easeOut' },
                scale: { delay: T.match, duration: 0.6, ease: 'easeOut' },
              }}
            >
              :ok
            </motion.div>
            <Comma />
            <div className="relative">
              {/* Dashed "value" placeholder — fades out on bind */}
              <motion.div
                className="px-3 py-1.5 rounded-lg font-mono text-[13px] font-semibold leading-none border-2 border-dashed"
                style={{ borderColor: C.muted, color: C.muted }}
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ delay: T.bind, duration: 0.25 }}
              >
                value
              </motion.div>
              {/* Green "42" — fades in on bind */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center rounded-lg font-mono text-[13px] font-semibold text-white leading-none"
                style={{ backgroundColor: C.green }}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: T.bind, duration: 0.4, ease: 'easeOut' }}
              >
                42
              </motion.div>
            </div>
            <Brace>{'}'}</Brace>
          </motion.div>

          {/* = sign */}
          <motion.span
            className="font-mono text-xl font-bold"
            style={{ color: C.text }}
            {...fade(T.eq1, 0.3)}
          >
            =
          </motion.span>

          {/* Right: value {:ok, 42} */}
          <motion.div className="flex items-center gap-1.5" {...slideFrom(T.right1, 30)}>
            <Brace>{'{'}</Brace>
            <motion.div
              className="px-3 py-1.5 rounded-lg font-mono text-[13px] font-semibold text-white leading-none"
              initial={{ backgroundColor: C.violet }}
              animate={{ backgroundColor: C.green, scale: [1, 1, 1.15, 1] }}
              transition={{
                backgroundColor: { delay: T.match, duration: 0.5, ease: 'easeOut' },
                scale: { delay: T.match, duration: 0.6, ease: 'easeOut' },
              }}
            >
              :ok
            </motion.div>
            <Comma />
            <motion.div
              className="px-3 py-1.5 rounded-lg font-mono text-[13px] font-semibold text-white leading-none"
              style={{ backgroundColor: C.blue }}
              animate={{ opacity: 0.35 }}
              transition={{ delay: T.bind, duration: 0.4 }}
            >
              42
            </motion.div>
            <Brace>{'}'}</Brace>
          </motion.div>
        </div>

        {/* Result label */}
        <motion.div
          className="font-mono text-sm font-bold"
          style={{ color: C.green }}
          {...drop(T.result)}
        >
          value = 42
        </motion.div>
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

      {/* ═══ Phase 2: Failed Match ═══ */}
      <div className="flex flex-col items-center gap-3">
        <motion.div
          className="text-sm font-semibold tracking-wide"
          style={{ color: C.red }}
          {...drop(T.title2)}
        >
          Failed Match
        </motion.div>

        {/* Code preview */}
        <motion.code
          className="text-xs px-3 py-1 rounded"
          style={{ color: C.muted, backgroundColor: 'rgba(0,0,0,0.04)' }}
          {...fade(T.code2)}
        >
          {'{'}:error, _{'}'} = {'{'}:ok, 42{'}'}
        </motion.code>

        {/* Visual: tuple elements mismatching */}
        <div className="flex items-center gap-3">
          {/* Left: pattern {:error, _} */}
          <motion.div className="flex items-center gap-1.5" {...slideFrom(T.left2, -30)}>
            <Brace>{'{'}</Brace>
            <motion.div
              className="px-3 py-1.5 rounded-lg font-mono text-[13px] font-semibold text-white leading-none"
              initial={{ backgroundColor: C.violet }}
              animate={{
                backgroundColor: C.red,
                x: [0, -3, 3, -2, 2, 0],
              }}
              transition={{
                backgroundColor: { delay: T.fail, duration: 0.3, ease: 'easeOut' },
                x: { delay: T.fail, duration: 0.4 },
              }}
            >
              :error
            </motion.div>
            <Comma />
            <div
              className="px-3 py-1.5 rounded-lg font-mono text-[13px] font-semibold leading-none border-2 border-dashed"
              style={{ borderColor: C.muted, color: C.muted }}
            >
              _
            </div>
            <Brace>{'}'}</Brace>
          </motion.div>

          {/* = sign */}
          <motion.span
            className="font-mono text-xl font-bold"
            style={{ color: C.text }}
            {...fade(T.eq2, 0.3)}
          >
            =
          </motion.span>

          {/* Right: value {:ok, 42} */}
          <motion.div className="flex items-center gap-1.5" {...slideFrom(T.right2, 30)}>
            <Brace>{'{'}</Brace>
            <motion.div
              className="px-3 py-1.5 rounded-lg font-mono text-[13px] font-semibold text-white leading-none"
              initial={{ backgroundColor: C.violet }}
              animate={{
                backgroundColor: C.red,
                x: [0, 3, -3, 2, -2, 0],
              }}
              transition={{
                backgroundColor: { delay: T.fail, duration: 0.3, ease: 'easeOut' },
                x: { delay: T.fail, duration: 0.4 },
              }}
            >
              :ok
            </motion.div>
            <Comma />
            <div
              className="px-3 py-1.5 rounded-lg font-mono text-[13px] font-semibold text-white leading-none"
              style={{ backgroundColor: C.blue }}
            >
              42
            </div>
            <Brace>{'}'}</Brace>
          </motion.div>
        </div>

        {/* Error label */}
        <motion.div className="mt-1" {...drop(T.error)}>
          <span
            className="font-mono text-sm font-bold px-3 py-1 rounded-md"
            style={{ color: C.red, backgroundColor: 'rgba(220, 38, 38, 0.08)' }}
          >
            ** (MatchError)
          </span>
        </motion.div>
      </div>
    </div>
  );
}
