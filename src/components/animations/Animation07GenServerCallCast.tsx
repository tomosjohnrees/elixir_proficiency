'use client';

import React from 'react';
import { motion } from 'motion/react';

// ─── Timing constants ────────────────────────────────────
const T = {
  // Labels appear
  labels: 0.8,
  // Call side
  callRequest: 2.0,
  callFreeze: 3.2,
  callProcess: 4.0,
  callReply: 5.5,
  callUnfreeze: 6.5,
  // Cast side
  castRequest: 2.0,
  castContinue: 3.2,
  castProcess: 4.0,
  // Summary labels
  callSummary: 8.0,
  castSummary: 8.0,
};

// ─── Colors ──────────────────────────────────────────────
const C = {
  blue: '#3b82f6',
  violet: '#8b5cf6',
  green: '#059669',
  amber: '#d97706',
  red: '#dc2626',
  muted: 'var(--text-secondary, #94a3b8)',
  text: 'var(--text, #1a1a2e)',
  surface: 'var(--surface, #fff)',
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
  transition: { delay, duration: 0.4, ease: 'easeOut' as const },
});

// ─── Sub-components ──────────────────────────────────────
function Lane({ label, delay }: { label: string; delay: number }) {
  return (
    <motion.div
      className="text-[11px] font-mono font-semibold tracking-wide text-center"
      style={{ color: C.text }}
      {...fade(delay)}
    >
      {label}
    </motion.div>
  );
}

function ProcessBox({
  label,
  delay,
  color,
  frozen,
  frozenDelay,
  unfreezeDelay,
}: {
  label: string;
  delay: number;
  color: string;
  frozen?: boolean;
  frozenDelay?: number;
  unfreezeDelay?: number;
}) {
  return (
    <motion.div
      className="relative rounded-lg border-2 px-3 py-1.5 text-[11px] font-mono font-medium text-center"
      style={{ borderColor: color, color: C.text, backgroundColor: C.surface }}
      {...fade(delay)}
    >
      {label}
      {frozen && frozenDelay !== undefined && (
        <motion.div
          className="absolute inset-0 rounded-lg flex items-center justify-center text-[10px] font-sans"
          style={{ backgroundColor: 'rgba(148,163,184,0.15)', color: C.muted }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{
            delay: frozenDelay,
            duration: (unfreezeDelay ?? frozenDelay + 3) - frozenDelay,
            times: [0, 0.1, 0.85, 1],
            ease: 'easeInOut',
          }}
        >
          ⏳ waiting...
        </motion.div>
      )}
    </motion.div>
  );
}

function Arrow({
  direction,
  label,
  delay,
  color,
}: {
  direction: 'down' | 'up';
  label: string;
  delay: number;
  color: string;
}) {
  const isDown = direction === 'down';
  return (
    <motion.div
      className="flex flex-col items-center gap-0.5 my-1"
      initial={{ opacity: 0, y: isDown ? -6 : 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
    >
      {isDown && (
        <div className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ color, backgroundColor: `${color}15` }}>
          {label}
        </div>
      )}
      <div className="text-sm" style={{ color }}>
        {isDown ? '↓' : '↑'}
      </div>
      {!isDown && (
        <div className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ color, backgroundColor: `${color}15` }}>
          {label}
        </div>
      )}
    </motion.div>
  );
}

function ServerProcessing({ delay, duration, color }: { delay: number; duration: number; color: string }) {
  return (
    <motion.div
      className="flex items-center gap-1.5 justify-center my-1"
      {...fade(delay)}
    >
      <motion.div
        className="h-1.5 rounded-full"
        style={{ backgroundColor: color, width: 0 }}
        animate={{ width: 48 }}
        transition={{ delay: delay + 0.2, duration, ease: 'easeInOut' }}
      />
      <span className="text-[10px] font-sans" style={{ color: C.muted }}>
        processing
      </span>
    </motion.div>
  );
}

function NoReply({ delay }: { delay: number }) {
  return (
    <motion.div
      className="flex items-center justify-center gap-1 my-1 text-[10px] font-mono"
      style={{ color: C.muted }}
      {...fade(delay)}
    >
      <span style={{ textDecoration: 'line-through', textDecorationColor: C.muted }}>↑ reply</span>
      <span className="font-sans">no reply</span>
    </motion.div>
  );
}

