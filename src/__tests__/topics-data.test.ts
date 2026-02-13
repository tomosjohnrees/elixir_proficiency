import { describe, it, expect } from "vitest";
import { topicRegistry } from "@/data/topics";
import basicDataTypes from "@/data/topics/basic-data-types";
import patternMatching from "@/data/topics/pattern-matching";
import listsAndTuples from "@/data/topics/lists-and-tuples";
import mapsAndStructs from "@/data/topics/maps-and-structs";
import controlFlow from "@/data/topics/control-flow";
import functionsAndModules from "@/data/topics/functions-and-modules";
import recursion from "@/data/topics/recursion";
import enumerables from "@/data/topics/enumerables";
import stringsInDepth from "@/data/topics/strings-in-depth";
import processes from "@/data/topics/processes";
import genserver from "@/data/topics/genserver";
import supervisors from "@/data/topics/supervisors";
import mixAndOtp from "@/data/topics/mix-and-otp";
import testing from "@/data/topics/testing";
import protocols from "@/data/topics/protocols";
import behaviours from "@/data/topics/behaviours";
import macros from "@/data/topics/macros";
import errorHandling from "@/data/topics/error-handling";
import comprehensions from "@/data/topics/comprehensions";
import sigils from "@/data/topics/sigils";
import ectoBasics from "@/data/topics/ecto-basics";
import phoenixBasics from "@/data/topics/phoenix-basics";
import liveview from "@/data/topics/liveview";
import concurrencyPatterns from "@/data/topics/concurrency-patterns";
import deployment from "@/data/topics/deployment";
import debuggingAndTooling from "@/data/topics/debugging-and-tooling";
import idiomaticElixir from "@/data/topics/idiomatic-elixir";

