# Assumptions and Architecture Decisions

## Product Assumptions

### 1. The organization is a clinical R&D portfolio team

The requirement mentions a clinical `RCD` organization. This implementation assumes the intended meaning is a clinical `R&D` organization responsible for managing programs, studies, and milestones across the drug-development portfolio.

### 2. The primary users are reviewers and portfolio managers

The app models two user personas:

- `Clinical Reviewer`: read-only user
- `Portfolio Manager`: user allowed to edit selected metadata

This was chosen because it is enough to demonstrate role-sensitive UI without overcomplicating the mock system with a full enterprise permission model.

### 3. Only a subset of fields should be editable

The editable scope is intentionally limited to:

- indication
- lead
- risk level
- priority

Reasoning:

- these fields are plausible portfolio-management metadata
- they are less operationally sensitive than study execution data
- they demonstrate mutation, authorization, form handling, and cache invalidation clearly

### 4. Programs can have multiple studies and milestones

The mock data model assumes one program may own multiple associated studies and milestones. This reflects the requirement and drives the need for scalable list/detail rendering.

### 5. The project is a front-end architecture exercise, not a regulated system

The app does not attempt to model:

- audit trails
- validated clinical-record workflows
- secure authentication
- multi-user concurrency
- durable persistence

Those were considered out of scope because the requirement emphasizes front-end architecture and simulation rather than full system compliance.

## Technical Assumptions

### 1. No live backend is available

Because the requirement explicitly avoids real backend data, the app assumes all backend behavior must be simulated locally while still preserving realistic boundaries.

### 2. The UI should behave as if it were talking to real services

This assumption led to:

- route handlers instead of direct imports into components
- asynchronous service functions
- simulated latency
- error and loading states

### 3. Dataset size should feel substantial

The app assumes the portfolio can grow large enough that:

- pagination is necessary
- table virtualization is justified
- caching and render efficiency matter

Even though the current mock size is finite, the architecture is intentionally shaped for heavier datasets.

### 4. A shared URL contract is valuable

This assumes portfolio users benefit from bookmarkable and reproducible views. That is typical for operational dashboards used in reviews, handoffs, and portfolio meetings.

## Architecture Decisions

### Decision 1: Use Next.js App Router

Chosen because it provides:

- route-level loading and error boundaries
- server rendering for initial page loads
- colocated route handlers for mock APIs
- a clean path to future backend integration

Why not a purely client-rendered SPA:

- it would make the app feel less production-like for this use case
- it would blur the boundary between page rendering and data services
- it would make route-level states less natural

### Decision 2: Simulate a backend using API routes and a service layer

Chosen because it preserves a realistic separation between:

- UI
- client request logic
- server/domain logic
- mock data storage

Why not import mock arrays directly into components:

- that creates tight coupling between UI and data
- it bypasses realistic request behavior
- it makes the future migration path harder

### Decision 3: Use React Query for server-state

Chosen because the dashboard needs:

- caching
- background refetch
- placeholder data during transitions
- mutation invalidation
- prefetch support

Why not Context API:

- Context is not ideal for async server-state lifecycles
- it would require more custom loading/error/cache logic

### Decision 4: Use Zustand for simulated session state

Chosen because the app only needs a very small global state footprint for the active role.

Why not Context API:

- Zustand is lighter for this case
- persistence is simpler
- rerender impact is lower

### Decision 5: Treat the URL as the dashboard state contract

Chosen because search, filters, and pagination are core portfolio-view concerns and should remain:

- shareable
- restorable
- compatible with browser navigation

This mirrors real enterprise dashboard behavior.

### Decision 6: Keep pagination and virtualization together

Chosen because they solve different problems:

- pagination controls payload size and navigation
- virtualization controls render cost inside a dense table

Even if current page sizes are modest, keeping both demonstrates how the front end would behave under heavier scale.

### Decision 7: Use projected list items for the dashboard table

Chosen because the list page does not need the full detail object graph for every program.

Benefits:

- smaller payloads
- less rendering work
- clearer separation between list and detail contracts

### Decision 8: Build insight visuals with SVG and CSS

Chosen because the project only needs a focused set of high-signal graphics.

Benefits:

- avoids unnecessary charting complexity
- keeps runtime cost lower
- makes the visuals easy to theme and control

Tradeoff:

- less flexibility than a full charting library if the dashboard expands into richer analytics

### Decision 9: Use Radix primitives with custom visual styling

Chosen because it separates:

- accessibility and behavior
- product-specific visual design

This gives the app strong accessibility foundations without forcing an out-of-the-box visual system that may not match the portfolio-product brand.

### Decision 10: Keep mock persistence in memory

Chosen because it is enough to demonstrate:

- end-to-end mutation flows
- query invalidation
- UI refresh behavior

Tradeoff:

- edits reset when the server process restarts
- it is not suitable for real persistence or collaborative workflows

## Known Tradeoffs and Limitations

- Authorization is simulated, not secure.
- Persistence is in-memory only.
- Aggregations currently run in the mock service layer, not a real database.
- Automated tests are still the next recommended hardening step.

## If This Were Extended Further

The next architectural moves would be:

1. replace the in-memory mock store with a real repository or API
2. add server-side authentication and role enforcement
3. introduce integration tests for critical workflows
4. add auditability and persistence around metadata changes
5. move heavy aggregation to the data tier if dataset scale increases materially

