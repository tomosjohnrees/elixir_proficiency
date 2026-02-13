import type { VisualsContent } from "@/lib/types";
import AnimationContainer from "@/components/ui/AnimationContainer";

interface VisualsSectionProps {
  content: VisualsContent;
}

export default function VisualsSection({ content }: VisualsSectionProps) {
  return (
    <section id="visuals" className="scroll-mt-28">
      <h2 className="text-2xl font-bold mb-6">
        <span className="text-accent mr-2">&#9672;</span>
        Visual Reference
      </h2>

      {/* Animated Visuals */}
      {content.animations?.map((anim, i) => (
        <div key={i} className="mb-8">
          <AnimationContainer
            cycleDuration={anim.duration}
            aspectRatio="800 / 460"
          >
            <anim.component />
          </AnimationContainer>
        </div>
      ))}
      {!content.animations && content.animation && content.animationDuration && (
        <div className="mb-8">
          <AnimationContainer
            cycleDuration={content.animationDuration}
            aspectRatio="800 / 460"
          >
            <content.animation />
          </AnimationContainer>
        </div>
      )}
      {!content.animations && content.animation && !content.animationDuration && (
        <div className="mb-8">
          <content.animation />
        </div>
      )}

      {/* Data Type Cards */}
      <h3 className="text-lg font-semibold mb-4">Data Types</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        {content.dataTypes.map((dt, i) => (
          <div
            key={i}
            className="rounded-xl border-2 p-5 space-y-3"
            style={{ borderColor: dt.color }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: dt.color }}
              />
              <h4 className="font-bold">{dt.name}</h4>
            </div>
            <p className="text-sm text-muted">{dt.description}</p>
            <div className="flex flex-wrap gap-2">
              {dt.examples.map((ex, j) => (
                <code
                  key={j}
                  className="text-xs font-mono px-2 py-1 rounded"
                  style={{ backgroundColor: "var(--code-bg)" }}
                >
                  {ex}
                </code>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Operator Groups */}
      <h3 className="text-lg font-semibold mb-4">Operators</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {content.operatorGroups.map((group, i) => (
          <div key={i} className="rounded-lg border border-border p-4">
            <h4 className="font-semibold text-accent mb-3">{group.name}</h4>
            <div className="space-y-2">
              {group.operators.map((op, j) => (
                <div key={j} className="flex items-center gap-3 text-sm">
                  <code
                    className="font-mono font-bold text-base w-12 text-center"
                    style={{ color: "var(--syn-operator)" }}
                  >
                    {op.symbol}
                  </code>
                  <span className="text-muted">{op.description}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
