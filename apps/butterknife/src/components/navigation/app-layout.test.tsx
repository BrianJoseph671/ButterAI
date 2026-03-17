import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AppLayout } from "./app-layout";

vi.mock("./app-header", () => ({
  AppHeader: () => <header data-testid="app-header">Header</header>,
}));

describe("AppLayout", () => {
  it("renders the shared header and page content", () => {
    const { container } = render(
      <AppLayout>
        <div>Dashboard Content</div>
      </AppLayout>,
    );

    expect(screen.getByTestId("app-header")).toBeInTheDocument();
    expect(screen.getByText("Dashboard Content")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("bg-zinc-50");
    expect(container.firstChild).toHaveClass("text-[#1a1a1a]");
  });
});