function SummaryLabel({ text, color, delay }: { text: string; color: string; delay: number }) {
  return (
    <motion.div
      className="text-[10px] font-sans font-medium text-center mt-2 px-2 py-1 rounded-md"
      style={{ color, backgroundColor: `${color}12` }}
      {...drop(delay)}
    >
      {text}
    </motion.div>
  );
}

// ─── Main component ──────────────────────────────────────
export default function Animation07GenServerCallCast() {
  return (
    <div
      className="w-full flex select-none overflow-hidden"
      role="img"
      aria-label="GenServer call vs cast: call is synchronous where the client waits for a reply, cast is asynchronous where the client continues immediately without waiting"
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {/* Call side */}
      <div className="flex-1 flex flex-col items-center min-w-0 px-2">
        <motion.h3
          className="text-xs font-semibold mb-3 tracking-wide"
          style={{ color: C.violet }}
          {...fade(T.labels, 0.5)}
        >
          GenServer.call
        </motion.h3>

        <div className="w-full flex gap-3 justify-center">
          {/* Client lane */}
          <div className="flex flex-col items-center gap-1 min-w-[72px]">
            <Lane label="Client" delay={T.labels} />
            <ProcessBox
              label="caller"
              delay={T.labels + 0.3}
              color={C.violet}
              frozen
              frozenDelay={T.callFreeze}
              unfreezeDelay={T.callUnfreeze}
            />
            <motion.div
              className="text-[10px] font-sans text-center mt-1"
              style={{ color: C.green }}
              {...fade(T.callUnfreeze)}
            >
              ✓ got reply
            </motion.div>
          </div>

          {/* Arrows between */}
          <div className="flex flex-col items-center justify-center pt-5">
            <Arrow direction="down" label=":get_count" delay={T.callRequest} color={C.violet} />
            <ServerProcessing delay={T.callProcess} duration={1.2} color={C.violet} />
            <Arrow direction="up" label="{:ok, 42}" delay={T.callReply} color={C.green} />
          </div>

          {/* Server lane */}
          <div className="flex flex-col items-center gap-1 min-w-[72px]">
            <Lane label="Server" delay={T.labels} />
            <ProcessBox label="GenServer" delay={T.labels + 0.3} color={C.violet} />
          </div>
        </div>

        <SummaryLabel text="Caller blocks until reply" color={C.violet} delay={T.callSummary} />
      </div>

      {/* Dashed divider */}
      <div
        className="w-px shrink-0 mx-1 self-stretch"
        style={{
          backgroundImage: `repeating-linear-gradient(to bottom, ${C.border} 0px 4px, transparent 4px 7px)`,
        }}
      />

      {/* Cast side */}
      <div className="flex-1 flex flex-col items-center min-w-0 px-2">
        <motion.h3
          className="text-xs font-semibold mb-3 tracking-wide"
          style={{ color: C.blue }}
          {...fade(T.labels, 0.5)}
        >
          GenServer.cast
        </motion.h3>

        <div className="w-full flex gap-3 justify-center">
          {/* Client lane */}
          <div className="flex flex-col items-center gap-1 min-w-[72px]">
            <Lane label="Client" delay={T.labels} />
            <ProcessBox label="caller" delay={T.labels + 0.3} color={C.blue} />
            <motion.div
              className="text-[10px] font-sans text-center mt-1"
              style={{ color: C.blue }}
              {...fade(T.castContinue)}
            >
              → continues
            </motion.div>
          </div>

          {/* Arrows between */}
          <div className="flex flex-col items-center justify-center pt-5">
            <Arrow direction="down" label="{:push, 5}" delay={T.castRequest} color={C.blue} />
            <ServerProcessing delay={T.castProcess} duration={1.2} color={C.blue} />
            <NoReply delay={T.castProcess + 1.5} />
          </div>

          {/* Server lane */}
          <div className="flex flex-col items-center gap-1 min-w-[72px]">
            <Lane label="Server" delay={T.labels} />
            <ProcessBox label="GenServer" delay={T.labels + 0.3} color={C.blue} />
          </div>
        </div>

        <SummaryLabel text="Caller continues immediately" color={C.blue} delay={T.castSummary} />
      </div>
    </div>
  );
}
