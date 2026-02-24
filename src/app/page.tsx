import Link from "next/link";
import { courseRegistry } from "@/data/courses";

export default function Home() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">
          <span className="text-accent">&#9670;</span> Code Proficiency
        </h1>
        <p className="text-lg text-muted max-w-2xl mx-auto">
          Master programming languages and concepts through interactive lessons.
          Each course features progressive topics with ELI5, Visuals, Deep Dive, Quiz, and Practice.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courseRegistry.map((course) => (
          <Link
            key={course.slug}
            href={`/${course.slug}`}
            className="block rounded-xl border border-border p-6 hover:border-accent hover:shadow-md transition-all bg-surface group"
          >
            <span className="text-3xl">{course.icon}</span>
            <h2 className="text-xl font-bold mt-3 group-hover:text-accent transition-colors">
              {course.title}
            </h2>
            <p className="text-sm text-muted mt-2">{course.description}</p>
            <p className="text-xs text-accent mt-3 font-medium">
              {course.topicCount} topics
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
