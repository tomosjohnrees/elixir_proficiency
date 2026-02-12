---
name: animate-visual
description: "Creates animated SVG React components that explain Elixir concepts with smooth, informative animations. Use when adding an animated visual to a topic, creating SVG animations, or implementing visuals from animated_visuals.md. Invoke with /animate-visual [animation-number]."
---

# Animate Visual

Create an animated SVG React component for animation **#$ARGUMENTS** defined in `animated_visuals.md`.

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
   - Read [design-guide.md](design-guide.md) for animation design principles and patterns

4. **Create the SVG animation component**
   - Create a new React component at `src/components/animations/<ComponentName>.tsx`
   - Use the naming convention: `Animation{Number}{ShortName}.tsx` (e.g., `Animation01Recursion.tsx`)
   - The component must be a pure SVG animation — no external animation libraries
   - Use SVG `<animate>` elements with `fill="freeze"` for sequenced steps, or CSS `@keyframes` for simple transforms
   - The SVG must be responsive (`viewBox` + `width="100%"`)
   - **Do NOT add looping, fade-out, or scroll-trigger logic** — `AnimationContainer` handles all of that by remounting the component on each cycle
   - The animation plays once from start to end, then holds its final state. The container fades out and remounts to restart.
   - Do NOT add manual fade-out `<animate>` elements at the end of the cycle
   - Follow the design principles in [design-guide.md](design-guide.md)

5. **Integrate into the topic**
   - Import the animation component in the topic data file at `src/data/topics/<slug>.ts`
   - Set `animation: AnimationXXName` in the topic's `visuals` object
   - Set `animationDuration: <seconds>` — the total cycle time (animation + rest pause at end). This tells `AnimationContainer` when to fade out and remount. Calculate as: last animation timestamp + 4-6s rest.
   - The `VisualsSection` component already wraps animations in `AnimationContainer` when `animationDuration` is set — no changes needed there.

6. **Verify**
   - Run `npm run build` to check for type errors and build issues
   - Visually describe what the animation looks like and how it flows so the user can verify before viewing in browser

## Critical Animation Guidelines

- **Pacing is paramount**: Animations must be slow enough to absorb. Minimum 2-3 seconds per conceptual step. Total animation duration should be 8-20 seconds depending on complexity.
- **Use `animation-delay`** to stagger sequential steps so they don't overlap
- **Ease functions**: Prefer `ease-in-out` or `cubic-bezier` for smooth, natural motion. Never use `linear` for conceptual animations.
- **Pause between phases**: Add 1-2s pauses between major conceptual transitions
- **No manual looping or fade-out**: `AnimationContainer` (at `src/components/ui/AnimationContainer.tsx`) handles scroll-triggered playback, looping via key-based remounting, and fade transitions between cycles. The animation component just plays once and holds its final state with `fill="freeze"`.
- **Colors**: Use CSS custom properties from the app's theme (`var(--accent)`, `var(--text)`, `var(--surface)`) for theme compatibility. Use semantic colors: green for success/match, red for failure/error, blue/purple for neutral highlights.
- **Text in SVGs**: Use `font-family: 'Fira Code', 'JetBrains Mono', monospace` for code, and the system sans-serif for labels. Ensure text is large enough to read (minimum 14px equivalent).
- **Accessibility**: Include `<title>` and `<desc>` elements in the SVG for screen readers.
