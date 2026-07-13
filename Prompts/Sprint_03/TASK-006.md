# TASK-006 — Implement Editable Reservation Details

## Repository and Branch

- Repository: `chettana33/JLOS-Restaurant-Reservation-Workspace`
- Branch: `feature/task-006`
- Base branch: `develop`
- Sprint: Sprint 3

## Objective

Implement the first fully editable Reservation Details panel using the existing central `state.js` architecture. Every valid edit must update the Single Source of Truth and immediately propagate to Reservation Timeline and Output Preview through state subscriptions.

Local Storage, Save persistence, PDF, AI Package, Duplicate, Delete, image persistence, backend, and cloud sync remain out of scope.

## Official Terminology

Use only Reservation Timeline, Reservation Details, and Output Preview.

## Editable Fields

### Reservation

- `dayNumber`
- `date`
- `meal`
- `time`
- `status`
- `confirmationNumber`

### Restaurant

- `restaurantName`
- `phone`
- `contact`
- `locationLink`

### Guests

- `adults`
- `children`
- `guides`

### Menu & Notes

- `menu`
- `notes`

### Image

Show a placeholder or dropzone only. Do not implement image persistence.

## State Rules

- Read the selected item only through the State API.
- Dispatch valid edits with `updateReservationItem(id, changes)`.
- Do not create a private editable copy or duplicate `selectedItem` in any module.
- Reservation Details must not directly call Reservation Timeline or Output Preview.
- State subscriptions coordinate all UI updates.

## Required Behavior

- Selection updates Reservation Details with the selected item's values.
- Valid edits update central state in memory immediately.
- Timeline-affecting changes are `dayNumber`, `date`, `meal`, `time`, `restaurantName`, and `status`.
- Output Preview reflects the current selected item immediately.
- New blank Reservation Items remain editable without fabricated values.
- Empty values use UI placeholders only.

## Location and Validation Rules

- Use `locationLink`; do not add physical address data.
- `locationLink` accepts only empty, `http://`, or `https://` values.
- `dayNumber` is a positive integer or empty.
- `date` is valid or empty.
- `time` is valid or empty.
- `status` is one of draft, pending, requested, confirmed, reconfirm, cancelled, completed, or archived.
- `adults`, `children`, and `guides` are non-negative integers.
- Invalid input must not crash the application and must show inline feedback.

## UX and Responsive Requirements

- Compact desktop-first form with visible labels and five ordered sections.
- Section order: Reservation, Restaurant, Guests, Menu & Notes, Image.
- Keyboard accessible controls and visible focus states.
- Minimum 44px touch targets on mobile.
- Preserve the current three-panel desktop workspace.
- Avoid horizontal scrolling at desktop, tablet, and mobile widths.
- Changes update in memory; no Save button is required.

## Required Testing

Verify initial selection, alternate selection, Details refresh, Timeline synchronization for relevant fields, Output Preview synchronization, guest counts, location link, new blank item editing, invalid number and URL feedback, keyboard navigation, desktop/tablet/mobile layout, and absence of console errors.

## Git Delivery

- Commit message: `feat: implement editable reservation details`
- Push `feature/task-006` to `origin`.
- Pull Request creation is deferred by the user's follow-up instruction.
- Do not merge.

## Definition of Done

The approved fields are editable, central state remains the single source of truth, all three panels synchronize through subscriptions, validation and responsive accessibility requirements pass, browser preview and screenshot are available, the branch is pushed, and the task stops for review.
