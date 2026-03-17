# Environment

Environment variables, external dependencies, and setup notes.

**What belongs here:** Required env vars, external API keys/services, dependency quirks, platform-specific notes.
**What does NOT belong here:** Service ports/commands (use `.factory/services.yaml`).

---

## Required Environment Variables

All defined in `.env.local` (already configured):

- `GOOGLE_SHEETS_ID` - Google Sheet ID containing call data
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` - Service account email for Sheets API
- `GOOGLE_PRIVATE_KEY` - Service account private key (PEM format, with `\n` escapes)

## Platform Notes

- Windows 10 development environment
- Node.js v24.13.1, npm 11.8.0
- No database required - Google Sheets is the data source
- `.env.local` is in `.gitignore` (credentials not committed)
