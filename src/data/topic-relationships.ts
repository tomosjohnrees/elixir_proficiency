import type {
  TopicCategory,
  TopicGraph,
  TopicRelationship,
} from "@/lib/types";
import { topicRegistry } from "./topics";

export const categoryMeta: Record<
  TopicCategory,
  { label: string; color: string }
> = {
  foundations: { label: "Foundations", color: "#3b82f6" },
  "data-processing": { label: "Data Processing", color: "#059669" },
  "otp-concurrency": { label: "OTP & Concurrency", color: "#8b5cf6" },
  abstraction: { label: "Abstraction", color: "#d97706" },
  ecosystem: { label: "Ecosystem", color: "#e11d48" },
  tooling: { label: "Tooling & Style", color: "#0891b2" },
};

export const categoryOrder: TopicCategory[] = [
  "foundations",
  "data-processing",
  "otp-concurrency",
  "abstraction",
  "ecosystem",
  "tooling",
];

export const topicGraph: TopicGraph = {
  nodes: [
    // Foundations
    { slug: "basic-data-types", category: "foundations", x: 0.08, y: 0.08 },
    { slug: "pattern-matching", category: "foundations", x: 0.08, y: 0.22 },
    { slug: "control-flow", category: "foundations", x: 0.08, y: 0.36 },
    {
      slug: "functions-and-modules",
      category: "foundations",
      x: 0.08,
      y: 0.50,
    },
    { slug: "recursion", category: "foundations", x: 0.08, y: 0.64 },
    { slug: "guards-in-depth", category: "foundations", x: 0.08, y: 0.78 },

    // Data Processing
    { slug: "lists-and-tuples", category: "data-processing", x: 0.27, y: 0.08 },
    { slug: "maps-and-structs", category: "data-processing", x: 0.27, y: 0.22 },
    { slug: "strings-in-depth", category: "data-processing", x: 0.27, y: 0.36 },
    { slug: "enumerables", category: "data-processing", x: 0.27, y: 0.50 },
    { slug: "comprehensions", category: "data-processing", x: 0.27, y: 0.64 },
    { slug: "sigils", category: "data-processing", x: 0.27, y: 0.78 },

    // OTP & Concurrency
    { slug: "processes", category: "otp-concurrency", x: 0.46, y: 0.08 },
    { slug: "genserver", category: "otp-concurrency", x: 0.46, y: 0.22 },
    { slug: "supervisors", category: "otp-concurrency", x: 0.46, y: 0.36 },
    { slug: "mix-and-otp", category: "otp-concurrency", x: 0.46, y: 0.50 },
    {
      slug: "concurrency-patterns",
      category: "otp-concurrency",
      x: 0.46,
      y: 0.64,
    },
    { slug: "ets", category: "otp-concurrency", x: 0.46, y: 0.78 },

    // Abstraction
    { slug: "protocols", category: "abstraction", x: 0.65, y: 0.08 },
    { slug: "behaviours", category: "abstraction", x: 0.65, y: 0.22 },
    { slug: "macros", category: "abstraction", x: 0.65, y: 0.36 },
    { slug: "error-handling", category: "abstraction", x: 0.65, y: 0.50 },

    // Ecosystem
    { slug: "testing", category: "ecosystem", x: 0.84, y: 0.08 },
    { slug: "ecto-basics", category: "ecosystem", x: 0.84, y: 0.22 },
    { slug: "phoenix-basics", category: "ecosystem", x: 0.84, y: 0.36 },
    { slug: "liveview", category: "ecosystem", x: 0.84, y: 0.50 },
    { slug: "deployment", category: "ecosystem", x: 0.84, y: 0.64 },

    // Tooling & Style
    {
      slug: "typespecs-and-dialyzer",
      category: "tooling",
      x: 0.65,
      y: 0.68,
    },
    {
      slug: "debugging-and-tooling",
      category: "tooling",
      x: 0.65,
      y: 0.82,
    },
    { slug: "idiomatic-elixir", category: "tooling", x: 0.84, y: 0.82 },
  ],
  edges: [
    // Foundations chain
    {
      from: "basic-data-types",
      to: "pattern-matching",
      strength: "strong",
    },
    { from: "pattern-matching", to: "control-flow", strength: "strong" },
    {
      from: "control-flow",
      to: "functions-and-modules",
      strength: "strong",
    },
    { from: "functions-and-modules", to: "recursion", strength: "strong" },
    {
      from: "pattern-matching",
      to: "guards-in-depth",
      strength: "strong",
    },
    { from: "control-flow", to: "guards-in-depth", strength: "moderate" },

    // Foundations -> Data Processing
    {
      from: "basic-data-types",
      to: "lists-and-tuples",
      strength: "strong",
    },
    {
      from: "basic-data-types",
      to: "maps-and-structs",
      strength: "strong",
    },
    {
      from: "basic-data-types",
      to: "strings-in-depth",
      strength: "moderate",
    },
    {
      from: "pattern-matching",
      to: "lists-and-tuples",
      strength: "moderate",
    },
    {
      from: "pattern-matching",
      to: "maps-and-structs",
      strength: "moderate",
    },

    // Data Processing chain
    { from: "lists-and-tuples", to: "enumerables", strength: "strong" },
    { from: "maps-and-structs", to: "enumerables", strength: "moderate" },
    { from: "enumerables", to: "comprehensions", strength: "strong" },
    { from: "strings-in-depth", to: "sigils", strength: "moderate" },
    {
      from: "pattern-matching",
      to: "comprehensions",
      strength: "moderate",
    },

    // Foundations -> OTP
    {
      from: "functions-and-modules",
      to: "processes",
      strength: "strong",
    },
    { from: "recursion", to: "processes", strength: "moderate" },

    // OTP chain
    { from: "processes", to: "genserver", strength: "strong" },
    { from: "genserver", to: "supervisors", strength: "strong" },
    { from: "supervisors", to: "mix-and-otp", strength: "strong" },
    {
      from: "processes",
      to: "concurrency-patterns",
      strength: "strong",
    },
    {
      from: "genserver",
      to: "concurrency-patterns",
      strength: "moderate",
    },
    { from: "genserver", to: "ets", strength: "moderate" },
    { from: "processes", to: "ets", strength: "moderate" },

    // Foundations -> Abstraction
    {
      from: "functions-and-modules",
      to: "protocols",
      strength: "strong",
    },
    {
      from: "functions-and-modules",
      to: "behaviours",
      strength: "strong",
    },
    { from: "protocols", to: "behaviours", strength: "moderate" },
    { from: "functions-and-modules", to: "macros", strength: "strong" },
    {
      from: "pattern-matching",
      to: "error-handling",
      strength: "moderate",
    },
    { from: "processes", to: "error-handling", strength: "moderate" },

    // Ecosystem chain
    {
      from: "functions-and-modules",
      to: "testing",
      strength: "moderate",
    },
    { from: "mix-and-otp", to: "testing", strength: "moderate" },
    { from: "maps-and-structs", to: "ecto-basics", strength: "moderate" },
    { from: "mix-and-otp", to: "ecto-basics", strength: "strong" },
    { from: "ecto-basics", to: "phoenix-basics", strength: "strong" },
    { from: "mix-and-otp", to: "phoenix-basics", strength: "strong" },
    { from: "phoenix-basics", to: "liveview", strength: "strong" },
    { from: "processes", to: "liveview", strength: "moderate" },
    { from: "mix-and-otp", to: "deployment", strength: "strong" },
    { from: "phoenix-basics", to: "deployment", strength: "moderate" },

    // Tooling connections
    {
      from: "functions-and-modules",
      to: "typespecs-and-dialyzer",
      strength: "moderate",
    },
    {
      from: "behaviours",
      to: "typespecs-and-dialyzer",
      strength: "moderate",
    },
    {
      from: "mix-and-otp",
      to: "debugging-and-tooling",
      strength: "moderate",
    },
    {
      from: "processes",
      to: "debugging-and-tooling",
      strength: "moderate",
    },
    {
      from: "enumerables",
      to: "idiomatic-elixir",
      strength: "moderate",
    },
    {
      from: "pattern-matching",
      to: "idiomatic-elixir",
      strength: "moderate",
    },
  ],
};

// ─── Helper Functions ────────────────────────────

const strengthOrder = { strong: 0, moderate: 1 } as const;

export function getPrerequisites(slug: string): string[] {
  return topicGraph.edges
    .filter((e) => e.to === slug)
    .sort((a, b) => strengthOrder[a.strength] - strengthOrder[b.strength])
    .map((e) => e.from);
}

export function getNextTopics(slug: string): string[] {
  return topicGraph.edges
    .filter((e) => e.from === slug)
    .sort((a, b) => strengthOrder[a.strength] - strengthOrder[b.strength])
    .map((e) => e.to);
}

export function getEdgeStrength(
  from: string,
  to: string
): "strong" | "moderate" | null {
  const edge = topicGraph.edges.find(
    (e) => e.from === from && e.to === to
  );
  return edge?.strength ?? null;
}

export function getTopicBySlug(slug: string) {
  return topicRegistry.find((t) => t.slug === slug);
}

export function getTopicCategory(slug: string): TopicCategory | undefined {
  return topicGraph.nodes.find((n) => n.slug === slug)?.category;
}
