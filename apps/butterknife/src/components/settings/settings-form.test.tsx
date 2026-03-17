import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SettingsForm } from "./settings-form";

describe("SettingsForm", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders all settings fields with first-visit defaults", async () => {
    render(<SettingsForm />);

    expect(await screen.findByDisplayValue("ButterAI")).toBeInTheDocument();
    expect(screen.getByLabelText("Average Job Value")).toHaveValue("0");
    expect(screen.getByLabelText("Butter AI Monthly Cost")).toHaveValue("300");
  });

  it("rejects non-numeric characters in the average job value field", async () => {
    render(<SettingsForm />);

    const averageJobValueInput = await screen.findByLabelText("Average Job Value");

    fireEvent.change(averageJobValueInput, {
      target: { value: "12ab3$4" },
    });

    expect(averageJobValueInput).toHaveValue("1234");
  });

  it("auto-saves changes after debounce and briefly shows a saved confirmation", async () => {
    vi.useFakeTimers();

    render(<SettingsForm />);

    act(() => {
      vi.advanceTimersByTime(0);
    });

    const businessNameInput = screen.getByLabelText("Business Name") as HTMLInputElement;
    const averageJobValueInput = screen.getByLabelText("Average Job Value");
    const monthlyCostInput = screen.getByLabelText("Butter AI Monthly Cost");

    fireEvent.change(businessNameInput, { target: { value: "Acme Air" } });
    fireEvent.change(averageJobValueInput, { target: { value: "4200" } });
    fireEvent.change(monthlyCostInput, { target: { value: "350" } });

    expect(screen.getByText("Saving...", { selector: "p" })).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(localStorage.getItem("butter-businessName")).toBe("Acme Air");
    expect(localStorage.getItem("butter-avgJobValue")).toBe("4200");
    expect(localStorage.getItem("butter-monthlyCost")).toBe("350");
    expect(screen.getByText("Saved", { selector: "p" })).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(screen.queryByText("Saved", { selector: "p" })).not.toBeInTheDocument();
  });

  it("loads persisted values after remount", async () => {
    vi.useFakeTimers();

    const firstRender = render(<SettingsForm />);

    act(() => {
      vi.advanceTimersByTime(0);
    });

    fireEvent.change(screen.getByLabelText("Business Name"), {
      target: { value: "Persisted HVAC" },
    });
    fireEvent.change(screen.getByLabelText("Average Job Value"), {
      target: { value: "1800" },
    });
    fireEvent.change(screen.getByLabelText("Butter AI Monthly Cost"), {
      target: { value: "275" },
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    firstRender.unmount();
    render(<SettingsForm />);

    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(screen.getByDisplayValue("Persisted HVAC")).toBeInTheDocument();
    expect(screen.getByLabelText("Average Job Value")).toHaveValue("1800");
    expect(screen.getByLabelText("Butter AI Monthly Cost")).toHaveValue("275");
  });
});
