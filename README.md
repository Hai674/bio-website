# Future Self 2066 — 40-Year Self Development System

A browser-first personal website platform combining:

- **Dashboard analytics** (Chart.js)
- **Habit tracking** with streaks
- **Interactive force-directed mindmap** (D3)
- **Cloud persistence** with Firestore (with local cache fallback)

Built with **React + Vite + Zustand + TailwindCSS + Firebase**.

## Features

### Core modules

- **Dashboard**
  - Current date
  - Main goals summary
  - Habit streak summary
  - Total completed habits
  - Mindmap node count
  - 7-day analytics chart

- **Habit Tracking**
  - Create/edit/delete habits
  - Daily completion toggle
  - Auto streak calculation
  - Progress bars
  - Optional link to a mindmap node

- **Mindmap Planning**
  - Force-directed graph simulation
  - Drag-and-drop nodes
  - Re-parenting by dropping onto another node
  - Collision detection (`forceCollide`)
  - Curved (Bezier-like quadratic) links
  - Zoom + pan (mouse/touch via D3 zoom)
  - Double-click empty canvas to create node
  - Node inspector for edit/delete/link/collapse

### Design

- Dark futuristic UI (`#020617`)
- Neon accent (`#6366f1`)
- Glassmorphism surfaces
- Responsive sidebar + content layout
- Floating quick-action button

## Project structure

```txt
src/
  components/
    dashboard/
    habits/
    layout/
    mindmap/
  firebase/
  pages/
  store/
  utils/
```

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Configure Firebase

Create a `.env` file in project root:

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

If env values are missing, the app still works using **localStorage fallback**.

### 3) Firestore collections

Create collections in Firestore:

- `mindmap`
- `habits`
- `progress` (reserved for future expansion)

### 4) Run locally

```bash
npm run dev
```

Open: `http://localhost:5173`

### 5) Production build

```bash
npm run build
npm run preview
```

## Deploy to Vercel

1. Push repository to GitHub.
2. Import project in Vercel.
3. Framework preset: **Vite**.
4. Add all `VITE_FIREBASE_*` environment variables in Vercel project settings.
5. Deploy.

## Performance notes

- D3 force simulation scoped to active visible nodes.
- Collision and link forces tuned for smooth interactions.
- Lightweight Zustand store for minimal rerenders.
- Tailwind utility classes keep CSS bundle small.

