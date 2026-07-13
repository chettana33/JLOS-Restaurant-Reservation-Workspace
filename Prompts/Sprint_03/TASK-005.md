# TASK-005

## Title

Single Source of Truth State Management

## Priority

Critical

## Sprint

Sprint 3

## Owner

Codex

## Depends On

TASK-004 REVIEW FIX — Completed

## Objective

Introduce a dedicated application state module before implementing the full Reservation Details form.

The goal is to establish one shared source of truth for:

- project
- reservationItems
- selectedItemId
- selectedItem

Timeline, Reservation Details, and Output Preview must all read from the same state.

Do not implement Local Storage yet. Do not implement PDF, AI Package, Duplicate, Delete, or Save.

## Branch

Create and work on `feature/state-management`. If Git is unavailable, document that limitation clearly.

## Official UI Terminology

Use these names everywhere:

- Reservation Timeline
- Reservation Details
- Output Preview

Do not use Reservation Table, Restaurant Table, Reservation Editor, Live Document, or Inspector.

## Create

Create `js/state.js`. This module must own the application state.

Recommended state shape:

```js
{
  project: {
    tourCode: "",
    customer: "",
    guide: "",
    travelDate: "",
    projectStatus: "working"
  },
  reservationItems: [],
  selectedItemId: null
}
```

Do not store selectedItem as a duplicated object in state. Derive selectedItem from selectedItemId and reservationItems.

## Required State API

Implement a small and predictable API such as:

- `initializeState(projectData, reservationItems)`
- `getState()`
- `getReservationItems()`
- `getSelectedItemId()`
- `getSelectedItem()`
- `setSelectedItemId(id)`
- `addReservationItem(item)`
- `updateReservationItem(id, changes)`
- `subscribe(listener)`
- `notifySubscribers()`

## Subscription Model

Timeline, Reservation Details, and Output Preview must subscribe to state updates.

When state changes:

- Timeline re-renders selected state.
- Reservation Details updates selected summary.
- Output Preview updates selected summary.

Do not manually synchronize modules with duplicated event chains. Use the state module as the central coordinator.

## Module Responsibilities

### `js/app.js`

- Application startup only
- Load initial data
- Initialize state
- Initialize modules

### `js/timeline.js`

- Render Reservation Items from state
- Dispatch selection and add-item actions through State API
- Do not own selectedItemId locally

### `js/editor.js`

- Read selected item from state
- Render the existing selected summary only
- No full editable form yet

### `js/preview.js`

- Read selected item from state
- Render the existing selected summary only

No module may maintain a private copy of reservationItems or selectedItemId.

## New Reservation

Keep the existing New Reservation behavior:

- Create a blank item
- `status = pending`
- `itemType = restaurant`
- No fake restaurant data
- Generate unique ID
- Set `createdAt` and `updatedAt`
- Add through `state.addReservationItem(...)`
- Select through `state.setSelectedItemId(...)`
- If no day is available, group under Unscheduled

## Selection Behavior

When the operator selects a Timeline item:

1. Call `state.setSelectedItemId(id)`.
2. State notifies subscribers.
3. Timeline updates highlight.
4. Reservation Details updates.
5. Output Preview updates.

Timeline must not directly call Reservation Details or Output Preview.

## Data Loading

Continue using the approved sample Timeline data. If `file://` prevents JSON fetch, use the current documented fallback, preserve the exact schema shape, and do not hard-code data into `index.html`.

## Error Handling

Handle safely:

- Empty Reservation Item collection
- Selected item ID does not exist
- Selected item is deleted in a future task
- Malformed initial data
- Duplicate item IDs

Show a clear empty state, do not crash, and log helpful console warnings only when necessary.

## Accessibility

Preserve:

- Keyboard selection
- `aria-selected`
- Visible focus ring
- Semantic headings
- Disabled Toolbar buttons

## Documentation Updates

Update:

- `Project_Management/ARCHITECTURE.md`
- `Project_Management/DECISIONS.md`
- `Project_Management/COMPONENT_LIBRARY.md`
- `Project_Management/PROJECT_LOG.md`
- `Project_Management/CHANGELOG.md`
- `Project_Management/MASTER_INDEX.md`

Document the decision: State Management = Single Source of Truth.

## Out of Scope

- Full Reservation Details form
- Inline editing
- Two-way binding
- Duplicate
- Delete
- Save
- Local Storage
- Import or Export
- PDF
- AI Package
- Backend
- Cloud sync

## Definition of Done

- `js/state.js` created
- Reservation Items exist only in central state
- Selected item ID exists only in central state
- Selected item is derived, not duplicated
- Timeline reads from state
- Reservation Details reads from state
- Output Preview reads from state
- Timeline does not directly call Reservation Details or Output Preview
- Selection synchronization still works
- New Reservation still works
- Existing hover, selected, focus, and accessibility behavior remains correct
- Disabled Toolbar buttons remain disabled
- Empty-state handling works
- Documentation updated
- Browser Preview available
- Screenshot attached
- Testing summary included

## Required Testing

1. Initial data load
2. First item auto-selected
3. Click another Timeline item
4. Timeline selection updates
5. Reservation Details updates
6. Output Preview updates
7. Create New Reservation
8. New blank pending item is added
9. New item becomes selected
10. Empty Reservation Item list does not crash
11. No duplicated selected state exists across modules
12. Keyboard selection still works
13. Mobile layout has no horizontal scrolling
14. Console has no errors

## Delivery

Stop after TASK-005 and wait for approval before TASK-006.

## Response Format

```text
TASK-005

Status:
Completed

Branch:
feature/state-management

Browser Preview:
Attached

Screenshot:
Attached

Files Created:
...

Files Modified:
...

Central State:
Completed / Not Completed

Single Source of Truth:
Completed / Not Completed

Timeline Subscription:
Completed / Not Completed

Reservation Details Subscription:
Completed / Not Completed

Output Preview Subscription:
Completed / Not Completed

New Reservation:
Passed / Failed

Tests Performed:
...

Architecture Impact:
...

Known Issues:
...

Ready for Review:
Yes
```
