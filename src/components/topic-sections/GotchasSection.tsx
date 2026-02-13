import type { GotchasContent } from "@/lib/types";
import CodeBlock from "@/components/ui/CodeBlock";
import FadeIn from "@/components/ui/FadeIn";

interface GotchasSectionProps {
  content: GotchasContent;
}

export default function GotchasSection({ content }: GotchasSectionProps) {
  return (
    <section id="gotchas" className="scroll-mt-28">
      <FadeIn>
        <h2 className="text-2xl font-bold mb-6">
          <span className="text-accent mr-2">&#9672;</span>
          Common Gotchas
        </h2>
      </FadeIn>

      <div className="space-y-6">
        {content.items.map((gotcha, i) => (
          <FadeIn key={i}>
            <div className="border border-border rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2">{gotcha.title}</h3>
              <p className="leading-relaxed text-foreground/90">
                {gotcha.description}
              </p>
              {gotcha.code && (
                <CodeBlock code={gotcha.code} />
              )}
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
