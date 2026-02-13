'use client';

import React from 'react';
import { motion } from 'motion/react';

// ─── Timing constants ────────────────────────────────────
const T = {
  plugsAppear: 0.6,
  connEnter: 1.8,
  connAtLogger: 3.0,
  loggerCheck: 3.6,
  connAtAuth: 5.0,
  authCheck: 5.8,
  authFail: 6.8,
  haltLabel: 7.4,
  grayOut: 7.8,
  response: 8.8,
};

const STAGGER = 0.12;

// ─── Colors ──────────────────────────────────────────────
const C = {
  blue: '#3b82f6',
  green: '#059669',
  red: '#dc2626',
  amber: '#d97706',
  violet: '#8b5cf6',
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

// ─── Plug box sub-component ─────────────────────────────
function PlugBox({
  label,
  sublabel,
  index,
  color,
  grayOut,
}: {
  label: string;
  sublabel?: string;
  index: number;
  color: string;
  grayOut?: boolean;
}) {
  return (
    <motion.div
      className="flex flex-col items-center gap-1"
      {...drop(T.plugsAppear + index * STAGGER)}
    >
      <motion.div
        className="relative rounded-xl border-2 px-3 py-2.5 flex flex-col items-center justify-center min-w-[90px]"
        style={{ borderColor: color, backgroundColor: C.surface }}
        animate={
          grayOut
            ? { opacity: 0.3, borderColor: C.muted }
            : { opacity: 1, borderColor: color }
        }
        transition={{ delay: grayOut ? T.grayOut : 0, duration: 0.5 }}
      >
        <span
          className="text-[11px] font-mono font-semibold leading-tight text-center"
          style={{ color: C.text }}
        >
          {label}
        </span>
        {sublabel && (
          <span
            className="text-[9px] mt-0.5 leading-tight"
            style={{ color: C.muted }}
          >
            {sublabel}
          </span>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Arrow between plugs ────────────────────────────────
function Arrow({ index, grayOut }: { index: number; grayOut?: boolean }) {
  return (
    <motion.span
      className="text-sm font-mono shrink-0"
      style={{ color: C.muted }}
      {...fade(T.plugsAppear + index * STAGGER + 0.1)}
      animate={
        grayOut
          ? { opacity: 0.2 }
          : { opacity: 1 }
      }
      transition={{ delay: grayOut ? T.grayOut : T.plugsAppear + index * STAGGER + 0.1, duration: 0.4 }}
    >
      →
    </motion.span>
  );
}

// ─── Conn badge ──────────────────────────────────────────
function ConnBadge() {
  return (
    <motion.div
      className="absolute rounded-lg px-2.5 py-1 font-mono text-[10px] font-semibold text-white whitespace-nowrap"
      style={{ backgroundColor: C.blue }}
      initial={{ opacity: 0, x: -30 }}
      animate={{
        opacity: [0, 1, 1, 1, 1, 1],
        x: [-30, 0, 100, 208, 208, 208],
      }}
      transition={{
        duration: T.authCheck - T.connEnter + 0.3,
        delay: T.connEnter,
        ease: 'easeInOut',
        times: [0, 0.15, 0.45, 0.75, 0.85, 1],
      }}
    >
      %Conn{'{}'}
    </motion.div>
  );
}

// ─── Main component ──────────────────────────────────────
export default function Animation32PlugHalt() {
  return (
    <div
      className="w-full flex flex-col items-center select-none overflow-hidden gap-5 py-4 px-2"
      role="img"
      aria-label="Plug pipeline showing conn halted at authentication plug, preventing access to subsequent plugs and the controller"
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {/* Title */}
      <motion.div
        className="text-sm font-semibold tracking-wide"
        style={{ color: C.text }}
        {...fade(0.2)}
      >
        Plug Pipeline with halt()
      </motion.div>

      {/* Pipeline row */}
      <div className="relative flex items-center gap-2.5 justify-center flex-wrap">
        <PlugBox label="Plug.Logger" index={0} color={C.blue} />
        <Arrow index={1} />
        <PlugBox label="RequireAuth" index={1} color={C.amber} />
        <Arrow index={2} grayOut />
        <PlugBox label="CSRF" sublabel="protect" index={2} color={C.violet} grayOut />
        <Arrow index={3} grayOut />
        <PlugBox label="Controller" sublabel=":show" index={3} color={C.green} grayOut />

        {/* Conn badge moving through pipeline */}
        <div className="absolute left-0 -bottom-7">
          <ConnBadge />
        </div>
      </div>

      {/* Status area below the pipeline */}
      <div className="flex flex-col items-center gap-2 mt-5 min-h-[100px]">
        {/* Logger check mark */}
        <motion.div
          className="flex items-center gap-1.5 text-[11px] font-mono"
          {...fade(T.loggerCheck)}
        >
          <span
            className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px]"
            style={{ backgroundColor: C.green }}
          >
            ✓
          </span>
          <span style={{ color: C.muted }}>Plug.Logger — passed</span>
        </motion.div>

        {/* Auth check — no current_user */}
        <motion.div
          className="flex items-center gap-1.5 text-[11px] font-mono"
          {...fade(T.authCheck)}
        >
          <span
            className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px]"
            style={{ backgroundColor: C.red }}
          >
            ✗
          </span>
          <span style={{ color: C.muted }}>RequireAuth — no current_user</span>
        </motion.div>

        {/* halt() called */}
        <motion.div
          className="flex items-center gap-2 mt-1"
          {...drop(T.haltLabel)}
        >
          <div
            className="rounded-lg border-2 px-3 py-1.5 font-mono text-xs font-bold"
            style={{ borderColor: C.red, color: C.red, backgroundColor: 'rgba(220,38,38,0.06)' }}
          >
            halt()
          </div>
          <span className="text-[10px]" style={{ color: C.muted }}>
            pipeline stopped
          </span>
        </motion.div>

        {/* Auth plug flash red */}
        <motion.div
          className="absolute"
          style={{
            left: 'calc(50% - 108px)',
            top: '42px',
            width: 90,
            height: 46,
            borderRadius: 12,
            border: `2px solid ${C.red}`,
            backgroundColor: 'rgba(220,38,38,0.08)',
            pointerEvents: 'none',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0] }}
          transition={{ delay: T.authFail, duration: 1.2, ease: 'easeInOut' }}
        />

        {/* 403 response */}
        <motion.div
          className="flex items-center gap-2 mt-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: T.response, duration: 0.5, ease: 'easeOut' }}
        >
          <div
            className="rounded-lg px-3 py-1.5 font-mono text-xs font-bold text-white"
            style={{ backgroundColor: C.red }}
          >
            403 Forbidden
          </div>
          <motion.span
            className="text-[10px]"
            style={{ color: C.muted }}
            {...fade(T.response + 0.3)}
          >
            ← sent back to client
          </motion.span>
        </motion.div>

        {/* Explanatory note */}
        <motion.p
          className="text-[10px] text-center max-w-xs mt-1"
          style={{ color: C.muted }}
          {...fade(T.response + 0.8)}
        >
          CSRF, Controller, and all subsequent plugs are never reached
        </motion.p>
      </div>
    </div>
  );
}
