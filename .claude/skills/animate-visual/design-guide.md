# Animation Design Guide

## Core Principles

### 1. Pedagogical Clarity Over Polish
Every animation element must serve understanding. Ask: "Does this motion help the learner grasp the concept?" If not, remove it. Decorative animation is noise.

### 2. Temporal Pacing
Learners need time to read labels, understand what's moving, and connect it to the concept. The animation should feel like a patient teacher drawing on a whiteboard, not a flashy demo.

**Timing guidelines:**
- Initial pause before animation starts: 1-2s (let the viewer orient)
- Each conceptual step: 2-4s
- Pause between phases: 1.5-3s
- Total animation (before rest): 10-20s depending on complexity
- Set `animationDuration` to animation end + 4-6s rest (the container handles the pause and fade)

### 3. Progressive Revelation
Don't show everything at once. Build up the visual step by step:
1. Show the initial state
2. Introduce the first transformation
3. Show the result
4. Introduce the next step
5. Continue until the concept is complete

## Technology Stack

**Motion (Framer Motion)** for animation — import `{ motion }` from `'motion/react'`.
**HTML + Tailwind** for layout and styling — not SVG.

Only use SVG for elements that genuinely need it (curved paths, complex shapes). When SVG is needed, embed a small `<svg>` inside the HTML component.

## Component Pattern

```tsx
'use client';

import React from 'react';
import { motion } from 'motion/react';

// ─── Timing constants (centralize all delays) ──────────
const T = {
  step1: 1.2,
  step2: 3.5,
  step3: 6,
  counter: 8,
};

// ─── Colors ─────────────────────────────────────────────
const C = {
  blue: '#3b82f6',
  violet: '#8b5cf6',
  green: '#059669',
  red: '#dc2626',
  muted: 'var(--text-secondary, #94a3b8)',
  text: 'var(--text, #1a1a2e)',
};

// ─── Animation presets ──────────────────────────────────
const drop = (delay: number) => ({
  initial: { opacity: 0, y: -6 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { delay, duration: 0.4, ease: 'easeOut' as const },
});

const fade = (delay: number, duration = 0.4) => ({
  initial: { opacity: 0 } as const,
  animate: { opacity: 1 } as const,
  transition: { delay, duration },
});

// ─── Reusable sub-components ────────────────────────────
function Dot({ value, bg, delay }: { value: React.ReactNode; bg: string; delay: number }) {
  return (
    <motion.div
      className="w-6.5 h-6.5 rounded-full text-[11px] font-mono text-white
        flex items-center justify-center shrink-0 leading-none"
      style={{ backgroundColor: bg }}
      {...drop(delay)}
    >
      {value}
    </motion.div>
  );
}

// ─── Main component ─────────────────────────────────────
export default function AnimationXXName() {
  return (
    <div
      className="w-full flex select-none overflow-hidden"
      role="img"
      aria-label="Description of what this animation shows"
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {/* Animation content using motion.div, Tailwind, flex/grid */}
    </div>
  );
}
```

### Key patterns:

- **Spread animation presets**: Define `drop(delay)` and `fade(delay)` helpers that return `{ initial, animate, transition }`, then spread onto `motion.div` with `{...drop(3.5)}`
- **Centralized timing**: All delay values in a single `T` object at the top of the file. Easy to adjust pacing.
- **Reusable sub-components**: Create `Dot`, `Col`, `Counter`, `Arrow` etc. as small functions within the file. Keep them local — no need for a shared library.
- **Stagger within groups**: For items that appear together with slight stagger, use `delay + index * STAGGER` where `STAGGER` is ~0.06s.

## Visual Vocabulary

Use these consistent visual metaphors across all animations:

| Concept | Visual |
|---------|--------|
| Process / Actor | Rounded rectangle (`rounded-xl border-2`) with label |
| Data item / Value | Circle (`rounded-full`) with value inside |
| Message / Data | Rounded pill shape |
| Flow / Movement | Arrow text (`→`) or animated position change |
| Success / Match | Green background (`bg-emerald-600`) or checkmark |
| Failure / Error | Red outline + strikethrough, or red X |
| Transformation | Color/value change on element |
| Queue / Mailbox | Stacked flex items |
| Time passing | Progress bar or counter |
| Blocking / Waiting | Reduced opacity + pulse |
| Active / Running | Subtle scale pulse |
| Not processed / Skipped | Dashed border circle or "–" dash |

## Color Palette

Use CSS variables via `style` props for theme compatibility:

```tsx
const C = {
  blue: '#3b82f6',       // Input / neutral data
  violet: '#8b5cf6',     // Transformations / intermediate
  green: '#059669',      // Success / pass / collected
  red: '#dc2626',        // Failure / error / rejected
  amber: '#d97706',      // Warning / timeout
  muted: 'var(--text-secondary, #94a3b8)',  // Labels, arrows, inactive
  text: 'var(--text, #1a1a2e)',             // Primary text
  surface: 'var(--surface, #fff)',          // Backgrounds
  border: 'var(--border, #e2e8f0)',         // Dividers
};
```

