'use client';

import React from 'react';
import { motion } from 'motion/react';

// ─── Timing constants ────────────────────────────────
const T = {
  request: 1.0,
  endpoint: 2.5,
  connCreate: 3.0,
  router: 5.0,
  route: 5.5,
  pipeline: 7.5,
  plugs: 8.0,
  controller: 10.0,
  assigns: 10.5,
  view: 12.5,
  response: 13.0,
};

// ─── Colors ──────────────────────────────────────────
const C = {
  endpoint: '#6b7280',
  router: '#2563eb',
  pipeline: '#7c3aed',
  controller: '#d97706',
  view: '#059669',
  conn: '#e11d48',
  muted: 'var(--text-secondary, #94a3b8)',
  text: 'var(--text, #1a1a2e)',
  border: 'var(--border, #e2e8f0)',
  surface: 'var(--surface, #fff)',
};

// ─── Animation presets ───────────────────────────────
const fade = (delay: number, dur = 0.5) => ({
  initial: { opacity: 0 } as const,
  animate: { opacity: 1 } as const,
  transition: { delay, duration: dur, ease: 'easeOut' as const },
});

const drop = (delay: number) => ({
  initial: { opacity: 0, y: -8 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { delay, duration: 0.45, ease: 'easeOut' as const },
});

const slideRight = (delay: number) => ({
  initial: { opacity: 0, x: -10 } as const,
  animate: { opacity: 1, x: 0 } as const,
  transition: { delay, duration: 0.4, ease: 'easeOut' as const },
});

const scaleIn = (delay: number) => ({
  initial: { opacity: 0, scale: 0.9 } as const,
  animate: { opacity: 1, scale: 1 } as const,
  transition: { delay, duration: 0.5, ease: 'easeOut' as const },
});

// ─── Stage data ──────────────────────────────────────
const stages = [
  { name: 'Endpoint', color: C.endpoint, time: T.endpoint },
  { name: 'Router', color: C.router, time: T.router },
  { name: 'Pipeline', color: C.pipeline, time: T.pipeline },
  { name: 'Controller', color: C.controller, time: T.controller },
  { name: 'View', color: C.view, time: T.view },
];

// ─── Sub-components ──────────────────────────────────
function ConnGroup({
  color,
  delay,
  children,
}: {
  color: string;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className="pl-2.5 border-l-2 flex flex-col gap-0.5"
      style={{ borderLeftColor: color }}
      {...slideRight(delay)}
    >
      {children}
    </motion.div>
  );
}

function Attr({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-[11px] font-mono leading-snug">
      <span style={{ color: C.muted }}>{label}: </span>
      <span style={{ color: C.text }}>{value}</span>
    </div>
  );
}

// ─── Main component ─────────────────────────────────
export default function Animation09PhoenixRequest() {
  return (
    <div
      className="w-full flex flex-col items-center gap-3 select-none overflow-hidden px-2 py-3"
      role="img"
      aria-label="Phoenix request lifecycle: HTTP request flows through Endpoint, Router, Pipeline, Controller, and View, with the conn struct accumulating data at each stage before becoming an HTML response"
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {/* ── Pipeline flow ── */}
      <div className="flex items-center gap-1 flex-wrap justify-center">
        {/* HTTP Request badge */}
        <motion.div
          className="px-2 py-1 rounded-md text-[10px] font-mono font-semibold text-white shrink-0"
          style={{ backgroundColor: '#3b82f6' }}
          {...drop(T.request)}
        >
          GET /users/42
        </motion.div>

        <motion.span
          className="text-[10px] shrink-0"
          style={{ color: C.muted }}
          {...fade(T.request + 0.3, 0.3)}
        >
          →
        </motion.span>

        {/* Station pills */}
        {stages.map((s, i) => (
          <React.Fragment key={s.name}>
            <motion.div
              className="px-2 py-1 rounded-md border-2 text-[10px] font-semibold shrink-0"
              initial={{ borderColor: C.border, color: C.muted, opacity: 0.35 }}
              animate={{
                borderColor: s.color,
                color: s.color,
                opacity: 1,
                boxShadow: `0 0 10px ${s.color}25`,
              }}
              transition={{ delay: s.time, duration: 0.5, ease: 'easeOut' }}
            >
              {s.name}
            </motion.div>
            {i < stages.length - 1 && (
              <motion.span
                className="text-[10px] shrink-0"
                style={{ color: C.muted }}
                {...fade(s.time + 0.3, 0.3)}
              >
                →
              </motion.span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ── Conn card ── */}
      <motion.div
        className="w-full max-w-sm rounded-xl border-2 px-3 py-2.5 flex flex-col gap-1.5"
        style={{ borderColor: C.border, backgroundColor: C.surface }}
        {...scaleIn(T.connCreate)}
      >
        <div
          className="text-[11px] font-mono font-bold"
          style={{ color: C.conn }}
        >
          {'conn = %Plug.Conn{}'}
        </div>

        <div className="h-px" style={{ backgroundColor: C.border }} />

        {/* Endpoint: initial request data */}
        <ConnGroup color={C.endpoint} delay={T.connCreate + 0.2}>
          <Attr label="method" value={'"GET"'} />
          <Attr label="path_info" value={'["users", "42"]'} />
        </ConnGroup>

        {/* Router: matched route */}
        <ConnGroup color={C.router} delay={T.route}>
          <Attr label="controller" value="UserController" />
          <Attr label="action" value=":show" />
        </ConnGroup>

        {/* Pipeline: plug-added data */}
        <ConnGroup color={C.pipeline} delay={T.plugs}>
          <Attr label="session" value={'%{user_id: 7}'} />
          <Attr label="csrf_token" value={'"a3f8c9..."'} />
        </ConnGroup>

        {/* Controller: assigns */}
        <ConnGroup color={C.controller} delay={T.assigns}>
          <Attr label="assigns.user" value={'%User{name: "Alice"}'} />
        </ConnGroup>
      </motion.div>

      {/* ── View renders response ── */}
      <motion.div
        className="flex items-center gap-2"
        {...fade(T.view + 0.3)}
      >
        <span className="text-[10px] font-medium" style={{ color: C.muted }}>
          View renders
        </span>
        <span className="text-[10px]" style={{ color: C.muted }}>→</span>
        <motion.div
          className="px-3 py-1.5 rounded-md text-[11px] font-mono font-semibold text-white"
          style={{ backgroundColor: C.view }}
          {...scaleIn(T.response)}
        >
          200 OK — HTML
        </motion.div>
      </motion.div>
    </div>
  );
}
