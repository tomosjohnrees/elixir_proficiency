import { notFound } from "next/navigation";
import { courseRegistry, getCourse, getTopicRegistry } from "@/data/courses";
import CoursePageContent from "@/components/CoursePageContent";

interface CoursePageProps {
  params: Promise<{ courseSlug: string }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { courseSlug } = await params;
  const course = getCourse(courseSlug);
  if (!course) notFound();

  const topicRegistry = getTopicRegistry(courseSlug);

  return (
    <CoursePageContent
      course={course}
      courseSlug={courseSlug}
      topicRegistry={topicRegistry}
    />
  );
}

export async function generateStaticParams() {
  return courseRegistry.map((course) => ({
    courseSlug: course.slug,
  }));
}
