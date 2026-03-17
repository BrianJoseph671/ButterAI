# User Testing

Testing surface, validation approach, and resource cost classification.

**What belongs here:** How to test the app manually, what tools to use, concurrency limits, known quirks.

---

## Validation Surface

- **Surface:** Web browser at `http://localhost:3000`
- **Tool:** agent-browser
- **Pages to test:**
  - `/` - Dashboard Home
  - `/calls` - Call Feed
  - `/settings` - Settings
- **Setup:** Start Next.js production server (`npm run build && npm run start`) before testing

## Validation Concurrency

- **Max concurrent agent-browser validators:** 5
- **Rationale:** 5.6 GB free RAM, 70% headroom = 3.9 GB usable. Dev server ~200 MB. Each agent-browser ~300 MB. (3900 - 200) / 300 = ~12, capped at 5.
- **Dev server:** Single instance shared by all validators (port 3000)

## Data Dependencies

- Tests depend on live data in the Google Sheet (ID: 1lOl48iFGW-FWUrtldDqTmrHNIxUPdYZ4nVScADiEv5s)
- The sheet may have varying amounts of data; tests should be resilient to data volume
- Some columns may be empty/unpopulated; tests should verify graceful handling

## Flow Validator Guidance: Web Browser

### Isolation Rules

- **Shared infrastructure:** All validators share the same Next.js server on port 3000
- **Isolation boundary:** Each validator gets its own browser session via `--session` flag
- **Safe concurrent operations:**
  - Navigation to different pages
  - Taking screenshots
  - Reading page content
  - API calls via curl
- **Unsafe operations (avoid):**
  - Writing to localStorage with keys that might conflict (use session-scoped keys if testing localStorage)
  - Mutating global state that affects other sessions

### Testing Approach

1. Use `agent-browser --session <unique-id>` for each validator to ensure isolation
2. Start with `agent-browser open http://localhost:3000` or specific route
3. Use `agent-browser snapshot -i` to discover interactive elements
4. Use `agent-browser screenshot --annotate` for visual verification
5. Always close the session with `agent-browser --session <id> close` when done

### API Testing via curl

For API assertions, use direct HTTP requests:
- `curl http://localhost:3000/api/calls`
- `curl http://localhost:3000/api/calls/stats`

These are read-only and safe to run in parallel.

### Evidence Collection

- Screenshots: Save to `.factory/validation/<milestone>/user-testing/evidence/<group-id>/`
- JSON responses: Save API responses for verification
- Console logs: Check for JavaScript errors with `agent-browser errors`

### Known Quirks

- The app uses localStorage for settings (butter-businessName, butter-avgJobValue, butter-monthlyCost)
- First visit shows default values: business name 'I&M HVAC', monthly cost $300, job value $0
- Dashboard may show loading skeletons while fetching data from Google Sheets
- Google Sheets API can be slow; allow extra wait time for data to load
