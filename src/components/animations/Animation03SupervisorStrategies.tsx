'use client';

import React from 'react';
import { motion } from 'motion/react';

// ─── Timing constants ────────────────────────────────────
// Phase 1: Initial state
// Phase 2: B crashes
// Phase 3: Supervisor detects → kills affected children
// Phase 4: All affected children respawn fresh
const T = {
  init: 0.5,         // children + supervisor bars appear
  crash: 2.5,        // B flashes red and dies
  crashDead: 3.5,    // B fully collapsed
  detect: 5.0,       // supervisor bar flashes — "detected!"
  kill: 6.5,         // kill signal reaches affected children
  killDone: 7.5,     // affected children fully collapsed
  respawn: 9.0,      // all affected children spring back
  respawnStagger: 0.3,
  labels: 11.0,      // description text appears
};

// ─── Colors ──────────────────────────────────────────────
const C = {
  green: '#059669',
  red: '#dc2626',
  blue: '#3b82f6',
  violet: '#8b5cf6',
  amber: '#d97706',
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

// ─── Types ───────────────────────────────────────────────
type ChildRole = 'crasher' | 'killed' | 'survivor';

interface ChildConfig {
  label: string;
  role: ChildRole;
  killDelay?: number;    // stagger for kill signal (killed children only)
  respawnDelay?: number; // stagger for respawn
}

// ─── Connector line from supervisor to child ─────────────
function ConnectorLine({
  role,
  strategyColor,
}: {
  role: ChildRole;
  strategyColor: string;
}) {
  if (role === 'survivor') {
    // Static line
    return (
      <motion.div
        className="w-0.5 h-5 mx-auto"
        style={{ backgroundColor: C.border }}
        {...fade(T.init + 0.3)}
      />
    );
  }

  if (role === 'crasher') {
    // Line turns red when crash is detected
    return (
      <motion.div
        className="w-0.5 h-5 mx-auto"
        style={{ backgroundColor: C.border }}
        initial={{ backgroundColor: C.border, opacity: 0 }}
        animate={{
          backgroundColor: [C.border, C.border, C.red, C.red, strategyColor],
          opacity: 1,
        }}
        transition={{
          delay: T.init + 0.3,
          duration: T.respawn - T.init,
          times: [
            0,
            (T.crash - T.init) / (T.respawn - T.init),
            (T.crashDead - T.init) / (T.respawn - T.init),
            (T.detect - T.init) / (T.respawn - T.init),
            1,
          ],
          ease: 'linear',
        }}
      />
    );
  }

  // killed — line shows kill signal traveling down
  return (
    <div className="relative w-0.5 h-5 mx-auto">
      <motion.div
        className="absolute inset-0"
        style={{ backgroundColor: C.border }}
        {...fade(T.init + 0.3)}
      />
      {/* Kill signal pulse traveling down the line */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: C.red }}
        initial={{ opacity: 0, top: 0 }}
        animate={{
          opacity: [0, 0, 1, 1, 0],
          top: ['0%', '0%', '0%', '100%', '100%'],
        }}
        transition={{
          delay: T.detect,
          duration: T.kill - T.detect + 0.3,
          times: [0, 0.05, 0.1, 0.8, 1],
          ease: 'easeIn',
        }}
      />
    </div>
  );
}

// ─── Static (survivor) child ─────────────────────────────
function SurvivorChild({ label }: { label: string }) {
  return (
    <motion.div
      className="w-12 h-12 rounded-lg flex items-center justify-center
                 font-mono text-sm font-semibold border-2"
      style={{ borderColor: C.border, color: C.text, backgroundColor: C.surface }}
      {...drop(T.init)}
    >
      {label}
    </motion.div>
  );
}

