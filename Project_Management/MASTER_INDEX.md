# MASTER_INDEX

## Current Product

- Product: Restaurant Reservation Workspace
- Version: v4.0 Alpha
- Sprint: Sprint 5
- Architecture: Generation 2
- Current navigation model: Reservation Timeline
- Current task: TASK-009 Export PDF

## Source of Truth

- Project rules: `Project_Management/PROJECT_RULES.md`
- Architecture: `Project_Management/ARCHITECTURE.md`
- Decisions: `Project_Management/DECISIONS.md`
- UX guidelines: `Project_Management/UX_GUIDELINES.md`
- Component library: `Project_Management/COMPONENT_LIBRARY.md`
- Coding standards: `Project_Management/CODING_STANDARDS.md`
- Project log: `Project_Management/PROJECT_LOG.md`
- Changelog: `Project_Management/CHANGELOG.md`

## Reservation Timeline Specifications

- Reservation Item schema: `data/reservation-item.schema.json`
- Sample timeline: `data/sample-reservation-timeline.json`
- Timeline model: `docs/architecture/RESERVATION_TIMELINE_MODEL.md`
- Timeline UX: `docs/ux/RESERVATION_TIMELINE_UX.md`

## State Management

- Central state module: `js/state.js`
- Full task specification: `Prompts/Sprint_03/TASK-005.md`
- Architecture decision: `Project_Management/DECISIONS.md` — DEC-006
- Stored state: `project`, `reservationItems`, `selectedItemId`
- Derived state: `selectedItem`

## Reservation Details

- Editable panel module: `js/editor.js`
- Full task specification: `Prompts/Sprint_03/TASK-006.md`
- Updates: `updateReservationItem(id, changes)`
- Synchronization: Central state subscriptions update Reservation Timeline, Reservation Details, and Output Preview
- Validation: Inline, field-specific, and non-persistent

## Output Preview

- Customer-facing preview module: `js/preview.js`
- Full task specification: `Prompts/Sprint_04/TASK-007.md`
- Data sources: `getProject()` and `getSelectedItem()` through the central State API
- Synchronization: Direct central state subscription
- Format: One responsive A4 landscape Restaurant Reservation Summary
- Print preparation: Output Preview paper
- PDF export: Client-side single-page A4 landscape download of the current Output Preview

## PDF Export

- Export module: `js/pdf-export.js`
- Task branch: `feature/task-009`
- Export source: Current live Output Preview
- Output: Single-page A4 landscape PDF
- Filename: `Quotation-<YYYYMMDD>-<HHMM>.pdf`
- Runtime: Browser-only with no backend or external PDF dependency

## Project Files

- Local JSON file module: `js/storage.js`
- Full task specification: `Prompts/Sprint_05/TASK-008.md`
- File version: `4.0-alpha`
- Persisted state: `project`, `reservationItems`, and `selectedItemId`
- State restoration: Atomic replacement through `replaceState(nextState)`
- Local Storage, autosave, cloud sync, and backend persistence are not used

## Current Scope

- Current item type: `restaurant`
- New item default status: `pending`
- Future item types are documentation-only until separately approved.
- TASK-006 implements in-memory Reservation Details editing through central state subscriptions.
- TASK-007 implements the live customer-facing Output Preview for one selected reservation.
- TASK-008 implements explicit Save and Open Project actions using local JSON files.
- TASK-009 implements explicit client-side PDF export of the current live Output Preview.
- Local Storage, autosave, AI Package, Duplicate, Delete, image persistence, backend, and cloud sync remain out of scope.
