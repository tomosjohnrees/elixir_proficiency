import { describe, it, expect } from "vitest";
import { topicRegistry } from "@/data/courses/ruby/topics";
import basicDataTypes from "@/data/courses/ruby/topics/basic-data-types";

describe("Ruby topicRegistry", () => {
  it("has 30 topics", () => {
    expect(topicRegistry).toHaveLength(30);
  });

  it("has sequential topic numbers", () => {
    topicRegistry.forEach((topic, i) => {
      expect(topic.number).toBe(i + 1);
    });
  });

  it("has 1 active topic", () => {
    const active = topicRegistry.filter((t) => t.active);
    expect(active).toHaveLength(1);
    expect(active[0].slug).toBe("basic-data-types");
  });

  it("each topic has required fields", () => {
    topicRegistry.forEach((topic) => {
      expect(topic.slug).toBeTruthy();
      expect(topic.title).toBeTruthy();
      expect(topic.description).toBeTruthy();
      expect(typeof topic.number).toBe("number");
      expect(typeof topic.active).toBe("boolean");
    });
  });

  it("has unique slugs", () => {
    const slugs = topicRegistry.map((t) => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("Ruby basicDataTypes topic content", () => {
  it("has correct meta", () => {
    expect(basicDataTypes.meta.slug).toBe("basic-data-types");
    expect(basicDataTypes.meta.number).toBe(1);
    expect(basicDataTypes.meta.active).toBe(true);
  });

  it("has ELI5 content with items and takeaways", () => {
    expect(basicDataTypes.eli5.analogyTitle).toBeTruthy();
    expect(basicDataTypes.eli5.analogy).toBeTruthy();
    expect(basicDataTypes.eli5.items.length).toBeGreaterThan(0);
    expect(basicDataTypes.eli5.keyTakeaways.length).toBeGreaterThan(0);
  });

  it("has visual content with data types and operator groups", () => {
    expect(basicDataTypes.visuals.dataTypes.length).toBeGreaterThan(0);
    expect(basicDataTypes.visuals.operatorGroups.length).toBeGreaterThan(0);

    basicDataTypes.visuals.dataTypes.forEach((dt) => {
      expect(dt.name).toBeTruthy();
      expect(dt.color).toMatch(/^#/);
      expect(dt.examples.length).toBeGreaterThan(0);
    });
  });

  it("has deep dive sections with prose", () => {
    expect(basicDataTypes.deepDive.sections.length).toBe(7);
    basicDataTypes.deepDive.sections.forEach((section) => {
      expect(section.title).toBeTruthy();
      expect(section.prose.length).toBeGreaterThan(0);
    });
  });

  it("has deep dive sections with code examples", () => {
    const sectionsWithCode = basicDataTypes.deepDive.sections.filter((s) => s.code);
    expect(sectionsWithCode.length).toBe(7);
  });

  it("has at least 15 quiz questions", () => {
    expect(basicDataTypes.quiz.questions.length).toBeGreaterThanOrEqual(15);
    basicDataTypes.quiz.questions.forEach((q) => {
      expect(q.question).toBeTruthy();
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.explanation).toBeTruthy();
      // Exactly one correct answer
      const correct = q.options.filter((o) => o.correct);
      expect(correct).toHaveLength(1);
    });
  });

  it("has 3 practice problems", () => {
    expect(basicDataTypes.practice.problems).toHaveLength(3);
    basicDataTypes.practice.problems.forEach((p) => {
      expect(p.title).toBeTruthy();
      expect(p.prompt).toBeTruthy();
      expect(p.hints.length).toBeGreaterThan(0);
      expect(p.solution).toBeTruthy();
      expect(p.walkthrough.length).toBeGreaterThan(0);
      expect(["beginner", "intermediate", "advanced"]).toContain(p.difficulty);
    });
  });

  it("has gotchas with at least 3 items", () => {
    expect(basicDataTypes.gotchas).toBeDefined();
    expect(basicDataTypes.gotchas!.items.length).toBeGreaterThanOrEqual(3);
  });

  it("has valid gotcha structure", () => {
    basicDataTypes.gotchas!.items.forEach((gotcha) => {
      expect(gotcha.title).toBeTruthy();
      expect(gotcha.description).toBeTruthy();
    });
  });
});