// ─── Crasher child (B — the one that crashes) ────────────
function CrasherChild({ label, strategyColor }: { label: string; strategyColor: string }) {
  return (
    <div className="relative w-12 h-12">
      {/* Healthy → crash → collapse */}
      <motion.div
        className="absolute inset-0 rounded-lg flex items-center justify-center
                   font-mono text-sm font-semibold border-2"
        style={{ color: C.text, backgroundColor: C.surface }}
        initial={{ opacity: 0, y: -8, borderColor: C.border }}
        animate={{
          opacity: [0, 1, 1, 1, 0],
          y: [-8, 0, 0, 0, 8],
          scale: [1, 1, 1, 1.06, 0],
          borderColor: [C.border, C.border, C.red, C.red, C.red],
        }}
        transition={{
          delay: T.init,
          duration: T.crashDead - T.init,
          times: [0, 0.15, (T.crash - T.init) / (T.crashDead - T.init), 0.85, 1],
          ease: 'easeInOut',
        }}
      >
        {label}
      </motion.div>

      {/* Red ✕ flash on crash */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center
                   text-xl font-bold pointer-events-none"
        style={{ color: C.red }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0, 1.3, 1, 0.5] }}
        transition={{
          delay: T.crash,
          duration: 1.5,
          times: [0, 0.15, 0.6, 1],
          ease: 'easeOut',
        }}
      >
        ✕
      </motion.div>

      {/* Respawned */}
      <motion.div
        className="absolute inset-0 rounded-lg flex items-center justify-center
                   font-mono text-sm font-semibold border-2"
        style={{ borderColor: strategyColor, color: C.text, backgroundColor: C.surface }}
        initial={{ opacity: 0, scale: 0, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          delay: T.respawn,
          duration: 0.5,
          ease: 'easeOut',
        }}
      >
        {label}
      </motion.div>
    </div>
  );
}

// ─── Killed child (collateral from supervisor strategy) ──
function KilledChild({
  label,
  killDelay,
  respawnDelay,
  strategyColor,
}: {
  label: string;
  killDelay: number;
  respawnDelay: number;
  strategyColor: string;
}) {
  const killAt = T.kill + killDelay;
  const killEnd = killAt + 0.6;
  const respawnAt = T.respawn + respawnDelay;

  return (
    <div className="relative w-12 h-12">
      {/* Healthy → killed by supervisor */}
      <motion.div
        className="absolute inset-0 rounded-lg flex items-center justify-center
                   font-mono text-sm font-semibold border-2"
        style={{ color: C.text, backgroundColor: C.surface }}
        initial={{ opacity: 0, y: -8, borderColor: C.border }}
        animate={{
          opacity: [0, 1, 1, 1, 0],
          y: [-8, 0, 0, 0, 8],
          scale: [1, 1, 1, 1, 0],
          borderColor: [C.border, C.border, C.border, C.red, C.red],
        }}
        transition={{
          delay: T.init,
          duration: killEnd - T.init,
          times: [
            0,
            0.12,
            (killAt - 0.2 - T.init) / (killEnd - T.init),
            (killAt - T.init) / (killEnd - T.init),
            1,
          ],
          ease: 'easeInOut',
        }}
      >
        {label}
      </motion.div>

      {/* "Killed" label flash */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <motion.span
          className="text-[8px] font-bold uppercase tracking-wider"
          style={{ color: C.red }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            delay: killAt,
            duration: 1.2,
            times: [0, 0.2, 1],
            ease: 'easeOut',
          }}
        >
          STOP
        </motion.span>
      </motion.div>

      {/* Respawned */}
      <motion.div
        className="absolute inset-0 rounded-lg flex items-center justify-center
                   font-mono text-sm font-semibold border-2"
        style={{ borderColor: strategyColor, color: C.text, backgroundColor: C.surface }}
        initial={{ opacity: 0, scale: 0, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          delay: respawnAt,
          duration: 0.5,
          ease: 'easeOut',
        }}
      >
        {label}
      </motion.div>
    </div>
  );
}

// ─── Child dispatcher ────────────────────────────────────
function ChildBox({
  child,
  strategyColor,
}: {
  child: ChildConfig;
  strategyColor: string;
}) {
  switch (child.role) {
    case 'survivor':
      return <SurvivorChild label={child.label} />;
    case 'crasher':
      return <CrasherChild label={child.label} strategyColor={strategyColor} />;
    case 'killed':
      return (
        <KilledChild
          label={child.label}
          killDelay={child.killDelay ?? 0}
          respawnDelay={child.respawnDelay ?? 0}
          strategyColor={strategyColor}
        />
      );
  }
}

