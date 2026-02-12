import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ELI5Section from "@/components/topic-sections/ELI5Section";
import type { ELI5Content } from "@/lib/types";

const mockContent: ELI5Content = {
  analogyTitle: "The Toy Box",
  analogy: "Imagine you have a box of toys.",
  items: [
    { label: "Type A", description: "Description of type A" },
    { label: "Type B", description: "Description of type B" },
  ],
  keyTakeaways: ["Takeaway one", "Takeaway two"],
};

describe("ELI5Section", () => {
  it("renders the analogy title", () => {
    render(<ELI5Section content={mockContent} />);
    expect(screen.getByText(/The Toy Box/)).toBeInTheDocument();
  });

  it("renders the analogy text", () => {
    render(<ELI5Section content={mockContent} />);
    expect(screen.getByText("Imagine you have a box of toys.")).toBeInTheDocument();
  });

  it("renders all items", () => {
    render(<ELI5Section content={mockContent} />);
    expect(screen.getByText("Type A")).toBeInTheDocument();
    expect(screen.getByText("Description of type A")).toBeInTheDocument();
    expect(screen.getByText("Type B")).toBeInTheDocument();
    expect(screen.getByText("Description of type B")).toBeInTheDocument();
  });

  it("renders key takeaways", () => {
    render(<ELI5Section content={mockContent} />);
    expect(screen.getByText("Takeaway one")).toBeInTheDocument();
    expect(screen.getByText("Takeaway two")).toBeInTheDocument();
  });

  it("has the correct section id for scroll navigation", () => {
    const { container } = render(<ELI5Section content={mockContent} />);
    const section = container.querySelector("#eli5");
    expect(section).toBeInTheDocument();
  });
});
