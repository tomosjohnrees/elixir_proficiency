import { describe, it, expect } from "vitest";
import { topicRegistry } from "@/data/topics";
import basicDataTypes from "@/data/topics/basic-data-types";
import patternMatching from "@/data/topics/pattern-matching";
import listsAndTuples from "@/data/topics/lists-and-tuples";
import mapsAndStructs from "@/data/topics/maps-and-structs";

describe("topicRegistry", () => {
  it("has 25 topics", () => {
    expect(topicRegistry).toHaveLength(25);
  });

  it("has sequential topic numbers", () => {
    topicRegistry.forEach((topic, i) => {
      expect(topic.number).toBe(i + 1);
    });
  });

  it("has topics 1 through 4 active", () => {
    const active = topicRegistry.filter((t) => t.active);
    expect(active).toHaveLength(4);
    expect(active[0].slug).toBe("basic-data-types");
    expect(active[1].slug).toBe("pattern-matching");
    expect(active[2].slug).toBe("lists-and-tuples");
    expect(active[3].slug).toBe("maps-and-structs");
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

describe("basicDataTypes topic content", () => {
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
    expect(basicDataTypes.deepDive.sections.length).toBe(6);
    basicDataTypes.deepDive.sections.forEach((section) => {
      expect(section.title).toBeTruthy();
      expect(section.prose.length).toBeGreaterThan(0);
    });
  });

  it("has deep dive sections with code examples", () => {
    const sectionsWithCode = basicDataTypes.deepDive.sections.filter((s) => s.code);
    expect(sectionsWithCode.length).toBe(6);
  });

  it("has 5 quiz questions", () => {
    expect(basicDataTypes.quiz.questions).toHaveLength(5);
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
});

describe("patternMatching topic content", () => {
  it("has correct meta", () => {
    expect(patternMatching.meta.slug).toBe("pattern-matching");
    expect(patternMatching.meta.number).toBe(2);
    expect(patternMatching.meta.active).toBe(true);
  });

  it("has ELI5 content with items and takeaways", () => {
    expect(patternMatching.eli5.analogyTitle).toBeTruthy();
    expect(patternMatching.eli5.analogy).toBeTruthy();
    expect(patternMatching.eli5.items.length).toBeGreaterThan(0);
    expect(patternMatching.eli5.keyTakeaways.length).toBeGreaterThan(0);
  });

  it("has visual content with data types", () => {
    expect(patternMatching.visuals.dataTypes.length).toBeGreaterThan(0);

    patternMatching.visuals.dataTypes.forEach((dt) => {
      expect(dt.name).toBeTruthy();
      expect(dt.color).toMatch(/^#/);
      expect(dt.examples.length).toBeGreaterThan(0);
    });
  });

  it("has deep dive sections with prose", () => {
    expect(patternMatching.deepDive.sections.length).toBeGreaterThanOrEqual(4);
    patternMatching.deepDive.sections.forEach((section) => {
      expect(section.title).toBeTruthy();
      expect(section.prose.length).toBeGreaterThan(0);
    });
  });

  it("has 5 quiz questions", () => {
    expect(patternMatching.quiz.questions).toHaveLength(5);
    patternMatching.quiz.questions.forEach((q) => {
      expect(q.question).toBeTruthy();
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.explanation).toBeTruthy();
      // Exactly one correct answer
      const correct = q.options.filter((o) => o.correct);
      expect(correct).toHaveLength(1);
    });
  });

  it("has 4 practice problems", () => {
    expect(patternMatching.practice.problems).toHaveLength(4);
    patternMatching.practice.problems.forEach((p) => {
      expect(p.title).toBeTruthy();
      expect(p.prompt).toBeTruthy();
      expect(p.hints.length).toBeGreaterThan(0);
      expect(p.solution).toBeTruthy();
      expect(p.walkthrough.length).toBeGreaterThan(0);
      expect(["beginner", "intermediate", "advanced"]).toContain(p.difficulty);
    });
  });
});

describe("listsAndTuples topic content", () => {
  it("has correct meta", () => {
    expect(listsAndTuples.meta.slug).toBe("lists-and-tuples");
    expect(listsAndTuples.meta.number).toBe(3);
    expect(listsAndTuples.meta.active).toBe(true);
  });

  it("has ELI5 content with items and takeaways", () => {
    expect(listsAndTuples.eli5.analogyTitle).toBeTruthy();
    expect(listsAndTuples.eli5.analogy).toBeTruthy();
    expect(listsAndTuples.eli5.items.length).toBeGreaterThan(0);
    expect(listsAndTuples.eli5.keyTakeaways.length).toBeGreaterThan(0);
  });

  it("has visual content with data types", () => {
    expect(listsAndTuples.visuals.dataTypes.length).toBeGreaterThan(0);

    listsAndTuples.visuals.dataTypes.forEach((dt) => {
      expect(dt.name).toBeTruthy();
      expect(dt.color).toMatch(/^#/);
      expect(dt.examples.length).toBeGreaterThan(0);
    });
  });

  it("has deep dive sections with prose", () => {
    expect(listsAndTuples.deepDive.sections.length).toBeGreaterThanOrEqual(4);
    listsAndTuples.deepDive.sections.forEach((section) => {
      expect(section.title).toBeTruthy();
      expect(section.prose.length).toBeGreaterThan(0);
    });
  });

  it("has 5 quiz questions", () => {
    expect(listsAndTuples.quiz.questions).toHaveLength(5);
    listsAndTuples.quiz.questions.forEach((q) => {
      expect(q.question).toBeTruthy();
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.explanation).toBeTruthy();
      const correct = q.options.filter((o) => o.correct);
      expect(correct).toHaveLength(1);
    });
  });

  it("has 4 practice problems", () => {
    expect(listsAndTuples.practice.problems).toHaveLength(4);
    listsAndTuples.practice.problems.forEach((p) => {
      expect(p.title).toBeTruthy();
      expect(p.prompt).toBeTruthy();
      expect(p.hints.length).toBeGreaterThan(0);
      expect(p.solution).toBeTruthy();
      expect(p.walkthrough.length).toBeGreaterThan(0);
      expect(["beginner", "intermediate", "advanced"]).toContain(p.difficulty);
    });
  });
});

describe("mapsAndStructs topic content", () => {
  it("has correct meta", () => {
    expect(mapsAndStructs.meta.slug).toBe("maps-and-structs");
    expect(mapsAndStructs.meta.number).toBe(4);
    expect(mapsAndStructs.meta.active).toBe(true);
  });

  it("has ELI5 content with items and takeaways", () => {
    expect(mapsAndStructs.eli5.analogyTitle).toBeTruthy();
    expect(mapsAndStructs.eli5.analogy).toBeTruthy();
    expect(mapsAndStructs.eli5.items.length).toBeGreaterThan(0);
    expect(mapsAndStructs.eli5.keyTakeaways.length).toBeGreaterThan(0);
  });

  it("has visual content with data types", () => {
    expect(mapsAndStructs.visuals.dataTypes.length).toBeGreaterThan(0);

    mapsAndStructs.visuals.dataTypes.forEach((dt) => {
      expect(dt.name).toBeTruthy();
      expect(dt.color).toMatch(/^#/);
      expect(dt.examples.length).toBeGreaterThan(0);
    });
  });

  it("has deep dive sections with prose", () => {
    expect(mapsAndStructs.deepDive.sections.length).toBeGreaterThanOrEqual(4);
    mapsAndStructs.deepDive.sections.forEach((section) => {
      expect(section.title).toBeTruthy();
      expect(section.prose.length).toBeGreaterThan(0);
    });
  });

  it("has 5 quiz questions", () => {
    expect(mapsAndStructs.quiz.questions).toHaveLength(5);
    mapsAndStructs.quiz.questions.forEach((q) => {
      expect(q.question).toBeTruthy();
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.explanation).toBeTruthy();
      const correct = q.options.filter((o) => o.correct);
      expect(correct).toHaveLength(1);
    });
  });

  it("has 4 practice problems", () => {
    expect(mapsAndStructs.practice.problems).toHaveLength(4);
    mapsAndStructs.practice.problems.forEach((p) => {
      expect(p.title).toBeTruthy();
      expect(p.prompt).toBeTruthy();
      expect(p.hints.length).toBeGreaterThan(0);
      expect(p.solution).toBeTruthy();
      expect(p.walkthrough.length).toBeGreaterThan(0);
      expect(["beginner", "intermediate", "advanced"]).toContain(p.difficulty);
    });
  });
});