// ─── Strategy Row ────────────────────────────────────────
function StrategyRow({
  strategy,
  color,
  children,
  description,
  rowDelay,
}: {
  strategy: string;
  color: string;
  children: ChildConfig[];
  description: string;
  rowDelay: number;
}) {
  const hasKilledChildren = children.some((c) => c.role === 'killed');

  return (
    <motion.div
      className="flex flex-col items-center gap-0"
      {...fade(rowDelay)}
    >
      {/* Strategy label */}
      <motion.div
        className="text-[11px] font-mono font-semibold tracking-wide mb-1.5"
        style={{ color }}
        {...fade(rowDelay + 0.1)}
      >
        :{strategy}
      </motion.div>

      {/* Supervisor bar — pulses when detecting crash */}
      <motion.div
        className="w-full h-7 rounded-md flex items-center justify-center
                   text-[10px] font-semibold tracking-wider uppercase relative overflow-hidden"
        style={{ backgroundColor: color, color: '#fff' }}
        initial={{ opacity: 0, y: -8 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: [1, 1, 1, 1.05, 1],
        }}
        transition={{
          opacity: { delay: rowDelay + 0.2, duration: 0.4 },
          y: { delay: rowDelay + 0.2, duration: 0.4 },
          scale: {
            delay: T.detect - 0.3,
            duration: 1.2,
            times: [0, 0.2, 0.4, 0.6, 1],
            ease: 'easeInOut',
          },
        }}
      >
        Supervisor
        {/* "Detected!" flash overlay */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center
                     bg-white/20 text-[9px] font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            delay: T.detect - 0.2,
            duration: 1.4,
            times: [0, 0.15, 1],
            ease: 'easeOut',
          }}
        >
          {hasKilledChildren ? 'RESTARTING...' : 'RESTART B'}
        </motion.div>
      </motion.div>

      {/* Connector lines */}
      <div className="flex items-start justify-center gap-3 w-full px-3">
        {children.map((child) => (
          <div key={child.label} className="flex-1 flex justify-center">
            <ConnectorLine role={child.role} strategyColor={color} />
          </div>
        ))}
      </div>

      {/* Children */}
      <div className="flex items-center gap-3">
        {children.map((child) => (
          <ChildBox key={child.label} child={child} strategyColor={color} />
        ))}
      </div>

      {/* Description */}
      <motion.div
        className="text-[10px] text-center leading-tight mt-2 max-w-40"
        style={{ color: C.muted }}
        {...fade(T.labels)}
      >
        {description}
      </motion.div>
    </motion.div>
  );
}

// ─── Strategy data ───────────────────────────────────────
const strategies = [
  {
    strategy: 'one_for_one',
    color: C.green,
    children: [
      { label: 'A', role: 'survivor' as const },
      { label: 'B', role: 'crasher' as const },
      { label: 'C', role: 'survivor' as const },
    ],
    description: 'Only B restarts. A and C are unaffected.',
  },
  {
    strategy: 'one_for_all',
    color: C.red,
    children: [
      { label: 'A', role: 'killed' as const, killDelay: 0, respawnDelay: 0 },
      { label: 'B', role: 'crasher' as const },
      { label: 'C', role: 'killed' as const, killDelay: 0.15, respawnDelay: T.respawnStagger },
    ],
    description: 'All children restart together.',
  },
  {
    strategy: 'rest_for_one',
    color: C.amber,
    children: [
      { label: 'A', role: 'survivor' as const },
      { label: 'B', role: 'crasher' as const },
      { label: 'C', role: 'killed' as const, killDelay: 0, respawnDelay: T.respawnStagger },
    ],
    description: 'B and C (started after B) restart. A remains.',
  },
];

// ─── Main component ──────────────────────────────────────
export default function Animation03SupervisorStrategies() {
  return (
    <div
      className="w-full flex flex-col select-none overflow-hidden py-3 px-2"
      role="img"
      aria-label="Supervisor restart strategies: one_for_one restarts only the crashed child, one_for_all restarts all children, rest_for_one restarts the crashed child and those started after it"
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {/* Title */}
      <motion.div
        className="text-center text-xs font-semibold mb-1"
        style={{ color: C.text }}
        {...fade(0.2)}
      >
        B crashes — how does the supervisor react?
      </motion.div>

      {/* Three strategy columns */}
      <div className="flex items-start justify-center gap-3 sm:gap-5 mt-2">
        {strategies.map((s, i) => (
          <React.Fragment key={s.strategy}>
            {i > 0 && (
              <div
                className="w-px shrink-0 self-stretch mt-4 mb-4"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(to bottom, var(--border, #e2e8f0) 0px 4px, transparent 4px 7px)',
                }}
              />
            )}
            <StrategyRow
              strategy={s.strategy}
              color={s.color}
              children={s.children}
              description={s.description}
              rowDelay={T.init + i * 0.15}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
