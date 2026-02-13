# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Next.js dev server
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Vitest (single run)
npm run test:watch   # Vitest (watch mode)
```

Run a single test file: `npx vitest run src/__tests__/topics-data.test.ts`

## Architecture

This is a **Next.js 16 / React 19** interactive Elixir learning platform with 25 progressive topics. Each topic has 5 stages: ELI5, Visuals, Deep Dive, Quiz, and Practice.

**Routing:** App Router with dynamic `[slug]` route at `src/app/topics/[slug]/page.tsx`. Topic modules are loaded via a `topicModules` map of dynamic imports in that file.

**Data flow:** Topic content lives in `src/data/topics/<slug>.ts` as typed `TopicContent` exports. The topic registry (`src/data/topics.ts`) holds metadata for all 25 topics with an `active` flag. The home page renders the registry as a grid; inactive topics show "Coming Soon."

**Quiz question pools:** Each topic has a large question pool in `src/data/topics/questions/<slug>.ts`. The `RandomQuiz` component selects a random subset per session, so quizzes vary between visits.

**Type system:** All topic content conforms to interfaces in `src/lib/types.ts` — `TopicContent` contains `meta`, `eli5`, `visuals`, `deepDive`, `quiz`, and `practice` sub-objects.

**Components:**
- `src/components/layout/` — SiteHeader, TopicLayout, SectionNav (uses IntersectionObserver for scroll tracking)
- `src/components/ui/` — CodeBlock, Quiz, QuizQuestion, RandomQuiz, PracticeProblem, PracticeProblems, Collapsible, ThemeToggle, AnimationContainer, FadeIn
- `src/components/topic-sections/` — one component per stage (ELI5Section, VisualsSection, etc.)
- `src/components/animations/` — per-topic animated visuals using Motion (framer-motion). Named `Animation<NN><Name>.tsx`.

**Animations:** Uses the `motion` package (Framer Motion). Shared animation variants in `src/lib/motion.ts`. Animation components are embedded in topic data via the visuals section.

**Syntax highlighting:** Custom Elixir tokenizer in `src/lib/syntax.ts` (not an external library). Produces HTML with `syn-*` CSS classes styled via CSS variables in `globals.css`.

**Theming:** Light/dark mode via `data-theme` attribute on `<html>`, CSS custom properties, and localStorage persistence. Tailwind 4 with `@theme inline` for variable integration.

## Adding a New Topic

Use the `/add-topic <number>` skill, which automates the full workflow. The steps are: create topic data file, set `active: true` in the registry, add dynamic import in the route file, add tests, and run `npm test`.

## Testing

Tests are in `src/__tests__/`. Uses Vitest + React Testing Library with jsdom. Setup file (`src/__tests__/setup.ts`) mocks IntersectionObserver, matchMedia, and scrollIntoView. The `topics-data.test.ts` file validates structural correctness of all active topic content.

## Path Alias

`@/*` maps to `./src/*` (configured in tsconfig and vitest.config).
