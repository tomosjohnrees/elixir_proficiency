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
- End-of-cycle pause before loop: 3-5s
- Total cycle: 10-25s depending on complexity

### 3. Progressive Revelation
Don't show everything at once. Build up the visual step by step:
1. Show the initial state
2. Introduce the first transformation
3. Show the result
4. Introduce the next step
5. Continue until the concept is complete

## SVG Component Pattern

```tsx
'use client';

import React from 'react';

export default function AnimationXXName() {
  return (
    <div className="animation-container" style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <svg
        viewBox="0 0 800 400"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-labelledby="anim-title anim-desc"
      >
        <title id="anim-title">Descriptive title</title>
        <desc id="anim-desc">Detailed description of what the animation shows</desc>

        <style>{`
          /* Theme-aware colors */
          .anim-bg { fill: var(--surface-secondary, #f8f9fa); }
          .anim-text { fill: var(--text, #1a1a2e); font-family: system-ui, sans-serif; }
          .anim-code { fill: var(--text, #1a1a2e); font-family: 'Fira Code', monospace; }
          .anim-accent { fill: var(--accent, #7c3aed); }
          .anim-success { fill: #059669; }
          .anim-error { fill: #dc2626; }
          .anim-highlight { fill: #2563eb; }

          /* Dark mode overrides */
          @media (prefers-color-scheme: dark) {
            .anim-bg { fill: var(--surface-secondary, #1e1e2e); }
            .anim-text { fill: var(--text, #e2e8f0); }
            .anim-code { fill: var(--text, #e2e8f0); }
          }

          /* Animations - always use ease-in-out or custom cubic-bezier */
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes slideRight {
            from { transform: translateX(-20px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `}</style>

        {/* Animation content here */}
      </svg>
    </div>
  );
}
```

## Visual Vocabulary

Use these consistent visual metaphors across all animations:

| Concept | Visual |
|---------|--------|
| Process / Actor | Rounded rectangle with label |
| Message / Data | Rounded pill or envelope shape |
| Flow / Movement | Animated path with motion along it |
| Success / Match | Green glow or checkmark |
| Failure / Error | Red flash or X mark |
| Transformation | Morphing shape or color transition |
| Queue / Mailbox | Stacked rectangles |
| Time passing | Progress bar or clock icon |
| Blocking / Waiting | Grayed out + pulse animation |
| Active / Running | Subtle pulse or glow |

## Color Palette

Use CSS variables for theme compatibility, with fallbacks:

```css
/* Semantic colors */
--anim-success: #059669;    /* Green - matches, success */
--anim-error: #dc2626;      /* Red - failures, crashes */
--anim-info: #2563eb;       /* Blue - neutral highlights */
--anim-accent: #7c3aed;     /* Purple - primary accent */
--anim-warning: #d97706;    /* Amber - caution, timeouts */

/* Structural colors */
--anim-bg: var(--surface-secondary);
--anim-border: var(--border);
--anim-text: var(--text);
```

## Animation Techniques

### Staggered Delays
For sequential steps, use `animation-delay` to create a timeline:

```css
.step-1 { animation: fadeIn 0.5s ease-in-out 1s both; }
.step-2 { animation: fadeIn 0.5s ease-in-out 3.5s both; }
.step-3 { animation: fadeIn 0.5s ease-in-out 6s both; }
```

### Motion Along a Path
For messages traveling between processes:

```svg
<path id="msgPath" d="M100,200 C200,100 300,100 400,200" fill="none" />
<circle r="8" fill="#7c3aed">
  <animateMotion dur="2s" begin="1s" fill="freeze" repeatCount="1">
    <mpath href="#msgPath" />
  </animateMotion>
</circle>
```

### Looping with Rest
Wrap the entire animation in a group and use a long total duration:

```css
/* 15s of animation + 5s rest = 20s total cycle */
@keyframes fullCycle {
  0% { /* start state */ }
  75% { /* end state */ }
  75.1%, 100% { /* reset to start, held for 5s rest */ }
}
.animation-group { animation: fullCycle 20s ease-in-out infinite; }
```

### Prefer SVG-native Animation for Complex Paths
Use `<animate>`, `<animateTransform>`, and `<animateMotion>` for:
- Motion along curved paths
- Synchronized multi-element animations
- Smooth color transitions

Use CSS `@keyframes` for:
- Opacity changes
- Simple transforms (translate, scale)
- Staggered reveal sequences

### Side-by-Side Comparisons
Many animations compare two approaches (eager vs lazy, call vs cast, etc.). Use a consistent layout:
- Divide the SVG into left and right halves with a subtle divider
- Label each half clearly at the top
- Run both animations simultaneously so the difference is immediately visible
- Use identical visual language on both sides — only the behavior differs

## Responsive Considerations

- Always use `viewBox` — never fixed `width`/`height` in pixels
- Target a 2:1 aspect ratio (e.g., `viewBox="0 0 800 400"`) for most animations
- For tall animations (tree structures), use 4:3 (`viewBox="0 0 600 450"`)
- Minimum text size: 14px at default viewBox scale
- Test readability at 400px container width (mobile)

## Integration Pattern

The VisualsSection component should render the animation above the existing data type cards:

```tsx
{visuals.animation && (
  <div className="mb-8">
    <visuals.animation />
  </div>
)}
```

The topic data file stores a reference to the component:

```ts
import AnimationXXName from '@/components/animations/AnimationXXName';

// In the visuals section:
visuals: {
  animation: AnimationXXName,
  dataTypes: [...],
  operatorGroups: [...]
}
```
