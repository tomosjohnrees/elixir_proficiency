"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { QuizQuestion as QuizQuestionType } from "@/lib/types";

interface QuizQuestionProps {
  question: QuizQuestionType;
  questionNumber: number;
  onAnswer: (correct: boolean) => void;
}

export default function QuizQuestion({
  question,
  questionNumber,
  onAnswer,
}: QuizQuestionProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const correctIndex = question.options.findIndex((o) => o.correct);

  function handleSelect(index: number) {
    if (revealed) return;
    setSelected(index);
    setRevealed(true);
    onAnswer(index === correctIndex);
  }

  return (
    <div className="border border-border rounded-lg p-5 space-y-4">
      <p className="font-medium">
        <span className="text-accent mr-2">{questionNumber}.</span>
        {question.question}
      </p>
      <div className="space-y-2">
        {question.options.map((option, i) => {
          let style = "border-border hover:border-accent-light hover:bg-surface";
          if (revealed) {
            if (i === correctIndex) {
              style = "border-green-500 bg-green-50 [data-theme='dark']_&:bg-green-950/30";
            } else if (i === selected) {
              style = "border-red-500 bg-red-50 [data-theme='dark']_&:bg-red-950/30";
            } else {
              style = "border-border opacity-50";
            }
          }

          return (
            <motion.button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={revealed}
              whileHover={!revealed ? { scale: 1.01 } : undefined}
              whileTap={!revealed ? { scale: 0.98 } : undefined}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${style} ${
                revealed ? "cursor-default" : "cursor-pointer"
              }`}
            >
              <span className="text-muted mr-2 font-mono text-sm">
                {String.fromCharCode(65 + i)}.
              </span>
              {option.label}
            </motion.button>
          );
        })}
      </div>
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div
              className="rounded-lg px-4 py-3 text-sm"
              style={{ backgroundColor: "var(--surface)", borderLeft: "3px solid var(--accent)" }}
            >
              <span className="font-semibold text-accent">Explanation: </span>
              {question.explanation}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
