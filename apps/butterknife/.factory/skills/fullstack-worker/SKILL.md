---
name: fullstack-worker
description: Full-stack Next.js worker for API routes, pages, and components
---

# Full-Stack Worker

NOTE: Startup and cleanup are handled by `worker-base`. This skill defines the WORK PROCEDURE.

## When to Use This Skill

Features involving Next.js API routes, React pages/components, Tailwind/shadcn styling, Recharts charts, localStorage integration, or any combination of frontend and backend work in this Next.js App Router project.

## Work Procedure

### 1. Understand the Feature

- Read the feature description, preconditions, expectedBehavior, and verificationSteps thoroughly.
- Read `AGENTS.md` for coding conventions and boundaries.
- Read `.factory/library/architecture.md` for the data flow and design tokens.
- Check preconditions: verify that required files/APIs/components from prior features exist.

### 2. Write Tests First (TDD)

- Create test files BEFORE implementation code.
- For API routes: test the handler function directly with mocked Google Sheets responses. Test happy path, empty data, error cases.
- For utility functions: test formatting (duration mm:ss, currency), calculations (ROI, qualified leads), null/undefined handling.
- For React components: test rendering with React Testing Library. Test that required elements are present, that empty/null props render "N/A", that click handlers work.
- Run tests to confirm they FAIL (red phase): `npx vitest run`

### 3. Implement

- Follow the file structure from AGENTS.md: `src/app/` for pages, `src/app/api/` for routes, `src/components/` for components, `src/lib/` for utilities, `src/types/` for types.
- Use shadcn/ui components. Install them via `npx shadcn@latest add <component>` as needed. When the CLI prompts for options interactively, use flags to skip prompts: for initial setup use `npx shadcn@latest init -y --defaults`, for adding components use `npx shadcn@latest add <component> -y`.
- Use Tailwind CSS for all styling. Apply design tokens from architecture.md (accent #F5D76E, text #1a1a1a).
- For charts, use Recharts (BarChart, PieChart/Cell).
- For localStorage: use a `butter-` key prefix. Always handle missing/malformed localStorage gracefully with defaults.
- Handle all null/undefined/empty values: show "N/A" for missing text, "0" for missing numbers. NEVER render "undefined", "null", or "NaN".

### 4. Make Tests Pass (Green Phase)

- Run `npx vitest run` and iterate until all tests pass.
- Fix any failing tests by adjusting implementation (not by deleting tests).

### 5. Verify with Type Check and Lint

- Run `npx tsc --noEmit` -- fix all type errors.
- Run `npm run lint` -- fix all lint errors. (This project uses `eslint .` via npm script, NOT `npx next lint` which is unavailable in Next.js 16.)

### 6. Manual Verification with agent-browser

- Start the dev server: `npm run dev`
- Use agent-browser to navigate to the relevant pages.
- Verify each expectedBehavior item visually:
  - Check that cards render with correct data
  - Check that interactions work (expand/collapse, filter, search)
  - Check that null/empty values show "N/A" not "undefined"
  - Check loading states appear before data loads
- Stop the dev server when done.
- Record each check in `interactiveChecks`.

### 7. Commit

- Stage all changes with `git add -A`
- Review diff with `git diff --cached` for secrets or sensitive data
- Commit with a descriptive message

## Example Handoff

```json
{
  "salientSummary": "Built the Dashboard Home page with 5 summary cards (Total Calls, Answered/Voicemail donut, Qualified Leads, Avg Duration, ROI Estimate) and a 14-day bar chart. All cards read from /api/calls/stats. ROI reads avg job value and monthly cost from localStorage. Ran 12 unit tests (all pass), verified with agent-browser that cards render with live data and null values show 'N/A'.",
  "whatWasImplemented": "src/app/page.tsx (Dashboard Home), src/components/dashboard/TotalCallsCard.tsx, src/components/dashboard/DonutChart.tsx, src/components/dashboard/QualifiedLeadsCard.tsx, src/components/dashboard/AvgDurationCard.tsx, src/components/dashboard/ROICard.tsx, src/components/dashboard/CallsBarChart.tsx, src/lib/format.ts (formatDuration, formatCurrency), plus tests for all components and utilities.",
  "whatWasLeftUndone": "",
  "verification": {
    "commandsRun": [
      { "command": "npx vitest run", "exitCode": 0, "observation": "12 tests pass, 0 failures" },
      { "command": "npx tsc --noEmit", "exitCode": 0, "observation": "No type errors" },
      { "command": "npx next lint", "exitCode": 0, "observation": "No lint warnings" }
    ],
    "interactiveChecks": [
      { "action": "Navigate to http://localhost:3000 in agent-browser", "observed": "Dashboard loads, all 5 cards visible with live data from Google Sheet. Total Calls shows 47 all-time, 12 this week, 3 today." },
      { "action": "Check donut chart", "observed": "Donut chart shows 35 answered (green), 12 voicemail (gray) with legend labels." },
      { "action": "Check ROI card with no job value set", "observed": "Shows $0 estimated revenue, $300/mo cost, ROI displays 'N/A' (no division by zero)." },
      { "action": "Check bar chart", "observed": "14-day bar chart renders with bars for days with calls, zero-height for days without. X-axis shows dates." }
    ]
  },
  "tests": {
    "added": [
      { "file": "src/components/dashboard/TotalCallsCard.test.tsx", "cases": [
        { "name": "renders all three counts", "verifies": "Total Calls card shows all-time, week, today counts" },
        { "name": "handles zero counts", "verifies": "Shows 0 when no data" }
      ]},
      { "file": "src/lib/format.test.ts", "cases": [
        { "name": "formatDuration converts seconds to mm:ss", "verifies": "145 -> '2:25'" },
        { "name": "formatDuration handles zero", "verifies": "0 -> '0:00'" }
      ]}
    ]
  },
  "discoveredIssues": []
}
```

## When to Return to Orchestrator

- Google Sheets API returns persistent auth errors that suggest credentials are invalid
- A shadcn/ui component needed for this feature is unavailable or broken
- A required npm package fails to install
- A precondition is not met (expected file/component/API from a prior feature doesn't exist)
- The feature scope is significantly larger than described and would take excessive time
