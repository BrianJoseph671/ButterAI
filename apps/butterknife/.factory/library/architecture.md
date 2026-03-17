# Architecture

Architectural decisions, patterns, and conventions.

**What belongs here:** Tech stack decisions, component patterns, data flow, naming conventions.

---

## Tech Stack

- **Framework:** Next.js (App Router) with TypeScript
- **Styling:** Tailwind CSS with shadcn/ui components
- **Charts:** Recharts (bar chart, donut/pie chart)
- **Data source:** Google Sheets API (read-only via service account)
- **State:** localStorage for user settings (no database)
- **Testing:** Vitest + React Testing Library

## Data Flow

1. Google Sheet (source of truth) -> Google Sheets API
2. Next.js API routes (`/api/calls`, `/api/calls/stats`) fetch and transform sheet data
3. Client pages fetch from API routes
4. Settings stored in localStorage, read by Dashboard for ROI calculation

## Design Tokens

- Background: white / light gray
- Accent: butter-yellow `#F5D76E`
- Text: dark `#1a1a1a`
- Status answered: green indicator
- Status voicemail: gray indicator

## Column Mapping (Google Sheet -> API)

| Sheet Column | API Field | Type |
|---|---|---|
| Date | date | ISO string |
| Name | name | string |
| Number | number | string (+1 prefix) |
| Request | request | string |
| Equipment Age | equipmentAge | string |
| Home Size | homeSize | string |
| Make/Model | makeModel | string |
| Call Status | callStatus | "answered" \| "voicemail" |
| Financing Interest | financingInterest | "yes" \| "no" |
| Credit Score | creditScore | number (1-10) or null |
| Payment Method | paymentMethod | string or null |
| Urgency | urgency | string |
| Availability | availability | string |
| Call Duration | callDuration | number (seconds) |
