import { describe, it, expect } from "vitest";
import {
  topicGraph,
  getPrerequisites,
  getNextTopics,
  categoryMeta,
} from "@/data/topic-relationships";
import { topicRegistry } from "@/data/topics";

describe("topic-relationships", () => {
  const activeSlugs = topicRegistry
    .filter((t) => t.active)
    .map((t) => t.slug);
  const nodeSlugs = topicGraph.nodes.map((n) => n.slug);

  it("has a node for every active topic", () => {
    activeSlugs.forEach((slug) => {
      expect(nodeSlugs).toContain(slug);
    });
  });

  it("has no nodes for non-existent topics", () => {
    const allSlugs = topicRegistry.map((t) => t.slug);
    topicGraph.nodes.forEach((node) => {
      expect(allSlugs).toContain(node.slug);
    });
  });

  it("all edge references point to valid topic slugs", () => {
    const validSlugs = new Set(nodeSlugs);
    topicGraph.edges.forEach((edge) => {
      expect(validSlugs.has(edge.from)).toBe(true);
      expect(validSlugs.has(edge.to)).toBe(true);
    });
  });

  it("has no duplicate edges", () => {
    const edgeKeys = topicGraph.edges.map((e) => `${e.from}->${e.to}`);
    expect(new Set(edgeKeys).size).toBe(edgeKeys.length);
  });

  it("has no self-referencing edges", () => {
    topicGraph.edges.forEach((edge) => {
      expect(edge.from).not.toBe(edge.to);
    });
  });

  it("has no bidirectional edges", () => {
    const edgeSet = new Set(
      topicGraph.edges.map((e) => `${e.from}->${e.to}`)
    );
    topicGraph.edges.forEach((edge) => {
      expect(edgeSet.has(`${edge.to}->${edge.from}`)).toBe(false);
    });
  });

  it("every node has a valid category", () => {
    const validCategories = Object.keys(categoryMeta);
    topicGraph.nodes.forEach((node) => {
      expect(validCategories).toContain(node.category);
    });
  });

  it("every node has x/y in [0, 1] range", () => {
    topicGraph.nodes.forEach((node) => {
      expect(node.x).toBeGreaterThanOrEqual(0);
      expect(node.x).toBeLessThanOrEqual(1);
      expect(node.y).toBeGreaterThanOrEqual(0);
      expect(node.y).toBeLessThanOrEqual(1);
    });
  });

  it("getPrerequisites returns correct results for genserver", () => {
    const prereqs = getPrerequisites("genserver");
    expect(prereqs).toContain("processes");
  });

  it("getNextTopics returns correct results for processes", () => {
    const next = getNextTopics("processes");
    expect(next).toContain("genserver");
  });

  it("basic-data-types has no prerequisites", () => {
    const prereqs = getPrerequisites("basic-data-types");
    expect(prereqs).toHaveLength(0);
  });

  it("every edge has a valid strength", () => {
    topicGraph.edges.forEach((edge) => {
      expect(["strong", "moderate"]).toContain(edge.strength);
    });
  });
});
