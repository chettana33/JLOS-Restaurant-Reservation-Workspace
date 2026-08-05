# TASK-011 — Implement AI Package Export

## Project

- Repository: `chettana33/JLOS-Restaurant-Reservation-Workspace`
- Base branch: `develop`
- Feature branch: `feature/task-011`
- Depends on: TASK-001..TASK-010 merged into `develop`
- Numbering: continues after TASK-010 per Git history (see `CURRENT_STATE.md`).

## Objective

Provide an "AI Package" export that downloads the entire current project as an AI-ready JSON document. The package contains only real project data read from the Central State API, plus a derived `context` block that summarizes the project for machine-assisted work. No data is fabricated.

## Toolbar

- Enable the `AI Package` button.
- Keep `Settings` disabled.
- The button remains enabled even with an empty reservation list (a project always exists).

## New Module

Add `js/ai-package.js` following the pattern of `js/pdf-export.js` and `js/storage.js`:

### `createAiPackageDocument(stateSnapshot, reservationItemSchema, now = new Date())`

Builds the AI-ready document object. The document shape is:

```json
{
  "format": "jlos-ai-package",
  "formatVersion": "1.0",
  "product": "JLOS Restaurant Reservation Workspace",
  "productVersion": "4.0-alpha",
  "exportedAt": "<ISO 8601>",
  "project": {
    "tourCode": "...",
    "customer": "...",
    "guide": "...",
    "travelDate": "...",
    "projectStatus": "..."
  },
  "reservationItems": [ "<sanitized items, full list>" ],
  "context": {
    "purpose": "AI-ready export of the current JLOS project for machine assistance.",
    "summary": "<one descriptive sentence built from real values>",
    "dayGroups": [
      {
        "dayNumber": 1,
        "date": "...",
        "reservationCount": 2,
        "items": [
          {
            "id": "...",
            "time": "...",
            "meal": "...",
            "restaurantName": "...",
            "status": "...",
            "adults": 0,
            "children": 0,
            "guides": 0
          }
        ]
      }
    ],
    "totals": {
      "reservations": 0,
      "adults": 0,
      "children": 0,
      "guides": 0,
      "guests": 0
    },
    "statusCounts": {
      "draft": 0,
      "pending": 0,
      "requested": 0,
      "confirmed": 0,
      "reconfirm": 0,
      "cancelled": 0,
      "completed": 0,
      "archived": 0
    }
  }
}
```

Rules:

- `project`: exact keys `tourCode`, `customer`, `guide`, `travelDate`, `projectStatus` (defaults like `createProjectDocument` in `js/storage.js`).
- `reservationItems`: the full collection, each item sanitized against `reservationItemSchema` using the same schema-based sanitize behavior as Project Save. To keep one source of truth, export `sanitizeValue` from `js/storage.js` and reuse it. When the schema is unavailable, export the items as-is and log a `console.warn`.
- `context` values are derived from the exported items only:
  - `summary`: built from real `tourCode`/`customer`/`travelDate` values and the real reservation count; falls back to a neutral sentence when those values are empty. Never substitutes fake data.
  - `dayGroups`: derived by grouping items by `dayNumber`/`date`, sorted by `dayNumber` then `time`, using the same rules as the Timeline.
  - `totals.guests` = `adults + children + guides` per item, summed.
  - `statusCounts`: counts per official status; unknown or missing statuses are counted as `pending` (mirrors Preview behavior).
- `selectedItemId` is NOT included; selection is transient workspace state.
- No `$schema` reference and no import path is added; this is an export-only format.

### `createAiPackageFilename(tourCode, now = new Date())`

Reuses the safe slug rules from `createProjectFilename` in `js/storage.js`:

```
JLOS_<safeTourCode-or-Project>_AI_<YYYY-MM-DD>.json
```

### `downloadAiPackage(documentData, filename)`

Downloads the JSON blob (pretty-printed, trailing newline) using the same download approach as Project Save.

### `initializeAiPackageExport({ button, reservationItemSchema })`

- Wire the button click to build the document from `getState()` and download it.
- Provide a status message pattern like `pdf-export.js` (a live-region status next to the button, e.g. `AI package exported <filename>.`).
- Guard: if required elements are missing, return a no-op cleanup.
- Return an unsubscribe/cleanup function.

## Accessibility

- Native `<button>` with visible focus state.
- Status feedback uses `role="status"` / `aria-live="polite"`.
- Button remains keyboard accessible.
- No color-only communication.

## Out of Scope

Settings, Local Storage, autosave, backend, cloud sync, AI Package import, PDF changes, drag-and-drop reorder, transition-enforcement of the official status workflow, and any change to Project Save/Open behavior.

## Testing

Verify:

- Document shape matches the spec (format, formatVersion, product, exportedAt, project keys, full sanitized items, context block).
- Sanitized items contain no out-of-schema keys and match the reservation item schema.
- `dayGroups` are grouped by day and sorted by `dayNumber` then `time`.
- `totals` (reservations/adults/children/guides/guests) match the real items.
- `statusCounts` match real statuses, with unknown status falling back to `pending`.
- Empty or null fields stay empty/null; no fake values are introduced.
- Filename format `JLOS_<tourCode>_AI_<date>.json`.
- Browser test: clicking `AI Package` downloads a valid JSON file, shows an exported status message, and the console stays clean.
- `node --check` passes on all modified/added JS modules.

## Documentation Updates

Update `Project_Management/ARCHITECTURE.md`, `Project_Management/DECISIONS.md`, `Project_Management/COMPONENT_LIBRARY.md`, `Project_Management/MASTER_INDEX.md`, `Project_Management/PROJECT_LOG.md`, `Project_Management/CHANGELOG.md`, and `Project_Management/SPRINT_DASHBOARD.md`. Update `CURRENT_STATE.md` and `checkpoints/CHECKPOINT_LATEST.md` after merge.

## Git Workflow

- Commit: `feat: implement ai package export`
- Push: `git push -u origin feature/task-011`
- Do not merge or create a Pull Request.
