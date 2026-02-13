"use client";

import { useState } from "react";
import { highlightElixir } from "@/lib/syntax";

interface CodeBlockProps {
  code: string;
  title?: string;
  output?: string;
}

export default function CodeBlock({ code, title, output }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const highlighted = highlightElixir(code.trim());

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
      <div className="relative group">
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          style={{
            backgroundColor: "var(--code-border)",
            color: "var(--muted)",
          }}
          aria-label="Copy code"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
        <pre
          className="px-4 py-3 overflow-x-auto font-mono text-sm leading-relaxed"
          style={{ backgroundColor: "var(--code-bg)" }}
        >
          <code dangerouslySetInnerHTML={{ __html: highlighted }} />
        </pre>
      </div>
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
