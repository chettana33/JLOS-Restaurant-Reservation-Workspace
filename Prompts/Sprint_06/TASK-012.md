# TASK-012 — Implement Workspace Settings

## Project

- Repository: `chettana33/JLOS-Restaurant-Reservation-Workspace`
- Base branch: `develop`
- Feature branch: `feature/task-012`
- Depends on: TASK-011 AI Package Export (PR #8)
- Numbering: continues after TASK-011 per Git history (see `CURRENT_STATE.md`).

## Objective

Enable the `Settings` Toolbar action and provide an accessible Settings panel where the operator configures workspace defaults that apply across the current project and future exports. Settings live in Central State and are saved with the project file.

## Toolbar

- Enable the `Settings` button (currently `disabled`).
- Opening Settings shows a native modal `<dialog>` (mirrors the Delete confirmation dialog pattern).
- The dialog provides Save and Cancel; Cancel or Escape discards changes without modifying state.

## Settings Model

Add a `settings` object to Central State (`js/state.js`). Defaults:

```json
{
  "settings": {
    "newReservation": {
      "meal": "dinner",
      "status": "pending",
      "adults": 2,
      "children": 0,
      "guides": 0,
      "currency": "JPY"
    },
    "projectDefaults": {
      "tourCode": "",
      "customer": "",
      "guide": "",
      "travelDate": ""
    },
    "exportFilenamePrefix": "JLOS"
  }
}
```

Rules:

- `settings` is owned by `js/state.js` alongside `project`, `reservationItems`, and `selectedItemId`.
- A single mutation `updateSettings(partialSettings)` merges only approved keys and notifies subscribers once; malformed partials are rejected with a focused warning.
- `getSettings()` returns a cloned snapshot.
- Settings are optional in memory; when absent, feature code falls back to the constants above.
- Settings do not affect existing Reservation Items; they apply to new items and future operations only.

## New Reservation Defaults

`createBlankReservationItem` in `js/timeline.js` must use `getSettings().newReservation` for:

- `meal` (was `""`)
- `status` (was `"pending"`, unchanged by default)
- `adults` (was `0`)
- `children` (was `0`)
- `guides` (was `0`)
- `menu.currency` (was `null`)

All other blank item fields keep their current values.

## Project Defaults

When the workspace starts with no project data (empty initialization), `app.js` must seed the initial project from `getSettings().projectDefaults` instead of the hardcoded `INITIAL_PROJECT`. When project data exists, the loaded project wins and projectDefaults are not applied.

## Export Filename Prefix

The exported filename prefix becomes configurable through `exportFilenamePrefix`:

- Project Save (`createProjectFilename` in `js/storage.js`): currently `JLOS_...`, becomes `<prefix>_...`.
- AI Package (`createAiPackageFilename` in `js/ai-package.js`): currently `JLOS_...`, becomes `<prefix>_...`.
- PDF Export (`createExportFilename` in `js/pdf-export.js`): currently `Quotation-...`, becomes `<prefix>-...`.
- Invalid prefixes (empty after trim, or containing characters outside `[a-z0-9_-]`) fall back to the previous default per exporter.

## Project File Persistence

- Add `settings` as a new top-level key in the saved project document (`js/storage.js`).
- `TOP_LEVEL_KEYS` gains `settings`.
- `createProjectDocument` includes the current settings snapshot.
- `validateProjectDocument` validates `settings` shape (recognized keys only, correct types); malformed settings fall back to defaults and do not invalidate the file.
- `replaceState` accepts `settings` in `nextState` and normalizes it the same way.

## Settings UI

- Use a native `<dialog id="settings-dialog">` opened with `showModal()`.
- Title: `Workspace Settings`.
- Fields:
  - New Reservation defaults: Meal (select), Status (select), Adults, Children, Guides (number), Currency (text, ISO 4217 pattern `^[A-Z]{3}$`).
  - Project defaults: Tour Code, Customer, Guide, Travel Date (text).
  - Export filename prefix (text).
- Reuse existing form-field and button styles; do not introduce new visual tokens unless required.
- Save button applies `updateSettings(...)`, closes the dialog, and announces an accessible live status (`Workspace settings saved.`).
- Cancel/Escape closes without change; focus returns to the Settings button.
- Empty currency or a prefix that is only whitespace are normalized: currency empty → previous default; prefix invalid → previous default per exporter.

## Accessibility

- Native `<button>` and `<dialog>` with visible focus states.
- Labels associated with controls (`for`/`id`).
- Escape closes; focus is trapped by native `showModal()`.
- Save/Cancel result announced via `role="status"` / `aria-live="polite"`.

## Out of Scope

Language/locale switching, theming, Local Storage, autosave, backend, cloud sync, per-user profiles, image upload, drag-and-drop reorder, and changes to existing Reservation Items or the reservation item schema.

## Testing

Verify:

- State: settings defaults; `updateSettings` merges, notifies once, rejects malformed/unknown keys; `getSettings` returns a clone; `replaceState` normalizes settings on load.
- New Reservation uses settings defaults for meal, status, adults, children, guides, and menu.currency.
- Startup with empty project seeds from projectDefaults; loaded project wins.
- Export filename prefixes: Project Save, AI Package, PDF use the configured prefix; invalid prefix falls back.
- Project file round-trip: settings saved, validated, and restored; malformed settings fall back to defaults without rejecting the file.
- UI: Settings opens, fields reflect current settings, editing + Save updates state and shows status, Cancel/Escape leaves state unchanged, focus returns to Settings.
- Browser console stays clean; `node --check` passes on all modified/added JS modules.

## Documentation Updates

Update `Project_Management/ARCHITECTURE.md`, `Project_Management/DECISIONS.md`, `Project_Management/COMPONENT_LIBRARY.md`, `Project_Management/MASTER_INDEX.md`, `Project_Management/PROJECT_LOG.md`, `Project_Management/CHANGELOG.md`, and `Project_Management/SPRINT_DASHBOARD.md`. Update `CURRENT_STATE.md` and `checkpoints/CHECKPOINT_LATEST.md` after merge.

## Git Workflow

- Commit: `feat: implement workspace settings`
- Push: `git push -u origin feature/task-012`
- Do not merge or create a Pull Request.
