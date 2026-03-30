# User Guide

## Purpose

The Drug Development Portfolio Dashboard is designed for portfolio managers and clinical reviewers who need to:

- browse all drug-development programs
- filter the portfolio by development stage and therapeutic area
- inspect milestones and study enrollment for an individual program
- edit selected metadata when the user has manager access

This application simulates the front end of a real portfolio system. It behaves like a production application, but the data is mocked.

## Who This Is For

- Clinical reviewers who need read-only oversight of the portfolio
- Portfolio managers who need the same visibility plus limited metadata editing
- Product, engineering, or design reviewers evaluating the front-end architecture

## Getting Around

### Dashboard

The landing page shows:

- a portfolio summary hero
- KPI cards for the current result set
- graphical portfolio insights
- filter controls
- the main program table

Everything shown on the page reflects the currently selected filters.

### Program Table

Each row in the table represents a single program. Users can:

- scan high-level program attributes
- compare phase, therapeutic area, progress, enrollment, and risk
- click anywhere on a row to open that program’s detail page

### Program Detail Page

The detail page includes:

- program summary and status
- program profile and operational context
- study list with enrollment progress
- milestone timeline
- editable metadata for authorized users

## Key Workflows

### 1. Filter the Portfolio

Use the controls at the top of the dashboard to refine the visible data set:

- `Program Search`: free-text search across program name, code, indication, therapeutic area, mechanism, lead, and tags
- `Development Phase`: narrow the portfolio to a lifecycle stage
- `Therapeutic Area`: focus on a clinical domain
- `Risk`: isolate low, medium, or high-risk programs
- `Sort By`: reorder the visible results

The current filter set is written to the URL. This makes the view:

- shareable
- reproducible
- browser-navigation friendly

### 2. Review Portfolio Insights

The dashboard includes a graphical insights section with:

- `Phase Mix`: how visible programs are distributed across development stages
- `Therapeutic Areas`: where the current pipeline is concentrated
- `Risk Posture`: risk composition plus summary execution indicators

These visuals update automatically when filters change.

### 3. Navigate Large Result Sets

The table supports large lists through pagination and virtualization.

Use the footer controls to:

- go to the previous or next page
- jump directly to a page number
- understand the current slice of results being shown

### 4. Open a Program

From the main table:

- click anywhere on a row
- review the detail page for that specific program

The detail page shows:

- summary stats
- study enrollment progress
- connected studies
- milestone execution

### 5. Switch User Role

The header includes a `Simulated Access Role` control.

Available roles:

- `Clinical Reviewer`: read-only access
- `Portfolio Manager`: can edit selected metadata fields

This role switch is client-side and is intended only to demonstrate role-aware UI behavior.

### 6. Edit Metadata

When the active role is `Portfolio Manager`, the detail page enables the `Edit metadata` action.

Editable fields are intentionally limited to:

- indication
- program lead
- risk level
- priority

Study execution and milestone records remain read-only.

## System States You May See

### Loading States

The application shows loading indicators when:

- dashboard data is refreshing
- detail data is being re-fetched
- pagination or filter changes are in progress
- metadata edits are being saved

### Empty States

If the active filter combination returns no programs, the dashboard explains that no programs matched and encourages broadening the query.

### Error States

If a mock API request fails, the application displays contextual error messaging and retains the last useful view whenever possible.

## Accessibility and Responsiveness

The interface is built to work across desktop and smaller screens. It also includes:

- keyboard-accessible dialogs and tabs
- accessible select controls via Radix
- visible loading and status messaging
- semantic labels for controls and charts

## Important Limitations

- Data is mocked, not live.
- Edits are not durable across server restarts.
- Role switching is simulated and not secure authentication.
- The app is intended to demonstrate front-end architecture and UX, not real clinical operations.

