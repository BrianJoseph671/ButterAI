import { render, screen } from "@testing-library/react";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AppHeader } from "./app-header";

const mockUsePathname = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  usePathname: mockUsePathname,
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: ReactNode;
  } & AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

describe("AppHeader", () => {
  beforeEach(() => {
    localStorage.clear();
    mockUsePathname.mockReturnValue("/");
  });

  it("renders the default business name and navigation links", () => {
    render(<AppHeader />);

    expect(screen.getByText("ButterAI")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "Call Feed" })).toHaveAttribute(
      "href",
      "/calls",
    );
    expect(screen.getByRole("link", { name: "Settings" })).toHaveAttribute(
      "href",
      "/settings",
    );
  });

  it("loads the business name from localStorage when present", async () => {
    localStorage.setItem("butter-businessName", "Acme Heating");

    render(<AppHeader />);

    expect(await screen.findByText("Acme Heating")).toBeInTheDocument();
  });

  it("marks the current page link as active", () => {
    mockUsePathname.mockReturnValue("/calls");

    render(<AppHeader />);

    const activeLink = screen.getByRole("link", { name: "Call Feed" });
    expect(activeLink).toHaveAttribute("aria-current", "page");
    expect(activeLink).toHaveClass("font-semibold");
    expect(screen.getByRole("link", { name: "Dashboard" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("uses a stacked mobile nav layout", () => {
    render(<AppHeader />);

    const nav = screen.getByRole("navigation", { name: "Primary" });
    expect(nav).toHaveClass("flex-col");
    expect(nav).toHaveClass("sm:flex-row");
  });
});
