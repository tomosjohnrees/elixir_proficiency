import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import VisualsSection from "@/components/topic-sections/VisualsSection";
import type { VisualsContent } from "@/lib/types";

const mockContent: VisualsContent = {
  dataTypes: [
    {
      name: "Integer",
      color: "#6b46c1",
      examples: ["42", "1_000"],
      description: "Whole numbers",
    },
    {
      name: "Float",
      color: "#2563eb",
      examples: ["3.14"],
      description: "Decimal numbers",
    },
  ],
  operatorGroups: [
    {
      name: "Arithmetic",
      operators: [
        { symbol: "+", description: "Addition" },
        { symbol: "-", description: "Subtraction" },
      ],
    },
  ],
};

describe("VisualsSection", () => {
  it("renders data type cards", () => {
    render(<VisualsSection content={mockContent} />);
    expect(screen.getByText("Integer")).toBeInTheDocument();
    expect(screen.getByText("Float")).toBeInTheDocument();
    expect(screen.getByText("Whole numbers")).toBeInTheDocument();
    expect(screen.getByText("Decimal numbers")).toBeInTheDocument();
  });

  it("renders code examples for data types", () => {
    render(<VisualsSection content={mockContent} />);
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("1_000")).toBeInTheDocument();
    expect(screen.getByText("3.14")).toBeInTheDocument();
  });

  it("renders operator groups", () => {
    render(<VisualsSection content={mockContent} />);
    expect(screen.getByText("Arithmetic")).toBeInTheDocument();
    expect(screen.getByText("+")).toBeInTheDocument();
    expect(screen.getByText("Addition")).toBeInTheDocument();
    expect(screen.getByText("-")).toBeInTheDocument();
    expect(screen.getByText("Subtraction")).toBeInTheDocument();
  });

  it("applies border color from data type color", () => {
    const { container } = render(<VisualsSection content={mockContent} />);
    const cards = container.querySelectorAll(".rounded-xl.border-2");
    expect(cards[0]).toHaveStyle({ borderColor: "#6b46c1" });
    expect(cards[1]).toHaveStyle({ borderColor: "#2563eb" });
  });

  it("has the correct section id", () => {
    const { container } = render(<VisualsSection content={mockContent} />);
    expect(container.querySelector("#visuals")).toBeInTheDocument();
  });
});
