# MASTER_INDEX

## Current Product

- Product: Restaurant Reservation Workspace
- Version: v4.0 Alpha
- Sprint: Sprint 6
- Architecture: Generation 2
- Current navigation model: Reservation Timeline
- Current task: TASK-011 AI Package Export

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
- Print preparation: Output Preview paper only; no PDF generation

## Project Files

- Local JSON file module: `js/storage.js`
- Full task specification: `Prompts/Sprint_05/TASK-008.md`
- File version: `4.0-alpha`
- Persisted state: `project`, `reservationItems`, and `selectedItemId`
- State restoration: Atomic replacement through `replaceState(nextState)`
- Local Storage, autosave, cloud sync, and backend persistence are not used

## Item Actions

- Duplicate: `duplicateReservationItem(id)` in `js/state.js`
- Delete: `deleteReservationItem(id)` in `js/state.js` + native confirm `<dialog>` in `index.html`
- Full task specification: `Prompts/Sprint_06/TASK-010.md`
- Architecture decision: `Project_Management/DECISIONS.md` — DEC-007

## AI Package Export

- Export module: `js/ai-package.js`
- Full task specification: `Prompts/Sprint_06/TASK-011.md`
- Architecture decision: `Project_Management/DECISIONS.md` — DEC-008
- Format: `jlos-ai-package` / `formatVersion: 1.0`
- Output: full project + sanitized Reservation Items + derived `context` block
- Data source: Central State API (`getState()`); items sanitized via shared `sanitizeValue`
- Excludes: `selectedItemId` (transient), no Local Storage or backend

## Workspace Settings

- Settings module: `js/settings.js`
- Full task specification: `Prompts/Sprint_06/TASK-012.md`
- Architecture decision: `Project_Management/DECISIONS.md` — DEC-009
- State: `settings` in `js/state.js` via `getSettings` / `updateSettings`
- Defaults: `newReservation` (meal, status, adults, children, guides, currency), `projectDefaults`, `exportFilenamePrefix`
- Effects: seeds New Reservation items and initial Project; prefixes Project Save, AI Package, and PDF Export filenames
- Persistence: saved with the project file; legacy files without settings still load

## Current Scope

- Current item type: `restaurant`
- New item default status: `pending`
- Future item types are documentation-only until separately approved.
- TASK-006 implements in-memory Reservation Details editing through central state subscriptions.
- TASK-007 implements the live customer-facing Output Preview for one selected reservation.
- TASK-008 implements explicit Save and Open Project actions using local JSON files.
- TASK-009 implements client-side PDF export of the live Output Preview.
- TASK-010 implements Duplicate and Delete Reservation actions with a confirmation dialog.
- TASK-011 implements AI Package export as an AI-ready JSON document.
- TASK-012 implements Workspace Settings with project-file persistence.
- Local Storage, autosave, image persistence, backend, and cloud sync remain out of scope.
