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
    // Motion mock applies animate target as inline style
    const contentDiv = container.querySelector("button + div") as HTMLElement;
    expect(contentDiv.style.height).toBe("0px");
  });

  it("starts open when defaultOpen is true", () => {
    const { container } = render(
      <Collapsible title="Title" defaultOpen>Content</Collapsible>
    );
    const contentDiv = container.querySelector("button + div") as HTMLElement;
    expect(contentDiv.style.height).toBe("auto");
  });

  it("toggles open on click", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Collapsible title="Title">Content</Collapsible>
    );

    const button = screen.getByRole("button");
    await user.click(button);

    const contentDiv = container.querySelector("button + div") as HTMLElement;
    expect(contentDiv.style.height).toBe("auto");
  });

  it("toggles closed on second click", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Collapsible title="Title" defaultOpen>Content</Collapsible>
    );

    const button = screen.getByRole("button");
    await user.click(button);

    const contentDiv = container.querySelector("button + div") as HTMLElement;
    expect(contentDiv.style.height).toBe("0px");
  });

  it("has a chevron icon", () => {
    render(<Collapsible title="Title">Content</Collapsible>);
    const svg = document.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});
