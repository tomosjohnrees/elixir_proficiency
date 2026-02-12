"use client";

import { useState } from "react";
import type { QuizQuestion as QuizQuestionType } from "@/lib/types";
import QuizQuestion from "./QuizQuestion";

interface QuizProps {
  questions: QuizQuestionType[];
}

export default function Quiz({ questions }: QuizProps) {
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);

  function handleAnswer(correct: boolean) {
    if (correct) setScore((s) => s + 1);
    setAnswered((a) => a + 1);
  }

  return (
    <div className="space-y-6">
      {answered === questions.length && (
        <div className="rounded-lg border border-accent bg-accent-faint px-5 py-4 text-center">
          <p className="text-lg font-semibold">
            You scored {score} / {questions.length}
          </p>
          <p className="text-sm text-muted mt-1">
            {score === questions.length
              ? "Perfect score!"
              : score >= questions.length * 0.6
                ? "Good job! Review the explanations for any you missed."
                : "Review the explanations and try the deep dive section again."}
          </p>
        </div>
      )}
      {questions.map((q, i) => (
        <QuizQuestion
          key={i}
          question={q}
          questionNumber={i + 1}
          onAnswer={handleAnswer}
        />
      ))}
    </div>
  );
}
