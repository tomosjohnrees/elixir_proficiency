"use client";

import { useState } from "react";
import type { PracticeProblem as PracticeProblemType } from "@/lib/types";
import CodeBlock from "./CodeBlock";

interface PracticeProblemProps {
  problem: PracticeProblemType;
  problemNumber: number;
}

const difficultyColors: Record<string, string> = {
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-yellow-100 text-yellow-800",
  advanced: "bg-red-100 text-red-800",
};

export default function PracticeProblem({
  problem,
  problemNumber,
}: PracticeProblemProps) {
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [solutionRevealed, setSolutionRevealed] = useState(false);

  return (
    <div className="border border-border rounded-lg p-5 space-y-4">
      <div className="flex items-center gap-3">
        <h3 className="font-semibold text-lg">
          <span className="text-accent mr-2">#{problemNumber}</span>
          {problem.title}
        </h3>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${difficultyColors[problem.difficulty]}`}
        >
          {problem.difficulty}
        </span>
      </div>

      <p className="text-foreground/90">{problem.prompt}</p>

      {/* Hints */}
      <div className="space-y-2">
        {problem.hints.slice(0, hintsRevealed).map((hint, i) => (
          <div
            key={i}
            className="rounded-lg px-4 py-2 text-sm"
            style={{ backgroundColor: "var(--surface)" }}
          >
            <span className="font-medium text-accent">Hint {i + 1}: </span>
            {hint.text}
          </div>
        ))}
        {hintsRevealed < problem.hints.length && (
          <button
            onClick={() => setHintsRevealed((h) => h + 1)}
            className="text-sm text-accent hover:text-accent-light transition-colors font-medium"
          >
            Show hint {hintsRevealed + 1} of {problem.hints.length}
          </button>
        )}
      </div>

      {/* Solution */}
      {!solutionRevealed ? (
        <button
          onClick={() => setSolutionRevealed(true)}
          className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Reveal Solution
        </button>
      ) : (
        <div className="space-y-3">
          <CodeBlock code={problem.solution} title="Solution" />
          <div className="space-y-2">
            <p className="font-medium text-sm">Walkthrough:</p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-foreground/80">
              {problem.walkthrough.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
