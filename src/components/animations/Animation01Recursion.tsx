'use client';

import React from 'react';

export default function Animation01Recursion() {
  // Body recursion side: frames stack up (0-10s), then collapse (10-16s)
  // Tail recursion side: single frame updates in-place (0-16s)
  // Cycle reset is handled by AnimationContainer remounting this component

  return (
    <div className="animation-container" style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <svg
        viewBox="0 0 800 460"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-labelledby="anim01-title anim01-desc"
      >
        <title id="anim01-title">Body Recursion vs Tail Recursion — Call Stack Animation</title>
        <desc id="anim01-desc">
          Side-by-side comparison showing how body recursion builds up stack frames
          that must unwind, while tail recursion reuses a single frame with an accumulator.
        </desc>

        <style>{`
          .anim01-bg { fill: var(--surface-secondary, #f8f9fa); }
          .anim01-text { fill: var(--text, #1a1a2e); font-family: system-ui, -apple-system, sans-serif; }
          .anim01-code { fill: var(--text, #1a1a2e); font-family: 'Fira Code', 'JetBrains Mono', monospace; }
          .anim01-frame { fill: var(--surface, #ffffff); stroke: var(--border, #d1d5db); stroke-width: 1.5; }
          .anim01-frame-body { fill: #ede9fe; stroke: #7c3aed; stroke-width: 1.5; }
          .anim01-frame-tail { fill: #dbeafe; stroke: #2563eb; stroke-width: 1.5; }
          .anim01-accent-body { fill: #7c3aed; }
          .anim01-accent-tail { fill: #2563eb; }
          .anim01-success { fill: #059669; }
          .anim01-divider { stroke: var(--border, #d1d5db); stroke-width: 1; stroke-dasharray: 4 4; }
          .anim01-label-bg { fill: var(--surface, #ffffff); stroke: var(--border, #d1d5db); stroke-width: 1; rx: 6; }
          .anim01-result { fill: #059669; font-family: 'Fira Code', 'JetBrains Mono', monospace; font-weight: 700; }

          [data-theme="dark"] .anim01-bg { fill: var(--surface-secondary, #1e1e2e); }
          [data-theme="dark"] .anim01-text { fill: var(--text, #e2e8f0); }
          [data-theme="dark"] .anim01-code { fill: var(--text, #e2e8f0); }
          [data-theme="dark"] .anim01-frame { fill: var(--surface, #2a2a3e); stroke: var(--border, #4a4a5e); }
          [data-theme="dark"] .anim01-frame-body { fill: #2d2055; stroke: #7c3aed; }
          [data-theme="dark"] .anim01-frame-tail { fill: #1e2d4a; stroke: #2563eb; }
          [data-theme="dark"] .anim01-label-bg { fill: var(--surface, #2a2a3e); stroke: var(--border, #4a4a5e); }
        `}</style>

        {/* Background */}
        <rect className="anim01-bg" x="0" y="0" width="800" height="460" rx="12" />

        {/* Title Headers */}
        <text className="anim01-text" x="200" y="32" textAnchor="middle" fontSize="16" fontWeight="700">Body Recursion</text>
        <text className="anim01-text" x="200" y="50" textAnchor="middle" fontSize="12" opacity="0.6">Stack grows &amp; unwinds</text>
        <text className="anim01-text" x="600" y="32" textAnchor="middle" fontSize="16" fontWeight="700">Tail Recursion</text>
        <text className="anim01-text" x="600" y="50" textAnchor="middle" fontSize="12" opacity="0.6">Single frame reused</text>

        {/* Divider */}
        <line className="anim01-divider" x1="400" y1="20" x2="400" y2="440" />

        {/* ============================================ */}
        {/* LEFT SIDE: Body Recursion — sum([1,2,3])     */}
        {/* ============================================ */}

        {/* Function label */}
        <text className="anim01-code" x="200" y="78" textAnchor="middle" fontSize="13" opacity="0.7">sum([1, 2, 3])</text>

        {/* --- Phase 1: Stack frames appear (building up) --- */}

        {/* Frame 1: sum([1,2,3]) — appears at 1s */}
        <g opacity="0">
          <rect className="anim01-frame-body" x="60" y="92" width="280" height="52" rx="6" />
          <text className="anim01-code" x="76" y="115" fontSize="13">sum([1, 2, 3])</text>
          <text className="anim01-code" x="76" y="134" fontSize="11" opacity="0.55">= 1 + sum([2, 3])</text>
          <text className="anim01-text" x="332" y="122" fontSize="11" opacity="0.4" textAnchor="end">frame 1</text>
          <animate attributeName="opacity" values="0;1" keyTimes="0;1" dur="0.6s" begin="1s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1" />
        </g>

        {/* Frame 2: sum([2,3]) — appears at 3.5s */}
        <g opacity="0">
          <rect className="anim01-frame-body" x="60" y="152" width="280" height="52" rx="6" />
          <text className="anim01-code" x="76" y="175" fontSize="13">sum([2, 3])</text>
          <text className="anim01-code" x="76" y="194" fontSize="11" opacity="0.55">= 2 + sum([3])</text>
          <text className="anim01-text" x="332" y="182" fontSize="11" opacity="0.4" textAnchor="end">frame 2</text>
          <animate attributeName="opacity" values="0;1" keyTimes="0;1" dur="0.6s" begin="3.5s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1" />
        </g>

        {/* Frame 3: sum([3]) — appears at 6s */}
        <g opacity="0">
          <rect className="anim01-frame-body" x="60" y="212" width="280" height="52" rx="6" />
          <text className="anim01-code" x="76" y="235" fontSize="13">sum([3])</text>
          <text className="anim01-code" x="76" y="254" fontSize="11" opacity="0.55">= 3 + sum([])</text>
          <text className="anim01-text" x="332" y="242" fontSize="11" opacity="0.4" textAnchor="end">frame 3</text>
          <animate attributeName="opacity" values="0;1" keyTimes="0;1" dur="0.6s" begin="6s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1" />
        </g>

        {/* Frame 4: sum([]) — base case, appears at 8.5s */}
        <g opacity="0">
          <rect className="anim01-frame-body" x="60" y="272" width="280" height="44" rx="6" />
          <text className="anim01-code" x="76" y="300" fontSize="13">sum([]) = 0</text>
          <text className="anim01-text" x="332" y="298" fontSize="11" opacity="0.4" textAnchor="end">frame 4</text>
          {/* Base case green flash */}
          <rect x="60" y="272" width="280" height="44" rx="6" fill="#059669" opacity="0">
            <animate attributeName="opacity" values="0;0.3;0" keyTimes="0;0.5;1" dur="0.8s" begin="8.5s" fill="freeze" />
          </rect>
          <animate attributeName="opacity" values="0;1" keyTimes="0;1" dur="0.6s" begin="8.5s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1" />
        </g>

        {/* Stack depth indicator */}
        <g opacity="0">
          <text className="anim01-text" x="200" y="340" textAnchor="middle" fontSize="12" fontWeight="600">
            4 stack frames
          </text>
          <animate attributeName="opacity" values="0;1" keyTimes="0;1" dur="0.5s" begin="9.2s" fill="freeze" />
          <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="0.4s" begin="11s" fill="freeze" />
        </g>

        {/* Final result: 6 */}
        <g opacity="0">
          <rect className="anim01-label-bg" x="140" y="362" width="120" height="36" />
          <text className="anim01-result" x="200" y="386" textAnchor="middle" fontSize="16">Result: 6</text>
          <animate attributeName="opacity" values="0;1" keyTimes="0;1" dur="0.6s" begin="11s" fill="freeze" />
        </g>

        {/* ============================================== */}
        {/* RIGHT SIDE: Tail Recursion — tail_sum([1,2,3]) */}
        {/* ============================================== */}

        {/* Function label */}
        <text className="anim01-code" x="600" y="78" textAnchor="middle" fontSize="13" opacity="0.7">tail_sum([1, 2, 3], 0)</text>

        {/* Single persistent frame box */}
        <rect className="anim01-frame-tail" x="460" y="92" width="280" height="68" rx="6" opacity="0">
          <animate attributeName="opacity" values="0;1" keyTimes="0;1" dur="0.6s" begin="1s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1" />
        </rect>
        <text className="anim01-text" x="732" y="108" fontSize="11" opacity="0" textAnchor="end">
          frame 1
          <animate attributeName="opacity" values="0;0.4" keyTimes="0;1" dur="0.6s" begin="1s" fill="freeze" />
        </text>

        {/* State 1: ([1,2,3], acc=0) — shows at 1s */}
        <g opacity="0">
          <text className="anim01-code" x="476" y="118" fontSize="13">list: [1, 2, 3]</text>
          <text className="anim01-code" x="476" y="140" fontSize="13">acc: 0</text>
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.04;0.85;1" dur={`${3.5 - 1}s`} begin="1s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1;0.4 0 0.2 1;0.4 0 0.2 1" />
        </g>

        {/* State 2: ([2,3], acc=1) — shows at 3.5s */}
        <g opacity="0">
          <text className="anim01-code" x="476" y="118" fontSize="13">list: [2, 3]</text>
          <text className="anim01-code" x="476" y="140" fontSize="13">acc: 1</text>
          {/* Highlight flash on transition */}
          <rect x="460" y="92" width="280" height="68" rx="6" fill="#2563eb" opacity="0">
            <animate attributeName="opacity" values="0;0.15;0" keyTimes="0;0.3;1" dur="0.8s" begin="3.5s" fill="freeze" />
          </rect>
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.04;0.85;1" dur={`${6 - 3.5}s`} begin="3.5s" fill="freeze" />
        </g>

        {/* State 3: ([3], acc=3) — shows at 6s */}
        <g opacity="0">
          <text className="anim01-code" x="476" y="118" fontSize="13">list: [3]</text>
          <text className="anim01-code" x="476" y="140" fontSize="13">acc: 3</text>
          <rect x="460" y="92" width="280" height="68" rx="6" fill="#2563eb" opacity="0">
            <animate attributeName="opacity" values="0;0.15;0" keyTimes="0;0.3;1" dur="0.8s" begin="6s" fill="freeze" />
          </rect>
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.04;0.85;1" dur={`${8.5 - 6}s`} begin="6s" fill="freeze" />
        </g>

        {/* State 4: ([], acc=6) — base case at 8.5s */}
        <g opacity="0">
          <text className="anim01-code" x="476" y="118" fontSize="13">list: []</text>
          <text className="anim01-code" x="476" y="140" fontSize="13" fontWeight="700">acc: 6</text>
          <rect x="460" y="92" width="280" height="68" rx="6" fill="#059669" opacity="0">
            <animate attributeName="opacity" values="0;0.2;0" keyTimes="0;0.4;1" dur="1s" begin="8.5s" fill="freeze" />
          </rect>
          <animate attributeName="opacity" values="0;1" keyTimes="0;1" dur="0.5s" begin="8.5s" fill="freeze" />
        </g>

        {/* "BEAM reuses the same frame" label */}
        <g opacity="0">
          <rect x="480" y="175" width="240" height="28" rx="14" fill="#2563eb" opacity="0.1" />
          <text className="anim01-text" x="600" y="194" textAnchor="middle" fontSize="12" fontWeight="600" fill="#2563eb">
            BEAM reuses the same frame
          </text>
          <animate attributeName="opacity" values="0;1" keyTimes="0;1" dur="0.6s" begin="4s" fill="freeze" />
        </g>

        {/* Stack depth: always 1 */}
        <g opacity="0">
          <text className="anim01-text" x="600" y="340" textAnchor="middle" fontSize="12" fontWeight="600">
            1 stack frame (constant)
          </text>
          <animate attributeName="opacity" values="0;1" keyTimes="0;1" dur="0.5s" begin="9.2s" fill="freeze" />
        </g>

        {/* Final result */}
        <g opacity="0">
          <rect className="anim01-label-bg" x="540" y="362" width="120" height="36" />
          <text className="anim01-result" x="600" y="386" textAnchor="middle" fontSize="16">Result: 6</text>
          <animate attributeName="opacity" values="0;1" keyTimes="0;1" dur="0.6s" begin="10s" fill="freeze" />
        </g>

        {/* ========================= */}
        {/* Bottom comparison labels  */}
        {/* ========================= */}

        {/* Body recursion verdict */}
        <g opacity="0">
          <text className="anim01-text" x="200" y="425" textAnchor="middle" fontSize="12" opacity="0.7">
            O(n) stack space
          </text>
          <text className="anim01-text" x="200" y="445" textAnchor="middle" fontSize="11" opacity="0.5">
            Risk of stack overflow on large lists
          </text>
          <animate attributeName="opacity" values="0;1" keyTimes="0;1" dur="0.6s" begin="18s" fill="freeze" />
        </g>

        {/* Tail recursion verdict */}
        <g opacity="0">
          <text className="anim01-text" x="600" y="425" textAnchor="middle" fontSize="12" opacity="0.7">
            O(1) stack space
          </text>
          <text className="anim01-text" x="600" y="445" textAnchor="middle" fontSize="11" opacity="0.5">
            Handles any list size efficiently
          </text>
          <animate attributeName="opacity" values="0;1" keyTimes="0;1" dur="0.6s" begin="18s" fill="freeze" />
        </g>
      </svg>
    </div>
  );
}
