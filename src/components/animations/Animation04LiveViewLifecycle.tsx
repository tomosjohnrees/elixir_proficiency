'use client';

import React from 'react';
import { motion } from 'motion/react';

// ─── Timing (seconds) ──────────────────────────────
const T = {
  panels: 0.8,
  wsLine: 1.5,
  click: 3.2,
  eventStart: 4.5,
  eventDur: 1.3,
  handleFire: 6.5,
  assignsUpdate: 8.2,
  diffCalc: 9.8,
  diffStart: 11.0,
  diffDur: 1.3,
  domPatch: 13.0,
};

// ─── Colors ────────────────────────────────────────
const C = {
  blue: '#3b82f6',
  violet: '#8b5cf6',
  green: '#059669',
  amber: '#d97706',
  muted: 'var(--text-secondary, #94a3b8)',
  text: 'var(--text, #1a1a2e)',
  border: 'var(--border, #e2e8f0)',
};

// ─── Helpers ───────────────────────────────────────
const fade = (delay: number, duration = 0.4) => ({
  initial: { opacity: 0 } as const,
  animate: { opacity: 1 } as const,
  transition: { delay, duration, ease: 'easeOut' as const },
});

// ─── Sub-components ────────────────────────────────
function ValueSwap({
  oldVal,
  newVal,
  delay,
  className = '',
}: {
  oldVal: React.ReactNode;
  newVal: React.ReactNode;
  delay: number;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay, duration: 0.3 }}
      >
        {oldVal}
      </motion.div>
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.1, duration: 0.4, ease: 'easeOut' }}
      >
        {newVal}
      </motion.div>
    </div>
  );
}

function TravelingPill({
  label,
  color,
  delay,
  duration,
  direction,
  top,
}: {
  label: string;
  color: string;
  delay: number;
  duration: number;
  direction: 'right' | 'left';
  top: string;
}) {
  const startX = direction === 'right' ? -32 : 32;
  const endX = direction === 'right' ? 32 : -32;

  return (
    <motion.div
      className="absolute left-0 right-0 flex justify-center pointer-events-none"
      style={{ top }}
      initial={{ opacity: 0, x: startX }}
      animate={{
        opacity: [0, 1, 1, 0],
        x: [startX, startX * 0.7, endX * 0.7, endX],
      }}
      transition={{
        delay,
        duration,
        ease: 'easeInOut',
        times: [0, 0.08, 0.88, 1],
      }}
    >
      <span
        className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full whitespace-nowrap"
        style={{ backgroundColor: color, color: 'white' }}
      >
        {label}
      </span>
    </motion.div>
  );
}

