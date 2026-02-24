import type {
  TopicCategory,
  TopicGraph,
} from "@/lib/types";
import { topicRegistry } from "./topics";

export const categoryMeta: Record<
  TopicCategory,
  { label: string; color: string }
> = {
  foundations: { label: "Foundations", color: "#3b82f6" },
  "data-processing": { label: "Data Processing", color: "#059669" },
  oop: { label: "Object-Oriented", color: "#8b5cf6" },
  abstraction: { label: "Abstraction", color: "#d97706" },
  ecosystem: { label: "Ecosystem", color: "#e11d48" },
  tooling: { label: "Tooling & Advanced", color: "#0891b2" },
  "otp-concurrency": { label: "OTP & Concurrency", color: "#6b7280" },
};

export const categoryOrder: TopicCategory[] = [
  "foundations",
  "data-processing",
  "oop",
  "abstraction",
  "ecosystem",
  "tooling",
];

export const topicGraph: TopicGraph = {
  nodes: [
    // Foundations
    { slug: "basic-data-types", category: "foundations", x: 0.08, y: 0.08 },
    { slug: "operators-and-expressions", category: "foundations", x: 0.08, y: 0.22 },
    { slug: "control-flow", category: "foundations", x: 0.08, y: 0.36 },
    { slug: "methods", category: "foundations", x: 0.08, y: 0.50 },
    { slug: "blocks-and-iterators", category: "foundations", x: 0.08, y: 0.64 },
    { slug: "scope-and-closures", category: "foundations", x: 0.08, y: 0.78 },

    // Data Processing
    { slug: "strings-in-depth", category: "data-processing", x: 0.27, y: 0.08 },
    { slug: "symbols", category: "data-processing", x: 0.27, y: 0.22 },
    { slug: "arrays", category: "data-processing", x: 0.27, y: 0.36 },
    { slug: "hashes", category: "data-processing", x: 0.27, y: 0.50 },
    { slug: "enumerables", category: "data-processing", x: 0.27, y: 0.64 },
    { slug: "regular-expressions", category: "data-processing", x: 0.27, y: 0.78 },

    // Object-Oriented Programming
    { slug: "classes-and-objects", category: "oop", x: 0.46, y: 0.08 },
    { slug: "inheritance", category: "oop", x: 0.46, y: 0.22 },
    { slug: "modules-and-mixins", category: "oop", x: 0.46, y: 0.36 },
    { slug: "access-control", category: "oop", x: 0.46, y: 0.50 },
    { slug: "duck-typing", category: "oop", x: 0.46, y: 0.64 },
    { slug: "structs-and-data", category: "oop", x: 0.46, y: 0.78 },

    // Abstraction & Metaprogramming
    { slug: "procs-and-lambdas", category: "abstraction", x: 0.65, y: 0.08 },
    { slug: "error-handling", category: "abstraction", x: 0.65, y: 0.22 },
    { slug: "pattern-matching", category: "abstraction", x: 0.65, y: 0.36 },
    { slug: "metaprogramming", category: "abstraction", x: 0.65, y: 0.50 },
    { slug: "dsls", category: "abstraction", x: 0.65, y: 0.64 },

    // Ecosystem
    { slug: "gems-and-bundler", category: "ecosystem", x: 0.84, y: 0.08 },
    { slug: "testing", category: "ecosystem", x: 0.84, y: 0.22 },
    { slug: "rack-and-web", category: "ecosystem", x: 0.84, y: 0.36 },
    { slug: "rails-overview", category: "ecosystem", x: 0.84, y: 0.50 },
    { slug: "active-record", category: "ecosystem", x: 0.84, y: 0.64 },

    // Tooling & Advanced
    { slug: "concurrency", category: "tooling", x: 0.65, y: 0.78 },
    { slug: "debugging-and-tooling", category: "tooling", x: 0.84, y: 0.82 },
  ],
  edges: [
    // Foundations chain
    { from: "basic-data-types", to: "operators-and-expressions", strength: "strong" },
    { from: "operators-and-expressions", to: "control-flow", strength: "strong" },
    { from: "control-flow", to: "methods", strength: "strong" },
    { from: "methods", to: "blocks-and-iterators", strength: "strong" },
    { from: "blocks-and-iterators", to: "scope-and-closures", strength: "strong" },

    // Foundations -> Data Processing
    { from: "basic-data-types", to: "strings-in-depth", strength: "strong" },
    { from: "basic-data-types", to: "symbols", strength: "moderate" },
    { from: "basic-data-types", to: "arrays", strength: "strong" },
    { from: "basic-data-types", to: "hashes", strength: "strong" },
    { from: "strings-in-depth", to: "regular-expressions", strength: "moderate" },

    // Data Processing chain
    { from: "arrays", to: "enumerables", strength: "strong" },
    { from: "hashes", to: "enumerables", strength: "strong" },
    { from: "blocks-and-iterators", to: "enumerables", strength: "strong" },
    { from: "symbols", to: "hashes", strength: "moderate" },

    // Foundations -> OOP
    { from: "methods", to: "classes-and-objects", strength: "strong" },
    { from: "scope-and-closures", to: "classes-and-objects", strength: "moderate" },

    // OOP chain
    { from: "classes-and-objects", to: "inheritance", strength: "strong" },
    { from: "classes-and-objects", to: "access-control", strength: "strong" },
    { from: "inheritance", to: "modules-and-mixins", strength: "strong" },
    { from: "modules-and-mixins", to: "duck-typing", strength: "moderate" },
    { from: "classes-and-objects", to: "duck-typing", strength: "moderate" },
    { from: "classes-and-objects", to: "structs-and-data", strength: "moderate" },

    // Foundations -> Abstraction
    { from: "blocks-and-iterators", to: "procs-and-lambdas", strength: "strong" },
    { from: "scope-and-closures", to: "procs-and-lambdas", strength: "strong" },
    { from: "control-flow", to: "error-handling", strength: "moderate" },
    { from: "classes-and-objects", to: "error-handling", strength: "moderate" },
    { from: "control-flow", to: "pattern-matching", strength: "moderate" },
    { from: "classes-and-objects", to: "metaprogramming", strength: "strong" },
    { from: "modules-and-mixins", to: "metaprogramming", strength: "strong" },
    { from: "metaprogramming", to: "dsls", strength: "strong" },
    { from: "blocks-and-iterators", to: "dsls", strength: "moderate" },

    // Ecosystem chain
    { from: "methods", to: "gems-and-bundler", strength: "moderate" },
    { from: "classes-and-objects", to: "testing", strength: "moderate" },
    { from: "gems-and-bundler", to: "testing", strength: "moderate" },
    { from: "blocks-and-iterators", to: "rack-and-web", strength: "moderate" },
    { from: "hashes", to: "rack-and-web", strength: "moderate" },
    { from: "rack-and-web", to: "rails-overview", strength: "strong" },
    { from: "gems-and-bundler", to: "rails-overview", strength: "strong" },
    { from: "rails-overview", to: "active-record", strength: "strong" },
    { from: "classes-and-objects", to: "active-record", strength: "moderate" },

    // Tooling connections
    { from: "classes-and-objects", to: "concurrency", strength: "moderate" },
    { from: "procs-and-lambdas", to: "concurrency", strength: "moderate" },
    { from: "gems-and-bundler", to: "debugging-and-tooling", strength: "moderate" },
    { from: "error-handling", to: "debugging-and-tooling", strength: "moderate" },
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
