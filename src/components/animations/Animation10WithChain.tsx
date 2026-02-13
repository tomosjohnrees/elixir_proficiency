'use client';

import React from 'react';
import { motion } from 'motion/react';

// ─── Timing ─────────────────────────────────────
const T = {
  // Phase 1: Happy path
  h1Label: 0.5,
  h1Gates: 1.2,
  h1Check1: 2.4,
  h1Arrow12: 3.2,
  h1Check2: 3.8,
  h1Arrow23: 4.6,
  h1Check3: 5.2,
  h1ArrowDo: 6.0,
  h1Do: 6.4,

  // Phase 2: Short-circuit
  divider: 8.0,
  h2Label: 8.5,
  h2Gates: 9.2,
  h2Check1: 10.4,
  h2Arrow12: 11.0,
  h2Fail2: 11.6,
  h2Eject: 12.6,
  h2Skip3: 12.6,
  h2Else: 13.4,
};

// ─── Colors ─────────────────────────────────────
const C = {
  green: '#059669',
  red: '#dc2626',
  greenBg: 'rgba(5,150,105,0.08)',
  redBg: 'rgba(220,38,38,0.08)',
  muted: 'var(--text-secondary, #94a3b8)',
  text: 'var(--text, #1a1a2e)',
  border: '#e2e8f0',
  borderVar: 'var(--border, #e2e8f0)',
};

// ─── Animation presets ──────────────────────────
const fade = (delay: number, dur = 0.4) => ({
  initial: { opacity: 0 } as const,
  animate: { opacity: 1 } as const,
  transition: { delay, duration: dur, ease: 'easeOut' as const },
});

