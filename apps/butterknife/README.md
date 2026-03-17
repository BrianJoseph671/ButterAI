# Butter AI - Contractor Monitoring Dashboard

A Next.js dashboard for HVAC contractors to monitor AI voice agent performance, track call metrics, and manage settings — powered by Google Sheets as the data backend.

## Features

- **Dashboard** — KPI cards, call volume charts, and performance trends via Recharts
- **Call Feed** — Searchable, filterable list of AI-handled calls with expandable details
- **Settings** — Configuration page with debounced autosave and ROI integration

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- shadcn/ui
- Recharts
- Google Sheets API (via `googleapis`)

## Getting Started

### Prerequisites

- Node.js 18+

### Install

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```
GOOGLE_SHEETS_ID=your-sheet-id-here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key-here\n-----END PRIVATE KEY-----"
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Google Sheets Setup

1. Create a Google Cloud project and enable the Google Sheets API
2. Create a service account and download the JSON key
3. Share your Google Sheet with the service account email (Viewer access is sufficient)
4. Copy the sheet ID from the URL and add it to `.env.local`

## Testing

```bash
npx vitest run
```

## Deployment

Compatible with Vercel free tier. Add the environment variables in your Vercel project settings.
