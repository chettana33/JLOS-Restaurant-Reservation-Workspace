# TASK-010 — Implement Duplicate and Delete Reservation

## Project

- Repository: `chettana33/JLOS-Restaurant-Reservation-Workspace`
- Base branch: `develop`
- Feature branch: `feature/task-010`
- Depends on: TASK-009 PDF Export merged into `develop`
- Note: Historical backlog numbering identified Duplicate as TASK-009, which conflicts with the implemented TASK-009 PDF Export scope. Git history is authoritative; this task is numbered TASK-010.

## Objective

Allow the operator to duplicate the currently selected Reservation Item and delete a Reservation Item through an accessible confirmation dialog. Both actions must flow through the Central State API only.

## Toolbar

- Enable Duplicate and Delete.
- Keep Duplicate and Delete disabled when no Reservation Item is selected or the collection is empty.
- Keep AI Package and Settings disabled.

## State API

Add two mutations to `js/state.js`:

### `duplicateReservationItem(id)`

- Return `false` and log a focused warning when the source item does not exist or is malformed.
- Clone every field of the source item except:
  - `id`: a new `crypto.randomUUID()`
  - `createdAt` and `updatedAt`: current ISO timestamp
- Insert the duplicate directly after the source item in the collection.
- Notify subscribers once.
- Return the new Reservation Item id (or `null` on failure) so the caller can select it.

### `deleteReservationItem(id)`

- Return `false` and log a focused warning when the item does not exist.
- Remove the item from the collection.
- If the deleted item was selected, fall back to:
  1. the item that took the deleted item's position, if any, otherwise
  2. the previous item in the collection, otherwise
  3. `null`
- Notify subscribers once.
- Return `true` on success.

## Duplicate Behavior

- Duplicate the currently selected item only.
- After a successful duplicate, select the new item and scroll it into view (mirror New Reservation behavior).
- The new item appears in the correct day group and chronological position through the existing derived grouping and sorting.

## Delete Confirmation Dialog

- Use a native `<dialog>` element opened with `showModal()` for accessible modal behavior.
- Title and body must name the reservation being deleted using the item's restaurant name or title (with placeholder fallback).
- Provide a Cancel action and a destructive Confirm action.
- Confirm is disabled-safe: it must not delete when no item is selected.
- On close, return focus to the Delete button.
- Cancel or Escape must not change state.

## Accessibility

- Buttons use native `<button>` with visible focus states.
- Dialog labels the content, traps focus (native `showModal()` behavior), and supports Escape.
- Duplicate and Delete remain keyboard accessible.
- Confirm announces result via an accessible live region or the dialog itself; a concise toolbar status is acceptable.

## Out of Scope

Local Storage, autosave, backend, cloud sync, PDF changes, AI Package, Settings, drag-and-drop reorder, and transition-enforcement of the official status workflow.

## Testing

Verify: duplicate of a selected item, duplicate id uniqueness, duplicate placed after the source, duplicate becomes selected, delete of selected item with position fallback, delete of last item, delete to empty list with `null` selection, Cancel keeps state unchanged, Escape closes without change, empty collection leaves Duplicate/Delete disabled, keyboard operation, responsive Toolbar without horizontal scrolling, and a clean Browser console.

## Documentation Updates

Update `Project_Management/ARCHITECTURE.md`, `Project_Management/DECISIONS.md`, `Project_Management/COMPONENT_LIBRARY.md`, `Project_Management/MASTER_INDEX.md`, `Project_Management/PROJECT_LOG.md`, `Project_Management/CHANGELOG.md`, and `Project_Management/SPRINT_DASHBOARD.md`.

## Git Workflow

- Commit: `feat: implement duplicate and delete reservation`
- Push: `git push -u origin feature/task-010`
- Do not merge or create a Pull Request.
