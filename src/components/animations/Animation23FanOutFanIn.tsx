'use client';

import React from 'react';
import { motion } from 'motion/react';

// ─── Timing constants ────────────────────────────────────
const T = {
  coord: 0.8,
  dispatch: 2.2,
  dispatchArrows: 2.6,
  workers: 3.2,
  stagger: 0.15,
  progress: 4.2,
  cacheDone: 6.2,
  dbDone: 7.8,
  apiTimeout: 9.4,
  gather: 10.4,
  gatherArrows: 10.8,
  result1: 11.4,
  resultGap: 0.4,
};

// ─── Colors ──────────────────────────────────────────────
const C = {
  blue: '#3b82f6',
  violet: '#8b5cf6',
  green: '#059669',
  red: '#dc2626',
  amber: '#d97706',
  muted: 'var(--text-secondary, #94a3b8)',
  text: 'var(--text, #1a1a2e)',
  border: 'var(--border, #e2e8f0)',
};

// ─── Animation presets ───────────────────────────────────
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

// ─── Worker card sub-component ───────────────────────────
function WorkerCard({
  name,
  color,
  delay,
  progressDuration,
  progressTarget,
  doneDelay,
  success,
}: {
  name: string;
  color: string;
  delay: number;
  progressDuration: number;
  progressTarget: string;
  doneDelay: number;
  success: boolean;
}) {
  const doneColor = success ? C.green : C.red;
  const statusLabel = success ? 'done' : 'timeout!';

  return (
    <motion.div
      className="flex-1 rounded-xl border-2 p-3 flex flex-col gap-2 min-w-0"
      initial={{ opacity: 0, y: -8, borderColor: color }}
      animate={{ opacity: 1, y: 0, borderColor: doneColor }}
      transition={{
        opacity: { delay, duration: 0.5, ease: 'easeOut' as const },
        y: { delay, duration: 0.5, ease: 'easeOut' as const },
        borderColor: { delay: doneDelay, duration: 0.4 },
      }}
    >
      <div
        className="font-semibold text-[13px] text-center"
        style={{ color: C.text }}
      >
        {name}
      </div>

      {/* Progress bar */}
      <div
        className="h-2.5 rounded-full overflow-hidden"
        style={{ backgroundColor: C.border }}
      >
        <motion.div
          className="h-full rounded-full"
          initial={{ width: '0%', backgroundColor: color }}
          animate={{
            width: progressTarget,
            backgroundColor: doneColor,
          }}
          transition={{
            width: {
              delay: T.progress,
              duration: progressDuration,
              ease: success ? 'easeOut' : ('linear' as const),
            },
            backgroundColor: { delay: doneDelay, duration: 0.3 },
          }}
        />
      </div>

      {/* Status label */}
      <motion.div
        className="text-center text-[11px] font-mono font-semibold"
        style={{ color: doneColor }}
        {...fade(doneDelay + 0.15)}
      >
        {statusLabel}
      </motion.div>
    </motion.div>
  );
}

// ─── Result row sub-component ────────────────────────────
function ResultRow({
  text,
  success,
  delay,
}: {
  text: string;
  success: boolean;
  delay: number;
}) {
  const color = success ? C.green : C.red;
  const bg = success ? 'rgba(5,150,105,0.08)' : 'rgba(220,38,38,0.08)';
  const icon = success ? '\u2713' : '\u2717';

  return (
    <motion.div
      className="font-mono text-[11px] px-3 py-1.5 rounded-md flex items-center gap-2"
      style={{ color, backgroundColor: bg }}
      {...drop(delay)}
    >
      <span className="font-bold text-xs">{icon}</span>
      <span>{text}</span>
    </motion.div>
  );
}

// ─── Main component ──────────────────────────────────────
export default function Animation23FanOutFanIn() {
  return (
    <div
      className="w-full flex flex-col items-center select-none overflow-hidden py-4 px-3 gap-2.5"
      role="img"
      aria-label="Fan-out/fan-in pattern: coordinator dispatches tasks to database, cache, and API workers concurrently, then collects results including a timeout failure"
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {/* ── Coordinator box ── */}
      <motion.div
        className="rounded-xl border-2 px-8 py-3 text-center w-full max-w-[280px]"
        style={{ borderColor: C.blue, color: C.text }}
        {...drop(T.coord)}
      >
        <div className="font-bold text-sm">Coordinator</div>
        <div
          className="text-[11px] font-mono mt-1"
          style={{ color: C.muted }}
        >
          Task.yield_many(tasks, 5000)
        </div>
      </motion.div>

      {/* ── Fan-out section ── */}
      <motion.div
        className="text-[11px] font-mono tracking-wide"
        style={{ color: C.muted }}
        {...fade(T.dispatch)}
      >
        dispatch tasks
      </motion.div>

      <div className="flex gap-14">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="text-sm leading-none"
            style={{ color: C.muted }}
            {...fade(T.dispatchArrows + i * 0.08)}
          >
            {'\u2193'}
          </motion.div>
        ))}
      </div>

      {/* ── Worker cards ── */}
      <div className="flex gap-3 w-full max-w-lg">
        <WorkerCard
          name="Database"
          color={C.blue}
          delay={T.workers}
          progressDuration={T.dbDone - T.progress}
          progressTarget="100%"
          doneDelay={T.dbDone}
          success
        />
        <WorkerCard
          name="Cache"
          color={C.violet}
          delay={T.workers + T.stagger}
          progressDuration={T.cacheDone - T.progress}
          progressTarget="100%"
          doneDelay={T.cacheDone}
          success
        />
        <WorkerCard
          name="API"
          color={C.amber}
          delay={T.workers + T.stagger * 2}
          progressDuration={T.apiTimeout - T.progress}
          progressTarget="35%"
          doneDelay={T.apiTimeout}
          success={false}
        />
      </div>

      {/* ── Fan-in section ── */}
      <div className="flex gap-14">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="text-sm leading-none"
            style={{ color: C.muted }}
            {...fade(T.gatherArrows + i * 0.08)}
          >
            {'\u2193'}
          </motion.div>
        ))}
      </div>

      <motion.div
        className="text-[11px] font-mono tracking-wide"
        style={{ color: C.muted }}
        {...fade(T.gather)}
      >
        collect results
      </motion.div>

      {/* ── Results box ── */}
      <motion.div
        className="rounded-xl border-2 px-4 py-3 w-full max-w-sm flex flex-col gap-1.5"
        style={{ borderColor: C.border }}
        {...fade(T.result1 - 0.3)}
      >
        <ResultRow
          text="{:ok, db_data}"
          success
          delay={T.result1}
        />
        <ResultRow
          text="{:ok, cache_data}"
          success
          delay={T.result1 + T.resultGap}
        />
        <ResultRow
          text="{:exit, :timeout}"
          success={false}
          delay={T.result1 + T.resultGap * 2}
        />
      </motion.div>
    </div>
  );
}
