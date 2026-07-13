# UX_GUIDELINES

## Core Principles

- Operator First
- One Screen = One Task
- Preview Current Item Only
- Show operational state without unnecessary navigation
- Use placeholders for missing values; never fabricate data

## Reservation Timeline

The Reservation Timeline is the primary navigation surface of the Restaurant Reservation Workspace.

1. Group items by day.
2. Sort items by time within each day.
3. Visually highlight the selected item.
4. Allow only one selected item at a time.
5. The selected item will eventually update Reservation Details and Output Preview.
6. Place new items in the correct day group and chronological position.
7. Show neutral placeholders for empty values.
8. Keep the Timeline compact and easy to scan.
9. Keep item status visible without opening the item.
10. Preserve grouping, status visibility, and single selection across desktop, tablet, and mobile.

## Status Communication

- Always pair status color with a text label.
- Use only the official statuses documented in `docs/architecture/RESERVATION_TIMELINE_MODEL.md`.
- Do not imply that a supplier action occurred until the operator records the corresponding status.

## Selected Item Context

- Reservation Details and Output Preview must resolve from the same selected Reservation Item.
- Output Preview displays only one reservation.
- Selection is workspace state, not duplicated Reservation Item data.

Detailed Timeline UX requirements are maintained in `docs/ux/RESERVATION_TIMELINE_UX.md`.