// ─── Main component ────────────────────────────────
export default function Animation04LiveViewLifecycle() {
  return (
    <div
      className="w-full flex flex-col select-none overflow-hidden px-1 py-3 gap-3"
      role="img"
      aria-label="LiveView lifecycle: user clicks a button, event travels to the server via WebSocket, handle_event updates assigns, a minimal diff is sent back, and the browser DOM is patched"
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      <div className="flex items-stretch w-full">
        {/* ─── Browser Panel ─── */}
        <motion.div
          className="flex-1 min-w-0 rounded-xl border-2 overflow-hidden flex flex-col"
          style={{ borderColor: C.blue }}
          {...fade(T.panels)}
        >
          <div
            className="px-3 py-1.5 text-[11px] font-semibold tracking-wide"
            style={{ backgroundColor: C.blue, color: 'white' }}
          >
            Browser
          </div>
          <div
            className="p-3 flex flex-col gap-2 flex-1"
            style={{ color: C.text }}
          >
            <div
              className="text-[10px] font-medium"
              style={{ color: C.muted }}
            >
              DOM
            </div>

            {/* Count display: 0 → 1 */}
            <ValueSwap
              className="h-6"
              delay={T.domPatch}
              oldVal={
                <span className="text-base font-mono font-bold">Count: 0</span>
              }
              newVal={
                <span
                  className="text-base font-mono font-bold"
                  style={{ color: C.green }}
                >
                  Count: 1
                </span>
              }
            />

            {/* + Button with click animation */}
            <div className="flex items-center gap-2">
              <motion.div
                className="px-3 py-1 rounded border text-sm font-mono"
                style={{ borderColor: C.border }}
                initial={{ scale: 1, backgroundColor: 'rgba(0,0,0,0)' }}
                animate={{
                  scale: [1, 1.12, 1],
                  backgroundColor: [
                    'rgba(0,0,0,0)',
                    'rgba(217,119,6,0.15)',
                    'rgba(0,0,0,0)',
                  ],
                }}
                transition={{ delay: T.click, duration: 0.5, ease: 'easeOut' }}
              >
                +
              </motion.div>
              <motion.span
                className="text-[10px] font-medium"
                style={{ color: C.amber }}
                {...fade(T.click + 0.1)}
              >
                click!
              </motion.span>
            </div>

            {/* Patched confirmation */}
            <motion.div
              className="text-[10px] font-medium mt-auto pt-1"
              style={{ color: C.green }}
              {...fade(T.domPatch + 0.3)}
            >
              DOM patched
            </motion.div>
          </div>
        </motion.div>

        {/* ─── WebSocket Connection ─── */}
        <div className="w-16 sm:w-20 shrink-0 flex flex-col items-center justify-center relative">
          <motion.div
            className="text-[10px] font-medium mb-2 whitespace-nowrap"
            style={{ color: C.muted }}
            {...fade(T.wsLine)}
          >
            WebSocket
          </motion.div>
          <motion.div
            className="w-full h-px"
            style={{
              backgroundImage:
                'repeating-linear-gradient(to right, var(--text-secondary, #94a3b8) 0px 3px, transparent 3px 7px)',
            }}
            {...fade(T.wsLine)}
          />

          <TravelingPill
            label={'"inc" \u2192'}
            color={C.amber}
            delay={T.eventStart}
            duration={T.eventDur}
            direction="right"
            top="55%"
          />

          <TravelingPill
            label={'\u2190 diff'}
            color={C.green}
            delay={T.diffStart}
            duration={T.diffDur}
            direction="left"
            top="70%"
          />
        </div>

        {/* ─── Server Panel ─── */}
        <motion.div
          className="flex-1 min-w-0 rounded-xl border-2 overflow-hidden flex flex-col"
          style={{ borderColor: C.violet }}
          {...fade(T.panels)}
        >
          <div
            className="px-3 py-1.5 text-[11px] font-semibold tracking-wide"
            style={{ backgroundColor: C.violet, color: 'white' }}
          >
            Server
          </div>
          <div
            className="p-3 flex flex-col gap-2 flex-1"
            style={{ color: C.text }}
          >
            <div
              className="text-[10px] font-medium"
              style={{ color: C.muted }}
            >
              LiveView Process
            </div>

            {/* handle_event with highlight */}
            <motion.div
              className="text-[11px] font-mono px-2 py-1.5 rounded border"
              style={{ borderColor: C.border }}
              initial={{ backgroundColor: 'rgba(0,0,0,0)' }}
              animate={{
                backgroundColor: [
                  'rgba(0,0,0,0)',
                  'rgba(217,119,6,0.15)',
                  'rgba(217,119,6,0.15)',
                  'rgba(0,0,0,0)',
                ],
              }}
              transition={{
                delay: T.handleFire,
                duration: 1.8,
                times: [0, 0.12, 0.5, 1],
                ease: 'easeOut',
              }}
            >
              handle_event
            </motion.div>

            {/* Assigns: count 0 → 1 */}
            <div
              className="text-[10px] font-medium"
              style={{ color: C.muted }}
            >
              assigns
            </div>
            <ValueSwap
              className="h-5"
              delay={T.assignsUpdate}
              oldVal={
                <span className="text-xs font-mono">
                  %{'{'}count: <strong>0</strong>
                  {'}'}
                </span>
              }
              newVal={
                <span className="text-xs font-mono" style={{ color: C.green }}>
                  %{'{'}count: <strong>1</strong>
                  {'}'}
                </span>
              }
            />

            {/* Diff calculation */}
            <motion.div
              className="text-[10px] font-mono px-2 py-1 rounded mt-auto"
              style={{
                backgroundColor: 'rgba(5,150,105,0.1)',
                color: C.green,
              }}
              {...fade(T.diffCalc)}
            >
              diff: count 0→1
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* ─── Step timeline ─── */}
      <div className="flex justify-between px-2 mt-1">
        {[
          { n: 1, label: 'Click', t: T.click },
          { n: 2, label: 'Event', t: T.eventStart },
          { n: 3, label: 'Process', t: T.handleFire },
          { n: 4, label: 'Diff', t: T.diffStart },
          { n: 5, label: 'Patch', t: T.domPatch },
        ].map((s) => (
          <motion.div
            key={s.n}
            className="flex flex-col items-center gap-0.5"
            {...fade(s.t)}
          >
            <div
              className="w-4 h-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center leading-none"
              style={{ backgroundColor: C.violet }}
            >
              {s.n}
            </div>
            <span className="text-[10px]" style={{ color: C.muted }}>
              {s.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
