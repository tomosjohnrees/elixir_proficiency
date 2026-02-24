import { notFound } from "next/navigation";
import TopicLayout from "@/components/layout/TopicLayout";
import ELI5Section from "@/components/topic-sections/ELI5Section";
import VisualsSection from "@/components/topic-sections/VisualsSection";
import DeepDiveSection from "@/components/topic-sections/DeepDiveSection";
import QuizSection from "@/components/topic-sections/QuizSection";
import PracticeSection from "@/components/topic-sections/PracticeSection";
import GotchasSection from "@/components/topic-sections/GotchasSection";
import TopicNextUp from "@/components/topic-sections/TopicNextUp";

import { courseRegistry, getTopicModules } from "@/data/courses";
import type { TopicContent } from "@/lib/types";

interface TopicPageProps {
  params: Promise<{ courseSlug: string; slug: string }>;
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { courseSlug, slug } = await params;

  const topicModules = getTopicModules(courseSlug);
  const loader = topicModules[slug];
  if (!loader) notFound();

  const { default: topic } = await loader();

  return (
    <TopicLayout title={topic.meta.title} description={topic.meta.description} slug={slug} courseSlug={courseSlug} hasGotchas={!!topic.gotchas}>
      <ELI5Section content={topic.eli5} />
      <VisualsSection content={topic.visuals} />
      <DeepDiveSection content={topic.deepDive} />
      {topic.gotchas && <GotchasSection content={topic.gotchas} />}
      <QuizSection content={topic.quiz} />
      <PracticeSection content={topic.practice} />
      <TopicNextUp slug={slug} courseSlug={courseSlug} />
    </TopicLayout>
  );
}

export async function generateStaticParams() {
  return courseRegistry.flatMap((course) =>
    Object.keys(getTopicModules(course.slug)).map((slug) => ({
      courseSlug: course.slug,
      slug,
    }))
  );
}
