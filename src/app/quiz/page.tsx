import Link from "next/link";
import { quizPool } from "@/data/quiz-pool";
import RandomQuiz from "@/components/ui/RandomQuiz";

export default function QuizPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link
          href="/"
          className="text-sm text-muted hover:text-accent transition-colors"
        >
          &larr; Back to topics
        </Link>
      </div>
      <RandomQuiz pool={quizPool} />
    </main>
  );
}
