import type { QuizContent } from "@/lib/types";
import Quiz from "@/components/ui/Quiz";

interface QuizSectionProps {
  content: QuizContent;
}

export default function QuizSection({ content }: QuizSectionProps) {
  return (
    <section id="quiz" className="scroll-mt-28">
      <h2 className="text-2xl font-bold mb-6">
        <span className="text-accent mr-2">&#9672;</span>
        Quiz
      </h2>
      <Quiz questions={content.questions} />
    </section>
  );
}
