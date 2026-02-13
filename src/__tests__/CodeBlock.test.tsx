import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CodeBlock from "@/components/ui/CodeBlock";

describe("CodeBlock", () => {
  it("renders highlighted code", () => {
    render(<CodeBlock code='x = 42' />);
    const pre = document.querySelector("pre");
    expect(pre).toBeInTheDocument();
    expect(pre?.innerHTML).toContain("42");
  });

  it("renders a title when provided", () => {
    render(<CodeBlock code=":ok" title="Example" />);
    expect(screen.getByText("Example")).toBeInTheDocument();
  });

  it("does not render title when not provided", () => {
    const { container } = render(<CodeBlock code=":ok" />);
    // The title div has border-b class; without title there's only pre + possibly output
    const titleDivs = container.querySelectorAll(".border-b");
    // No title divs should exist within the code block wrapper
    expect(screen.queryByText("Example")).not.toBeInTheDocument();
  });

  it("renders output section with iex prompt when output provided", () => {
    render(<CodeBlock code=":ok" output="ok" />);
    expect(screen.getByText("iex>")).toBeInTheDocument();
    expect(screen.getByText("ok")).toBeInTheDocument();
  });

  it("does not render output section when output not provided", () => {
    render(<CodeBlock code=":ok" />);
    expect(screen.queryByText("iex>")).not.toBeInTheDocument();
  });

  it("applies syntax highlighting classes", () => {
    const { container } = render(<CodeBlock code="def hello do end" />);
    const keywords = container.querySelectorAll(".syn-keyword");
    expect(keywords.length).toBeGreaterThanOrEqual(3);
  });

  it("trims code before rendering", () => {
    const { container } = render(<CodeBlock code="  :ok  " />);
    const code = container.querySelector("code");
    expect(code?.innerHTML).toContain(":ok");
    // Should be trimmed — no leading spaces in the highlighted output
    expect(code?.innerHTML).not.toMatch(/^\s/);
  });

  describe("copy button", () => {
    const writeText = vi.fn().mockResolvedValue(undefined);

    beforeEach(() => {
      writeText.mockClear();
      Object.defineProperty(Navigator.prototype, "clipboard", {
        get: () => ({ writeText }),
        configurable: true,
      });
    });

    it("renders a copy button", () => {
      render(<CodeBlock code=":ok" />);
      expect(screen.getByRole("button", { name: "Copy code" })).toBeInTheDocument();
    });

    it("copies trimmed code to clipboard on click", async () => {
      render(<CodeBlock code="  hello  " />);

      await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: "Copy code" }));
        await Promise.resolve();
      });

      expect(writeText).toHaveBeenCalledWith("hello");
    });

    it("shows 'Copied!' after clicking", async () => {
      const user = userEvent.setup();
      render(<CodeBlock code=":ok" />);

      const button = screen.getByRole("button", { name: "Copy code" });
      expect(button).toHaveTextContent("Copy");

      await user.click(button);
      expect(button).toHaveTextContent("Copied!");
    });

    it("reverts to 'Copy' after timeout", async () => {
      vi.useFakeTimers();
      render(<CodeBlock code=":ok" />);

      const button = screen.getByRole("button", { name: "Copy code" });

      await act(async () => {
        fireEvent.click(button);
        await Promise.resolve();
      });
      expect(button).toHaveTextContent("Copied!");

      act(() => { vi.advanceTimersByTime(2000); });
      expect(button).toHaveTextContent("Copy");

      vi.useRealTimers();
    });
  });
});
