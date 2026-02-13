import type { ELI5Content } from "@/lib/types";
import FadeIn from "@/components/ui/FadeIn";

interface ELI5SectionProps {
  content: ELI5Content;
}

export default function ELI5Section({ content }: ELI5SectionProps) {
  return (
    <section id="eli5" className="scroll-mt-28">
      <FadeIn>
        <h2 className="text-2xl font-bold mb-6">
          <span className="text-accent mr-2">&#9672;</span>
          ELI5: {content.analogyTitle}
        </h2>
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="rounded-xl border border-border bg-surface p-6 mb-6">
          <p className="text-lg leading-relaxed">{content.analogy}</p>
        </div>
      </FadeIn>

      <div className="grid gap-3 sm:grid-cols-2 mb-6">
        {content.items.map((item, i) => (
          <FadeIn key={i} delay={0.1 + i * 0.04}>
            <div className="rounded-lg border border-border p-4 bg-surface">
              <span className="font-semibold text-accent">{item.label}</span>
              <p className="text-sm text-muted mt-1">{item.description}</p>
            </div>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={0.15}>
        <div className="rounded-lg bg-accent-faint border border-accent/20 p-5">
          <h3 className="font-semibold mb-3">Key Takeaways</h3>
          <ul className="space-y-2">
            {content.keyTakeaways.map((t, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <span className="text-accent mt-0.5">&#10003;</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </FadeIn>
    </section>
  );
}
