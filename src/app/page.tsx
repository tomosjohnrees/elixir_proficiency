import Link from "next/link";
import { topicRegistry } from "@/data/topics";

export default function Home() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">
          <span className="text-accent">&#9670;</span> Elixir Proficiency
        </h1>
        <p className="text-lg text-muted max-w-2xl mx-auto">
          Master Elixir from zero to proficiency. Each topic builds on the last with
          5 learning stages: ELI5, Visuals, Deep Dive, Quiz, and Practice.
        </p>
      </div>

      <Link
        href="/quiz"
        className="block rounded-xl border-2 border-accent bg-accent-faint p-6 mb-8 hover:shadow-lg transition-all group"
      >
        <div className="flex items-center gap-4">
          <span className="text-3xl">&#9889;</span>
          <div>
            <h2 className="text-lg font-bold group-hover:text-accent transition-colors">
              Random Quiz
            </h2>
            <p className="text-sm text-muted mt-0.5">
              Test yourself with 10 random questions from across all 25 topics
            </p>
          </div>
        </div>
      </Link>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topicRegistry.map((topic) => (
          <div key={topic.slug} className="relative">
            {topic.active ? (
              <Link
                href={`/topics/${topic.slug}`}
                className="block rounded-xl border border-border p-5 hover:border-accent hover:shadow-md transition-all bg-surface group"
              >
                <div className="flex items-start gap-3">
                  <span className="text-sm font-mono text-accent font-bold mt-0.5">
                    {String(topic.number).padStart(2, "0")}
                  </span>
                  <div>
                    <h2 className="font-semibold group-hover:text-accent transition-colors">
                      {topic.title}
                    </h2>
                    <p className="text-sm text-muted mt-1">{topic.description}</p>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="block rounded-xl border border-border p-5 opacity-50 bg-surface">
                <div className="flex items-start gap-3">
                  <span className="text-sm font-mono text-muted font-bold mt-0.5">
                    {String(topic.number).padStart(2, "0")}
                  </span>
                  <div>
                    <h2 className="font-semibold">{topic.title}</h2>
                    <p className="text-sm text-muted mt-1">{topic.description}</p>
                    <span className="inline-block text-xs font-medium text-muted mt-2 px-2 py-0.5 rounded-full bg-surface-2">
                      Coming Soon
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