const drop = (delay: number) => ({
  initial: { opacity: 0, y: -6 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { delay, duration: 0.4, ease: 'easeOut' as const },
});

const STAGGER = 0.06;

// ─── Sub-components ─────────────────────────────

function Gate({
  pattern,
  fnName,
  status,
  showAt,
  checkAt,
}: {
  pattern: string;
  fnName: string;
  status: 'pass' | 'fail';
  showAt: number;
  checkAt: number;
}) {
  const color = status === 'pass' ? C.green : C.red;
  const bg = status === 'pass' ? C.greenBg : C.redBg;
  const icon = status === 'pass' ? '✓' : '✗';

  return (
    <motion.div {...fade(showAt)}>
      <motion.div
        className="relative px-3 py-2 rounded-lg border-2 text-center"
        initial={{ borderColor: C.border, backgroundColor: 'rgba(0,0,0,0)' }}
        animate={{ borderColor: color, backgroundColor: bg }}
        transition={{ delay: checkAt, duration: 0.4, ease: 'easeOut' }}
      >
        <div className="font-mono text-[11px] leading-snug" style={{ color: C.text }}>
          {pattern}
        </div>
        <div className="text-[9px] mt-0.5" style={{ color: C.muted }}>
          ← {fnName}
        </div>
        <motion.div
          className="absolute -top-2 -right-2 w-[18px] h-[18px] rounded-full text-[10px]
            flex items-center justify-center text-white font-bold leading-none"
          style={{ backgroundColor: color }}
          {...fade(checkAt, 0.3)}
        >
          {icon}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function SkippedGate({
  pattern,
  fnName,
  showAt,
}: {
  pattern: string;
  fnName: string;
  showAt: number;
}) {
  return (
    <motion.div {...fade(showAt)}>
      <div
        className="relative px-3 py-2 rounded-lg border-2 text-center opacity-30"
        style={{ borderColor: 'var(--text-secondary, #94a3b8)', borderStyle: 'dashed' }}
      >
        <div className="font-mono text-[11px] leading-snug" style={{ color: C.muted }}>
          {pattern}
        </div>
        <div className="text-[9px] mt-0.5" style={{ color: C.muted }}>
          ← {fnName}
        </div>
        <div
          className="absolute -top-2 -right-2 w-[18px] h-[18px] rounded-full text-[10px]
            flex items-center justify-center text-white font-bold leading-none"
          style={{ backgroundColor: 'var(--text-secondary, #94a3b8)' }}
        >
          –
        </div>
      </div>
      <div className="text-[9px] mt-1 text-center italic" style={{ color: C.muted }}>
        skipped
      </div>
    </motion.div>
  );
}

function FlowArrow({ delay, color }: { delay: number; color?: string }) {
  return (
    <motion.span
      className="text-sm font-mono leading-none"
      style={{ color: color || C.muted }}
      {...fade(delay, 0.3)}
    >
      →
    </motion.span>
  );
}

// ─── Main component ─────────────────────────────
export default function Animation10WithChain() {
  return (
    <div
      className="w-full flex flex-col gap-5 select-none overflow-hidden"
      role="img"
      aria-label="Animation showing how Elixir's with expression chains pattern matches on the happy path, then short-circuits to the else block on the first failure"
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {/* ═══ Phase 1: Happy Path ═══ */}
      <div className="flex flex-col gap-2">
        <motion.div
          className="text-[11px] font-semibold tracking-wider uppercase"
          style={{ color: C.green }}
          {...fade(T.h1Label)}
        >
          Happy path — all stages match
        </motion.div>

        <div className="flex items-center gap-2">
          <Gate
            pattern="{:ok, user}"
            fnName="fetch_user()"
            status="pass"
            showAt={T.h1Gates}
            checkAt={T.h1Check1}
          />
          <FlowArrow delay={T.h1Arrow12} color={C.green} />
          <Gate
            pattern="{:ok, email}"
            fnName="get_email(user)"
            status="pass"
            showAt={T.h1Gates + STAGGER}
            checkAt={T.h1Check2}
          />
          <FlowArrow delay={T.h1Arrow23} color={C.green} />
          <Gate
            pattern="{:ok, token}"
            fnName="gen_token(email)"
            status="pass"
            showAt={T.h1Gates + STAGGER * 2}
            checkAt={T.h1Check3}
          />
          <FlowArrow delay={T.h1ArrowDo} color={C.green} />

          <motion.div
            className="px-3 py-2 rounded-lg border-2 text-center"
            style={{ borderColor: C.green, backgroundColor: C.greenBg }}
            {...drop(T.h1Do)}
          >
            <div className="text-[10px] font-semibold" style={{ color: C.green }}>do</div>
            <div className="font-mono text-[11px]" style={{ color: C.text }}>send(token)</div>
          </motion.div>
        </div>
      </div>

      {/* ═══ Divider ═══ */}
      <motion.div
        className="h-px w-full"
        style={{ backgroundColor: C.borderVar }}
        {...fade(T.divider)}
      />

      {/* ═══ Phase 2: Short-Circuit ═══ */}
      <div className="flex flex-col gap-2">
        <motion.div
          className="text-[11px] font-semibold tracking-wider uppercase"
          style={{ color: C.red }}
          {...fade(T.h2Label)}
        >
          Short-circuit — stage 2 fails
        </motion.div>

        <div className="flex items-center gap-2">
          <Gate
            pattern="{:ok, user}"
            fnName="fetch_user()"
            status="pass"
            showAt={T.h2Gates}
            checkAt={T.h2Check1}
          />
          <FlowArrow delay={T.h2Arrow12} color={C.green} />
          <Gate
            pattern="{:ok, email}"
            fnName="get_email(user)"
            status="fail"
            showAt={T.h2Gates + STAGGER}
            checkAt={T.h2Fail2}
          />
          <FlowArrow delay={T.h2Skip3} />
          <SkippedGate
            pattern="{:ok, token}"
            fnName="gen_token(email)"
            showAt={T.h2Skip3}
          />
        </div>

        {/* Eject arrow + else block */}
        <div className="flex flex-col items-center gap-1.5">
          <motion.div
            className="text-base font-bold leading-none"
            style={{ color: C.red }}
            {...fade(T.h2Eject, 0.3)}
          >
            ↓
          </motion.div>
          <motion.div
            className="px-3 py-2 rounded-lg border-2 text-center"
            style={{ borderColor: C.red, backgroundColor: C.redBg }}
            {...drop(T.h2Else)}
          >
            <div className="text-[10px] font-semibold" style={{ color: C.red }}>else</div>
            <div className="font-mono text-[11px]" style={{ color: C.text }}>
              {'{:error, :not_found}'}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