For highlight backgrounds (e.g., column highlights), use rgba with low alpha:
```tsx
style={{ backgroundColor: 'rgba(139,92,246,0.07)' }}  // subtle violet
style={{ backgroundColor: 'rgba(5,150,105,0.07)' }}    // subtle green
```

## Animation Techniques with Motion

### Delayed Fade/Drop-in
The most common pattern — elements appear at scheduled times:

```tsx
<motion.div
  initial={{ opacity: 0, y: -6 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 3.5, duration: 0.4, ease: 'easeOut' }}
>
  Content
</motion.div>
```

### Staggered Group Reveal
For items that appear together with slight stagger (e.g., all values in a column):

```tsx
const STAGGER = 0.06;

{[2, 4, 6, 8].map((v, i) => (
  <Dot key={v} value={v} bg={C.green} delay={T.filterCol + i * STAGGER} />
))}
```

### Imperative Timeline (for complex sequences)
When you need sequential animations that depend on each other:

```tsx
import { useAnimate } from 'motion/react';

const [scope, animate] = useAnimate();

useEffect(() => {
  const run = async () => {
    await animate('.step-1', { opacity: 1, y: 0 }, { duration: 0.5 });
    await animate('.step-2', { opacity: 1 }, { duration: 0.4, delay: 1 });
    await animate('.step-3', { x: 100 }, { duration: 0.6, ease: 'easeInOut' });
  };
  run();
}, [animate]);

return <div ref={scope}>...</div>;
```

### SVG Path Animation (when needed)
For the rare animation needing curved motion paths, embed a small SVG:

```tsx
<svg viewBox="0 0 400 100" className="w-full">
  <path id="msgPath" d="M50,50 C150,10 250,90 350,50" fill="none" />
  <circle r="6" fill={C.violet}>
    <animateMotion dur="2s" begin="1s" fill="freeze">
      <mpath href="#msgPath" />
    </animateMotion>
  </circle>
</svg>
```

### Looping and Lifecycle (handled by AnimationContainer)

Animation components do **not** handle looping themselves. The `AnimationContainer` component (`src/components/ui/AnimationContainer.tsx`) wraps each animation and manages:

- **Scroll-triggered playback**: Animation only renders when scrolled into view (IntersectionObserver, threshold 0.3)
- **Looping via remount**: After `cycleDuration` seconds, the container fades out, increments a React `key`, and remounts the animation — restarting all Motion animations from `initial`
- **Fade transitions**: 500ms fade-out before cycle end, fade-in on remount
- **Cleanup**: Timers are cleared when scrolled out of view; a fresh cycle starts on scroll back in

**What this means for animation components:**
- Use `initial` + `animate` on all `motion.*` elements — they play once on mount and hold their final state
- Do **not** add fade-out animations at the end
- Do **not** use `repeat: Infinity` or any looping
- The `animationDuration` on the topic data controls when the container resets. Set it to: last animation delay + 4-6s rest pause.

### Side-by-Side Comparisons
Many animations compare two approaches (eager vs lazy, call vs cast, etc.). Use a consistent layout:

```tsx
<div className="w-full flex select-none overflow-hidden">
  {/* Side A */}
  <div className="flex-1 flex flex-col items-center min-w-0 px-1">
    <motion.h3 ...>Title A</motion.h3>
    {/* content */}
  </div>

  {/* Dashed divider */}
  <div className="w-px shrink-0 mx-1 self-stretch" style={{
    backgroundImage: 'repeating-linear-gradient(to bottom, var(--border, #e2e8f0) 0px 4px, transparent 4px 7px)'
  }} />

  {/* Side B */}
  <div className="flex-1 flex flex-col items-center min-w-0 px-1">
    <motion.h3 ...>Title B</motion.h3>
    {/* content */}
  </div>
</div>
```

- Label each half clearly at the top
- Run both animations simultaneously so the difference is immediately visible
- Use identical visual language on both sides — only the behavior differs

## Layout Guidelines

- Use `flex` and `gap` for horizontal layouts (columns of items, side-by-side comparisons)
- Use `flex-col` and `gap` for vertical stacking (items within a column)
- Use Tailwind spacing (`gap-1.5`, `mt-3`, `px-1`) instead of pixel values where possible
- The animation renders inside `AnimationContainer` which sets `maxWidth: 800px` and an aspect ratio
- For column-based layouts within each side, small arrow characters (`→`) between columns work well as flow indicators

## Integration Pattern

The `VisualsSection` component automatically wraps animations in `AnimationContainer` when `animationDuration` is set. No changes to VisualsSection are needed when adding new animations.

The topic data file stores a reference to the component and the cycle duration:

```ts
import AnimationXXName from '@/components/animations/AnimationXXName';

// In the visuals section:
visuals: {
  animation: AnimationXXName,
  animationDuration: 17, // total cycle in seconds (animation + rest pause)
  dataTypes: [...],
  operatorGroups: [...]
}
```

The `animationDuration` value tells `AnimationContainer` when to fade out and remount. Calculate it as: **last animation delay + 4-6 seconds rest**. For example, if the last motion element has `delay: 10.8` and takes 0.5s, set `animationDuration` to ~16-17.
