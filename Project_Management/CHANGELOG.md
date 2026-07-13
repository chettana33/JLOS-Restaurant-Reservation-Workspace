# CHANGELOG

## v4.0 Alpha

### TASK-001 — Project Skeleton completed

- Created the Generation 2 project skeleton without reusing v3 source code.
- Added the desktop-first responsive workspace structure.
- Added modular CSS and JavaScript placeholders.
- Added project architecture folders for documentation, components, data, utilities, and configuration.
- Added the root project README and development workflow.
- No business logic or backend integration was implemented.

### TASK-002 — Restaurant Reservation Workspace Layout completed

- Added the responsive three-panel Alpha workspace layout.
- Added Header, Toolbar, Reservation placeholders, Editor cards, and one A4 Landscape Preview.
- Replaced physical address display with Location Link.
- Improved the Preview as a centered responsive document viewer.
- No business logic, storage, PDF, export, or backend behavior was implemented.

### TASK-003 — Reservation Timeline Data Model & UX Specification completed

- Replaced the Reservation Table concept with the Reservation Timeline architecture.
- Added the Reservation Item JSON Schema using Draft 2020-12.
- Added realistic sample Timeline data for three days and five restaurant reservations.
- Defined the official eight-status workflow, default status, meanings, colors, and allowed transitions.
- Documented Timeline grouping, sorting, selection, empty-state, and responsive UX rules.
- Documented future item-type extension points without implementing future modules.
- No Timeline UI, JavaScript business logic, storage, PDF, export, API, or backend was implemented.

### TASK-004 — Reservation Timeline Component completed

- Replaced static reservation rows with a dynamic Reservation Timeline rendered from sample JSON.
- Validated source items against the Alpha Reservation Item schema before rendering.
- Grouped items by itinerary day and sorted items by time.
- Added first-item auto-selection and accessible single-item selection.
- Added in-memory New Reservation creation with `pending` status and empty-value placeholders.
- Added all eight official status badge styles and responsive Timeline layouts.
- Standardized active UI terminology as Reservation Timeline, Reservation Details, and Output Preview.
- Did not add Reservation Details synchronization, Output Preview synchronization, Local Storage, PDF, AI Package, backend, or API behavior.

### TASK-004 Review Fix — Selection synchronization and control states

- Made hover, selected, and keyboard-focus states visually distinct.
- Added a persistent selected accent and selected indicator.
- Synchronized the approved selected-item summary fields to Reservation Details and Output Preview.
- Kept `selectedItemId` as the single source of selection truth in `app.js`.
- Added an Unscheduled fallback for new items without a valid day.
- Added nearest smooth scrolling for the selected Timeline item.
- Disabled all deferred Toolbar actions with native `disabled` controls.
- Added no Local Storage, PDF, AI Package, Duplicate, or Delete functionality.

### TASK-005 — Single Source of Truth State Management completed

- Added `js/state.js` as the central owner of project data, Reservation Items, and selected item ID.
- Derived the selected Reservation Item instead of storing a duplicate object.
- Added a small State API for initialization, reads, selection, addition, updates, and subscriptions.
- Refactored Timeline, Reservation Details, and Output Preview into independent state subscribers.
- Reduced `app.js` to initial loading, validation, state setup, and module initialization.
- Added safe handling for empty lists, malformed items, invalid selections, and duplicate IDs.
- Preserved selection, New Reservation, accessibility, disabled controls, and responsive behavior.
- Added no Local Storage, Save, Duplicate, Delete, PDF, AI Package, backend, or cloud synchronization.

### TASK-GITHUB-001 — Git Repository & Development Workflow completed

- Initialized the repository with `main` as the default branch.
- Connected the project to its public GitHub repository.
- Added repository ignore rules and contribution guidelines.
- Added GitHub branch, label, Pull Request, review, and merge workflow documentation.
- Updated the project README with architecture, development, build, run, and Git workflow guidance.
- Created the `develop` and `feature/task-006` branch structure.
- Made no application feature, UI, CSS, or JavaScript changes.

### TASK-006 — Editable Reservation Details completed

- Replaced the selected-item summary with a compact editable Reservation Details form.
- Added all approved Reservation, Restaurant, Guests, Menu & Notes fields.
- Routed valid edits through the central `updateReservationItem()` State API.
- Synchronized Reservation Timeline and Output Preview through existing state subscriptions.
- Added inline validation for positive days, valid dates and times, approved statuses, non-negative guest counts, and HTTP/HTTPS Location Links.
- Added an image placeholder without upload or persistence behavior.
- Added responsive, keyboard-accessible controls and visible focus states.
- Added no Local Storage, Save persistence, PDF, AI Package, Duplicate, Delete, backend, or cloud synchronization.
