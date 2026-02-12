import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PracticeProblem from "@/components/ui/PracticeProblem";
import type { PracticeProblem as PracticeProblemType } from "@/lib/types";

const mockProblem: PracticeProblemType = {
  title: "Test Problem",
  difficulty: "beginner",
  prompt: "Write a solution to this problem.",
  hints: [
    { text: "First hint" },
    { text: "Second hint" },
    { text: "Third hint" },
  ],
  solution: 'answer = "hello"',
  walkthrough: ["Step one explanation", "Step two explanation"],
};

describe("PracticeProblem", () => {
  it("renders the title and problem number", () => {
    render(<PracticeProblem problem={mockProblem} problemNumber={1} />);
    expect(screen.getByText("#1")).toBeInTheDocument();
    expect(screen.getByText("Test Problem")).toBeInTheDocument();
  });

  it("renders the difficulty badge", () => {
    render(<PracticeProblem problem={mockProblem} problemNumber={1} />);
    expect(screen.getByText("beginner")).toBeInTheDocument();
  });

  it("renders the prompt", () => {
    render(<PracticeProblem problem={mockProblem} problemNumber={1} />);
    expect(screen.getByText("Write a solution to this problem.")).toBeInTheDocument();
  });

  it("starts with no hints revealed", () => {
    render(<PracticeProblem problem={mockProblem} problemNumber={1} />);
    expect(screen.queryByText("First hint")).not.toBeInTheDocument();
    expect(screen.getByText("Show hint 1 of 3")).toBeInTheDocument();
  });

  it("reveals hints progressively", async () => {
    const user = userEvent.setup();
    render(<PracticeProblem problem={mockProblem} problemNumber={1} />);

    await user.click(screen.getByText("Show hint 1 of 3"));
    expect(screen.getByText("First hint")).toBeInTheDocument();
    expect(screen.queryByText("Second hint")).not.toBeInTheDocument();
    expect(screen.getByText("Show hint 2 of 3")).toBeInTheDocument();

    await user.click(screen.getByText("Show hint 2 of 3"));
    expect(screen.getByText("Second hint")).toBeInTheDocument();
    expect(screen.getByText("Show hint 3 of 3")).toBeInTheDocument();

    await user.click(screen.getByText("Show hint 3 of 3"));
    expect(screen.getByText("Third hint")).toBeInTheDocument();
    // No more hint button after all revealed
    expect(screen.queryByText(/Show hint/)).not.toBeInTheDocument();
  });

  it("does not show solution initially", () => {
    render(<PracticeProblem problem={mockProblem} problemNumber={1} />);
    expect(screen.getByText("Reveal Solution")).toBeInTheDocument();
    expect(screen.queryByText("Walkthrough:")).not.toBeInTheDocument();
  });

  it("reveals solution and walkthrough on button click", async () => {
    const user = userEvent.setup();
    render(<PracticeProblem problem={mockProblem} problemNumber={1} />);

    await user.click(screen.getByText("Reveal Solution"));

    expect(screen.queryByText("Reveal Solution")).not.toBeInTheDocument();
    expect(screen.getByText("Solution")).toBeInTheDocument();
    expect(screen.getByText("Walkthrough:")).toBeInTheDocument();
    expect(screen.getByText("Step one explanation")).toBeInTheDocument();
    expect(screen.getByText("Step two explanation")).toBeInTheDocument();
  });

  it("renders intermediate difficulty with yellow badge", () => {
    const intermediateProblem = { ...mockProblem, difficulty: "intermediate" as const };
    render(<PracticeProblem problem={intermediateProblem} problemNumber={1} />);
    const badge = screen.getByText("intermediate");
    expect(badge.className).toContain("yellow");
  });

  it("renders advanced difficulty with red badge", () => {
    const advancedProblem = { ...mockProblem, difficulty: "advanced" as const };
    render(<PracticeProblem problem={advancedProblem} problemNumber={1} />);
    const badge = screen.getByText("advanced");
    expect(badge.className).toContain("red");
  });
});
