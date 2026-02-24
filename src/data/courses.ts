import type { CourseMeta, TopicMeta, TaggedQuizQuestion, TopicGraph } from "@/lib/types";
import type { TopicContent } from "@/lib/types";
import { topicRegistry as elixirTopics } from "@/data/courses/elixir/topics";
import { quizPool as elixirQuizPool } from "@/data/courses/elixir/quiz-pool";
import {
  topicGraph as elixirTopicGraph,
  categoryMeta as elixirCategoryMeta,
  categoryOrder as elixirCategoryOrder,
  getPrerequisites as elixirGetPrerequisites,
  getNextTopics as elixirGetNextTopics,
  getTopicBySlug as elixirGetTopicBySlug,
  getTopicCategory as elixirGetTopicCategory,
  getEdgeStrength as elixirGetEdgeStrength,
} from "@/data/courses/elixir/topic-relationships";

export const courseRegistry: CourseMeta[] = [
  {
    slug: "elixir",
    title: "Elixir",
    description: "Master Elixir from zero to proficiency through interactive lessons",
    icon: "\u25C6",
    topicCount: 30,
  },
];

export function getCourse(slug: string): CourseMeta | undefined {
  return courseRegistry.find((c) => c.slug === slug);
}

export function getTopicRegistry(courseSlug: string): TopicMeta[] {
  switch (courseSlug) {
    case "elixir":
      return elixirTopics;
    default:
      return [];
  }
}

export function getQuizPool(courseSlug: string): TaggedQuizQuestion[] {
  switch (courseSlug) {
    case "elixir":
      return elixirQuizPool;
    default:
      return [];
  }
}

export function getTopicGraph(courseSlug: string): TopicGraph | null {
  switch (courseSlug) {
    case "elixir":
      return elixirTopicGraph;
    default:
      return null;
  }
}

export function getCourseRelationships(courseSlug: string) {
  switch (courseSlug) {
    case "elixir":
      return {
        topicGraph: elixirTopicGraph,
        categoryMeta: elixirCategoryMeta,
        categoryOrder: elixirCategoryOrder,
        getPrerequisites: elixirGetPrerequisites,
        getNextTopics: elixirGetNextTopics,
        getTopicBySlug: elixirGetTopicBySlug,
        getTopicCategory: elixirGetTopicCategory,
        getEdgeStrength: elixirGetEdgeStrength,
      };
    default:
      return null;
  }
}

export function getTopicModules(
  courseSlug: string
): Record<string, () => Promise<{ default: TopicContent }>> {
  switch (courseSlug) {
    case "elixir":
      return {
        "basic-data-types": () => import("@/data/courses/elixir/topics/basic-data-types"),
        "pattern-matching": () => import("@/data/courses/elixir/topics/pattern-matching"),
        "lists-and-tuples": () => import("@/data/courses/elixir/topics/lists-and-tuples"),
        "maps-and-structs": () => import("@/data/courses/elixir/topics/maps-and-structs"),
        "control-flow": () => import("@/data/courses/elixir/topics/control-flow"),
        "functions-and-modules": () => import("@/data/courses/elixir/topics/functions-and-modules"),
        "recursion": () => import("@/data/courses/elixir/topics/recursion"),
        "enumerables": () => import("@/data/courses/elixir/topics/enumerables"),
        "strings-in-depth": () => import("@/data/courses/elixir/topics/strings-in-depth"),
        "processes": () => import("@/data/courses/elixir/topics/processes"),
        "genserver": () => import("@/data/courses/elixir/topics/genserver"),
        "supervisors": () => import("@/data/courses/elixir/topics/supervisors"),
        "mix-and-otp": () => import("@/data/courses/elixir/topics/mix-and-otp"),
        "testing": () => import("@/data/courses/elixir/topics/testing"),
        "protocols": () => import("@/data/courses/elixir/topics/protocols"),
        "behaviours": () => import("@/data/courses/elixir/topics/behaviours"),
        "macros": () => import("@/data/courses/elixir/topics/macros"),
        "error-handling": () => import("@/data/courses/elixir/topics/error-handling"),
        "comprehensions": () => import("@/data/courses/elixir/topics/comprehensions"),
        "sigils": () => import("@/data/courses/elixir/topics/sigils"),
        "ecto-basics": () => import("@/data/courses/elixir/topics/ecto-basics"),
        "phoenix-basics": () => import("@/data/courses/elixir/topics/phoenix-basics"),
        "liveview": () => import("@/data/courses/elixir/topics/liveview"),
        "concurrency-patterns": () => import("@/data/courses/elixir/topics/concurrency-patterns"),
        "deployment": () => import("@/data/courses/elixir/topics/deployment"),
        "debugging-and-tooling": () => import("@/data/courses/elixir/topics/debugging-and-tooling"),
        "idiomatic-elixir": () => import("@/data/courses/elixir/topics/idiomatic-elixir"),
        "ets": () => import("@/data/courses/elixir/topics/ets"),
        "typespecs-and-dialyzer": () => import("@/data/courses/elixir/topics/typespecs-and-dialyzer"),
        "guards-in-depth": () => import("@/data/courses/elixir/topics/guards-in-depth"),
      };
    default:
      return {};
  }
}
