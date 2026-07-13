# MASTER_INDEX

## Current Product

- Product: Restaurant Reservation Workspace
- Version: v4.0 Alpha
- Sprint: Sprint 3
- Architecture: Generation 2
- Current navigation model: Reservation Timeline
- Current task: TASK-005 Single Source of Truth State Management

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

## Current Scope

- Current item type: `restaurant`
- New item default status: `pending`
- Future item types are documentation-only until separately approved.
- TASK-005 coordinates Reservation Timeline, Reservation Details, and Output Preview through central in-memory state subscriptions.
- Full Reservation Details editing and persistence remain out of scope.
