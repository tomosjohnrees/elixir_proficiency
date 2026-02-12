import SectionNav from "./SectionNav";

interface TopicLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function TopicLayout({
  title,
  description,
  children,
}: TopicLayoutProps) {
  return (
    <>
      <SectionNav />
      <main className="max-w-5xl mx-auto px-4 pt-8 pb-24">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-muted text-lg">{description}</p>
        </div>
        <div className="space-y-16">{children}</div>
      </main>
    </>
  );
}
