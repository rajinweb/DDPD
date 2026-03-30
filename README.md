# Drug Development Portfolio Dashboard

Production-style front-end application for a clinical R&D organization. The app simulates a real portfolio system without depending on a live backend, while still using the kind of architecture, state boundaries, and UX behavior expected in a scalable Next.js application.

## Documentation

- [User Guide](./docs/user-guide.md)
- [Technical Architecture](./docs/technical-architecture.md)
- [Assumptions and Architecture Decisions](./docs/assumptions-and-decisions.md)

## What This Project Demonstrates

- Next.js App Router architecture with route handlers and route-level states
- Deterministic mock backend behavior exposed through API routes
- React Query for cached server-state, background refetching, and mutations
- Zustand for lightweight persisted session state
- URL-synced filtering, sorting, and pagination
- Virtualized program-table rendering for data-heavy portfolio views
- Drill-down program detail pages with milestones, studies, and editable metadata
- Simulated role-based behavior for reviewer vs manager workflows
- Responsive, accessible UI using Radix primitives and custom design tokens

## Core Features

- Dashboard listing all programs in the visible portfolio slice
- Filtering by development phase and therapeutic area
- Additional filtering by risk plus free-text search and sorting
- Program drill-down with study enrollment and milestone tracking
- Simulated authorization with read-only and editable experiences
- Graphical portfolio insights for phase mix, therapeutic concentration, and risk posture

## Quick Start

```bash
npm install
npm run dev
```

## Verification

```bash
npm run lint
npm run build
```

## Repository Guide

- `app/`: routes, route handlers, loading/error/not-found states
- `components/`: feature UI and reusable presentation components
- `components/customUi/`: shared branded UI primitives built with Radix
- `components/dashboard/`: dashboard-specific controls and insight modules
- `components/providers/`: app-level client providers
- `hooks/`: query and navigation hooks
- `lib/`: domain logic, mock data, state, formatting, and client helpers
- `docs/`: user, technical, and decision documentation

## Notes

- The app intentionally uses mocked data and mocked APIs.
- Metadata edits persist only for the lifetime of the running process.
- Role switching is simulated for demonstration purposes and is not secure authentication.

