import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DeepDiveSection from "@/components/topic-sections/DeepDiveSection";
import type { DeepDiveContent } from "@/lib/types";

const mockContent: DeepDiveContent = {
  sections: [
    {
      title: "Integers",
      prose: ["Integers are whole numbers.", "They have arbitrary precision."],
      code: {
        title: "Integer examples",
        code: "x = 42",
        output: "42",
      },
    },
    {
      title: "Floats",
      prose: ["Floats are decimal numbers."],
    },
  ],
};

describe("DeepDiveSection", () => {
  it("renders section titles", () => {
    render(<DeepDiveSection content={mockContent} />);
    expect(screen.getByText("Integers")).toBeInTheDocument();
    expect(screen.getByText("Floats")).toBeInTheDocument();
  });

  it("renders prose paragraphs", () => {
    render(<DeepDiveSection content={mockContent} />);
    expect(screen.getByText("Integers are whole numbers.")).toBeInTheDocument();
    expect(screen.getByText("They have arbitrary precision.")).toBeInTheDocument();
    expect(screen.getByText("Floats are decimal numbers.")).toBeInTheDocument();
  });

  it("renders code blocks when code is provided", () => {
    render(<DeepDiveSection content={mockContent} />);
    expect(screen.getByText("Integer examples")).toBeInTheDocument();
    // "42" appears in both the code and the output, so just check a pre exists
    const pre = document.querySelector("pre");
    expect(pre).toBeInTheDocument();
    expect(pre?.textContent).toContain("42");
  });

  it("does not render code block when no code is provided", () => {
    const noCodeContent: DeepDiveContent = {
      sections: [{ title: "No Code", prose: ["Just text."] }],
    };
    render(<DeepDiveSection content={noCodeContent} />);
    expect(screen.getByText("Just text.")).toBeInTheDocument();
    // No pre elements since no code
    expect(document.querySelector("pre")).not.toBeInTheDocument();
  });

  it("has the correct section id", () => {
    const { container } = render(<DeepDiveSection content={mockContent} />);
    expect(container.querySelector("#deep-dive")).toBeInTheDocument();
  });
});
