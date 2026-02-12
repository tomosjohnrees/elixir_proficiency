import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QuizQuestion from "@/components/ui/QuizQuestion";
import type { QuizQuestion as QuizQuestionType } from "@/lib/types";

const mockQuestion: QuizQuestionType = {
  question: "What does 10 / 3 return?",
  options: [
    { label: "3" },
    { label: "3.33", correct: true },
    { label: "An error" },
    { label: "nil" },
  ],
  explanation: "Division always returns a float.",
};

describe("QuizQuestion", () => {
  it("renders the question text", () => {
    render(<QuizQuestion question={mockQuestion} questionNumber={1} onAnswer={vi.fn()} />);
    expect(screen.getByText("What does 10 / 3 return?")).toBeInTheDocument();
  });

  it("renders the question number", () => {
    render(<QuizQuestion question={mockQuestion} questionNumber={3} onAnswer={vi.fn()} />);
    expect(screen.getByText("3.")).toBeInTheDocument();
  });

  it("renders all options with letter labels", () => {
    render(<QuizQuestion question={mockQuestion} questionNumber={1} onAnswer={vi.fn()} />);
    expect(screen.getByText("A.")).toBeInTheDocument();
    expect(screen.getByText("B.")).toBeInTheDocument();
    expect(screen.getByText("C.")).toBeInTheDocument();
    expect(screen.getByText("D.")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("3.33")).toBeInTheDocument();
    expect(screen.getByText("An error")).toBeInTheDocument();
    expect(screen.getByText("nil")).toBeInTheDocument();
  });

  it("calls onAnswer with true when correct answer selected", async () => {
    const user = userEvent.setup();
    const onAnswer = vi.fn();
    render(<QuizQuestion question={mockQuestion} questionNumber={1} onAnswer={onAnswer} />);

    await user.click(screen.getByText("3.33"));
    expect(onAnswer).toHaveBeenCalledWith(true);
  });

  it("calls onAnswer with false when wrong answer selected", async () => {
    const user = userEvent.setup();
    const onAnswer = vi.fn();
    render(<QuizQuestion question={mockQuestion} questionNumber={1} onAnswer={onAnswer} />);

    await user.click(screen.getByText("An error"));
    expect(onAnswer).toHaveBeenCalledWith(false);
  });

  it("shows explanation after answering", async () => {
    const user = userEvent.setup();
    render(<QuizQuestion question={mockQuestion} questionNumber={1} onAnswer={vi.fn()} />);

    expect(screen.queryByText("Division always returns a float.")).not.toBeInTheDocument();

    await user.click(screen.getByText("3.33"));
    expect(screen.getByText("Division always returns a float.")).toBeInTheDocument();
  });

  it("disables further selection after answering", async () => {
    const user = userEvent.setup();
    const onAnswer = vi.fn();
    render(<QuizQuestion question={mockQuestion} questionNumber={1} onAnswer={onAnswer} />);

    await user.click(screen.getByText("3.33"));
    await user.click(screen.getByText("An error"));

    // onAnswer should only have been called once
    expect(onAnswer).toHaveBeenCalledTimes(1);
  });
});
