# MASTER_INDEX

## Current Product

- Product: Restaurant Reservation Workspace
- Version: v4.0 Alpha
- Sprint: Sprint 3
- Architecture: Generation 2
- Current navigation model: Reservation Timeline
- Current task: TASK-006 Editable Reservation Details

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

## Current Scope

- Current item type: `restaurant`
- New item default status: `pending`
- Future item types are documentation-only until separately approved.
- TASK-006 implements in-memory Reservation Details editing through central state subscriptions.
- Local Storage, Save persistence, PDF, AI Package, Duplicate, Delete, image persistence, backend, and cloud sync remain out of scope.
