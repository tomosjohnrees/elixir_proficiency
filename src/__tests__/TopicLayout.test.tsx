import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TopicLayout from "@/components/layout/TopicLayout";

describe("TopicLayout", () => {
  it("renders the topic title", () => {
    render(
      <TopicLayout title="Test Topic" description="A test description">
        <div>Child content</div>
      </TopicLayout>
    );
    expect(screen.getByText("Test Topic")).toBeInTheDocument();
  });

  it("renders the description", () => {
    render(
      <TopicLayout title="Test Topic" description="A test description">
        <div>Child content</div>
      </TopicLayout>
    );
    expect(screen.getByText("A test description")).toBeInTheDocument();
  });

  it("renders children", () => {
    render(
      <TopicLayout title="Test Topic" description="A test description">
        <div>Child content</div>
      </TopicLayout>
    );
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });

  it("includes the SectionNav", () => {
    render(
      <TopicLayout title="Test" description="Desc">
        <div>Content</div>
      </TopicLayout>
    );
    // SectionNav renders these tabs
    expect(screen.getByText("ELI5")).toBeInTheDocument();
    expect(screen.getByText("Practice")).toBeInTheDocument();
  });
});
