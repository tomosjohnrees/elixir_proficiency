"use client";

import { useMemo } from "react";
import type { QuizContent } from "@/lib/types";
import Quiz from "@/components/ui/Quiz";

const QUIZ_DISPLAY_COUNT = 4;

function shuffleAndPick<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

interface QuizSectionProps {
  content: QuizContent;
}

export default function QuizSection({ content }: QuizSectionProps) {
  const selected = useMemo(
    () => shuffleAndPick(content.questions, QUIZ_DISPLAY_COUNT),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <section id="quiz" className="scroll-mt-28">
      <h2 className="text-2xl font-bold mb-6">
        <span className="text-accent mr-2">&#9672;</span>
        Quiz
      </h2>
      <Quiz questions={selected} />
    </section>
  );
}
