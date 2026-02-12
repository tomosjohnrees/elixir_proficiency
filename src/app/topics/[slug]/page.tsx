import { notFound } from "next/navigation";
import TopicLayout from "@/components/layout/TopicLayout";
import ELI5Section from "@/components/topic-sections/ELI5Section";
import VisualsSection from "@/components/topic-sections/VisualsSection";
import DeepDiveSection from "@/components/topic-sections/DeepDiveSection";
import QuizSection from "@/components/topic-sections/QuizSection";
import PracticeSection from "@/components/topic-sections/PracticeSection";

import type { TopicContent } from "@/lib/types";

const topicModules: Record<string, () => Promise<{ default: TopicContent }>> = {
  "basic-data-types": () => import("@/data/topics/basic-data-types"),
  "pattern-matching": () => import("@/data/topics/pattern-matching"),
  "lists-and-tuples": () => import("@/data/topics/lists-and-tuples"),
  "maps-and-structs": () => import("@/data/topics/maps-and-structs"),
  "control-flow": () => import("@/data/topics/control-flow"),
  "functions-and-modules": () => import("@/data/topics/functions-and-modules"),
  "recursion": () => import("@/data/topics/recursion"),
  "enumerables": () => import("@/data/topics/enumerables"),
  "strings-in-depth": () => import("@/data/topics/strings-in-depth"),
  "processes": () => import("@/data/topics/processes"),
  "genserver": () => import("@/data/topics/genserver"),
};

interface TopicPageProps {
  params: Promise<{ slug: string }>;
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { slug } = await params;

  const loader = topicModules[slug];
  if (!loader) notFound();

  const { default: topic } = await loader();

  return (
    <TopicLayout title={topic.meta.title} description={topic.meta.description}>
      <ELI5Section content={topic.eli5} />
      <VisualsSection content={topic.visuals} />
      <DeepDiveSection content={topic.deepDive} />
      <QuizSection content={topic.quiz} />
      <PracticeSection content={topic.practice} />
    </TopicLayout>
  );
}

export async function generateStaticParams() {
  return Object.keys(topicModules).map((slug) => ({ slug }));
}
