import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { quizPool } from "@/data/courses/elixir/quiz-pool";
import RandomQuiz from "@/components/ui/RandomQuiz";

// Mock next/link to render as plain anchor
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("quizPool", () => {
  it("has at least 375 tagged questions (25 topics x 15+ questions)", () => {
    expect(quizPool.length).toBeGreaterThanOrEqual(375);
  });

  it("each question has topic metadata", () => {
    quizPool.forEach((q) => {
      expect(q.topicSlug).toBeTruthy();
      expect(q.topicTitle).toBeTruthy();
      expect(typeof q.topicNumber).toBe("number");
      expect(q.question).toBeTruthy();
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.explanation).toBeTruthy();
    });
  });

  it("covers all 25 topics", () => {
    const topics = new Set(quizPool.map((q) => q.topicSlug));
    expect(topics.size).toBe(25);
  });
});

describe("RandomQuiz component", () => {
  // Use a small deterministic pool for component tests
  const testPool = [
    {
      question: "Question about topic A?",
      options: [
        { label: "Wrong", correct: false },
        { label: "Right", correct: true },
        { label: "Also wrong", correct: false },
      ],
      explanation: "Because Right is right.",
      topicSlug: "topic-a",
      topicTitle: "Topic A",
      topicNumber: 1,
    },
    {
      question: "Question about topic B?",
      options: [
        { label: "Correct", correct: true },
        { label: "Incorrect", correct: false },
      ],
      explanation: "Because Correct is correct.",
      topicSlug: "topic-b",
      topicTitle: "Topic B",
      topicNumber: 2,
    },
    {
      question: "Another question about A?",
      options: [
        { label: "Nope", correct: false },
        { label: "Yes", correct: true },
      ],
      explanation: "Yes is the answer.",
      topicSlug: "topic-a",
      topicTitle: "Topic A",
      topicNumber: 1,
    },
    {
      question: "Question about topic C?",
      options: [
        { label: "C answer", correct: true },
        { label: "Not C", correct: false },
      ],
      explanation: "C is the answer.",
      topicSlug: "topic-c",
      topicTitle: "Topic C",
      topicNumber: 3,
    },
    {
      question: "Q5?",
      options: [
        { label: "Yes5", correct: true },
        { label: "No5", correct: false },
      ],
      explanation: "Explanation 5.",
      topicSlug: "topic-a",
      topicTitle: "Topic A",
      topicNumber: 1,
    },
    {
      question: "Q6?",
      options: [
        { label: "Yes6", correct: true },
        { label: "No6", correct: false },
      ],
      explanation: "Explanation 6.",
      topicSlug: "topic-b",
      topicTitle: "Topic B",
      topicNumber: 2,
    },
    {
      question: "Q7?",
      options: [
        { label: "Yes7", correct: true },
        { label: "No7", correct: false },
      ],
      explanation: "Explanation 7.",
      topicSlug: "topic-c",
      topicTitle: "Topic C",
      topicNumber: 3,
    },
    {
      question: "Q8?",
      options: [
        { label: "Yes8", correct: true },
        { label: "No8", correct: false },
      ],
      explanation: "Explanation 8.",
      topicSlug: "topic-a",
      topicTitle: "Topic A",
      topicNumber: 1,
    },
    {
      question: "Q9?",
      options: [
        { label: "Yes9", correct: true },
        { label: "No9", correct: false },
      ],
      explanation: "Explanation 9.",
      topicSlug: "topic-b",
      topicTitle: "Topic B",
      topicNumber: 2,
    },
    {
      question: "Q10?",
      options: [
        { label: "Yes10", correct: true },
        { label: "No10", correct: false },
      ],
      explanation: "Explanation 10.",
      topicSlug: "topic-c",
      topicTitle: "Topic C",
      topicNumber: 3,
    },
  ];

  it("renders intro phase with Start Quiz button", () => {
    render(<RandomQuiz pool={testPool} courseSlug="elixir" />);
    expect(screen.getByText("Random Quiz")).toBeInTheDocument();
    expect(screen.getByText("Start Quiz")).toBeInTheDocument();
  });

  it("transitions from intro to active phase on start", () => {
    render(<RandomQuiz pool={testPool} courseSlug="elixir" />);
    fireEvent.click(screen.getByText("Start Quiz"));
    expect(screen.getByText(/Question 1 of 10/)).toBeInTheDocument();
  });

  it("shows topic badge in active phase", () => {
    render(<RandomQuiz pool={testPool} courseSlug="elixir" />);
    fireEvent.click(screen.getByText("Start Quiz"));
    // One of the topic titles should be visible as a badge
    const badges = testPool.map((q) => q.topicTitle);
    const found = badges.some((title) => screen.queryByText(title));
    expect(found).toBe(true);
  });

  it("shows Next Question button after answering", () => {
    render(<RandomQuiz pool={testPool} courseSlug="elixir" />);
    fireEvent.click(screen.getByText("Start Quiz"));

    // Click the first option to answer
    const options = screen.getAllByRole("button").filter((btn) => btn.textContent !== "Start Quiz");
    fireEvent.click(options[0]);

    expect(screen.getByText("Next Question")).toBeInTheDocument();
  });

  it("completes full quiz flow and shows results", () => {
    render(<RandomQuiz pool={testPool} courseSlug="elixir" />);
    fireEvent.click(screen.getByText("Start Quiz"));

    // Answer all 10 questions
    for (let i = 0; i < 10; i++) {
      // Click first option for each question
      const questionButtons = screen.getAllByRole("button").filter(
        (btn) => !btn.textContent?.includes("Next") && !btn.textContent?.includes("See Results")
      );
      fireEvent.click(questionButtons[0]);

      if (i < 9) {
        fireEvent.click(screen.getByText("Next Question"));
      } else {
        fireEvent.click(screen.getByText("See Results"));
      }
    }

    // Should show score
    expect(screen.getByText(/\/ 10/)).toBeInTheDocument();
    // Should show Try Again button
    expect(screen.getByText("Try Again")).toBeInTheDocument();
  });

  it("shows topics to review when answers are wrong", () => {
    render(<RandomQuiz pool={testPool} courseSlug="elixir" />);
    fireEvent.click(screen.getByText("Start Quiz"));

    // Answer all 10 questions - always pick the last option (likely wrong for most)
    for (let i = 0; i < 10; i++) {
      const questionButtons = screen.getAllByRole("button").filter(
        (btn) =>
          !btn.textContent?.includes("Next") &&
          !btn.textContent?.includes("See Results") &&
          !btn.textContent?.includes("Start")
      );
      // Pick last option (more likely to be wrong)
      fireEvent.click(questionButtons[questionButtons.length - 1]);

      if (i < 9) {
        fireEvent.click(screen.getByText("Next Question"));
      } else {
        fireEvent.click(screen.getByText("See Results"));
      }
    }

    // If any wrong, "Topics to Review" heading appears
    const score = screen.getByText(/\/ 10/).textContent;
    const scoreNum = parseInt(score?.split("/")[0].trim() ?? "10");
    if (scoreNum < 10) {
      expect(screen.getByText("Topics to Review")).toBeInTheDocument();
    }
  });

  it("Try Again restarts the quiz", () => {
    render(<RandomQuiz pool={testPool} courseSlug="elixir" />);
    fireEvent.click(screen.getByText("Start Quiz"));

    // Answer all 10 questions quickly
    for (let i = 0; i < 10; i++) {
      const questionButtons = screen.getAllByRole("button").filter(
        (btn) =>
          !btn.textContent?.includes("Next") &&
          !btn.textContent?.includes("See Results") &&
          !btn.textContent?.includes("Start")
      );
      fireEvent.click(questionButtons[0]);

      if (i < 9) {
        fireEvent.click(screen.getByText("Next Question"));
      } else {
        fireEvent.click(screen.getByText("See Results"));
      }
    }

    // Click Try Again
    fireEvent.click(screen.getByText("Try Again"));
    expect(screen.getByText(/Question 1 of 10/)).toBeInTheDocument();
  });
});
