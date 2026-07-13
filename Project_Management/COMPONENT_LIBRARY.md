# COMPONENT_LIBRARY

Reusable UI components must remain presentation-focused and contain no business logic.

## Workspace Components

### Project Header

Displays tour code, customer, guide, travel date, and project status.

### Workspace Toolbar

Displays workspace actions. TASK-003 does not add action behavior.

### Reservation Timeline

- Status: Implemented in TASK-004
- Purpose: Core workspace navigation grouped by itinerary day
- Contains: Timeline Day Group and Reservation Timeline Item
- Data source: Canonical Reservation Item collection
- State integration: Reads `reservationItems` and `selectedItemId` from central state; dispatches selection and add-item actions through the State API

### Timeline Day Group

- Status: Specified; not implemented
- Displays: Day number and date context
- Contains: Reservation Items sorted by time
- Must not duplicate Reservation Item data

### Reservation Timeline Item

- Status: Specified; not implemented
- Displays: Time, meal, title or restaurant name, and status
- Supports: One visually highlighted selected state
- Must remain compact and scannable

### Status Badge

- Displays one official workflow status using text and semantic color
- Must not rely on color alone
- Official values: Draft, Pending, Requested, Confirmed, Reconfirm, Cancelled, Completed, Archived

### Reservation Details

- Displays editor sections for the currently selected Reservation Item
- Does not own an independent copy of reservation data
- Subscribes to central state and derives the current item through `getSelectedItem()`

### Output Preview

- Displays exactly one selected Reservation Item
- Uses one reusable A4 Landscape document structure for screen preview and future PDF export
- Does not implement PDF generation in TASK-003
- Subscribes to central state and derives the same current item as Reservation Details

## Application State Service

### Central State

- Module: `js/state.js`
- Status: Implemented in TASK-005
- Owns: Project data, Reservation Item collection, selected item ID
- Derives: Selected Reservation Item
- API: Initialize, read snapshots, select, add, update, subscribe, notify
- Does not provide: Local Storage, backend sync, save, delete, duplicate, or export

## Component Rules

- Keep reusable presentation components in `components/` when implementation begins.
- Do not place workflow, persistence, API, validation, export, or other business logic in components.
- Use reusable CSS classes and semantic HTML.
- Follow `docs/ux/RESERVATION_TIMELINE_UX.md` for future Timeline implementation.
- Components must subscribe to central state rather than maintain private Reservation Item or selection copies.
