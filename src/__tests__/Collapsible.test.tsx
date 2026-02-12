import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Collapsible from "@/components/ui/Collapsible";

describe("Collapsible", () => {
  it("renders the title", () => {
    render(<Collapsible title="My Section">Content</Collapsible>);
    expect(screen.getByText("My Section")).toBeInTheDocument();
  });

  it("renders children", () => {
    render(<Collapsible title="Title">Hidden content here</Collapsible>);
    expect(screen.getByText("Hidden content here")).toBeInTheDocument();
  });

  it("starts collapsed by default", () => {
    const { container } = render(
      <Collapsible title="Title">Content</Collapsible>
    );
    const animDiv = container.querySelector(".grid");
    expect(animDiv?.className).toContain("grid-rows-[0fr]");
  });

  it("starts open when defaultOpen is true", () => {
    const { container } = render(
      <Collapsible title="Title" defaultOpen>Content</Collapsible>
    );
    const animDiv = container.querySelector(".grid");
    expect(animDiv?.className).toContain("grid-rows-[1fr]");
  });

  it("toggles open on click", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Collapsible title="Title">Content</Collapsible>
    );

    const button = screen.getByRole("button");
    await user.click(button);

    const animDiv = container.querySelector(".grid");
    expect(animDiv?.className).toContain("grid-rows-[1fr]");
  });

  it("toggles closed on second click", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Collapsible title="Title" defaultOpen>Content</Collapsible>
    );

    const button = screen.getByRole("button");
    await user.click(button);

    const animDiv = container.querySelector(".grid");
    expect(animDiv?.className).toContain("grid-rows-[0fr]");
  });

  it("rotates chevron when open", async () => {
    const user = userEvent.setup();
    render(<Collapsible title="Title">Content</Collapsible>);

    const svg = document.querySelector("svg");
    expect(svg?.className.baseVal).not.toContain("rotate-180");

    await user.click(screen.getByRole("button"));
    expect(svg?.className.baseVal).toContain("rotate-180");
  });
});
