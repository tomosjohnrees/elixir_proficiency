import type { PracticeContent } from "@/lib/types";
import PracticeProblems from "@/components/ui/PracticeProblems";

interface PracticeSectionProps {
  content: PracticeContent;
}

export default function PracticeSection({ content }: PracticeSectionProps) {
  return (
    <section id="practice" className="scroll-mt-28">
      <h2 className="text-2xl font-bold mb-6">
        <span className="text-accent mr-2">&#9672;</span>
        Practice Problems
      </h2>
      <PracticeProblems problems={content.problems} />
    </section>
  );
}
