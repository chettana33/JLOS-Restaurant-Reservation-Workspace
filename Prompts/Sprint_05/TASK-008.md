# TASK-008 — Implement Save and Load Project as Local JSON

## Project

- Repository: `chettana33/JLOS-Restaurant-Reservation-Workspace`
- Base branch: `develop`
- Feature branch: `feature/task-008`
- Depends on: TASK-007 merged into `develop`

## Objective

Allow the operator to explicitly save the current JLOS project as a local JSON file and load a previously saved JLOS JSON file. This task does not use Local Storage.

## Toolbar

- Enable Save.
- Add and enable Open Project beside Save.
- Keep Duplicate, Delete, AI Package, Export PDF, and Settings disabled.

## Project File Contract

```json
{
  "version": "4.0-alpha",
  "savedAt": "ISO date-time",
  "project": {
    "tourCode": "",
    "customer": "",
    "guide": "",
    "travelDate": "",
    "projectStatus": "working"
  },
  "reservationItems": [],
  "selectedItemId": null
}
```

Save only persisted central state. Do not include derived `selectedItem`, temporary UI state, invalid fields, or unknown fields. Use `JLOS_<tourCode>_<YYYY-MM-DD>.json`, with `JLOS_Project_<YYYY-MM-DD>.json` as the empty Tour Code fallback.

## Loading and Validation

- Use a hidden, accessibly labelled file input accepting `application/json` and `.json`.
- Parse and validate the complete file before changing current state.
- Require the supported version, Project object, and Reservation Item array.
- Validate Reservation Items against the approved schema as far as practical for editable blank reservations.
- Reject duplicate IDs, unknown statuses, malformed values, and unsupported versions.
- Restore a valid selected item ID; otherwise select the first item or `null` for an empty collection.
- Keep the current state unchanged after every failed load.
- Replace central state atomically and notify all subscribers.

## User Experience and Accessibility

- Announce save, load, invalid-file, and unsupported-version results with an accessible live status.
- Keep Save and Open Project keyboard accessible.
- Return focus to Open Project after file selection.
- Preserve the existing responsive workspace and avoid horizontal scrolling.

## Out of Scope

Local Storage, autosave, cloud sync, backend, Duplicate, Delete, PDF export, AI Package, Settings, and a multi-project dashboard.

## Testing

Verify Save and filename, approved JSON shape, absence of derived state, successful Load and all subscriber updates, invalid JSON and structures, duplicate IDs, selection fallback, unsupported version, atomic failure behavior, keyboard operation, responsive Toolbar behavior, and a clean Browser console.

## Git Workflow

- Commit: `feat: implement project save and load`
- Push: `git push -u origin feature/task-008`
- Do not merge or create a Pull Request.
