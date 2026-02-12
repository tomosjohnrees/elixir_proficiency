"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
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

  if (phase === "intro") {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-6">&#9889;</div>
        <h2 className="text-2xl font-bold mb-3">Random Quiz</h2>
        <p className="text-muted max-w-md mx-auto mb-8">
          Test your Elixir knowledge with 10 random questions drawn from all 25
          topics. See how much you really know!
        </p>
        <button
          onClick={startQuiz}
          className="px-6 py-3 rounded-lg bg-accent text-white font-semibold hover:opacity-90 transition-opacity cursor-pointer"
        >
          Start Quiz
        </button>
      </div>
    );
  }

  if (phase === "active") {
    const q = questions[currentIndex];
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted">
            Question {currentIndex + 1} of {questions.length}
          </p>
          <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-accent-faint text-accent">
            {q.topicTitle}
          </span>
        </div>

        <div className="w-full bg-surface-2 rounded-full h-1.5">
          <div
            className="bg-accent h-1.5 rounded-full transition-all"
            style={{
              width: `${((currentIndex + (answered ? 1 : 0)) / questions.length) * 100}%`,
            }}
          />
        </div>

        <QuizQuestion
          key={currentIndex}
          question={q}
          questionNumber={currentIndex + 1}
          onAnswer={handleAnswer}
        />

        {answered && (
          <div className="text-right">
            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-lg bg-accent text-white font-semibold hover:opacity-90 transition-opacity cursor-pointer"
            >
              {currentIndex < questions.length - 1
                ? "Next Question"
                : "See Results"}
            </button>
          </div>
        )}
      </div>
    );
  }

  // Results phase
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
    <div className="space-y-8">
      <div className="rounded-lg border border-accent bg-accent-faint px-6 py-8 text-center">
        <p className="text-3xl font-bold mb-2">
          {score} / {answers.length}
        </p>
        <p className="text-muted">
          {score === answers.length
            ? "Perfect score! You really know your Elixir!"
            : score >= answers.length * 0.7
              ? "Great job! Just a few areas to brush up on."
              : score >= answers.length * 0.4
                ? "Good effort! Review the topics below to improve."
                : "Keep studying! The topics below will help you improve."}
        </p>
      </div>

      {topicsToReview.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Topics to Review</h3>
          <div className="space-y-2">
            {topicsToReview.map((t) => (
              <Link
                key={t.slug}
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
            ))}
          </div>
        </div>
      )}

      <div className="text-center pt-4">
        <button
          onClick={startQuiz}
          className="px-6 py-3 rounded-lg bg-accent text-white font-semibold hover:opacity-90 transition-opacity cursor-pointer"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
