"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import type { TaggedQuizQuestion } from "@/lib/types";
import QuizQuestion from "./QuizQuestion";

type Phase = "intro" | "active" | "results";

interface Answer {
  correct: boolean;
  topicSlug: string;
  topicTitle: string;
  topicNumber: number;
}

interface TopicToReview {
  slug: string;
  title: string;
  number: number;
  wrong: number;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function RandomQuiz({ pool }: { pool: TaggedQuizQuestion[] }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [questions, setQuestions] = useState<TaggedQuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [answered, setAnswered] = useState(false);

  const startQuiz = useCallback(() => {
    setQuestions(shuffle(pool).slice(0, 10));
    setCurrentIndex(0);
    setAnswers([]);
    setAnswered(false);
    setPhase("active");
  }, [pool]);

  function handleAnswer(correct: boolean) {
    const q = questions[currentIndex];
    setAnswers((prev) => [
      ...prev,
      {
        correct,
        topicSlug: q.topicSlug,
        topicTitle: q.topicTitle,
        topicNumber: q.topicNumber,
      },
    ]);
    setAnswered(true);
  }

  function handleNext() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setAnswered(false);
    } else {
      setPhase("results");
    }
  }

  const score = answers.filter((a) => a.correct).length;
  const wrongByTopic = new Map<string, TopicToReview>();
  for (const a of answers) {
    if (!a.correct) {
      const existing = wrongByTopic.get(a.topicSlug);
      if (existing) {
        existing.wrong++;
      } else {
        wrongByTopic.set(a.topicSlug, {
          slug: a.topicSlug,
          title: a.topicTitle,
          number: a.topicNumber,
          wrong: 1,
        });
      }
    }
  }
  const topicsToReview = Array.from(wrongByTopic.values()).sort(
    (a, b) => a.number - b.number
  );

  return (
    <AnimatePresence mode="wait">
      {phase === "intro" && (
        <motion.div
          key="intro"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-center py-12"
        >
          <motion.div
            className="text-5xl mb-6"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            &#9889;
          </motion.div>
          <h2 className="text-2xl font-bold mb-3">Random Quiz</h2>
          <p className="text-muted max-w-md mx-auto mb-8">
            Test your Elixir knowledge with 10 random questions drawn from all 25
            topics. See how much you really know!
          </p>
          <motion.button
            onClick={startQuiz}
            className="px-6 py-3 rounded-lg bg-accent text-white font-semibold hover:opacity-90 transition-opacity cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Quiz
          </motion.button>
        </motion.div>
      )}

      {phase === "active" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted">
              Question {currentIndex + 1} of {questions.length}
            </p>
            <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-accent-faint text-accent">
              {questions[currentIndex].topicTitle}
            </span>
          </div>

          <div className="w-full bg-surface-2 rounded-full h-1.5">
            <motion.div
              className="bg-accent h-1.5 rounded-full"
              initial={false}
              animate={{
                width: `${((currentIndex + (answered ? 1 : 0)) / questions.length) * 100}%`,
              }}
              transition={{ type: "spring", stiffness: 200, damping: 30 }}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <QuizQuestion
                key={currentIndex}
                question={questions[currentIndex]}
                questionNumber={currentIndex + 1}
                onAnswer={handleAnswer}
              />

              <AnimatePresence>
                {answered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-right"
                  >
                    <motion.button
                      onClick={handleNext}
                      className="px-5 py-2.5 rounded-lg bg-accent text-white font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {currentIndex < questions.length - 1
                        ? "Next Question"
                        : "See Results"}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {phase === "results" && (
        <motion.div
          key="results"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8"
        >
          <motion.div
            className="rounded-lg border border-accent bg-accent-faint px-6 py-8 text-center"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
          >
            <motion.p
              className="text-3xl font-bold mb-2"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            >
              {score} / {answers.length}
            </motion.p>
            <motion.p
              className="text-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              {score === answers.length
                ? "Perfect score! You really know your Elixir!"
                : score >= answers.length * 0.7
                  ? "Great job! Just a few areas to brush up on."
                  : score >= answers.length * 0.4
                    ? "Good effort! Review the topics below to improve."
                    : "Keep studying! The topics below will help you improve."}
            </motion.p>
          </motion.div>

          {topicsToReview.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Topics to Review</h3>
              <div className="space-y-2">
                {topicsToReview.map((t, i) => (
                  <motion.div
                    key={t.slug}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                  >
                    <Link
                      href={`/topics/${t.slug}`}
                      className="flex items-center justify-between rounded-lg border border-border p-4 hover:border-accent hover:shadow-md transition-all bg-surface group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono text-accent font-bold">
                          {String(t.number).padStart(2, "0")}
                        </span>
                        <span className="font-medium group-hover:text-accent transition-colors">
                          {t.title}
                        </span>
                      </div>
                      <span className="text-sm text-muted">
                        {t.wrong} wrong
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center pt-4">
            <motion.button
              onClick={startQuiz}
              className="px-6 py-3 rounded-lg bg-accent text-white font-semibold hover:opacity-90 transition-opacity cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Again
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
