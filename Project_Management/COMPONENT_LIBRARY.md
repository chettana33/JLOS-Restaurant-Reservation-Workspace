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

- Status: Implemented in TASK-006
- Displays five compact sections for the currently selected Reservation Item
- Supports editable Reservation, Restaurant, Guests, Menu & Notes fields
- Displays an image placeholder without upload or persistence behavior
- Provides inline validation for schedule, status, guest counts, and Location Link
- Does not own an independent copy of reservation data
- Subscribes to central state and derives the current item through `getSelectedItem()`
- Dispatches approved edits through `updateReservationItem(id, changes)`

### Output Preview

- Status: Implemented in TASK-007
- Displays exactly one selected Reservation Item
- Uses one reusable A4 Landscape document structure for screen preview and future PDF export
- Displays Project context, reservation schedule, restaurant, status, confirmation, guest total, supplier contact, Location Link, menu, notes, and image area
- Uses customer-friendly placeholders without fabricating reservation data
- Renders an accessible Open Location action only for valid HTTP/HTTPS links
- Uses an accessible image fallback when the selected image is unavailable
- Prepares print CSS to show only the A4 paper
- Does not implement PDF generation or download behavior
- Subscribes to central state and derives the same current item as Reservation Details
- Reflects valid Reservation Details edits immediately through its state subscription

## Application State Service

### Central State

- Module: `js/state.js`
- Status: Implemented in TASK-005
- Owns: Project data, Reservation Item collection, selected item ID
- Derives: Selected Reservation Item
- API: Initialize, read snapshots, select, add, update, subscribe, notify
- Replacement API: `replaceState(nextState)` performs one atomic state replacement and subscriber notification
- Does not provide: Local Storage, backend sync, delete, duplicate, PDF, or AI Package export
### Item Actions (Duplicate / Delete)

- Module: `js/timeline.js` + native `<dialog>` in `index.html`
- Status: Implemented in TASK-010
- Duplicate clones the selected Reservation Item through `duplicateReservationItem(id)` and selects the copy.
- Delete opens a native modal confirmation dialog naming the selected reservation, then removes it through `deleteReservationItem(id)`.
- Duplicate and Delete Toolbar buttons are disabled whenever no Reservation Item is selected.
- On confirmed delete, selection falls back to the item at the deleted position, then the previous item, then `null`.
- Dialog supports Escape, focus return, and a destructive Confirm action; Cancel and Escape never change state.

### Project File Controls

- Module: `js/storage.js`
- Status: Implemented in TASK-008
- Enables: Save and Open Project Toolbar actions
- Saves only the approved version, timestamp, Project, Reservation Items, and selected item ID
- Loads validated JSON through the central State replacement API
- Rejects malformed data, duplicate IDs, unknown statuses, and unsupported versions without changing current state
- Announces Save and Load results through an accessible live status message
- Uses local JSON file download and selection only; no Local Storage or backend

### AI Package Export

- Module: `js/ai-package.js`
- Status: Implemented in TASK-011
- Enables: `AI Package` Toolbar action
- Downloads an AI-ready JSON document (`format: jlos-ai-package`, `formatVersion: 1.0`)
- Reads the full project and Reservation Items from the Central State API and sanitizes items against the reservation item schema via the shared `sanitizeValue`
- Adds a derived `context` block: purpose, real-value summary, day groups, guest/reservation totals, and official status counts
- Excludes `selectedItemId` as transient workspace state and fabricates no data
- Announces the exported filename through an accessible live status message

## Component Rules

- Keep reusable presentation components in `components/` when implementation begins.
- Do not place workflow, persistence, API, validation, export, or other business logic in components.
- Use reusable CSS classes and semantic HTML.
- Follow `docs/ux/RESERVATION_TIMELINE_UX.md` for future Timeline implementation.
- Components must subscribe to central state rather than maintain private Reservation Item or selection copies.
