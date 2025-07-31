# Scouting Reports Viewer

A Next.js project that fetches scouting reports from an external API and displays them with pagination. Built with React, TypeScript, and React Query for efficient data fetching and state management.
Visit the live demo here: https://scouting-dashboard.vercel.app/
---

## Features

* Fetch scouting reports from an external API with server-side pagination.
* Display player information including name, position, team, and scouting evaluation.
* Client-side pagination with Previous/Next buttons.
* Type-safe code with TypeScript.
* Handles loading and error states gracefully.
* Clean, minimal UI with Tailwind CSS.

---

## Tech Stack

* **Next.js** — React framework for SSR and API routes
* **React Query** — Data fetching and caching
* **TypeScript** — Type safety and better developer experience
* **Axios** — HTTP client for API calls
* **Tailwind CSS** — Utility-first CSS framework for styling

---

## Getting Started

### Prerequisites

* Node.js (v16+ recommended)
* npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/scouting-reports-viewer.git
   cd scouting-reports-viewer
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to:

   ```
   http://localhost:3000
   ```

---

## Project Structure

* `app/page.tsx` — Main React component fetching and displaying scouting reports with pagination.
* `app/api/reports/route.ts` — Next.js API route that fetches data from the external scouting reports API and applies pagination.

---

## Usage

* Use the **Previous** and **Next** buttons at the bottom to navigate between pages of scouting reports.
* Each report shows:

  * **Player**: Player's name
  * **Position**: Scouted playing position
  * **Team**: Team name
  * **Report**: Final scouting judgement

---

## API Details

The backend API route `/api/reports` fetches data from:

```
https://f5q80hfi91.execute-api.eu-south-1.amazonaws.com/prod/get_scouting_reports
```

It supports pagination through query parameters:

* `page` (default: 1)
* `limit` (default: 10)

Example request:

```
/api/reports?page=2&limit=10
```

---


## License

This project is licensed under the MIT License.

---
