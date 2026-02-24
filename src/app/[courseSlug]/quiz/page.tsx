import { notFound } from "next/navigation";
import Link from "next/link";
import { getCourse, getQuizPool, courseRegistry } from "@/data/courses";
import RandomQuiz from "@/components/ui/RandomQuiz";

interface QuizPageProps {
  params: Promise<{ courseSlug: string }>;
}

export default async function QuizPage({ params }: QuizPageProps) {
  const { courseSlug } = await params;

  const course = getCourse(courseSlug);
  if (!course) notFound();

  const quizPool = getQuizPool(courseSlug);

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link
          href={`/${courseSlug}`}
          className="text-sm text-muted hover:text-accent transition-colors"
        >
          &larr; Back to topics
        </Link>
      </div>
      <RandomQuiz pool={quizPool} courseSlug={courseSlug} />
    </main>
  );
}

export async function generateStaticParams() {
  return courseRegistry.map((course) => ({
    courseSlug: course.slug,
  }));
}