describe("topicRegistry", () => {
  it("has 30 topics", () => {
    expect(topicRegistry).toHaveLength(30);
  });

  it("has sequential topic numbers", () => {
    topicRegistry.forEach((topic, i) => {
      expect(topic.number).toBe(i + 1);
    });
  });

  it("has 27 active topics", () => {
    const active = topicRegistry.filter((t) => t.active);
    expect(active).toHaveLength(27);
    expect(active[0].slug).toBe("basic-data-types");
    expect(active[1].slug).toBe("pattern-matching");
    expect(active[2].slug).toBe("lists-and-tuples");
    expect(active[3].slug).toBe("maps-and-structs");
    expect(active[4].slug).toBe("control-flow");
    expect(active[5].slug).toBe("functions-and-modules");
    expect(active[6].slug).toBe("recursion");
    expect(active[7].slug).toBe("enumerables");
    expect(active[8].slug).toBe("strings-in-depth");
    expect(active[9].slug).toBe("processes");
    expect(active[10].slug).toBe("genserver");
    expect(active[11].slug).toBe("supervisors");
    expect(active[12].slug).toBe("mix-and-otp");
    expect(active[13].slug).toBe("testing");
    expect(active[14].slug).toBe("protocols");
    expect(active[15].slug).toBe("behaviours");
    expect(active[16].slug).toBe("macros");
    expect(active[17].slug).toBe("error-handling");
    expect(active[18].slug).toBe("comprehensions");
    expect(active[19].slug).toBe("sigils");
    expect(active[20].slug).toBe("ecto-basics");
    expect(active[21].slug).toBe("phoenix-basics");
    expect(active[22].slug).toBe("liveview");
    expect(active[23].slug).toBe("concurrency-patterns");
    expect(active[24].slug).toBe("deployment");
    expect(active[25].slug).toBe("idiomatic-elixir");
    expect(active[26].slug).toBe("debugging-and-tooling");
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

  it("has at least 15 quiz questions", () => {
    expect(patternMatching.quiz.questions.length).toBeGreaterThanOrEqual(15);
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

  it("has at least 15 quiz questions", () => {
    expect(listsAndTuples.quiz.questions.length).toBeGreaterThanOrEqual(15);
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

  it("has at least 15 quiz questions", () => {
    expect(mapsAndStructs.quiz.questions.length).toBeGreaterThanOrEqual(15);
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

describe("controlFlow topic content", () => {
  it("has correct meta", () => {
    expect(controlFlow.meta.slug).toBe("control-flow");
    expect(controlFlow.meta.number).toBe(5);
    expect(controlFlow.meta.active).toBe(true);
  });

  it("has ELI5 content with items and takeaways", () => {
    expect(controlFlow.eli5.analogyTitle).toBeTruthy();
    expect(controlFlow.eli5.analogy).toBeTruthy();
    expect(controlFlow.eli5.items.length).toBeGreaterThan(0);
    expect(controlFlow.eli5.keyTakeaways.length).toBeGreaterThan(0);
  });

  it("has visual content with data types", () => {
    expect(controlFlow.visuals.dataTypes.length).toBeGreaterThan(0);

    controlFlow.visuals.dataTypes.forEach((dt) => {
      expect(dt.name).toBeTruthy();
      expect(dt.color).toMatch(/^#/);
      expect(dt.examples.length).toBeGreaterThan(0);
    });
  });

  it("has deep dive sections with prose", () => {
    expect(controlFlow.deepDive.sections.length).toBeGreaterThanOrEqual(4);
    controlFlow.deepDive.sections.forEach((section) => {
      expect(section.title).toBeTruthy();
      expect(section.prose.length).toBeGreaterThan(0);
    });
  });

  it("has at least 15 quiz questions", () => {
    expect(controlFlow.quiz.questions.length).toBeGreaterThanOrEqual(15);
    controlFlow.quiz.questions.forEach((q) => {
      expect(q.question).toBeTruthy();
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.explanation).toBeTruthy();
      const correct = q.options.filter((o) => o.correct);
      expect(correct).toHaveLength(1);
    });
  });

  it("has 3 practice problems", () => {
    expect(controlFlow.practice.problems).toHaveLength(3);
    controlFlow.practice.problems.forEach((p) => {
      expect(p.title).toBeTruthy();
      expect(p.prompt).toBeTruthy();
      expect(p.hints.length).toBeGreaterThan(0);
      expect(p.solution).toBeTruthy();
      expect(p.walkthrough.length).toBeGreaterThan(0);
      expect(["beginner", "intermediate", "advanced"]).toContain(p.difficulty);
    });
  });
});

describe("functionsAndModules topic content", () => {
  it("has correct meta", () => {
    expect(functionsAndModules.meta.slug).toBe("functions-and-modules");
    expect(functionsAndModules.meta.number).toBe(6);
    expect(functionsAndModules.meta.active).toBe(true);
  });

  it("has ELI5 content with items and takeaways", () => {
    expect(functionsAndModules.eli5.analogyTitle).toBeTruthy();
    expect(functionsAndModules.eli5.analogy).toBeTruthy();
    expect(functionsAndModules.eli5.items.length).toBeGreaterThan(0);
    expect(functionsAndModules.eli5.keyTakeaways.length).toBeGreaterThan(0);
  });

  it("has visual content with data types", () => {
    expect(functionsAndModules.visuals.dataTypes.length).toBeGreaterThan(0);

    functionsAndModules.visuals.dataTypes.forEach((dt) => {
      expect(dt.name).toBeTruthy();
      expect(dt.color).toMatch(/^#/);
      expect(dt.examples.length).toBeGreaterThan(0);
    });
  });

  it("has deep dive sections with prose", () => {
    expect(functionsAndModules.deepDive.sections.length).toBeGreaterThanOrEqual(4);
    functionsAndModules.deepDive.sections.forEach((section) => {
      expect(section.title).toBeTruthy();
      expect(section.prose.length).toBeGreaterThan(0);
    });
  });

  it("has at least 15 quiz questions", () => {
    expect(functionsAndModules.quiz.questions.length).toBeGreaterThanOrEqual(15);
    functionsAndModules.quiz.questions.forEach((q) => {
      expect(q.question).toBeTruthy();
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.explanation).toBeTruthy();
      const correct = q.options.filter((o) => o.correct);
      expect(correct).toHaveLength(1);
    });
  });

  it("has 3 practice problems", () => {
    expect(functionsAndModules.practice.problems).toHaveLength(3);
    functionsAndModules.practice.problems.forEach((p) => {
      expect(p.title).toBeTruthy();
      expect(p.prompt).toBeTruthy();
      expect(p.hints.length).toBeGreaterThan(0);
      expect(p.solution).toBeTruthy();
      expect(p.walkthrough.length).toBeGreaterThan(0);
      expect(["beginner", "intermediate", "advanced"]).toContain(p.difficulty);
    });
  });
});

describe("recursion topic content", () => {
  it("has correct meta", () => {
    expect(recursion.meta.slug).toBe("recursion");
    expect(recursion.meta.number).toBe(7);
    expect(recursion.meta.active).toBe(true);
  });

  it("has ELI5 content with items and takeaways", () => {
    expect(recursion.eli5.analogyTitle).toBeTruthy();
    expect(recursion.eli5.analogy).toBeTruthy();
    expect(recursion.eli5.items.length).toBeGreaterThan(0);
    expect(recursion.eli5.keyTakeaways.length).toBeGreaterThan(0);
  });

  it("has visual content with data types", () => {
    expect(recursion.visuals.dataTypes.length).toBeGreaterThan(0);

    recursion.visuals.dataTypes.forEach((dt) => {
      expect(dt.name).toBeTruthy();
      expect(dt.color).toMatch(/^#/);
      expect(dt.examples.length).toBeGreaterThan(0);
    });
  });

  it("has deep dive sections with prose", () => {
    expect(recursion.deepDive.sections.length).toBeGreaterThanOrEqual(4);
    recursion.deepDive.sections.forEach((section) => {
      expect(section.title).toBeTruthy();
      expect(section.prose.length).toBeGreaterThan(0);
    });
  });

  it("has at least 15 quiz questions", () => {
    expect(recursion.quiz.questions.length).toBeGreaterThanOrEqual(15);
    recursion.quiz.questions.forEach((q) => {
      expect(q.question).toBeTruthy();
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.explanation).toBeTruthy();
      const correct = q.options.filter((o) => o.correct);
      expect(correct).toHaveLength(1);
    });
  });

  it("has 3 practice problems", () => {
    expect(recursion.practice.problems).toHaveLength(3);
    recursion.practice.problems.forEach((p) => {
      expect(p.title).toBeTruthy();
      expect(p.prompt).toBeTruthy();
      expect(p.hints.length).toBeGreaterThan(0);
      expect(p.solution).toBeTruthy();
      expect(p.walkthrough.length).toBeGreaterThan(0);
      expect(["beginner", "intermediate", "advanced"]).toContain(p.difficulty);
    });
  });
});

describe("enumerables topic content", () => {
  it("has correct meta", () => {
    expect(enumerables.meta.slug).toBe("enumerables");
    expect(enumerables.meta.number).toBe(8);
    expect(enumerables.meta.active).toBe(true);
  });

  it("has ELI5 content with items and takeaways", () => {
    expect(enumerables.eli5.analogyTitle).toBeTruthy();
    expect(enumerables.eli5.analogy).toBeTruthy();
    expect(enumerables.eli5.items.length).toBeGreaterThan(0);
    expect(enumerables.eli5.keyTakeaways.length).toBeGreaterThan(0);
  });

  it("has visual content with data types", () => {
    expect(enumerables.visuals.dataTypes.length).toBeGreaterThan(0);

    enumerables.visuals.dataTypes.forEach((dt) => {
      expect(dt.name).toBeTruthy();
      expect(dt.color).toMatch(/^#/);
      expect(dt.examples.length).toBeGreaterThan(0);
    });
  });

  it("has deep dive sections with prose", () => {
    expect(enumerables.deepDive.sections.length).toBeGreaterThanOrEqual(4);
    enumerables.deepDive.sections.forEach((section) => {
      expect(section.title).toBeTruthy();
      expect(section.prose.length).toBeGreaterThan(0);
    });
  });

  it("has at least 15 quiz questions", () => {
    expect(enumerables.quiz.questions.length).toBeGreaterThanOrEqual(15);
    enumerables.quiz.questions.forEach((q) => {
      expect(q.question).toBeTruthy();
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.explanation).toBeTruthy();
      const correct = q.options.filter((o) => o.correct);
      expect(correct).toHaveLength(1);
    });
  });

  it("has 3 practice problems", () => {
    expect(enumerables.practice.problems).toHaveLength(3);
    enumerables.practice.problems.forEach((p) => {
      expect(p.title).toBeTruthy();
      expect(p.prompt).toBeTruthy();
      expect(p.hints.length).toBeGreaterThan(0);
      expect(p.solution).toBeTruthy();
      expect(p.walkthrough.length).toBeGreaterThan(0);
      expect(["beginner", "intermediate", "advanced"]).toContain(p.difficulty);
    });
  });
});

describe("stringsInDepth topic content", () => {
  it("has correct meta", () => {
    expect(stringsInDepth.meta.slug).toBe("strings-in-depth");
    expect(stringsInDepth.meta.number).toBe(9);
    expect(stringsInDepth.meta.active).toBe(true);
  });

  it("has ELI5 content with items and takeaways", () => {
    expect(stringsInDepth.eli5.analogyTitle).toBeTruthy();
    expect(stringsInDepth.eli5.analogy).toBeTruthy();
    expect(stringsInDepth.eli5.items.length).toBeGreaterThan(0);
    expect(stringsInDepth.eli5.keyTakeaways.length).toBeGreaterThan(0);
  });

  it("has visual content with data types", () => {
    expect(stringsInDepth.visuals.dataTypes.length).toBeGreaterThan(0);

    stringsInDepth.visuals.dataTypes.forEach((dt) => {
      expect(dt.name).toBeTruthy();
      expect(dt.color).toMatch(/^#/);
      expect(dt.examples.length).toBeGreaterThan(0);
    });
  });

  it("has deep dive sections with prose", () => {
    expect(stringsInDepth.deepDive.sections.length).toBeGreaterThanOrEqual(4);
    stringsInDepth.deepDive.sections.forEach((section) => {
      expect(section.title).toBeTruthy();
      expect(section.prose.length).toBeGreaterThan(0);
    });
  });

  it("has at least 15 quiz questions", () => {
    expect(stringsInDepth.quiz.questions.length).toBeGreaterThanOrEqual(15);
    stringsInDepth.quiz.questions.forEach((q) => {
      expect(q.question).toBeTruthy();
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.explanation).toBeTruthy();
      const correct = q.options.filter((o) => o.correct);
      expect(correct).toHaveLength(1);
    });
  });

  it("has 3 practice problems", () => {
    expect(stringsInDepth.practice.problems).toHaveLength(3);
    stringsInDepth.practice.problems.forEach((p) => {
      expect(p.title).toBeTruthy();
      expect(p.prompt).toBeTruthy();
      expect(p.hints.length).toBeGreaterThan(0);
      expect(p.solution).toBeTruthy();
      expect(p.walkthrough.length).toBeGreaterThan(0);
      expect(["beginner", "intermediate", "advanced"]).toContain(p.difficulty);
    });
  });
});

describe("processes topic content", () => {
  it("has correct meta", () => {
    expect(processes.meta.slug).toBe("processes");
    expect(processes.meta.number).toBe(10);
    expect(processes.meta.active).toBe(true);
  });

  it("has ELI5 content with items and takeaways", () => {
    expect(processes.eli5.analogyTitle).toBeTruthy();
    expect(processes.eli5.analogy).toBeTruthy();
    expect(processes.eli5.items.length).toBeGreaterThan(0);
    expect(processes.eli5.keyTakeaways.length).toBeGreaterThan(0);
  });

  it("has visual content with data types", () => {
    expect(processes.visuals.dataTypes.length).toBeGreaterThan(0);

    processes.visuals.dataTypes.forEach((dt) => {
      expect(dt.name).toBeTruthy();
      expect(dt.color).toMatch(/^#/);
      expect(dt.examples.length).toBeGreaterThan(0);
    });
  });

  it("has deep dive sections with prose", () => {
    expect(processes.deepDive.sections.length).toBeGreaterThanOrEqual(4);
    processes.deepDive.sections.forEach((section) => {
      expect(section.title).toBeTruthy();
      expect(section.prose.length).toBeGreaterThan(0);
    });
  });

  it("has at least 15 quiz questions", () => {
    expect(processes.quiz.questions.length).toBeGreaterThanOrEqual(15);
    processes.quiz.questions.forEach((q) => {
      expect(q.question).toBeTruthy();
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.explanation).toBeTruthy();
      const correct = q.options.filter((o) => o.correct);
      expect(correct).toHaveLength(1);
    });
  });

  it("has 3 practice problems", () => {
    expect(processes.practice.problems).toHaveLength(3);
    processes.practice.problems.forEach((p) => {
      expect(p.title).toBeTruthy();
      expect(p.prompt).toBeTruthy();
      expect(p.hints.length).toBeGreaterThan(0);
      expect(p.solution).toBeTruthy();
      expect(p.walkthrough.length).toBeGreaterThan(0);
      expect(["beginner", "intermediate", "advanced"]).toContain(p.difficulty);
    });
  });
});

describe("genserver topic content", () => {
  it("has correct meta", () => {
    expect(genserver.meta.slug).toBe("genserver");
    expect(genserver.meta.number).toBe(11);
    expect(genserver.meta.active).toBe(true);
  });

  it("has ELI5 content with items and takeaways", () => {
    expect(genserver.eli5.analogyTitle).toBeTruthy();
    expect(genserver.eli5.analogy).toBeTruthy();
    expect(genserver.eli5.items.length).toBeGreaterThan(0);
    expect(genserver.eli5.keyTakeaways.length).toBeGreaterThan(0);
  });

  it("has visual content with data types", () => {
    expect(genserver.visuals.dataTypes.length).toBeGreaterThan(0);

    genserver.visuals.dataTypes.forEach((dt) => {
      expect(dt.name).toBeTruthy();
      expect(dt.color).toMatch(/^#/);
      expect(dt.examples.length).toBeGreaterThan(0);
    });
  });

  it("has deep dive sections with prose", () => {
    expect(genserver.deepDive.sections.length).toBeGreaterThanOrEqual(4);
    genserver.deepDive.sections.forEach((section) => {
      expect(section.title).toBeTruthy();
      expect(section.prose.length).toBeGreaterThan(0);
    });
  });

  it("has at least 15 quiz questions", () => {
    expect(genserver.quiz.questions.length).toBeGreaterThanOrEqual(15);
    genserver.quiz.questions.forEach((q) => {
      expect(q.question).toBeTruthy();
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.explanation).toBeTruthy();
      const correct = q.options.filter((o) => o.correct);
      expect(correct).toHaveLength(1);
    });
  });

  it("has 3 practice problems", () => {
    expect(genserver.practice.problems).toHaveLength(3);
    genserver.practice.problems.forEach((p) => {
      expect(p.title).toBeTruthy();
      expect(p.prompt).toBeTruthy();
      expect(p.hints.length).toBeGreaterThan(0);
      expect(p.solution).toBeTruthy();
      expect(p.walkthrough.length).toBeGreaterThan(0);
      expect(["beginner", "intermediate", "advanced"]).toContain(p.difficulty);
    });
  });
});

describe("supervisors topic content", () => {
  it("has correct meta", () => {
    expect(supervisors.meta.slug).toBe("supervisors");
    expect(supervisors.meta.number).toBe(12);
    expect(supervisors.meta.active).toBe(true);
  });

  it("has ELI5 content with items and takeaways", () => {
    expect(supervisors.eli5.analogyTitle).toBeTruthy();
    expect(supervisors.eli5.analogy).toBeTruthy();
    expect(supervisors.eli5.items.length).toBeGreaterThan(0);
    expect(supervisors.eli5.keyTakeaways.length).toBeGreaterThan(0);
  });

  it("has visual content with data types", () => {
    expect(supervisors.visuals.dataTypes.length).toBeGreaterThan(0);

    supervisors.visuals.dataTypes.forEach((dt) => {
      expect(dt.name).toBeTruthy();
      expect(dt.color).toMatch(/^#/);
      expect(dt.examples.length).toBeGreaterThan(0);
    });
  });

  it("has deep dive sections with prose", () => {
    expect(supervisors.deepDive.sections.length).toBeGreaterThanOrEqual(4);
    supervisors.deepDive.sections.forEach((section) => {
      expect(section.title).toBeTruthy();
      expect(section.prose.length).toBeGreaterThan(0);
    });
  });

  it("has at least 15 quiz questions", () => {
    expect(supervisors.quiz.questions.length).toBeGreaterThanOrEqual(15);
    supervisors.quiz.questions.forEach((q) => {
      expect(q.question).toBeTruthy();
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.explanation).toBeTruthy();
      const correct = q.options.filter((o) => o.correct);
      expect(correct).toHaveLength(1);
    });
  });

  it("has 3 practice problems", () => {
    expect(supervisors.practice.problems).toHaveLength(3);
    supervisors.practice.problems.forEach((p) => {
      expect(p.title).toBeTruthy();
      expect(p.prompt).toBeTruthy();
      expect(p.hints.length).toBeGreaterThan(0);
      expect(p.solution).toBeTruthy();
      expect(p.walkthrough.length).toBeGreaterThan(0);
      expect(["beginner", "intermediate", "advanced"]).toContain(p.difficulty);
    });
  });
});

describe("mixAndOtp topic content", () => {
  it("has correct meta", () => {
    expect(mixAndOtp.meta.slug).toBe("mix-and-otp");
    expect(mixAndOtp.meta.number).toBe(13);
    expect(mixAndOtp.meta.active).toBe(true);
  });

  it("has ELI5 content with items and takeaways", () => {
    expect(mixAndOtp.eli5.analogyTitle).toBeTruthy();
    expect(mixAndOtp.eli5.analogy).toBeTruthy();
    expect(mixAndOtp.eli5.items.length).toBeGreaterThan(0);
    expect(mixAndOtp.eli5.keyTakeaways.length).toBeGreaterThan(0);
  });

  it("has visual content with data types", () => {
    expect(mixAndOtp.visuals.dataTypes.length).toBeGreaterThan(0);

    mixAndOtp.visuals.dataTypes.forEach((dt) => {
      expect(dt.name).toBeTruthy();
      expect(dt.color).toMatch(/^#/);
      expect(dt.examples.length).toBeGreaterThan(0);
    });
  });

  it("has deep dive sections with prose", () => {
    expect(mixAndOtp.deepDive.sections.length).toBeGreaterThanOrEqual(4);
    mixAndOtp.deepDive.sections.forEach((section) => {
      expect(section.title).toBeTruthy();
      expect(section.prose.length).toBeGreaterThan(0);
    });
  });

  it("has at least 15 quiz questions", () => {
    expect(mixAndOtp.quiz.questions.length).toBeGreaterThanOrEqual(15);
    mixAndOtp.quiz.questions.forEach((q) => {
      expect(q.question).toBeTruthy();
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.explanation).toBeTruthy();
      const correct = q.options.filter((o) => o.correct);
      expect(correct).toHaveLength(1);
    });
  });

  it("has 4 practice problems", () => {
    expect(mixAndOtp.practice.problems).toHaveLength(4);
    mixAndOtp.practice.problems.forEach((p) => {
      expect(p.title).toBeTruthy();
      expect(p.prompt).toBeTruthy();
      expect(p.hints.length).toBeGreaterThan(0);
      expect(p.solution).toBeTruthy();
      expect(p.walkthrough.length).toBeGreaterThan(0);
      expect(["beginner", "intermediate", "advanced"]).toContain(p.difficulty);
    });
  });
});

describe("testing topic content", () => {
  it("has correct meta", () => {
    expect(testing.meta.slug).toBe("testing");
    expect(testing.meta.number).toBe(14);
    expect(testing.meta.active).toBe(true);
  });

  it("has ELI5 content with items and takeaways", () => {
    expect(testing.eli5.analogyTitle).toBeTruthy();
    expect(testing.eli5.analogy).toBeTruthy();
    expect(testing.eli5.items.length).toBeGreaterThan(0);
    expect(testing.eli5.keyTakeaways.length).toBeGreaterThan(0);
  });

  it("has visual content with data types", () => {
    expect(testing.visuals.dataTypes.length).toBeGreaterThan(0);

    testing.visuals.dataTypes.forEach((dt) => {
      expect(dt.name).toBeTruthy();
      expect(dt.color).toMatch(/^#/);
      expect(dt.examples.length).toBeGreaterThan(0);
    });
  });

  it("has deep dive sections with prose", () => {
    expect(testing.deepDive.sections.length).toBeGreaterThanOrEqual(4);
    testing.deepDive.sections.forEach((section) => {
      expect(section.title).toBeTruthy();
      expect(section.prose.length).toBeGreaterThan(0);
    });
  });

  it("has at least 15 quiz questions", () => {
    expect(testing.quiz.questions.length).toBeGreaterThanOrEqual(15);
    testing.quiz.questions.forEach((q) => {
      expect(q.question).toBeTruthy();
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.explanation).toBeTruthy();
      const correct = q.options.filter((o) => o.correct);
      expect(correct).toHaveLength(1);
    });
  });

  it("has 4 practice problems", () => {
    expect(testing.practice.problems).toHaveLength(4);
    testing.practice.problems.forEach((p) => {
      expect(p.title).toBeTruthy();
      expect(p.prompt).toBeTruthy();
      expect(p.hints.length).toBeGreaterThan(0);
      expect(p.solution).toBeTruthy();
      expect(p.walkthrough.length).toBeGreaterThan(0);
      expect(["beginner", "intermediate", "advanced"]).toContain(p.difficulty);
    });
  });
});

describe("protocols topic content", () => {
  it("has correct meta", () => {
    expect(protocols.meta.slug).toBe("protocols");
    expect(protocols.meta.number).toBe(15);
    expect(protocols.meta.active).toBe(true);
  });

  it("has ELI5 content with items and takeaways", () => {
    expect(protocols.eli5.analogyTitle).toBeTruthy();
    expect(protocols.eli5.analogy).toBeTruthy();
    expect(protocols.eli5.items.length).toBeGreaterThan(0);
    expect(protocols.eli5.keyTakeaways.length).toBeGreaterThan(0);
  });

  it("has visual content with data types", () => {
    expect(protocols.visuals.dataTypes.length).toBeGreaterThan(0);

    protocols.visuals.dataTypes.forEach((dt) => {
      expect(dt.name).toBeTruthy();
      expect(dt.color).toMatch(/^#/);
      expect(dt.examples.length).toBeGreaterThan(0);
    });
  });

  it("has deep dive sections with prose", () => {
    expect(protocols.deepDive.sections.length).toBeGreaterThanOrEqual(4);
    protocols.deepDive.sections.forEach((section) => {
      expect(section.title).toBeTruthy();
      expect(section.prose.length).toBeGreaterThan(0);
    });
  });

  it("has at least 15 quiz questions", () => {
    expect(protocols.quiz.questions.length).toBeGreaterThanOrEqual(15);
    protocols.quiz.questions.forEach((q) => {
      expect(q.question).toBeTruthy();
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.explanation).toBeTruthy();
      const correct = q.options.filter((o) => o.correct);
      expect(correct).toHaveLength(1);
    });
  });

  it("has 3 practice problems", () => {
    expect(protocols.practice.problems).toHaveLength(3);
    protocols.practice.problems.forEach((p) => {
      expect(p.title).toBeTruthy();
      expect(p.prompt).toBeTruthy();
      expect(p.hints.length).toBeGreaterThan(0);
      expect(p.solution).toBeTruthy();
      expect(p.walkthrough.length).toBeGreaterThan(0);
      expect(["beginner", "intermediate", "advanced"]).toContain(p.difficulty);
    });
  });
});

describe("behaviours topic content", () => {
  it("has correct meta", () => {
    expect(behaviours.meta.slug).toBe("behaviours");
    expect(behaviours.meta.number).toBe(16);
    expect(behaviours.meta.active).toBe(true);
  });

  it("has ELI5 content with items and takeaways", () => {
    expect(behaviours.eli5.analogyTitle).toBeTruthy();
    expect(behaviours.eli5.analogy).toBeTruthy();
    expect(behaviours.eli5.items.length).toBeGreaterThan(0);
    expect(behaviours.eli5.keyTakeaways.length).toBeGreaterThan(0);
  });

  it("has visual content with data types", () => {
    expect(behaviours.visuals.dataTypes.length).toBeGreaterThan(0);

    behaviours.visuals.dataTypes.forEach((dt) => {
      expect(dt.name).toBeTruthy();
      expect(dt.color).toMatch(/^#/);
      expect(dt.examples.length).toBeGreaterThan(0);
    });
  });

  it("has deep dive sections with prose", () => {
    expect(behaviours.deepDive.sections.length).toBeGreaterThanOrEqual(4);
    behaviours.deepDive.sections.forEach((section) => {
      expect(section.title).toBeTruthy();
      expect(section.prose.length).toBeGreaterThan(0);
    });
  });

  it("has at least 15 quiz questions", () => {
    expect(behaviours.quiz.questions.length).toBeGreaterThanOrEqual(15);
    behaviours.quiz.questions.forEach((q) => {
      expect(q.question).toBeTruthy();
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.explanation).toBeTruthy();
      const correct = q.options.filter((o) => o.correct);
      expect(correct).toHaveLength(1);
    });
  });

  it("has 4 practice problems", () => {
    expect(behaviours.practice.problems).toHaveLength(4);
    behaviours.practice.problems.forEach((p) => {
      expect(p.title).toBeTruthy();
      expect(p.prompt).toBeTruthy();
      expect(p.hints.length).toBeGreaterThan(0);
      expect(p.solution).toBeTruthy();
      expect(p.walkthrough.length).toBeGreaterThan(0);
      expect(["beginner", "intermediate", "advanced"]).toContain(p.difficulty);
    });
  });
});

describe("macros topic content", () => {
  it("has correct meta", () => {
    expect(macros.meta.slug).toBe("macros");
    expect(macros.meta.number).toBe(17);
    expect(macros.meta.active).toBe(true);
  });

  it("has ELI5 content with items and takeaways", () => {
    expect(macros.eli5.analogyTitle).toBeTruthy();
    expect(macros.eli5.analogy).toBeTruthy();
    expect(macros.eli5.items.length).toBeGreaterThan(0);
    expect(macros.eli5.keyTakeaways.length).toBeGreaterThan(0);
  });

  it("has visual content with data types", () => {
    expect(macros.visuals.dataTypes.length).toBeGreaterThan(0);

    macros.visuals.dataTypes.forEach((dt) => {
      expect(dt.name).toBeTruthy();
      expect(dt.color).toMatch(/^#/);
      expect(dt.examples.length).toBeGreaterThan(0);
    });
  });

  it("has deep dive sections with prose", () => {
    expect(macros.deepDive.sections.length).toBeGreaterThanOrEqual(4);
    macros.deepDive.sections.forEach((section) => {
      expect(section.title).toBeTruthy();
      expect(section.prose.length).toBeGreaterThan(0);
    });
  });

  it("has at least 15 quiz questions", () => {
    expect(macros.quiz.questions.length).toBeGreaterThanOrEqual(15);
    macros.quiz.questions.forEach((q) => {
      expect(q.question).toBeTruthy();
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.explanation).toBeTruthy();
      const correct = q.options.filter((o) => o.correct);
      expect(correct).toHaveLength(1);
    });
  });

  it("has 3 practice problems", () => {
    expect(macros.practice.problems).toHaveLength(3);
    macros.practice.problems.forEach((p) => {
      expect(p.title).toBeTruthy();
      expect(p.prompt).toBeTruthy();
      expect(p.hints.length).toBeGreaterThan(0);
      expect(p.solution).toBeTruthy();
      expect(p.walkthrough.length).toBeGreaterThan(0);
      expect(["beginner", "intermediate", "advanced"]).toContain(p.difficulty);
    });
  });
});

describe("errorHandling topic content", () => {
  it("has correct meta", () => {
    expect(errorHandling.meta.slug).toBe("error-handling");
    expect(errorHandling.meta.number).toBe(18);
    expect(errorHandling.meta.active).toBe(true);
  });

  it("has ELI5 content with items and takeaways", () => {
    expect(errorHandling.eli5.analogyTitle).toBeTruthy();
    expect(errorHandling.eli5.analogy).toBeTruthy();
    expect(errorHandling.eli5.items.length).toBeGreaterThan(0);
    expect(errorHandling.eli5.keyTakeaways.length).toBeGreaterThan(0);
  });

  it("has visual content with data types", () => {
    expect(errorHandling.visuals.dataTypes.length).toBeGreaterThan(0);

    errorHandling.visuals.dataTypes.forEach((dt) => {
      expect(dt.name).toBeTruthy();
      expect(dt.color).toMatch(/^#/);
      expect(dt.examples.length).toBeGreaterThan(0);
    });
  });

  it("has deep dive sections with prose", () => {
    expect(errorHandling.deepDive.sections.length).toBeGreaterThanOrEqual(4);
    errorHandling.deepDive.sections.forEach((section) => {
      expect(section.title).toBeTruthy();
      expect(section.prose.length).toBeGreaterThan(0);
    });
  });

  it("has at least 15 quiz questions", () => {
    expect(errorHandling.quiz.questions.length).toBeGreaterThanOrEqual(15);
    errorHandling.quiz.questions.forEach((q) => {
      expect(q.question).toBeTruthy();
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.explanation).toBeTruthy();
      const correct = q.options.filter((o) => o.correct);
      expect(correct).toHaveLength(1);
    });
  });

  it("has 3 practice problems", () => {
    expect(errorHandling.practice.problems).toHaveLength(3);
    errorHandling.practice.problems.forEach((p) => {
      expect(p.title).toBeTruthy();
      expect(p.prompt).toBeTruthy();
      expect(p.hints.length).toBeGreaterThan(0);
      expect(p.solution).toBeTruthy();
      expect(p.walkthrough.length).toBeGreaterThan(0);
      expect(["beginner", "intermediate", "advanced"]).toContain(p.difficulty);
    });
  });
});

describe("comprehensions topic content", () => {
  it("has correct meta", () => {
    expect(comprehensions.meta.slug).toBe("comprehensions");
    expect(comprehensions.meta.number).toBe(19);
    expect(comprehensions.meta.active).toBe(true);
  });

  it("has ELI5 content with items and takeaways", () => {
    expect(comprehensions.eli5.analogyTitle).toBeTruthy();
    expect(comprehensions.eli5.analogy).toBeTruthy();
    expect(comprehensions.eli5.items.length).toBeGreaterThan(0);
    expect(comprehensions.eli5.keyTakeaways.length).toBeGreaterThan(0);
  });

  it("has visual content with data types", () => {
    expect(comprehensions.visuals.dataTypes.length).toBeGreaterThan(0);

    comprehensions.visuals.dataTypes.forEach((dt) => {
      expect(dt.name).toBeTruthy();
      expect(dt.color).toMatch(/^#/);
      expect(dt.examples.length).toBeGreaterThan(0);
    });
  });

  it("has deep dive sections with prose", () => {
    expect(comprehensions.deepDive.sections.length).toBeGreaterThanOrEqual(4);
    comprehensions.deepDive.sections.forEach((section) => {
      expect(section.title).toBeTruthy();
      expect(section.prose.length).toBeGreaterThan(0);
    });
  });

  it("has at least 15 quiz questions", () => {
    expect(comprehensions.quiz.questions.length).toBeGreaterThanOrEqual(15);
    comprehensions.quiz.questions.forEach((q) => {
      expect(q.question).toBeTruthy();
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.explanation).toBeTruthy();
      const correct = q.options.filter((o) => o.correct);
      expect(correct).toHaveLength(1);
    });
  });

  it("has 4 practice problems", () => {
    expect(comprehensions.practice.problems).toHaveLength(4);
    comprehensions.practice.problems.forEach((p) => {
      expect(p.title).toBeTruthy();
      expect(p.prompt).toBeTruthy();
      expect(p.hints.length).toBeGreaterThan(0);
      expect(p.solution).toBeTruthy();
      expect(p.walkthrough.length).toBeGreaterThan(0);
      expect(["beginner", "intermediate", "advanced"]).toContain(p.difficulty);
    });
  });
});

describe("sigils topic content", () => {
  it("has correct meta", () => {
    expect(sigils.meta.slug).toBe("sigils");
    expect(sigils.meta.number).toBe(20);
    expect(sigils.meta.active).toBe(true);
  });

  it("has ELI5 content with items and takeaways", () => {
    expect(sigils.eli5.analogyTitle).toBeTruthy();
    expect(sigils.eli5.analogy).toBeTruthy();
    expect(sigils.eli5.items.length).toBeGreaterThan(0);
    expect(sigils.eli5.keyTakeaways.length).toBeGreaterThan(0);
  });

  it("has visual content with data types", () => {
    expect(sigils.visuals.dataTypes.length).toBeGreaterThan(0);

    sigils.visuals.dataTypes.forEach((dt) => {
      expect(dt.name).toBeTruthy();
      expect(dt.color).toMatch(/^#/);
      expect(dt.examples.length).toBeGreaterThan(0);
    });
  });

  it("has deep dive sections with prose", () => {
    expect(sigils.deepDive.sections.length).toBeGreaterThanOrEqual(4);
    sigils.deepDive.sections.forEach((section) => {
      expect(section.title).toBeTruthy();
      expect(section.prose.length).toBeGreaterThan(0);
    });
  });

  it("has at least 15 quiz questions", () => {
    expect(sigils.quiz.questions.length).toBeGreaterThanOrEqual(15);
    sigils.quiz.questions.forEach((q) => {
      expect(q.question).toBeTruthy();
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.explanation).toBeTruthy();
      const correct = q.options.filter((o) => o.correct);
      expect(correct).toHaveLength(1);
    });
  });

  it("has 3 practice problems", () => {
    expect(sigils.practice.problems).toHaveLength(3);
    sigils.practice.problems.forEach((p) => {
      expect(p.title).toBeTruthy();
      expect(p.prompt).toBeTruthy();
      expect(p.hints.length).toBeGreaterThan(0);
      expect(p.solution).toBeTruthy();
      expect(p.walkthrough.length).toBeGreaterThan(0);
      expect(["beginner", "intermediate", "advanced"]).toContain(p.difficulty);
    });
  });
});

describe("ectoBasics topic content", () => {
  it("has correct meta", () => {
    expect(ectoBasics.meta.slug).toBe("ecto-basics");
    expect(ectoBasics.meta.number).toBe(21);
    expect(ectoBasics.meta.active).toBe(true);
  });

  it("has ELI5 content with items and takeaways", () => {
    expect(ectoBasics.eli5.analogyTitle).toBeTruthy();
    expect(ectoBasics.eli5.analogy).toBeTruthy();
    expect(ectoBasics.eli5.items.length).toBeGreaterThan(0);
    expect(ectoBasics.eli5.keyTakeaways.length).toBeGreaterThan(0);
  });

  it("has visual content with data types", () => {
    expect(ectoBasics.visuals.dataTypes.length).toBeGreaterThan(0);

    ectoBasics.visuals.dataTypes.forEach((dt) => {
      expect(dt.name).toBeTruthy();
      expect(dt.color).toMatch(/^#/);
      expect(dt.examples.length).toBeGreaterThan(0);
    });
  });

  it("has deep dive sections with prose", () => {
    expect(ectoBasics.deepDive.sections.length).toBeGreaterThanOrEqual(4);
    ectoBasics.deepDive.sections.forEach((section) => {
      expect(section.title).toBeTruthy();
      expect(section.prose.length).toBeGreaterThan(0);
    });
  });

  it("has at least 15 quiz questions", () => {
    expect(ectoBasics.quiz.questions.length).toBeGreaterThanOrEqual(15);
    ectoBasics.quiz.questions.forEach((q) => {
      expect(q.question).toBeTruthy();
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.explanation).toBeTruthy();
      const correct = q.options.filter((o) => o.correct);
      expect(correct).toHaveLength(1);
    });
  });

  it("has 3 practice problems", () => {
    expect(ectoBasics.practice.problems).toHaveLength(3);
    ectoBasics.practice.problems.forEach((p) => {
      expect(p.title).toBeTruthy();
      expect(p.prompt).toBeTruthy();
      expect(p.hints.length).toBeGreaterThan(0);
      expect(p.solution).toBeTruthy();
      expect(p.walkthrough.length).toBeGreaterThan(0);
      expect(["beginner", "intermediate", "advanced"]).toContain(p.difficulty);
    });
  });
});

describe("phoenixBasics topic content", () => {
  it("has correct meta", () => {
    expect(phoenixBasics.meta.slug).toBe("phoenix-basics");
    expect(phoenixBasics.meta.number).toBe(22);
    expect(phoenixBasics.meta.active).toBe(true);
  });

  it("has ELI5 content with items and takeaways", () => {
    expect(phoenixBasics.eli5.analogyTitle).toBeTruthy();
    expect(phoenixBasics.eli5.analogy).toBeTruthy();
    expect(phoenixBasics.eli5.items.length).toBeGreaterThan(0);
    expect(phoenixBasics.eli5.keyTakeaways.length).toBeGreaterThan(0);
  });

  it("has visual content with data types", () => {
    expect(phoenixBasics.visuals.dataTypes.length).toBeGreaterThan(0);

    phoenixBasics.visuals.dataTypes.forEach((dt) => {
      expect(dt.name).toBeTruthy();
      expect(dt.color).toMatch(/^#/);
      expect(dt.examples.length).toBeGreaterThan(0);
    });
  });

  it("has deep dive sections with prose", () => {
    expect(phoenixBasics.deepDive.sections.length).toBeGreaterThanOrEqual(4);
    phoenixBasics.deepDive.sections.forEach((section) => {
      expect(section.title).toBeTruthy();
      expect(section.prose.length).toBeGreaterThan(0);
    });
  });

  it("has at least 15 quiz questions", () => {
    expect(phoenixBasics.quiz.questions.length).toBeGreaterThanOrEqual(15);
    phoenixBasics.quiz.questions.forEach((q) => {
      expect(q.question).toBeTruthy();
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.explanation).toBeTruthy();
      const correct = q.options.filter((o) => o.correct);
      expect(correct).toHaveLength(1);
    });
  });

  it("has 3 practice problems", () => {
    expect(phoenixBasics.practice.problems).toHaveLength(3);
    phoenixBasics.practice.problems.forEach((p) => {
      expect(p.title).toBeTruthy();
      expect(p.prompt).toBeTruthy();
      expect(p.hints.length).toBeGreaterThan(0);
      expect(p.solution).toBeTruthy();
      expect(p.walkthrough.length).toBeGreaterThan(0);
      expect(["beginner", "intermediate", "advanced"]).toContain(p.difficulty);
    });
  });
});

describe("liveview topic content", () => {
  it("has correct meta", () => {
    expect(liveview.meta.slug).toBe("liveview");
    expect(liveview.meta.number).toBe(23);
    expect(liveview.meta.active).toBe(true);
  });

  it("has ELI5 content with items and takeaways", () => {
    expect(liveview.eli5.analogyTitle).toBeTruthy();
    expect(liveview.eli5.analogy).toBeTruthy();
    expect(liveview.eli5.items.length).toBeGreaterThan(0);
    expect(liveview.eli5.keyTakeaways.length).toBeGreaterThan(0);
  });

  it("has visual content with data types", () => {
    expect(liveview.visuals.dataTypes.length).toBeGreaterThan(0);

    liveview.visuals.dataTypes.forEach((dt) => {
      expect(dt.name).toBeTruthy();
      expect(dt.color).toMatch(/^#/);
      expect(dt.examples.length).toBeGreaterThan(0);
    });
  });

  it("has deep dive sections with prose", () => {
    expect(liveview.deepDive.sections.length).toBeGreaterThanOrEqual(4);
    liveview.deepDive.sections.forEach((section) => {
      expect(section.title).toBeTruthy();
      expect(section.prose.length).toBeGreaterThan(0);
    });
  });

  it("has at least 15 quiz questions", () => {
    expect(liveview.quiz.questions.length).toBeGreaterThanOrEqual(15);
    liveview.quiz.questions.forEach((q) => {
      expect(q.question).toBeTruthy();
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.explanation).toBeTruthy();
      const correct = q.options.filter((o) => o.correct);
      expect(correct).toHaveLength(1);
    });
  });

  it("has 3 practice problems", () => {
    expect(liveview.practice.problems).toHaveLength(3);
    liveview.practice.problems.forEach((p) => {
      expect(p.title).toBeTruthy();
      expect(p.prompt).toBeTruthy();
      expect(p.hints.length).toBeGreaterThan(0);
      expect(p.solution).toBeTruthy();
      expect(p.walkthrough.length).toBeGreaterThan(0);
      expect(["beginner", "intermediate", "advanced"]).toContain(p.difficulty);
    });
  });
});

describe("concurrencyPatterns topic content", () => {
  it("has correct meta", () => {
    expect(concurrencyPatterns.meta.slug).toBe("concurrency-patterns");
    expect(concurrencyPatterns.meta.number).toBe(24);
    expect(concurrencyPatterns.meta.active).toBe(true);
  });

  it("has ELI5 content with items and takeaways", () => {
    expect(concurrencyPatterns.eli5.analogyTitle).toBeTruthy();
    expect(concurrencyPatterns.eli5.analogy).toBeTruthy();
    expect(concurrencyPatterns.eli5.items.length).toBeGreaterThan(0);
    expect(concurrencyPatterns.eli5.keyTakeaways.length).toBeGreaterThan(0);
  });

  it("has visual content with data types", () => {
    expect(concurrencyPatterns.visuals.dataTypes.length).toBeGreaterThan(0);

    concurrencyPatterns.visuals.dataTypes.forEach((dt) => {
      expect(dt.name).toBeTruthy();
      expect(dt.color).toMatch(/^#/);
      expect(dt.examples.length).toBeGreaterThan(0);
    });
  });

  it("has deep dive sections with prose", () => {
    expect(concurrencyPatterns.deepDive.sections.length).toBeGreaterThanOrEqual(4);
    concurrencyPatterns.deepDive.sections.forEach((section) => {
      expect(section.title).toBeTruthy();
      expect(section.prose.length).toBeGreaterThan(0);
    });
  });

  it("has at least 15 quiz questions", () => {
    expect(concurrencyPatterns.quiz.questions.length).toBeGreaterThanOrEqual(15);
    concurrencyPatterns.quiz.questions.forEach((q) => {
      expect(q.question).toBeTruthy();
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.explanation).toBeTruthy();
      const correct = q.options.filter((o) => o.correct);
      expect(correct).toHaveLength(1);
    });
  });

  it("has 3 practice problems", () => {
    expect(concurrencyPatterns.practice.problems).toHaveLength(3);
    concurrencyPatterns.practice.problems.forEach((p) => {
      expect(p.title).toBeTruthy();
      expect(p.prompt).toBeTruthy();
      expect(p.hints.length).toBeGreaterThan(0);
      expect(p.solution).toBeTruthy();
      expect(p.walkthrough.length).toBeGreaterThan(0);
      expect(["beginner", "intermediate", "advanced"]).toContain(p.difficulty);
    });
  });
});

describe("deployment topic content", () => {
  it("has correct meta", () => {
    expect(deployment.meta.slug).toBe("deployment");
    expect(deployment.meta.number).toBe(25);
    expect(deployment.meta.active).toBe(true);
  });

  it("has ELI5 content with items and takeaways", () => {
    expect(deployment.eli5.analogyTitle).toBeTruthy();
    expect(deployment.eli5.analogy).toBeTruthy();
    expect(deployment.eli5.items.length).toBeGreaterThan(0);
    expect(deployment.eli5.keyTakeaways.length).toBeGreaterThan(0);
  });

  it("has visual content with data types", () => {
    expect(deployment.visuals.dataTypes.length).toBeGreaterThan(0);

    deployment.visuals.dataTypes.forEach((dt) => {
      expect(dt.name).toBeTruthy();
      expect(dt.color).toMatch(/^#/);
      expect(dt.examples.length).toBeGreaterThan(0);
    });
  });

  it("has deep dive sections with prose", () => {
    expect(deployment.deepDive.sections.length).toBeGreaterThanOrEqual(4);
    deployment.deepDive.sections.forEach((section) => {
      expect(section.title).toBeTruthy();
      expect(section.prose.length).toBeGreaterThan(0);
    });
  });

  it("has at least 15 quiz questions", () => {
    expect(deployment.quiz.questions.length).toBeGreaterThanOrEqual(15);
    deployment.quiz.questions.forEach((q) => {
      expect(q.question).toBeTruthy();
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.explanation).toBeTruthy();
      const correct = q.options.filter((o) => o.correct);
      expect(correct).toHaveLength(1);
    });
  });

  it("has 3 practice problems", () => {
    expect(deployment.practice.problems).toHaveLength(3);
    deployment.practice.problems.forEach((p) => {
      expect(p.title).toBeTruthy();
      expect(p.prompt).toBeTruthy();
      expect(p.hints.length).toBeGreaterThan(0);
      expect(p.solution).toBeTruthy();
      expect(p.walkthrough.length).toBeGreaterThan(0);
      expect(["beginner", "intermediate", "advanced"]).toContain(p.difficulty);
    });
  });
});

describe("debuggingAndTooling topic content", () => {
  it("has correct meta", () => {
    expect(debuggingAndTooling.meta.slug).toBe("debugging-and-tooling");
    expect(debuggingAndTooling.meta.number).toBe(29);
    expect(debuggingAndTooling.meta.active).toBe(true);
  });

  it("has ELI5 content with items and takeaways", () => {
    expect(debuggingAndTooling.eli5.analogyTitle).toBeTruthy();
    expect(debuggingAndTooling.eli5.analogy).toBeTruthy();
    expect(debuggingAndTooling.eli5.items.length).toBeGreaterThan(0);
    expect(debuggingAndTooling.eli5.keyTakeaways.length).toBeGreaterThan(0);
  });

  it("has visual content with data types", () => {
    expect(debuggingAndTooling.visuals.dataTypes.length).toBeGreaterThan(0);

    debuggingAndTooling.visuals.dataTypes.forEach((dt) => {
      expect(dt.name).toBeTruthy();
      expect(dt.color).toMatch(/^#/);
      expect(dt.examples.length).toBeGreaterThan(0);
    });
  });

  it("has deep dive sections with prose", () => {
    expect(debuggingAndTooling.deepDive.sections.length).toBeGreaterThanOrEqual(4);
    debuggingAndTooling.deepDive.sections.forEach((section) => {
      expect(section.title).toBeTruthy();
      expect(section.prose.length).toBeGreaterThan(0);
    });
  });

  it("has at least 15 quiz questions", () => {
    expect(debuggingAndTooling.quiz.questions.length).toBeGreaterThanOrEqual(15);
    debuggingAndTooling.quiz.questions.forEach((q) => {
      expect(q.question).toBeTruthy();
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.explanation).toBeTruthy();
      const correct = q.options.filter((o) => o.correct);
      expect(correct).toHaveLength(1);
    });
  });

  it("has 4 practice problems", () => {
    expect(debuggingAndTooling.practice.problems).toHaveLength(4);
    debuggingAndTooling.practice.problems.forEach((p) => {
      expect(p.title).toBeTruthy();
      expect(p.prompt).toBeTruthy();
      expect(p.hints.length).toBeGreaterThan(0);
      expect(p.solution).toBeTruthy();
      expect(p.walkthrough.length).toBeGreaterThan(0);
      expect(["beginner", "intermediate", "advanced"]).toContain(p.difficulty);
    });
  });
});

describe("idiomaticElixir topic content", () => {
  it("has correct meta", () => {
    expect(idiomaticElixir.meta.slug).toBe("idiomatic-elixir");
    expect(idiomaticElixir.meta.number).toBe(26);
    expect(idiomaticElixir.meta.active).toBe(true);
  });

  it("has ELI5 content with items and takeaways", () => {
    expect(idiomaticElixir.eli5.analogyTitle).toBeTruthy();
    expect(idiomaticElixir.eli5.analogy).toBeTruthy();
    expect(idiomaticElixir.eli5.items.length).toBeGreaterThan(0);
    expect(idiomaticElixir.eli5.keyTakeaways.length).toBeGreaterThan(0);
  });

  it("has visual content with data types", () => {
    expect(idiomaticElixir.visuals.dataTypes.length).toBeGreaterThan(0);

    idiomaticElixir.visuals.dataTypes.forEach((dt) => {
      expect(dt.name).toBeTruthy();
      expect(dt.color).toMatch(/^#/);
      expect(dt.examples.length).toBeGreaterThan(0);
    });
  });

  it("has deep dive sections with prose", () => {
    expect(idiomaticElixir.deepDive.sections.length).toBeGreaterThanOrEqual(4);
    idiomaticElixir.deepDive.sections.forEach((section) => {
      expect(section.title).toBeTruthy();
      expect(section.prose.length).toBeGreaterThan(0);
    });
  });

  it("has at least 15 quiz questions", () => {
    expect(idiomaticElixir.quiz.questions.length).toBeGreaterThanOrEqual(15);
    idiomaticElixir.quiz.questions.forEach((q) => {
      expect(q.question).toBeTruthy();
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.explanation).toBeTruthy();
      const correct = q.options.filter((o) => o.correct);
      expect(correct).toHaveLength(1);
    });
  });

  it("has 4 practice problems", () => {
    expect(idiomaticElixir.practice.problems).toHaveLength(4);
    idiomaticElixir.practice.problems.forEach((p) => {
      expect(p.title).toBeTruthy();
      expect(p.prompt).toBeTruthy();
      expect(p.hints.length).toBeGreaterThan(0);
      expect(p.solution).toBeTruthy();
      expect(p.walkthrough.length).toBeGreaterThan(0);
      expect(["beginner", "intermediate", "advanced"]).toContain(p.difficulty);
    });
  });
});
