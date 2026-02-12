import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Quiz from "@/components/ui/Quiz";
import type { QuizQuestion } from "@/lib/types";

const questions: QuizQuestion[] = [
  {
    question: "Question one?",
    options: [
      { label: "Wrong" },
      { label: "Correct", correct: true },
    ],
    explanation: "Explanation one.",
  },
  {
    question: "Question two?",
    options: [
      { label: "Right", correct: true },
      { label: "Wrong" },
    ],
    explanation: "Explanation two.",
  },
];

describe("Quiz", () => {
  it("renders all questions", () => {
    render(<Quiz questions={questions} />);
    expect(screen.getByText("Question one?")).toBeInTheDocument();
    expect(screen.getByText("Question two?")).toBeInTheDocument();
  });

  it("does not show score banner before all questions answered", async () => {
    const user = userEvent.setup();
    render(<Quiz questions={questions} />);

    await user.click(screen.getByText("Correct"));
    expect(screen.queryByText(/You scored/)).not.toBeInTheDocument();
  });

  it("shows perfect score when all correct", async () => {
    const user = userEvent.setup();
    render(<Quiz questions={questions} />);

    await user.click(screen.getByText("Correct"));
    await user.click(screen.getByText("Right"));

    expect(screen.getByText("You scored 2 / 2")).toBeInTheDocument();
    expect(screen.getByText("Perfect score!")).toBeInTheDocument();
  });

  it("shows encouraging message for partial score", async () => {
    const user = userEvent.setup();
    render(<Quiz questions={questions} />);

    // "Wrong" appears in both questions, use getAllByText to target the first one
    const wrongButtons = screen.getAllByText("Wrong");
    await user.click(wrongButtons[0]);
    await user.click(screen.getByText("Right"));

    expect(screen.getByText("You scored 1 / 2")).toBeInTheDocument();
    expect(screen.getByText(/Review the explanations/)).toBeInTheDocument();
  });

  it("shows low score message when all wrong", async () => {
    const user = userEvent.setup();
    render(<Quiz questions={questions} />);

    // Click the wrong answers
    const wrongButtons = screen.getAllByText("Wrong");
    await user.click(wrongButtons[0]);
    await user.click(wrongButtons[1]);

    expect(screen.getByText("You scored 0 / 2")).toBeInTheDocument();
    expect(screen.getByText(/deep dive section/)).toBeInTheDocument();
  });
});
