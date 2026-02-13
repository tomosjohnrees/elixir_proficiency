---
name: add-topic
description: Adds a new topic to the Elixir learning app by topic number. Use when creating content for a new topic in the course curriculum.
---

# Add Topic

Add topic number **$ARGUMENTS** to the Elixir learning app.

## Steps

### 1. Look up the topic

Read `course_overview.md` (project root) to find the topic matching number **$ARGUMENTS**. This file has all 25 topics with their titles and descriptions. The topic number corresponds to the `### N.` headings in that file.

### 2. Understand the rules

Read `README.md` (project root) for the full content guidelines. Key rules:

- Every topic has 5 stages: **ELI5**, **Visuals**, **Deep Dive**, **Quiz**, **Practice**
- ELI5: Single concrete analogy, no Elixir syntax, 2-4 short paragraphs
- Visuals: Diagrams/illustrations that reinforce the ELI5 and build visual intuition
- Deep Dive: Technical explanation with real Elixir code examples
- Quiz: Large question pool (15+), each with a `question`, `explanation`, and exactly one `correct` option. The `RandomQuiz` component selects a random subset per session.
- Practice: 2-4 problems ordered by difficulty, each with hints, solution, and walkthrough
- Tone: Friendly, encouraging, use "you", short clear sentences
- Topics build on each other but should be self-contained enough to revisit independently

### 3. Study the existing patterns

Read these files to understand the exact data structures and patterns:

- `src/lib/types.ts` — the `TopicContent` interface and all sub-interfaces
- `src/data/topics/basic-data-types.ts` — reference implementation for how a topic data file looks
- `src/data/topics/questions/basic-data-types.ts` — reference for how quiz question pools are structured
- `src/data/topics.ts` — the topic registry (find the slug and metadata for the topic number)

### 4. Create the quiz question pool

Create `src/data/topics/questions/<slug>.ts`. The file must:
- Import `QuizQuestion` from `@/lib/types`
- Export a default `QuizQuestion[]` array with 15+ questions
- Each question has `question`, `options` (with exactly one `correct: true`), and `explanation`
- Include at least one "trick" question testing a common misconception

### 5. Create the topic data file

Create `src/data/topics/<slug>.ts` where `<slug>` comes from the registry entry in `topics.ts`.

The file must:
- Import `TopicContent` from `@/lib/types`
- Import `questions` from `./questions/<slug>`
- Export a `TopicContent` object as default export
- Have `meta` matching the registry entry but with `active: true`
- Set `quiz: { questions }` using the imported question pool
- Follow all the content guidelines from README.md
- Use the `VisualsContent` interface — adapt the visual data to suit the topic (not every topic has "data type cards" and "operator groups"; design visuals appropriate to the concept)

### 6. Update the registry

In `src/data/topics.ts`, set `active: true` for the topic's registry entry.

### 7. Register the route

In `src/app/topics/[slug]/page.tsx`, add a dynamic import entry to the `topicModules` map:

```ts
"<slug>": () => import("@/data/topics/<slug>"),
```

### 8. Add tests

Add a test block for the new topic in `src/__tests__/topics-data.test.ts`. Follow the existing test pattern (e.g. `patternMatching`) — import the new topic and add a `describe` block that validates:

- `meta` fields match the registry entry and `active` is `true`
- ELI5 has `analogyTitle`, `analogy`, non-empty `items`, and non-empty `keyTakeaways`
- Visuals have `dataTypes` array (each entry has `name`, `color` starting with `#`, and `examples`)
- Deep dive has `sections` array, each with `title` and non-empty `prose`
- Quiz has at least 15 questions, each with a `question`, `explanation`, and exactly one `correct` option
- Practice has 2-4 problems, each with `title`, `prompt`, non-empty `hints`, `solution`, non-empty `walkthrough`, and valid `difficulty`

Update the active topic count in the "has all 25 topics active" test.

### 9. Run tests

Run `npm test` and fix any failures.

## Important Notes

- The `VisualsContent` type uses `dataTypes` and `operatorGroups` fields because the first topic needed those. For other topics, still populate these arrays but adapt their meaning to fit the topic. If the topic doesn't have "operators", `operatorGroups` can be an empty array. Design the `dataTypes` cards to represent the key visual concepts for the topic.
- `VisualsContent` also has optional `animation`, `animationDuration`, and `animations` fields for animated visuals (Motion/Framer Motion components). These are optional — only add if the topic has animations.
- Each quiz question must have exactly one option with `correct: true`.
- Practice problem difficulty must be one of: `"beginner"`, `"intermediate"`, `"advanced"`.
- Practice problems should be ordered by difficulty (easiest first).
- Solutions should be idiomatic Elixir.
- The deep dive walkthroughs should explain the "why" not just the "what".
