---
name: animate-visual
description: "Creates animated React components using Motion (Framer Motion) and HTML/Tailwind that explain Elixir concepts with smooth, informative animations. Use when adding an animated visual to a topic, creating animations, or implementing visuals from animated_visuals.md. Invoke with /animate-visual [animation-number]."
---

# Animate Visual

Create an animated React component for animation **#$ARGUMENTS** defined in `animated_visuals.md`.

## Steps

1. **Read the animation spec**
   - Read `animated_visuals.md` and find animation #$ARGUMENTS
   - Note the topic slug, target section(s), and the full animation description
   - If the number doesn't match any animation, inform the user and list available numbers

2. **Read the target topic**
   - Read the topic data file at `src/data/topics/<slug>.ts`
   - Read the VisualsSection component at `src/components/topic-sections/VisualsSection.tsx`
   - Read `src/lib/types.ts` for type definitions
   - Understand the current visual content and where the animation fits

3. **Read the design reference**
   - Read [design-guide.md](design-guide.md) for animation design principles, component patterns, and color palette

4. **Create the animation component**
   - Create a new React component at `src/components/animations/<ComponentName>.tsx`
   - Use the naming convention: `Animation{Number}{ShortName}.tsx` (e.g., `Animation01Recursion.tsx`)
   - **Use Motion (Framer Motion) for all animations** — import `{ motion }` from `'motion/react'`
   - **Use HTML elements with Tailwind classes** — not SVG. Use `motion.div` with Tailwind for layout, `flex`/`grid` for positioning, and `rounded-full` for circles
   - Only fall back to SVG (inside the HTML component) for elements that genuinely need it: curved paths, complex shapes, or `<animateMotion>` along a path
   - **Do NOT add looping, fade-out, or scroll-trigger logic** — `AnimationContainer` handles all of that by remounting the component on each cycle
   - The animation plays once from start to end via Motion's `initial`/`animate`/`transition` props. On remount (new key), Motion replays from `initial`.
   - Follow the design principles in [design-guide.md](design-guide.md)

5. **Integrate into the topic**
   - Import the animation component in the topic data file at `src/data/topics/<slug>.ts`
   - Set `animation: AnimationXXName` in the topic's `visuals` object
   - Set `animationDuration: <seconds>` — the total cycle time (animation + rest pause at end). This tells `AnimationContainer` when to fade out and remount. Calculate as: last animation delay + 4-6s rest.
   - The `VisualsSection` component already wraps animations in `AnimationContainer` when `animationDuration` is set — no changes needed there.

6. **Verify**
   - Run `npm run build` to check for type errors and build issues
   - Visually describe what the animation looks like and how it flows so the user can verify before viewing in browser

## Important

Do NOT spend time reading or analyzing existing animation components. The instructions in this skill and the design guide are sufficient — just follow them directly. Reading other animations wastes context and adds no value.

## Critical Animation Guidelines

- **Pacing is paramount**: Animations must be slow enough to absorb. Minimum 2-3 seconds per conceptual step. Total animation duration should be 8-20 seconds depending on complexity.
- **Use Motion's `transition.delay`** to stagger sequential steps so they don't overlap. Centralize all timing in a constants object (e.g., `const T = { input: 1.2, mapCol: 3.5, ... }`).
- **Ease functions**: Use `'easeOut'` or `'easeInOut'` in transition objects. Never `'linear'` for conceptual animations.
- **Pause between phases**: Add 1.5-3s gaps between major conceptual transitions via delay offsets.
- **No manual looping or fade-out**: `AnimationContainer` (at `src/components/ui/AnimationContainer.tsx`) handles scroll-triggered playback, looping via key-based remounting, and fade transitions between cycles. The animation component just plays once and holds its final state.
- **Colors**: Use CSS custom properties via `style` props for theme compatibility (e.g., `style={{ color: 'var(--text, #1a1a2e)' }}`). Use semantic colors: green (`#059669`) for success/match, red (`#dc2626`) for failure/error, blue (`#3b82f6`) / violet (`#8b5cf6`) for neutral highlights.
- **Typography**: Use Tailwind's `font-mono` for code values, default sans for labels. Minimum `text-[10px]` for readability.
- **Accessibility**: Add `role="img"` and `aria-label` on the outermost container div with a description of what the animation shows.
