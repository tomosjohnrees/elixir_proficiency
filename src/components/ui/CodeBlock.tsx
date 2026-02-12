import { highlightElixir } from "@/lib/syntax";

interface CodeBlockProps {
  code: string;
  title?: string;
  output?: string;
}

export default function CodeBlock({ code, title, output }: CodeBlockProps) {
  const highlighted = highlightElixir(code.trim());

  return (
    <div className="my-4 rounded-lg border overflow-hidden" style={{ borderColor: "var(--code-border)" }}>
      {title && (
        <div
          className="px-4 py-2 text-sm font-medium border-b"
          style={{
            backgroundColor: "var(--code-bg)",
            borderColor: "var(--code-border)",
            color: "var(--muted)",
          }}
        >
          {title}
        </div>
      )}
      <pre
        className="px-4 py-3 overflow-x-auto font-mono text-sm leading-relaxed"
        style={{ backgroundColor: "var(--code-bg)" }}
      >
        <code dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
      {output && (
        <div
          className="px-4 py-2 border-t font-mono text-sm"
          style={{
            backgroundColor: "var(--output-bg)",
            borderColor: "var(--code-border)",
            color: "var(--muted)",
          }}
        >
          <span className="select-none text-accent mr-2">iex&gt;</span>
          {output}
        </div>
      )}
    </div>
  );
}
