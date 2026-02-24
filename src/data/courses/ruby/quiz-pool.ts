import type { TaggedQuizQuestion } from "@/lib/types";
import basicDataTypes from "@/data/courses/ruby/topics/basic-data-types";

const allTopics = [
  basicDataTypes,
];

export const quizPool: TaggedQuizQuestion[] = allTopics.flatMap((topic) =>
  topic.quiz.questions.map((q) => ({
    ...q,
    topicSlug: topic.meta.slug,
    topicTitle: topic.meta.title,
    topicNumber: topic.meta.number,
  }))
);
