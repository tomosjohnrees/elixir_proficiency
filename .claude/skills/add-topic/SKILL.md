---
name: add-topic
description: Adds a new topic to the Elixir learning app by topic number. Use when creating content for a new topic in the course curriculum.
argument-hint: "[topic_number]"
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
- Quiz: 3-5 multiple-choice questions, one "trick" question testing a misconception, explanations for all answers
- Practice: 2-4 problems ordered by difficulty, each with hints, solution, and walkthrough
- Tone: Friendly, encouraging, use "you", short clear sentences
- Topics build on each other but should be self-contained enough to revisit independently

### 3. Study the existing patterns

Read these files to understand the exact data structures and patterns:

- `elixir_proficiency/src/lib/types.ts` — the `TopicContent` interface and all sub-interfaces
- `elixir_proficiency/src/data/topics/basic-data-types.ts` — reference implementation for how a topic data file looks
- `elixir_proficiency/src/data/topics.ts` — the topic registry (find the slug and metadata for the topic number)

### 4. Create the topic data file

Create `elixir_proficiency/src/data/topics/<slug>.ts` where `<slug>` comes from the registry entry in `topics.ts`.

The file must:
- Export a `TopicContent` object as default export
- Have `meta` matching the registry entry but with `active: true`
- Follow all the content guidelines from README.md
- Use the `VisualsContent` interface — adapt the visual data to suit the topic (not every topic has "data type cards" and "operator groups"; design visuals appropriate to the concept)

### 5. Update the registry

In `elixir_proficiency/src/data/topics.ts`, set `active: true` for the topic's registry entry.

### 6. Register the route

In `elixir_proficiency/src/app/topics/[slug]/page.tsx`, add a dynamic import entry to the `topicModules` map:

```ts
"<slug>": () => import("@/data/topics/<slug>"),
```

### 7. Add tests

Add a test block for the new topic in `elixir_proficiency/src/__tests__/topics-data.test.ts`. Follow the existing `basicDataTypes` test pattern — import the new topic and add a `describe` block that validates:

- `meta` fields match the registry entry and `active` is `true`
- ELI5 has `analogyTitle`, `analogy`, non-empty `items`, and non-empty `keyTakeaways`
- Visuals have `dataTypes` array (each entry has `name`, `color` starting with `#`, and `examples`)
- Deep dive has `sections` array, each with `title` and non-empty `prose`
- Quiz has 3–5 questions, each with a `question`, `explanation`, and exactly one `correct` option
- Practice has 2–4 problems, each with `title`, `prompt`, non-empty `hints`, `solution`, non-empty `walkthrough`, and valid `difficulty`

Update the "only has topic 1 active" test to account for the new active topic count.

### 8. Run tests

Run `npm test` from the `elixir_proficiency` directory and fix any failures.

## Important Notes

- The `VisualsContent` type uses `dataTypes` and `operatorGroups` fields because the first topic needed those. For other topics, still populate these arrays but adapt their meaning to fit the topic. If the topic doesn't have "operators", `operatorGroups` can be an empty array. Design the `dataTypes` cards to represent the key visual concepts for the topic.
- Each quiz question must have exactly one option with `correct: true`.
- Practice problem difficulty must be one of: `"beginner"`, `"intermediate"`, `"advanced"`.
- Practice problems should be ordered by difficulty (easiest first).
- Solutions should be idiomatic Elixir.
- The deep dive walkthroughs should explain the "why" not just the "what".
