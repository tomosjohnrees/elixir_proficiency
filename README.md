# Elixir Learning App

An interactive Elixir learning platform built with Next.js. The app guides learners from absolute beginner to advanced Elixir developer through 25 progressively structured topics.

## Topic Structure

Every topic follows the same five-stage progression:

### 1. ELI5 Introduction

A simple, jargon-free explanation of the concept using everyday analogies. The goal is to build intuition before introducing any code. Assume the reader has never seen the concept before.

### 2. Visual Aids / Graphics

Diagrams, illustrations, and animations that reinforce the ELI5 and make abstract ideas concrete. These should build visual intuition — not just decorate the page.

### 3. Technical Deep Dive

The proper technical explanation with real Elixir code examples. This section assumes the reader now has the mental model from stages 1 and 2 and is ready for precision.

### 4. Quiz

Multiple-choice questions that test whether the learner understood the material. Questions should cover both conceptual understanding and practical knowledge.

### 5. Practice Problems

Hands-on challenges for the learner to solve independently. Each problem includes:

- **Problem statement** — A clear description of what to build or solve
- **Hints** — Progressive hints that guide without giving away the answer
- **Example solution** — A revealable reference implementation
- **Technical walkthrough** — A step-by-step explanation of the solution, covering why each decision was made

## Course Curriculum

The full curriculum is defined in [`course_overview.md`](./course_overview.md). The 25 topics are grouped into 6 sections:

### Foundations (Topics 1–8)

1. Basic Data Types and Operators
2. Pattern Matching
3. Collections
4. Control Flow
5. Functions and Modules
6. Anonymous Functions and Higher-Order Functions
7. Recursion
8. Pipe Operator and Composition

### Intermediate Concepts (Topics 9–13)

9. Strings and Binaries
10. Structs and Protocols
11. Error Handling
12. Mix and Project Structure
13. ExUnit and Testing

### Concurrency and OTP (Topics 14–17)

14. Processes and Concurrency
15. GenServer
16. Supervisors and Supervision Trees
17. OTP Behaviours

### Data and Metaprogramming (Topics 18–20)

18. Ecto
19. Metaprogramming
20. Behaviours and Advanced Protocols

### The Phoenix Ecosystem (Topics 21–22)

21. Phoenix Framework
22. Phoenix LiveView

### Advanced Topics (Topics 23–25)

23. Distributed Elixir
24. Telemetry, Observability, and Performance
25. Nerves and NIFs

## Tech Stack

- **Next.js** — React framework for the app shell, routing, and rendering
- Content for each topic lives alongside the app code

## Content Guidelines

### Tone

- Friendly and encouraging, never condescending
- Use "you" to address the learner directly
- Keep sentences short and clear

### ELI5s

- Use a single, concrete analogy that maps cleanly to the concept
- Avoid Elixir syntax entirely — this section is pure prose
- Keep it to 2–4 short paragraphs

### Difficulty Expectations

- Topics build on each other — later topics can assume knowledge from earlier ones
- Each topic should be self-contained enough to revisit without re-reading everything before it
- Practice problems should range from straightforward application to genuine challenge

### Quiz Format

- 3–5 multiple-choice questions per topic
- Include one "trick" question that tests a common misconception
- Provide brief explanations for each answer (correct and incorrect)

### Practice Problem Format

- 2–4 problems per topic, ordered by difficulty
- Problem statements should be specific and unambiguous
- Hints should be progressive: the first hint is a gentle nudge, the last is nearly a roadmap
- Example solutions should be idiomatic Elixir
- Technical walkthroughs should explain the "why" not just the "what"
