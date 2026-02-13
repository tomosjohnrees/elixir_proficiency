import type { DeepDiveContent } from "@/lib/types";
import CodeBlock from "@/components/ui/CodeBlock";
import FadeIn from "@/components/ui/FadeIn";

interface DeepDiveSectionProps {
  content: DeepDiveContent;
}

export default function DeepDiveSection({ content }: DeepDiveSectionProps) {
  return (
    <section id="deep-dive" className="scroll-mt-28">
      <FadeIn>
        <h2 className="text-2xl font-bold mb-6">
          <span className="text-accent mr-2">&#9672;</span>
          Deep Dive
        </h2>
      </FadeIn>

      <div className="space-y-10">
        {content.sections.map((section, i) => (
          <FadeIn key={i}>
            <div>
              <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
              <div className="space-y-3">
                {section.prose.map((p, j) => (
                  <p key={j} className="leading-relaxed text-foreground/90">
                    {p}
                  </p>
                ))}
              </div>
              {section.code && (
                <CodeBlock
                  code={section.code.code}
                  title={section.code.title}
                  output={section.code.output}
                />
              )}
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
