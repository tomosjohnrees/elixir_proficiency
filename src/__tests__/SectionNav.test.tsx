import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SectionNav from "@/components/layout/SectionNav";

describe("SectionNav", () => {
  it("renders all section tabs", () => {
    render(<SectionNav />);
    expect(screen.getByText("ELI5")).toBeInTheDocument();
    expect(screen.getByText("Visuals")).toBeInTheDocument();
    expect(screen.getByText("Deep Dive")).toBeInTheDocument();
    expect(screen.getByText("Quiz")).toBeInTheDocument();
    expect(screen.getByText("Practice")).toBeInTheDocument();
  });

  it("highlights ELI5 as the default active tab", () => {
    render(<SectionNav />);
    const eli5Button = screen.getByText("ELI5");
    expect(eli5Button.className).toContain("border-accent");
    expect(eli5Button.className).toContain("text-accent");
  });

  it("scrolls to section when tab is clicked", async () => {
    const user = userEvent.setup();

    // Create mock section elements
    const section = document.createElement("div");
    section.id = "quiz";
    document.body.appendChild(section);

    render(<SectionNav />);
    await user.click(screen.getByText("Quiz"));

    expect(section.scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
    });

    document.body.removeChild(section);
  });

  it("renders as a nav element", () => {
    render(<SectionNav />);
    expect(document.querySelector("nav")).toBeInTheDocument();
  });
});
