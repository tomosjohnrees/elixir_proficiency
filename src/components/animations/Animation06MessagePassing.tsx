'use client';

import React from 'react';
import { motion } from 'motion/react';

// ─── Timing constants ──────────────────────────────────
const T = {
  init: 0.5,
  send1: 1.8,
  send2: 3.3,
  send3: 4.8,
  receive: 7,
  scan1: 8.8,
  scan2: 10.5,
  consume: 12.2,
  bind: 12.5,
  remaining: 13.2,
};

// ─── Colors ────────────────────────────────────────────
const C = {
  blue: '#3b82f6',
  violet: '#8b5cf6',
  green: '#059669',
  red: '#dc2626',
  text: 'var(--text, #1a1a2e)',
  muted: 'var(--text-secondary, #94a3b8)',
  border: 'var(--border, #e2e8f0)',
  surface: 'var(--surface, #fff)',
};

// ─── Animation presets ─────────────────────────────────
const fade = (delay: number, duration = 0.4) => ({
  initial: { opacity: 0 } as const,
  animate: { opacity: 1 } as const,
  transition: { delay, duration, ease: 'easeOut' as const },
});

const drop = (delay: number) => ({
  initial: { opacity: 0, y: -8 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { delay, duration: 0.5, ease: 'easeOut' as const },
});

// ─── Main component ────────────────────────────────────
export default function Animation06MessagePassing() {
  const sendTimes = [T.send1, T.send2, T.send3];
  const msgLabels = ['{:count, 42}', '{:hello, "world"}', '{:ping}'];

  return (
    <div
      className="w-full flex select-none overflow-hidden items-start gap-3 px-3 py-3"
      role="img"
      aria-label="Process message passing: Process A sends three messages to Process B's mailbox, then receive pattern-matches in FIFO order, consuming the matching message while others remain"
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {/* ─── Process A (sender) ─── */}
      <motion.div
        className="flex-[2] rounded-xl border-2 p-3 min-w-0"
        style={{ borderColor: C.border, backgroundColor: C.surface }}
        {...drop(T.init)}
      >
        <div className="text-sm font-semibold" style={{ color: C.text }}>
          Process A
        </div>
        <div className="text-[10px] font-mono mb-3" style={{ color: C.muted }}>
          {'#PID<0.100.0>'}
        </div>

        <div className="space-y-1.5">
          {msgLabels.map((msg, i) => (
            <motion.div
              key={i}
              className="text-[10px] font-mono leading-snug"
              style={{ color: C.text }}
              {...fade(sendTimes[i], 0.3)}
            >
              <span style={{ color: C.blue }}>send</span>
              <span style={{ color: C.muted }}>(b, </span>
              {msg}
              <span style={{ color: C.muted }}>)</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ─── Arrow ─── */}
      <div className="shrink-0 flex items-center pt-6">
        <motion.span
          className="text-lg"
          style={{ color: C.muted }}
          {...fade(T.send1, 0.3)}
        >
          →
        </motion.span>
      </div>

      {/* ─── Process B (receiver) ─── */}
      <div className="flex-[3] flex flex-col min-w-0">
        <motion.div
          className="rounded-xl border-2 p-3 pb-2"
          style={{ borderColor: C.border, backgroundColor: C.surface }}
          {...drop(T.init + 0.15)}
        >
          <div className="text-sm font-semibold" style={{ color: C.text }}>
            Process B
          </div>
          <div className="text-[10px] font-mono" style={{ color: C.muted }}>
            {'#PID<0.101.0>'}
          </div>
        </motion.div>

        {/* Mailbox */}
        <motion.div
          className="mt-1.5 rounded-lg p-2 overflow-hidden"
          style={{
            backgroundColor: 'rgba(139,92,246,0.05)',
            border: '1px solid var(--border, #e2e8f0)',
          }}
          {...fade(T.send1 - 0.3)}
        >
          <div
            className="text-[10px] font-semibold uppercase tracking-wider mb-1.5"
            style={{ color: C.muted }}
          >
            Mailbox
          </div>

          <div className="space-y-1">
            {/* ── Message 1: {:count, 42} — no match ── */}
            <div className="flex items-center gap-1.5">
              <motion.div
                className="flex-1 min-w-0"
                initial={{ opacity: 0, x: -150 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: T.send1, duration: 0.6, ease: 'easeOut' }}
              >
                <motion.div
                  className="rounded-md border-2 px-2 py-0.5 font-mono text-[11px] truncate"
                  style={{ color: C.text, borderColor: C.border }}
                  animate={{
                    borderColor: [C.border, C.border, C.red, C.red, C.border],
                    scale: [1, 1, 1.03, 1.03, 1],
                  }}
                  transition={{
                    delay: T.scan1,
                    duration: 2,
                    times: [0, 0, 0.15, 0.45, 0.75],
                    ease: 'easeInOut',
                  }}
                >
                  {'{:count, 42}'}
                </motion.div>
              </motion.div>
              <motion.span
                className="text-[11px] font-bold shrink-0 w-3 text-center"
                style={{ color: C.red }}
                {...fade(T.scan1 + 0.25, 0.3)}
              >
                ✗
              </motion.span>
            </div>

            {/* ── Message 2: {:hello, "world"} — MATCH ── */}
            <div className="flex items-center gap-1.5">
              <motion.div
                className="flex-1 min-w-0"
                initial={{ opacity: 0, x: -150 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: T.send2, duration: 0.6, ease: 'easeOut' }}
              >
                {/* Fade-out wrapper for consumption */}
                <motion.div
                  className="flex items-center gap-1.5"
                  animate={{ opacity: 0, x: 30 }}
                  transition={{ delay: T.consume, duration: 0.6, ease: 'easeIn' }}
                >
                  <motion.div
                    className="flex-1 min-w-0 rounded-md border-2 px-2 py-0.5 font-mono text-[11px] truncate"
                    style={{ color: C.text, borderColor: C.border, backgroundColor: 'transparent' }}
                    animate={{
                      borderColor: C.green,
                      backgroundColor: 'rgba(5,150,105,0.1)',
                      scale: 1.03,
                    }}
                    transition={{ delay: T.scan2, duration: 0.4, ease: 'easeOut' }}
                  >
                    {'{:hello, "world"}'}
                  </motion.div>
                  <motion.span
                    className="text-[11px] font-bold shrink-0"
                    style={{ color: C.green }}
                    {...fade(T.scan2 + 0.25, 0.3)}
                  >
                    ✓
                  </motion.span>
                </motion.div>
              </motion.div>
            </div>

            {/* ── Message 3: {:ping} — not scanned ── */}
            <div className="flex items-center gap-1.5">
              <motion.div
                className="flex-1 min-w-0"
                initial={{ opacity: 0, x: -150 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: T.send3, duration: 0.6, ease: 'easeOut' }}
              >
                <div
                  className="rounded-md border-2 px-2 py-0.5 font-mono text-[11px] truncate"
                  style={{ borderColor: C.border, color: C.text }}
                >
                  {'{:ping}'}
                </div>
              </motion.div>
              <div className="w-3 shrink-0" />
            </div>
          </div>
        </motion.div>

        {/* Receive block */}
        <motion.div
          className="mt-1.5 rounded-lg border-2 p-2"
          style={{ borderColor: C.violet, backgroundColor: 'rgba(139,92,246,0.06)' }}
          {...drop(T.receive)}
        >
          <div className="font-mono text-[11px] leading-relaxed" style={{ color: C.text }}>
            <span style={{ color: C.violet, fontWeight: 600 }}>receive</span>
            <span style={{ color: C.muted }}>{' do'}</span>
          </div>
          <div className="font-mono text-[11px] ml-3 leading-relaxed" style={{ color: C.text }}>
            <span style={{ color: C.violet }}>{'{:hello, name}'}</span>
            <span style={{ color: C.muted }}>{' → ...'}</span>
          </div>
          <div className="font-mono text-[11px] leading-relaxed">
            <span style={{ color: C.violet, fontWeight: 600 }}>end</span>
          </div>

          {/* Binding result */}
          <motion.div
            className="mt-1.5 text-[11px] font-mono"
            style={{ color: C.green }}
            {...fade(T.bind, 0.4)}
          >
            {'name = "world"'}
          </motion.div>
        </motion.div>

        {/* Remaining note */}
        <motion.div
          className="mt-1 text-[10px] px-1"
          style={{ color: C.muted }}
          {...fade(T.remaining, 0.4)}
        >
          Unmatched messages stay in mailbox
        </motion.div>
      </div>
    </div>
  );
}
