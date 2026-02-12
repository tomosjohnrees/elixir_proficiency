import type { PracticeProblem as PracticeProblemType } from "@/lib/types";
import PracticeProblem from "./PracticeProblem";

interface PracticeProblemsProps {
  problems: PracticeProblemType[];
}

export default function PracticeProblems({ problems }: PracticeProblemsProps) {
  return (
    <div className="space-y-6">
      {problems.map((p, i) => (
        <PracticeProblem key={i} problem={p} problemNumber={i + 1} />
      ))}
    </div>
  );
}
