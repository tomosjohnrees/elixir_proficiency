"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
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
      <AnimatePresence>
        {answered === questions.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="rounded-lg border border-accent bg-accent-faint px-5 py-4 text-center"
          >
            <motion.p
              className="text-lg font-semibold"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              You scored {score} / {questions.length}
            </motion.p>
            <motion.p
              className="text-sm text-muted mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {score === questions.length
                ? "Perfect score!"
                : score >= questions.length * 0.6
                  ? "Good job! Review the explanations for any you missed."
                  : "Review the explanations and try the deep dive section again."}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
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
