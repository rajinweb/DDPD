# Technical Architecture

## Goal

The application is intentionally built as a production-grade front end without a real backend. The objective is to demonstrate:

- scalable front-end architecture
- realistic app boundaries
- performance-conscious UI behavior
- maintainable state management
- clean separation of concerns

## Technology Stack

- `Next.js 16` with App Router
- `React 19`
- `TypeScript`
- `@tanstack/react-query` for server-state
- `Zustand` for small persisted client/session state
- `Radix UI primitives` for accessible interaction patterns
- `Tailwind CSS v4` plus local design tokens and shared UI class constants
- `react-window` for virtualized table rendering

## High-Level Architecture

The system is organized into four main layers.

### 1. Route Layer

Files:

- `app/page.tsx`
- `app/programs/[programId]/page.tsx`
- `app/api/programs/route.ts`
- `app/api/programs/[programId]/route.ts`

Responsibilities:

- render route entry points
- define route-level loading and error behavior
- expose mock HTTP endpoints for list and detail flows

### 2. Domain and Mock Backend Layer

Files:

- `lib/data/programs.ts`
- `lib/programs.ts`
- `lib/types.ts`

Responsibilities:

- define application types
- provide deterministic mock program data
- parse filter/search parameters
- apply search, filtering, sorting, pagination, and aggregation
- simulate authorization checks
- expose app-facing domain functions

### 3. Client Data Layer

Files:

- `lib/api/client.ts`
- `lib/query/keys.ts`
- `hooks/usePortfolioData.ts`
- `hooks/usePortfolioNavigation.ts`

Responsibilities:

- normalize API calls from the client
- centralize query keys
- provide reusable hooks for list, detail, prefetch, and mutation flows
- keep route navigation and query-string behavior consistent

### 4. UI Layer

Files:

- `components/PortfolioDashboard.tsx`
- `components/ProgramTable.tsx`
- `components/ProgramDetails.tsx`
- `components/dashboard/*`
- `components/customUi/*`

Responsibilities:

- render feature-specific UI
- consume typed snapshot data
- present loading, error, and empty states
- compose reusable branded primitives

## Data Flow

### Dashboard Flow

1. The server route parses URL search params.
2. `getPortfolioSnapshot()` builds the filtered portfolio snapshot.
3. The snapshot is rendered server-side for the initial request.
4. The client hydrates and React Query takes over subsequent updates.
5. Filter and pagination changes update the URL and trigger a new snapshot request.

### Program Detail Flow

1. The detail route fetches a program by ID.
2. The detail page renders with server-provided initial data.
3. React Query keeps the detail record fresh on the client.
4. Metadata edits issue a PATCH request to the mock detail endpoint.
5. Successful edits update the detail cache and invalidate related portfolio queries.

## State Management Strategy

### React Query

Used for asynchronous server-state because the app needs:

- request lifecycle management
- caching
- background refetching
- optimistic-feeling UX with preserved previous data
- cache invalidation after edits

This is a better fit than Context for remote or mock-remote data.

### Zustand

Used for small session-like state because the app only needs:

- the current simulated role
- persistence across page reloads
- minimal boilerplate

This keeps local state lightweight and avoids overusing React Query or global Context for non-server concerns.

### URL State

The dashboard treats the URL as a first-class contract for:

- search
- filters
- sort order
- current page
- page size

This improves shareability, reproducibility, and consistency with real analytics/operations tools.

## Mock Backend Strategy

The app does not fetch directly from static JSON inside components. Instead, it uses route handlers that simulate real API boundaries.

Benefits:

- keeps the UI decoupled from the data source
- allows realistic error/loading behavior
- makes migration to a real API simpler
- preserves a more production-like mental model for the codebase

The mock data store is deterministic and generated from seeded logic so the same programs appear consistently across reloads.

## Performance and Scalability Considerations

### Pagination

Portfolio snapshots are paginated before the UI receives them. This keeps payloads bounded and prevents unnecessarily large list renders.

### Virtualization

`ProgramTable` uses `react-window` to render only the visible rows inside the current page. This keeps the table responsive as page sizes or dataset sizes grow.

### Data Projection

The list view uses `ProgramListItem` rather than the full `Program` object graph. This reduces render and transfer weight for the dashboard table.

### Prefetching

Program-detail data is prefetched from the list interaction layer, helping detail navigation feel more responsive.

### Caching

React Query preserves previous dashboard data during transitions and caches detail records, reducing unnecessary churn during navigation.

### Lightweight Visualization

The insight widgets are built with SVG and CSS instead of a heavy chart runtime. This keeps the visualization layer fast and dependency-light while still surfacing useful summary patterns.

## Accessibility

The UI uses Radix primitives for accessible behavior in:

- dialogs
- tabs
- select controls
- progress indicators

The app also provides:

- keyboard-friendly navigation
- semantic labels for interactive controls
- descriptive status and error messaging
- responsive layouts for smaller screens

## Error Handling and Resilience

The application includes:

- route-level loading and error components
- inline query error messaging
- save-error feedback in the metadata editor
- safe fallbacks when data refreshes fail

This mirrors real-world front-end expectations even though the backend is simulated.

## Folder Structure

### `app/`

Route files and route handlers. This is the entry point for routing, SSR, and mock API boundaries.

### `components/`

Feature components and page composition.

### `components/customUi/`

Reusable app-branded UI primitives built on Radix and local styles.

### `components/dashboard/`

Dashboard-specific controls and insight modules.

### `hooks/`

Reusable hooks for data access and navigation.

### `lib/`

Types, domain logic, mock data, stores, formatters, and API helpers.

## Extensibility Path

This codebase is structured so a real backend can replace the mocked layer with minimal UI churn.

Likely migration steps:

1. Replace in-memory data access in `lib/data/programs.ts` with repository or service calls.
2. Keep the route handler shapes stable.
3. Preserve existing client query hooks and UI contracts.
4. Add real authentication and authorization on the server.
5. Introduce automated integration tests against the stabilized API layer.

